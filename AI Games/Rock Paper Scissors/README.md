# 🎮 Rock Paper Scissors – AI Powered

This folder contains the source code and resources for the **AI-based Rock Paper Scissors** game developed as part of the **CSE-412: Artificial Intelligence** course.

## 📌 Overview

A React-based intelligent Rock Paper Scissors game where the user competes against an AI powered by the **Minimax algorithm** enhanced with memoization and weighted randomness for unpredictability. The game is packaged in an Electron environment for desktop use with a sleek UI.

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
cd AI-Course/AI\ Games/Rock\ Paper\ Scissors/rock-paper-scissors-app
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
The AI uses a **Minimax algorithm** with **memoization** to optimize decision making. It incorporates **adaptive depth** and **weighted randomness** to simulate imperfect and unpredictable gameplay, enhancing the challenge and fun.
---

## 🕹️ How to Play

- Select your move: **Rock**, **Paper**, or **Scissors** by clicking the corresponding button.
- The AI will pick its move automatically using the Minimax strategy.
- The game keeps score for you and the AI over a best-of-5 rounds format.
- Results of each round are displayed through toast notifications.
- After 5 rounds, the game ends; use the **Reset Game** button to start fresh.

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
      <img src="./screenshots/rps-init.png" alt="Rock Paper Scissors Initial Screen" width="250" />
      <br/>
      <em>Initial game screen showing choice buttons and score</em>
    </td>
    <td align="center">
      <img src="./screenshots/rps-playing.png" alt="Rock Paper Scissors Gameplay" width="250" />
      <br/>
      <em>Gameplay in progress with user and AI choices displayed</em>
    </td>
    <td align="center">
      <img src="./screenshots/rps-win.png" alt="Rock Paper Scissors Win Screen" width="250" />
      <br/>
      <em>Win screen displaying final score and game result</em>
    </td>
  </tr>
</table>

---

## 📁 Folder Structure

```bash
rock-paper-scissors-app/
├── src/                     # React components and game logic
│   └── RPS.jsx
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