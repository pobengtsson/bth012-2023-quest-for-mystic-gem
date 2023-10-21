import { Setup } from './states/setup.mjs'
import { GameOn } from './states/gameon.mjs'
import { GameWon } from './states/gamewon.mjs'
import { GameOver } from './states/gameover.mjs'

export class Game {
  constructor (theWindow, screen, logger, prng = Math.random) {
    this.window = theWindow
    this.screen = screen
    this.logger = logger
    this.prng = prng
  }

  start () {
    this.setState(new Setup(this, this.screen))
  }

  startGame () {
    this.setState(new GameOn(this, this.screen))
  }

  gameWon () {
    this.setState(new GameWon(this, this.screen))
  }

  gameOver () {
    this.setState(new GameOver(this, this.screen))
  }

  gameIsOver () {
    return !this.player.isHealthy()
  }

  async setState(newState) {
    this.state = newState
    if (this.handleEvent) {
       window.removeEventListener('keydown', this.handleEvent)
    }
    this.handleEvent = this.state.handleEvent.bind(this.state)
    window.addEventListener('keydown', this.handleEvent)
    try {
       await this.state.loadView()
    } catch (error) {
       console.log(error)
    }
 }

  logCurrentState () {
    if (this.logger) {
      this.logger(`State is: ${this.state.constructor.name}`)
      // console.log(`Game data is: ${this.map}`)
    }
  }
}
