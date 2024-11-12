/*-------------- Constants -------------*/
// 5. Game Rules and Setup: Define board size (8x8), colors for each player (black and white), and normal vs. king pieces.
const boardSize = 8
const whitePiece = 'White'
const blackPiece = 'Black'
const normalPiece = 'normal'
const kingPiece = 'king'
/*---------- Variables (state) ---------*/
// 1. Variables Needed: Set up variables to track the board layout, which player’s turn it is, and possible moves.
let currentPlayer = 'White'
/*----- Cached Element References  -----*/
// 2. Main Elements on Page: Link to the main game area, turn display, messages, and restart button.
const boardEle = document.getElementById('board')

const restartEle = document.getElementById('restart')
/*-------------- Functions -------------*/
// 3. Set Up the Game at Start: Load the board, pieces, and show whose turn it is.
const createBoard = () => {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const square = document.createElement('div')
    square.classList.add('sqr')
    square.id = i
    boardEle.appendChild(square)
  }
}

// 4. How the Game Looks: Show the pieces in their places and display whose turn it is.

// 6. Piece Clicks: When a player clicks a piece, check if it’s their turn and show possible moves.

// 7. Find Valid Moves: Calculate where each piece can move, depending on the type (normal or king).

// 8. Click on a Square to Move: Move the piece if the player clicks a valid square, removing any captured pieces.

// 9. Turn Change: Switch to the next player, clear highlights, and update the display.

// 10. Check for Win/Loss: If a player has no moves or pieces left, announce the winner; otherwise, continue turns.

// 11. Restart the Game: Reset everything to start a new game when the player clicks the reset button.

// 12. Improve Display and Accessibility: Make sure the colors are easy to see, messages are clear, and pieces have labels for accessibility.

/*----------- Event Listeners ----------*/
// 13. Add event listeners for piece clicks, square clicks, and the reset button
document.addEventListener('DOMContentLoaded', createBoard)
