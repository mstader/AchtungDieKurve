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