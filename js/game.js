var players = [];
var game = {
    playing: false,
    startGame() {
        document.addEventListener("keydown", game.changeDirection);
        changePage();
        game.startAnimation();
        game.playing = true;
        //start game
    },
    changeDirection(event) {
        if (game.playing) {
            var player;
            for (i = 0; i < players.length; i++) {
                player = players[i];
                if (player.keyLeft == event.keyCode) {
                    player.angle += (2 / 30 * Math.PI);
                    break;
                } else if (player.keyRight == event.keyCode) {
                    player.angle -= (2 / 30 * Math.PI);
                    break;
                }
            }
        }
    },
    checkFinished() {
        var counter = 0;
        for (i = 0; i < players.length; i++) {
            if (!entry.finished) {
                counter++;
                if (counter >= 2)
                    return false;
            }
        };
        return true;
    },

    canvas: null,
    ctx: null,
    borderWidth: 3,
    borderHeight: 1,
    height: 2,
    lineHead: {
        x: 100,
        y: 0
    },
    canvas1: null,
    context: null,

    drawRectangleAnimation(lineHead, context) {
        context.beginPath();
        context.arc(lineHead.x, lineHead.y, game.height, 0, 2 * Math.PI);
        context.fillStyle = '#000000';
        context.fill();
        context.lineWidth = game.borderWidth;
        context.strokeStyle = 'black';
        context.stroke();
    },

    animate(lineHead, canvas1, context, startTime) {
        // update
        var time = (new Date()).getTime() - startTime;
        startTime = (new Date()).getTime();

        var linearSpeed = 90;
        // pixels / second
        //var newX = linearSpeed * time / 1000;
        //var newY = linearSpeed * time / 1000 + 100;
        var player = players[0];

        var newX = Math.cos(player.angle) * linearSpeed * time / 1000;
        var newY = (-Math.sin(player.angle)) * linearSpeed * time / 1000;
        lineHead.x = player.lastX;
        lineHead.y = player.lastY;

        if (player.lastX + newX < canvas1.width - game.height - game.borderHeight && player.lastX + newX > 0 &&
            player.lastY + newY < canvas1.height - game.height - game.borderHeight && player.lastY + newY > 0) {
            lineHead.x += newX;
            lineHead.y += newY;
            player.lastX += newX;
            player.lastY += newY;
            // clear
            //context.clearRect(0, 0, canvas1.width, canvas1.height);

            game.drawRectangleAnimation(lineHead, context);

            // request new frame
            requestAnimFrame(function () {
                game.animate(lineHead, canvas1, context, startTime);
            });

        } else {
            //player.finished = true;
        }
    },

    startAnimation() {
        game.canvas1 = document.getElementById('game-field');
        game.context = game.canvas1.getContext('2d');
        window.requestAnimFrame = (function (callback) {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();
        game.drawRectangleAnimation(game.lineHead, game.context);

        // wait one second before starting animation
        setTimeout(function () {
            var startTime = (new Date()).getTime();
            game.animate(game.lineHead, game.canvas1, game.context, startTime);
        }, 1000);
    }
}