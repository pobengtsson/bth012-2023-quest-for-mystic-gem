export class Tile {
  constructor (aTerrain, isVisited = false) {
    this.terrain = aTerrain
    this.isVisited = isVisited
    this.items = []
    this.npcList = []
    this.actions = []
  }
}
