// File: src/server.js
const http = require('http');
const { app, initialize } = require('./app');
const config = require('./config/environment');
const { setupWebSocket } = require('./websocket');

const PORT = config.PORT;

async function start() {
  try {
    await initialize();
    
    const server = http.createServer(app);
    
    // Setup WebSocket
    setupWebSocket(server);
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${config.NODE_ENV}`);
      console.log(`🌐 API: http://localhost:${PORT}/api/v1`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();