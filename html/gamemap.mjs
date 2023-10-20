import { tileGenerator } from './tilegenerator.mjs'

export class GameMap {
  constructor (dimensions, tileiterator = tileGenerator()) {
    this.dimensions = dimensions
    const width = dimensions.width
    const height = dimensions.height
    this.tiles = new Array(height)
    for (let x = 0; x < height; x++) {
      this.tiles[x] = new Array(width)
      for (let y = 0; y < width; y++) {
        this.tiles[x][y] = tileiterator.next().value
      }
    }
  }

  visit () {
    this.tiles[this.playerPos.y][this.playerPos.x].isVisited = true
  }
}
