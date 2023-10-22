import { Game } from './game.mjs'
import { Screen } from './screen.mjs'

const screen = new Screen(document, document.getElementById('gameView'))
globalThis.game = new Game(window, screen, console.log)
game.start()
