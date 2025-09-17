# 🌍 TravelGrid

[🚀 Live Demo](https://travel-grid.vercel.app/) | [📂 GitHub Repository](https://github.com/Adarsh-Chaubey03/TravelGrid)

**TravelGrid** is a comprehensive, user-friendly travel platform that empowers users to effortlessly plan and book their entire trip in one place. From booking ✈️ flights and renting 🚗 vehicles to reserving 🏨 hotels and exploring detailed 📚 travel guides, TravelGrid offers customizable travel packages tailored to individual preferences—making travel planning seamless and enjoyable.

---

## 📖 Project Overview

TravelGrid is an open-source initiative proudly participating in **GirlScript Summer of Code (GSSoC) 2025**, one of India’s premier open-source mentorship programs. 🌟 GSSoC nurtures aspiring developers by providing real-world project experience, expert guidance, and community collaboration opportunities.

By contributing to TravelGrid, developers can:

- 🚀 Enhance their development skills with hands-on experience
- 🤝 Collaborate with a vibrant, supportive community
- 🌟 Make meaningful impacts on a project designed to simplify and elevate the travel experience for users worldwide

---

### Project Insights

| Stars | Forks | Issues | Open PRs | Closed PRs | Languages | Contributors |
|-------|-------|--------|----------|------------|-----------|--------------|
| ![Stars](https://img.shields.io/github/stars/Adarsh-Chaubey03/TravelGrid?style=flat&logo=github) | ![Forks](https://img.shields.io/github/forks/Adarsh-Chaubey03/TravelGrid?style=flat&logo=github) | ![Issues](https://img.shields.io/github/issues/Adarsh-Chaubey03/TravelGrid?style=flat&logo=github) | ![Open PRs](https://img.shields.io/github/issues-pr/Adarsh-Chaubey03/TravelGrid?style=flat&logo=github) | ![Closed PRs](https://img.shields.io/github/issues-pr-closed/Adarsh-Chaubey03/TravelGrid?style=flat&color=critical&logo=github) | ![Languages](https://img.shields.io/github/languages/count/Adarsh-Chaubey03/TravelGrid?style=flat&color=green&logo=github) | ![Contributors](https://img.shields.io/github/contributors/Adarsh-Chaubey03/TravelGrid?style=flat&color=blue&logo=github) |

## Getting Started

Follow these steps to set up **TravelGrid** locally and contribute to the project.

### 🛠️ Prerequisites

Before getting started, make sure you have the following installed on your system:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- Code editor (VS Code recommended)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Adarsh-Chaubey03/TravelGrid.git
   cd TravelGrid
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd client
   npm install
   ```

   > **Note**: If you encounter npm WARN deprecated or peer dependency errors, run:
   > ```bash
   > npm install --legacy-peer-deps
   > ```

3. **Install Backend Dependencies**

   ```bash
   cd ../server
   npm install
   ```

   > **Note**: Ensure you are in the `server` folder. If you encounter an `ENOENT: no such file or directory` error, verify the folder structure.

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd server
   npm start
   ```

   The server will run on `http://localhost:5000`.

2. **Start the Frontend**

   In a new terminal:

   ```bash
   cd client
   npm run dev
   ```

   The client will run on `http://localhost:5173`.

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm ERR! enoent` | Verify you are in the correct folder (`client` or `server`) before running `npm install`. |
| Port already in use | Stop other applications using the port or modify the port in `vite.config.js` or the backend server configuration. |
| Dependency errors | Run `npm install --legacy-peer-deps` for the frontend. |
| Server not starting | Ensure the `.env` file contains the correct MongoDB URI and port settings. |

## Contributing to TravelGrid

We welcome contributions to enhance TravelGrid. Follow these guidelines:

1. **Pick an Issue**: Select an unassigned issue from the repository or create a new one. Wait for admin approval before starting.
2. **Responsive Design**: Use Tailwind CSS to ensure responsive designs.
3. **Code Quality**: Write clean, modular code in the `src/components/` directory. Adhere to ESLint and Prettier standards.
4. **Pull Requests**: Address a specific issue, test thoroughly, and provide a clear PR description. Buggy PRs will not be merged.
5. **Communication**: Contact the project admin via:
   - **GitHub**: [Adarsh-Chaubey03](https://github.com/Adarsh-Chaubey03)
   - **LinkedIn**: [Adarsh Chaubey](https://www.linkedin.com/in/adarsh-chaubey/)

6. **Task Assignment**: Task assignments and PR reviews are conducted daily from 6:00 PM to 7:00 PM IST.

## Project Structure

```bash
TravelGrid/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── .env
│   ├── README.md
├── .gitignore
├── LICENSE
├── README.md
```

## Code of Conduct

Refer to the [Code of Conduct](https://github.com/Adarsh-Chaubey03/TravelGrid/blob/main/CODE_OF_CONDUCT.md) for contributing guidelines and community standards.

## Contribution Guidelines

Detailed contribution guidelines are available in the [CONTRIBUTE.md](https://github.com/Adarsh-Chaubey03/TravelGrid/blob/main/CONTRIBUTE.md) file (coming soon).

## Contributors

View the full list of contributors on the [GitHub Contributors Graph](https://github.com/Adarsh-Chaubey03/TravelGrid/graphs/contributors).

## Suggestions & Feedback

Submit feedback, feature suggestions, or collaboration ideas by opening an issue or discussion on the [GitHub repository](https://github.com/Adarsh-Chaubey03/TravelGrid/issues).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Adarsh-Chaubey03/TravelGrid/blob/main/LICENSE) file for details.

## Project Admin

| Name | Profile |
|------|---------|
| Adarsh Chaubey | [GitHub](https://github.com/Adarsh-Chaubey03) \| [LinkedIn](https://www.linkedin.com/in/adarsh-chaubey/) |

## Support

If you find this project valuable, please star the repository on [GitHub](https://github.com/Adarsh-Chaubey03/TravelGrid) to support its development.

