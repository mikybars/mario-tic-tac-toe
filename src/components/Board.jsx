import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { Square } from "./Square";

export const TURNS = {
  X: "❌",
  O: "⚪",
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

export function Board({ onWinner, onDraw, changeTurn }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    if (turn) {
      changeTurn(turn);
    }
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

  function playTurn(squareIndex) {
    if (board[squareIndex] || winner || draw) return;

    const newBoard = [...board];
    newBoard[squareIndex] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    setWinner(findWinner(newBoard));
    setDraw(checkDraw(newBoard));
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
    <Square key={index} index={index} play={playTurn}>
      {square}
    </Square>
  ));
}
