import Board from "./components/Board";
import React from "react";
import { GameProvider } from "./components/GameContext";
import { RestButton } from "./components/RestButton";
import { ExtendButton } from "./components/ExtendButton";
import { Score } from "./components/Score";
import { PowerUps } from "./components/PowerUps";


function App() {
  return (
    <GameProvider>
      <Score />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Board />
        <RestButton />
        <ExtendButton />
        <PowerUps />
      </div>
    </GameProvider>
  );
}

export default App;
