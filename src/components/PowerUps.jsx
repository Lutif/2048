import React from "react";
import { useGameContext } from "./GameContext";
import bombImage from '../assets/bomb.png';
const tileStyle = {
  width: "5vw",
  height: "5vw",
  display: "inline-block",
  margin: "5px",
  textAlign: "center",
  justifyContent: "center",
  fontSize: "4vw",
  color: "black",
  fontWeight: "bold",
  borderRadius: "10px",
  border: "4px solid #fff",
  boxShadow: "0 0px 10px wheat",
};
export const PowerUps = () => {
  const { isBombSelected, setIsBombSelected } = useGameContext();
  const handleBombClick = () => {
    setIsBombSelected(!isBombSelected);
  };
  return (
    <div
      style={{
        ...tileStyle,
        borderColor: isBombSelected ? "red" : "wheat",
      }}
      onClick={handleBombClick}
    >
      <img src={bombImage} alt="bomb" width="100%" height="100%" />
    </div>
  );
};
