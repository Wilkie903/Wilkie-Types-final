const textContainer = document.getElementById('text-container');
const timerElement = document.getElementById('timer');
const overlay = document.getElementById('overlay');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const welcomeContainer = document.getElementById('welcome-container');
const gameContainer = document.getElementById('game-container');
const timeRange = document.getElementById('time-range');
const timeDisplay = document.getElementById('time-display');
const punctuationToggle = document.getElementById('punctuation-toggle');
const numbersToggle = document.getElementById('numbers-toggle');

const infoButton = document.getElementById('info-button');
const infoContainer = document.getElementById('info-container');
const closeInfoButton = document.getElementById('close-info');

const commonWords = ["the", "of", "and", "to", "a", "in", "is", "you", "that", "it"];
const punctuationMarks = [".", ",", "!", "?", ":", ";"];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

let generatedText = '';
let currentIndex = 0;
let correctEntries = 0;
let totalEntries = 0;
let timer;
let countdownTimer;
let startTime;
let gameStarted = false;
let gameTime = 30;

timeRange.addEventListener('input', () => {
    timeDisplay.textContent = `${timeRange.value}s`;
});

function generateText(includePunctuation, includeNumbers) {
    const sourceArray = [...commonWords];
    if (includePunctuation) {
        sourceArray.push(...punctuationMarks);
    }
    if (includeNumbers) {
        sourceArray.push(...numbers);
    }
    while (generatedText.split(' ').length < 150) {
        generatedText += sourceArray[Math.floor(Math.random() * sourceArray.length)] + ' ';
    }
}

function displayText() {
    const displayedText = generatedText.split('').map((char, index) => {
        if (index < currentIndex) {
            if (char === textContainer.textContent[index]) {
                return `<span class="correct">${char}</span>`;
            } else {
                return `<span class="incorrect">${char}</span>`;
            }
        } else if (index === currentIndex) {
            return `<span class="current">${char}</span>`;
        } else {
            return char;
        }
    }).join('').replace(/(.{1,40}\s)/g, '$1\n');
    textContainer.innerHTML = displayedText;
}

function startGame() {
    const includePunctuation = punctuationToggle.checked;
    const includeNumbers = numbersToggle.checked;
    gameTime = parseInt(timeRange.value);

    welcomeContainer.style.display = 'none';
    gameContainer.style.display = 'flex';

    generateText(includePunctuation, includeNumbers);
    displayText();
    document.addEventListener('keydown', handleTyping);
}

function handleTyping(e) {
    if (!gameStarted) {
        gameStarted = true;
        startTime = new Date().getTime();
        timer = setTimeout(endGame, gameTime * 1000);
        countdownTimer = setInterval(updateTimer, 1000);
    }

    if (e.key === generatedText[currentIndex]) {
        currentIndex++;
        correctEntries++;
    } else {
        if (e.key !== 'Shift') {
            totalEntries++;
        }
    }
    totalEntries++;
    displayText();
}

function updateTimer() {
    const timeLeft = gameTime - Math.floor((new Date().getTime() - startTime) / 1000);
    timerElement.textContent = `Time: ${timeLeft}`;
}

function endGame() {
    clearTimeout(timer);
    clearInterval(countdownTimer);
    document.removeEventListener('keydown', handleTyping);
    const elapsedTime = (new Date().getTime() - startTime) / 1000 / 60;
    const wpm = Math.round(correctEntries / 5 / elapsedTime);
    const accuracy = Math.round((correctEntries / totalEntries) * 100);
    wpmElement.textContent = `WPM: ${wpm}`;
    accuracyElement.textContent = `Accuracy: ${accuracy}%`;
    overlay.style.display = 'flex';
}

function restartGame() {
    overlay.style.display = 'none';
    currentIndex = 0;
    correctEntries = 0;
    totalEntries = 0;
    generatedText = '';
    gameStarted = false;
    textContainer.textContent = "Start typing to start";
    timerElement.textContent = `Time: ${gameTime}`;
    startGame();
}

function goToWelcomePage() {
    gameContainer.style.display = 'none';
    welcomeContainer.style.display = 'flex';
}

infoButton.addEventListener('click', () => {
    infoContainer.style.display = 'block';
});

closeInfoButton.addEventListener('click', () => {
    infoContainer.style.display = 'none';
});
