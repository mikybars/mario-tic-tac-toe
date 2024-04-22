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

export function Board({ players, onWinner, onDraw, onChangeTurn }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURN.X);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    if (players[turn].isManaged) {
      simulateThinking(() => playManagedTurn(autoPlay()));
    }
  }, [players, turn]);

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
    if (!players[turn].isManaged) {
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
    return board.findIndex((turnPlayed) => turnPlayed === null);
  }

  function simulateThinking(action) {
    setTimeout(action, 1000);
  }

  function checkDraw(boardToCheck) {
    return boardToCheck.every((turnPlayed) => turnPlayed !== null);
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

  return board.map((turnPlayed, index) => (
    <Square key={index} index={index} play={playUserControlledTurn}>
      {turnPlayed ? players[turnPlayed].symbol : null}
    </Square>
  ));
}
