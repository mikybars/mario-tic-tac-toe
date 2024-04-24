import Mario from "./assets/mario.svg?react";
import Koopa from "./assets/koopa.svg?react";
import Bowser from "./assets/bowser.svg?react";
import Toad from "./assets/toad.svg?react";
import Goomba from "./assets/goomba.svg?react";
import Racoon from "./assets/racoon.svg?react";
import Star from "./assets/star.svg?react";
import Pirana from "./assets/pirana.svg?react";

const characters = {
  Mario: <Mario />,
  Koopa: <Koopa />,
  Bowser: <Bowser />,
  Toad: <Toad />,
  Goomba: <Goomba />,
  Racoon: <Racoon />,
  Star: <Star />,
  Pirana: <Pirana />,
};

export default {
  ALL: Object.values(characters),

  random() {
    const characterIndex = Math.floor(
      Math.random() * Object.keys(characters).length,
    );
    return Object.entries(characters)[characterIndex];
  },

  randomExcluding() {
    const [name, character] = this.random();
    if (!Array.prototype.includes.call(arguments, character)) {
      return [name, character];
    }
    return this.randomExcluding(...arguments);
  },
};
