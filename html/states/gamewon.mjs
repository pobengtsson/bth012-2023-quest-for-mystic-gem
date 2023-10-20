import { State } from './state.mjs'

export class GameWon extends State {
  execute () {
    console.log('Win')
  }
}
