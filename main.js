// 1. inicializar canvas
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;
context.scale(BLOCK_SIZE, BLOCK_SIZE);

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

let score = 0;
let lines = 0;
let level = 0;
let dropConterCheck = 1000;

function createBoard (width, height) {
    return Array(height).fill().map(() => Array(width).fill());
}

// 4. pieza player
const piece = {
    position: { x: 0, y: 0 },
    shape: []
}

// 9. randow pieces
const PIECES = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [0, 0, 1],
        [1, 1, 1]
    ],
    [
        [1, 0, 0],
        [1, 1, 1]
    ]
]

function draw() {
    context.fillStyle = '#dff8d0';
    context.fillRect(0, 0, canvas.width, canvas.height);

    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = '#316950';
                context.fillRect(x, y, 1, 1);

                context.strokeStyle = "#0e241f";
                context.lineWidth = 0.1;
                context.strokeRect(x, y, 1, 1);
            }
        });
    });

    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = '#8dc377';
                context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);

                context.strokeStyle = "#0e241f";
                context.lineWidth = 0.1;
                context.strokeRect(x + piece.position.x, y + piece.position.y, 1, 1);
            }
        });
    });

    document.getElementById('score').innerText = score;
    document.getElementById('level').innerText = level;
    document.getElementById('lines').innerText = lines;
}

// 5. Mover pieza
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        piece.position.x--;
        if(checkCollision()) {
            piece.position.x++;
        }
    }
    if (event.key === 'ArrowRight') {
        piece.position.x++;
        if(checkCollision()) {
            piece.position.x--;
        }
    }
    if (event.key === 'ArrowDown') {
        piece.position.y++;
        if(checkCollision()) {
            piece.position.y--;
            solidifyPiece();
            removeRows();
        }
    }
    if (event.key === 'ArrowUp') {
        const rotated = [];

        for (let i = 0; i < piece.shape[0].length; i++) {
            const row = [];
            for (let j = piece.shape.length -1; j >= 0; j--) {
                row.push(piece.shape[j][i]);
            }
            rotated.push(row);
        }

        const previousShape = piece.shape;
        piece.shape = rotated;
        if (checkCollision()) {
            piece.shape = previousShape;
        }
    }   
});

// 6. Colisiones
function checkCollision() {
    return piece.shape.find((row, y) => {
        return row.find((value, x) => {
            return (
                value != 0 &&
                board[y + piece.position.y]?.[x + piece.position.x] != 0
            );
        });
    });
}

// 7 Solidificar
function solidifyPiece() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[y + piece.position.y][x + piece.position.x] = 1;
            }
        });
    });

    score++;

    newPiece();

    //game over
    if (checkCollision()) {
        window.alert('Game Over');
        newGame();
    }
}


function newPiece() {
    // get random shape
    piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)];
    // reset position
    piece.position.x = BOARD_WIDTH / 2 -2;
    piece.position.y = 0;
}

// 8. Remove rows
function removeRows() {
    const rowsToRemove = [];

    board.forEach((row, y) => {
        if (row.every(value => value === 1)) {
            rowsToRemove.push(y);
        }
    });

    rowsToRemove.forEach(y => {
        board.splice(y, 1);
        const newRow = Array(BOARD_WIDTH).fill(0);
        board.unshift(newRow);
        score += 10;
        lines++;

        if (lines % 5) {
            dropConterCheck -= 50;
        }
    });
}

let dropConter = 0;
let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropConter += deltaTime;

    if (dropConter > dropConterCheck) {
        piece.position.y++;
        dropConter = 0;

        if(checkCollision()) {
            piece.position.y--;
            solidifyPiece();
            removeRows();
        }
    }

    draw();
    window.requestAnimationFrame(update);
}

function newGame() {
    dropConter = 0;
    lastTime = 0;
    score = 0;
    lines = 0;
    level = 0;
    dropConterCheck = 1000;
    board.forEach(row => row.fill(0));
}

newPiece();
update();