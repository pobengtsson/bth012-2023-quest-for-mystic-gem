function scoreBarHtmlText() {
   return `
      <div class="health">
         <div>Health</div>
         <div id="player-health">0</div>
      </div>
      <div class="damage">
         <div>Damage</div>
         <div id="player-damage">0</div>
      </div>
      <div id="msgBoard" class="overlay-content">
         <div>
            <div id="message">Empty</div>
            <div id="actions">
               <button id="ok-btn" class="button">OK</button>
            </div>
         </div>
      </div>
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
   // Remove the comments on the next three lines to show the diamond in the map
   // if (diamondPos.x === tilePos.x && diamondPos.y === tilePos.y) {
   //    return ['diamond']
   // }
   if (!tile.isVisited) {
      return [tile.terrain, 'cloaked']
   }
   return [tile.terrain]
}

function formatScore(digitCount, score) {
   return (score <= 0 ? 0 : score ).toString().padStart(digitCount, "0");
}

export class Screen {
   constructor(document, div) {
      this.root = div
      this.document = document
   }

   set classList(cssClassList) {
      this.root.classList = cssClassList
   }

   set htmlTemplate(htmlFragmentText) {
      this.root.replaceChildren();
      this.root.innerHTML = htmlFragmentText
   }

   updateHealth(health) {
      const div = this.document.getElementById('player-health')
      div.innerHTML = formatScore(4, health)
   }

   apply(gameMap, diamondPos) {
      this.root.replaceChildren();
      this.scoreBarDiv = createScoreBarDiv() // the bar with health and damage
      this.root.appendChild(this.scoreBarDiv)

      this.container = createScreenContainer() // the game map container
      this.root.appendChild(this.container)
      for (var i = 0; i < gameMap.tiles.length; i++) {
         for (var j = 0; j < gameMap.tiles[i].length; j++) {
            var cellDiv = this.document.createElement('div')
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
      const idx = (c) => (c.y*gameMap.dimensions.width)+c.x
      changeList.forEach((change) => {
         cells[idx(change)].classList = "cell"
         cells[idx(change)].classList.add(...gameMap.classesAtPosition(change.x, change.y, change.peek))
         if (gameMap.playerPos.x === change.x && gameMap.playerPos.y === change.y) {
            cells[(change.y*gameMap.dimensions.height)+change.x].classList = ['player']
         }
      })
   }

   processActionMessages(msg, done) {
      const msgTxt = this.document.getElementById('message')
      msgTxt.innerHTML = msg.txt

      const board = this.document.getElementById('msgBoard')

      const okBtn = this.document.getElementById('ok-btn')
      okBtn.addEventListener('click', () => {
         board.style.display = 'none'
         msg.action()
         okBtn.parentElement.replaceChild(okBtn.cloneNode(true), okBtn)
         done()
      })
      board.style.display = 'block'
   }
}
