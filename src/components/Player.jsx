import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { noop } from '../utils'

export default function Player({
  allCharacters,
  nonEligibleCharacters,
  initialCharacter,
  initialName,
  turn,
  hasTurn,
  isEditable,
  onChangeCharacter = noop,
  onChangeName = noop
}) {
  const [character, setCharacter] = useState(initialCharacter)
  const [name, setName] = useState(initialName)
  const [choosingCharacter, setChoosingCharacter] = useState(false)

  useEffect(() => {
    onChangeCharacter(turn, character)
  }, [onChangeCharacter, turn, character])

  useEffect(() => {
    onChangeName(turn, name)
  }, [onChangeName, turn, name])

  const toggleChoosingCharacter = () => setChoosingCharacter((v) => !v)

  return (
    <div className='player'>
      <button
        className={clsx('player__character', hasTurn && 'is-selected')}
        disabled={!isEditable}
        aria-label={`change turn ${turn} character`}
        onClick={toggleChoosingCharacter}
      >
        {character.image}
      </button>
      <input
        type='text'
        name='player-name'
        className='player__name'
        autoCorrect='false'
        autoComplete='false'
        spellCheck='false'
        value={name}
        readOnly={!isEditable}
        onChange={(e) => setName(e.target.value)}
      />
      {choosingCharacter
        ? (
          <ul className='ui-list symbol-list'>
            {allCharacters.map((character) => (
              <li key={character.name}>
                <button
                  className='symbol-btn'
                  aria-label={`select ${character.name}`}
                  disabled={nonEligibleCharacters.includes(character)}
                  onClick={() => {
                    setCharacter(character)
                    toggleChoosingCharacter()
                  }}
                >
                  {character.image}
                </button>
              </li>
            ))}
          </ul>
          )
        : null}
    </div>
  )
}
