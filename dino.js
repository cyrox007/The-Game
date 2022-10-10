class Dino {
    constructor(ctx, dinoPositionY) {
        this.ctx = ctx;
        this.dinoPositionX = 100;
        this.dinoPositionY = dinoPositionY;
        this.dinoWidth = 80;
        this.dinoHeight = 80;
        this.dinoJumpHeight = 0;
        this.dinoJumpLength = 50;
        this.dinoJumpCount = 0;
        this.spacePressed = false;

        this.drawDino = function () {
            let dino = document.getElementById('dino');
            this.ctx.beginPath();
            this.ctx.drawImage(dino, this.dinoPositionX, this.dinoPositionY-this.dinoJumpHeight, this.dinoWidth, this.dinoHeight);
            this.ctx.closePath();
        }
        
        this.dinoControll = function (flag) {
            this.spacePressed = flag;
            
            if(this.spacePressed) {
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