document.addEventListener('DOMContentLoaded', () => {

  const board = document.querySelector('.board');

  const cells = document.querySelectorAll('.cell');

  const message = document.querySelector('.message');

  const resetButton = document.querySelector('.reset-button');

  const statsDisplay = document.querySelector('.stats');

  const webhookUrl = 'https://discord.com/api/webhooks/1216796837239849053/aNlLwYGEg3BcoBRK3CAIRFQx3-XY7DD3lB4-dqJ8BiyDXYDLBdsxhGXp7eTLlEjiY6zw';

  let currentPlayer = 'X';

  let gameOver = false;

  let wins = 0;

  let losses = 0;

  let draws = 0;

  let startTime;

  // Function to send message to Discord webhook

  function sendMessage(username, description) {

    const embed = {

      title: "Tic Tac Toe",

      description: description,

      footer: {

        text: new Date().toLocaleString()

      }

    };

    fetch(webhookUrl, {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json'

      },

      body: JSON.stringify({

        username: username,

        embeds: [embed]

      })

    })

    .then(response => {

      if (response.ok) {

        console.log('Message sent successfully!');

      } else {

        console.error('Failed to send message:', response.status);

      }

    })

    .catch(error => {

      console.error('Error sending message:', error);

    });

  }

  // Function to update and display statistics

  function updateStats() {

    statsDisplay.textContent = `Wins: ${wins} | Losses: ${losses} | Draws: ${draws}`;

  }

  // Function to display modal

  function displayModal() {

    const username = localStorage.getItem('username');

    if (username) {

      sendMessage(username, `${username} has started a game!`);

    } else {

      const modal = document.querySelector('.modal');

      modal.style.display = 'block';

      const form = modal.querySelector('form');

      form.addEventListener('submit', (e) => {

        e.preventDefault();

        const input = form.querySelector('input[type="text"]');

        const username = input.value.trim() || 'Guest';

        localStorage.setItem('username', username);

        modal.style.display = 'none';

        sendMessage(username, `${username} has started a game!`);

      });

    }

  }

  // Call displayModal() to show the modal and send the message

  displayModal();

  // Event listener for cell clicks

  cells.forEach(cell => {

    cell.addEventListener('click', () => {

      if (!gameOver && !cell.textContent) {

        cell.textContent = currentPlayer;

        if (!startTime) startTime = new Date(); // Start time tracking on first move

        if (checkWin(currentPlayer)) {

          message.textContent = `${currentPlayer} wins!`;

          sendMessage(localStorage.getItem('username'), `${localStorage.getItem('username')} wins the game!`);

          gameOver = true;

          if (currentPlayer === 'X') {

            wins++;

          } else {

            losses++;

          }

          updateStats();

        } else if (checkDraw()) {

          message.textContent = "It's a draw!";

          sendMessage(localStorage.getItem('username'), `${localStorage.getItem('username')} draws the game!`);

          gameOver = true;

          draws++;

          updateStats();

        } else {

          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

          if (currentPlayer === 'O') {

            setTimeout(aiMove, 250);

          }

        }

      }

    });

  });

  // Event listener for reset button click

  resetButton.addEventListener('click', () => {

    resetGame();

  });

  // Function for AI move using minimax algorithm

  function aiMove() {

    const emptyCells = [...cells].filter(cell => !cell.textContent);

    // Initialize best move and best score

    let bestMove;

    let bestScore = -Infinity;

    // Loop through each empty cell to find the best move

    emptyCells.forEach(cell => {

      // Make a move on the empty cell

      cell.textContent = 'O';

      // Evaluate the score for this move using minimax

      const score = minimax(cells, 0, false);

      // Undo the move

      cell.textContent = '';

      // Update best move and best score if this move is better

      if (score > bestScore) {

        bestScore = score;

        bestMove = cell;

      }

    });

    // Make the best move

    bestMove.textContent = 'O';

    // Check if AI wins

    if (checkWin('O')) {

      message.textContent = 'AI wins!';

      sendMessage(localStorage.getItem('username'), 'AI wins the game!');

      gameOver = true;

      losses++;

      updateStats();

    } else if (checkDraw()) {

      // Check if it's a draw

      message.textContent = "It's a draw!";

      sendMessage(localStorage.getItem('username'), 'AI draws the game!');

      gameOver = true;

      draws++;

      updateStats();

    } else {

      // Switch to player's turn

      currentPlayer = 'X';

    }

  }

  // Minimax algorithm for AI decision making

  function minimax(board, depth, isMaximizing) {

    // Base cases: check if game is over

    if (checkWin('O')) {

      return 10 - depth; // AI wins

    } else if (checkWin('X')) {

      return depth - 10; // Player wins

    } else if (checkDraw()) {

      return 0; // Draw

    }

    // If maximizing player's turn (AI)

    if (isMaximizing) {

      let bestScore = -Infinity;

      
// Loop through each empty cell

      board.forEach((cell, index) => {

        if (!cell.textContent) {

          // Make a move on the empty cell

          cell.textContent = 'O';

          // Evaluate the score for this move recursively

          const score = minimax(board, depth + 1, false);

          // Undo the move

          cell.textContent = '';

          // Update best score if this score is higher

          bestScore = Math.max(bestScore, score);

        }

      });

      return bestScore;

    } else {

      // If minimizing player's turn (Player)

      let bestScore = Infinity;

      // Loop through each empty cell

      board.forEach((cell, index) => {

        if (!cell.textContent) {

          // Make a move on the empty cell

          cell.textContent = 'X';

          // Evaluate the score for this move recursively

          const score = minimax(board, depth + 1, true);

          // Undo the move

          cell.textContent = '';

          // Update best score if this score is lower

          bestScore = Math.min(bestScore, score);

        }

      });

      return bestScore;

    }

  }

  // Function to check for a win

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

  // Function to check for a draw

  function checkDraw() {

    return [...cells].every(cell => cell.textContent);

  }

  // Function to reset the game

  function resetGame() {

    cells.forEach(cell => {

      cell.textContent = '';

    });

    message.textContent = '';

    currentPlayer = 'X';

    gameOver = false;

    startTime = null; // Reset start time

  }

});
