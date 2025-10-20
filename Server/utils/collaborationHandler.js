import { Trip } from '../models/trips.js';

// Store active collaboration sessions in memory
// In a production environment, you would use Redis or a similar solution
const collaborationSessions = new Map();

export const collaborationHandler = (io) => {
  // Handle socket connections
  io.on('connection', (socket) => {
    console.log('User connected for collaboration:', socket.id);
    
    // Join a trip collaboration room
    socket.on('joinTripCollaboration', async (data) => {
      try {
        const { tripId, userId, username } = data;
        
        // Verify the user has access to this trip
        const trip = await Trip.findById(tripId);
        if (!trip) {
          return socket.emit('error', { message: 'Trip not found' });
        }
        
        // Check if user is a collaborator
        const isCollaborator = trip.collaborators.some(
          collaborator => collaborator.userId.toString() === userId.toString()
        );
        
        if (!isCollaborator && trip.userId.toString() !== userId.toString()) {
          return socket.emit('error', { message: 'Not authorized to access this trip' });
        }
        
        // Join the room for this trip
        socket.join(`trip-${tripId}`);
        
        // Initialize session if it doesn't exist
        if (!collaborationSessions.has(tripId)) {
          collaborationSessions.set(tripId, {
            users: new Map(),
            tripData: trip
          });
        }
        
        // Add user to session
        collaborationSessions.get(tripId).users.set(socket.id, {
          userId,
          username,
          cursor: { x: 0, y: 0 }
        });
        
        // Notify others in the room about the new user
        socket.to(`trip-${tripId}`).emit('userJoined', {
          userId,
          username,
          socketId: socket.id
        });
        
        // Send current users list to the new user
        const users = Array.from(collaborationSessions.get(tripId).users.values());
        socket.emit('usersList', users);
        
        // Send current trip data to the new user
        socket.emit('tripData', trip);
      } catch (error) {
        console.error('Error joining trip collaboration:', error);
        socket.emit('error', { message: 'Failed to join collaboration session' });
      }
    });
    
    // Handle cursor movement
    socket.on('cursorMove', (data) => {
      const { tripId, cursor } = data;
      const session = collaborationSessions.get(tripId);
      
      if (session && session.users.has(socket.id)) {
        // Update user's cursor position
        session.users.get(socket.id).cursor = cursor;
        
        // Broadcast cursor position to others in the room
        socket.to(`trip-${tripId}`).emit('userMoved', {
          socketId: socket.id,
          cursor
        });
      }
    });
    
    // Handle trip updates
    socket.on('tripUpdate', async (data) => {
      try {
        const { tripId, updates, userId, username } = data;
        
        // Update trip in database
        const updatedTrip = await Trip.findByIdAndUpdate(
          tripId,
          { ...updates },
          { new: true }
        );
        
        // Broadcast updates to others in the room
        socket.to(`trip-${tripId}`).emit('tripUpdated', {
          updates,
          userId,
          username,
          timestamp: new Date()
        });
        
        // Update session data
        const session = collaborationSessions.get(tripId);
        if (session) {
          session.tripData = updatedTrip;
        }
      } catch (error) {
        console.error('Error updating trip:', error);
        socket.emit('error', { message: 'Failed to update trip' });
      }
    });
    
    // Handle chat messages
    socket.on('sendMessage', (data) => {
      const { tripId, message, userId, username } = data;
      
      // Broadcast message to others in the room
      socket.to(`trip-${tripId}`).emit('newMessage', {
        message,
        userId,
        username,
        timestamp: new Date()
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected from collaboration:', socket.id);
      
      // Remove user from all sessions
      collaborationSessions.forEach((session, tripId) => {
        if (session.users.has(socket.id)) {
          const user = session.users.get(socket.id);
          session.users.delete(socket.id);
          
          // Notify others in the room about the user leaving
          socket.to(`trip-${tripId}`).emit('userLeft', {
            userId: user.userId,
            username: user.username,
            socketId: socket.id
          });
        }
      });
    });
  });
};

export default collaborationHandler;