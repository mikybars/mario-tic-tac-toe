import { shuffled } from './utils'

import Bowser from './assets/bowser.svg?react'
import Goomba from './assets/goomba.svg?react'
import Koopa from './assets/koopa.svg?react'
import Mario from './assets/mario.svg?react'
import Pirana from './assets/pirana.svg?react'
import Racoon from './assets/racoon.svg?react'
import Star from './assets/star.svg?react'
import Toad from './assets/toad.svg?react'
import React from 'react'

const imageComponents = { Mario, Bowser, Goomba, Koopa, Pirana, Racoon, Star, Toad }

const characters = Object.fromEntries(
  Object.entries(imageComponents).map(([name, component]) => [
    name,
    {
      name,
      image: React.createElement(component, { title: name })
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
