/* игровое пространство */
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
/* параметры и координаты мяча + шаг смещения */
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;
/* параметры плашки */
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
/* флаг управление плашкой */
let rightPressed = false;
let leftPressed = false;
/* параметры кирпичиков */
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 25;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
/* массив кирпичей в игровом поле */
let bricks = [];
for (let column = 0; column < brickColumnCount; column++) {
    bricks[column] = [];
    for (let row = 0; row < brickRowCount; row++) {
        bricks[column][row] = { 
            x: 0, 
            y: 0,
            status: 1 
        };
    }
}
let score = 0;
let lives = 3;

/* отрисовка мяча */
let drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#D58A2A';
    ctx.fill();
    ctx.closePath();
};

/* функция отрисовки игры */
let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // предварительная отчистка
    drawBricks(); // рисуем кирпичи
    drawBall(); // отрисовывает мяч
    drawPaddle(); // отрисовываем плашку
    collisionDetection(); // мониторим столкновения с кирпичами
    drawScore(); // счет
    drawLives();
    x += dx; // изменяем координаты
    y += dy;

    // условие отскока от стен
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        // мониторим касание с плашкой
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert("Game Over!\n Your score:"+score);
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }
    
    // управление плашкой
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    requestAnimationFrame(draw);
};

// отрисовка плашки
let drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#2D3E44";
    ctx.fill();
    ctx.closePath();
};

let drawBricks = () => {
    for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row < brickRowCount; row++) {
            if (bricks[column][row].status == 1) {
                let brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#9F775A";
                ctx.fill();
                ctx.closePath();
            }
        }
        
    }
};

// функция смены флага при нажатии клавиш
let keyDownHandler = (e) => {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    if (e.keyCode == 37) {
        leftPressed = true;
    }
};

let keyUpHandler = (e) => {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    if (e.keyCode == 37) {
        leftPressed = false;
    }
};

let mouseMoveHandler = (e) => {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
};

let toucheMoveHandler = (e) => {
    let relativeX = e.changedTouches - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
};

let collisionDetection = () => {
    for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row < brickRowCount; row++) {
            let brick = bricks[column][row];
            if (x > brick.x && 
                x < brick.x + brickWidth && 
                y > brick.y && 
                y < brick.y + brickHeight &&
                brick.status == 1) {
                dy = -dy;
                brick.status = 0;
                score += 100;
                if (score == brickColumnCount * brickRowCount * 100) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                }
            }
        }
    }
};

let drawScore = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
};

let drawLives = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
};

document.addEventListener('DOMContentLoaded', ()=>{
    let gameInfo = document.createElement('p');
    gameInfo.style.fontFamily = 'Arial';
    gameInfo.style.fontSize = '18px';
    gameInfo.style.textAlign = 'center';
    gameInfo.innerText = 'Use the "left" or "right" buttons, or use the mouse to control';
    document.querySelector('body').prepend(gameInfo);
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    document.addEventListener('mousemove', mouseMoveHandler, false);
    document.addEventListener('touchmove', toucheMoveHandler, false);
    draw();
});