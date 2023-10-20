export class Screen {
   constructor(div) {
      this.root = div
   }

   set classList(cssClassList) {
      this.root.classList = cssClassList
   }

   set htmlTemplate(htmlFragmentText) {
      this.root.replaceChildren();
      this.root.innerHTML = htmlFragmentText
   }

   // updateScore(score) {
   //    var scoreSpan = document.getElementById('player-score')
   //    scoreSpan.innerHTML = formatScore(5, score)
   // }

   apply(gameMap) {
      this.root.replaceChildren();
   //    // the top bar for showing scores n stuff
      this.scoreBarDiv = document.createElement('div')
      this.scoreBarDiv.classList.add('topbar')
      this.scoreBarDiv.innerHTML = `
      <div class="score">
         <div>Damage</div>
         <div id="player-score">0</div>
      </div>
      <div class="high-score">
         <div>Health</div>
         <div id="high-score">0</div>
      </div>
      `
      this.root.appendChild(this.scoreBarDiv)

      // the game map container
      this.container = document.createElement('div')
      this.container.classList.add('screen')
      this.container.id = 'screen'
      this.root.appendChild(this.container)
      for (var i = 0; i < gameMap.tiles.length; i++) {
         for (var j = 0; j < gameMap.tiles[i].length; j++) {
            var cellDiv = document.createElement('div')
            cellDiv.classList.add("cell")
            cellDiv.classList.add(gameMap.tiles[i][j].terrain)
            if (!gameMap.tiles[i][j].isVisited)
            {
               cellDiv.classList.add("cloaked")
            }
            this.container.appendChild(cellDiv)
         }
      }
   }

   // update(gameMap) {
   //    const cells = this.container.children
   //    const changeList = gameMap.popChanges()
   //    changeList.forEach((change) => {
   //       cells[(change.y*gameMap.xSize)+change.x].classList = "cell"
   //       cells[(change.y*gameMap.xSize)+change.x].classList.add(gameMap.classesAtPosition(change.x, change.y))
   //       // cells[(change.y*this.xSize)+change.x].classList.add(mazeVal.PLAYER)
   //    })
   // }
}

// export function formatScore(digitCount, score) {
//    return score.toString().padStart(digitCount, "0");
// }