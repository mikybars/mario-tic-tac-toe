import { Square } from "./Square";

export function GameOverModal({ winner, resetGame }) {
  const winnerText = winner ? `¡${winner.name} es el ganador!` : "Empate";
  return (
    <section className="winner">
      <div className="text">
        <h2>{winnerText}</h2>
        <header className="win">
          {winner ? <Square>{winner.symbol}</Square> : null}
        </header>
        <footer>
          <button onClick={resetGame}>Empezar de nuevo</button>
        </footer>
      </div>
    </section>
  );
}
