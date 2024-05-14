import { useEffect, useRef, useState } from "react";
import { emptyBoard } from "../model/board";
import { useStrategy } from "../hooks/useStrategy";
import { Square } from "./Square";

export const TURN = {
  X: {
    toString: () => "X",
  },
  O: {
    toString: () => "O",
  },
};

TURN.X.other = TURN.O;
TURN.O.other = TURN.X;

function simulateThinking(action) {
  setTimeout(action, 1000);
}

export function Board({
  players,
  cpuTurn,
  initialTurn,
  onChangeTurn,
  onGameOver,
}) {
  const [board, setBoard] = useState(emptyBoard());
  const [winnerCombo, setWinnerCombo] = useState();
  const turn = useRef(initialTurn);
  const [cpuMove, recalculateStrategy] = useStrategy({
    cpuSymbol: cpuTurn,
  });

  const playCpuTurn = () =>
    simulateThinking(() => playTurn(cpuMove({ board })));

  useEffect(() => {
    notifyGameOver();
    if (board.gameOver) return;
    if (!board.isEmpty()) changeTurn();
    if (turn.current === cpuTurn) playCpuTurn();
  }, [board]);

  useEffect(() => {
    if (turn.current === cpuTurn) playCpuTurn();
  }, [cpuTurn]);

  useEffect(() => {
    if (winnerCombo) animateWinnerCombo();
  }, [winnerCombo]);

  function changeTurn() {
    turn.current = turn.current.other;

    if (typeof onChangeTurn === "function") {
      onChangeTurn(turn.current);
    }
  }

  function animateWinnerCombo() {
    const firstNotHighlighted = winnerCombo.findIndex((w) => !w.isHighlighted);
    setTimeout(() => {
      if (firstNotHighlighted !== -1) {
        const newWinnerCombo = [...winnerCombo];
        newWinnerCombo[firstNotHighlighted].isHighlighted = true;
        setWinnerCombo(newWinnerCombo);
      } else {
        gameOver();
      }
    }, 300);
  }

  function gameOver() {
    onGameOver(board.gameOver);
    recalculateStrategy(board.gameOver);
  }

  function playUserTurn(square) {
    if (turn.current !== cpuTurn) {
      playTurn(square);
    }
  }

  function playTurn(square) {
    if (board.gameOver || board.isTaken(square)) return;
    setBoard(board.afterPlaying({ symbol: turn.current, square }));
  }

  function notifyGameOver() {
    if (board.gameOver?.winner) {
      const [a, b, c] = board.gameOver.winner.combo;
      setWinnerCombo([a, b, c].map((i) => ({ index: i })));
    }
    if (board.gameOver?.draw) {
      gameOver();
    }
  }

  return [...board].map((turnPlayed, square) => (
    <Square
      key={square}
      index={square}
      play={playUserTurn}
      isWinner={winnerCombo?.some(
        (w) => w?.index === square && w?.isHighlighted,
      )}
    >
      {turnPlayed ? players.get(turnPlayed).character.image : null}
    </Square>
  ));
}
