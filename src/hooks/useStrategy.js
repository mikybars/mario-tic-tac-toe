import { useEffect, useState } from 'react'
import { BoundedCounter } from '../model/boundedCounter'
import { noop, shuffled, storage } from '../utils'

export function useStrategy({ cpuSymbol }) {
  const [lastGameWasDraw, setLastGameWasDraw] = useState(
    storage.getObject('lastGameWasDraw') ?? false
  )
  const [minMovesToWin, setMinMovesToWin] = useState(() => {
    const counters = storage.getObject('counters')
    return {
      [cpuSymbol]: new BoundedCounter(3, 5, counters?.[0]),
      [cpuSymbol?.other]: new BoundedCounter(3, 5, counters?.[1])
    }
  })

  useEffect(() => {
    storage.putObject('lastGameWasDraw', lastGameWasDraw)
  }, [lastGameWasDraw])

  useEffect(() => {
    storage.putObject('counters', [
      minMovesToWin[cpuSymbol].value,
      minMovesToWin[cpuSymbol?.other].value
    ])
  }, [cpuSymbol, minMovesToWin])

  function levelUp() {
    const oldCpuMinMoves = minMovesToWin[cpuSymbol]
    const newCpuMinMoves = oldCpuMinMoves.dec()
    setMinMovesToWin({
      [cpuSymbol]: newCpuMinMoves,
      [cpuSymbol?.other]: minMovesToWin[cpuSymbol?.other].incIf(
        newCpuMinMoves === oldCpuMinMoves
      )
    })
  }

  function levelDown() {
    const oldCpuMinMoves = minMovesToWin[cpuSymbol]
    const newCpuMinMoves = oldCpuMinMoves.inc()
    setMinMovesToWin({
      [cpuSymbol]: newCpuMinMoves,
      [cpuSymbol?.other]: minMovesToWin[cpuSymbol?.other].decIf(
        newCpuMinMoves === oldCpuMinMoves
      )
    })
  }

  function recalculate(gameOver) {
    if (gameOver.winner) {
      newStrategyOnWinner()
    } else {
      newStrategyOnDraw()
    }
    setLastGameWasDraw(gameOver?.draw ?? false)

    function newStrategyOnWinner() {
      const { symbol: winner, numberOfMoves } = gameOver.winner
      const wasTooEasy = numberOfMoves <= minMovesToWin[winner].value
      const cpuWonTooEasy = wasTooEasy && winner === cpuSymbol
      const userWonTooEasy = wasTooEasy && winner === cpuSymbol?.other
      if (cpuWonTooEasy) {
        levelDown()
      } else if (userWonTooEasy) {
        levelUp()
      }
    }

    function newStrategyOnDraw() {
      const twoDrawsInARow = gameOver.draw && lastGameWasDraw
      if (twoDrawsInARow) {
        levelDown()
      }
    }
  }

  function calculateNextBestMove(board, candidates) {
    const shuffledCandidates = shuffled(candidates)
    return (
      shuffledCandidates.find(
        (candidate) =>
          board
            .afterPlaying({ symbol: cpuSymbol, square: candidate })
            .allWinnerMovesBy(cpuSymbol).length > 0
      ) ?? shuffledCandidates[0]
    )
  }

  function play({ board }) {
    if (board.gameOver) return

    const cpuCanWinIn = (numberOfMoves) =>
      numberOfMoves >= minMovesToWin[cpuSymbol].value
    const userCanNotWinIn = (numberOfMoves) =>
      numberOfMoves < minMovesToWin[cpuSymbol?.other].value

    const winnerMoves = board.allWinnerMovesBy(cpuSymbol)
    if (
      winnerMoves.length > 0 &&
      cpuCanWinIn(board.totalMovesBy(cpuSymbol) + 1)
    ) {
      return winnerMoves[0]
    }

    const blockingMoves = board.allWinnerMovesBy(cpuSymbol?.other)
    if (
      blockingMoves.length > 0 &&
      userCanNotWinIn(board.totalMovesBy(cpuSymbol?.other) + 1)
    ) {
      return blockingMoves[0]
    }

    const nextMove = calculateNextBestMove(
      board,
      board.emptySquaresExcluding(...winnerMoves, ...blockingMoves)
    )
    return nextMove !== undefined
      ? nextMove
      : [...blockingMoves, ...winnerMoves].find((first) => first !== undefined)
  }

  return cpuSymbol ? [play, recalculate] : [noop, noop]
}
