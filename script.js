document.addEventListener('DOMContentLoaded', () => {
  const board = document.querySelector('.board');
  const cells = document.querySelectorAll('.cell');
  const message = document.querySelector('.message');
  const resetButton = document.querySelector('.reset-button');

  let currentPlayer = 'X';
  let gameOver = false;

  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      if (!gameOver && !cell.textContent) {
        cell.textContent = currentPlayer;
        cell.classList.add('clicked'); // Add animation class
        if (checkWin(currentPlayer)) {
          message.textContent = `${currentPlayer} wins!`;
          gameOver = true;
        } else if (checkDraw()) {
          message.textContent = "It's a draw!";
          gameOver = true;
        } else {
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          if (currentPlayer === 'O') {
            setTimeout(aiMove, 250);
          }
        }
      }
    });
  });

  resetButton.addEventListener('click', () => {
    resetGame();
  });

  function checkWin(player) {
    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winConditions.some(condition => {
      return condition.every(index => cells[index].textContent === player);
    });
  }

  function checkDraw() {
    return [...cells].every(cell => cell.textContent);
  }

  function aiMove() {
    const emptyCells = [...cells].filter(cell => !cell.textContent);
    const bestMove = findBestMove(emptyCells);
    if (bestMove !== -1) {
      cells[bestMove].textContent = 'O';
      if (checkWin('O')) {
        message.textContent = 'AI wins!';
        gameOver = true;
      } else if (checkDraw()) {
        message.textContent = "It's a draw!";
        gameOver = true;
      } else {
        currentPlayer = 'X';
      }
    }
  }

  function findBestMove(emptyCells) {
    let bestScore = -Infinity;
    let bestMove = -1;

    emptyCells.forEach(cell => {
      const index = parseInt(cell.dataset.index);
      cells[index].textContent = 'O';
      const score = minimax(cells, 0, false);
      cells[index].textContent = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    });

    return bestMove;
  }

  function minimax(board, depth, isMaximizing) {
    if (checkWin('O')) {
      return 10 - depth;
    } else if (checkWin('X')) {
      return depth - 10;
    } else if (checkDraw()) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i].textContent) {
          board[i].textContent = 'O';
          bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
          board[i].textContent = '';
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i].textContent) {
          board[i].textContent = 'X';
          bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
          board[i].textContent = '';
        }
      }
      return bestScore;
    }
  }

  function resetGame() {
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('clicked'); // Remove animation class
    });
    message.textContent = '';
    currentPlayer = 'X';
    gameOver = false;
  }
});
