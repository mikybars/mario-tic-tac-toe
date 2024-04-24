import confetti from "canvas-confetti";
import clsx from "clsx";
import { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import { default as Characters } from "./characters";
import { Board, TURN } from "./components/Board";
import { GameOverModal } from "./components/GameOverModal";
import Player from "./components/Player";

const GAME_MODE = {
  ONE_P: {
    [TURN.X]: { isManaged: false },
    [TURN.O]: { isManaged: true },
  },
  TWO_P: {
    [TURN.X]: { isManaged: false },
    [TURN.O]: { isManaged: false },
  },
};

function App() {
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [gameId, setGameId] = useState(1);
  const [turn, setTurn] = useState(null);
  const [gameMode, setGameMode] = useState(GAME_MODE.ONE_P);
  const [playerCharacter, setPlayerCharacter] = useState(() => {
    const [_, randomCharacter1] = Characters.random();
    const [__, randomCharacter2] = Characters.randomExcluding(randomCharacter1);
    return {
      [TURN.X]: randomCharacter1,
      [TURN.O]: randomCharacter2,
    };
  });
  const [playerName, setPlayerName] = useState({
    [TURN.X]: "Jugador 1",
    [TURN.O]: "Jugador 2",
  });

  useEffect(pickRandomCharactersForManagedPlayers, [gameMode]);

  function pickRandomCharactersForManagedPlayers() {
    for (const turn of Object.getOwnPropertySymbols(gameMode)) {
      if (gameMode[turn].isManaged) {
        const [name, character] = Characters.randomExcluding(
          playerCharacter[TURN.X],
          playerCharacter[TURN.O],
        );
        changePlayerName(turn, name);
        changePlayerCharacter(turn, character);
      }
    }
  }

  function onWinner(winnerTurn) {
    confetti();
    setWinner(winnerTurn);
  }

  function onDraw() {
    setDraw(true);
  }

  function resetGame() {
    const nextGame = gameId + 1;
    setGameId(nextGame);
    setWinner(null);
    setDraw(false);
  }

  function changePlayerCharacter(turn, newCharacter) {
    const newPlayerCharacter = { ...playerCharacter };
    newPlayerCharacter[turn] = newCharacter;
    setPlayerCharacter(newPlayerCharacter);
  }

  function changePlayerName(turn, newName) {
    const newPlayerName = { ...playerName };
    newPlayerName[turn] = newName;
    setPlayerName(newPlayerName);
  }

  function players() {
    const players = { ...gameMode };
    players[TURN.X].symbol = playerCharacter[TURN.X];
    players[TURN.O].symbol = playerCharacter[TURN.O];
    return players;
  }

  return (
    <main className="game">
      <img src={logo} alt="Tic Tac Toe" />

      <section className="game-options">
        <button
          className={clsx(
            "game-mode-btn",
            gameMode === GAME_MODE.ONE_P && "is-selected",
          )}
          onClick={() => setGameMode(GAME_MODE.ONE_P)}
        >
          1 jugador
        </button>
        <button
          className={clsx(
            "game-mode-btn",
            gameMode === GAME_MODE.TWO_P && "is-selected",
          )}
          onClick={() => {
            setGameMode(GAME_MODE.TWO_P);
          }}
        >
          2 jugadores
        </button>
        <button className="game-reset-btn" onClick={resetGame}>
          Empezar de nuevo
        </button>
      </section>

      <section className="board">
        <Board
          key={gameId}
          players={players()}
          onWinner={onWinner}
          onDraw={onDraw}
          onChangeTurn={setTurn}
        />
      </section>

      <section className="turn">
        <Player
          key={playerCharacter[TURN.X].type.name}
          allSymbols={Characters.ALL}
          nonEligibleSymbols={[playerCharacter[TURN.O]]}
          initialSymbol={playerCharacter[TURN.X]}
          initialName={playerName[TURN.X]}
          turn={TURN.X}
          hasTurn={turn === TURN.X}
          isEditable={gameMode[TURN.X].isManaged === false}
          onChangeSymbol={changePlayerCharacter}
          onChangeName={changePlayerName}
        />
        <Player
          key={playerCharacter[TURN.O].type.name}
          allSymbols={Characters.ALL}
          nonEligibleSymbols={[playerCharacter[TURN.X]]}
          initialSymbol={playerCharacter[TURN.O]}
          initialName={playerName[TURN.O]}
          turn={TURN.O}
          hasTurn={turn === TURN.O}
          isEditable={gameMode[TURN.O].isManaged === false}
          onChangeSymbol={changePlayerCharacter}
          onChangeName={changePlayerName}
        />
      </section>

      {winner || draw ? (
        <GameOverModal
          winner={
            winner
              ? { symbol: playerCharacter[winner], name: playerName[winner] }
              : null
          }
          resetGame={resetGame}
        />
      ) : null}
    </main>
  );
}

export default App;
