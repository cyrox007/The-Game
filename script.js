let game = new Object();
game = {
    data: {
        canvas: document.getElementById('myCanvas'),
        ctx: document.getElementById('myCanvas').getContext('2d'),
        coordX: document.getElementById('myCanvas').width/2,
        coordY: document.getElementById('myCanvas').height-30,
        driveX: 2,
        driveY: -2,
        ballRadius: 10,
        paddleHeight: 10,
        paddleWidth: 75,
        paddleX: (document.getElementById('myCanvas').width-75)/2
    },
    functions: {
        drawBall: () => {
            game.data.ctx.beginPath();
            game.data.ctx.arc(game.data.coordX, game.data.coordY, game.data.ballRadius, 0, Math.PI*2);
            game.data.ctx.fillStyle = '#0095DD';
            game.data.ctx.fill();
            game.data.ctx.closePath();
        },
        draw: () => {
            game.data.ctx.clearRect(0, 0, game.data.canvas.width, game.data.canvas.height);
            game.functions.drawBall();
            game.data.coordX += game.data.driveX;
            game.data.coordY += game.data.driveY;
            
            if (game.data.coordY + game.data.driveY < 0 || 
                game.data.coordY + game.data.driveY > game.data.canvas.height-game.data.ballRadius) {
                game.data.driveY = -game.data.driveY;
            }

            if (game.data.coordX + game.data.driveX > game.data.canvas.width-game.data.ballRadius ||
                game.data.coordX + game.data.driveX < game.data.ballRadius) {
                game.data.driveX = -game.data.driveX;
            }
        },
        drawPaddle: () => {
            
        }
    }
};
(function (){
    setInterval(game.handler.draw, 10);
}());