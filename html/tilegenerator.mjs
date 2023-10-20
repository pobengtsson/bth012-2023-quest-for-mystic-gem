import { Tile } from './tile.mjs'

function randomChoice (arr, prng) {
  return arr[Math.floor(prng() * arr.length)]
}

export function * tileGenerator (prng = Math.random) {
  const terrains = ['desert', 'forest', 'mountain', 'swamp']
  while (true) {
    yield new Tile(randomChoice(terrains, prng))
  }
}
