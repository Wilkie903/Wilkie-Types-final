const textContainer = document.getElementById('text-container');
const timerElement = document.getElementById('timer');
const overlay = document.getElementById('overlay');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');

const commonWords = ["the", "and", "you", "that", "was", "for", "on", "are", "with", "as", "his", "they", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there", "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make", "like", "him", "into", "time", "has", "look", "two", "more", "write", "go", "see", "number", "no", "way", "could", "people", "my", "than", "first", "water", "been", "call", "who", "oil", "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part"];

let generatedText = '';
let currentIndex = 0;
let correctEntries = 0;
let totalEntries = 0;
let timer;
let countdownTimer;
let startTime;
let gameStarted = false;

function generateText() {
    while (generatedText.length < 300) {
        generatedText += commonWords[Math.floor(Math.random() * commonWords.length)] + ' ';
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
    generateText();
    displayText();
    document.addEventListener('keydown', handleTyping);
}

function handleTyping(e) {
    if (!gameStarted) {
        gameStarted = true;
        startTime = new Date().getTime();
        timer = setTimeout(endGame, 30000);
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
    const timeLeft = 30 - Math.floor((new Date().getTime() - startTime) / 1000);
    timerElement.textContent = timeLeft;
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
    timerElement.textContent = "30";
    startGame();
}

startGame();
