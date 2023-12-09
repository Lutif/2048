import Tile from "./Tile";
import { useGameContext } from "./GameContext";

export default function Board() {
  const {
    board,
    handleTileClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useGameContext();

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((tile, columnIndex) => (
            <Tile
              key={columnIndex}
              value={tile}
              onClick={() => handleTileClick({ rowIndex, columnIndex })}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
