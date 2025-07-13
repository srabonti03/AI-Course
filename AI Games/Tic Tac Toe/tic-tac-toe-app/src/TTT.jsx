import React, { useState, useEffect } from 'react';
import { FaTimes, FaRegCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import './TTT.scss';

function TTT() {
  // Board state: 9 cells, initially empty
  const [board, setBoard] = useState(Array(9).fill(''));

  // Track whose turn it is, true = X (player), false = O (AI)
  const [isXTurn, setIsXTurn] = useState(true);

  // Winner state: null if no winner, otherwise 'X' or 'O'
  const [winner, setWinner] = useState(null);

  // Draw state: true if the game ended in a draw
  const [draw, setDraw] = useState(false);

  // Scores for player X and AI O
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);

  // All possible winning triplets of board indices
  const winningPatterns = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6], // diagonal top-right to bottom-left
  ];

  // Check if there's a winner on the board
  const checkWinner = (b) => {
    for (let pattern of winningPatterns) {
      const [a, b1, c] = pattern;
      // If all 3 positions have same non-empty value, we have a winner
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return b[a];
      }
    }
    return null; // no winner found
  };

  // Check if the board is full (all cells filled, no empty '')
  const checkDraw = (b) => {
    return b.every(cell => cell !== '');
  };

  // Minimax algorithm to evaluate best move for AI
  // newBoard: current board state, depth: recursion depth, isMaximizing: true if AI's turn
  const minimax = (newBoard, depth, isMaximizing) => {
    const result = checkWinner(newBoard);

    // Terminal states: AI wins, player wins, or draw
    if (result === 'O') return 10 - depth;  // AI wants to maximize score
    if (result === 'X') return depth - 10;  // Player win is bad for AI
    if (checkDraw(newBoard)) return 0;      // Draw is neutral

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === '') {
          newBoard[i] = 'O';  // AI tries placing 'O' here
          const score = minimax(newBoard, depth + 1, false);
          newBoard[i] = '';   // Undo move
          bestScore = Math.max(score, bestScore); // Pick max score
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === '') {
          newBoard[i] = 'X';  // Player tries placing 'X' here
          const score = minimax(newBoard, depth + 1, true);
          newBoard[i] = '';   // Undo move
          bestScore = Math.min(score, bestScore); // Pick min score
        }
      }
      return bestScore;
    }
  };

  // Finds best move for AI using minimax
  const bestMove = () => {
    let bestScore = -Infinity;
    let move;
    const newBoard = [...board];

    // Try all empty cells and choose the one with best score
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = 'O';             // AI tries move
        const score = minimax(newBoard, 0, false); // Evaluate move
        newBoard[i] = '';              // Undo move

        if (score > bestScore) {
          bestScore = score;
          move = i;                   // Remember best move
        }
      }
    }

    // Introduce randomness: 30% chance to make a mistake (let player win sometimes)
    const randomChance = Math.random();
    if (randomChance < 0.3) {
      const emptyIndices = board
        .map((cell, idx) => (cell === '' ? idx : null))
        .filter(idx => idx !== null);
      const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      handleClick(randomMove, true); // Make random move
    } else {
      if (move !== undefined) {
        handleClick(move, true);  // Make AI move, pass true to identify AI move
      }
    }
  };

  // Handle click on a cell; index = cell clicked
  // isAIMove = true if this click is triggered by AI
  const handleClick = (index, isAIMove = false) => {
    // Ignore if cell already filled, or game already ended
    if (board[index] !== '' || winner || draw) return;

    // Update board with current player's symbol
    const updatedBoard = [...board];
    updatedBoard[index] = isXTurn ? 'X' : 'O';

    // Check if this move wins the game
    const win = checkWinner(updatedBoard);

    // Check if this move causes a draw (full board, no winner)
    const isDraw = !win && checkDraw(updatedBoard);

    // Update states
    setBoard(updatedBoard);
    setIsXTurn(!isXTurn);  // Switch turn to other player

    // If there's a winner, announce and update score
    if (win) {
      setWinner(win);
      toast.success(`${win} wins! 🏆`);  // Popup notification
      if (win === 'X') setScoreX(scoreX + 1);
      else setScoreO(scoreO + 1);
    }
    // If draw, announce it
    else if (isDraw) {
      setDraw(true);
      toast('It’s a draw 🤝', { icon: '🤝' });
    }
  };

  // useEffect to trigger AI move after player's move
  useEffect(() => {
    if (!isXTurn && !winner && !draw) {
      // Delay AI move for half a second to feel natural
      const timeout = setTimeout(() => {
        bestMove();
      }, 500);

      // Cleanup timeout if component unmounts or dependencies change
      return () => clearTimeout(timeout);
    }
  }, [isXTurn, board, winner, draw]);

  // *** New useEffect for auto-restart on draw ***
  useEffect(() => {
    if (draw) {
      const timeout = setTimeout(() => {
        resetGame();
      }, 1500); // 1.5s delay to let the toast show

      return () => clearTimeout(timeout);
    }
  }, [draw]);

  // *** New useEffect for auto-restart on win ***
  useEffect(() => {
    if (winner) {
      const timeout = setTimeout(() => {
        resetGame();
      }, 1500); // 1.5s delay to let the toast show

      return () => clearTimeout(timeout);
    }
  }, [winner]);

  // Reset just the current game, keep scores
  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setIsXTurn(true);
    setWinner(null);
    setDraw(false);
  };

  // Reset entire game including scores
  const resetAll = () => {
    resetGame();
    setScoreX(0);
    setScoreO(0);
  };

  // Render X or O icon in cells
  const renderIcon = (value) => {
    if (value === 'X') return <FaTimes color="#e74c3c" size={32} />;
    if (value === 'O') return <FaRegCircle color="#3498db" size={32} />;
    return null;
  };

  // JSX rendering
  return (
    <div className="TTT-container">
      <Toaster position="top-center" reverseOrder={false} />
      <h2>Tic Tac Toe</h2>

      {/* Display scores */}
      <div className="scoreboard">
        <strong>Score:</strong> X = {scoreX} | O = {scoreO}
      </div>

      {/* Show current game status: winner, draw or next turn */}
      {winner ? (
        <h3>Winner: {winner}</h3>
      ) : draw ? (
        <h3>Draw!</h3>
      ) : (
        <h3>Turn: {isXTurn ? 'X (You)' : 'O (AI)'}</h3>
      )}

      {/* Board grid */}
      <div className="grid">
        {board.map((value, index) => (
          // Each cell is a button
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!isXTurn || value !== ''} // Player can only click on empty cells during their turn
          >
            {renderIcon(value)}  {/* Show X or O */}
          </button>
        ))}
      </div>

      {/* Buttons to restart or reset */}
      <div className="button-group">
        <button onClick={resetGame}>🔄 Restart Game</button>
        <button onClick={resetAll}>❌ Reset All</button>
      </div>
    </div>
  );
}

export default TTT;
