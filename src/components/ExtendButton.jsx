import React from "react";
import { useGameContext } from "./GameContext";

export const ExtendButton = () => {
  const { canExtendBoard, handleExtendboard } = useGameContext();
  if (!canExtendBoard) {
    return null;
  }
  return (
    <button
      style={{
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
      }}
      onClick={handleExtendboard}
    >
      Extend Board
    </button>
  );
};
