import React, { Suspense } from 'react'
import { shuffled } from './utils'

const names = [
  'Bowser',
  'Goomba',
  'Koopa',
  'Mario',
  'Pirana',
  'Racoon',
  'Star',
  'Toad'
]

const characters = Object.fromEntries(
  names
    .map((name) => [
      name,
      React.lazy(() => import(`./assets/${name.toLowerCase()}.svg?react`))
    ])
    .map(([name, Character]) => [
      name,
      {
        name,
        image: (
          <Suspense fallback={<div>Loading...</div>}>
            <Character title={name} />
          </Suspense>
        )
      }
    ])
)

export default {
  ...characters,

  ALL: Object.values(characters),

  randomCharacters(count) {
    return shuffled(this.ALL).slice(0, Math.min(count, this.ALL.length))
  }
}
