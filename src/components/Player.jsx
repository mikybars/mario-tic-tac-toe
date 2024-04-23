import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Player({
  allSymbols,
  nonEligibleSymbols,
  initialSymbol,
  initialName,
  turn,
  hasTurn,
  onChangeSymbol,
  onChangeName,
}) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [name, setName] = useState(initialName);
  const [choosingSymbol, setChoosingSymbol] = useState(false);

  useEffect(() => {
    onChangeSymbol(turn, symbol);
  }, [symbol]);

  useEffect(() => {
    onChangeName(turn, name);
  }, [name]);

  function toggleChoosingSymbol() {
    setChoosingSymbol(!choosingSymbol);
  }

  return (
    <div className="player">
      <button
        className={clsx("player__symbol", hasTurn && "is-selected")}
        onClick={toggleChoosingSymbol}
      >
        {symbol}
      </button>
      <input
        type="text"
        className="player__name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {choosingSymbol ? (
        <ul className="ui-list symbol-list">
          {allSymbols.map((symbol) => (
            <li key={symbol}>
              <button
                className={clsx(
                  "symbol-btn",
                  nonEligibleSymbols.includes(symbol) && "is-disabled",
                )}
                onClick={() => {
                  setSymbol(symbol);
                  toggleChoosingSymbol();
                }}
              >
                {symbol}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
