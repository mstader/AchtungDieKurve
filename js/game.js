var players = [];
var finishedList = [];
var game = {
    playing: false,
    ctx: null,
    borderWidth: 1,
    borderHeight: 1,
    height: 1,
    speed: 100,
    canvas: null,
    context: null,
    counter: 0,
    mximumChangeOfAngle: 10,
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
        var nextPosX = (player.lastX + newX) * 100 / 100;
        var nextPosY = (player.lastY + newY) * 100 / 100;
        if (newX < 0)
            nextPosX = Math.floor(nextPosX) - 2;
        else if (newX > 0)
            nextPosX = Math.ceil(nextPosX) + 2;
        else
            nextPosX = Math.round(nextPosX);
        if (newY < 0)
            nextPosY = Math.floor(nextPosY) - 2;
        else if (newY > 0)
            nextPosY = Math.ceil(nextPosY) + 2;
        else
            nextPosY = Math.round(nextPosY);
        var imageData = game.context.getImageData(Math.round(nextPosX), Math.round(nextPosY), 1, 1);
        var background = game.context.getImageData(1, 1, 1, 1);
        for (i = 0; i <= imageData.data.length; i++) {
            if (background.data[i] != imageData.data[i]) {
                return true;
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
                    player.angle += game.mximumChangeOfAngle;
                    player.turnLeft = false;
                } else if (player.turnRight) {
                    player.angle -= game.mximumChangeOfAngle;
                    player.turnRight = false;
                }
                newX = (Math.cos(player.angle * Math.PI / 180) * game.speed / 100);
                newY = (-Math.sin(player.angle * Math.PI / 180) * game.speed / 100);
                if (player.lastX + newX < canvas.width - game.height - game.borderHeight && player.lastX + newX > game.height &&
                    player.lastY + newY < canvas.height - game.height - game.borderHeight && player.lastY + newY > game.height &&
                    !game.hit(player, newX, newY)) {
                    player.lastX += newX;
                    player.lastY += newY;
                    counter++;
                } else {
                    player.finished = true;
                    finishedList.push(player);
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
            game.playing = false;
            var scoreAdd = 0;
            players.forEach(function (player) {
                if (!contains(player.name, finishedList))
                    finishedList.push(player);
            });
            finishedList.forEach(function (player) {
                player.score += scoreAdd;
                scoreAdd++;
            });
            displayData();
            finishedList = [];
            //TODO:reset last player positions
        }
    },
    startAnimation() {
        game.canvas = document.getElementById('game-field');
        game.context = game.canvas.getContext('2d');
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.context.beginPath();
        game.context.rect(0, 0, game.canvas.width, game.canvas.height);
        game.context.fillStyle = "#404040";
        game.context.fill();
        game.context.lineWidth = game.borderWidth;
        game.context.strokeStyle = "#404040";
        game.context.stroke();
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