export class State {
  constructor (theGame, aScreen) {
    if (!theGame || !aScreen) {
      throw Error('State created with out game instance or screen.')
    }
    this.game = theGame
    this.screen = aScreen
  }

  loadView () { }
  handleEvent (event) { }
}
