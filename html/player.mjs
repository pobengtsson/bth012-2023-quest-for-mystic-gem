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

  hurt(damage) {
    console.log(`Before: ${this.health} damage: ${damage} after: ${this.health - damage}`)
    this.health -= damage
  }
  heal(healing) {
    console.log(`Before: ${this.health} heal: ${healing} after: ${this.health - healing}`)
    this.health += healing
  }
}
