const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Load images
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

// Audio files
const fly = new Audio();
const scor = new Audio();

fly.src = "wing-flap-1-6434.mp3";
scor.src = "score.wav";

// Keydown event
document.addEventListener("keydown", moveUp);

function moveUp() {
    bY -= 25;
    fly.play();
}

// Pipe coordinates
const pipe = [];

pipe[0] = {
    x: canvas.width,
    y: 0
};

// Draw function
function draw() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    for(let i = 0; i < pipe.length; i++) {
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y, pipeWidth, pipeHeight);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant, pipeWidth, pipeHeight);

        pipe[i].x--;

        if(pipe[i].x == 125) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeHeight) - pipeHeight
            });
        }

        // Detect collision
        if(bX + birdWidth >= pipe[i].x && bX <= pipe[i].x + pipeWidth &&
           (bY <= pipe[i].y + pipeHeight || bY + birdHeight >= pipe[i].y + constant) || bY + birdHeight >= canvas.height - fgHeight) {
            location.reload(); // Reload the page
        }

        if(pipe[i].x == 5) {
            score++;
            scor.play();
        }
    }

    ctx.drawImage(fg, 0, canvas.height - fgHeight, canvas.width, fgHeight);
    ctx.drawImage(bird, bX, bY, birdWidth, birdHeight);

    bY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, canvas.height - 20);

    requestAnimationFrame(draw);
}

draw();
