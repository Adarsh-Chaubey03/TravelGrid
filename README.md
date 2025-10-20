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

## 📖 Project Overview

TravelGrid is an open-source initiative proudly participating in **GirlScript Summer of Code (GSSoC) 2025**, one of India's premier open-source mentorship programs. 🌟 GSSoC nurtures aspiring developers by providing real-world project experience, expert guidance, and community collaboration opportunities.

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
## 🤖 AI-Powered Travel Companion

TravelGrid now features an **AI-Powered Travel Companion Chatbot** that helps users plan trips, find destinations, create itineraries, recommend music, and more! This intelligent assistant integrates with all existing platform features to provide a personalized travel planning experience.

### Key Features
- **Intelligent Conversational Interface**: Natural language processing for travel queries
- **Itinerary Creation**: Generate detailed travel itineraries based on user preferences
- **Package Recommendations**: Find travel packages matching user interests
- **Destination Discovery**: Provide information about places to visit
- **Music Recommendations**: Suggest travel playlists based on mood and destination
- **Budget Planning**: Assist with currency conversion and expense tracking

### Technical Details
For implementation details, see [AI_TRAVEL_COMPANION_IMPLEMENTATION.md](./AI_TRAVEL_COMPANION_IMPLEMENTATION.md)

## Code of Conduct

Refer to the [Code of Conduct](https://github.com/Adarsh-Chaubey03/TravelGrid/blob/main/CODE_OF_CONDUCT.md) for contributing guidelines and community standards.

## Contribution Guidelines

Detailed contribution guidelines are available in the [CONTRIBUTE.md](https://github.com/Adarsh-Chaubey03/TravelGrid/blob/main/CONTRIBUTE.md) file (coming soon).

---
## 🌟GSSoc 
![GSSoC Logo](https://github.com/dimpal-yadav/TravelGrid/blob/main/GirlScript-Summer-of-Code.png)
🌟 **Exciting News...**

🚀 This project is now an official part of GirlScript Summer of Code – GSSoC'25! 💃🎉💻 We're thrilled to welcome contributors from all over India and beyond to collaborate, build, and grow *TravelGrid!* Let's make learning and career development smarter – together! 🌟👨‍💻👩‍💻

👩‍💻 GSSoC is one of India's **largest 3-month-long open-source programs** that encourages developers of all levels to contribute to real-world projects 🌍 while learning, collaborating, and growing together. 🌱

🌈 With **mentorship, community support**, and **collaborative coding**, it's the perfect platform for developers to:

- ✨ Improve their skills
- 🤝 Contribute to impactful projects
- 🏆 Get recognized for their work
- 📜 Receive certificates and swag!

🎉 **I can't wait to welcome new contributors** from GSSoC 2025 to this TravelGrid project family! Let's build, learn, and grow together — one commit at a time. 🔥👨‍💻👩‍💻

## 🏆 **GSSoC 2025 Guidelines**

### 📋 **For Participants**
#### ✅ **Do's**
- ✅ **Read documentation** thoroughly before contributing
- ✅ **Follow code style** and project structure
- ✅ **Write descriptive** commit messages
- ✅ **Test your changes** before submitting PR
- ✅ **Be respectful** and collaborative
- ✅ **Ask questions** if you're unsure about anything
  
#### ❌ **Don'ts**
- ❌ **Don't spam** with multiple PRs for same issue
- ❌ **Don't copy code** without understanding
- ❌ **Don't make unnecessary** changes
- ❌ **Don't ignore** code review feedback
- ❌ **Don't forget** to update documentation when needed
  
### 🎯 **Contribution Levels**
| Level | Description | Points | Badge |
|-------|-------------|--------|-------|
| 🥉 **Beginner** | Fix typos, update docs, minor bug fixes | 3 | ![1](https://img.shields.io/badge/Level-1-green) |
| 🥈 **Intermediate** | Add features, improve UI/UX, performance | 7 | ![2](https://img.shields.io/badge/Level-2-blue) |
| 🥇 **Advanced** | Major features, architecture improvements | 10 | ![3](https://img.shields.io/badge/Level-3-red) |
---

## Contributors

View the full list of contributors on the [GitHub Contributors Graph](https://github.com/Adarsh-Chaubey03/TravelGrid/graphs/contributors).

## Suggestions & Feedback

Submit feedback, feature suggestions, or collaboration ideas by opening an issue or discussion on the [GitHub repository](https://github.com/Adarsh-Chaubey03/TravelGrid/issues).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Adarsh-Chaubey03/TravelGrid/blob/main/LICENSE) file for details.

## ✨ Contributors

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
If you find this project valuable, please star the repository on [GitHub](https://github.com/Adarsh-Chaubey03/TravelGrid) to support its development.
