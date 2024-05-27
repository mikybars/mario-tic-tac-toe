import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { Board } from './Board'
import characters from '../characters'
import { Player as PlayerModel } from '../model/player'
import { TURN } from '../model/turn'

describe('<Board />', () => {
  let user
  let squares
  const board = {
    onChangeTurn: vi.fn(),
    initialTurn: TURN.X,
    players: new Map([
      [
        TURN.X,
        new PlayerModel({ character: characters.Mario, name: 'Jugador 1' })
      ],
      [
        TURN.O,
        new PlayerModel({ character: characters.Bowser, name: 'Jugador 2' })
      ]
    ])
  }
  const clickInSequence = (...moves) =>
    Promise.all(moves.map((i) => user.click(squares[i])))

  beforeEach(() => {
    render(<Board {...board} />)
    squares = document.querySelectorAll('.square')

    user = userEvent.setup()
  })

  test('starts empty', () => {
    expect(screen.queryAllByRole('img')).toHaveLength(0)
  })

  test('notify change turn', async() => {
    await clickInSequence(0, 4, 6)

    expect(board.onChangeTurn).nthCalledWith(1, TURN.O)
    expect(board.onChangeTurn).nthCalledWith(2, TURN.X)
    expect(board.onChangeTurn).nthCalledWith(3, TURN.O)
  })
})
