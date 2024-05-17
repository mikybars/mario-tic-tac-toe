import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import characters from '../characters'
import { Player as PlayerModel } from '../model/player'
import { TURN } from '../model/turn'
import { Board } from './Board'
import { findCharacter } from '../testUtils'

describe('<Board 1-players />', () => {
  let user
  let squares
  const onePlayerBoard = {
    cpuTurn: TURN.O,
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
    render(<Board {...onePlayerBoard} />)
    squares = document.querySelectorAll('.square')

    user = userEvent.setup()
  })

  test('player 1 must wait his turn after playing', async() => {
    await user.click(squares[0])
    await user.click(squares[1])

    expect(await screen.findAllByRole('img')).toHaveLength(1)
    await findCharacter('Mario')
  })

  test('player 2 plays after player 1', async() => {
    await user.click(squares[0])

    vi.waitFor(async() => {
      expect(await screen.findAllByRole('img')).toHaveLength(2)
      await findCharacter('Bowser')
    })
  })
})
