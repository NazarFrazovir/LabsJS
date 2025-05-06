// ======= Збір DOM-елементів =======
const board = document.getElementById('gameBoard');
const restartBtn = document.getElementById('restart');
const startBtn = document.getElementById('startGame');
const resetBtn = document.getElementById('resetSettings');
const playersCount = document.getElementById('playersCount');
const player1Name = document.getElementById('player1Name');
const player2Name = document.getElementById('player2Name');
const player2Label = document.getElementById('player2Label');
const difficulty = document.getElementById('difficulty');
const moveCountDisplay = document.getElementById('moveCount');
const turnDisplay = document.getElementById('turnDisplay');
const timerDisplay = document.getElementById('timer');
const roundsInput = document.getElementById('rounds');
const gameInfo = document.getElementById('gameInfo');
const scoreDisplay = document.getElementById('scoreDisplay');

// ======= Глобальні змінні =======
let symbols = ['🍎','🍌','🍇','🍒','🍉','🥝','🍑','🍍']; // Список парних символів
let cards = [];
let flippedCards = []; // Відкриті картки
let moveCount = 0; // Кількість ходів
let matchedPairs = 0; // Знайдені пари
let totalPairs = 8; // Кількість пар

let currentPlayer = 0; // Індекс поточного гравця
let playerScores = [0, 0]; // Рахунок кожного гравця
let playerNames = ['Гравець 1', 'Гравець 2']; // Імена гравців
let maxRounds = 1; // Кількість раундів
let currentRound = 1; // Поточний раунд
let totalPlayers = 1; // Кількість гравців

let timer; // Ідентифікатор таймера
let timeLeft = 0; // Час, що залишився

// ======= Подія при зміні кількості гравців =======
playersCount.addEventListener('change', () => {
  player2Label.style.display = playersCount.value === '2' ? 'block' : 'none';
});

// ======= Перемішування масиву (Fisher–Yates Shuffle) =======
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// ======= Створення елементу картки =======
function createCard(symbol) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.symbol = symbol;
  card.textContent = ''; // Початково сорочка
  card.addEventListener('click', handleCardClick);
  return card;
}

// ======= Запуск таймера відліку =======
function startTimer() {
  clearInterval(timer); // Очистити попередній
  const limits = { easy: 180, normal: 120, hard: 60 }; // Час за складністю
  timeLeft = limits[difficulty.value];
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      endRound(); // Час вийшов
    }
  }, 1000);
}

// ======= Оновлення відображення таймера =======
function updateTimerDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// ======= Обробка кліку по картці =======
function handleCardClick(e) {
  const card = e.currentTarget;

  // Заборона на третю картку або повторні кліки
  if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  card.textContent = card.dataset.symbol;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moveCount++;
    moveCountDisplay.textContent = moveCount;

    const [first, second] = flippedCards;
    if (first.dataset.symbol === second.dataset.symbol) {
      // Збіг — залишаємо відкритими
      first.classList.add('matched');
      second.classList.add('matched');
      matchedPairs++;
      playerScores[currentPlayer]++;
      updateScore();

      // Усі пари знайдено — раунд завершено
      if (matchedPairs === totalPairs) {
        clearInterval(timer);
        endRound();
      }

      flippedCards = [];
    } else {
      // Не збіг — перевертаємо назад
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        first.textContent = '';
        second.textContent = '';
        flippedCards = [];
        switchTurn();
      }, 1000);
    }
  }
}

// ======= Оновлення рахунку на екрані =======
function updateScore() {
  if (totalPlayers === 1) {
    scoreDisplay.textContent = `${playerNames[0]}: ${playerScores[0]}`;
  } else {
    scoreDisplay.textContent = `${playerNames[0]}: ${playerScores[0]} | ${playerNames[1]}: ${playerScores[1]}`;
  }
}

// ======= Зміна ходу між гравцями =======
function switchTurn() {
  if (totalPlayers === 2) {
    currentPlayer = 1 - currentPlayer;
    turnDisplay.textContent = playerNames[currentPlayer];
  }
}

// ======= Запуск нової гри =======
function initGame() {
  board.innerHTML = '';
  moveCount = 0;
  matchedPairs = 0;
  flippedCards = [];
  moveCountDisplay.textContent = 0;
  totalPlayers = parseInt(playersCount.value);

  playerScores = [0, 0]; // 💥 Скидаємо рахунок
  playerNames[0] = player1Name.value || 'Гравець 1';
  playerNames[1] = player2Name.value || 'Гравець 2';
  currentPlayer = 0;

  turnDisplay.textContent = playerNames[currentPlayer];
  updateScore();

  gameInfo.style.display = 'block';
  restartBtn.style.display = 'inline-block';

  // Генерація і перемішування пар
  const roundCards = shuffle([...symbols.slice(0, totalPairs), ...symbols.slice(0, totalPairs)]);
  roundCards.forEach(symbol => {
    const card = createCard(symbol);
    board.appendChild(card);
  });

  startTimer();
}

// ======= Скидання налаштувань до стандартних =======
function resetSettings() {
  player1Name.value = 'Гравець 1';
  player2Name.value = 'Гравець 2';
  playersCount.value = '1';
  roundsInput.value = '1';
  difficulty.value = 'easy';
  player2Label.style.display = 'none';
}

// ======= Завершення раунду / гри =======
function endRound() {
  currentRound++;

  if (currentRound > maxRounds) {
    // Перевірка переможця
    let winner = playerScores[0] > playerScores[1] ? playerNames[0]
                : playerScores[1] > playerScores[0] ? playerNames[1]
                : 'Нічия';
    alert(`Гру завершено! Переможець: ${winner}`);
    resetSettings();
    gameInfo.style.display = 'none';
    restartBtn.style.display = 'none';
    board.innerHTML = '';
  } else {
    // Перехід до наступного раунду
    alert(`Раунд ${currentRound - 1} завершено. Наступний раунд!`);
    playerScores = [0, 0];
    initGame();
  }
}

// ======= Обробка кнопок =======
startBtn.addEventListener('click', () => {
  maxRounds = parseInt(roundsInput.value);
  initGame();
});

restartBtn.addEventListener('click', initGame);
resetBtn.addEventListener('click', resetSettings);
