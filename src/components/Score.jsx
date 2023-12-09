import React from "react";
import { useGameContext } from "./GameContext";

export const Score = () => {
  const { score } = useGameContext();
  return <div style={ {
    fontSize: "2rem",
    fontWeight: "bold",
    textShadow: "0 0 10px #fff",
  }}>Score: {score}</div>;
};
