/* игровое пространство */
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

/* задаем размеры игрового поля */
canvas.width = window.outerWidth / 100 * 75;
canvas.height = window.outerHeight / 100 * 90;

let playingFieldWidth = canvas.clientWidth;
let playingFieldHeight = canvas.clientHeight;
let floorHeight = 20;

let startingPositionY = playingFieldHeight - floorHeight - 130;

let dinoJumpPress = false;

function drawFloor() {
    ctx.beginPath();
    ctx.rect(0, playingFieldHeight - floorHeight, playingFieldWidth, floorHeight);
    ctx.fillStyle = '#D58A2A';
    ctx.fill();
    ctx.closePath();
}
let dino = new Dino(ctx, startingPositionY);
let cactus = new Cactus(startingPositionY, playingFieldWidth);
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFloor();
    
    dino.drawDino();
    dino.dinoControll(dinoJumpPress);
    cactus.cactusSpawn();
    
    requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', function () {
    
    
    draw(dino, cactus);
    document.addEventListener('keydown', (e)=>{
        e.preventDefault();
        if (e.code == 'Space') {
            dinoJumpPress = true;
        }
    });
});
