function AddPlayer() {
    if (players.length >= 7) 
    document.getElementById("add-player").disabled = true;
    if(players.length <= 8)
    players.push(document.getElementById("player-name").valueOf);
    console.log("test");
}