import { useState, createContext, useContext, useEffect, useCallback } from "react";
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
  const [isBombSelected, setIsBombSelected] = useState(false);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.NEW);
  const [score, setScore] = useState(0);
  const [canExtendBoard, setCanExtendBoard] = useState(false);
  const [board, setBoard] = useState(JSON.parse(JSON.stringify(intialBoard)));
  const [smallestTile, setSmallestTile] = useState(2);
  const [largestTile, setLargestTile] = useState(2);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

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
  const handleTileClick = ({ rowIndex, columnIndex }) =>{
    console.log("handleTileClick");
    if (isBombSelected) {
      setIsBombSelected(false);
      const tileToDestroy = [[rowIndex, columnIndex], [rowIndex+1, columnIndex],[rowIndex, columnIndex+1],[rowIndex-1, columnIndex],[rowIndex, columnIndex-1]];
      const validTileToDestroy = tileToDestroy.filter(([rowIndex, columnIndex]) => {
        return rowIndex >= 0 && rowIndex < board.length && columnIndex >= 0 && columnIndex < board[rowIndex].length;
      });
      const newBoard = [...board];
      validTileToDestroy.forEach(([rowIndex, columnIndex]) => {
        newBoard[rowIndex][columnIndex] = 0;
      });

    }
  }
  const handleTouchStart = (event) => {
    setTouchStart({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    });
  };

  const handleTouchMove = (event) => {
    setTouchEnd({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    });
  };

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

  const handleTouchEnd = () => {
    const xDiff = touchEnd.x - touchStart.x;
    const yDiff = touchEnd.y - touchStart.y;
    if (checkIfGameIsOver()) {
      alert("Game Over");
      setGameStatus(GAME_STATUS.OVER);
    }
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        handleRightKey();
        insertRandomTile();
      } else {
        handleLeftKey();
        insertRandomTile();
      }
    } else {
      if (yDiff > 0) {
        handleDownKey();
        insertRandomTile();
      } else {
        handleUpKey();
        insertRandomTile();
      }
    }
  };

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
    if (largestTile > Math.pow(board.length, 4)) {
      setCanExtendBoard(true);
    }
  }, [board.length, largestTile, setCanExtendBoard]);

  const value = {
    board,
    handleExtendboard,
    handleReset,
    score,
    canExtendBoard,
    isBombSelected,
    setIsBombSelected,
    handleTileClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};