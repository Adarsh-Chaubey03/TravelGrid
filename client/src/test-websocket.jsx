// test-websocket.jsx
// Simple test component to verify WebSocket client connection

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const WebSocketTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io('http://localhost:5000');
    
    newSocket.on('connect', () => {
      setConnectionStatus('connected');
      setMessages(prev => [...prev, 'Connected to WebSocket server']);
    });
    
    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      setMessages(prev => [...prev, 'Disconnected from WebSocket server']);
    });
    
    newSocket.on('connect_error', (error) => {
      setConnectionStatus('error');
      setMessages(prev => [...prev, `Connection error: ${error.message}`]);
    });
    
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.connected) {
      socket.emit('testEvent', { message: 'Hello from client', timestamp: new Date() });
      setMessages(prev => [...prev, 'Sent test message to server']);
    } else {
      setMessages(prev => [...prev, 'Not connected to server']);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>WebSocket Connection Test</h1>
      <div>
        <p>Status: <strong style={{ color: connectionStatus === 'connected' ? 'green' : connectionStatus === 'error' ? 'red' : 'orange' }}>
          {connectionStatus}
        </strong></p>
      </div>
      <button 
        onClick={sendMessage}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Send Test Message
      </button>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'auto' }}>
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <p key={index} style={{ margin: '5px 0', padding: '5px', backgroundColor: '#f5f5f5' }}>
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};

export default WebSocketTest;