import Board from "./components/Board";
import React, { useState } from "react";
import { GAME_STATUS } from "./utils";

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  score: {
    fontSize: "2rem",
    fontWeight: "bold",
    textShadow: "0 0 10px #fff",
  },
  button: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    padding: "1rem",
    margin: "1rem",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(45deg, #ff8000, #ff8333)",
    color: "#fff",
    textShadow: "0 0 10px #fff",
    cursor: "pointer",
  },
};

const intialBoard = [
  [0, 0, 0, 0], // row 0
  [0, 0, 0, 0], // row 1
  [0, 0, 0, 0], // row 2
  [0, 0, 0, 0], // row 3
];

function App() {
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.NEW);
  const [score, setScore] = useState(0);
  const [canExtendBoard, setCanExtendBoard] = useState(false);
  const [board, setBoard] = useState(JSON.parse(JSON.stringify(intialBoard)));

  const handleReset = () => {
    setBoard(JSON.parse(JSON.stringify(intialBoard)));
  };

  const handleExtendboard = () => {
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard.forEach((row) => row.push(0));
    newBoard.push(Array(board[0].length + 1).fill(0));
    setBoard(newBoard);
    setCanExtendBoard(false);
  };

  return (
    <div style={styles.app}>
      <p style={styles.score}>Score:{score}</p>
      <Board
        gameStatus={gameStatus}
        setGameStatus={setGameStatus}
        setScore={setScore}
        board={board}
        setBoard={setBoard}
        setCanExtendBoard={setCanExtendBoard}
      />
      <button style={styles.button} onClick={handleReset}>
        Reset
      </button>
      {canExtendBoard && (
        <button style={styles.button} onClick={handleExtendboard}>
          Extend Board
        </button>
      )}
    </div>
  );
}

export default App;
