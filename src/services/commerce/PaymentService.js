// payment service for EcoNexus API - handles payment processing, order management, and integration with Stripe for carbon credit purchases
const stripe = require('stripe')(require('../../config/environment').STRIPE_SECRET_KEY);
const { pgPool } = require('../../config/database');
const { CarbonCredit } = require('../../models/mongodb');

class PaymentService {
  constructor() {
    this.webhookSecret = require('../../config/environment').STRIPE_WEBHOOK_SECRET;
  }

  // Create payment intent for carbon credit purchase
  async createPaymentIntent(orderData, buyerId) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(orderData.amount * 100), // Stripe uses cents
        currency: 'usd',
        metadata: {
          buyerId,
          creditIds: JSON.stringify(orderData.creditIds),
          quantity: orderData.quantity
        }
      });

      // Log order in PostgreSQL
      await pgPool.query(
        'INSERT INTO orders (buyer_id, amount, status, stripe_payment_intent_id) VALUES ($1, $2, $3, $4)',
        [buyerId, orderData.amount, 'pending', paymentIntent.id]
      );

      return paymentIntent;
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Process webhook for successful payment
  async processPaymentWebhook(event) {
    try {
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const { buyerId, creditIds } = paymentIntent.metadata;
        const creditsArray = JSON.parse(creditIds);

        // Update order status
        await pgPool.query(
          'UPDATE orders SET status = $1 WHERE stripe_payment_intent_id = $2',
          ['completed', paymentIntent.id]
        );

        // Transfer carbon credits to buyer
        await this.transferCredits(buyerId, creditsArray);

        return { success: true, paymentIntentId: paymentIntent.id };
      }
    } catch (error) {
      console.error('Webhook processing failed:', error);
      throw new Error('Failed to process webhook');
    }
  }

  // Transfer carbon credits to buyer
  async transferCredits(buyerId, creditIds) {
    try {
      for (const creditId of creditIds) {
        await CarbonCredit.findByIdAndUpdate(
          creditId,
          { owner: buyerId, status: 'transferred' },
          { new: true }
        );
      }
      return true;
    } catch (error) {
      console.error('Credit transfer failed:', error);
      throw new Error('Failed to transfer credits');
    }
  }

  // Get order history for buyer
  async getOrderHistory(buyerId) {
    try {
      const result = await pgPool.query(
        'SELECT * FROM orders WHERE buyer_id = $1 ORDER BY created_at DESC',
        [buyerId]
      );
      return result.rows;
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      throw new Error('Failed to retrieve order history');
    }
  }

  // Refund payment
  async refundPayment(paymentIntentId, reason) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        reason
      });

      // Update order status
      await pgPool.query(
        'UPDATE orders SET status = $1 WHERE stripe_payment_intent_id = $2',
        ['refunded', paymentIntentId]
      );

      return refund;
    } catch (error) {
      console.error('Refund failed:', error);
      throw new Error('Failed to process refund');
    }
  }
}

module.exports = PaymentService;