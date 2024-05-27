import { useCallback, useEffect, useState } from 'react'

import { BoundedCounter } from '../model/boundedCounter'
import { noop, shuffled, storage } from '../utils'

function calculateNextBestMove(board, candidateSquares, symbolToPlay) {
  const shuffledCandidates = shuffled(candidateSquares)
  return (
    shuffledCandidates.find(
      (candidate) =>
        board
          .afterPlaying({ symbol: symbolToPlay, square: candidate })
          .allWinnerMovesBy(symbolToPlay).length > 0
    ) ?? shuffledCandidates[0]
  )
}

export function useStrategy({ cpuSymbol }) {
  const [lastGameWasDraw, setLastGameWasDraw] = useState(
    storage.getObject('strategy.lastGameWasDraw') ?? false
  )
  const [minMovesToWin, setMinMovesToWin] = useState(() => {
    return (storage.getObject('strategy.minMovesToWin') ?? [3, 3])
      .map(count => new BoundedCounter(3, 5, count))
  })

  useEffect(() => {
    storage.putObject('strategy.lastGameWasDraw', lastGameWasDraw)
  }, [lastGameWasDraw])

  useEffect(() => {
    storage.putObject('strategy.minMovesToWin', minMovesToWin.map(count => count.value))
  }, [minMovesToWin])

  const levelUp = useCallback(() =>
    setMinMovesToWin(mmw => ([
      mmw[0].dec(),
      mmw[1].incIf(mmw[0].value === mmw[0].lowerBound)
    ])), [])

  const levelDown = useCallback(() =>
    setMinMovesToWin(mmw => ([
      mmw[0].inc(),
      mmw[1].decIf(mmw[0].value === mmw[0].upperBound)
    ])), [])

  const recalculate = useCallback((gameOver) => {
    if (gameOver.winner) {
      newStrategyOnWinner()
    } else {
      newStrategyOnDraw()
    }
    setLastGameWasDraw(gameOver?.draw ?? false)

    function newStrategyOnWinner() {
      const { symbol: winner, numberOfMoves } = gameOver.winner
      const cpuWonTooEasy = numberOfMoves <= minMovesToWin[0].value && winner === cpuSymbol
      const userWonTooEasy = numberOfMoves <= minMovesToWin[1].value && winner === cpuSymbol.other
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
  }, [cpuSymbol, lastGameWasDraw, levelDown, levelUp, minMovesToWin])

  const play = useCallback(({ board }) => {
    if (board.gameOver) return

    const cpuCanWinIn = (numberOfMoves) =>
      numberOfMoves >= minMovesToWin[0].value
    const userCanNotWinIn = (numberOfMoves) =>
      numberOfMoves < minMovesToWin[1].value

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
      board.emptySquaresExcluding(...winnerMoves, ...blockingMoves),
      cpuSymbol
    )
    return nextMove !== undefined
      ? nextMove
      : [...blockingMoves, ...winnerMoves].find((first) => first !== undefined)
  }, [cpuSymbol, minMovesToWin])

  return cpuSymbol ? [play, recalculate] : [noop, noop]
}
