// AuctionService.js - Handles auction creation, bidding, and finalization logic
import { pgPool } from '../../config/database.js';
import { CarbonCredit } from '../../models/mongodb/index.js';
import EventEmitter from 'events';

class AuctionService extends EventEmitter {
  constructor() {
    super();
    this.activeAuctions = new Map(); // In-memory tracking for real-time updates
  }

  // Create new auction
  async createAuction(sellerId, creditId, auctionData) {
    const { type, startingPrice, reservePrice, quantity, duration, minIncrement } = auctionData;

    const credit = await CarbonCredit.findById(creditId);
    if (!credit || credit.project.developer.toString() !== sellerId.toString()) {
      throw new Error('Unauthorized or invalid credit');
    }

    if (credit.quantification.available < quantity) {
      throw new Error('Insufficient credit quantity');
    }

    const endTime = new Date(Date.now() + duration * 60 * 60 * 1000); // hours to ms

    const result = await pgPool.query(
      `INSERT INTO auctions (product_id, seller_id, auction_type, starting_price, reserve_price, 
       current_price, min_increment, quantity, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10) RETURNING *`,
      [creditId, sellerId, type, startingPrice, reservePrice, startingPrice, minIncrement || 1.00, quantity, endTime, 'active']
    );

    const auction = result.rows[0];
    
    // Reserve the credits
    credit.quantification.available -= quantity;
    credit.status = 'listed';
    await credit.save();

    // Schedule auction end
    this.scheduleAuctionEnd(auction.id, endTime);

    this.emit('auction_created', auction);
    return auction;
  }

  // Place bid
  async placeBid(auctionId, bidderId, amount, quantity = 1, autoBidMax = null) {
    const client = await pgPool.connect();
    
    try {
      await client.query('BEGIN');

      // Lock auction row
      const auctionResult = await client.query(
        'SELECT * FROM auctions WHERE id = $1 FOR UPDATE',
        [auctionId]
      );

      if (auctionResult.rows.length === 0) {
        throw new Error('Auction not found');
      }

      const auction = auctionResult.rows[0];

      if (auction.status !== 'active') {
        throw new Error('Auction not active');
      }

      if (new Date() > new Date(auction.end_time)) {
        throw new Error('Auction has ended');
      }

      if (amount < auction.current_price + auction.min_increment) {
        throw new Error(`Bid must be at least ${auction.current_price + auction.min_increment}`);
      }

      if (quantity > auction.quantity) {
        throw new Error('Bid quantity exceeds available amount');
      }

      // For Dutch auctions, price decreases so logic differs
      if (auction.auction_type === 'dutch') {
        if (amount < auction.current_price) {
          throw new Error('Dutch auction bid must meet current price');
        }
        // Immediate win
        await this.handleDutchWin(client, auction, bidderId, amount, quantity);
      } else {
        // English auction - just record bid
        await client.query(
          `INSERT INTO bids (auction_id, bidder_id, amount, quantity, is_winning, auto_bid_max, placed_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [auctionId, bidderId, amount, quantity, true, autoBidMax]
        );

        // Update auction current price
        await client.query(
          'UPDATE auctions SET current_price = $1 WHERE id = $2',
          [amount, auctionId]
        );

        // Handle auto-bids
        if (autoBidMax) {
          await this.processAutoBids(client, auctionId, bidderId, autoBidMax);
        }
      }

      await client.query('COMMIT');

      this.emit('bid_placed', { auctionId, bidderId, amount, quantity });
      
      return { success: true, currentPrice: amount };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async processAutoBids(client, auctionId, currentBidderId, currentMax) {
    // Get other auto-bids
    const autoBids = await client.query(
      `SELECT * FROM bids WHERE auction_id = $1 AND bidder_id != $2 AND auto_bid_max > $3
       ORDER BY auto_bid_max DESC`,
      [auctionId, currentBidderId, currentMax]
    );

    for (const bid of autoBids.rows) {
      const minRequired = currentMax + 1; // Assuming $1 increment
      if (bid.auto_bid_max >= minRequired) {
        // Place counter-bid
        await client.query(
          `INSERT INTO bids (auction_id, bidder_id, amount, quantity, is_winning, placed_at)
           VALUES ($1, $2, $3, $4, true, NOW())`,
          [auctionId, bid.bidder_id, minRequired, bid.quantity]
        );
        
        currentMax = minRequired;
      }
    }
  }

  async handleDutchWin(client, auction, bidderId, amount, quantity) {
    // Dutch auction - first acceptable bid wins
    await client.query(
      'UPDATE auctions SET status = $1, winner_id = $2, winning_bid = $3 WHERE id = $4',
      ['ended', bidderId, amount, auction.id]
    );

    await client.query(
      `INSERT INTO bids (auction_id, bidder_id, amount, quantity, is_winning, placed_at)
       VALUES ($1, $2, $3, $4, true, NOW())`,
      [auction.id, bidderId, amount, quantity]
    );

    // Create order
    await client.query(
      `INSERT INTO orders (order_number, buyer_id, seller_id, total_amount, currency, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        `AUC-${Date.now()}`,
        bidderId,
        auction.seller_id,
        amount * quantity,
        'USD',
        'confirmed'
      ]
    );
  }

  scheduleAuctionEnd(auctionId, endTime) {
    const delay = endTime.getTime() - Date.now();
    
    setTimeout(async () => {
      await this.finalizeAuction(auctionId);
    }, Math.min(delay, 2147483647)); // Max setTimeout
  }

  async finalizeAuction(auctionId) {
    const client = await pgPool.connect();
    
    try {
      await client.query('BEGIN');

      const auctionResult = await client.query(
        'SELECT * FROM auctions WHERE id = $1',
        [auctionId]
      );

      const auction = auctionResult.rows[0];
      if (auction.status !== 'active') return;

      // Get winning bid
      const winningBidResult = await client.query(
        'SELECT * FROM bids WHERE auction_id = $1 AND is_winning = true ORDER BY amount DESC LIMIT 1',
        [auctionId]
      );

      if (winningBidResult.rows.length === 0 || 
          (auction.reserve_price && winningBidResult.rows[0].amount < auction.reserve_price)) {
        // No sale - reserve not met or no bids
        await client.query(
          "UPDATE auctions SET status = 'ended_no_sale' WHERE id = $1",
          [auctionId]
        );
        
        // Return credits to available pool
        const credit = await CarbonCredit.findById(auction.product_id);
        credit.quantification.available += auction.quantity;
        credit.status = 'draft';
        await credit.save();
      } else {
        const winningBid = winningBidResult.rows[0];
        
        await client.query(
          'UPDATE auctions SET status = $1, winner_id = $2, winning_bid = $3 WHERE id = $4',
          ['ended', winningBid.bidder_id, winningBid.amount, auctionId]
        );

        // Create order for winner
        const orderResult = await client.query(
          `INSERT INTO orders (order_number, buyer_id, seller_id, total_amount, currency, status)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [
            `AUC-${Date.now()}`,
            winningBid.bidder_id,
            auction.seller_id,
            winningBid.amount * winningBid.quantity,
            'USD',
            'pending_payment'
          ]
        );

        // Create payment intent
        // ... payment logic similar to PaymentService
      }

      await client.query('COMMIT');
      this.emit('auction_ended', { auctionId, winner: winningBidResult.rows[0] });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Auction finalization failed:', error);
    } finally {
      client.release();
    }
  }

  // Get auction status with real-time updates
  async getAuctionStatus(auctionId) {
    const result = await pgPool.query(
      `SELECT a.*, 
        (SELECT json_agg(b.*) FROM bids b WHERE b.auction_id = a.id ORDER BY b.amount DESC) as bids,
        (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) as bid_count
       FROM auctions a WHERE a.id = $1`,
      [auctionId]
    );

    return result.rows[0];
  }

  // List active auctions with filters
  async listAuctions(filters = {}) {
    let query = `
      SELECT a.*, p.name as product_name, p.project_type 
      FROM auctions a
      JOIN products p ON a.product_id = p.id::text
      WHERE a.status = 'active'
    `;
    
    const params = [];
    let paramCount = 0;

    if (filters.projectType) {
      paramCount++;
      query += ` AND p.project_type = $${paramCount}`;
      params.push(filters.projectType);
    }

    if (filters.minPrice) {
      paramCount++;
      query += ` AND a.current_price >= $${paramCount}`;
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      paramCount++;
      query += ` AND a.current_price <= $${paramCount}`;
      params.push(filters.maxPrice);
    }

    query += ' ORDER BY a.end_time ASC';

    const result = await pgPool.query(query, params);
    return result.rows;
  }
}

export default new AuctionService();