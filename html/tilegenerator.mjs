import { Tile } from './tile.mjs'
import { Monster, Wanderer, Magician, InnKeeper } from './npc.mjs'

function randomChoice (arr, prng) {
  return arr[Math.floor(prng() * arr.length)]
}

function getNpcForTile(terrain, prng) {
  // Lets roll the dice,
  const diceRoll = prng()
  // and make it 25% chance that the player will
  // meet a npc on the tile

  // if random number higher than .25 we
  if (diceRoll >.25) { return undefined }

  // let's roll the dice again, to decide
  // if the npc should be a monster (60%)
  // or friend (15%)
  // or a magician (25)
  const secondRoll = prng()

  if (secondRoll<.15) { return new Wanderer() }
  if (secondRoll<.25) { return new Magician(prng) }
  if (secondRoll<.45) { return new InnKeeper(prng)}

  // the for the rest, let's generate a monster
  switch(terrain) {
    case 'forest': return new Monster('bird', 5, 10, prng)
    case 'mountain': return new Monster('dragon', 40, 60, prng)
    case 'desert': return new Monster('snake', 1, 25, prng)
    case 'swamp': return new Monster('crocodile', 25, 35, prng)
    default:
      return undefined
  }
}

export function * tileGenerator (prng = Math.random) {
  const terrains = ['desert', 'forest', 'mountain', 'swamp']
  while (true) {
    const terrain = randomChoice(terrains, prng)
    yield new Tile(terrain, false, getNpcForTile(terrain, prng))
  }
}
