import { useCallback, useEffect, useRef, useState } from 'react'
import { emptyBoard } from '../model/board'
import { useStrategy } from '../hooks/useStrategy'
import { Square } from './Square'
import { noop } from '../utils'

const simulateThinking = (action) => setTimeout(action, 1000)
const cancelPlay = (playId) => clearTimeout(playId)

export function Board({
  players,
  cpuTurn,
  initialTurn,
  onChangeTurn = noop,
  onGameOver = noop
}) {
  const [board, setBoard] = useState(emptyBoard())
  const [winnerCombo, setWinnerCombo] = useState()
  const [gameIsOver, setGameIsOver] = useState(false)
  const turn = useRef(initialTurn)
  const [cpuMove, recalculateStrategy] = useStrategy({
    cpuSymbol: cpuTurn
  })

  const passTurn = useCallback(() => {
    turn.current = turn.current.other
    onChangeTurn(turn.current)
  }, [onChangeTurn])

  const playTurn = useCallback((square) => {
    const currentTurn = turn.current
    setBoard(board => board.afterPlaying({ symbol: currentTurn, square }))
    passTurn()
  }, [passTurn])

  const playUserTurn = useCallback((square) => {
    if (!board.gameOver && turn.current !== cpuTurn) {
      playTurn(square)
    }
  }, [board.gameOver, cpuTurn, playTurn])

  const playCpuTurn = useCallback(() => {
    if (!board.gameOver) {
      return simulateThinking(() => playTurn(cpuMove({ board })))
    }
  }, [board, cpuMove, playTurn])

  useEffect(() => {
    let playId
    if (turn.current === cpuTurn) playId = playCpuTurn()

    return () => cancelPlay(playId)
  }, [cpuTurn, playCpuTurn])

  useEffect(() => {
    if (board.gameOver?.draw) onGameOver(board.gameOver)
  }, [board.gameOver, onGameOver])

  useEffect(() => {
    setWinnerCombo(board.gameOver?.winner?.combo.map((i) => ({ index: i })))
  }, [board.gameOver])

  useEffect(() => {
    let timerId
    if (winnerCombo?.some(square => !square.isHighlighted)) {
      const firstNotHighlighted = winnerCombo.findIndex((w) => !w.isHighlighted)
      timerId = setTimeout(() => {
        const newWinnerCombo = [...winnerCombo]
        newWinnerCombo[firstNotHighlighted].isHighlighted = true
        setWinnerCombo(newWinnerCombo)
      }, 300)
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [winnerCombo])

  useEffect(() => {
    let timerId
    if (winnerCombo?.every(square => square.isHighlighted)) {
      setTimeout(() => onGameOver(board.gameOver), 300)
    }

    return () => {
      if (timerId) {
        return clearTimeout(timerId)
      }
    }
  }, [winnerCombo, board.gameOver, onGameOver])

  useEffect(() => {
    if (board.gameOver && !gameIsOver) {
      recalculateStrategy(board.gameOver)
      setGameIsOver(true)
    }
  }, [board.gameOver, gameIsOver, recalculateStrategy])

  return [...board].map((turnPlayed, square) => (
    <Square
      key={square}
      index={square}
      take={playUserTurn}
      isWinner={winnerCombo?.some(
        ({ index, isHighlighted }) => index === square && isHighlighted
      )}
    >
      {turnPlayed ? players.get(turnPlayed).character.image : null}
    </Square>
  ))
}
