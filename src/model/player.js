export class Player {
  constructor({ character, name }) {
    this.character = character
    this.name = name
  }

  withCharacter(newCharacter) {
    return new Player({ ...this, character: newCharacter })
  }

  withName(newName) {
    return new Player({ ...this, name: newName })
  }

  clone() {
    return new Player({ ...this })
  }
}
