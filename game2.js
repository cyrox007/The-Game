/* Игровое пространство. Проект учебный, поэтому сохраняем простую структуру без фреймворков. */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

/* Размеры игрового поля рассчитываем по viewport, а не по внешнему размеру окна браузера. */
canvas.width = Math.max(320, Math.floor(window.innerWidth * 0.75));
canvas.height = Math.max(320, Math.floor(window.innerHeight * 0.8));

const playingFieldWidth = canvas.width;
const playingFieldHeight = canvas.height;
const floorHeight = 20;
const startingPositionY = playingFieldHeight - floorHeight - 80;

let dinoJumpPress = false;

const presetTime = 1500;
const enemySpeed = 5;

let score = 0;
let over = false;
let startedAt = 0;
let cactusTimer = null;
let meteoriteTimer = null;

const storedLastResult = sessionStorage.getItem('score');
const storedBestResult = sessionStorage.getItem('bestScore');
const user = {
    lastResult: storedLastResult === null ? null : Number(storedLastResult),
    bestResult: storedBestResult === null ? null : Number(storedBestResult),
};

/* Аудио переиспользуем вместо создания нового DOM-элемента на каждое нажатие клавиши. */
const soundtrack = new Audio('audio/track-1.mp3');
const jumpSound = new Audio('audio/17-beam.mp3');

function playSound(audio) {
    audio.currentTime = 0;
    const playback = audio.play();
    if (playback && typeof playback.catch === 'function') {
        playback.catch(() => {
            /* Браузер может запретить звук без пользовательского жеста — игра при этом продолжает работать. */
        });
    }
}

function drawFloor() {
    ctx.save();
    ctx.rect(0, playingFieldHeight - floorHeight, playingFieldWidth, floorHeight);
    ctx.fillStyle = '#D58A2A';
    ctx.fill();
    ctx.restore();
}

const dino = new Dino(ctx, startingPositionY);
let cacti = [];
let meteorites = [];

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomInterval(timeInterval) {
    if (Math.random() < 0.5) {
        return timeInterval + getRandomNumber(presetTime / 3, presetTime * 1.5);
    }
    return timeInterval - getRandomNumber(presetTime / 5, presetTime / 2);
}

function scheduleCactus() {
    cactusTimer = window.setTimeout(() => {
        if (over) {
            return;
        }
        cacti.push(new Cactus(canvas, ctx, enemySpeed));
        scheduleCactus();
    }, randomInterval(presetTime));
}

function scheduleMeteorite() {
    meteoriteTimer = window.setTimeout(() => {
        if (over) {
            return;
        }
        meteorites.push(new Meteorite(canvas, ctx, enemySpeed));
        scheduleMeteorite();
    }, randomInterval(presetTime));
}

function drawScore(now) {
    /* Счёт зависит от времени игры, а не от FPS и количества строк интерфейса. */
    score = Math.floor((now - startedAt) / 100);

    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Score: ${score}`, 8, 20);

    if (user.lastResult !== null) {
        ctx.fillText(`Ваш последний показатель: ${user.lastResult}`, 8, 40);
    }
    if (user.bestResult !== null) {
        ctx.fillText(`Ваш лучший показатель: ${user.bestResult}`, 8, 60);
    }
}

function hasCactusCollision(cactus) {
    return dino.dinoPositionX + dino.dinoWidth >= cactus.x + cactus.cactusWidth / 2
        && dino.dinoPositionX <= cactus.x + cactus.cactusWidth
        && dino.dinoPositionY - dino.dinoJumpHeight >= cactus.y - cactus.cactusHeight / 2;
}

function finishGame() {
    if (over) {
        return;
    }

    over = true;
    soundtrack.pause();
    window.clearTimeout(cactusTimer);
    window.clearTimeout(meteoriteTimer);

    const bestScore = user.bestResult === null ? score : Math.max(score, user.bestResult);
    sessionStorage.setItem('score', String(score));
    sessionStorage.setItem('bestScore', String(bestScore));

    const blockLoss = document.createElement('div');
    const btnRetry = document.createElement('button');
    const info = document.createElement('p');
    const bestScoreInfo = document.createElement('p');

    btnRetry.innerText = 'Заново';
    info.innerText = `Ваш счёт: ${score}`;
    bestScoreInfo.innerText = `Лучший результат: ${bestScore}`;

    blockLoss.appendChild(info);
    blockLoss.appendChild(bestScoreInfo);
    blockLoss.appendChild(btnRetry);
    blockLoss.classList.add('loss');
    document.body.appendChild(blockLoss);

    canvas.classList.remove('active');
    btnRetry.addEventListener('click', () => window.location.reload());
}

function draw(now) {
    if (over) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFloor();
    dino.drawDino();
    dino.dinoControll(dinoJumpPress);

    cacti.forEach((cactus) => cactus.slide());
    meteorites.forEach((meteorite) => meteorite.meteoriteFly());

    /* Удаляем ушедшие за пределы поля объекты одним проходом без отложенных splice. */
    cacti = cacti.filter((cactus) => cactus.x + cactus.cactusWidth > 0);
    meteorites = meteorites.filter((meteorite) => meteorite.y < canvas.height);

    drawScore(now);

    if (cacti.some(hasCactusCollision)) {
        finishGame();
        return;
    }

    window.requestAnimationFrame(draw);
}

function startGame() {
    const main = document.querySelector('main');
    main.classList.remove('active');
    canvas.classList.add('active');

    startedAt = performance.now();
    scheduleCactus();
    scheduleMeteorite();
    playSound(soundtrack);
    window.requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    main.querySelector('button').addEventListener('click', startGame, { once: true });

    document.addEventListener('keydown', (event) => {
        if (event.code !== 'Space' || over) {
            return;
        }

        event.preventDefault();
        if (!dinoJumpPress) {
            dinoJumpPress = true;
            playSound(jumpSound);
        }
    });
});
