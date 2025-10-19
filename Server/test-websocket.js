// test-websocket.js
// Simple test script to verify WebSocket server setup

import { createServer } from 'http';
import { Server } from 'socket.io';

// Create a basic HTTP server
const httpServer = createServer();

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

// Simple connection handler
io.on('connection', (socket) => {
  console.log('Test client connected');
  
  socket.on('testEvent', (data) => {
    console.log('Received test event:', data);
    socket.emit('testResponse', { message: 'Server received your message', data });
  });
  
  socket.on('disconnect', () => {
    console.log('Test client disconnected');
  });
});

// Start server on a different port for testing
const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Test WebSocket server running on port ${PORT}`);
});

// Keep the script running for 10 seconds then close
setTimeout(() => {
  console.log('Test completed, closing server');
  httpServer.close();
}, 10000);