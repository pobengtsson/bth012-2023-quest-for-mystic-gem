import { randomPosition } from "./gamemap.mjs"


/**
 * The base class for non-player characters, npc.
 */
export class NonPlayerCharacter {
  constructor() {}

  /** When a player enters a map tile where this npc is located,
   * the getActionMessage will be called.
   * The NPC implementation must then return an object
   * {
   *   txt: 'the message to show the player',
   *   action: () => {
   *     // what ever needs to be done in code because of the encouter 
   *   }
   * }
   *
   * @param {*} screen
   * @param {*} player
   * @param {*} map
   * @param {*} gemPos
   */
  getActionMessage (screen, player, map, gemPos) {
    throw Error('Not Implemented in the subclass')
  }
}


/**
 * A Monster implementation of a NPC that when instantiated can represent
 * arbitrary monster species that always deals damage to the player.
 */
export class Monster extends NonPlayerCharacter {
  /**
   *  The constructor of Monster lets you decide the species
   * @param {String} aSpecies   a string with the name of the species to show the player
   * @param {*} minDamage an integer with the minimum damage this monster can deal to the player
   * @param {*} maxDamage  an integer with the maximum damage
   * @param {*} prng the pseudo random number generator to use to decide the damage this monster will inflict
   */
  constructor (aSpecies, minDamage, maxDamage, prng) {
    super() // because extends another class the super constructor needs to be called first
    this.species = aSpecies  // set the text to this object
    // calculate the damage for the monster between min and max damage
    this.damage = minDamage + Math.floor(prng()*(maxDamage-minDamage))
  }

  /**
   *  Make the action message using a template to tell the player
   *  which species of monster attacked and how much the player got hurt.
   *  Then make a arrow function that implements the damage on the player and 
   *  updates the healt on the screen
   * @param {*} screen
   * @param {*} player
   * @param {*} map
   * @param {*} gemPos
   * @returns
   */
  getActionMessage (screen, player, map, gemPos) {
    return {
      txt: `Oh no, a ${this.species.toUpperCase()}!!
You cannot escape. You have to fight the monster.
In the fight you get hurt and loose ${this.damage} in health.`,
      action: () => {
        // when the player presses ok
        player.hurt(this.damage) // inflict the damage to the player
        screen.updateHealth(player.health) // update the screen with the new health
      }
    }
  }
}


/**
 * A magician does not hurt the player, but transports the player
 * off to random location.
 */
export class Magician extends NonPlayerCharacter {
  constructor (prng) {
    super()
    this.prng = prng
  }

  /**
   * When encountering a magician a cautionary message is created.
   * And an action the changes the player position to a random position.
   * @param {*} screen
   * @param {*} player
   * @param {*} map
   * @param {*} gemPos
   * @returns
   */
  getActionMessage (screen, player, map, gemPos) {
    return {
      txt: `You met a magician.
As you know, magicians can't be trusted! They will play tricks on you.
Be warned!`,
      action: () => {
        // get a new random position
        const newPosition = randomPosition(map.dimensions, this.prng)
        // register the player move with the map
        map.moveFromTo(map.playerPos, newPosition)
        map.playerPos = newPosition
        // update the screen to reflect the move
        screen.update(map)
      }
    }
  }
}


/** a helper to calculate the Manhattan taxi distance between
 * two positions in the map. Search internet for definition of the
 * Manhattan Taxi distance.
 * Then if translates the distance into a vague statement to be
 * used by the Wanderer npc.
 */
function distance (a, b) {
  const steps = Math.abs (a.x - b.x) + Math.abs (a.y - b.y)
  if (steps < 2) return 'very close to here'
  if (steps < 4) return 'in the viscinity'
  if (steps < 7) return 'not too far from here'
  return 'far away'
}

/** A function that takes two objects with positions {x, y} and
 * returns the compass direction as text
 */
function getCompassDirection (from, to) {
  // Destructure the x and y coordinates of the from and to positions
  const {x: x1, y: y1} = from
  const {x: x2, y: y2} = to

  // Calculate the angle in radians between the two positions
  const angle = Math.atan2 (y2 - y1, x2 - x1)

  // Convert the angle to degrees and normalize it to be between 0 and 360
  const degrees = (angle * (180 / Math.PI) + 360) % 360

  // Define an array of compass directions as words
  const directions = [
    "East",
    "Southeast",
    "South",
    "Southwest",
    "West",
    "Northwest",
    "North",
    "Northeast"
  ]

  // Calculate the index of the closest direction in the array
  const index = Math.round (degrees / 45) % 8

  // Return the compass direction using template literals
  return `${degrees} ${index} ${directions[index]}`//directions [index]
}


/**
 * The Wanderer only tells new, rumours when encountered.
 * No damage, no healing.
 * So, only a message and an empty actions function.
 */
export class Wanderer extends NonPlayerCharacter {
  getActionMessage (screen, player, map, gemPos) {
    return {
      txt: this.hintMessage(map, map.playerPos, gemPos),
      action: () => {}
    }
  }

  /** Using the position of the gem and the player this function
   * puts together a message about the location of the gem that
   * is presented to the player.
   *
   * @param {*} map
   * @param {*} playerPos
   * @param {*} gemPos
   * @returns
   */
  hintMessage (map, playerPos, gemPos) {
    const dist = distance(playerPos, gemPos) // get the vague distance
    const terrain = map.terrainAt(gemPos)
    const direction = getCompassDirection(playerPos, gemPos)
    return `You meet a wanderer, who tells a rumour that the gem is ${direction} from here, ${dist}, surrounded by ${terrain}.`
  }
}

/**
 * The Innkeeper is the opposite to a monster NPC.
 * When encountered it heals the player by increasing
 * the players health
 */
export class InnKeeper extends NonPlayerCharacter {
  /** When creating the object it needs a pseudo random number generator
   * @param {*} prng
   */
  constructor (prng) {
    super()
    this.healing = 10 + Math.floor(prng()*20)  // create a random number between 10 and 30=(10+20)
  }

  getActionMessage (screen, player, map, gemPos) {
    return {
      txt: `Sweet faith, an InnKeeper!!
Who would have expected to find an inn in these remote lands.
You eat a lovely meal and gain ${this.healing} in health.`,
      action: () => {
        // when player presses ok button
        player.heal(this.healing) // heal the players health
        screen.updateHealth(player.health) // update the screen to reflect the new status
      }
    }
  }
}
