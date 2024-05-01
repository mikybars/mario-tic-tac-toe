import { Square } from "./Square";
import question from "../assets/question.gif";

export function GameOverModal({ winner, resetGame }) {
  const gameResult = winner ? `¡${winner.name} es el ganador!` : "Empate";
  return (
    <section className="modal">
      <div className="game-over-modal">
        <h2 className="game-result__text">{gameResult}</h2>
        <div className="game-result__symbol">
          {winner ? (
            <Square>{winner.character}</Square>
          ) : (
            <img src={question} alt="question mark" />
          )}
        </div>
        <button className="game-reset-btn" onClick={resetGame}>
          Empezar de nuevo
        </button>
      </div>
    </section>
  );
}
