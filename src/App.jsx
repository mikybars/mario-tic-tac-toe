import confetti from "canvas-confetti";
import { useState } from "react";
import "./App.css";
import { Board, TURNS } from "./components/Board";
import { GameOverModal } from "./components/GameOverModal";
import { Square } from "./components/Square";

function App() {
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [gameId, setGameId] = useState(1);
  const [turn, setTurn] = useState(null);

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

      <button onClick={resetGame}>Empezar de nuevo</button>

      <section className="game">
        <Board
          key={gameId}
          onWinner={onWinner}
          onDraw={onDraw}
          changeTurn={setTurn}
        />
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      {winner || draw ? (
        <GameOverModal winner={winner} isDraw={draw} resetGame={resetGame} />
      ) : null}
    </main>
  );
}

export default App;
