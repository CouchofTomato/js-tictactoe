let game;
const board = document.getElementById('board'),
      WIN_STATES = [
            [ [0, 0], [0, 1], [0, 2] ],
            [ [1, 0], [1, 1], [1, 2] ],
            [ [2, 0], [2, 1], [2, 2] ],
            [ [0, 0], [1, 0], [2, 0] ],
            [ [0, 1], [1, 1], [2, 1] ],
            [ [0, 2], [1, 2], [2, 2] ],
            [ [0, 0], [1, 1], [2, 2] ],
            [ [0, 2], [1, 1], [2, 0] ]
          ];

class Tictactoe {

  constructor(str1, str2, obj) {
    this.currentPlayer = str1;
    this.nextPlayer = str2;
    this.gameBoard = obj;
  }

  drawBoard() {
    const divEl = document.createElement('div');
    divEl.classList.add('row');
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let square = document.createElement('div');
        square.classList.add('col-1', 'square');
        square.setAttribute('cord', `${i}${j}`);
        divEl.appendChild(square);
      }
      board.appendChild(divEl);
    }
  }

  addDivListeners() {
    const divs = [...board.getElementsByClassName('square')];
    
    divs.forEach(div => {
      div.addEventListener('click', function test(e) {
        const attr = e.target.getAttribute('cord'),
              tempBoard = game.updateBoard.bind(game),
              theToken = game.currentPlayer,
              winner = game.isWinner.bind(game),
              draw = game.isDraw.bind(game),
              change = game.changePlayer.bind(game);
        
        tempBoard(attr, e.target);
        this.removeEventListener('click', test);
        
        if (winner()) {
          gameOver(theToken);
        } else if (draw()) {
          gameOver();
        }
        change();
      });
    });
  }

  updateBoard(cords, element) {
    cords = cords.split('').map(cord => Number(cord));
    this.gameBoard.placePiece(cords[0], cords[1], this.currentPlayer);
    element.innerHTML = this.currentPlayer;
  }

  isWinner() {
    const theToken = this.currentPlayer;
    let result = false;
    
    this.gameBoard.convertBoard(WIN_STATES).forEach(element => {
      if (element.every(nestedelement => nestedelement === theToken)) result = true;
    });
    return result;
  }

  isDraw() {
    return this.gameBoard.isFull();
  }

  changePlayer() {
    [this.currentPlayer, this.nextPlayer] = [this.nextPlayer, this.currentPlayer];
  }

}

class Board {

  constructor() {
    this.board = [
      [, , , ],
      [, , , ],
      [, , , ]
    ];
  }

  placePiece(cord1, cord2, token) {
    this.board[cord1][cord2] = token;
  }

  convertBoard(winners) {
    const theBoard = this.board;
    return winners.map(cords => cords.map(cord => theBoard[cord[0]][cord[1]]));
  }

  isFull() {
    const a = [...this.board];
    return [...a[0], ...a[1], ...a[2]].every(c => c !== undefined);
  }
}

const gameOver = function () {
  const message = (arguments[0]) ? `${arguments[0]} is the winner` : `It's a draw`;

  setTimeout(() => {
    confirm(`${message}. Play another game?`) && newGame();
  }, 100);
};

const newGame = () => {
  board.innerHTML = '';
  game = new Tictactoe('X', 'O', new Board());
  game.drawBoard();
  game.addDivListeners();
};

document.addEventListener('DOMContentLoaded', () => newGame());
