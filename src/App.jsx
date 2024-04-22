import confetti from "canvas-confetti";
import { useState } from "react";
import "./App.css";
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

const ALL_SYMBOLS = ["😂", "😍", "😭", "🎨", "🥶"];

function App() {
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [gameId, setGameId] = useState(1);
  const [turn, setTurn] = useState(null);
  const [gameMode, setGameMode] = useState(GAME_MODE.ONE_P);
  const [playerSymbol, setPlayerSymbol] = useState({
    [TURN.X]: ALL_SYMBOLS[0],
    [TURN.O]: ALL_SYMBOLS[1],
  });
  const [playerName, setPlayerName] = useState({
    [TURN.X]: "Jugador 1",
    [TURN.O]: "Jugador 2",
  });

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
    <main className="board">
      <h1>Tic tac toe</h1>

      <section className="game-options">
        <button
          className={`game-mode-btn ${gameMode === GAME_MODE.ONE_P ? "is-selected" : ""}`}
          onClick={() => setGameMode(GAME_MODE.ONE_P)}
        >
          1 jugador
        </button>
        <button
          className={`game-mode-btn ${gameMode === GAME_MODE.TWO_P ? "is-selected" : ""}`}
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

      <section className="game">
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
          key={TURN.X.description}
          allSymbols={ALL_SYMBOLS}
          nonEligibleSymbols={[playerSymbol[TURN.O]]}
          initialSymbol={playerSymbol[TURN.X]}
          initialName={playerName[TURN.X]}
          turn={TURN.X}
          hasTurn={turn === TURN.X}
          onChangeSymbol={changePlayerSymbol}
          onChangeName={changePlayerName}
        />
        <Player
          key={TURN.O.description}
          allSymbols={ALL_SYMBOLS}
          nonEligibleSymbols={[playerSymbol[TURN.X]]}
          initialSymbol={playerSymbol[TURN.O]}
          initialName={playerName[TURN.O]}
          turn={TURN.O}
          hasTurn={turn === TURN.O}
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
