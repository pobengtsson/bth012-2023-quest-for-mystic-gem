import { GameMap } from '../gamemap.mjs'
import { State } from './state.mjs'
import { Player } from '../player.mjs'
import { GameOn } from './gameon.mjs'

function randomPosition (dim, prng) {
  const x = Math.floor(prng() * dim.width)
  const y = Math.floor(prng() * dim.height)
  return { x, y } // NOTE: object property shorthand, same as writing { x: x, y: y}
}

export class Setup extends State {
  async loadView () {
    const response = await fetch('welcome.html')
    const welcomeScreenHtml = await response.text()
    this.screen.classList = ["welcome"]
    this.screen.htmlTemplate = welcomeScreenHtml

    this.game.gameMap = new GameMap({ width: 15, height: 15 })
    this.game.gameMap.playerPos = {
      x: Math.floor(this.game.gameMap.dimensions.width / 2),
      y: Math.floor(this.game.gameMap.dimensions.height / 2)
    }
    this.game.gemPos = randomPosition(this.game.gameMap.dimensions, this.game.prng)
    const startButton = document.getElementById('start')
    startButton.addEventListener('click', () => {
      const nameInput = document.getElementById('name').value  || "Pixel Pendleton"
      console.log(`${nameInput} clicked start!`)
      this.game.player = new Player(nameInput)
      this.game.startGame();
    })

  }

  handleEvent(event) {
    console.log(`Received event: ${event.key}`)
    // game is started by clicking
  }

  async execute () {

    // this.game.printLine('Welcome to The Game Map Adventure')
    // this.game.map = new GameMap({ width: 15, height: 15 })
    // const nick = await this.readline.question('Enter your name to start: ')
    // this.game.player = new Player(nick)
    // this.game.printLine(`Welcome ${this.game.player.name}!`)
    // this.game.gemPos = randomPosition(this.game.map.dimensions, this.game.prng)
    // this.game.map.playerPos = {
    //   x: Math.floor(this.game.map.dimensions.width / 2),
    //   y: Math.floor(this.game.map.dimensions.height / 2)
    // }
    // this.game.setState(new GameOn(this.game, this.readline))
  }
}
