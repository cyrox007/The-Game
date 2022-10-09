class Cactus {
    constructor (cactusPositionY, cactusPositionX) {
        this.cactusPositionY = cactusPositionY;
        this.cactusPositionX = cactusPositionX;
        this.cactusMoving = 0;

        this.cactusDraw = function () {
            let cactus = document.getElementById('cactus');
            ctx.beginPath();
            ctx.drawImage(cactus, this.cactusPositionX - this.cactusMoving, this.cactusPositionY+30, 50, 100);
            ctx.closePath();
        }
        
        this.cactusSpawn = function () {
            this.cactusDraw();
            this.cactusMoving++;
        }
    }
}