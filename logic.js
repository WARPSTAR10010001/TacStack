"use strict";
const overlay = document.getElementById("overlay-container");
const game = document.getElementById("game-container");
const settings = document.getElementById("settings-container");

let field = {
    x1y1: "",
    x1y2: "",
    x1y3: "",
    x2y1: "",
    x2y2: "",
    x2y3: "",
    x3y1: "",
    x3y2: "",
    x3y3: ""
};

showOverlay("welcome", "Welcome to TacStack", "TicTacToe but reimagined as a web-based game!", "Let's have fun!");

document.getElementById("settings-button").addEventListener(("click"), () => {
    settings.style.display = "none";
    showOverlay("start", "Start Game", "Click one of the buttons below to start a new game or change the current settings!", "Play");
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
            game.style.display = "block";
        } else if (state === "end" || state === "welcome") {
            showOverlay("start", "Start Game", "Click one of the buttons below to start a new game or change the current settings!", "Play");
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