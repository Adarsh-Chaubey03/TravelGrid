# TravelGrid [Live Demo](https://travel-grid.vercel.app/)

**Note**: This repository is dedicated to contributors of **GirlScript Summer of Code 2025 (GSSoC'25)**.

Welcome to **TravelGrid**, your all-in-one travel platform! Book tickets, rent vehicles, reserve hotels, explore travel guides, and select customizable packages—all in one place.

---

## 🚀 Getting Started

Follow these steps to set up **TravelGrid** locally and begin contributing.

### Prerequisites

- Node.js (v16 or higher)  
- npm or yarn  
- Git  
- Code editor (VS Code recommended)  

---

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/Pragya158/TravelGrid.git
cd TravelGrid📸 Screenshot placeholder: After cloning the repo, show the folder structure.



2. Install Frontend Dependencies

cd client
npm install

> ⚠️ Common issue: If you get npm WARN deprecated or peer dependency errors, use:



npm install --legacy-peer-deps

> 📸 Screenshot placeholder: After installing frontend dependencies.



3. Install Backend Dependencies

cd ../server
npm install

> ⚠️ Common issue: If you see ENOENT: no such file or directory, package.json, make sure you are in the correct server folder. 📸 Screenshot placeholder: After installing backend dependencies.




---

Running the Application

Start the Backend Server

cd server
npm start
# Server will run on http://localhost:5000

> 📸 Screenshot placeholder: Backend running in terminal.



Start the Frontend (in a new terminal)

cd client
npm run dev
# Client will run on http://localhost:5173

> 📸 Screenshot placeholder: Frontend running in browser.




---

Troubleshooting Tips

Issue	Solution

npm ERR! enoent	Make sure you are in the correct folder (client or server) before running npm install.
Port already in use	Stop other apps using the port or change the port in vite.config.js or backend server.
Dependencies errors	Run npm install --legacy-peer-deps for frontend.
Server not starting	Check .env file for correct MongoDB URI and ports.



---

🤝 Contributing to TravelGrid

Pick Issues: Pick an unassigned issue or create a new one. Wait for admin approval before starting.

Responsive Design: Ensure all code is responsive using Tailwind CSS.

Code Quality: Write clean, modular code in src/components/. Use ESLint and Prettier.

Pull Requests: Address a specific issue, test thoroughly, and include a clear description. Buggy PRs will not be merged.

Communication: Avoid unnecessary comments or complaints. Contact:

GitHub: Adarsh-Chaubey03

LinkedIn: Adarsh Chaubey


Support Us: Star the repo at TravelGrid.


Task Assignment Process

Task assignments and PR reviews occur daily from 6:00 PM to 7:00 PM.


---

📂 Project Structure

TravelGrid/ ├── client/ │   ├── public/
│   ├── src/ │   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
├── server/ │   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── .env
│   ├── README.md
├── .gitignore
├── LICENSE
├── README.md


---

📜 Code of Conduct

Please refer to the Code of Conduct for details on contributing guidelines and community standards.


---

📄 License

This project is licensed under the MIT License.



---

