"use strict";
const overlay = document.getElementById("overlay-container");
const game = document.getElementById("game-container");
const settings = document.getElementById("settings-container");

let gameInfo = {
    aiEnemy: false,
    aiLevel: 1,
    startingPlayer: 1, // 1 is default, 0 is AI, 2 is other player
    playerOneName: "Player 1",
    playerTwoName: "Player 2",
    firstTurn: true,
    currentTurn: 1
};

let field = {
    11: null, 12: null, 13: null,
    21: null, 22: null, 23: null,
    31: null, 32: null, 33: null
};

// Attach click listeners for all cells
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        const id = i * 10 + j;
        document.getElementById(id).addEventListener("click", () => claimBox(id));
    }
}

showOverlay("welcome", "Welcome to TacStack", "TicTacToe but reimagined as a web-based game!", "Let's have fun!");

// Settings button
document.getElementById("settings-button").addEventListener("click", () => {
    settings.style.display = "none";
    showOverlay("start", "Start a new game", "Click one of the buttons below to start a new game or change the current settings!", "Play TacStack");
});

// Play with AI toggle
document.getElementById("playWithAi-btn").addEventListener("click", () => {
    gameInfo.aiEnemy = !gameInfo.aiEnemy;
    document.getElementById("playWithAi-btn").innerText = gameInfo.aiEnemy ? "On" : "Off";
    document.getElementById("settings-aiLevel").style.display = gameInfo.aiEnemy ? "block" : "none";
    document.getElementById("settings-playerTwoName").style.display = gameInfo.aiEnemy ? "none" : "block";
    gameInfo.startingPlayer = 1;
    document.getElementById("startingPlayer-btn").innerText = gameInfo.playerOneName;
    gameInfo.currentTurn = gameInfo.startingPlayer;
    turnUpdate();
});

// AI Level cycle
document.getElementById("aiLevel-btn").addEventListener("click", () => {
    gameInfo.aiLevel = (gameInfo.aiLevel % 3) + 1;
    const levelText = ["Easy", "Medium", "Hard"];
    document.getElementById("aiLevel-btn").innerText = levelText[gameInfo.aiLevel - 1];
});

// Starting player toggle
document.getElementById("startingPlayer-btn").addEventListener("click", () => {
    if (gameInfo.startingPlayer === 1) {
        if (gameInfo.aiEnemy) {
            gameInfo.startingPlayer = 0;
            document.getElementById("startingPlayer-btn").innerText = "TacStack AI";
        } else {
            gameInfo.startingPlayer = 2;
            document.getElementById("startingPlayer-btn").innerText = gameInfo.playerTwoName;
        }
    } else {
        gameInfo.startingPlayer = 1;
        document.getElementById("startingPlayer-btn").innerText = gameInfo.playerOneName;
    }
    gameInfo.currentTurn = gameInfo.startingPlayer;
    turnUpdate();
});

// Player name inputs
document.getElementById("playerOneName-input").addEventListener("input", (e) => {
    gameInfo.playerOneName = e.target.value.trim() || "Player 1";
    if (gameInfo.startingPlayer === 1) document.getElementById("startingPlayer-btn").innerText = gameInfo.playerOneName;
    turnUpdate();
});

document.getElementById("playerTwoName-input").addEventListener("input", (e) => {
    gameInfo.playerTwoName = e.target.value.trim() || "Player 2";
    if (gameInfo.startingPlayer === 2) document.getElementById("startingPlayer-btn").innerText = gameInfo.playerTwoName;
    turnUpdate();
});

// Overlay function
function showOverlay(state, title, msg, btn) {
    game.style.display = "none";
    overlay.style.display = "block";
    document.getElementById("overlay-title").innerText = title;
    document.getElementById("overlay-text").innerText = msg;

    const primaryBtn = document.getElementById("overlay-button-primary");
    const secondaryBtn = document.getElementById("overlay-button-secondary");

    primaryBtn.innerText = btn || "Okay";
    secondaryBtn.style.display = "none";

    if (state === "start") {
        secondaryBtn.style.display = "inline-block";
        secondaryBtn.innerText = "Change Settings";
    }

    // Remove previous listeners
    primaryBtn.replaceWith(primaryBtn.cloneNode(true));
    secondaryBtn.replaceWith(secondaryBtn.cloneNode(true));

    const newPrimaryBtn = document.getElementById(primaryBtn.id);
    const newSecondaryBtn = document.getElementById(secondaryBtn.id);

    newPrimaryBtn.addEventListener("click", () => {
        if (state === "start") {
            overlay.style.display = "none";
            game.style.display = "flex";
        } else if (state === "end" || state === "welcome") {
            showOverlay("start", "Start a new game", "Click one of the buttons below to start a new game or change the current settings!", "Play TacStack");
        } else {
            overlay.style.display = "none";
        }
    });

    newSecondaryBtn.addEventListener("click", () => {
        if (state === "start") {
            overlay.style.display = "none";
            settings.style.display = "block";
        }
    });
}

// Claim a cell
function claimBox(id) {
    if (field[id] !== null || gameInfo.currentTurn === 0) return;

    const mark = gameInfo.currentTurn === 1 ? "X" : "O";
    document.getElementById(id).innerText = mark;
    field[id] = mark;

    checkWin();

    if (gameInfo.aiEnemy && gameInfo.currentTurn === 1) {
        gameInfo.currentTurn = 0;
        turnUpdate();
        setTimeout(aiTurn, 1000); // small delay
    } else if (!gameInfo.aiEnemy) {
        gameInfo.currentTurn = gameInfo.currentTurn === 1 ? 2 : 1;
        turnUpdate();
    }
}

// AI turn
function aiTurn() {
    const emptyCells = Object.keys(field).filter(key => field[key] === null);
    if (emptyCells.length === 0) return;

    const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    document.getElementById(choice).innerText = "O";
    field[choice] = "O";

    gameInfo.currentTurn = 1;
    turnUpdate();

    checkWin();
}

// Check win or tie
function checkWin() {
    const wins = [
        [11,12,13],[21,22,23],[31,32,33],
        [11,21,31],[12,22,32],[13,23,33],
        [11,22,33],[13,22,31]
    ];

    for (const [a,b,c] of wins) {
        if (field[a] && field[a] === field[b] && field[a] === field[c]) {
            return showWinMsg(field[a]);
        }
    }

    if (Object.values(field).every(v => v !== null)) {
        showOverlay("end", "We have a tie!", "Congratulations to the both of you for having fun! Want to try again?", "Try again!");
        resetGame();
    }
}

function showWinMsg(winnerMark) {
    resetGame();
    if (winnerMark === "X") {
        showOverlay("end", "We have a winner!", `Congratulations, ${gameInfo.playerOneName}! You won!`);
    } else if (winnerMark === "O" && gameInfo.aiEnemy) {
        showOverlay("end", "You lost!", "The TacStack AI won! Good luck next time!");
    } else {
        showOverlay("end", "We have a winner!", `Congratulations, ${gameInfo.playerTwoName}! You won!`);
    }
}

// Update current turn text
function turnUpdate() {
    const turnText = document.getElementById("turn");
    turnText.innerText = `Current Turn: ${turnNumToPlayer(gameInfo.currentTurn)}`;
}

function turnNumToPlayer(num) {
    if (num === 0) return "TacStack AI";
    if (num === 1) return gameInfo.playerOneName;
    return gameInfo.playerTwoName;
}

// Reset the game state
function resetGame() {
    for (const key in field) field[key] = null;
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            const id = i*10+j;
            document.getElementById(id).innerText = "";
        }
    }
    gameInfo.firstTurn = true;
    gameInfo.currentTurn = gameInfo.startingPlayer;
    turnUpdate();
}