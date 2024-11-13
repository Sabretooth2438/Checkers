/*-------------- Constants -------------*/
// 5. Game Rules and Setup: Define board size (8x8), colors for each player (black and white), and normal vs. king pieces.
const boardSize = 8
const whitePiece = 'White'
const blackPiece = 'Black'
const normalPiece = 'normal'
const kingPiece = 'king'
const blackPieceRows = [0, 1, 2]
const whitePieceRows = [5, 6, 7]

/*---------- Variables (state) ---------*/
// 1. Variables Needed: Set up variables to track the board layout, which player’s turn it is, and possible moves.
let currentPlayer = 'White'
let boardArray = Array(boardSize * boardSize).fill(null)
let selectedPieceIndex = null
let direction
/*----- Cached Element References  -----*/
// 2. Main Elements on Page: Link to the main game area, turn display, messages, and restart button.
const boardEle = document.getElementById('board')
const restartEle = document.getElementById('restart')

/*-------------- Functions -------------*/
// 3. Set Up the Game at Start: Load the board, pieces, and show whose turn it is.
// 4. How the Game Looks: Show the pieces in their places and display whose turn it is.
const createBoard = () => {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const square = document.createElement('div')
    square.classList.add('sqr')

    const row = Math.floor(i / boardSize)
    const col = i % boardSize

    if ((row + col) % 2 === 0) {
      square.classList.add('white')
    } else {
      square.classList.add('black')
    }

    square.id = i
    boardEle.appendChild(square)
  }
}

const initializeBoard = () => {
  blackPieceRows.forEach((row) => {
    for (let col = 0; col < boardSize; col += 2) {
      let startingCol = col
      if (row % 2 === 0) {
        startingCol = col + 1
      }
      const index = row * boardSize + startingCol
      boardArray[index] = { color: blackPiece, type: normalPiece }
    }
  })

  whitePieceRows.forEach((row) => {
    for (let col = 0; col < boardSize; col += 2) {
      let startingCol = col
      if (row % 2 === 0) {
        startingCol = col + 1
      }
      const index = row * boardSize + startingCol
      boardArray[index] = { color: whitePiece, type: normalPiece }
    }
  })
}

const displayPieces = () => {
  boardArray.forEach((piece, index) => {
    if (piece) {
      const square = document.getElementById(index)
      const pieceElement = document.createElement('div')
      if (piece.color === blackPiece) {
        pieceElement.classList.add('blackPiece')
      } else if (piece.color === whitePiece) {
        pieceElement.classList.add('whitePiece')
      }
      square.appendChild(pieceElement)
    }
  })
}

const updateTurnMessage = () => {
  const messageElement = document.getElementById('Message')
  messageElement.textContent = `Current Turn: ${currentPlayer}`
}

// 6. Piece Clicks: When a player clicks a piece, check if it’s their turn and show possible moves.
const selectPiece = (index) => {
  if (selectedPieceIndex === index) {
    deselectPiece()
    return
  }
  if (selectedPieceIndex !== null) {
    deselectPiece()
  }

  selectedPieceIndex = index
  const square = document.getElementById(index)
  square.classList.add('selected')
}

const deselectPiece = () => {
  const square = document.getElementById(selectedPieceIndex)
  if (square) {
    square.classList.remove('selected')
  }

  document.querySelectorAll('.validMove').forEach((square) => {
    square.classList.remove('validMove')
    square.replaceWith(square.cloneNode(true))
  })
  selectedPieceIndex = null
}
// 7. Find Valid Moves: Calculate where each piece can move, depending on the type (normal or king).
const isValidSquare = (index) => {
  return (
    index >= 0 && index < boardSize * boardSize && boardArray[index] === null
  )
}

const calculateValidMoves = (index, piece) => {
  const validMoves = []
  if (piece.color === whitePiece) {
    direction = -1
  } else {
    direction = 1
  }

  const leftDiagonal = index + direction * (boardSize - 1)
  const rightDiagonal = index + direction * (boardSize + 1)

  if (isValidSquare(leftDiagonal)) {
    validMoves.push(leftDiagonal)
  }
  if (isValidSquare(rightDiagonal)) {
    validMoves.push(rightDiagonal)
  }

  return validMoves
}

const promoteToKing = (index) => {
  const piece = boardArray[index]
  if (
    (piece.color === blackPiece && Math.floor(index / boardSize) === 7) ||
    (piece.color === whitePiece && Math.floor(index / boardSize) === 0)
  ) {
    piece.type = kingPiece
  }
}
// 8. Click on a Square to Move: Move the piece if the player clicks a valid square, removing any captured pieces.
const highlightValidMoves = () => {
  const piece = boardArray[index]
  const validMoves = calculateValidMoves(index, piece)

  validMoves.forEach((moveIndex) => {
    const square = document.getElementById(moveIndex)
    square.classList.add('ValidMove')
    square.addEventListener('click', () => moviePiece(moveIndex))
  })
}

const refreshListners = () => {
  document.querySelectorAll('.sqr').forEach((square) => {
    const clone = square.cloneNode(true)
    square.replaceWith(clone)
  })
  addPieceClickListeners()
}
// 9. Turn Change: Switch to the next player, clear highlights, and update the display.
const switchTurn = () => {
  if (currentPlayer === 'White') {
    currentPlayer = 'Black'
  } else {
    currentPlayer = 'White'
  }
  updateTurnMessage()
  refreshListners()
}
// 10. Check for Win/Loss: If a player has no moves or pieces left, announce the winner; otherwise, continue turns.

// 11. Restart the Game: Reset everything to start a new game when the player clicks the reset button.

// 12. Improve Display and Accessibility: Make sure the colors are easy to see, messages are clear, and pieces have labels for accessibility.

/*----------- Event Listeners ----------*/
// 13. Add event listeners for piece clicks, square clicks, and the reset button
const addPieceClickListeners = () => {
  boardArray.forEach((piece, index) => {
    if (piece && piece.color === currentPlayer) {
      const square = document.getElementById(index)
      square.addEventListener('click', () => selectPiece(index))
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  createBoard()
  initializeBoard()
  displayPieces()
  addPieceClickListeners()
})
