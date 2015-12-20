//In this game.js are all functions that make the game run.

var players = [];
var finishedList = [];
var game = {//settings for game
    playing: false,
    ctx: null,
    borderWidth: 1,
    borderHeight: 1,
    height: 1,
    speed: 100,
    canvas: null,
    context: null,
    holeSize: 20,
    maximumChangeOfAngle: 3,
    disableButton() {//"Start-Game"-Button
        var btn = document.getElementById("start-game");
        btn.style.display = "none";
        btn = document.getElementById("start-game-2");
        btn.style.display = "inline";
        if (game.playing) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
    },
    startGameIntr() {//(event)listens for a control-key down, to initializes a direction change
        document.addEventListener("keydown", game.changeDirection);
        document.addEventListener("keyup", game.controlRelease);
        changePage();
        game.playing = true;
        game.startAnimation();
    },
    startGame() {//starts the game: calles the animation function, which initializes the moving process of the line
        game.playing = true;
        game.startAnimation();
    },
    changeDirection(event) {//makes the line changes the direction, left or right depends on the set key-code
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
    controlRelease(event) {
        if (game.playing) {
            var player;
            for (i = 0; i < players.length; i++) {
                player = players[i];
                if (player.keyLeft == event.keyCode) {
                    player.turnLeft = false;
                    break;
                } else if (player.keyRight == event.keyCode) {
                    player.turnRight = false;
                    break;
                }
            }
        }
    },
    hit(player, newX, newY) {//Step-by-step moving process of the line
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
    drawRectangleAnimation(context) {//draws rectangel in the given player-color
        players.forEach(function (player) {
            player.holeCounter--;
            if (player.holeCounter > 0) {
                context.beginPath();
                context.arc(player.lastX, player.lastY, game.height, 0, 2 * Math.PI);
                context.fillStyle = player.color;
                context.fill();
                context.lineWidth = game.borderWidth;
                context.strokeStyle = player.color;
                context.stroke();
            } else if (player.holeCounter == -game.holeSize) {
                player.holeCounter = Math.round(Math.random() * 400 + 100);
            }
        });
    },
    animate(canvas, context) {//Moving process of the line: also angle the line does. Speed is defined
        var newX;
        var newY;
        var counter = 0;
        players.forEach(function (player) {
            if (!player.finished) {
                if (player.turnLeft) {
                    player.angle += game.maximumChangeOfAngle;
                } else if (player.turnRight) {
                    player.angle -= game.maximumChangeOfAngle;
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
                game.animate(canvas, context);
            });
        } else {
            game.playing = false;
            game.disableButton();
            var scoreAdd = 0;
            players.forEach(function (player) {
                if (!contains(player.name, finishedList))
                    finishedList.push(player);
            });
            finishedList.forEach(function (player) {
                player.score += scoreAdd;
                player.finished = false;
                player.lastX = Math.round((500 * Math.random()) + 100);
                player.lastY = Math.round((200 * Math.random()) + 100);
                player.angle = Math.round((360 * Math.random()));
                player.turnLeft = false;
                player.turnRight = false;
                scoreAdd++;
            });
            displayData();
            finishedList = [];
            //TODO:reset last player positions
        }
    },
    startAnimation() {//Starts the whole animation! (sets the canvas before the first rectangle can be drawn) 
        game.disableButton();
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
        game.drawRectangleAnimation(game.context);//draws rectangle in the player-color on the canvas
        // wait one second before starting animation
        setTimeout(function () {
            game.animate(game.canvas, game.context);
        }, 1000);
    }
}