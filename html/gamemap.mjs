import { tileGenerator } from './tilegenerator.mjs'

export function randomPosition (dim, prng) {
  const x = Math.floor(prng() * dim.width)
  const y = Math.floor(prng() * dim.height)
  return { x, y } // NOTE: object property shorthand, same as writing { x: x, y: y}
}

function peekPositions(pos, width, height) {
  const row = pos.x
  const col = pos.y
  let offsets = [-1, 0, 1] // try changing this to [-2, -1, 0, 1, 2] and see what happens! Why?
  return offsets.map(i => offsets.map(j => [row + i, col + j]))
    .flat()
    .filter(([newRow, newCol]) => {
      return !(newRow === row && newCol === col)
         && newRow >= 0 && newRow < height
         && newCol >= 0 && newCol < width
    })
    .map (([x, y])=> { return {x,y} })
}

function nonOverlappingPositions (list1, list2) {
  // Use filter and every to find the positions that are not in the second list
  return list1.filter (position1 => list2.every (position2 => position1.x !== position2.x || position1.y !== position2.y));
}


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

  startPeek(pos) {
    const peek = peekPositions(pos, this.dimensions.width, this.dimensions.height)
    peek.forEach((pos) => {
      this.addChangeListEntry(pos, true)
    })
  }

  moveFromTo(from, to) {
    const peekFromPos = peekPositions(from, this.dimensions.width, this.dimensions.height)
    const peekToPos = peekPositions(to, this.dimensions.width, this.dimensions.height)

    const leavingPeekPos = nonOverlappingPositions(peekFromPos, peekToPos)
    const enteringPeekPos = nonOverlappingPositions(peekToPos, peekFromPos)

    leavingPeekPos.forEach((pos) => {
      this.addChangeListEntry(pos)
    })
    enteringPeekPos.forEach((pos) => {
      this.addChangeListEntry(pos, true)
    })
    this.addChangeListEntry(from)
    this.addChangeListEntry(to)
    this.tileAt(to).isVisited = true
  }

  classesAtPosition(x, y, peek) {
    const tile = this.tileAt({x, y})
    if (tile.isVisited) {
      return [tile.terrain]
    }
    if (peek) {
      return [tile.terrain, 'peek']
    }
    return [tile.terrain, 'cloaked']
  }

  terrainAt (pos) {
    return this.tiles[pos.y][pos.x].terrain
  }

  tileAt (pos) {
    return this.tiles[pos.y][pos.x]
  }

  addChangeListEntry(point, peek = false) {
    this.changeList.push({
      x: point.x,
      y: point.y,
      peek: peek
    });
  }

  popChanges() {
    const changes = this.changeList
    this.changeList = []
    return changes
  }
}
