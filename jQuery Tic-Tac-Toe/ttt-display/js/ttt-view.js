class View {
  constructor(game, $el) {
    this.game=game;
    this.$el=$el;
    this.setupBoard();
    this.gameover=false;
    // this.game.run({});
  }

  bindEvents($square) {
    $square.on("click", (event) => {
      this.makeMove($square);
    });
    $square.on("mouseenter", (event) => {
      $square.css("background-color", "BurlyWood");
    });
    $square.on("mouseleave", (event) => {
      $square.css("background-color", "LightGoldenRodYellow");
    });
  }

  makeMove($square) {
    if(this.gameover){return;}
    let pos = $square.data("data-coor");
    this.game.playMove(pos);
    let mark = this.game.board.grid[pos[0]][pos[1]];
    if (mark === "X") {
      $square.css("color", "MediumSeaGreen");
    }
    $square.text(mark);
    let winner=this.game.winner();
    if(winner){
      setTimeout(()=>alert(`${winner} wins!!!`),5);
      this.gameover=true;
    }else if(this.game.isOver()===true){
      setTimeout(()=>alert(`Draw!`),5);
    }
  }

  setupBoard() {
    const addRow = (rowIdx) => {
      const $row = $("<ul class='row'></ul>");
      for (let colIdx = 0; colIdx < 3; colIdx++) {
        const $square = $("<li></li>").addClass("square").data("data-coor", [rowIdx, colIdx]);
        this.bindEvents($square);
        $row.append($square);
      }
      this.$el.append($row);
    };
    for (var i = 0; i < 3; i++) {
      addRow(i);
    }
  }


}

module.exports = View;
