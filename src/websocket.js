// websocket server setup for real-time updates and live tracking
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const config = require('./config/environment');
const CarbonCalculator = require('./services/geospatial/CarbonCalculator');
const AuctionService = require('./services/commerce/AuctionService');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });
  
  // Connection authentication
  wss.on('connection', async (ws, req) => {
    try {
      // Extract token from query
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get('token');
      
      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }
      
      const decoded = jwt.verify(token, config.JWT_SECRET);
      ws.userId = decoded.userId;
      
      console.log(`WebSocket connected: ${decoded.userId}`);
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          await handleMessage(ws, data);
        } catch (error) {
          ws.send(JSON.stringify({ error: error.message }));
        }
      });
      
      ws.on('close', () => {
        console.log(`WebSocket disconnected: ${ws.userId}`);
      });
      
      // Send initial connection success
      ws.send(JSON.stringify({ type: 'connected', userId: ws.userId }));
      
    } catch (error) {
      ws.close(1008, 'Invalid token');
    }
  });
  
  // Subscribe auction service to WebSocket broadcasts
  AuctionService.on('bid_placed', (data) => {
    broadcast(wss, {
      type: 'auction_update',
      auctionId: data.auctionId,
      currentPrice: data.amount,
      bidder: data.bidderId
    });
  });
  
  AuctionService.on('auction_ended', (data) => {
    broadcast(wss, {
      type: 'auction_ended',
      auctionId: data.auctionId,
      winner: data.winner
    });
  });
}

async function handleMessage(ws, data) {
  switch (data.type) {
    case 'live_tracking':
      await handleLiveTracking(ws, data);
      break;
      
    case 'subscribe_auction':
      ws.auctionId = data.auctionId;
      ws.send(JSON.stringify({ type: 'subscribed', auctionId: data.auctionId }));
      break;
      
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;
      
    default:
      ws.send(JSON.stringify({ error: 'Unknown message type' }));
  }
}

async function handleLiveTracking(ws, data) {
  const { points } = data;
  
  if (points.length < 2) return;
  
  // Calculate distance and emissions in real-time
  const distance = CarbonCalculator.calculatePathDistance(
    points.map(p => ({ lng: p.lng, lat: p.lat }))
  );
  
  const mode = await CarbonCalculator.detectTransportMode(points);
  const emissions = await CarbonCalculator.calculateTransportEmissions({
    mode,
    distance,
    passengers: 1
  });
  
  ws.send(JSON.stringify({
    type: 'tracking_update',
    distance: Math.round(distance * 100) / 100,
    mode,
    emissions: {
      co2: Math.round(emissions.co2 * 1000) / 1000,
      total: Math.round(emissions.totalCo2e * 1000) / 1000
    },
    timestamp: Date.now()
  }));
}

function broadcast(wss, message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      // Filter by auction subscription if applicable
      if (message.auctionId && client.auctionId !== message.auctionId) {
        return;
      }
      client.send(JSON.stringify(message));
    }
  });
}

module.exports = { setupWebSocket };