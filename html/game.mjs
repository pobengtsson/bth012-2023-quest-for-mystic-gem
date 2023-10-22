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
    this.pauseEventHandler = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
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
    this.clearEventListener()
    this.state = newState
    this.setEventListener()
    try {
       await this.state.loadView()
    } catch (error) {
       console.log(error)
    }
  }

  clearEventListener () {
    if (this.handleEvent) {
      this.window.removeEventListener('keydown', this.handleEvent)
      delete this.handleEvent
    }
  }

  setEventListener () {
    this.handleEvent = this.state.handleEvent.bind(this.state)
    window.addEventListener('keydown', this.handleEvent)
  }

  pauseEventListener () {
    if (this.handleEvent) {
      this.window.removeEventListener('keydown', this.handleEvent)
      // this.window.addEventListener('keyDown', this.pauseEventHandler)
    }
  }

  resumeEventListener () {
    if(this.gameIsOver()) {
      this.gameOver()
    } else {
      if (this.handleEvent) {
        // this.window.removeEventListener('keydown', this.pauseEventHandler)
        window.addEventListener('keydown', this.handleEvent)
      }
    }
  }


  logCurrentState () {
    if (this.logger) {
      this.logger(`State is: ${this.state.constructor.name}`)
    }
  }
}
