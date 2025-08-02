**Note**: This repository is dedicated to contributors of **GirlScript Summer of Code 2025 (GSSoC'25)**.

<pre>All the tasks assignment and PR review will be done from 6pm to 8pm.</pre>
# TravelGrid [Live Demo](https://travel-grid.vercel.app/)

Welcome to **TravelGrid**, your all-in-one travel platform designed to streamline your travel planning experience! With TravelGrid, you can effortlessly book tickets, rent vehicles, reserve hotels, explore curated travel guides, and select customizable travel packages—all in one place. Whether you're a solo traveler or planning a group adventure, TravelGrid simplifies every step of your journey.

This project is proudly part of **GirlScript Summer of Code 2025 (GSSoC)**, and we invite enthusiastic contributors to collaborate in building a seamless, user-friendly travel solution.

---

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Contributing to TravelGrid](#contributing-to-travelgrid)
  - [Contribution Guidelines](#contribution-guidelines)
  - [Task Assignment Process](#task-assignment-process)
- [Project Structure](#project-structure)
- [Code of Conduct](#code-of-conduct)

---

## 🌍 About the Project

**TravelGrid** is a comprehensive platform that simplifies travel planning. From booking flights, trains, or buses to renting vehicles, reserving hotels, or exploring expertly curated travel guides, TravelGrid offers a seamless and intuitive experience. Our mission is to make travel planning accessible, affordable, and enjoyable for everyone.

As a **GSSoC 2025** project, TravelGrid provides contributors with an opportunity to collaborate on a real-world application, honing their skills and building a meaningful product.

---

## ✨ Features

- **Travel Booking**: Easily book flights, trains, buses, and more.
- **Vehicle Rentals**: Rent or hire vehicles tailored to your travel needs.
- **Hotel Reservations**: Browse and book hotels based on your preferences.
- **Travel Guides**: Discover curated guides to plan your ideal trip.
- **Travel Packages**: Choose pre-designed packages or customize your own.
- **Travel Packing Checklist**: Comprehensive packing tool with 60+ default items, progress tracking, and export options (PDF, Excel, Text).
- **Trip Expense Calculator**: Calculate and track travel expenses with detailed breakdowns.
- **Travel Plan Generator**: AI-powered travel itinerary planning.
- **Responsive Design**: Enjoy a consistent experience across desktops, tablets, and mobile devices.
- **Interactive UI**: A modern, user-friendly interface built with React, Tailwind CSS, and ShadCN.

---

## 🛠 Tech Stack

- **Frontend**:
  - React.js
  - Tailwind CSS
  - ShadCN (UI Component Library)
- **Backend** :
# Clone the repository
git clone https://github.com/Adarsh-Chaubey03/TravelGrid.git
cd TravelGrid/server

# Install backend dependencies
npm install

# Create .env file
touch .env

- **Tools & Platforms**:
  - Git & GitHub for version control
  - Vite (Build tool for faster development)
  - ESLint & Prettier for code quality

---

## 🚀 Getting Started

Follow these steps to set up **TravelGrid** locally and begin contributing.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- A code editor (e.g., **VS Code**)

### Installation

1. **Fork the Repository**: Click the "Fork" button at the top-right of the TravelGrid repository.

2. **Clone the Repository**:

   ```bash
   git clone https://github.com/Adarsh-Chaubey03/TravelGrid.git
   cd TravelGrid
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

4. **Start the Development Server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Visit `http://localhost:5173` in your browser to view the application.

---

## 🤝 Contributing to TravelGrid

We welcome **GSSoC 2025** contributors! Follow these guidelines for a smooth collaboration.

- **Issues**: Pick an unassigned issue from the [Issues section](https://github.com/Adarsh-Chaubey03/TravelGrid/issues) or create a new one with a clear description. Wait for admin approval before starting.
- **Responsive Design**: Ensure all code is responsive across screen sizes using **Tailwind CSS**.
- **Code Quality**: Write clean, modular code in `src/components/`. Use **ESLint** and **Prettier**.
- **Pull Requests**: Address a specific issue, test thoroughly, and include a clear description. Buggy PRs will not be merged.
- **Task & PR Review**: Assignments and reviews happen daily from **6:00 PM to 7:00 PM**.
- **Communication**: Avoid unnecessary comments or complaints. For support, contact:
  - **GitHub**: [Adarsh-Chaubey03](https://github.com/Adarsh-Chaubey03)
  - **LinkedIn**: [Adarsh Chaubey](https://www.linkedin.com/in/adarsh-chaubey/)
- **Support Us**: Star the repo at [TravelGrid](https://github.com/Adarsh-Chaubey03/TravelGrid).

---

## 📂 Project Structure

```plaintext
TravelGrid/client/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable React components
│   ├── pages/             # Page components
│   ├── styles/            # Tailwind CSS and custom styles
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies and scripts
├── README.md              # Project documentation
├── vite.config.js         # Vite configuration
├── server/              # Backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── .env             # Not committed
│   └── README.md
```

## Code of Conduct

Please refer to the [Code of Conduct](https://github.com/Adarsh-Chaubey03/TravelGrid?tab=coc-ov-file) for details on contributing guidelines and community standards.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

We welcome and encourage contributions from the community to help improve VehiGo. Whether you wish to report a bug, suggest a new feature, or submit a pull request, your input is highly valued and appreciated.

Before contributing, please take a moment to review our [Contributing Guidelines](CONTRIBUTING.md). These guidelines outline the process for submitting issues and pull requests, as well as the standards we strive to maintain for code quality and collaboration.by contributing to VehiGo, you help us build a better, more robust platform for everyone. Thank you for your interest and support!
