"use strict";

let board = document.getElementById('board');
let game;

function gameOver(gameState, token) {
  let confirmation;
  let message;
  if(gameState === "winner") {
    message = token + ' is the winner';
  } else if (gameState === "draw") {
    message = 'It\'s a draw';
  }
  setTimeout(function() {
    confirmation = confirm(message + '. Play another game?');
    if(confirmation) newGame();
  }, 100);
}

class Player {
  
  constructor(theToken) {
    this.token = theToken;
  }
  
}

class Board {
  constructor() {
    this.board = this.createBoard();
  }
  
  createBoard() {
    let a = new Array(3);
    for (let i = 0; i < a.length; i++) {
      a[i] = new Array(3);
    }
    return a;
  }
  
  placePiece(cord1, cord2, token) {
    this.board[cord1][cord2] = token;
  }
  
  convertBoard(winners) {
    let theBoard = this.board;
    let tempBoard = winners.map(function(cords) {
      let temp = cords.map(function(cord) {
        return theBoard[cord[0]][cord[1]];
      });
      return temp;
    });
    return tempBoard;
  }
  
  isFull() {
    let draw = true;
    this.board.forEach(function(row) {
      for (let i = 0; i < row.length; i++) {
        if(!Boolean(row[i])) draw = false;
      }
    });
    return draw;
  }
}

class Tictactoe {
  
  constructor(thePlayer1, thePlayer2, theBoard) {
    this.player1 = thePlayer1;
    this.player2 = thePlayer2;
    this.currentPlayer = this.player1;
    this.winner = false;
    this.gameBoard = theBoard;
    this.addDivListeners();
    this.winningPositions = [
      [[0,0],[0,1],[0,2]],
      [[1,0],[1,1],[1,2]],
      [[2,0],[2,1],[2,2]],
      [[0,0],[1,0],[2,0]],
      [[0,1],[1,1],[2,1]],
      [[0,2],[1,2],[2,2]],
      [[0,0],[1,1],[2,2]],
      [[0,2],[1,1],[2,0]]
    ];
  }
  
  drawBoard() {
    for (let i = 0; i < this.gameBoard.board.length; i++) {
      let divEl = document.createElement('div');
      divEl.classList.add('row');
      for (let j = 0; j < this.gameBoard.board[i].length; j++) {
        let square = document.createElement('div');
        square.classList.add('col-1');
        square.classList.add('square');
        square.setAttribute('cord', i + '' + j);
        divEl.appendChild(square);
      }
      board.appendChild(divEl);
    }
  }
  
  getCurrentPlayerToken() {
    return this.currentPlayer.token;
  }
  
  addDivListeners() {
    let divs = board.getElementsByClassName('square');
    Array.from(divs).forEach(function(div) {
      div.addEventListener('click', function test(e) {
        let attr = e.target.getAttribute('cord');
        let tempBoard = game.updateBoard.bind(game);
        tempBoard(attr, e.target);
        this.removeEventListener('click', test);
        let change = game.changePlayer.bind(game);
        let winner = game.isWinner.bind(game);
        let theToken = game.getCurrentPlayerToken.bind(game);
        if(winner()) {
          gameOver('winner', theToken());
        }
        let draw = game.isDraw.bind(game);
        if(draw()) {
          gameOver('draw', theToken());
        }
        change();
      });
    });
  }
  
  updateBoard(cords, element) {
    cords = cords.split('').map(function(cord) {
      return Number(cord);
    });
    this.gameBoard.placePiece(cords[0], cords[1], this.currentPlayer.token);
    element.innerHTML = this.currentPlayer.token;
  }
  
  isWinner() {
    let falseResult = false;
    let result;
    let theToken = this.currentPlayer.token;
    let tempBoard = this.gameBoard.convertBoard(this.winningPositions);
    tempBoard.forEach(function(element) {
      let temp = element.every(function(nestedelement) {
        return nestedelement === theToken;
      });
      if(temp) result = temp;
    });
    return result || falseResult;
  }
  
  isDraw() {
    if(this.gameBoard.isFull()) {
      return true;
    }
    return false;
  }
  
  changePlayer() {
    if(this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else {
      this.currentPlayer = this.player1;
    }
  }

}

const newGame = function newGame() {
  board.innerHTML = '';
  game = new Tictactoe(new Player('X'), new Player('O'), new Board());
  game.drawBoard();
  game.addDivListeners();
};

document.addEventListener('DOMContentLoaded', function() {
  newGame();
});