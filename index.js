function AddPlayer() {
    if (players.length >= 7) {
        document.getElementById("add-player").disabled = true;
    }
    players.push(document.getElementById("player-name").innerText);
    var playerlist = document.getElementById("player-list").innerHTML;
    playerlist += "\n<li>"+document.getElementById("player-name").innerText+"</li>";
    console.log(playerlist);
}