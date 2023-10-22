import { State } from './state.mjs'

function isSamePosition (a, b) {
  return a.x === b.x && a.y === b.y
}

export class GameOn extends State {
  async loadView() {
    this.screen.classList = ["gameon"]
    this.screen.apply(this.game.gameMap, this.game.gemPos)
    this.screen.updateHealth(this.game.player.health)
  }

  gemFound () {
    return isSamePosition(this.game.gameMap.playerPos, this.game.gemPos)
  }

  handleEvent (event) {
    update_based_on_event: {
      switch (event.key) {
         case 'ArrowRight':
         case 'ArrowLeft':
         case 'ArrowDown':
         case 'ArrowUp':
            event.preventDefault()
            event.stopPropagation()
            if (!this.gemFound() && this.game.gameMap.isValidPlayerMove(this.game.gameMap.playerPos, event.key)) {
               const nextPosition = this.game.gameMap.nextCoordinates(this.game.gameMap.playerPos, event.key)
               this.game.gameMap.moveFromTo(this.game.gameMap.playerPos, nextPosition)
               this.game.gameMap.playerPos = nextPosition
               this.game.player.moveOneStep()
               this.processNpcs(this.game.gameMap.tileAt(nextPosition))
            } else {
               break update_based_on_event
            }
               break
            case 'Escape':
            case 'Q':
            case 'q':
            case 'P':
            case 'p':
               console.log(`Received event: ${event.key}`)
               // this.gameData.setState(new PausedState(this.gameData))
            break
         default:
            console.log('Default')
            break
      }
      this.screen.updateHealth(this.game.player.health)
      this.screen.update(this.game.gameMap)
    }
    if (this.gemFound()) {
       this.game.gameWon()
    }
    if (this.game.gameIsOver()) {
      this.game.gameOver()
    }
  }

  processNpcs (tile) {
    this.game.pauseEventListener()
    if (tile.npc) {
      const actionMessage = tile.npc.getActionMessage(this.screen, this.game.player, this.game.gameMap, this.game.gemPos)
      this.screen.processActionMessages(actionMessage, () => this.game.resumeEventListener())
      delete tile.npc
    } else {
      this.game.resumeEventListener()
    }
  }
}
