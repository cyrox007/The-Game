/* Breakout — ранний учебный Canvas-эксперимент. */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;
let running = false;
let animationFrame = null;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 25;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let column = 0; column < brickColumnCount; column++) {
    bricks[column] = [];
    for (let row = 0; row < brickRowCount; row++) {
        bricks[column][row] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;
let lives = 3;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#D58A2A';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#2D3E44';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row < brickRowCount; row++) {
            const brick = bricks[column][row];
            if (brick.status !== 1) {
                continue;
            }

            brick.x = column * (brickWidth + brickPadding) + brickOffsetLeft;
            brick.y = row * (brickHeight + brickPadding) + brickOffsetTop;

            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
            ctx.fillStyle = '#9F775A';
            ctx.fill();
            ctx.closePath();
        }
    }
}

function collisionDetection() {
    for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row < brickRowCount; row++) {
            const brick = bricks[column][row];
            if (brick.status !== 1) {
                continue;
            }

            if (
                x > brick.x
                && x < brick.x + brickWidth
                && y > brick.y
                && y < brick.y + brickHeight
            ) {
                dy = -dy;
                brick.status = 0;
                score += 100;

                if (score === brickColumnCount * brickRowCount * 100) {
                    finishGame('YOU WIN, CONGRATULATIONS!');
                    return;
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Lives: ${lives}`, canvas.width - 70, 20);
}

function finishGame(message) {
    running = false;
    if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
    }
    window.alert(`${message}\nScore: ${score}`);
    window.location.reload();
}

function draw() {
    if (!running) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (!running) {
        return;
    }

    drawScore();
    drawLives();

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives -= 1;
            if (lives === 0) {
                finishGame('Game Over!');
                return;
            }
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width - paddleWidth) / 2;
        }
    }

    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    animationFrame = window.requestAnimationFrame(draw);
}

function keyDownHandler(event) {
    if (event.key === 'ArrowRight') {
        rightPressed = true;
        event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
        leftPressed = true;
        event.preventDefault();
    }
}

function keyUpHandler(event) {
    if (event.key === 'ArrowRight') {
        rightPressed = false;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function pointerMoveHandler(event) {
    const rect = canvas.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    if (relativeX > 0 && relativeX < rect.width) {
        paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, relativeX * (canvas.width / rect.width) - paddleWidth / 2));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.querySelector('.breakout-start');
    const startButton = document.getElementById('breakout-start');

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    canvas.addEventListener('pointermove', pointerMoveHandler, false);

    startButton.addEventListener('click', () => {
        startScreen.classList.remove('active');
        canvas.classList.add('active');
        running = true;
        animationFrame = window.requestAnimationFrame(draw);
    }, { once: true });
});
