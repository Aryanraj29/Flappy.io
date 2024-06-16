const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Load images
const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

// Adjust image sizes
const birdWidth = 34;
const birdHeight = 24;
const fgHeight = 112;
const pipeWidth = 52;
const pipeHeight = 242;

const gap = 85;
const constant = pipeHeight + gap;

let bX = 10;
let bY = 150;
const gravity = 1.5;
let score = 0;
let pipes = [];
let gameInterval;
let gamePaused = false;

// Audio files
const fly = new Audio();
const scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

// Keydown event
document.addEventListener("keydown", moveUp);

// Mouse click event for desktop
canvas.addEventListener("mousedown", moveUp);

// Touch event for mobile devices
canvas.addEventListener("touchstart", function(event) {
    event.preventDefault(); // Prevent the default behavior of touch
    moveUp();
});

function moveUp() {
    if (!gamePaused) {
        bY -= 25;
        fly.play();
    }
}

// Initial pipe
pipes.push({
    x: canvas.width,
    y: 0
});

// Draw function
function draw() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pipes.length; i++) {
        const pipeNorthY = pipes[i].y;
        const pipeSouthY = pipeNorthY + constant;

        ctx.drawImage(pipeNorth, pipes[i].x, pipeNorthY, pipeWidth, pipeHeight);
        ctx.drawImage(pipeSouth, pipes[i].x, pipeSouthY, pipeWidth, pipeHeight);

        if (!gamePaused) {
            pipes[i].x--;
        }

        if (pipes[i].x === 125) {
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeHeight) - pipeHeight
            });
        }

        // Detect collision with pipes
        if (bX + birdWidth >= pipes[i].x && bX <= pipes[i].x + pipeWidth &&
            (bY <= pipeNorthY + pipeHeight || bY + birdHeight >= pipeSouthY)) {
            location.reload(); // Reload the page
        }

        if (pipes[i].x === 5) {
            score++;
            scor.play();
        }
    }

    ctx.drawImage(fg, 0, canvas.height - fgHeight, canvas.width, fgHeight);
    ctx.drawImage(bird, bX, bY, birdWidth, birdHeight);

    // Add gravity
    if (!gamePaused) {
        bY += gravity;
    }

    // Detect collision with ground or ceiling
    if (bY + birdHeight >= canvas.height - fgHeight || bY <= 0) {
        location.reload(); // Reload the page
    }

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, canvas.height - 20);
}

function startGame() {
    if (!gameInterval) {
        gamePaused = false;
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

function pauseGame() {
    gamePaused = true;
    cancelAnimationFrame(gameInterval);
    gameInterval = null;
}

function gameLoop() {
    draw();
    if (!gamePaused) {
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

// Ensure images are loaded before starting the game
window.onload = function() {
    draw();
};

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', pauseGame);

