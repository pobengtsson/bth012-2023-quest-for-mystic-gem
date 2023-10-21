function scoreBarHtmlText() {
   return `
      <div class="score">
         <div>Damage</div>
         <div id="player-score">0</div>
      </div>
      <div class="high-score">
         <div>Health</div>
         <div id="high-score">0</div>
      </div>
      `
}

function createScoreBarDiv () {
   // the top bar for showing scores n stuff
   const div = document.createElement('div')
   div.classList.add('topbar')
   div.innerHTML = scoreBarHtmlText()
   return div
}

function createScreenContainer () {
   const div = document.createElement('div')
   div.classList.add('screen')
   div.id = 'screen'
   return div
}

function styleTileBasedOn(playerPos, tilePos, diamondPos, tile) {
   if (playerPos.x === tilePos.x && playerPos.y === tilePos.y) {
      return ['player']
   }
   if (diamondPos.x === tilePos.x && diamondPos.y === tilePos.y) {
      return ['diamond']
   }
   if (tile.isVisited) {
      return [tile.terrain]
   } else {
      return ['cloaked']
   }
}

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

   apply(gameMap, diamondPos) {
      this.root.replaceChildren();
      this.scoreBarDiv = createScoreBarDiv() // the bar with health and damage
      this.root.appendChild(this.scoreBarDiv)

      this.container = createScreenContainer() // the game map container
      this.root.appendChild(this.container)
      for (var i = 0; i < gameMap.tiles.length; i++) {
         for (var j = 0; j < gameMap.tiles[i].length; j++) {
            var cellDiv = document.createElement('div')
            cellDiv.classList.add("cell")
            const styleClasses = styleTileBasedOn(gameMap.playerPos, {x: j, y: i}, diamondPos, gameMap.tiles[i][j])
            styleClasses.forEach ((styleClass) => cellDiv.classList.add(styleClass))
            this.container.appendChild(cellDiv)
         }
      }
   }

   update(gameMap) {
      const cells = this.container.children
      const changeList = gameMap.popChanges()
      changeList.forEach((change) => {
         cells[(change.y*gameMap.dimensions.width)+change.x].classList = "cell"
         cells[(change.y*gameMap.dimensions.height)+change.x].classList.add(gameMap.classesAtPosition(change.x, change.y))
         if (gameMap.playerPos.x === change.x && gameMap.playerPos.y === change.y) {
            cells[(change.y*gameMap.dimensions.height)+change.x].classList = ['player']
         }
      })
   }
}

// export function formatScore(digitCount, score) {
//    return score.toString().padStart(digitCount, "0");
// }