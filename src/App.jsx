import confetti from "canvas-confetti";
import { useState } from "react";
import "./App.css";
import { Board, TURN } from "./components/Board";
import { GameOverModal } from "./components/GameOverModal";
import { Square } from "./components/Square";

const GAME_MODE = {
  ONE_P: {
    [TURN.X]: { managed: false },
    [TURN.O]: { managed: true },
  },
  TWO_P: {
    [TURN.X]: { managed: false },
    [TURN.O]: { managed: false },
  },
};

function App() {
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [gameId, setGameId] = useState(1);
  const [turn, setTurn] = useState(null);
  const [gameMode, setGameMode] = useState(GAME_MODE.ONE_P);

  function onWinner(square) {
    confetti();
    setWinner(square);
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
          playersOpts={gameMode}
          onWinner={onWinner}
          onDraw={onDraw}
          onChangeTurn={setTurn}
        />
      </section>

      <section className="turn">
        <Square isSelected={turn === TURN.X}>x</Square>
        <Square isSelected={turn === TURN.O}>o</Square>
      </section>

      {winner || draw ? (
        <GameOverModal winner={winner} isDraw={draw} resetGame={resetGame} />
      ) : null}
    </main>
  );
}

export default App;
