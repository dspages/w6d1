/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const HanoiGame = __webpack_require__(1);
const HanoiView = __webpack_require__(2);

$( () => {
  const $rootEl = $('.hanoi');
  const game = new HanoiGame();
  new HanoiView(game, $rootEl);
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class Game {
  constructor() {
    this.towers = [[3, 2, 1], [], []];
  }

  isValidMove(startTowerIdx, endTowerIdx) {
      const startTower = this.towers[startTowerIdx];
      const endTower = this.towers[endTowerIdx];

      if (startTower.length === 0) {
        return false;
      } else if (endTower.length == 0) {
        return true;
      } else {
        const topStartDisc = startTower[startTower.length - 1];
        const topEndDisc = endTower[endTower.length - 1];
        return topStartDisc < topEndDisc;
      }
  }

  isWon() {
      // move all the discs to the last or second tower
      return (this.towers[2].length == 3) || (this.towers[1].length == 3);
  }

  move(startTowerIdx, endTowerIdx) {
      if (this.isValidMove(startTowerIdx, endTowerIdx)) {
        this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());
        return true;
      } else {
        return false;
      }
  }

  print() {
      console.log(JSON.stringify(this.towers));
  }

  promptMove(reader, callback) {
      this.print();
      reader.question("Enter a starting tower: ", start => {
        const startTowerIdx = parseInt(start);
        reader.question("Enter an ending tower: ", end => {
          const endTowerIdx = parseInt(end);
          callback(startTowerIdx, endTowerIdx)
        });
      });
  }

  run(reader, gameCompletionCallback) {
      this.promptMove(reader, (startTowerIdx, endTowerIdx) => {
        if (!this.move(startTowerIdx, endTowerIdx)) {
          console.log("Invalid move!");
        }

        if (!this.isWon()) {
          // Continue to play!
          this.run(reader, gameCompletionCallback);
        } else {
          this.print();
          console.log("You win!");
          gameCompletionCallback();
        }
      });
  }
}

module.exports = Game;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

class View {
  constructor(game, $el) {
    this.game = game;
    this.$el = $el;
    this.setupTowers();
    this.move_from=undefined;
    this.move_to=undefined;
  }

  bindEvents($square) {
    $square.on("click", (event) => {
      this.registerClick($square);
    });
  }

  registerClick($square){
    if(this.move_from===undefined){
      this.move_from=$square.data("data-coor")[1];
    }else if(this.move_to===undefined){
      this.move_to=$square.data("data-coor")[1];
      let from=this.move_from;
      let to=this.move_to;
      let fromRow = (this.game.towers[from].length-1);
      let toRow = (this.game.towers[to].length);
      let width=this.game.towers[from][fromRow];
      if(this.game.move(from, to)){
        //Successful move
        this.makeMove(from, to, fromRow, toRow, width);
        // alert("Valid move!");
      }else{
        //invalid move
        alert("Invalid Move!");
      }
      this.move_from=undefined;
      this.move_to=undefined;
    }
  }

  makeMove(from, to, fromRow, toRow, width) {

    toRow=2-toRow;//So we go from bottom rather than top

    let $fromDisk = $(`.disc${width}`);
    let $toSquare = $(`.${toRow}-${to}`);
    $toSquare.append($fromDisk);
    if(this.game.isWon()){
      setTimeout(()=>alert("You win!"),5);
    }
  }

  setupTowers() {
    const addRow = (rowIdx) => {
      const $row = $("<ul class='row'></ul>");
      for (let colIdx = 0; colIdx < 3; colIdx++) {
        const $square = $("<li></li>").addClass("square").data("data-coor", [rowIdx, colIdx]).addClass(`${rowIdx}-${colIdx}`);
        if(colIdx===0){
          let $disc = $("<li></li>").addClass(`disc${rowIdx+1}`);
          $square.append($disc);
        }
        this.bindEvents($square);
        $row.append($square);
      }
      this.$el.append($row);
    };
    for (var i = 0; i < 3; i++) {
      addRow(i);
    }
    // let $disc = $("<li></li>").addClass(`disc${i}`);
    // $square.append($disc);
    // let $disc2 = $("<li></li>").addClass("disc2");
    // $square.append($disc2);
    // let $disc3 = $("<li></li>").addClass("disc3");
    // $square.append($disc3);
  }

}

module.exports = View;


/***/ })
/******/ ]);