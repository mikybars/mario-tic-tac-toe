import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { GameOverModal } from './GameOverModal'
import characters from '../characters'
import '@testing-library/jest-dom'

describe('<GameOverModal />', () => {
  let user
  const modal = {
    winner: {
      name: 'pepe',
      character: characters.Goomba
    },
    resetGame: vi.fn()
  }

  beforeEach(() => {
    user = userEvent.setup()
  })

  test('displays the winner name and symbol', async() => {
    render(<GameOverModal {...modal} />)
    screen.getByText(modal.winner.name, { exact: false })
    expect(screen.getByTitle('Goomba')).toBeInTheDocument()
  })

  test('reports draw', () => {
    render(<GameOverModal resetGame={vi.fn()} />)
    screen.getByText('empate', { exact: false })
  })

  test('resets game', async() => {
    render(<GameOverModal {...modal} />)
    await user.click(screen.getByText('empezar', { exact: false }))
    expect(modal.resetGame).toHaveBeenCalled()
  })
})
