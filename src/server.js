// File: src/server.js
import http from 'http';
import { app, initialize } from './app.js';
import config from './config/environment.js';
import { setupWebSocket } from './websocket.js';

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