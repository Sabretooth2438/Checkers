/*-------------- Constants -------------*/
const boardSize = 8
const whitePiece = 'White'
const blackPiece = 'Black'
const normalPiece = 'normal'
const kingPiece = 'king'

/*---------- Variables (state) ---------*/
let currentPlayer = 'White'
let board = Array(boardSize * boardSize).fill(null)
let selectedPiece = null

/*----- Cached Element References  -----*/
const boardEle = document.getElementById('board')
const restartEle = document.getElementById('restart')
const messageEle = document.getElementById('Message')

/*-------------- Functions -------------*/
// Creates the checkerboard pattern
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

// Sets up initial piece positions
const setupBoard = () => {
  const blackRows = [0, 1, 2]
  const whiteRows = [5, 6, 7]

  blackRows.forEach((row) => {
    for (let col = 0; col < boardSize; col += 2) {
      let startCol = col
      if (row % 2 === 0) {
        startCol = col + 1
      }
      const index = row * boardSize + startCol
      board[index] = { color: blackPiece, type: normalPiece }
    }
  })

  whiteRows.forEach((row) => {
    for (let col = 0; col < boardSize; col += 2) {
      let startCol = col
      if (row % 2 === 0) {
        startCol = col + 1
      }
      const index = row * boardSize + startCol
      board[index] = { color: whitePiece, type: normalPiece }
    }
  })
}

// Updates the visual board
const renderBoard = () => {
  board.forEach((piece, index) => {
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

// Figures out where a piece can move
const findValidMoves = (index, piece) => {
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

  const row = Math.floor(index / boardSize)

  directions.forEach((dir) => {
    const leftMove = index + dir * (boardSize - 1)
    const rightMove = index + dir * (boardSize + 1)

    const leftMoveRow = Math.floor(leftMove / boardSize)
    const rightMoveRow = Math.floor(rightMove / boardSize)

    if (isValidSpace(leftMove) && Math.abs(leftMoveRow - row) === 1) {
      validMoves.push(leftMove)
    }
    if (isValidSpace(rightMove) && Math.abs(rightMoveRow - row) === 1) {
      validMoves.push(rightMove)
    }

    const jumpLeft = index + dir * 2 * (boardSize - 1)
    const jumpRight = index + dir * 2 * (boardSize + 1)

    const jumpLeftRow = Math.floor(jumpLeft / boardSize)
    const jumpRightRow = Math.floor(jumpRight / boardSize)

    if (isValidSpace(jumpLeft) && Math.abs(jumpLeftRow - row) === 2) {
      const midPoint = (index + jumpLeft) / 2
      if (board[midPoint] && board[midPoint].color !== currentPlayer) {
        validMoves.push(jumpLeft)
      }
    }

    if (isValidSpace(jumpRight) && Math.abs(jumpRightRow - row) === 2) {
      const midPoint = (index + jumpRight) / 2
      if (board[midPoint] && board[midPoint].color !== currentPlayer) {
        validMoves.push(jumpRight)
      }
    }
  })

  return validMoves
}

// Shows possible moves
const showMoves = (index) => {
  const piece = board[index]
  const validMoves = findValidMoves(index, piece)

  validMoves.forEach((moveIndex) => {
    const square = document.getElementById(moveIndex)
    square.classList.add('validMove')
    square.addEventListener('click', () => movePiece(moveIndex))
  })
}

// Handles piece movement
const movePiece = (toIndex) => {
  const jumpDistance = Math.abs(toIndex - selectedPiece)

  if (
    jumpDistance === 2 * (boardSize - 1) ||
    jumpDistance === 2 * (boardSize + 1)
  ) {
    capturePiece(selectedPiece, toIndex)
  }

  board[toIndex] = board[selectedPiece]
  board[selectedPiece] = null
  clearSelection()
  checkForKing(toIndex)
  switchPlayer()
  renderBoard()
  resetListeners()

  if (!checkWinner()) {
    updateMessage()
  }
}

// Removes captured piece
const capturePiece = (fromIndex, toIndex) => {
  const capturedSpot = (fromIndex + toIndex) / 2
  if (board[capturedSpot] && board[capturedSpot].color !== currentPlayer) {
    board[capturedSpot] = null
    const square = document.getElementById(capturedSpot)
    square.innerHTML = ''
  }
}

// Promotes to king if reached end
const checkForKing = (index) => {
  const piece = board[index]
  if (
    (piece.color === blackPiece && Math.floor(index / boardSize) === 7) ||
    (piece.color === whitePiece && Math.floor(index / boardSize) === 0)
  ) {
    piece.type = kingPiece
  }
}

// Checks if move is legal
const isValidSpace = (index) => {
  if (index >= 0 && index < boardSize * boardSize && board[index] === null) {
    return true
  }
  return false
}

// Clears current selection
const clearSelection = () => {
  const square = document.getElementById(selectedPiece)
  if (square) {
    square.classList.remove('selected')
  }

  document.querySelectorAll('.validMove').forEach((square) => {
    square.classList.remove('validMove')
    square.replaceWith(square.cloneNode(true))
  })

  selectedPiece = null
}

// Checks if any piece has valid moves
const hasValidMoves = () => {
  let hasMoves = false

  board.forEach((piece, index) => {
    if (piece && piece.color === currentPlayer) {
      const moves = findValidMoves(index, piece)
      if (moves.length > 0) {
        hasMoves = true
      }
    }
  })
  return hasMoves
}

// Changes active player
const switchPlayer = () => {
  if (currentPlayer === 'White') {
    currentPlayer = 'Black'
  } else {
    currentPlayer = 'White'
  }
  updateMessage()
}

// Updates game message
const updateMessage = (message = null) => {
  messageEle.textContent = message || `${currentPlayer}'s Turn`
}

// Checks for winner
const checkWinner = () => {
  let whiteCount = 0
  let blackCount = 0

  board.forEach((piece) => {
    if (piece) {
      if (piece.color === whitePiece) {
        whiteCount++
      } else if (piece.color === blackPiece) {
        blackCount++
      }
    }
  })

  if (whiteCount === 0) {
    updateMessage('Black Wins!')
    freezeBoard()
    return true
  } else if (blackCount === 0) {
    updateMessage('White Wins!')
    freezeBoard()
    return true
  }

  if (!hasValidMoves()) {
    let winner
    if (currentPlayer === whitePiece) {
      winner = 'Black'
    } else {
      winner = 'White'
    }
    updateMessage(`${winner} Wins! - No moves left for ${currentPlayer}`)
    freezeBoard()
    return true
  }
  return false
}

// Stops all moves
const freezeBoard = () => {
  document.querySelectorAll('.sqr').forEach((square) => {
    const clone = square.cloneNode(true)
    square.replaceWith(clone)
  })
}

// Updates click handlers
const resetListeners = () => {
  document.querySelectorAll('.sqr').forEach((square) => {
    const clone = square.cloneNode(true)
    square.replaceWith(clone)
  })
  addClickHandlers()
}

// Sets up piece click handlers
const addClickHandlers = () => {
  board.forEach((piece, index) => {
    if (piece && piece.color === currentPlayer) {
      const square = document.getElementById(index)
      square.addEventListener('click', () => selectPiece(index))
    }
  })
}

// Handles piece selection
const selectPiece = (index) => {
  if (selectedPiece === index) {
    clearSelection()
  }
  if (selectedPiece !== null) {
    clearSelection()
  }
  selectedPiece = index
  const square = document.getElementById(index)
  square.classList.add('selected')
  showMoves(index)
}

/*----------- Event Listeners ----------*/
// Game start
document.addEventListener('DOMContentLoaded', () => {
  createBoard()
  setupBoard()
  renderBoard()
  addClickHandlers()
  updateMessage()
})

// Reset game
restartEle.addEventListener('click', () => {
  board = Array(boardSize * boardSize).fill(null)
  selectedPiece = null
  currentPlayer = 'White'
  boardEle.innerHTML = ''
  createBoard()
  setupBoard()
  renderBoard()
  updateMessage()
  resetListeners()
})
