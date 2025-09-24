"use strict";
const overlay = document.getElementById("overlay-container");
const game = document.getElementById("game-container");
const settings = document.getElementById("settings-container");
let gameInfo = {
    aiEnemy: false,
    aiLevel: 1,
    startingPlayer: 1, // 1 is default, 0 is ai, 2 is other player
    playerOneName: "Player 1",
    playerTwoName: "Player 2",
    firstTurn: true,
    currentTurn: null
};
gameInfo.currentTurn = gameInfo.startingPlayer;
let field = {
    11: null,
    12: null,
    13: null,
    21: null,
    22: null,
    23: null,
    31: null,
    32: null,
    33: null
}; // use this to make system more robust against cheats

for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        let id = i * 10 + j;
        document.getElementById(id).addEventListener(("click"), claimBox(id, gameInfo.currentTurn));
    }
}

showOverlay("welcome", "Welcome to TacStack", "TicTacToe but reimagined as a web-based game!", "Let's have fun!");

document.getElementById("settings-button").addEventListener(("click"), () => {
    settings.style.display = "none";
    showOverlay("start", "Start a new game", "Click one of the buttons below to start a new game or change the current settings!", "Play TacStack");
})

document.getElementById("playWithAi-btn").addEventListener(("click"), () => {
    if (gameInfo.aiEnemy === true) {
        document.getElementById("playWithAi-btn").innerText = "Off";
        gameInfo.aiEnemy = false;
        document.getElementById("settings-aiLevel").style.display = "none";
        document.getElementById("settings-playerTwoName").style.display = "block";
        document.getElementById("startingPlayer-btn").innerText = gameInfo.playerOneName;
        gameInfo.startingPlayer = 1;
    } else {
        document.getElementById("playWithAi-btn").innerText = "On";
        gameInfo.aiEnemy = true;
        document.getElementById("settings-aiLevel").style.display = "block";
        document.getElementById("settings-playerTwoName").style.display = "none";
        document.getElementById("startingPlayer-btn").innerText = gameInfo.playerOneName;
        gameInfo.startingPlayer = 1;
    }
})

document.getElementById("aiLevel-btn").addEventListener(("click"), () => {
    if (gameInfo.aiLevel === 1) {
        document.getElementById("aiLevel-btn").innerText = "Medium";
        gameInfo.aiLevel = 2;
    } else if (gameInfo.aiLevel === 2) {
        document.getElementById("aiLevel-btn").innerText = "Hard";
        gameInfo.aiLevel = 3;
    } else {
        document.getElementById("aiLevel-btn").innerText = "Easy";
        gameInfo.aiLevel = 1;
    }
})

document.getElementById("startingPlayer-btn").addEventListener(("click"), () => {
    if (gameInfo.startingPlayer === 1) {
        if (gameInfo.aiEnemy === true) {
            document.getElementById("startingPlayer-btn").innerText = "AI";
            gameInfo.startingPlayer = 0;
        } else {
            document.getElementById("startingPlayer-btn").innerText = gameInfo.playerTwoName;
            gameInfo.startingPlayer = 2;
        }
    } else {
        document.getElementById("startingPlayer-btn").innerText = gameInfo.playerOneName;
        gameInfo.startingPlayer = 1;
    }
})

document.getElementById("playerOneName-input").addEventListener(("input"), (e) => {
    if (gameInfo.startingPlayer === 1) {
        if (e.target.value.length === 0 || e.target.value.length > 20) {
            gameInfo.playerOneName = "Player 1";
            document.getElementById("startingPlayer-btn").innerText = gameInfo.playerOneName;
        } else {
            gameInfo.playerOneName = e.target.value;
            document.getElementById("startingPlayer-btn").innerText = gameInfo.playerOneName;
        }
    } else {
        if (e.target.value.length === 0 || e.target.value.length > 20) {
            gameInfo.playerOneName = "Player 1";
        } else {
            gameInfo.playerOneName = e.target.value;
        }
    }
})

document.getElementById("playerTwoName-input").addEventListener(("input"), (e) => {
    if (gameInfo.startingPlayer === 2) {
        if (e.target.value.length === 0 || e.target.value.length > 20) {
            gameInfo.playerTwoName = "Player 2";
            document.getElementById("startingPlayer-btn").innerText = gameInfo.playerTwoName;
        } else {
            gameInfo.playerTwoName = e.target.value;
            document.getElementById("startingPlayer-btn").innerText = gameInfo.playerTwoName;
        }
    } else {
        if (e.target.value.length === 0 || e.target.value.length > 20) {
            gameInfo.playerTwoName = "Player 2";
        } else {
            gameInfo.playerTwoName = e.target.value;
        }
    }
})

function showOverlay(state, title, msg, btn) {
    overlay.style.display = "block";
    document.getElementById("overlay-button-secondary").style.display = "none";
    document.getElementById("overlay-title").innerText = title;
    document.getElementById("overlay-text").innerText = msg;
    if (state === "start") {
        document.getElementById("overlay-button-secondary").style.display = "inline-block";
        document.getElementById("overlay-button-secondary").innerText = "Change Settings";
    }
    if (!btn) {
        document.getElementById("overlay-button-primary").innerText = "Okay"
    } else {
        document.getElementById("overlay-button-primary").innerText = btn;
    }
    document.getElementById("overlay-button-primary").addEventListener(("click"), () => {
        if (state === "start") {
            overlay.style.display = "none";
            game.style.display = "flex";
        } else if (state === "end" || state === "welcome") {
            showOverlay("start", "Start a new game", "Click one of the buttons below to start a new game or change the current settings!", "Play TacStack");
        } else {
            overlay.style.display = "none";
        }
    })
    document.getElementById("overlay-button-secondary").addEventListener(("click"), () => {
        if (state === "start") {
            overlay.style.display = "none";
            settings.style.display = "block";
        }
    })
}

function claimBox(id, player) {
    if (gameInfo.firstTurn) {
        gameInfo.firstTurn = false;
        if (player === 1) {
            document.getElementById(id).innerText = "X";
        } else {
            document.getElementById(id).innerText = "O";
        }
    } else {
        if (document.getElementById(id).innerText !== "") {
            if (player === 1) {
                document.getElementById(id).innerText = "X";
            } else {
                document.getElementById(id).innerText = "O";
            }
        }
    }
}

function checkWin(player) {}

function idToPos(id) {
    return {
        x: id % 10,
        y: Math.trunc(id / 10)
    };
}