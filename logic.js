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
turnUpdate();
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
};

for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        let id = i * 10 + j;
        document.getElementById(id).addEventListener(("click"), () => claimBox(id));
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
            gameInfo.currentTurn = gameInfo.startingPlayer;
        } else {
            document.getElementById("startingPlayer-btn").innerText = gameInfo.playerTwoName;
            gameInfo.startingPlayer = 2;
            gameInfo.currentTurn = gameInfo.startingPlayer;
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
    game.style.display = "none";
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

function claimBox(id) {
    if (gameInfo.firstTurn) {
        gameInfo.firstTurn = false;
        if (gameInfo.currentTurn === 1) {
            document.getElementById(id).innerText = "X";
            Object.defineProperty(field, id, { value: "X" });

            if (gameInfo.aiEnemy === true) {
                setTimeout(() => aiTurn(), 2000);
            }
        } else {
            document.getElementById(id).innerText = "O";
            Object.defineProperty(field, id, { value: "O" });
        }
    } else {
        if (field[id] === null && gameInfo.currentTurn !== 0) {
            if (gameInfo.currentTurn === 1) {
                document.getElementById(id).innerText = "X";
                Object.defineProperty(field, id, { value: "X" });

                if (gameInfo.aiEnemy === true) {
                setTimeout(() => aiTurn(), 2000);
            }
            } else {
                document.getElementById(id).innerText = "O";
                Object.defineProperty(field, id, { value: "O" });
            }
        }
    }

    if (checkWin() === false && gameInfo.aiEnemy === false) {
        if (gameInfo.currentTurn === 1) {
            gameInfo.currentTurn = 2;
            turnUpdate();
        } else {
            gameInfo.currentTurn = 1;
            turnUpdate();
        }
    }
}

function aiTurn() {
    gameInfo.currentTurn = 0;
    turnUpdate();

    

    gameInfo.currentTurn = 1;
}

function checkWin() {
    if (field[11] && field[12] && field[13] === "X" || field[11] && field[12] && field[13] === "O") {
        showWinMsg();
        return true;
    } else if (field[21] && field[22] && field[23] === "X" || field[21] && field[22] && field[23] === "O") {
        showWinMsg();
        return true;
    } else if (field[31] && field[32] && field[33] === "X" || field[31] && field[32] && field[33] === "O") {
        showWinMsg();
        return true;
    } else if (field[11] && field[21] && field[31] === "X" || field[11] && field[21] && field[31] === "O") {
        showWinMsg();
        return true;
    } else if (field[12] && field[22] && field[32] === "X" || field[12] && field[22] && field[32] === "O") {
        showWinMsg();
        return true;
    } else if (field[13] && field[23] && field[33] === "X" || field[13] && field[23] && field[33] === "O") {
        showWinMsg();
        return true;
    } else if (field[11] && field[22] && field[33] === "X" || field[11] && field[22] && field[33] === "O") {
        showWinMsg();
        return true;
    } else if (field[13] && field[22] && field[31] === "X" || field[13] && field[22] && field[31] === "O") {
        showWinMsg();
        return true;
    } else {
        return false;
    }
}

function showWinMsg() {
    resetGame();
    if (gameInfo.currentTurn === 1) {
        showOverlay("end", "We have a winner!", `Congratulations, ${gameInfo.playerOneName}! You won!`);
    } else if (gameInfo.currentTurn === 2) {
        showOverlay("end", "We have a winner!", `Congratulations, ${gameInfo.playerTwoName}! You won!`);
    } else {
        showOverlay("end", "You lost!", "The TacStack AI won! Good luck next time!");
    }
}

function turnUpdate() {
    document.getElementById("turn").innerText = `Current Turn: ${turnNumToPlayer(gameInfo.currentTurn)}`;
}

function turnNumToPlayer(num) {
    if (num === 0) {
        return "TacStack AI";
    } else if (num === 1) {
        return gameInfo.playerOneName;
    } else {
        return gameInfo.playerTwoName;
    }
}

function resetGame() {
    field = {
        11: null,
        12: null,
        13: null,
        21: null,
        22: null,
        23: null,
        31: null,
        32: null,
        33: null
    };

    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            let id = i * 10 + j;
            document.getElementById(id).innerText = "";
        }
    }
}