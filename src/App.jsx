import confetti from "canvas-confetti";
import clsx from "clsx";
import { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import Mario from "./assets/mario.svg?react";
import Koopa from "./assets/koopa.svg?react";
import Bowser from "./assets/bowser.svg?react";
import Toad from "./assets/toad.svg?react";
import Goomba from "./assets/goomba.svg?react";
import Racoon from "./assets/racoon.svg?react";
import Star from "./assets/star.svg?react";
import Pirana from "./assets/pirana.svg?react";
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

const PLAYER_SYMBOLS = [
  <Mario />,
  <Koopa />,
  <Bowser />,
  <Toad />,
  <Goomba />,
  <Racoon />,
  <Star />,
  <Pirana />,
];

function App() {
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [gameId, setGameId] = useState(1);
  const [turn, setTurn] = useState(null);
  const [gameMode, setGameMode] = useState(GAME_MODE.ONE_P);
  const [playerSymbol, setPlayerSymbol] = useState({
    [TURN.X]: PLAYER_SYMBOLS[0],
    [TURN.O]: PLAYER_SYMBOLS[1],
  });
  const [playerName, setPlayerName] = useState({
    [TURN.X]: "Jugador 1",
    [TURN.O]: "Jugador 2",
  });

  useEffect(() => {
    for (const turn of Object.getOwnPropertySymbols(gameMode)) {
      if (gameMode[turn].isManaged) {
        const randomSymbol = pickRandomSymbolExcluding([
          playerSymbol[TURN.X],
          playerSymbol[TURN.O],
        ]);
        changePlayerName(
          turn,
          extractFilenameFromReactSvgComponent(randomSymbol),
        );
        changePlayerSymbol(turn, randomSymbol);
      }
    }
  }, [gameMode]);

  function pickRandomSymbolExcluding(excludeSymbols) {
    const randomSymbol =
      PLAYER_SYMBOLS[Math.floor(Math.random() * PLAYER_SYMBOLS.length)];
    if (!excludeSymbols.includes(randomSymbol)) {
      return randomSymbol;
    }
    return pickRandomSymbolExcluding(excludeSymbols);
  }

  // awful hack
  function extractFilenameFromReactSvgComponent(symbol) {
    return symbol.type.name.replace(/^Svg/, "");
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

  function changePlayerSymbol(turn, newSymbol) {
    const newPlayerSymbol = { ...playerSymbol };
    newPlayerSymbol[turn] = newSymbol;
    setPlayerSymbol(newPlayerSymbol);
  }

  function changePlayerName(turn, newName) {
    const newPlayerName = { ...playerName };
    newPlayerName[turn] = newName;
    setPlayerName(newPlayerName);
  }

  function players() {
    const players = { ...gameMode };
    players[TURN.X].symbol = playerSymbol[TURN.X];
    players[TURN.O].symbol = playerSymbol[TURN.O];
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
          key={playerSymbol[TURN.X].type.name}
          allSymbols={PLAYER_SYMBOLS}
          nonEligibleSymbols={[playerSymbol[TURN.O]]}
          initialSymbol={playerSymbol[TURN.X]}
          initialName={playerName[TURN.X]}
          turn={TURN.X}
          hasTurn={turn === TURN.X}
          isEditable={gameMode[TURN.X].isManaged === false}
          onChangeSymbol={changePlayerSymbol}
          onChangeName={changePlayerName}
        />
        <Player
          key={playerSymbol[TURN.O].type.name}
          allSymbols={PLAYER_SYMBOLS}
          nonEligibleSymbols={[playerSymbol[TURN.X]]}
          initialSymbol={playerSymbol[TURN.O]}
          initialName={playerName[TURN.O]}
          turn={TURN.O}
          hasTurn={turn === TURN.O}
          isEditable={gameMode[TURN.O].isManaged === false}
          onChangeSymbol={changePlayerSymbol}
          onChangeName={changePlayerName}
        />
      </section>

      {winner || draw ? (
        <GameOverModal
          winner={
            winner
              ? { symbol: playerSymbol[winner], name: playerName[winner] }
              : null
          }
          resetGame={resetGame}
        />
      ) : null}
    </main>
  );
}

export default App;
