import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import {
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
  FaChessBishop,
  FaChessQueen,
  FaChessKing,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./Chess.scss";

// Set dimensions of the board and each square
const WIDTH = 480;
const HEIGHT = 520;
const SQ_SIZE = WIDTH / 8; // One square is 1/8th of board width

// Icon components mapped to chess piece notations
const pieceIcons = {
  wP: <FaChessPawn color="white" />,
  wR: <FaChessRook color="white" />,
  wN: <FaChessKnight color="white" />,
  wB: <FaChessBishop color="white" />,
  wQ: <FaChessQueen color="white" />,
  wK: <FaChessKing color="white" />,
  bP: <FaChessPawn color="black" />,
  bR: <FaChessRook color="black" />,
  bN: <FaChessKnight color="black" />,
  bB: <FaChessBishop color="black" />,
  bQ: <FaChessQueen color="black" />,
  bK: <FaChessKing color="black" />,
};

export default function ChessGame() {
  const boardRef = useRef(null); // Ref to the board DOM element
  const [game, setGame] = useState(() => new Chess()); // Initialize new chess game
  const [selectedSquare, setSelectedSquare] = useState(null); // Store selected square
  const [boardState, setBoardState] = useState(game.board()); // Store current board layout
  const [turn, setTurn] = useState("w"); // Track whose turn it is ('w' or 'b')
  const [moveHistory, setMoveHistory] = useState([]); // Store all moves made
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1); // For future undo/redo

  // Evaluates the board score from black's perspective
  const evaluate = (gameInstance) => {
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9 }; // Piece values
    let evalScore = 0;
    gameInstance.board().forEach((row) => {
      row.forEach((piece) => {
        if (piece) {
          const value = values[piece.type] || 0;
          evalScore += piece.color === "b" ? value : -value;
        }
      });
    });
    return evalScore; // Positive = better for black, Negative = better for white
  };

  // Minimax algorithm for the AI (black side)
  const minimax = (gameInstance, depth, maximizing) => {
    if (depth === 0 || gameInstance.isGameOver()) {
      return [evaluate(gameInstance), null];
    }

    let bestMove = null;

    if (maximizing) {
      let maxEval = -Infinity;
      for (const move of gameInstance.moves()) {
        gameInstance.move(move); // Simulate move
        const [evalScore] = minimax(gameInstance, depth - 1, false);
        gameInstance.undo(); // Undo move after simulating
        if (evalScore > maxEval) {
          maxEval = evalScore;
          bestMove = move;
        }
      }
      return [maxEval, bestMove];
    } else {
      let minEval = Infinity;
      for (const move of gameInstance.moves()) {
        gameInstance.move(move);
        const [evalScore] = minimax(gameInstance, depth - 1, true);
        gameInstance.undo();
        if (evalScore < minEval) {
          minEval = evalScore;
          bestMove = move;
        }
      }
      return [minEval, bestMove];
    }
  };

  // Get all valid moves from the selected square
  const getValidMovesForSelected = () => {
    if (!selectedSquare) return [];
    const moves = game.moves({ square: selectedSquare, verbose: true });
    return moves.map((move) => move.to); // Return only the destination squares
  };

  // Handle when user clicks on a square on the board
  const handleClick = (row, col) => {
    const square = String.fromCharCode("a".charCodeAt(0) + col) + (8 - row); // Convert to algebraic (e.g. e4)
    const piece = game.get(square); // Get piece on clicked square

    if (selectedSquare === null) {
      // No piece selected yet
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square); // Select this square if it's the player's piece
      }
    } else {
      // If player clicks on their own piece again → reselect
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        return;
      }

      // Try making a move to clicked square
      const move = game.move({ from: selectedSquare, to: square });
      if (move) {
        const newHistory = game.history({ verbose: true }); // Get full move history
        setMoveHistory(newHistory);
        setCurrentMoveIndex(newHistory.length - 1); // Update pointer
        setSelectedSquare(null); // Clear selection after move
        setBoardState(game.board()); // Update board
        setTurn(game.turn()); // Switch turn
      } else {
        setSelectedSquare(null); // Invalid move → clear selection
      }
    }
  };

  // Replay previous moves up to a certain index (for undo/redo)
  const goToMove = (index) => {
    // Allow index -1 to mean "no moves done" (initial position)
    if (index < -1 || index >= moveHistory.length) return; // prevent invalid index

    const newGame = new Chess();
    const history = moveHistory.slice(0, index + 1);
    for (let move of history) {
      newGame.move(move);
    }

    setGame(newGame); // Update chess.js game instance
    setBoardState(newGame.board()); // Update board UI
    setTurn(newGame.turn()); // Update current player turn
    setCurrentMoveIndex(index); // Update current move pointer
    setSelectedSquare(null); // Clear selection on undo/redo
  };

  // When it's black's turn, let the AI play using minimax
  // BUT only if we are at the latest move, so undo doesn't trigger AI
  useEffect(() => {
    if (
      turn === "b" &&
      !game.isGameOver() &&
      currentMoveIndex === moveHistory.length - 1
    ) {
      const timer = setTimeout(() => {
        const gameCopy = new Chess(game.fen()); // Copy current game state
        const [, move] = minimax(gameCopy, 2, true); // AI calculates best move (depth 2)
        if (move) {
          game.move(move); // Make the move
          const newHistory = game.history({ verbose: true });
          setMoveHistory(newHistory);
          setCurrentMoveIndex(newHistory.length - 1);
          setBoardState(game.board());
          setTurn(game.turn()); // Player's turn now
          setSelectedSquare(null);
        }
      }, 100);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [turn, game, currentMoveIndex, moveHistory]);

  // Show a toast when the game ends
  useEffect(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        if (game.turn() === "w") {
          toast.error("Black wins by Checkmate!");
        } else {
          toast.error("White wins by Checkmate!");
        }
      } else if (game.isStalemate()) {
        toast("Draw: Stalemate!");
      } else if (game.isInsufficientMaterial()) {
        toast("Draw: Insufficient Material");
      } else if (game.inThreefoldRepetition()) {
        toast("Draw: Threefold Repetition");
      } else if (game.isDraw()) {
        toast("Draw: 50-Move Rule");
      } else {
        toast("Game Over");
      }
    }
  }, [boardState, game]);

  const validMoves = getValidMovesForSelected(); // Get valid move destinations from selected square

  const renderGameOverText = () => {
    if (game.isCheckmate()) {
      return game.turn() === "w"
        ? "Black wins by Checkmate!"
        : "White wins by Checkmate!";
    } else if (game.isStalemate()) {
      return "Draw: Stalemate!";
    } else if (game.isInsufficientMaterial()) {
      return "Draw: Insufficient Material";
    } else if (game.inThreefoldRepetition()) {
      return "Draw: Threefold Repetition";
    } else if (game.isDraw()) {
      return "Draw: 50-Move Rule";
    }
    return "Game Over";
  };

  return (
    <div className="chess-game">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Display game status or turn info */}
      <div className="game-status">
        <p>
          {game.isGameOver()
            ? renderGameOverText()
            : turn === "w"
            ? "White's Turn"
            : "Black (AI)'s Turn"}
        </p>
      </div>

      {/* Chess board squares */}
      <div className="chess-board" ref={boardRef}>
        {boardState.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            // Calculate square name in chess notation
            const square =
              String.fromCharCode("a".charCodeAt(0) + colIndex) +
              (8 - rowIndex);
            // Check if this square is currently selected
            const isSelected = square === selectedSquare;
            // Check if this square is a valid move destination
            const isValidMove = validMoves.includes(square);
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)} // Click handler for each square
                className={`chess-square ${isSelected ? "selected" : ""} ${
                  isValidMove ? "valid-move" : ""
                }`} // Add CSS classes
              >
                {/* Render the piece icon if piece exists on this square */}
                {piece
                  ? pieceIcons[piece.color + piece.type.toUpperCase()]
                  : null}
              </div>
            );
          })
        )}
      </div>
      {/* Undo and Redo move buttons */}
      <div className="undo-redo-controls">
        {/* Undo to previous move; -1 means back to initial position */}
        <button
          className="undo-button"
          onClick={() => {
            goToMove(currentMoveIndex - 1);
          }}
          disabled={currentMoveIndex < 0}
        >
          Undo
        </button>

        {/* Redo to the next move if not already at the latest */}
        <button
          className="redo-button"
          onClick={() => {
            goToMove(currentMoveIndex + 1);
          }}
          disabled={currentMoveIndex >= moveHistory.length - 1}
        >
          Redo
        </button>
      </div>
    </div>
  );
}
