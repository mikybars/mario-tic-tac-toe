import { Square } from "./Square";

export function GameOverModal({ winner, isDraw, resetGame }) {
  const winnerText = isDraw ? "Empate" : `Ganó ${winner.description}`;
  return (
    <section className="winner">
      <div className="text">
        <h2>{winnerText}</h2>
        <header className="win">
          {winner ? <Square>{winner.description}</Square> : null}
        </header>
        <footer>
          <button onClick={resetGame}>Empezar de nuevo</button>
        </footer>
      </div>
    </section>
  );
}
