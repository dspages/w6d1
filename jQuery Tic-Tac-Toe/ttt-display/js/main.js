const View = require("./ttt-view.js");// require appropriate file
const Game = require("../../tic-tac-toe/game.js");// require appropriate file
const game=new Game();

$( () => {
  let $ttt = $('.ttt');
  const view=new View(game,$ttt);
  // Your code here
});
