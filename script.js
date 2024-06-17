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

let gapFactor = 4; // Adjust this factor to control gap size relative to bird size
let minGapMultiplier = 1.5; // Minimum gap size relative to bird size
let gap = birdOriginalHeight * gapFactor;
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

fly.src = "wing-flap-1-6434.mp3";
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
    gap = birdOriginalHeight * gapFactor;
    constant = (pipeOriginalHeight * (canvas.height / 480)) + gap;
    resetBirdPosition();
}

function resetBirdPosition() {
    bX = 10;
    bY = canvas.height / 2 - birdOriginalHeight * (canvas.height / 480) / 2;
}

function initializePipes() {
    pipes = [];
    pipes.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeOriginalHeight) - pipeOriginalHeight
    });
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
            pipes[i].x -= 2 + score * 0.1; // Increase pipe speed gradually
        }

        if (pipes[i].x === canvas.width / 2) {
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeOriginalHeight) - pipeOriginalHeight
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
        initializePipes();
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

function togglePause() {
    if (gamePaused) {
        gamePaused = false;
        gameInterval = requestAnimationFrame(gameLoop);
        document.getElementById('pauseButton').innerText = "Pause";
    } else {
        gamePaused = true;
        cancelAnimationFrame(gameInterval);
        gameInterval = null;
        document.getElementById('pauseButton').innerText = "Play";
    }
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
document.getElementById('pauseButton').addEventListener('click', togglePause);
