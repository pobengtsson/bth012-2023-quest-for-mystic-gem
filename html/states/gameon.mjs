import { State } from './state.mjs'
import { GameWon } from './gamewon.mjs'

function isSamePosition (a, b) {
  return a.x === b.x && a.y === b.y
}

export class GameOn extends State {
  async loadView() {
    this.screen.classList = ["gameon"]
    this.screen.apply(this.gameMap)
  }

  execute () {
    do {
      this.makeATurn()
    } while (!this.gemFound())
    this.initiateGameEnd()
  }

  makeATurn () {
    // this.game.renderer(this.game.map, this.game.printLine, this.game.symboliser)
    this.game.printLine('Where do you want to go?')
    // const key = await this.readline.question('(n) north, (s) south, (w) west, (e) east')
    // this.keypressed(key)
  }

  initiateGameEnd () {
    this.game.setState(new GameWon(this.game, this.readline))
  }

  gemFound () {
    return isSamePosition(this.game.map.playerPos, this.game.gemPos)
  }

  keypressed (str) {
    switch (str) {
      case 'n':
        if (this.game.map.playerPos.y > 0) {
          this.game.map.playerPos.y -= 1
        }
        break
      case 'w':
        if (this.game.map.playerPos.x > 0) {
          this.game.map.playerPos.x -= 1
        }
        break
      case 'e':
        if (this.game.map.playerPos.x < (this.game.map.dimensions.width - 1)) {
          this.game.map.playerPos.x += 1
        }
        break
      case 's':
        if (this.game.map.playerPos.y < (this.game.map.dimensions.height - 1)) {
          this.game.map.playerPos.y += 1
        }
        break
      default:
        break
    }
  }
}
