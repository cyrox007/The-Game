/* игровое пространство */
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

/* задаем размеры игрового поля */
canvas.width = window.outerWidth / 100 * 75;
canvas.height = window.outerHeight / 100 * 90;

let playingFieldWidth = canvas.clientWidth;
let playingFieldHeight = canvas.clientHeight;
let floorHeight = 20;

let startingPositionY = playingFieldHeight - floorHeight-80;

let dinoJumpPress = false;

function drawFloor() {
    ctx.beginPath();
    ctx.rect(0, playingFieldHeight - floorHeight, playingFieldWidth, floorHeight);
    ctx.fillStyle = '#D58A2A';
    ctx.fill();
    ctx.closePath();
}

let dino = new Dino(ctx, startingPositionY);
let cacti = [];
for (let index = 0; index < 5; index++) {
    let cactus = new Cactus(canvas, ctx, startingPositionY, playingFieldHeight);
    cacti.push(cactus);
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFloor();
    dino.drawDino();
    dino.dinoControll(dinoJumpPress);

    cacti.forEach(el=>{
        setTimeout(el.cactusSpawn(), 500);
    });

    requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', function () {
    let soundtrack = document.createElement('audio');
    soundtrack.setAttribute('src', '/audio/track-1.mp3');
    document.querySelector('body').prepend(soundtrack);
    
    draw();
    document.addEventListener('keydown', (e)=>{
        e.preventDefault();
        if (e.code == 'Space') {
            dinoJumpPress = true;
        }
    });
});
