import confetti from 'canvas-confetti'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import logo from './assets/logo.png'
import Characters from './characters'
import { Board } from './components/Board'
import { GameOverModal } from './components/GameOverModal'
import Player from './components/Player'
import { Player as PlayerModel } from './model/player'
import { TURN } from './model/turn'

const GAME_MODE = {
  ONE_P: { title: '1 jugador', cpuTurn: TURN.O },
  TWO_P: { title: '2 jugadores' }
}

export function App() {
  const initialTurn = useRef(TURN.X)
  const [gameOver, setGameOver] = useState()
  const [gameId, setGameId] = useState(1)
  const [turn, setTurn] = useState(initialTurn.current)
  const [gameMode, setGameMode] = useState(GAME_MODE.ONE_P)
  const [players, setPlayers] = useState(initializePlayers)

  useEffect(() => {
    if (gameOver?.winner) confetti()
  }, [gameOver])

  function initializePlayers() {
    return new Map(
      Characters.randomCharacters(2)
        .map((randomCharacter, i) => [
          ...[
            [TURN.X, 'Jugador 1'],
            [TURN.O, 'Jugador 2']
          ][i],
          randomCharacter
        ])
        .map(([turn, defaultName, randomCharacter]) => [
          turn,
          new PlayerModel({
            character: randomCharacter,
            name:
              turn === gameMode.cpuTurn ? randomCharacter.name : defaultName
          })
        ])
    )
  }

  function resetGame() {
    setGameId((gi) => gi + 1)
    setGameOver(undefined)
    resetTurn()
  }

  function resetTurn() {
    initialTurn.current = initialTurn.current.other
    setTurn(initialTurn.current)
  }

  const changePlayerCharacter = useCallback((turn, newCharacter) => {
    replacePlayer(turn, (player) => player.withCharacter(newCharacter))
  }, [])

  const changePlayerName = useCallback((turn, newName) => {
    replacePlayer(turn, (player) => player.withName(newName))
  }, [])

  function replacePlayer(turn, updatePlayer) {
    setPlayers(
      (players) =>
        new Map([
          [turn, updatePlayer(players.get(turn))],
          [turn.other, players.get(turn.other).clone()]
        ])
    )
  }

  return (
    <main className='game'>
      <img src={logo} alt='Tic Tac Toe' />

      <section className='game-options'>
        {Object.values(GAME_MODE).map((gm) => (
          <button
            key={gm.title}
            className={clsx('game-mode-btn', gm === gameMode && 'is-selected')}
            onClick={() => setGameMode(gm)}
          >
            {gm.title}
          </button>
        ))}
        <button className='game-reset-btn' onClick={resetGame}>
          Empezar de nuevo
        </button>
      </section>

      <section className='board'>
        <Board
          key={gameId}
          players={players}
          cpuTurn={gameMode.cpuTurn}
          initialTurn={initialTurn.current}
          onGameOver={setGameOver}
          onChangeTurn={setTurn}
        />
      </section>

      <section className='turn'>
        {[TURN.X, TURN.O]
          .map((turn) => [turn, players.get(turn)])
          .map(([turnPlayed, player]) => (
            <Player
              key={player.character?.name}
              allCharacters={Characters.ALL}
              nonEligibleCharacters={[players.get(turnPlayed.other).character]}
              initialCharacter={player.character}
              initialName={player.name}
              turn={turnPlayed}
              hasTurn={turnPlayed === turn}
              isEditable={turnPlayed !== gameMode.cpuTurn}
              onChangeCharacter={changePlayerCharacter}
              onChangeName={changePlayerName}
            />
          ))}
      </section>

      {gameOver
        ? (
          <GameOverModal
            winner={players.get(gameOver.winner?.symbol)}
            resetGame={resetGame}
          />
          )
        : null}
    </main>
  )
}

export default App
