import { useEffect, useState } from "react";
import { Square } from "./Square";

export const TURN = {
  X: Symbol("X"),
  O: Symbol("O"),
};

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let players;

const PLAYERS_DEFAULTS = {
  [TURN.X]: { managed: false },
  [TURN.O]: { managed: false },
};

export function Board({ playersOpts, onWinner, onDraw, onChangeTurn }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURN.X);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    players = { ...PLAYERS_DEFAULTS, ...playersOpts };
  }, [playersOpts]);

  useEffect(() => {
    if (players[turn].managed) {
      simulateThinking(() => playManagedTurn(autoPlay()));
    }
  }, [playersOpts, turn]);

  useEffect(() => {
    onChangeTurn(turn);
  }, [turn]);

  useEffect(() => {
    if (winner) {
      onWinner(winner);
    }
  }, [winner]);

  useEffect(() => {
    if (draw) {
      onDraw();
    }
  }, [draw]);

  const playManagedTurn = playTurn;

  function playUserControlledTurn(squareIndex) {
    if (!players[turn].managed) {
      playTurn(squareIndex);
    }
  }

  function playTurn(squareIndex) {
    if (board[squareIndex] || winner || draw) return;

    const newBoard = [...board];
    newBoard[squareIndex] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURN.X ? TURN.O : TURN.X;
    setTurn(newTurn);

    setWinner(findWinner(newBoard));
    setDraw(checkDraw(newBoard));
  }

  function autoPlay() {
    return board.findIndex((square) => square === null);
  }

  function simulateThinking(action) {
    setTimeout(action, 1000);
  }

  function checkDraw(boardToCheck) {
    return boardToCheck.every((square) => square !== null);
  }

  function findWinner(boardToCheck) {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a];
      }
    }
    return null;
  }

  return board.map((square, index) => (
    <Square key={index} index={index} play={playUserControlledTurn}>
      {square === TURN.X ? "x" : square === null ? "" : "o"}
    </Square>
  ));
}
