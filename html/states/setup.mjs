import { GameMap, randomPosition } from '../gamemap.mjs'
import { State } from './state.mjs'
import { Player } from '../player.mjs'

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
      this.game.player = new Player(nameInput)
      this.game.startGame();
    })
  }
}
