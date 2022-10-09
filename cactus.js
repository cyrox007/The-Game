class Cactus {
    constructor (ctx, cactusPositionY, cactusPositionX) {
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
            this.cactusDraw();
            this.cactusMoving += 3;
        }
    }
}