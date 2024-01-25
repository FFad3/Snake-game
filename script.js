const board = document.getElementById('game-board');
const boardSize = { x: 20, y: 20 };
const gameSpeedDelay = 200;
const instructionText = document.getElementById('instruction-text');
const score = document.getElementById('score');
const highScore = document.getElementById('highScore');

let direction = 'right';
let snake = [{ x: 10, y: 10 }];
let foodPosition = generateFoodPosition();
let gameInterval;
let gameStarted = false;

function drawGame() {
    board.innerHTML = ''; //Clear
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        stePosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function stePosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood() {
    const foodElement = createGameElement('div', 'food');
    stePosition(foodElement, foodPosition);
    board.appendChild(foodElement);
}

function randomizePosition() {
    return Math.floor(Math.random() * boardSize.x) + 1;
}

function generateFoodPosition() {
    let x, y;
    do {
        x = randomizePosition();
        y = randomizePosition();
    } while (snake.some(segment => segment.x === x && segment.y === y));
    return { x, y };
}

function move() {
    const head = { ...snake[0] }; //shallow coppy

    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head);
    if (head.x === foodPosition.x && head.y === foodPosition.y) {
        clearInterval(gameInterval);
        foodPosition = generateFoodPosition();
        gameInterval = setInterval(() => {
            move();
            checkColision();
            drawGame();
        }, gameSpeedDelay)
    }
    else {
        snake.pop();
    }
}

function startGame() {
    gameStarted = true;
    instructionText.style.display = 'none';

    gameInterval = setInterval(() => {
        move();
        checkColision();
        drawGame();
    }, gameSpeedDelay)
}

function checkColision() {
    const head = { ...snake[0] };
    if (head.x < 1 || head.x > boardSize.x || head.y < 1 || head.y > boardSize.y) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function handleKeyPress(event) {
    if (event.code === 'Space' && !gameStarted) {
        startGame();
    } else {
        const currentDirection = direction;
        switch (event.key) {
            case 'ArrowUp':
                if (currentDirection !== 'down') {
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (currentDirection !== 'up') {
                    direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (currentDirection !== 'right') {
                    direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (currentDirection !== 'left') {
                    direction = 'right';
                }
                break;
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    foodPosition = generateFoodPosition();
    direction = 'right';
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}
function updateHighScore() {
    const currentScore = snake.length - 1;
}
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
}
document.addEventListener('keydown', handleKeyPress);