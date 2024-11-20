/*-------------- Constants -------------*/
const boardSize = 8
const whitePiece = 'White'
const blackPiece = 'Black'
const normalPiece = 'normal'
const kingPiece = 'king'

/*---------- Variables (state) ---------*/
let currentPlayer = whitePiece
let board = Array(boardSize * boardSize).fill(null)
let selectedPiece = null
let continuedJump = false
let resetAnimationDirection = 'left'

/*----- Cached Element References  -----*/
const boardEle = document.getElementById('board')
const restartEle = document.getElementById('restart')
const messageEle = document.getElementById('Message')
const instructionsToggle = document.getElementById('instructions-toggle')
const instructions = document.getElementById('instructions')

const eventHandlers = {
  moveHandlers: {},
  pieceHandlers: {}
}

/*-------------- Functions -------------*/
// Creates the checkerboard pattern
const createBoard = () => {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const square = document.createElement('div')
    square.classList.add('sqr')

    const row = Math.floor(i / boardSize)
    const col = i % boardSize

    square.classList.add((row + col) % 2 === 0 ? 'white' : 'black')
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

    if (!continuedJump) {
      if (isValidSpace(leftMove) && Math.abs(leftMoveRow - row) === 1) {
        validMoves.push(leftMove)
      }
      if (isValidSpace(rightMove) && Math.abs(rightMoveRow - row) === 1) {
        validMoves.push(rightMove)
      }
    }

    // Jump moves
    const jumpLeft = index + dir * 2 * (boardSize - 1)
    const jumpRight = index + dir * 2 * (boardSize + 1)
    const jumpLeftRow = Math.floor(jumpLeft / boardSize)
    const jumpRightRow = Math.floor(jumpRight / boardSize)

    if (isValidSpace(jumpLeft) && Math.abs(jumpLeftRow - row) === 2) {
      const midPoint = (index + jumpLeft) / 2
      if (board[midPoint] && board[midPoint].color !== piece.color) {
        validMoves.push(jumpLeft)
      }
    }

    if (isValidSpace(jumpRight) && Math.abs(jumpRightRow - row) === 2) {
      const midPoint = (index + jumpRight) / 2
      if (board[midPoint] && board[midPoint].color !== piece.color) {
        validMoves.push(jumpRight)
      }
    }
  })

  return validMoves
}

// Check for available jumps
const checkForJumps = () => {
  for (let i = 0; i < board.length; i++) {
    const piece = board[i]
    if (piece && piece.color === currentPlayer) {
      const savedContinuedJump = continuedJump
      continuedJump = false
      const moves = findValidMoves(i, piece)
      continuedJump = savedContinuedJump

      const hasJump = moves.some(
        (moveIndex) =>
          Math.abs(moveIndex - i) === 2 * (boardSize - 1) ||
          Math.abs(moveIndex - i) === 2 * (boardSize + 1)
      )

      if (hasJump) {
        return true
      }
    }
  }
  return false
}

// Checks if a move is a jump
const isJumpMove = (fromIndex, toIndex) => {
  const delta = toIndex - fromIndex
  const possibleDeltas = [
    2 * (boardSize - 1),
    2 * (boardSize + 1),
    -2 * (boardSize - 1),
    -2 * (boardSize + 1)
  ]
  return possibleDeltas.includes(delta)
}

// Shows possible moves
const showMoves = (index) => {
  const piece = board[index]
  const validMoves = findValidMoves(index, piece)

  validMoves.forEach((moveIndex) => {
    const square = document.getElementById(moveIndex)
    square.classList.add('validMove')
    function handleMoveClick() {
      movePiece(moveIndex)
    }
    eventHandlers.moveHandlers[moveIndex] = handleMoveClick
    square.addEventListener('click', handleMoveClick)
  })
}

// Handles piece movement
const movePiece = (toIndex) => {
  const isJump = isJumpMove(selectedPiece, toIndex)
  let moreJumps = false

  if (isJump) {
    capturePiece(selectedPiece, toIndex)
  }

  const movingPiece = board[selectedPiece]
  board[selectedPiece] = null
  board[toIndex] = movingPiece

  clearSelection()

  checkForKing(toIndex)

  if (isJump) {
    moreJumps = findValidMoves(toIndex, board[toIndex]).some((move) =>
      isJumpMove(toIndex, move)
    )
  }

  renderBoard()

  if (moreJumps) {
    continuedJump = true
    selectedPiece = toIndex
    const square = document.getElementById(toIndex)
    square.classList.add('selected')
    showMoves(toIndex)
  } else {
    continuedJump = false
    selectedPiece = null
    checkForKing(toIndex)
    switchPlayer()
    resetListeners()
  }

  if (!checkWinner()) {
    updateMessage()
  }
}

// Removes captured piece
// Update the capturePiece function in script.js
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
    piece &&
    ((piece.color === blackPiece && Math.floor(index / boardSize) === 7) ||
      (piece.color === whitePiece && Math.floor(index / boardSize) === 0))
  ) {
    piece.type = kingPiece
    renderBoard()
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
    const moveIndex = parseInt(square.id)
    const handler = eventHandlers.moveHandlers[moveIndex]
    if (handler) {
      square.removeEventListener('click', handler)
      delete eventHandlers.moveHandlers[moveIndex]
    }
  })

  if (!continuedJump) {
    selectedPiece = null
  }
}

// Checks if any piece has valid moves
const hasValidMoves = () => {
  let hasMoves = false

  board.forEach((piece, index) => {
    if (piece && piece.color === currentPlayer) {
      const savedContinuedJump = continuedJump
      continuedJump = false
      const moves = findValidMoves(index, piece)
      continuedJump = savedContinuedJump

      if (moves.length > 0) {
        hasMoves = true
      }
    }
  })
  return hasMoves
}

// Changes active player
const switchPlayer = () => {
  if (currentPlayer === whitePiece) {
    currentPlayer = blackPiece
  } else {
    currentPlayer = whitePiece
  }
  updateMessage()
}

// Updates game message
const updateMessage = (message = null, color = currentPlayer) => {
  let icon
  if (color === whitePiece) {
    icon = '⚪'
  } else {
    icon = '⚫'
  }

  messageEle.classList.add('message-transition')

  messageEle.innerHTML = `
  <span>
    ${icon} ${message || `${color}'s Turn`} ${icon}
  </span>
`
  setTimeout(() => {
    messageEle.classList.remove('message-transition')
  }, 300)
}

// Creates Win Screen
const createWinScreen = (winner) => {
  const winScreen = document.createElement('div')
  winScreen.className = 'win-screen'

  const winContent = document.createElement('div')
  winContent.className = 'win-content'

  const winText = document.createElement('div')
  winText.className = 'win-text'
  winText.textContent = `${winner} Wins!`

  const piece = document.createElement('div')
  piece.className = 'win-piece'
  piece.style.cssText = `
      background-color: ${winner === 'White' ? '#ddd' : '#111'};
      border: 2px solid ${winner === 'White' ? '#aaa' : '#888'};
  `

  winContent.appendChild(winText)
  winContent.appendChild(piece)
  winScreen.appendChild(winContent)

  const boardContainer = document.querySelector('.board-container')
  boardContainer.appendChild(winScreen)
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
    updateMessage('Black Wins!', blackPiece)
    freezeBoard()
    createWinScreen('Black')
    return true
  } else if (blackCount === 0) {
    updateMessage('White Wins!', whitePiece)
    freezeBoard()
    createWinScreen('White')
    return true
  }

  if (!hasValidMoves()) {
    let winner = currentPlayer === whitePiece ? blackPiece : whitePiece
    updateMessage(`${winner} Wins!`, winner)
    freezeBoard()
    createWinScreen(winner)
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
    const index = parseInt(square.id)
    const handler = eventHandlers.pieceHandlers[index]
    if (handler) {
      square.removeEventListener('click', handler)
      delete eventHandlers.pieceHandlers[index]
    }
  })
  addClickHandlers()
}

// Sets up piece click handlers
const addClickHandlers = () => {
  if (continuedJump && selectedPiece !== null) {
    const square = document.getElementById(selectedPiece)
    function handlePieceClick() {
      selectPiece(selectedPiece)
    }
    eventHandlers.pieceHandlers[selectedPiece] = handlePieceClick
    square.addEventListener('click', handlePieceClick)
  } else {
    board.forEach((piece, index) => {
      if (piece && piece.color === currentPlayer) {
        const square = document.getElementById(index)
        function handlePieceClick() {
          selectPiece(index)
        }
        eventHandlers.pieceHandlers[index] = handlePieceClick
        square.addEventListener('click', handlePieceClick)
      }
    })
  }
}

// Handles piece selection
const selectPiece = (index) => {
  if (continuedJump && index !== selectedPiece) {
    return
  }

  if (selectedPiece === index) {
    clearSelection()
    return
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
  currentPlayer = whitePiece
  continuedJump = false
  boardEle.innerHTML = ''

  const animationClass =
    resetAnimationDirection === 'left'
      ? 'board-reset-left'
      : 'board-reset-right'

  boardEle.classList.add(animationClass)

  createBoard()
  setupBoard()
  renderBoard()
  updateMessage()
  resetListeners()

  setTimeout(() => {
    boardEle.classList.remove(animationClass)
  }, 500)

  resetAnimationDirection =
    resetAnimationDirection === 'left' ? 'right' : 'left'
})

// Instructions
instructionsToggle.addEventListener('click', () => {
  instructions.classList.toggle('show')
})
