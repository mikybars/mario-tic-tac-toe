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
 * Represents a game board, typically used in games like Tic Tac Toe.
 * This class handles the state of the board and provides methods to manipulate and query the board state.
 */
export class Board {
  /**
   * Creates a new instance of the board.
   * @param state - An optional array representing the initial state of the board.
   *                 If not provided, initializes the board with 9 empty squares.
   */
  constructor(state) {
    this.squares = state ?? Array(9).fill(EMPTY);
    this.gameOver = this.#calculateGameOver();
    Object.freeze(this);
  }

  /**
   * Calculates whether the game has ended either by a win or a draw.
   * @returns Returns an object indicating the game outcome or undefined if the game isn't over.
   * @private
   */
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

  /**
   * Finds the first winning combination on the board.
   * @returns The index set of the winning combination, or undefined if no winner yet.
   * @private
   */
  #findFirstWinnerCombo() {
    return WINNING_COMBINATIONS.find((wc) =>
      wc
        .map((i) => this.squares[i])
        .every((square, _, wc) => square !== EMPTY && square === wc[0]),
    );
  }

  /**
   * Checks if all squares on the board are empty.
   * @returns True if all squares are empty, false otherwise.
   */
  isEmpty() {
    return this.squares.every((square) => square === EMPTY);
  }

  /**
   * Determines if a specific square is occupied.
   * @param   square - The index of the square to check.
   * @returns True if the square is taken, false otherwise.
   */
  isTaken(square) {
    return this.squares[square] !== EMPTY;
  }

  /**
   * Returns indices of empty squares excluding specified indices.
   * @param   squares - Indices to exclude from the check.
   * @returns A list of indices that are empty and not excluded.
   */
  emptySquaresExcluding(...squares) {
    return this.squares
      .flatMap((square, index) => (square === EMPTY ? [index] : []))
      .filter((emptySquare) => !squares.includes(emptySquare));
  }

  /**
   * Calculates all potential winning moves for a given player symbol.
   * @param   symbol - The player symbol to check for potential winning moves.
   * @returns An array of indices where playing the symbol could lead to a win.
   */
  allWinnerMovesBy(symbol) {
    const winnerInOne = (wc) =>
      wc.filter((i) => this.squares[i] === EMPTY).length === 1 &&
      wc.filter((i) => this.squares[i] === symbol).length === 2;
    const emptySquare = (wc) => wc.find((i) => this.squares[i] === EMPTY);
    return Array.from(
      new Set(WINNING_COMBINATIONS.filter(winnerInOne).map(emptySquare)),
    );
  }

  /**
   * Counts the total number of moves made by a given symbol on the board.
   * @param   symbol - The symbol to count moves for.
   * @returns Total moves made by the symbol.
   */
  totalMovesBy(symbol) {
    return this.squares.filter((square) => square === symbol).length;
  }

  /**
   * Returns a new Board instance representing the state of the board after playing the given moves.
   * @param   moves - Moves to apply on the board, each move should be an object of the structure {symbol, square}.
   * @returns A new board instance with the moves applied.
   */
  afterPlaying(...moves) {
    const newState = [...this.squares];
    moves.forEach(({ symbol, square }) => (newState[square] = symbol));
    return new Board(newState);
  }

  /**
   * Allows iteration over the board's squares.
   * @returns An iterator for the squares of the board.
   */
  [Symbol.iterator]() {
    return this.squares[Symbol.iterator]();
  }
}
