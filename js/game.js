var players = [];
var game = {
    playing: false,
    ctx: null,
    borderWidth: 1,
    borderHeight: 1,
    height: 1,
    speed: 100,
    canvas: null,
    context: null,
    background: null,
    startGame() {
        document.addEventListener("keydown", game.changeDirection);
        changePage();
        game.playing = true;
        game.startAnimation();
    },
    changeDirection(event) {
        if (game.playing) {
            var player;
            for (i = 0; i < players.length; i++) {
                player = players[i];
                if (player.keyLeft == event.keyCode) {
                    player.turnLeft = true;
                    break;
                } else if (player.keyRight == event.keyCode) {
                    player.turnRight = true;
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
    hit(player, newX, newY) {
        var imageData = game.context.getImageData(player.lastX + newX, player.lastY + newY, 1, 1).data;
        var i;
        for(i = 0; i <= 3; i++) {
            if(game.background[i] != imageData[i]) {
                //return true;
            }
        };
        return false;
    },

    drawRectangleAnimation(context) {
        players.forEach(function (player) {
            context.beginPath();
            context.arc(player.lastX, player.lastY, game.height, 0, 2 * Math.PI);
            context.fillStyle = player.color;
            context.fill();
            context.lineWidth = game.borderWidth;
            context.strokeStyle = player.color;
            context.stroke();
        });
    },

    animate(canvas, context, startTime) {
        var time = (new Date()).getTime() - startTime;
        startTime = (new Date()).getTime();
        
        var newX;
        var newY;
        var counter = 0;
        players.forEach(function (player) {
            if (!player.finished) {
                if (player.turnLeft) {
                    player.angle += (1 / 10 * Math.PI);
                    player.turnLeft = false;
                } else if (player.turnRight) {
                    player.angle -= (1 / 10 * Math.PI);
                    player.turnRight = false;
                }
                newX = Math.cos(player.angle) * game.speed * time / 1000;
                newY = (-Math.sin(player.angle)) * game.speed * time / 1000;
                if (player.lastX + newX < canvas.width - game.height - game.borderHeight && player.lastX + newX > game.height &&
                    player.lastY + newY < canvas.height - game.height - game.borderHeight && player.lastY + newY > game.height &&
                    !game.hit(player, newX, newY)) {
                    player.lastX += newX;
                    player.lastY += newY;
                    counter++;
                } else {
                    player.finished = true;
                    
                }
            }
        });
        if (counter >= 2) {
            game.drawRectangleAnimation(context);
            // request new frame
            requestAnimFrame(function () {
                game.animate(canvas, context, startTime);
            });
        } else {
            //end game
            startTime = 0;
            game.playing = false;
            //reset last player positions
        }
    },

    startAnimation() {
        game.canvas = document.getElementById('game-field');
        game.context = game.canvas.getContext('2d');
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.background = game.context.getImageData(110, 150, 1, 1).data;
        window.requestAnimFrame = (function (callback) {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();
        game.drawRectangleAnimation(game.context);

        // wait one second before starting animation
        setTimeout(function () {
            var startTime = (new Date()).getTime();
            game.animate(game.canvas, game.context, startTime);
        }, 1000);
    }
}