import { Game } from './game.mjs'
import { Screen } from './screen.mjs'

const screen = new Screen(document.getElementById('gameView'))
const game = new Game(window, screen, console.log)
game.start()
