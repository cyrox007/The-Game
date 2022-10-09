class Cactus {
    constructor (canvas, ctx, cactusPositionY, cactusPositionX) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.cactusPositionY = cactusPositionY;
        this.cactusPositionX = cactusPositionX;
        this.cactusMoving = 0;

        this.cactusDraw = function () {
            let cactus = document.getElementById('cactus');
            ctx.beginPath();
            ctx.drawImage(cactus, this.cactusPositionX - this.cactusMoving, this.cactusPositionY+20, 20, 60);
            ctx.closePath();
        }
        
        this.cactusSpawn = function () {
            if (this.cactusMoving >= this.canvas.clientWidth+20) {
                this.cactusMoving = 0;
            }
            this.cactusDraw();
            this.cactusMoving += 3;
        }
    }
}