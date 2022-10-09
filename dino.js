class Dino {
    constructor(ctx, dinoPositionY) {
        this.ctx = ctx;
        this.dinoPositionY = dinoPositionY;
        this.dinoJumpHeight = 0;
        this.dinoJumpLength = 50;
        this.dinoJumpCount = 0;
        this.spacePressed = false;

        this.drawDino = function () {
            let dino = document.getElementById('dino');
            this.ctx.beginPath();
            this.ctx.drawImage(dino, 100, this.dinoPositionY-this.dinoJumpHeight, 150, 150);
            this.ctx.closePath();
        }
        
        this.dinoControll = function (flag) {
            this.spacePressed = flag;
            if(this.spacePressed) {
                debugger;
                this.dinoJumpCount++;
                this.dinoJumpHeight = 4 * this.dinoJumpLength * Math.sin(Math.PI * this.dinoJumpCount / this.dinoJumpLength);
            }
            if(this.dinoJumpCount > this.dinoJumpLength) {
                this.dinoJumpCount = 0;
                dinoJumpPress = false;
                this.dinoJumpHeight = 0;
            }
        }
    }
}