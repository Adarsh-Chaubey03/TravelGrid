# TravelGrid 🌍✈️

Welcome to **TravelGrid**, an open-source travel planning platform developed as part of GirlScript Summer of Code (GSSoC) 2025. Our platform enables users to plan and book trips including flights, hotels, vehicles, and travel guides. We feature customizable travel packages and an AI-powered travel companion chatbot for personalized trip planning, itinerary creation, music recommendations, and budget tracking.

## 🚀 Features

### 🤖 AI Travel Companion
- Natural language chatbot for trip planning
- Itinerary generation with personalized recommendations
- Destination discovery with real-time information
- Music and budget recommendations

### 📅 Trip Planning & Booking
- Flight, hotel, vehicle, and package bookings
- Customizable travel packages
- Interactive maps with route planning

### 👥 Social & Community Features
- Forum posts and reviews
- Saved items and personalized profiles
- **Real-time Collaborative Trip Planning** (NEW!)

### 🛠️ Travel Tools
- Currency converter with wallet functionality
- Language translation
- Search functionality across destinations
- Packing checklist and expense calculator

### 🎨 Personalization
- Mood board creation with image uploads
- Music playlist integration (Spotify)
- Customizable themes and preferences

## 🌟 New Feature: Real-time Collaborative Trip Planning

We've implemented real-time collaborative trip planning with WebSocket integration, allowing multiple users to simultaneously work on the same trip itinerary. This feature includes:

- Real-time synchronization of trip changes
- Cursor tracking showing collaborators' positions
- In-app chat for team communication
- Role-based access control
- Shareable collaboration links

For detailed technical implementation, see [COLLABORATIVE_TRIP_PLANNING.md](COLLABORATIVE_TRIP_PLANNING.md).

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS for styling
- Socket.IO Client for real-time communication

### Backend
- Node.js with Express
- MongoDB for data storage
- Socket.IO for WebSocket communication

### Additional Libraries
- Leaflet Routing Machine for maps
- react-countup for animations
- @emailjs/browser for email services
- world-countries for country data

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- npm/yarn
- MongoDB

### Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Adarsh-Chaubey03/TravelGrid.git
   ```

2. Install server dependencies:
   ```bash
   cd Server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables
Create a `.env` file in the Server directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## ▶️ Running the Application

### Start the Backend Server
```bash
cd Server
npm start
```

### Start the Frontend Development Server
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🤝 Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Developed as part of GirlScript Summer of Code (GSSoC) 2025
- Thanks to all contributors and maintainers
