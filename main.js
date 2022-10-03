let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
let ballRadius = 10;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

let drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
};

let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    x += dx;
    y += dy;
    if (y + dy < ballRadius || y + dy > canvas.height-ballRadius) {
        dy = -dy;
    }
    if (x + dx < ballRadius || x + dx > canvas.width-ballRadius) {
        dx = -dx;
    }
};

let drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
};

document.addEventListener('DOMContentLoaded', ()=>{
    setInterval(draw, 10);
});