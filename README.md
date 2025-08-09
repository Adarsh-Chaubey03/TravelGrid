
# TravelGrid [Live Demo](https://travel-grid.vercel.app/)

**Note**: This repository is dedicated to contributors of **GirlScript Summer of Code 2025 (GSSoC'25)**.

<pre>All task assignments and PR reviews will be done from 6:00 PM to 7:00 PM.</pre>

Welcome to **TravelGrid**, your all-in-one travel platform designed to streamline your travel planning experience! With TravelGrid, you can effortlessly book tickets, rent vehicles, reserve hotels, explore curated travel guides, and select customizable travel packages—all in one place. Whether you're a solo traveler or planning a group adventure, TravelGrid simplifies every step of your journey.

This project is proudly part of **GirlScript Summer of Code 2025 (GSSoC)**, and we invite enthusiastic contributors to collaborate in building a seamless, user-friendly travel solution.

---

## 📖 Table of Contents

- [TravelGrid Live Demo](#travelgrid-live-demo)
  - [📖 Table of Contents](#-table-of-contents)
  - [🌍 About the Project](#-about-the-project)
  - [✨ Features](#-features)
  - [🛠 Tech Stack](#-tech-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
      - [1. Clone the repository](#1-clone-the-repository)
      - [2. Install Frontend Dependencies](#2-install-frontend-dependencies)
      - [3. Install Backend Dependencies](#3-install-backend-dependencies)
    - [Running the Application](#running-the-application)
      - [Start the Backend Server](#start-the-backend-server)
      - [Start the Frontend (in a new terminal)](#start-the-frontend-in-a-new-terminal)
  - [🤝 Contributing to TravelGrid](#-contributing-to-travelgrid)
    - [Contribution Guidelines](#contribution-guidelines)
    - [Task Assignment Process](#task-assignment-process)
  - [📂 Project Structure](#-project-structure)
  - [📜 Code of Conduct](#-code-of-conduct)
  - [📄 License](#-license)

---

## 🌍 About the Project

**TravelGrid** is a comprehensive platform that simplifies travel planning. From booking flights, trains, or buses to renting vehicles, reserving hotels, or exploring expertly curated travel guides, TravelGrid offers a seamless and intuitive experience. Our mission is to make travel planning accessible, affordable, and enjoyable for everyone.

As a **GSSoC 2025** project, TravelGrid provides contributors with an opportunity to collaborate on a real-world application, honing their skills and building a meaningful product.

---

## ✨ Features

- **Travel Booking**: Book flights, trains, buses, and more with ease.
- **Vehicle Rentals**: Rent vehicles tailored to your travel needs.
- **Hotel Reservations**: Browse and book hotels based on your preferences.
- **Travel Guides**: Discover curated guides to plan your ideal trip.
- **Travel Packages**: Choose pre-designed packages or customize your own.
- **Travel Packing Checklist**: Comprehensive tool with 60+ default items, progress tracking, and export options (PDF, Excel, Text).
- **Trip Expense Calculator**: Calculate and track travel expenses with detailed breakdowns.
- **Travel Plan Generator**: AI-powered travel itinerary planning.
- **Responsive Design**: Consistent experience across desktops, tablets, and mobile devices.
- **Interactive UI**: Modern, user-friendly interface built with React, Tailwind CSS, and ShadCN.

---

## 🛠 Tech Stack

- **Frontend**:
  - React.js
  - Tailwind CSS
  - ShadCN (UI Component Library)
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
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

#### 1. Clone the repository
```bash
git clone https://github.com/Adarsh-Chaubey03/TravelGrid.git
cd TravelGrid
```

#### 2. Install Frontend Dependencies
```bash
cd client
npm install
```

#### 3. Install Backend Dependencies
```bash
cd Server
npm install
```

### Running the Application

#### Start the Backend Server
```bash
cd Server
npm start
# Server will run on http://localhost:5000
```

#### Start the Frontend (in a new terminal)
```bash
cd client
npm run dev
# Client will run on http://localhost:5173
```

---

## 🤝 Contributing to TravelGrid

We welcome **GSSoC 2025** contributors! Follow these guidelines for a smooth collaboration.

### Contribution Guidelines

- **Issues**: Pick an unassigned issue from the [Issues section](https://github.com/Adarsh-Chaubey03/TravelGrid/issues) or create a new one with a clear description. Wait for admin approval before starting.
- **Responsive Design**: Ensure all code is responsive across screen sizes using **Tailwind CSS**.
- **Code Quality**: Write clean, modular code in `src/components/`. Use **ESLint** and **Prettier**.
- **Pull Requests**: Address a specific issue, test thoroughly, and include a clear description. Buggy PRs will not be merged.
- **Communication**: Avoid unnecessary comments or complaints. For support, contact:
  - **GitHub**: [Adarsh-Chaubey03](https://github.com/Adarsh-Chaubey03)
  - **LinkedIn**: [Adarsh Chaubey](https://www.linkedin.com/in/adarsh-chaubey/)
- **Support Us**: Star the repo at [TravelGrid](https://github.com/Adarsh-Chaubey03/TravelGrid).

### Task Assignment Process

- Task assignments and PR reviews occur daily from **6:00 PM to 7:00 PM**.
- Ensure your contributions align with the assigned issue and follow the project’s coding standards.

---

## 📂 Project Structure

```plaintext
TravelGrid/
├── client/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── styles/            # Tailwind CSS and custom styles
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   ├── .gitignore             # Git ignore file
│   ├── package.json           # Project dependencies and scripts
│   ├── README.md              # Project documentation
│   ├── vite.config.js         # Vite configuration
├── server/
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── models/                # Data models
│   ├── routes/                # API routes
│   ├── index.js               # Backend entry point
│   ├── .env                   # Environment variables (not committed)
│   ├── README.md              # Backend documentation
├── .gitignore                 # Git ignore file
├── LICENSE                    # License file
├── README.md                  # Main project documentation
```

---

## 📜 Code of Conduct

Please refer to the [Code of Conduct](https://github.com/Adarsh-Chaubey03/TravelGrid?tab=coc-ov-file) for details on contributing guidelines and community standards.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
