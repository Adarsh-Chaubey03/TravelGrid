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

### 🛠️ Troubleshooting

| Issue                         | Solution                                                                                          |
|-------------------------------|-------------------------------------------------------------------------------------------------|
| ❌ `npm ERR! enoent`           | Make sure you're in the correct folder (`client` or `server`) before running `npm install`.     |
| ⚠️ Port already in use         | Close other applications using the port or change the port number in `vite.config.js` or backend server config. |
| 📦 Dependency errors           | Run `npm install --legacy-peer-deps` in the frontend directory to resolve peer dependency conflicts. |
| 🚫 Server not starting         | Verify your `.env` file has the correct MongoDB URI and port configurations.                     |


## 🤝 Contributing to TravelGrid

We warmly welcome contributions to make **TravelGrid** even better! To maintain quality and collaboration, please follow these guidelines:

1. **🔍 Pick an Issue**  
   Choose an unassigned issue from the repository or propose a new one. Please wait for admin approval before you start working.

2. **📱 Responsive Design**  
   Use **Tailwind CSS** to ensure all components are fully responsive across devices.

3. **🧹 Code Quality**  
   Write clean, modular, and reusable code inside the `src/components/` directory. Make sure your code adheres to our **ESLint** and **Prettier** formatting standards.

4. **📤 Pull Requests (PRs)**  
   - Work on a specific issue.  
   - Test your changes thoroughly.  
   - Provide a clear, descriptive PR message explaining your changes.  
   - PRs with bugs or incomplete features will not be merged.

5. **💬 Communication**  
   Have questions or need help? Reach out to the project admin:  
   - **GitHub**: [Adarsh-Chaubey03](https://github.com/Adarsh-Chaubey03)  
   - **LinkedIn**: [Adarsh Chaubey](https://www.linkedin.com/in/adarsh-chaubey/)

Thank you for contributing and helping build an amazing travel platform! 🚀


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

---
## 🌟GSSoc 
![GSSoC Logo](https://github.com/dimpal-yadav/TravelGrid/blob/main/GirlScript-Summer-of-Code.png)
🌟 **Exciting News...**

🚀 This project is now an official part of GirlScript Summer of Code – GSSoC'25! 💃🎉💻 We're thrilled to welcome contributors from all over India and beyond to collaborate, build, and grow *TravelGrid!* Let’s make learning and career development smarter – together! 🌟👨‍💻👩‍💻

👩‍💻 GSSoC is one of India’s **largest 3-month-long open-source programs** that encourages developers of all levels to contribute to real-world projects 🌍 while learning, collaborating, and growing together. 🌱

🌈 With **mentorship, community support**, and **collaborative coding**, it's the perfect platform for developers to:

- ✨ Improve their skills
- 🤝 Contribute to impactful projects
- 🏆 Get recognized for their work
- 📜 Receive certificates and swag!

🎉 **I can’t wait to welcome new contributors** from GSSoC 2025 to this TravelGrid project family! Let's build, learn, and grow together — one commit at a time. 🔥👨‍💻👩‍💻

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
| 🥉 **Beginner** | Fix typos, update docs, minor bug fixes | 5-10 | ![Beginner](https://img.shields.io/badge/Level-Beginner-green) |
| 🥈 **Intermediate** | Add features, improve UI/UX, performance | 15-25 | ![Intermediate](https://img.shields.io/badge/Level-Intermediate-blue) |
| 🥇 **Advanced** | Major features, architecture improvements | 30-50 | ![Advanced](https://img.shields.io/badge/Level-Advanced-red) |
---

## Contributors

View the full list of contributors on the [GitHub Contributors Graph](https://github.com/Adarsh-Chaubey03/TravelGrid/graphs/contributors).

## Suggestions & Feedback

Submit feedback, feature suggestions, or collaboration ideas by opening an issue or discussion on the [GitHub repository](https://github.com/Adarsh-Chaubey03/TravelGrid/issues).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Adarsh-Chaubey03/TravelGrid/blob/main/LICENSE) file for details.

## ✨ Contributors

#### Thanks to all the wonderful contributors 💖
[![Contributors](https://contrib.rocks/image?repo=Adarsh-Chaubey03/TravelGrid)](https://github.com/Adarsh-Chaubey03/TravelGrid/graphs/contributors)


## 👤 Project Admin

| Name           | Profile                                                                                   |
|----------------|-------------------------------------------------------------------------------------------|
| Adarsh Chaubey | [🔗 GitHub](https://github.com/Adarsh-Chaubey03) \| [🔗 LinkedIn](https://www.linkedin.com/in/adarsh-chaubey/) |

## Support

If you find this project valuable, please star the repository on [GitHub](https://github.com/Adarsh-Chaubey03/TravelGrid) to support its development.

