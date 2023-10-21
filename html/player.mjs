export class Player {
  constructor (aName) {
    this.name = aName
    this.health = 100
    this.armour = 100
    this.damage = 20
  }

  isHealthy () {
    return this.health > 0
  }

  moveOneStep () {
    this.health -= 1
  }
}
