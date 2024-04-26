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
  const [draw, setDraw] = useState(false);
  const [winnerCombo, setWinnerCombo] = useState(null);

  useEffect(() => {
    if (players[turn].isManaged) {
      simulateThinking(() => playManagedTurn(autoPlay()));
    }
  }, [players, turn]);

  useEffect(() => {
    if (typeof onChangeTurn === "function") {
      onChangeTurn(turn);
    }
  }, [turn]);

  useEffect(() => {
    if (draw && typeof onDraw === "function") {
      onDraw();
    }
  }, [draw]);

  useEffect(() => {
    if (winnerCombo === null) {
      return;
    }
    animateWinnerCombo();
  }, [winnerCombo]);

  const playManagedTurn = playTurn;

  function animateWinnerCombo() {
    const firstNotHighlighted = winnerCombo.findIndex((w) => !w.isHighlighted);
    setTimeout(() => {
      if (firstNotHighlighted !== -1) {
        const newWinnerCombo = [...winnerCombo];
        newWinnerCombo[firstNotHighlighted].isHighlighted = true;
        setWinnerCombo(newWinnerCombo);
      } else if (typeof onWinner === "function") {
        // all squares are highlighted => notify winner
        const winnerTurn = board[winnerCombo[0].index];
        onWinner(winnerTurn);
      }
    }, 300);
  }

  function playUserControlledTurn(squareIndex) {
    if (!players[turn].isManaged) {
      playTurn(squareIndex);
    }
  }

  function playTurn(squareIndex) {
    if (board[squareIndex] !== null || winnerCombo !== null || draw) return;

    const newBoard = [...board];
    newBoard[squareIndex] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURN.X ? TURN.O : TURN.X;
    setTurn(newTurn);

    checkWinner(newBoard);
    checkDraw(newBoard);
  }

  function autoPlay() {
    return board.findIndex((turnPlayed) => turnPlayed === null);
  }

  function simulateThinking(action) {
    setTimeout(action, 1000);
  }

  function checkDraw(boardToCheck) {
    setDraw(boardToCheck.every((turnPlayed) => turnPlayed !== null));
  }

  function checkWinner(boardToCheck) {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        setWinnerCombo(
          [a, b, c].map((w) => ({
            index: w,
          })),
        );
      }
    }
  }

  return board.map((turnPlayed, index) => (
    <Square
      key={index}
      index={index}
      play={playUserControlledTurn}
      isWinner={winnerCombo?.some(
        (w) => w?.index === index && w?.isHighlighted,
      )}
    >
      {turnPlayed ? players[turnPlayed].symbol : null}
    </Square>
  ));
}
