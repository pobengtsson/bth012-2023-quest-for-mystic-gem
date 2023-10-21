import { GameMap } from '../gamemap.mjs'
import { State } from './state.mjs'
import { Player } from '../player.mjs'

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
      this.game.player = new Player(nameInput)
      this.game.startGame();
    })
  }

  // The default implementation in State is enough so this code can be removed 
  /*
  handleEvent(event) {
    // game is started by clicking the button
  }
  */
}
