import React from 'react'

import Bowser from './assets/bowser.svg'
import Goomba from './assets/goomba.svg'
import Koopa from './assets/koopa.svg'
import Mario from './assets/mario.svg'
import Pirana from './assets/pirana.svg'
import Racoon from './assets/racoon.svg'
import Star from './assets/star.svg'
import Toad from './assets/toad.svg'
import { shuffled } from './utils'

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
