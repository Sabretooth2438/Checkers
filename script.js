/*-------------- Constants -------------*/
// Define board size, piece types, and player colors.
const boardSize = 8
const whitePiece = 'White'
const blackPiece = 'Black'
const normalPiece = 'normal'
const kingPiece = 'king'

/*---------- Variables (state) ---------*/
// Track the game state: current player, board layout, and selected piece.
let currentPlayer = 'White'
let boardArray = Array(boardSize * boardSize).fill(null)
let selectedPieceIndex = null

/*----- Cached Element References  -----*/
// Link to DOM elements for the board, message, and restart button.
const boardEle = document.getElementById('board')
const restartEle = document.getElementById('restart')
const messageEle = document.getElementById('Message')

/*-------------- Functions -------------*/

// Create the visual board layout.
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
  return
}

// Initialize the board state with pieces in starting positions.
const initializeBoard = () => {
  const blackPieceRows = [0, 1, 2]
  const whitePieceRows = [5, 6, 7]

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
  return
}

// Display pieces on the board based on the game state.
const displayPieces = () => {
  boardArray.forEach((piece, index) => {
    const square = document.getElementById(index)
    square.innerHTML = '' // Clear previous pieces

    if (piece) {
      const pieceElement = document.createElement('div')
      if (piece.color === blackPiece) {
        pieceElement.classList.add('blackPiece')
      } else if (piece.color === whitePiece) {
        pieceElement.classList.add('whitePiece')
      }
      square.appendChild(pieceElement)
    }
  })
  return
}

// Calculate valid moves for a selected piece.
const calculateValidMoves = (index, piece) => {
  const validMoves = []
  if (piece.type === kingPiece) {
    const directions = [-1, 1]
    for (let dir of directions) {
      const leftDiagonal = index + dir * (boardSize - 1)
      const rightDiagonal = index + dir * (boardSize + 1)

      if (isValidSquare(leftDiagonal)) {
        validMoves.push(leftDiagonal)
      }
      if (isValidSquare(rightDiagonal)) {
        validMoves.push(rightDiagonal)
      }
    }
  } else {
    let direction
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
  }

  return validMoves
}

// Highlight valid moves for a selected piece.
const highlightValidMoves = (index) => {
  const piece = boardArray[index]
  const validMoves = calculateValidMoves(index, piece)

  validMoves.forEach((moveIndex) => {
    const square = document.getElementById(moveIndex)
    square.classList.add('validMove')
    square.addEventListener('click', () => movePiece(moveIndex))
  })
  return
}

// Move a piece to a new square.
const movePiece = (toIndex) => {
  boardArray[toIndex] = boardArray[selectedPieceIndex]
  boardArray[selectedPieceIndex] = null
  deselectPiece()
  promoteToKing(toIndex)
  switchTurn()
  checkWinCondition()
  displayPieces()
  refreshListeners()
  return
}

// Promote a piece to king if it reaches the opposite side.
const promoteToKing = (index) => {
  const piece = boardArray[index]
  if (
    (piece.color === blackPiece && Math.floor(index / boardSize) === 7) ||
    (piece.color === whitePiece && Math.floor(index / boardSize) === 0)
  ) {
    piece.type = kingPiece
  }
  return
}

// Check if a square index is valid and empty.
const isValidSquare = (index) => {
  if (
    index >= 0 &&
    index < boardSize * boardSize &&
    boardArray[index] === null
  ) {
    return true
  }
  return false
}

// Deselect the currently selected piece.
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
  return
}

// Switch to the next player's turn.
const switchTurn = () => {
  if (currentPlayer === 'White') {
    currentPlayer = 'Black'
  } else {
    currentPlayer = 'White'
  }
  updateTurnMessage()
  return
}

// Update the turn or win message.
const updateTurnMessage = (message = null) => {
  if (message) {
    messageEle.textContent = message
  } else {
    messageEle.textContent = `${currentPlayer}'s Turn`
  }
  return
}

// Check if a player has won the game.
const checkWinCondition = () => {
  let whitePieces = 0
  let blackPieces = 0

  boardArray.forEach((piece) => {
    if (piece) {
      if (piece.color === whitePiece) {
        whitePieces++
      } else if (piece.color === blackPiece) {
        blackPieces++
      }
    }
  })

  if (whitePieces === 0) {
    updateTurnMessage('Black Wins!')
    disableListeners()
  } else if (blackPieces === 0) {
    updateTurnMessage('White Wins!')
    disableListeners()
  }
  return
}

// Disable all event listeners on the board.
const disableListeners = () => {
  document.querySelectorAll('.sqr').forEach((square) => {
    const clone = square.cloneNode(true)
    square.replaceWith(clone)
  })
  return
}

// Refresh event listeners after each turn.
const refreshListeners = () => {
  document.querySelectorAll('.sqr').forEach((square) => {
    const clone = square.cloneNode(true)
    square.replaceWith(clone)
  })
  addPieceClickListeners()
  return
}

// Add click listeners to all pieces of the current player.
const addPieceClickListeners = () => {
  boardArray.forEach((piece, index) => {
    if (piece && piece.color === currentPlayer) {
      const square = document.getElementById(index)
      square.addEventListener('click', () => selectPiece(index))
    }
  })
  return
}

// Handle piece selection.
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
  highlightValidMoves(index)
  return
}

/*----------- Event Listeners ----------*/
// Initialize the game when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
  createBoard()
  initializeBoard()
  displayPieces()
  addPieceClickListeners()
  updateTurnMessage()
  return
})

// Restart the game when the restart button is clicked.
restartEle.addEventListener('click', () => {
  boardArray = Array(boardSize * boardSize).fill(null)
  selectedPieceIndex = null
  currentPlayer = 'White'
  boardEle.innerHTML = '' // Clear the board
  createBoard()
  initializeBoard()
  displayPieces()
  updateTurnMessage()
  refreshListeners()
  return
})
