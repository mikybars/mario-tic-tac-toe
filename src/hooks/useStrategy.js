import { useEffect, useState } from "react";
import { BoundedCounter } from "../model/boundedCounter";

function noop() {}

function shuffled(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const storage = {
  get(key) {
    const value = window.localStorage.getItem(key);
    if (value != null) {
      return JSON.parse(value);
    }
  },

  save(key, o) {
    return window.localStorage.setItem(key, JSON.stringify(o));
  },
};

export function useStrategy({ cpuSymbol }) {
  const [lastGameWasDraw, setLastGameWasDraw] = useState(
    storage.get("lastGameWasDraw") ?? false,
  );
  const [minMovesToWin, setMinMovesToWin] = useState(() => {
    const counters = storage.get("counters");
    return {
      [cpuSymbol]: new BoundedCounter(3, 5, counters?.[0]),
      [cpuSymbol?.other]: new BoundedCounter(3, 5, counters?.[1]),
    };
  });

  useEffect(() => {
    storage.save("lastGameWasDraw", lastGameWasDraw);
  }, [lastGameWasDraw]);

  useEffect(() => {
    storage.save("counters", [
      minMovesToWin[cpuSymbol].value,
      minMovesToWin[cpuSymbol?.other].value,
    ]);
  }, [minMovesToWin]);

  function levelUp() {
    const oldCpuMinMoves = minMovesToWin[cpuSymbol];
    const newCpuMinMoves = oldCpuMinMoves.dec();
    setMinMovesToWin({
      [cpuSymbol]: newCpuMinMoves,
      [cpuSymbol?.other]: minMovesToWin[cpuSymbol?.other].incIf(
        newCpuMinMoves === oldCpuMinMoves,
      ),
    });
  }

  function levelDown() {
    const oldCpuMinMoves = minMovesToWin[cpuSymbol];
    const newCpuMinMoves = oldCpuMinMoves.inc();
    setMinMovesToWin({
      [cpuSymbol]: newCpuMinMoves,
      [cpuSymbol?.other]: minMovesToWin[cpuSymbol?.other].decIf(
        newCpuMinMoves === oldCpuMinMoves,
      ),
    });
  }

  function recalculate(gameOver) {
    if (gameOver.winner) {
      newStrategyOnWinner();
    } else {
      newStrategyOnDraw();
    }
    setLastGameWasDraw(gameOver?.draw ?? false);

    function newStrategyOnWinner() {
      const { symbol: winner, numberOfMoves } = gameOver.winner;
      const wasTooEasy = numberOfMoves <= minMovesToWin[winner].value;
      const cpuWonTooEasy = wasTooEasy && winner === cpuSymbol;
      const userWonTooEasy = wasTooEasy && winner === cpuSymbol?.other;
      if (cpuWonTooEasy) {
        levelDown();
      } else if (userWonTooEasy) {
        levelUp();
      }
    }

    function newStrategyOnDraw() {
      const twoDrawsInARow = gameOver.draw && lastGameWasDraw;
      if (twoDrawsInARow) {
        levelDown();
      }
    }
  }

  function calculateNextBestMove(board, candidates) {
    const shuffledCandidates = shuffled(candidates);
    return (
      shuffledCandidates.find(
        (candidate) =>
          board
            .afterPlaying({ symbol: cpuSymbol, square: candidate })
            .allWinnerMovesBy(cpuSymbol).length > 0,
      ) ?? shuffledCandidates[0]
    );
  }

  function play({ board }) {
    if (board.gameOver) return;

    const cpuCanWinIn = (numberOfMoves) =>
      numberOfMoves >= minMovesToWin[cpuSymbol].value;
    const userCanNotWinIn = (numberOfMoves) =>
      numberOfMoves < minMovesToWin[cpuSymbol?.other].value;

    const winnerMoves = board.allWinnerMovesBy(cpuSymbol);
    if (
      winnerMoves.length > 0 &&
      cpuCanWinIn(board.totalMovesBy(cpuSymbol) + 1)
    ) {
      return winnerMoves[0];
    }

    const blockingMoves = board.allWinnerMovesBy(cpuSymbol?.other);
    if (
      blockingMoves.length > 0 &&
      userCanNotWinIn(board.totalMovesBy(cpuSymbol?.other) + 1)
    ) {
      return blockingMoves[0];
    }

    const nextMove = calculateNextBestMove(
      board,
      board.emptySquaresExcluding(...winnerMoves, ...blockingMoves),
    );
    return nextMove !== undefined
      ? nextMove
      : [...blockingMoves, ...winnerMoves].find((first) => first !== undefined);
  }

  return cpuSymbol ? [play, recalculate] : [noop, noop];
}
