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

let presetTime = 1500;
let enemySpeed = 5;

let date = new Date();
let timestart = date.getTime();

let score = 0;

let over = false;
let attempts = 0;

function soudtracks() {
    let soundtrack = document.createElement('audio');
    soundtrack.setAttribute('src', '/audio/track-1.mp3');
    document.querySelector('body').prepend(soundtrack);
    return soundtrack;
}

let sound = soudtracks();

function drawFloor() {
    ctx.beginPath();
    ctx.rect(0, playingFieldHeight - floorHeight, playingFieldWidth, floorHeight);
    ctx.fillStyle = '#D58A2A';
    ctx.fill();
    ctx.closePath();
}

let dino = new Dino(ctx, startingPositionY);
let cacti = [];

function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomInterval(timeInterval) {
    let returnTime = timeInterval;
    if (Math.random() < 0.5) {
        returnTime += getRandomNumber(presetTime/3, presetTime * 1.5);
    } else {
        returnTime -= getRandomNumber(presetTime/5, presetTime/2);
    }
    return returnTime;
}

function generateCactus() {
    let timeDelay = randomInterval(presetTime);
    cacti.push(new Cactus(canvas, ctx, enemySpeed));
    setTimeout(generateCactus, timeDelay);
    console.log(cacti);
}

let meteorites = [];
function generateMeteorite() {
    let timeDelay = randomInterval(presetTime);
    meteorites.push(new Meteorite(canvas, ctx, enemySpeed));
    setTimeout(generateMeteorite, timeDelay);
    console.log(meteorites);
}

function scoreDraw() {
    if (sessionStorage.getItem('score') != null) {
        ctx.font = '16px Arial';
        ctx.fillStyle = "#0095DD";
        score++;
        ctx.fillText("Ваш последний показатель: " + sessionStorage.getItem('score'), 8, 40);
    }
    ctx.font = '16px Arial';
    ctx.fillStyle = "#0095DD";
    score++;
    ctx.fillText("Score: "+score, 8, 20);
}

function gameOver() {
    cacti.forEach((cactus, index) => {
        if (dino.dinoPositionX+(dino.dinoWidth) >= cactus.x+(cactus.cactusWidth/2) &&
            dino.dinoPositionX <= cactus.x+(cactus.cactusWidth) &&
            (dino.dinoPositionY-dino.dinoJumpHeight) >= cactus.y-(cactus.cactusHeight/2)) {
            
            sound.pause();
            over = true;
            let blockloss = document.createElement('div');
            let btnRetry = document.createElement('button');
            let info = document.createElement('p');
            btnRetry.innerText = "Заново";
            blockloss.appendChild(info);
            blockloss.appendChild(btnRetry);
            info.innerText = 'Ваш счет: '+score;
            sessionStorage.setItem('score', score);
            blockloss.classList.add('loss');
            document.querySelector('body').appendChild(blockloss);
            canvas.classList.remove('active');
            btnRetry.addEventListener('click', (e) => {
                window.location.reload();
            });
        }
    });
    
}

function draw() {
    if (over) {
        return;
    }
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFloor();
    dino.drawDino();
    dino.dinoControll(dinoJumpPress);

    cacti.forEach((cactus, index) => {
        cactus.slide();
        if ((cactus.x) <= 0) {
            setTimeout(() => {
                cacti.splice(index, 1)
            }, 0)
        }
    });
    meteorites.forEach((meteorite, index) => {
        meteorite.meteoriteFly();
        if ((meteorite.y) >= canvas.height) {
            setTimeout(() => {
                meteorites.splice(index, 1)
            }, 0)
        }
    })
    scoreDraw();
    gameOver();
}

setTimeout(() => {
    generateCactus();
    generateMeteorite();
}, randomInterval(presetTime));

setInterval(() => {
    let arr = document.querySelectorAll('audio[src="/audio/17-beam.mp3"]');
    if (arr.length > 1) {
        arr.forEach(el=>{
            el.remove();
        });
    }
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
    let main = document.querySelector('main');
    main.querySelector('button').addEventListener('click', () => {
        main.classList.toggle('active');
        document.querySelector('canvas').classList.toggle('active');
        draw();
    });
    document.addEventListener('keydown', (e)=>{
        e.preventDefault();
        let jsound = document.createElement('audio');
        jsound.setAttribute('src', '/audio/17-beam.mp3');
        document.querySelector('body').prepend(jsound);
        if (e.code == 'Space') {
            dinoJumpPress = true;
            jsound.play();
        }
    });
});

