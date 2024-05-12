import confetti from "canvas-confetti";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import { default as Characters } from "./characters";
import { Board, TURN } from "./components/Board";
import { GameOverModal } from "./components/GameOverModal";
import Player from "./components/Player";
import { Player as PlayerModel } from "./model/player";

const GAME_MODE = {
  ONE_P: { title: "1 jugador", cpuTurn: TURN.O },
  TWO_P: { title: "2 jugadores" },
};

export function App() {
  const initialTurn = useRef(TURN.X);
  const [gameOver, setGameOver] = useState();
  const [gameId, setGameId] = useState(1);
  const [turn, setTurn] = useState(initialTurn.current);
  const [gameMode, setGameMode] = useState(GAME_MODE.ONE_P);
  const [players, setPlayers] = useState(initializePlayers);

  useEffect(() => {
    if (gameOver?.winner) confetti();
  }, [gameOver]);

  function initializePlayers() {
    return new Map(
      Characters.randomCharacters(2)
        .map(([randomName, randomCharacter], i) => [
          ...[
            [TURN.X, "Jugador 1"],
            [TURN.O, "Jugador 2"],
          ][i],
          randomName,
          randomCharacter,
        ])
        .map(([turn, defaultName, randomName, randomCharacter]) => [
          turn,
          new PlayerModel({
            character: randomCharacter,
            name: turn === gameMode.cpuTurn ? randomName : defaultName,
          }),
        ]),
    );
  }

  function resetGame() {
    setGameId((gi) => gi + 1);
    setGameOver(undefined);
    resetTurn();
  }

  function resetTurn() {
    initialTurn.current = initialTurn.current.other;
    setTurn(initialTurn.current);
  }

  function changePlayerCharacter(turn, newCharacter) {
    replacePlayer(turn, players.get(turn).withCharacter(newCharacter));
  }

  function changePlayerName(turn, newName) {
    replacePlayer(turn, players.get(turn).withName(newName));
  }

  function replacePlayer(turn, newPlayer) {
    setPlayers(
      (players) =>
        new Map([
          [turn, newPlayer],
          [turn.other, players.get(turn.other).clone()],
        ]),
    );
  }

  return (
    <main className="game">
      <img src={logo} alt="Tic Tac Toe" />

      <section className="game-options">
        {Object.values(GAME_MODE).map((gm) => (
          <button
            key={gm.title}
            className={clsx("game-mode-btn", gm === gameMode && "is-selected")}
            onClick={() => setGameMode(gm)}
          >
            {gm.title}
          </button>
        ))}
        <button className="game-reset-btn" onClick={resetGame}>
          Empezar de nuevo
        </button>
      </section>

      <section className="board">
        <Board
          key={gameId}
          players={players}
          cpuTurn={gameMode.cpuTurn}
          initialTurn={initialTurn.current}
          onGameOver={setGameOver}
          onChangeTurn={setTurn}
        />
      </section>

      <section className="turn">
        {[TURN.X, TURN.O]
          .map((turn) => [turn, players.get(turn)])
          .map(([turnPlayed, player]) => (
            <Player
              key={player.character?.type.name}
              allSymbols={Characters.ALL}
              nonEligibleSymbols={[players.get(turnPlayed.other).character]}
              initialSymbol={player.character}
              initialName={player.name}
              turn={turnPlayed}
              hasTurn={turnPlayed === turn}
              isEditable={turnPlayed !== gameMode.cpuTurn}
              onChangeSymbol={changePlayerCharacter}
              onChangeName={changePlayerName}
            />
          ))}
      </section>

      {gameOver ? (
        <GameOverModal
          winner={players.get(gameOver.winner?.symbol)}
          resetGame={resetGame}
        />
      ) : null}
    </main>
  );
}

export default App;
