const playerRangeMin = document.querySelector('#min-range');
const playerRangeMax = document.querySelector('#max-range');
const submitRangeBtn = document.querySelector('.submit-range-btn');
const rangeDisplayMin = document.querySelector('.range-num-min');
const rangeDisplayMax = document.querySelector('.range-num-max');
const playerOneName = document.querySelector('#player-one-name');
const playerOneGuess = document.querySelector('#player-one-guess');
const playerTwoName = document.querySelector('#player-two-name');
const playerTwoGuess = document.querySelector('#player-two-guess');
const submitGuessBtn = document.querySelector('.submit-btn');
const resetGameBtn = document.querySelector('.reset-btn');
const clearGameBtn = document.querySelector('.clear-btn');
const displayPlayerOneName = document.querySelector('.player-one-feedback-name');
const displayPlayerOneGuess = document.querySelector('.player-one-current-guess');
const displayPlayerOneFeedback = document.querySelector('.player-one-feedback');
const displayPlayerTwoName = document.querySelector('.player-two-feedback-name');
const displayPlayerTwoGuess = document.querySelector('.player-two-current-guess');
const displayPlayerTwoFeedback = document.querySelector('.player-two-feedback');
const documentAside = document.querySelector('.aside');
const playerMessage = document.querySelector('.message-to-player');
var rangeMin = 1;
var rangeMax = 10;
var playerOne = 'Player One';
var playerTwo = 'Player Two';
let playerOneGuessMem;
let playerTwoGuessMem;
let randomNum;
var winningPlayers = [];
let guessCounter = 0;
var timerIncrementer = 0;
var startGame = false;

const generateRandom = () => {
  randomNum = Math.floor(Math.random() * (rangeMax - rangeMin) + rangeMin);
  console.log(randomNum)
}

generateRandom();

const enterNewRange = (e) => {
  e.preventDefault();
  rangeMin = parseInt(playerRangeMin.value);
  rangeMax = parseInt(playerRangeMax.value);
  let valid = validateRange(rangeMin, rangeMax);
  if (valid) {
    generateRandom();
    displayRange(rangeMin, rangeMax);
    displayMessage('Awesome! Enter your guesses and names!')
  } else {
    displayRange('--', '--');
    displayMessage('Please enter a minimum range that is less than the maximum range')
  }
}

const displayMessage = (message) => {
  playerMessage.innerText = message;
}

const validateRange = (min, max) => {
  if (min < max) {
    return true;
  }
}

const grabPlayerNames = () => {
  if (playerOneName.value) {
    playerOne = playerOneName.value;
  }
  if (playerTwoName.value) {
    playerTwo = playerTwoName.value;
  }
  displayPlayerNames();
}

const grabPlayerGuesses = () => {
  playerOneGuessMem = parseInt(playerOneGuess.value);
  playerTwoGuessMem = parseInt(playerTwoGuess.value);
  displayPlayerGuesses();
}

const displayPlayerGuesses = () => {
  displayPlayerOneGuess.innerText = playerOneGuessMem;
  displayPlayerTwoGuess.innerText = playerTwoGuessMem;
}

const displayPlayerNames = () => {
  displayPlayerOneName.innerText = playerOne;
  displayPlayerTwoName.innerText = playerTwo;
}

const displayRange = (min, max) => {
  rangeDisplayMin.innerText = `${min} `;
  rangeDisplayMax.innerText = max;
}

const validateAnswer = (guess) => {
  if (guess < rangeMin || guess > rangeMax || isNaN(guess)) {
    displayMessage('Please enter all numbers within the displayed range');
    return false;
  } else {
    return true;
  }
}

const guessCheck = (num, player, playerNum) => {
  console.log(randomNum);
  let playerDisplaySelector;
  if (playerNum === 1) {
    playerDisplaySelector = displayPlayerOneFeedback;
  } else {
    playerDisplaySelector = displayPlayerTwoFeedback;
  }
  if (num < randomNum) {
    playerDisplaySelector.innerText = `${player} is too low`;
    displayMessage('');
  } else if (num > randomNum) {
    playerDisplaySelector.innerText = `${player} is too high`;
    displayMessage('');
  } else if (num === randomNum) {
    playerDisplaySelector.innerText = `${player} is CORRECT!`;
    winningPlayers.push(player);
    wonGame(winningPlayers);
  }
}

const resetGame = () => {
  generateRandom();
  playerOneName.value = '';
  playerTwoName.value = '';
  playerOneGuess.value = '';
  playerTwoGuess.value = '';
}

const clearGuesses = () => {
  playerOneGuess.value = '';
  playerTwoGuess.value = '';
}

const increaseRange = () => {
  rangeMax += 10;
  rangeMin -= 10;
}

const wonGame = (playersArr) => {
  startGame = false;
  const player = playersArr.reduce((acc, player) => {
    acc += ` ${player} `
    return acc;
  }, '');
  setTimeout(() => {
    displayMessage(`${player} DOMINATION!`);
  }, 0);
  createWinnerCard();
  timerIncrementer = 0;
  increaseRange();
  generateRandom();
  displayRange(rangeMin, rangeMax);
  clearGuesses();
  resetGuessCounter();
  winningPlayers = [];
  displayMessage('Great Job! Lets play again!')
}

const reduceWinners = (winnerArray) => {
  return winnerArray.reduce((acc, player) => {
    acc += ` ${player} `
    return acc;
  }, '')
}

const createWinnerCard = () => {
  let newDiv = document.createElement('div');
  let winners = reduceWinners(winningPlayers);
  newDiv.innerHTML = `
  <div class="win-card">
    <h2>${playerOne} VS ${playerTwo}</h2>
    <h1>${winners} WIN</h1>
    <p>Total guesses: ${guessCounter}</p>
    <p>Total time: ${timerIncrementer.toFixed(1)} seconds.</p>
    <button class="delete-winner-card">Delete</button>
  </div>
  `
  documentAside.append(newDiv);
}

const resetGuessCounter = () => {
  guessCounter = 0;
}

const timer = () => {
  if (startGame === false) {
    return;
  } else {
    setTimeout(() => {
      timerIncrementer += 0.1
      timer();
    }, 100);
  }
}

submitGuessBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (startGame === false) {
    startGame = true;
    timer();
  }
  grabPlayerNames();
  grabPlayerGuesses();
  if(validateAnswer(playerOneGuessMem) && validateAnswer(playerTwoGuessMem)) {
    guessCounter += 1;
    guessCheck(playerOneGuessMem, playerOne, 1);
    guessCheck(playerTwoGuessMem, playerTwo, 2);
  }
  clearGuesses();
})

submitRangeBtn.addEventListener('click', (e) => {
  enterNewRange(e)
})

playerOneGuess.addEventListener('keyup', () => {
  if (playerOneGuess.value && playerTwoGuess.value) {
    resetGameBtn.disabled = false;
    resetGameBtn.classList.remove('disabled');
    submitGuessBtn.disabled = false;
    submitGuesseBtn.classList.remove('disabled');
    clearGameBtn.disabled = false;
    clearGameBtn.classList.remove('disabled');
  }
})

playerTwoGuess.addEventListener('keyup', () => {
  if (playerOneGuess.value && playerTwoGuess.value) {
    resetGameBtn.disabled = false;
    resetGameBtn.classList.remove('disabled');
    submitGuessBtn.disabled = false;
    submitGuessBtn.classList.remove('disabled');
    clearGameBtn.disabled = false;
    clearGameBtn.classList.remove('disabled');
  }
})

resetGameBtn.addEventListener('click', () => {
  resetGame();
})

clearGameBtn.addEventListener('click', () => {
  clearGuesses();
})

documentAside.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-winner-card')) {
    e.target.parentElement.remove();
  }
})
