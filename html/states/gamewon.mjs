import { State } from './state.mjs'

export class GameWon extends State {
  async loadView () {
    const response = await fetch('success.html')
    const successHtml = await response.text()
    this.screen.classList = ['success']
    this.screen.htmlTemplate = successHtml

    const startButton = document.getElementById('continue')
    startButton.addEventListener('click', () => {
      this.game.start();
    })
  }
}
