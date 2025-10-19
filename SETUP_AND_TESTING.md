# Setup and Testing Guide for Collaborative Trip Planning Feature

## Prerequisites

Before testing the collaborative trip planning feature, ensure you have:

1. Node.js (v16 or higher) installed
2. MongoDB running locally or accessible via connection string
3. Proper environment variables configured in the Server/.env file

## Setup Instructions

### 1. Install Server Dependencies

Navigate to the Server directory and install dependencies:

```bash
cd Server
npm install
```

This will install all required packages including:
- socket.io (for WebSocket server)
- Other existing dependencies

### 2. Install Client Dependencies

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

This will install all required packages including:
- socket.io-client (for WebSocket client)
- Other existing dependencies

### 3. Environment Configuration

Ensure your Server/.env file contains the necessary variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_for_notifications
EMAIL_PASS=your_email_password
```

## Testing the Implementation

### 1. Start the Backend Server

```bash
cd Server
npm start
```

The server should start on http://localhost:5000 with WebSocket support.

### 2. Start the Frontend Development Server

```bash
cd client
npm run dev
```

The client should start on http://localhost:5173.

### 3. Test Collaboration Features

1. Open multiple browser windows or tabs to simulate multiple users
2. Create a trip using the AI Travel Planner
3. Enable collaboration mode for the trip
4. Copy the collaboration link and open it in another browser window
5. Both users should be able to:
   - See each other's cursors in real-time
   - See live updates to the trip itinerary
   - Communicate via the built-in chat
   - All changes should be automatically synchronized

## Troubleshooting

### Common Issues

1. **WebSocket Connection Errors**:
   - Ensure the backend server is running
   - Check that the WebSocket endpoint is accessible
   - Verify CORS settings in the server configuration

2. **Authentication Issues**:
   - Ensure JWT tokens are properly configured
   - Check that users are logged in before joining collaboration sessions

3. **Dependency Installation Issues**:
   - Delete node_modules folders and package-lock.json files
   - Run npm install again in both Server and client directories

### Verifying Socket.IO Installation

To verify that Socket.IO is properly installed, you can check the package.json files:

In Server/package.json, you should see:
```json
"dependencies": {
  "socket.io": "^4.7.5"
}
```

In client/package.json, you should see:
```json
"dependencies": {
  "socket.io-client": "^4.7.5"
}
```

## Architecture Overview

The collaborative trip planning feature uses the following architecture:

```
[Client] ←→ [Socket.IO Client] ←→ [Socket.IO Server] ←→ [REST API]
                                    ↑
                              [MongoDB]
```

### WebSocket Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `joinTripCollaboration` | Client → Server | Join a collaboration room |
| `userJoined` | Server → Client | Notify others of new collaborator |
| `userLeft` | Server → Client | Notify others of disconnected user |
| `cursorMove` | Client ↔ Server | Share cursor positions |
| `tripUpdate` | Client ↔ Server | Synchronize trip changes |
| `sendMessage` | Client → Server | Send chat messages |
| `newMessage` | Server → Client | Broadcast chat messages |

## Security Considerations

1. All WebSocket connections require valid JWT tokens for authentication
2. Users must be collaborators of a trip to access its collaboration session
3. All data updates are validated before persistence
4. API endpoints have rate limiting to prevent abuse

## Performance Optimizations

1. Cursor movements are throttled to prevent excessive events
2. Updates are only sent to relevant collaboration rooms
3. Proper cleanup of disconnected users and sessions
4. Efficient database queries for collaborative data