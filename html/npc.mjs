import { randomPosition } from "./gamemap.mjs"

export class NonPlayerCharacter {
  constructor() {}

  getActionMessage (screen, player, map, gemPos) {
    throw Error('Not Implemented in the subclass')
  }
}

export class Monster extends NonPlayerCharacter {
  constructor (aSpecies, minDamage, maxDamage, prng) {
    super()
    this.species = aSpecies
    this.damage = minDamage + Math.floor(prng()*(maxDamage-minDamage))
  }

  getActionMessage (screen, player, map, gemPos) {
    console.log(`monster: ${this.species} damage: ${this.damage}`)
    return {
      txt: `Oh no, a ${this.species.toUpperCase()}!!
You cannot escape. You have to fight the monster.
In the fight you get hurt and loose ${this.damage} in health.`,
      action: () => {
        player.hurt(this.damage)
        screen.updateHealth(player.health)
      }
    }
  }
}



export class Magician extends NonPlayerCharacter {
  constructor (prng) {
    super()
    if (!prng) { throw Error('Magician created with out pseudo random number generator')}
    this.prng = prng
  }
  getActionMessage (screen, player, map, gemPos) {
    return {
      txt: `You met a magician.
As you know, magicians can't be trusted! They will play tricks on you.
Be warned!`,
      action: () => {
        const newPosition = randomPosition(map.dimensions, this.prng)
        console.log(`playerPos: ${map.playerPos.x} ${map.playerPos.y} => ${newPosition.x} ${newPosition.y}`)
        map.moveFromTo(map.playerPos, newPosition)
        map.playerPos = newPosition
        screen.update(map)
      }
    }
  }
}

function distance (a, b) {
  const steps = Math.abs (a.x - b.x) + Math.abs (a.y - b.y)
  if (steps < 2) return 'very close to here'
  if (steps < 4) return 'in the viscinity'
  if (steps < 7) return 'not too far from here'
  return 'far away'
}

export class Wanderer extends NonPlayerCharacter {
  getActionMessage (screen, player, map, gemPos) {
    return {
      txt: this.hintMessage(map, map.playerPos, gemPos),
      action: () => {}
    }
  }

  hintMessage (map, playerPos, gemPos) {
    const dist = distance(playerPos, gemPos)
    const terrain = map.terrainAt(gemPos)
    return `You meet a wanderer, who tells you the gem is roumored to be ${dist}, surrounded by ${terrain}.`
  }
}


export class InnKeeper extends NonPlayerCharacter {
  constructor (prng) {
    super()
    this.healing = 10 + Math.floor(prng()*20)
  }

  getActionMessage (screen, player, map, gemPos) {
    console.log(`InnKeeper: heals: ${this.healing}`)
    return {
      txt: `Sweet faith!!
Who would have expected to find an inn in these remote lands.
You eat a lovely meal and gain ${this.healing} in health.`,
      action: () => {
        player.heal(this.healing)
        screen.updateHealth(player.health)
      }
    }
  }
}
