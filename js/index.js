//In this Index.js are all settings that have to be made before the game can start.
var dev = false;
if (dev) {
    var playersButton = document.getElementById("insert-players");
    playersButton.style.display = "block";
}
function insertTestPlayers() {

    var player;
    for (i = 0; i < 3; i++) {
        player = {
            name: ("number" + (i + 1)), color: "", keyLeft: 0, keyRight: 0, finished: false,
            lastX: 100 + i * 50, lastY: 100 + i * 50, angle: 0, turnLeft: false, turnRight: false, score: 0
        };
        player.color = getColor();
        player.keyLeft = (49 + 2 * i);
        player.keyRight = (50 + 2 * i);
        players.push(player);
    }
    displayData();
}

{
    var maxPlayerNumber = 5;//not more than 5 players are allowed to attend the game. 
    var inputField = document.getElementById("player-name");//players enter their names here
    var getKeyLeft = document.getElementById("left-key");//player enters the left-key, for controlling the game
    var getKeyRight = document.getElementById("right-key");//player enters the right-key, for controlling the game
    inputField.addEventListener("keydown", checkInputField);//EventListener added, to know if the inputField is empty or has some value
    getKeyLeft.addEventListener("keydown", checkKeyCode);//EventListener added, to check if the entered keycode is correct
    getKeyRight.addEventListener("keydown", checkKeyCode);//EventListener added, to check if the entered keycode is correct
    var color = ["Red", "YellowGreen", "Blue", "Green", "Pink", "Orange", "Cyan", "BlueViolet"];//predefined colors, for the players
    var takenColor = [false, false, false, false, false, false, false, false];// when color is taken, value turns into true
}

//When there is no player, it hides the playertable
function hideTableIfEmpty() {
    if (players.length == 0) {
        var temp = document.getElementById("player-table");
        temp.hidden = true;
    }
}

//This function assignes the color to the players inorder
function getColor() {
    var i = 0;
    while (takenColor[i]) {
        i++;
    }
    takenColor[i] = true;
    return color[i];
}

//This function make sure that there are not more than the max amount of players addable to the playerlist
function checkInputField(event) {
    if (event.keyCode == 13 && players.length < maxPlayerNumber) {
        AddPlayer();
    }
}

//FUNCTION that checks the key-code, to make sure the entered key-code is ok for playing
function checkKeyCode(event) {
    var htmlObject;
    if (event.currentTarget.id == "left-key") {
        htmlObject = getKeyLeft;
        htmlObject.hidden = true;
        htmlObject = document.getElementById("left-key-value");
        if (event.keyCode <= 32)
            AddPlayer();
        else
            htmlObject.innerHTML = String.fromCharCode(event.keyCode);
    } else {
        htmlObject = getKeyRight;
        htmlObject.hidden = true;
        htmlObject = document.getElementById("right-key-value");
        if (event.keyCode <= 32)
            AddPlayer();
        else
            htmlObject.innerHTML = String.fromCharCode(event.keyCode);
    }
}

//This function checks if there is already a player with the same name in the playerList passed as argument
function contains(playerName, playerList) {
    var contains = false;
    playerList.forEach(function (entry) {
        if (entry.name == playerName) {
            contains = true;
            return;
        }
    });
    return contains;
}

//This function adds a player to the playerlist, assignes a color to the player --> TO-DO: add the keys for left and right!!!
function AddPlayer() {
    var controls = true;
    var control = document.getElementById("left-key-value");
    if (control.innerHTML == "")
        controls = false;
    control = document.getElementById("right-key-value");
    if (control.innerHTML == "")
        controls = false;
    if (inputField.value != "" && !contains(inputField.value, players) && controls) {
        var player = {
            name: "", color: "", keyLeft: 0, keyRight: 0, finished: false, lastX: 0,
            lastY: 0, angle: 0, turnLeft: false, turnRight: false, score: 0, holeCounter: 0
        };
        player.name = inputField.value;
        player.keyRight = control.innerHTML.charCodeAt(0);
        control = document.getElementById("left-key-value");
        player.keyLeft = control.innerHTML.charCodeAt(0);
        player.lastX = Math.round((500 * Math.random()) + 100);
        player.lastY = Math.round((200 * Math.random()) + 100);
        player.angle = Math.round((360 * Math.random()));
        player.holeCounter = Math.round(Math.random() * 400 + 100);
        players.push(player);
        players[players.length - 1].color = getColor();
        resetForm();
        if (players.length > maxPlayerNumber - 1) {
            document.getElementById("add-player").disabled = true;
        }
        displayData();
    } else {
        if (inputField.value == "")
            alert("Player-Name empty! Please put in at least one character.");
        else if (!controls)
            alert("One or no control keys set! Please set both!");
        else
            alert("Player already exists! Please choose another name.");
    }
    hideTableIfEmpty();
}

function resetForm() {
    inputField.value = "";
    getKeyLeft.hidden = false;
    getKeyRight.hidden = false;
    var htmlObject = document.getElementById("left-key-value");
    htmlObject.innerHTML = "";
    htmlObject = document.getElementById("right-key-value");
    htmlObject.innerHTML = "";
}

//This function displayes the current playerlist, also the color that has been assigned to the player and a delete-button
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
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        cell0.innerHTML = entry.name;
        cell1.innerHTML = String.fromCharCode(entry.keyLeft) + " / " + String.fromCharCode(entry.keyRight);
        cell2.innerHTML = entry.score;
        cell3.innerHTML = '<button class="btn btn-default" onclick="deleteElem(' + i + ')">Delete</button>';
        i++;
    });
    hideTableIfEmpty();
}

//This function deletes the selected gamer out of the playerlist. --> through push on the "delete"-button
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

//This function pushes Gamerentry to the right to make space for the canvas --> disable this function, if there is no gamer 
function changePage() {
    var startPage = document.getElementById("start-page");
    var gamePage = document.getElementById("game-page");
    if (startPage.style.display == "none") {
        startPage.style.display = "block";
        gamePage.style.display = "none";
    } else {
        startPage.style.display = "none";
        gamePage.style.display = "block";
    }
}
