var maxPlayerNumber = 5;
var inputField = document.getElementById("player-name");
inputField.addEventListener("keydown", checkInputField);
var color = ["Red", "YellowGreen", "Blue", "Green", "Pink", "Orange", "Cyan", "BlueViolet"];
var takenColor = [false, false, false, false, false, false, false, false];

function hideTableIfEmpty() {
    if (players.length == 0) {
        var temp = document.getElementById("player-table");
        temp.hidden = true;
    }
}

function getColor() {
    var i = 0;
    while (takenColor[i]) {
        i++;
    }
    takenColor[i] = true;
    return color[i];
}

function checkInputField(event) {
    if (event.keyCode == 13 && players.length < maxPlayerNumber) {
        AddPlayer();
    }
}

function contains(playerName) {
    var contains = false;
    players.forEach(function (entry) {
        if (entry.name == playerName) {
            contains = true;
            return;
        }
    });
    return contains;
}

function AddPlayer() {
    if (inputField.value != "" && !contains(inputField.value)) {
        var player = { name: "", color: "", keyLeft: '', keyRight: '', finished: false };
        player.name = inputField.value;
        players.push(player);
        players[players.length - 1].color = getColor();
        inputField.value = "";
        if (players.length > maxPlayerNumber - 1) {
            document.getElementById("add-player").disabled = true;
        }
        displayData();
    } else {
        if (inputField.value == "")
            alert("Player-Name empty! Please put in at least one character.");
        else
            alert("Player already exists! Please choose another name.")
    }
    hideTableIfEmpty();
}

function displayData() {
    var temp = document.getElementById("player-table");
    temp.hidden = false;
    var table = document.getElementById("player-table");
    var i = 1;
    while (table.rows.length > 1) {
        table.deleteRow(i);
    }
    i = 1;
    players.forEach(function (entry) {
        var row = table.insertRow(i);
        row.style.backgroundColor = entry.color;
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        cell0.innerHTML = entry.name;
        cell1.innerHTML = '<button class="btn btn-default" onclick="deleteElem(' + i + ')">Delete</button>';
        i++;
    });
    hideTableIfEmpty();
}

function deleteElem(index) {
    var playersNew = [];
    var i = 1;
    players.forEach(function (entry) {
        if (index != i)
            playersNew.push(entry);
        else {
            for (var j = 0; j < color.length; j++) {
                if (entry.color == color[j]) {
                    takenColor[j] = false;
                    break;
                }
            }
        }
        i++;
    });
    document.getElementById("add-player").disabled = false;
    players = playersNew;
    displayData();
}

function changePage() {
    var startPage = document.getElementById("start-page");
    var gamePage = document.getElementById("game-page");
    //changePage
    if (startPage.style.display == "none") {
        startPage.style.display = "block";
        gamePage.style.display = "none";
    } else {
        startPage.style.display = "none";
        gamePage.style.display = "block";
    }
}