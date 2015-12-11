var players = [];
var game = {
    startGame() {
        document.addEventListener("keydown", game.changeDirection);
        changePage();
        //start game
    },
    changeDirection(event) {
        //change direction of certain player
    },
    checkFinished() {
        //can be implemented
    }
}

var canvas;
var ctx;
var lastPt = null;
var myRectangle = {
    x: 100,
    y: 0,
    width: 200,
    height: 50,
    borderHeight: 5
};
var canvas1 = document.getElementById('animation-div');
var context = canvas1.getContext('2d');

window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

function drawRectangleAnimation(myRectangle, context) {
    context.beginPath();
    context.rect(myRectangle.x, myRectangle.y, myRectangle.width, myRectangle.height);
    context.fillStyle = '#000000';
    context.fill();
    context.lineWidth = myRectangle.borderWidth;
    context.strokeStyle = 'black';
    context.stroke();
}
function animate(myRectangle, canvas1, context, startTime) {
    // update
    var time = (new Date()).getTime() - startTime;

    var linearSpeed = 100;
    // pixels / second
    var newX = linearSpeed * time / 1000;

    if (newX < canvas1.height - myRectangle.height - myRectangle.borderHeight / 2) {
        myRectangle.y = newX;
        // clear
        context.clearRect(0, 0, canvas1.width, canvas1.height);

        drawRectangleAnimation(myRectangle, context);

        // request new frame
        requestAnimFrame(function () {
            animate(myRectangle, canvas1, context, startTime);
        });
    } else {
    }
}

function startAnimation() {
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
    drawRectangleAnimation(myRectangle, context);

    // wait one second before starting animation
    setTimeout(function () {
        var startTime = (new Date()).getTime();
        animate(myRectangle, canvas1, context, startTime);
    }, 1000);
}