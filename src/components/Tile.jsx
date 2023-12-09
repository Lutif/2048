import React from "react";
const tileStyle = {
  width: "10vw",
  height: "10vw",
  display: "inline-block",
  margin: "5px",
  textAlign: "center",
  lineHeight: "10vw",
  justifyContent: "center",
  fontSize: "4vw",
  color: "white",
  fontWeight: "bold",
  borderRadius: "10px",
  border: "2px solid #fff",
  boxShadow: "0 0 10px #eee",
};

const getTileColor = (value) => {
  if (!value) return "#fff";
  const baseLog = Math.log2(value);
  const red = Math.min(255, baseLog * 5)
    .toString(16)
    .padStart(2, "0");
  const green = Math.max(0, 255 - baseLog * 20)
    .toString(16)
    .padStart(2, "0");
  const blue = Math.max(0, 255 - baseLog * 25)
    .toString(16)
    .padStart(2, "0");
  return `#${red}${green}${blue}`;
};
export default function Tile({ value, onClick }) {
  return (
    <div
      style={{ ...tileStyle, background: getTileColor(value) }}
      onClick={onClick}
    >
      {value && value}
    </div>
  );
}
