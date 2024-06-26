import { findAllByRole, findByRole } from '@testing-library/dom'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { App } from './App'

describe('<App />', () => {
  let user

  beforeEach(() => {
    render(<App />)
    user = userEvent.setup()
  })

  test('players are given different random characters', async() => {
    const changeCharacterBtns = screen.getAllByRole('button', {
      name: /change turn/i
    })

    expect(changeCharacterBtns).toHaveLength(2)
    expect(await findByRole(changeCharacterBtns[0], 'img')).not.toEqual(
      await findByRole(changeCharacterBtns[1], 'img')
    )
  })

  test('user can change symbol', async() => {
    const changeUserCharacterBtn = screen.getByRole('button', {
      name: /change turn x character/i
    })

    await user.click(changeUserCharacterBtn)
    const firstPossibleChoiceBtn = screen
      .getAllByRole('button', {
        name: /select/i
      })
      .find((btn) => !btn.disabled)
    expect(firstPossibleChoiceBtn).toBeDefined()

    await user.click(firstPossibleChoiceBtn)

    expect(
      screen.queryAllByRole('button', {
        name: /select/i
      })
    ).toHaveLength(0) // select choices should go away
    expect(await findByRole(changeUserCharacterBtn, 'img')).toEqual(
      await findByRole(firstPossibleChoiceBtn, 'img')
    )
  })

  test("user cannot select the other player's symbol", async() => {
    const changeUserCharacterBtn = screen.getByRole('button', {
      name: /change turn x character/i
    })
    const changeCpuCharacterBtn = screen.getByRole('button', {
      name: /change turn o character/i
    })

    await user.click(changeUserCharacterBtn)
    const disabledCharacterBtn = screen
      .getAllByRole('button', {
        name: /select/i
      })
      .find((btn) => btn.disabled)
    expect(disabledCharacterBtn).toBeDefined()

    expect(await findByRole(disabledCharacterBtn, 'img')).toEqual(
      await findByRole(changeCpuCharacterBtn, 'img')
    )
  })

  test('cpu cannot change symbol', async() => {
    const changeCpuCharacterBtn = screen.getByRole('button', {
      name: /change turn o character/i
    })

    await user.click(changeCpuCharacterBtn)

    expect(
      screen.queryAllByRole('button', {
        name: /select/i
      })
    ).toHaveLength(0)
  })

  test('reset game starts an empty board', async() => {
    const board = document.querySelector('.board')
    const squares = document.querySelectorAll('.square')
    await user.click(squares[0])
    expect(await findAllByRole(board, 'img')).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: /empezar/i }))

    // expect(await findAllByRole(board, "img")).toHaveLength(0);
  })
})
