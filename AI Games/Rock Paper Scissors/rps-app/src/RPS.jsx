import React, { useState, useEffect } from "react";
import { FaHandRock, FaHandPaper, FaHandScissors } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./RPS.scss";

// Array of possible choices with corresponding icons for UI
const choices = [
  { name: "rock", icon: <FaHandRock size={60} /> },
  { name: "paper", icon: <FaHandPaper size={60} /> },
  { name: "scissors", icon: <FaHandScissors size={60} /> },
];

// Function to determine result of a round from user's perspective
// Returns: 1 if user wins, -1 if user loses, 0 if tie
function getResult(userPick, compPick) {
  if (userPick === compPick) return 0;
  if (
    (userPick === "rock" && compPick === "scissors") ||
    (userPick === "paper" && compPick === "rock") ||
    (userPick === "scissors" && compPick === "paper")
  ) {
    return 1;
  } else {
    return -1;
  }
}

// Memoization map to store previously computed minimax results for optimization
const memo = new Map();

// Minimax algorithm with memoization to calculate best possible outcome recursively
// userPick: current user choice
// compPick: current computer choice
// depth: remaining depth to look ahead in the game tree
// isAITurn: boolean indicating if it's AI's turn to pick
function minimax(userPick, compPick, depth, isAITurn) {
  const key = `${userPick}-${compPick}-${depth}-${isAITurn}`;
  if (memo.has(key)) return memo.get(key);

  if (depth === 0) return 0;

  const moves = ["rock", "paper", "scissors"];
  if (isAITurn) {
    let bestScore = -Infinity;
    // AI tries to maximize its score by picking the best move
    for (const move of moves) {
      const score = getResult(userPick, move) + minimax(userPick, move, depth - 1, false);
      if (score > bestScore) bestScore = score;
    }
    memo.set(key, bestScore);
    return bestScore;
  } else {
    let bestScore = Infinity;
    // User tries to minimize AI's advantage by picking the best move
    for (const move of moves) {
      const score = getResult(move, compPick) + minimax(move, compPick, depth - 1, true);
      if (score < bestScore) bestScore = score;
    }
    memo.set(key, bestScore);
    return bestScore;
  }
}

// Function to get AI's move using minimax with adaptive depth and weighted randomness for imperfection
function getAIMove(userPick, baseDepth = 3) {
  const moves = ["rock", "paper", "scissors"];
  let bestMove = null;
  let bestScore = -Infinity;

  // Increase depth occasionally to let AI have a stronger comeback if needed
  const adaptiveDepth = baseDepth + (userPick && Math.random() < 0.4 ? 1 : 0);

  for (const move of moves) {
    const score = getResult(userPick, move) + minimax(userPick, move, adaptiveDepth, false);
    // Weighted randomness: sometimes pick moves close to the best for variety
    if (
      score > bestScore ||
      (score >= bestScore - 1 && Math.random() > 0.6)
    ) {
      bestScore = score;
      bestMove = move;
    }
  }

  // Small chance AI picks a random move for unpredictability
  if (Math.random() < 0.1) {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    if (randomMove !== bestMove) {
      return randomMove;
    }
  }

  return bestMove;
}

function RPS() {
  // State to store user's current choice object
  const [userChoice, setUserChoice] = useState(null);
  // State to store computer's current choice object
  const [computerChoice, setComputerChoice] = useState(null);
  // User's cumulative score
  const [userScore, setUserScore] = useState(0);
  // Computer's cumulative score
  const [computerScore, setComputerScore] = useState(0);
  // Current round number
  const [round, setRound] = useState(0);
  const maxRounds = 5; // Maximum number of rounds per game

  // useEffect hooked on round updates
  useEffect(() => {
    if (round === 0 || round > maxRounds) return;
    if (!userChoice || !computerChoice) return;
  }, [round]);

  // Function called when user picks a choice
  function play(userPick) {
    // Prevent playing if game already ended
    if (round >= maxRounds) return;

    // Get AI move based on user's current choice
    const aiMoveName = getAIMove(userPick.name, 2);
    const compPick = choices.find((c) => c.name === aiMoveName);

    // Show toast notifications for the result of the round
    const result = getResult(userPick.name, compPick.name);
    if (result === 1) {
      // User wins this round
      toast.success("You win this round! 🏆");
    } else if (result === -1) {
      // Computer wins this round
      toast.error("Computer wins this round! 😈");
    } else {
      // Tie
      toast("It’s a draw 🤝", { icon: "🤝" });
    }

    // Update states with current choices
    setUserChoice(userPick);
    setComputerChoice(compPick);

    // Update scores depending on result of this round
    if (userPick.name === compPick.name) {
      // tie - no score update
    } else if (
      (userPick.name === "rock" && compPick.name === "scissors") ||
      (userPick.name === "paper" && compPick.name === "rock") ||
      (userPick.name === "scissors" && compPick.name === "paper")
    ) {
      setUserScore((score) => score + 1);
    } else {
      setComputerScore((score) => score + 1);
    }

    // Move to next round
    setRound((r) => r + 1);
  }

  // Resets the entire game to initial state
  function resetGame() {
    setUserChoice(null);
    setComputerChoice(null);
    setUserScore(0);
    setComputerScore(0);
    setRound(0);
    toast.dismiss(); // Clear any lingering toasts
    memo.clear(); // Clear memoization cache for fresh calculations
  }

  // Disable choice buttons when max rounds reached
  const buttonsDisabled = round >= maxRounds;

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      <h1>Rock Paper Scissors - Best of {maxRounds}</h1>

      <p>
        Round: {round} / {maxRounds} | Your Score: {userScore} | Computer Score:{" "}
        {computerScore}
      </p>

      <div className="choices-container">
        {/* Render buttons for each choice */}
        {choices.map((choice) => (
          <button
            key={choice.name}
            onClick={() => play(choice)}
            disabled={buttonsDisabled}
          >
            {choice.icon}
            <span>{choice.name.charAt(0).toUpperCase() + choice.name.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="choices">
        {/* Show user's current choice */}
        <div className="user-choice">
          <h3>Your choice</h3>
          <div className="choice">{userChoice ? userChoice.icon : "-"}</div>
        </div>

        {/* Show computer's current choice */}
        <div className="computer-choice">
          <h3>Computer's choice</h3>
          <div className="choice">{computerChoice ? computerChoice.icon : "-"}</div>
        </div>
      </div>

      {/* Button to reset the game */}
      <button className='reset-button' onClick={resetGame}>Reset Game</button>
    </div>
  );
}

export default RPS;
