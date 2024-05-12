const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const EMPTY = null;

export const emptyBoard = () => new Board();

/**
 * Board.
 */
export class Board {
  constructor(state) {
    this.squares = state ?? Array(9).fill(EMPTY);
    this.gameOver = this.#calculateGameOver();
    Object.freeze(this);
  }

  #calculateGameOver() {
    const winnerCombo = this.#findFirstWinnerCombo();
    const boardIsFull = this.squares.every((square) => square !== EMPTY);

    if (winnerCombo) {
      const winnerSymbol = this.squares[winnerCombo[0]];
      return {
        winner: {
          symbol: winnerSymbol,
          combo: winnerCombo,
          numberOfMoves: this.totalMovesBy(winnerSymbol),
        },
      };
    } else if (boardIsFull) {
      return {
        draw: true,
      };
    }
  }

  #findFirstWinnerCombo() {
    return WINNING_COMBINATIONS.find((wc) =>
      wc
        .map((i) => this.squares[i])
        .every((square, _, wc) => square !== EMPTY && square === wc[0]),
    );
  }

  isEmpty() {
    return this.squares.every((square) => square === EMPTY);
  }

  isTaken(square) {
    return this.squares[square] !== EMPTY;
  }

  emptySquaresExcluding(...squares) {
    return this.squares
      .flatMap((square, index) => (square === EMPTY ? [index] : []))
      .filter((emptySquare) => !squares.includes(emptySquare));
  }

  allWinnerMovesBy(symbol) {
    const winnerInOne = (wc) =>
      wc.filter((i) => this.squares[i] === EMPTY).length === 1 &&
      wc.filter((i) => this.squares[i] === symbol).length === 2;
    const emptySquare = (wc) => wc.find((i) => this.squares[i] === EMPTY);
    return Array.from(
      new Set(WINNING_COMBINATIONS.filter(winnerInOne).map(emptySquare)),
    );
  }

  totalMovesBy(symbol) {
    return this.squares.filter((square) => square === symbol).length;
  }

  afterPlaying(...moves) {
    const newState = [...this.squares];
    moves.forEach(({ symbol, square }) => (newState[square] = symbol));
    return new Board(newState);
  }

  [Symbol.iterator]() {
    return this.squares[Symbol.iterator]();
  }
}
