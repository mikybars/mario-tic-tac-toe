import Mario from "./assets/mario.svg?react";
import Koopa from "./assets/koopa.svg?react";
import Bowser from "./assets/bowser.svg?react";
import Toad from "./assets/toad.svg?react";
import Goomba from "./assets/goomba.svg?react";
import Racoon from "./assets/racoon.svg?react";
import Star from "./assets/star.svg?react";
import Pirana from "./assets/pirana.svg?react";

const characters = {
  Mario: <Mario title="Mario" />,
  Koopa: <Koopa title="Koopa" />,
  Bowser: <Bowser title="Bowser" />,
  Toad: <Toad title="Toad" />,
  Goomba: <Goomba title="Goomba" />,
  Racoon: <Racoon title="Racoon" />,
  Star: <Star title="Star" />,
  Pirana: <Pirana title="Pirana" />,
};

function generateDistinctRandomNumbers(n, bound) {
  const numbers = new Set();
  while (numbers.size < n) {
    numbers.add(Math.floor(Math.random() * bound));
  }
  return Array.from(numbers);
}

export default {
  ...characters,

  ALL: Object.values(characters),

  randomCharacters(count) {
    const numberOfCharacters = Object.entries(characters).length;
    return generateDistinctRandomNumbers(count, numberOfCharacters).map(
      (i) => Object.entries(characters)[i],
    );
  },
};
