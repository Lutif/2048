import { useState, createContext, useContext } from "react";
import { GAME_STATUS } from "../utils";

const intialBoard = [
  [0, 0, 0, 0], // row 0
  [0, 0, 0, 0], // row 1
  [0, 0, 0, 0], // row 2
  [0, 0, 0, 0], // row 3
];

const GameContext =createContext();

export const useGameContext = ()=> useContext(GameContext);

export const GameProvider = ({ children }) => {
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

  const value = {
    gameStatus,
    setGameStatus,
    setScore,
    board,
    setBoard,
    setCanExtendBoard,
    handleExtendboard,
    handleReset,
    score,
    canExtendBoard
  }
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};