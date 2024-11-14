/*-------------- Constants -------------*/
const boardSize = 8
const whitePiece = 'White'
const blackPiece = 'Black'
const normalPiece = 'normal'
const kingPiece = 'king'

/*---------- Variables (state) ---------*/
let currentPlayer = 'White'
let boardArray = Array(boardSize * boardSize).fill(null)
let selectedPieceIndex = null

/*----- Cached Element References  -----*/
const boardEle = document.getElementById('board')
const restartEle = document.getElementById('restart')
const messageEle = document.getElementById('Message')

/*-------------- Functions -------------*/
// Create Board
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

// Initialize the Board with Pieces
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
}

// Display pieces and Clear it
const displayPieces = () => {
  boardArray.forEach((piece, index) => {
    const square = document.getElementById(index)
    square.innerHTML = ''

    if (piece) {
      const pieceElement = document.createElement('div')

      if (piece.color === blackPiece) {
        pieceElement.classList.add('blackPiece')
      } else if (piece.color === whitePiece) {
        pieceElement.classList.add('whitePiece')
      }
      if (piece.type === kingPiece) {
        pieceElement.classList.add('king')
      }

      square.appendChild(pieceElement)
    }
  })
}

// Calculate Valid Moves
const calculateValidMoves = (index, piece) => {
  const validMoves = []
  let directions

  if (piece.type === kingPiece) {
    directions = [-1, 1]
  } else {
    if (piece.color === whitePiece) {
      directions = [-1]
    } else {
      directions = [1]
    }
  }

  directions.forEach((dir) => {
    const leftDiagonal = index + dir * (boardSize - 1)
    const rightDiagonal = index + dir * (boardSize + 1)

    // Normal Moves
    if (isValidSquare(leftDiagonal)) {
      validMoves.push(leftDiagonal)
    }
    if (isValidSquare(rightDiagonal)) {
      validMoves.push(rightDiagonal)
    }

    // Jump Moves
    const jumpLeft = index + dir * 2 * (boardSize - 1)
    const jumpRight = index + dir * 2 * (boardSize + 1)

    if (isValidSquare(jumpLeft)) {
      const middleIndex = (index + jumpLeft) / 2
      if (
        boardArray[middleIndex] &&
        boardArray[middleIndex].color !== currentPlayer
      ) {
        validMoves.push(jumpLeft)
      }
    }

    if (isValidSquare(jumpRight)) {
      const middleIndex = (index + jumpRight) / 2
      if (
        boardArray[middleIndex] &&
        boardArray[middleIndex].color !== currentPlayer
      ) {
        validMoves.push(jumpRight)
      }
    }
  })

  return validMoves
}

// Highlight Valid Moves
const highlightValidMoves = (index) => {
  const piece = boardArray[index]
  const validMoves = calculateValidMoves(index, piece)

  validMoves.forEach((moveIndex) => {
    const square = document.getElementById(moveIndex)
    square.classList.add('validMove')
    square.addEventListener('click', () => movePiece(moveIndex))
  })
}

// Move a Piece
const movePiece = (toIndex) => {
  const jumpDistance = Math.abs(toIndex - selectedPieceIndex)

  if (
    jumpDistance === 2 * (boardSize - 1) ||
    jumpDistance === 2 * (boardSize + 1)
  ) {
    capturePiece(selectedPieceIndex, toIndex)
  }

  boardArray[toIndex] = boardArray[selectedPieceIndex]
  boardArray[selectedPieceIndex] = null
  deselectPiece()
  promoteToKing(toIndex)
  switchTurn()
  checkWinCondition()
  displayPieces()
  refreshListeners()
}

// Capture pieces
const capturePiece = (fromIndex, toIndex) => {
  const capturedIndex = (fromIndex + toIndex) / 2
  if (
    boardArray[capturedIndex] &&
    boardArray[capturedIndex].color !== currentPlayer
  ) {
    boardArray[capturedIndex] = null
    const square = document.getElementById(capturedIndex)
    square.innerHTML = ''
  }
}

// Promotion
const promoteToKing = (index) => {
  const piece = boardArray[index]
  if (
    (piece.color === blackPiece && Math.floor(index / boardSize) === 7) ||
    (piece.color === whitePiece && Math.floor(index / boardSize) === 0)
  ) {
    piece.type = kingPiece
  }
}

// Checking square index is valid and empty.
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

// Deselect Current Piece
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

// Switch Player
const switchTurn = () => {
  if (currentPlayer === 'White') {
    currentPlayer = 'Black'
  } else {
    currentPlayer = 'White'
  }
  updateTurnMessage()
}

// Win Message
const updateTurnMessage = (message = null) => {
  if (message) {
    messageEle.textContent = message
  } else {
    messageEle.textContent = `${currentPlayer}'s Turn`
  }
}

// Check Win Game
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
}

// Disable all event listeners
const disableListeners = () => {
  document.querySelectorAll('.sqr').forEach((square) => {
    const clone = square.cloneNode(true)
    square.replaceWith(clone)
  })
}

// Refreshing event listeners after turn.
const refreshListeners = () => {
  document.querySelectorAll('.sqr').forEach((square) => {
    const clone = square.cloneNode(true)
    square.replaceWith(clone)
  })
  addPieceClickListeners()
}

// Add click listeners
const addPieceClickListeners = () => {
  boardArray.forEach((piece, index) => {
    if (piece && piece.color === currentPlayer) {
      const square = document.getElementById(index)
      square.addEventListener('click', () => selectPiece(index))
    }
  })
}

// Piece selection.
const selectPiece = (index) => {
  if (selectedPieceIndex === index) {
    deselectPiece()
  }
  if (selectedPieceIndex !== null) {
    deselectPiece()
  }
  selectedPieceIndex = index
  const square = document.getElementById(index)
  square.classList.add('selected')
  highlightValidMoves(index)
}

/*----------- Event Listeners ----------*/
// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
  createBoard()
  initializeBoard()
  displayPieces()
  addPieceClickListeners()
  updateTurnMessage()
})

// Restart the game
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
})
