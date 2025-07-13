# 🎮 Tic Tac Toe – AI Powered

This folder contains the source code and resources for the **AI-based Tic Tac Toe** game developed as part of the **CSE-412: Artificial Intelligence** course.

## 📌 Overview

A React-based intelligent Tic Tac Toe game where the user plays as **X** and the AI (powered by the **Minimax algorithm**) plays as **O**. The game is integrated into an Electron environment for desktop execution with a polished UI.

---

## 🚀 How to Run the Game

### 🔧 Prerequisites

Ensure the following are installed on your machine:

- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **Electron** (comes with the dependencies)
- Internet access for first install

---

### 📦 Installation

```bash
git clone https://github.com/srabonti03/AI-Course.git
cd AI-Course/AI\ Games/Tic\ Tac\ Toe/tic-tac-toe-app
npm install
```

---

### ▶️ Run the Game

```bash
npm run dev       # For development mode (hot reload)
npm run build     # To build the app for production
npm run electron  # To launch the game via Electron
```

---

## 🧠 Algorithm Used
The game uses the **Minimax algorithm** with a slight **randomness factor (30%)** to avoid AI perfection, keeping the gameplay more human and winnable.

---

## 🕹️ How to Play

- You play as `X`, and the AI plays as `O`.
- Click on any empty square to make your move.
- The AI will respond automatically after a short delay.
- The game will display the result (Win/Draw) and automatically restart after a moment.
- Use the **"Restart"** button to start a new game or **"Reset All"** to clear scores too.

---

## 💻 Frameworks and Libraries Used

- **React.js** – Frontend framework
- **Electron** – Desktop app wrapper
- **SCSS** – Styling preprocessor for modular and maintainable CSS
- **react-icons, react-hot-toast** – For UI enhancement and notifications
- **vite** – Development server and bundler
- **minimax** – Custom-implemented inside the logic

---

## 📷 Screenshots

<table>
  <tr>
    <td align="center">
      <img src="./screenshots/ttt-init.png" alt="Tic Tac Toe Initial Screen" width="250" />
      <br/>
      <em>Initial game screen with empty board and scores</em>
    </td>
    <td align="center">
      <img src="./screenshots/ttt-playing.png" alt="Tic Tac Toe Gameplay" width="250" />
      <br/>
      <em>Gameplay in progress showing player and AI moves</em>
    </td>
    <td align="center">
      <img src="./screenshots/ttt-win.png" alt="Tic Tac Toe Win Screen" width="250" />
      <br/>
      <em>Win screen showing the winner and scores</em>
    </td>
  </tr>
</table>

---

## 📁 Folder Structure

```bash
tic-tac-toe-app/
├── src/                     # React components and game logic
│   └── TTT.jsx
├── electron.js              # Electron main process
├── vite.config.js           # Vite build configuration
├── package.json             # Dependencies and scripts
├── dist/                    # Production build output
├── screenshots/             # Game screenshots
└── README.md                # Project documentation
```

---

## 👩‍💻 Author

**Srabonti Suchi Talukdar**
Department of Computer Science & Engineering
North East University Bangladesh

---

## 📜 License

This project is intended for **academic use only** as part of the course **CSE-412: Artificial Intelligence**. It is **not licensed for commercial use or redistribution**.