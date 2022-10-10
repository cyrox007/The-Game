class Cactus {
    constructor (canvas, ctx, speed) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = canvas.width;
        this.y = 530+55;
        this.cactusWidth = 20;
        this.cactusHeight = 60;
        this.cactusMoving = 0;
        this.slideSpeed = speed;
    }
    cactusDraw() {
        let cactus = document.getElementById('cactus');
        ctx.save();
        ctx.drawImage(cactus, this.x, this.y, this.cactusWidth, this.cactusHeight);
        ctx.restore();
    }

    cactusSpawn() {
        if (this.cactusMoving >= this.canvas.clientWidth+20) {
            this.cactusMoving = 0;
        }
        this.cactusDraw();
    }
    slide() {
        this.cactusSpawn();
        this.x -= this.slideSpeed;
    }
}

class Meteorite {
    constructor(canvas, ctx, speed) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = canvas.width;
        this.y = 0;
        this.slideSpeed = speed;
    }
    meteotiteRender () {
        let meteorite = document.getElementById('meteorite');
        ctx.save();
        ctx.drawImage(meteorite, this.x, this.y, 20, 60);
        ctx.restore();
    }
    meteoriteFly () {
        this.meteotiteRender();
        this.x -= this.slideSpeed;
        this.y += this.slideSpeed;
    }
}