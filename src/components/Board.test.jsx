import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import characters from '../characters'
import { Player as PlayerModel } from '../model/player'
import { TURN } from '../model/turn'
import { Board } from './Board'

describe('<Board />', () => {
  let component
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

  beforeEach(() => {
    user = userEvent.setup()
    component = render(<Board {...board} />)
    squares = component.container.querySelectorAll('.square')
  })

  test('starts empty', () => {
    expect(component.queryAllByRole('img')).toHaveLength(0)
  })

  test('notify change turn', async() => {
    await Promise.all([
      user.click(squares[0]),
      user.click(squares[4]),
      user.click(squares[6])
    ])

    expect(board.onChangeTurn).toHaveBeenCalledWith(TURN.O)
    expect(board.onChangeTurn).toHaveBeenCalledWith(TURN.X)
    expect(board.onChangeTurn).toHaveBeenCalledWith(TURN.O)
  })
})
