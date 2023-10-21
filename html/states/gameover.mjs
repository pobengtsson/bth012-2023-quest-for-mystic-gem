import { State } from './state.mjs'

export class GameOver extends State {
  async loadView () {
    const response = await fetch('lost.html')
    const successHtml = await response.text()
    this.screen.classList = ['failure']
    this.screen.htmlTemplate = successHtml

    const startButton = document.getElementById('continue')
    startButton.addEventListener('click', () => {
      this.game.start();
    })
  }
}
