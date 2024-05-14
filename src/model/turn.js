export const TURN = {
  X: {
    toString: () => 'X'
  },
  O: {
    toString: () => 'O'
  }
}

TURN.X.other = TURN.O
TURN.O.other = TURN.X
