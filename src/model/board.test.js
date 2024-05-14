import { createBoardFromSketch } from '../testUtils'
import { emptyBoard as emptyBoardFactory } from './board'
import each from 'jest-each'

describe('Board model', () => {
  const emptyBoard = emptyBoardFactory()

  describe('.isEmpty', () => {
    test('empty board is empty', () => {
      expect(emptyBoard.isEmpty()).toBeTruthy()
    })

    test('non empty board is not empty', () => {
      expect(
        emptyBoard
          .afterPlaying({
            symbol: 'x',
            square: 0
          })
          .isEmpty()
      ).toBeFalsy()
    })
  })

  describe('.isTaken', () => {
    test('all squares in an empty board are not taken', () => {
      const notTaken = (_, i) => !emptyBoard.isTaken(i)
      expect([...emptyBoard].every(notTaken)).toBeTruthy()
    })

    test('a square is taken after played', () => {
      expect(
        emptyBoard.afterPlaying({ symbol: 'x', square: 0 }).isTaken(0)
      ).toBeTruthy()
    })
  })

  describe('.emptySquaresExcluding', () => {
    test('an empty board has 9 empty squares', () => {
      expect(emptyBoard.emptySquaresExcluding()).toHaveLength(9)
    })

    test('an empty board has 7 empty squares when excluding 2 of them', () => {
      expect(emptyBoard.emptySquaresExcluding(2, 5))
        .toHaveLength(7)
        .not.toContain(2, 5)
    })

    test('no empty squares on a full board', () => {
      const allSquaresPlayed = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
        symbol: 'x',
        square: i
      }))
      expect(
        emptyBoard.afterPlaying(...allSquaresPlayed).emptySquaresExcluding()
      ).toHaveLength(0)
    })

    test('a square is not empty after played', () => {
      expect(
        emptyBoard
          .afterPlaying({ symbol: 'x', square: 3 })
          .emptySquaresExcluding()
      )
        .toHaveLength(8)
        .not.toContain(3)
    })
  })

  describe('.totalMovesBy', () => {
    test('total moves is 0 on an empty board', () => {
      expect(emptyBoard.totalMovesBy('x')).toBe(0)
    })

    test('total moves is 0 when not played yet', () => {
      expect(
        emptyBoard.afterPlaying({ symbol: 'x', square: 0 }).totalMovesBy('o')
      ).toBe(0)
    })

    test('total moves is 3 when played 3 times', () => {
      expect(
        emptyBoard
          .afterPlaying(
            { symbol: 'x', square: 0 },
            { symbol: 'x', square: 2 },
            { symbol: 'x', square: 4 },
            { symbol: 'o', square: 1 },
            { symbol: 'o', square: 3 }
          )
          .totalMovesBy('x')
      ).toBe(3)
    })
  })

  describe(".allWinnerMovesBy('x')", () => {
    each`
      board         | expectedWinnerMoves | description
      ${`
         | | | |
         | | | |
         | | | |`}  | ${[]}               | ${'no winner moves on empty board'}
      ${`
         |x|x| |
         | |o| |
         | | | |`}  | ${[2]}              | ${'winner 1st row'}
      ${`
         | | |o|
         | |x| |
         | |x| |`}  | ${[1]}              | ${'winner 2nd col'}
      ${`
         |x|o| |
         | | | |
         | | |x|`}  | ${[4]}              | ${'winner 1st diag'}
      ${`
         |o| | |
         | |x| |
         |x| | |`}  | ${[2]}              | ${'winner 2nd diag'}
      ${`
         |x|o|x|
         |o| |o|
         |x|o|x|`}  | ${[4]}              | ${'1 winner move, many combos'}
      ${`
         |x|x|o|
         | | | |
         | | | |`}  | ${[]}               | ${'win blocked 1st row'}
      ${`
         | | |o|
         | | |x|
         | | |x|`}  | ${[]}               | ${'win blocked 3rd col'}
      ${`
         |x| | |
         | |o| |
         | | |x|`}  | ${[]}               | ${'win blocked 1st diag'}
      ${`
         | | |o|
         | |x| |
         |x| | |`}  | ${[]}               | ${'win blocked 2nd diag'}
      ${`
         |x|x|o|
         | |x|o|
         | | | |`}  | ${[7, 8]}           | ${'2 winner moves'}
      ${`
         |x|x| |
         |o|x|o|
         | | | |`}  | ${[2, 7, 8]}        | ${'3 winner moves'}
    `.test(
        '$description $expectedWinnerMoves $board',
        ({ board, expectedWinnerMoves }) => {
          expect(createBoardFromSketch(board).allWinnerMovesBy('x')).toEqual(
            expectedWinnerMoves
          )
        }
      )
  })

  describe('.gameOver', () => {
    each`
      board
      ${`
         |x|o|x|
         |o|x|o|
         |o|x|o|`}
      ${`
         |o|x|o|
         |x|x|o|
         |o|o|x|`}
    `.test('ends in draw $board', ({ board }) => {
        expect(createBoardFromSketch(board).gameOver?.draw).toBeTruthy()
      })

    each`
      board
      ${`
         |x|x|x|
         |o|o| |
         | |o| |`}
      ${`
         |x|o|x|
         |o|x|o|
         |o|x|x|`}
    `.test('x wins $board', ({ board }) => {
        const countOccurrences = (str, char) => str.split(char).length - 1

        const gameOver = createBoardFromSketch(board).gameOver

        expect(gameOver).toBeDefined()
        const { combo, ...winner } = gameOver.winner
        expect(winner).toEqual({
          symbol: 'x',
          numberOfMoves: countOccurrences(board, 'x')
        })
      })

    each`
      board
      ${`
         | | | |
         | | | |
         | | | |`}
      ${`
         |x| |x|
         |o|x|o|
         |o| |o|`}
    `.test('game is not over yet $board', ({ board }) => {
        expect(createBoardFromSketch(board).gameOver?.winner).toBeUndefined()
      })
  })
})
