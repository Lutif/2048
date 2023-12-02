import React, { useCallback, useEffect, useState } from "react";
import Tile from "./Tile";
import { GAME_STATUS } from "../utils";
/*
keyboard controlls . arrow keys to move all tiles in that direction as much as possible
if two tiles of the same value collide, they merge into a new tile that has a value of the sum of the two colliding tiles
every turn, a new tile will randomly appear in an empty spot on the board with a value of either 2 or 4
if the board is full and no valid moves are possible, the game is over
*/

export default function Board({
  gameStatus,
  setScore,
  setGameStatus,
  board,
  setBoard,
  setCanExtendBoard,
}) {
  const [smallestTile, setSmallestTile] = useState(2);
  const [largestTile, setLargestTile] = useState(2);

  const replaceSmallestTile = useCallback(
    (value) => {
      const newBoard = [...board];
      for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        for (
          let columnIndex = 0;
          columnIndex < board[rowIndex].length;
          columnIndex++
        ) {
          if (board[rowIndex][columnIndex] === smallestTile) {
            newBoard[rowIndex][columnIndex] = value;
          }
        }
      }
      setBoard(newBoard);
    },
    [board, setBoard, smallestTile]
  );

  useEffect(() => {
    if (largestTile === Math.pow(smallestTile, 5)) {
      setSmallestTile((curr) => curr * 2);
      replaceSmallestTile(smallestTile * 2);
    }
  }, [largestTile, replaceSmallestTile, smallestTile]);

  const insertRandomTile = useCallback(() => {
    const emptyTiles = [];
    board.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        if (tile === 0) {
          emptyTiles.push({ rowIndex, columnIndex });
        }
      });
    });
    if (emptyTiles.length === 0) return;
    const randomEmptyTile =
      emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    const newBoard = [...board];
    newBoard[randomEmptyTile.rowIndex][randomEmptyTile.columnIndex] =
      Math.random() < 0.9 ? smallestTile : smallestTile * 2;
    setBoard(newBoard);
  }, [board, setBoard, smallestTile]);

  const createMoveTile =
    (getNewPosition, getTile, setTile) =>
    ({ rowIndex, columnIndex }) => {
      const newBoard = [...board];
      let currentPosition = { rowIndex, columnIndex };
      while (true) {
        const currentTile = getTile(newBoard, currentPosition);
        const newPosition = getNewPosition(currentPosition);
        const newTile = getTile(newBoard, newPosition);
        if (newTile === 0) {
          setTile(newBoard, newPosition, currentTile);
          setTile(newBoard, currentPosition, 0);
        } else if (newTile === currentTile) {
          const tile = currentTile * 2;
          if (tile > largestTile) {
            setLargestTile(tile);
          }
          setScore((score) => score + tile);
          setTile(newBoard, newPosition, tile);
          setTile(newBoard, currentPosition, 0);
        } else {
          break;
        }
        currentPosition = newPosition;
      }
      setBoard(newBoard);
    };

  const moveTileUp = createMoveTile(
    ({ rowIndex, columnIndex }) => ({
      rowIndex: rowIndex - 1,
      columnIndex,
    }),
    (board, { rowIndex, columnIndex }) => board?.[rowIndex]?.[columnIndex],
    (board, { rowIndex, columnIndex }, value) =>
      (board[rowIndex][columnIndex] = value)
  );
  const moveTileDown = createMoveTile(
    ({ rowIndex, columnIndex }) => ({
      rowIndex: rowIndex + 1,
      columnIndex,
    }),
    (board, { rowIndex, columnIndex }) => board?.[rowIndex]?.[columnIndex],
    (board, { rowIndex, columnIndex }, value) =>
      (board[rowIndex][columnIndex] = value)
  );
  const moveTileLeft = createMoveTile(
    ({ rowIndex, columnIndex }) => ({
      rowIndex,
      columnIndex: columnIndex - 1,
    }),
    (board, { rowIndex, columnIndex }) => board?.[rowIndex]?.[columnIndex],
    (board, { rowIndex, columnIndex }, value) =>
      (board[rowIndex][columnIndex] = value)
  );
  const moveTileRight = createMoveTile(
    ({ rowIndex, columnIndex }) => ({
      rowIndex,
      columnIndex: columnIndex + 1,
    }),
    (board, { rowIndex, columnIndex }) => board?.[rowIndex]?.[columnIndex],
    (board, { rowIndex, columnIndex }, value) =>
      (board[rowIndex][columnIndex] = value)
  );
  const handleUpKey = useCallback(() => {
    for (let rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
      for (
        let columnIndex = 0;
        columnIndex < board[rowIndex].length;
        columnIndex++
      ) {
        if (board[rowIndex][columnIndex] !== 0) {
          moveTileUp({ rowIndex, columnIndex });
        }
      }
    }
  }, [board, moveTileUp]);
  const handleDownKey = useCallback(() => {
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < board[rowIndex].length;
        columnIndex++
      ) {
        if (board[rowIndex][columnIndex] !== 0) {
          moveTileDown({ rowIndex, columnIndex });
        }
      }
    }
  }, [board, moveTileDown]);
  const handleLeftKey = useCallback(() => {
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      for (
        let columnIndex = board[rowIndex].length - 1;
        columnIndex >= 0;
        columnIndex--
      ) {
        if (board[rowIndex][columnIndex] !== 0) {
          moveTileLeft({ rowIndex, columnIndex });
        }
      }
    }
  }, [board, moveTileLeft]);
  const handleRightKey = useCallback(() => {
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < board[rowIndex].length;
        columnIndex++
      ) {
        if (board[rowIndex][columnIndex] !== 0) {
          moveTileRight({ rowIndex, columnIndex });
        }
      }
    }
  }, [board, moveTileRight]);

  const checkIfBoardIsFull = useCallback(() => {
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < board[rowIndex].length;
        columnIndex++
      ) {
        if (board[rowIndex][columnIndex] === 0) {
          return false;
        }
      }
    }
    return true;
  }, [board]);
  const checkIfBoardIsEmpty = useCallback(() => {
    return board.flat().every((tile) => tile === 0);
  }, [board]);
  const checkIfGameIsOver = useCallback(() => {
    const isBoardFull = checkIfBoardIsFull();
    if (!isBoardFull) {
      return false;
    }
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < board[rowIndex].length;
        columnIndex++
      ) {
        const currentTile = board[rowIndex][columnIndex];
        const tileAbove = board[rowIndex - 1]?.[columnIndex];
        const tileBelow = board[rowIndex + 1]?.[columnIndex];
        const tileLeft = board[rowIndex]?.[columnIndex - 1];
        const tileRight = board[rowIndex]?.[columnIndex + 1];
        if (
          currentTile === 0 ||
          currentTile === tileAbove ||
          currentTile === tileBelow ||
          currentTile === tileLeft ||
          currentTile === tileRight
        ) {
          return false;
        }
      }
    }
    return true;
  }, [board, checkIfBoardIsFull]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key !== "ArrowUp" &&
        event.key !== "ArrowDown" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight"
      ) {
        return;
      }
      if (checkIfGameIsOver()) {
        alert("Game Over");
        setGameStatus(GAME_STATUS.OVER);
      }
      switch (event.key) {
        case "ArrowUp":
          handleUpKey();
          insertRandomTile();
          break;
        case "ArrowDown":
          handleDownKey();
          insertRandomTile();
          break;
        case "ArrowLeft":
          handleLeftKey();
          insertRandomTile();
          break;
        case "ArrowRight":
          handleRightKey();
          insertRandomTile();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    checkIfGameIsOver,
    gameStatus,
    handleDownKey,
    handleLeftKey,
    handleRightKey,
    handleUpKey,
    insertRandomTile,
    setGameStatus,
  ]);
  useEffect(() => {
    if (checkIfBoardIsEmpty()) {
      insertRandomTile();
    }
  }, [checkIfBoardIsEmpty, insertRandomTile]);

  useEffect(() => {
    if (largestTile > Math.pow(board.length,4)) {
      setCanExtendBoard(true);
    }
  }, [board.length, largestTile, setCanExtendBoard]);

  return (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((tile, columnIndex) => (
            <Tile key={columnIndex} value={tile} />
          ))}
        </div>
      ))}
    </div>
  );
}
