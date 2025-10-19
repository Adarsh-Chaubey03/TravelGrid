// useCollaboration.js
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useCollaboration = (tripId, user) => {
  const [socket, setSocket] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [messages, setMessages] = useState([]);
  const [cursorPositions, setCursorPositions] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token'), // Get JWT token from localStorage
      },
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      
      // Join collaboration room
      if (tripId && user) {
        newSocket.emit('joinTripCollaboration', {
          tripId,
          userId: user._id,
          username: user.username,
        });
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      setError('Failed to connect to collaboration server');
      console.error('Socket connection error:', err);
    });

    // Collaboration events
    newSocket.on('usersList', (users) => {
      setCollaborators(users);
    });

    newSocket.on('userJoined', (user) => {
      setCollaborators((prev) => [...prev, user]);
    });

    newSocket.on('userLeft', (user) => {
      setCollaborators((prev) => prev.filter((u) => u.socketId !== user.socketId));
    });

    newSocket.on('userMoved', (data) => {
      setCursorPositions((prev) => ({
        ...prev,
        [data.socketId]: data.cursor,
      }));
    });

    newSocket.on('tripUpdated', (data) => {
      // Handle trip updates
      // This will be handled by the parent component
    });

    newSocket.on('newMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on('error', (data) => {
      setError(data.message);
    });

    // Clean up on unmount
    return () => {
      newSocket.close();
    };
  }, [tripId, user]);

  // Send cursor movement
  const sendCursorMove = (cursor) => {
    if (socketRef.current && socketRef.current.connected && tripId) {
      socketRef.current.emit('cursorMove', {
        tripId,
        cursor,
      });
    }
  };

  // Send trip updates
  const sendTripUpdate = (updates) => {
    if (socketRef.current && socketRef.current.connected && tripId && user) {
      socketRef.current.emit('tripUpdate', {
        tripId,
        updates,
        userId: user._id,
        username: user.username,
      });
    }
  };

  // Send chat message
  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.connected && tripId && user) {
      socketRef.current.emit('sendMessage', {
        tripId,
        message,
        userId: user._id,
        username: user.username,
      });
    }
  };

  return {
    isConnected,
    collaborators,
    messages,
    cursorPositions,
    error,
    sendCursorMove,
    sendTripUpdate,
    sendMessage,
  };
};

export default useCollaboration;