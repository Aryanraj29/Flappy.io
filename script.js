const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

bird.src = "t1.png";
bg.src = "background.png";
fg.src = "twitty1.jpg";
pipeNorth.src = "north1.png";
pipeSouth.src = "north1.png";

// Original dimensions
const birdOriginalWidth = 34;
const birdOriginalHeight = 24;
const fgOriginalHeight = 112;
const pipeOriginalWidth = 52;
const pipeOriginalHeight = 242;

const gap = 85;
let constant = pipeOriginalHeight + gap;

let bX = 10;
let bY = 150;
const gravity = 1.5;
let score = 0;
let pipes = [];
let gameInterval;
let gamePaused = false;

const fly = new Audio();
const scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "score.wav";

document.addEventListener("keydown", moveUp);
canvas.addEventListener("mousedown", moveUp);
canvas.addEventListener("touchstart", function(event) {
    event.preventDefault();
    moveUp();
});

function moveUp() {
    if (!gamePaused) {
        bY -= 25;
        fly.play();
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    constant = (pipeOriginalHeight * (canvas.height / 480)) + gap;
    resetBirdPosition();
}

function resetBirdPosition() {
    bX = 10;
    bY = canvas.height / 2 - birdOriginalHeight * (canvas.height / 480) / 2;
}

function draw() {
    const birdWidth = birdOriginalWidth * (canvas.width / 320);
    const birdHeight = birdOriginalHeight * (canvas.height / 480);
    const fgHeight = fgOriginalHeight * (canvas.height / 480);
    const pipeWidth = pipeOriginalWidth * (canvas.width / 320);
    const pipeHeight = pipeOriginalHeight * (canvas.height / 480);

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pipes.length; i++) {
        const pipeNorthY = pipes[i].y;
        const pipeSouthY = pipeNorthY + constant;

        ctx.drawImage(pipeNorth, pipes[i].x, pipeNorthY, pipeWidth, pipeHeight);
        ctx.drawImage(pipeSouth, pipes[i].x, pipeSouthY, pipeWidth, pipeHeight);

        if (!gamePaused) {
            pipes[i].x -= 2; // Adjust pipe speed
        }

        if (pipes[i].x === canvas.width / 2) {
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeHeight) - pipeHeight
            });
        }

        if (bX + birdWidth >= pipes[i].x && bX <= pipes[i].x + pipeWidth &&
            (bY <= pipeNorthY + pipeHeight || bY + birdHeight >= pipeSouthY)) {
            location.reload();
        }

        if (pipes[i].x === 5) {
            score++;
            scor.play();
        }
    }

    ctx.drawImage(fg, 0, canvas.height - fgHeight, canvas.width, fgHeight);
    ctx.drawImage(bird, bX, bY, birdWidth, birdHeight);

    if (!gamePaused) {
        bY += gravity;
    }

    if (bY + birdHeight >= canvas.height - fgHeight || bY <= 0) {
        location.reload();
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

window.onload = function() {
    draw();
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', pauseGame);
