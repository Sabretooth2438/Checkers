/*-------------- Constants -------------*/
const boardSize = 8
const whitePiece = 'White'
const blackPiece = 'Black'
const normalPiece = 'normal'
const kingPiece = 'king'
const blackPieceRows = [0, 1, 2]
const whitePieceRows = [5, 6, 7]

/*---------- Variables (state) ---------*/
let currentPlayer = 'White'
let boardArray = Array(boardSize * boardSize).fill(null)
let selectedPieceIndex = null
let direction
/*----- Cached Element References  -----*/
const boardEle = document.getElementById('board')
const restartEle = document.getElementById('restart')

/*-------------- Functions -------------*/
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

const updateTurnMessage = (message = null) => {
  const messageElement = document.getElementById('Message')
  if (message) {
    messageElement.textContent = message
  } else {
    messageElement.textContent = `${currentPlayer}'s Turn`
  }
}

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

const movePiece = (toIndex) => {
  boardArray[toIndex] = boardArray[selectedPieceIndex]
  boardArray[selectedPieceIndex] = null
  deselectPiece()
  promoteToKing(toIndex)
  switchTurn()
  checkWinCondition()
  displayPieces()
}

const highlightValidMoves = (index) => {
  const piece = boardArray[index]
  const validMoves = calculateValidMoves(index, piece)

  validMoves.forEach((moveIndex) => {
    const square = document.getElementById(moveIndex)
    square.classList.add('validMove')
    square.addEventListener('click', () => movePiece(moveIndex))
  })
}

const refreshListeners = () => {
  document.querySelectorAll('.sqr').forEach((square) => {
    const clone = square.cloneNode(true)
    square.replaceWith(clone)
  })
  addPieceClickListeners()
}

const switchTurn = () => {
  if (currentPlayer === 'White') {
    currentPlayer = 'Black'
  } else {
    currentPlayer = 'White'
  }
  updateTurnMessage()
  refreshListeners()
}

const disableListeners = () => {
  document.querySelectorAll('.sqr').forEach((square) => {
    const clone = square.cloneNode(true)
    square.replaceWith(clone)
  })
}

const checkWinCondition = () => {
  let whitePieces = 0
  let blackPieces = 0

  for (let i = 0; i < boardArray.length; i++) {
    const piece = boardArray[i]
    if (piece) {
      if (piece.color === whitePiece) {
        whitePieces++
      } else if (piece.color === blackPiece) {
        blackPieces++
      }
    }
  }

  const messageElement = document.getElementById('Message')
  if (whitePieces === 0) {
    messageElement.textContent = 'Black Wins!'
    disableListeners()
  } else if (blackPieces === 0) {
    messageElement.textContent = 'White Wins!'
    disableListeners()
  }
}

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
  updateTurnMessage()
  addPieceClickListeners()
})

restartEle.addEventListener('click', () => {
  boardArray = Array(boardSize * boardSize).fill(null)
  selectedPieceIndex = null
  currentPlayer = 'White'
  createBoard()
  initializeBoard()
  displayPieces()
  updateTurnMessage()
  addPieceClickListeners()
})
