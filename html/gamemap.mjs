import { tileGenerator } from './tilegenerator.mjs'

export class GameMap {
  constructor (dimensions, tileiterator = tileGenerator()) {
    this.dimensions = dimensions
    const width = dimensions.width
    const height = dimensions.height
    this.tiles = new Array(height)
    this.changeList = []
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

  nextCoordinates(from, direction) {
    switch (direction) {
       case 'ArrowUp':
          return {x: from.x, y: from.y-1}
       case 'ArrowDown':
          return {x: from.x, y: from.y+1}
       case 'ArrowLeft':
          return {x: from.x-1, y: from.y}
       case 'ArrowRight':
          return {x: from.x+1, y: from.y}
       default:
          throw new Error('Unknown direction')
    }
  }

  triesToMoveOutsideMap(from, direction) {
    switch (direction) {
      case 'ArrowUp':
        return from.y == 0
      case 'ArrowDown':
        return from.y == (this.tiles.length - 1)
      case 'ArrowLeft':
        return from.x == 0
      case 'ArrowRight':
        return from.x == (this.tiles[0].length - 1)
    }
  }

  isValidPlayerMove(from, direction) {
    return !this.triesToMoveOutsideMap(from, direction)
  }

  moveFromTo(from, to) {
    this.addChangeListEntry(from)
    this.addChangeListEntry(to)
  }

  classesAtPosition(x, y) {
    return this.tiles[y][x].terrain
  }

    /**
   * Adds a new entry to the change list.
   *
   * @param {Object} point - An object with `x` and `y` properties indicating the position.
   * @param {Any} value - The value to be set in the change list.
   */
    addChangeListEntry(point) {
      this.changeList.push({
        x: point.x,
        y: point.y
      });
    }

    /**
     * returns a list of the changes to the map since last call and resets the change list
     */
    popChanges() {
      const changes = this.changeList
      this.changeList = []
      return changes
    }

}
