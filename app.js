const gameBoard = document.querySelector(".game_table tbody");
let board = [
    [0, 7, 0, 2, 0, 6, 3, 4, 0],
    [0, 0, 9, 5, 0, 1, 7, 0, 0],
    [2, 5, 0, 7, 4, 0, 8, 9, 0],
    [0, 6, 0, 1, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0, 4, 1, 6, 2],
    [1, 3, 0, 8, 0, 0, 4, 0, 0],
    [4, 2, 0, 0, 5, 8, 0, 1, 3],
    [0, 1, 5, 4, 0, 0, 0, 0, 0],
    [6, 8, 0, 0, 0, 0, 0, 5, 0]
];

for (let x = 0; x < board.length; x++) {
    createRow(board[x], x)
}

document.addEventListener("keypress", (e) => {
    if (isValidNumber(e.key)) {
        handleKeyPress(e, true);
    }
})

document.addEventListener("keydown", (e) => {
    if (e.key == "Backspace") {
        handleKeyPress(e, false);
    }
})

function createRow(line, x) {
    let row = document.createElement("tr");
    row.classList.add("game_row");
    for (let y = 0; y < line.length; y++) {
        createCell(line[y], row, x, y);
    }
    gameBoard.appendChild(row);
};

function createCell(element, row, x, y) {
    let cell = document.createElement("td");
    cell.classList.add("game_cell");
    cell.setAttribute("y", `${x}`);
    cell.setAttribute("x", `${y}`);

    if (element != 0) {
        cell.innerText = element;
        cell.classList.add("game_value");
    }

    row.appendChild(cell);
    addSelectedListener(cell);
    return cell;
};

function addSelectedListener(cell) {
    cell.addEventListener("click", function () {
        clearAllClass("selected");
        cell.classList.add("selected");
        highlightSelected(cell);
    });
};

function highlightSelected(selected) {
    clearAllClass("highlight");
    let selectedX = selected.getAttribute("x");
    let selectedY = selected.getAttribute("y");
    let minX = (0 <= selectedX && selectedX <= 2) ? 0 : (3 <= selectedX && selectedX <= 5) ? 3 : 6;
    let maxX = minX + 2;
    let minY = (0 <= selectedY && selectedY <= 2) ? 0 : (3 <= selectedY && selectedY <= 5) ? 3 : 6;
    let maxY = minY + 2;

    let cells = document.querySelectorAll(".game_cell");
    cells.forEach(cell => {
        let cellX = cell.getAttribute("x");
        let cellY = cell.getAttribute("y");
        if (cellX == selectedX) {
            cell.classList.add("highlight");
        }
        if (cellY == selectedY) {
            cell.classList.add("highlight");
        }

        if ((minX <= cellX && cellX <= maxX) && (minY <= cellY && cellY <= maxY)) {
            cell.classList.add("highlight");
        }
    })
}

function isValidNumber(number) {
    if (number == '1' || number == '2' || number == '3' || number == '4' || number == '5' || number == '6' || number == '7' || number == '8' || number == '9') {
        return true;
    }
    else return false;
}

function handleKeyPress(e, isNumber) {
    let selected = document.querySelector(".selected");
    let isGameNumber = selected.classList.contains("game_value");
    if (isNumber && !isGameNumber) {
        updateCell(selected, parseInt(e.key));
    }
    else if (!isGameNumber) {
        updateCell(selected, 0);
    }
}

function updateCell(cell, value) {
    let x = cell.getAttribute("x");
    let y = cell.getAttribute("y");
    board[y][x] = parseInt(value);
    cell.innerText = value != 0 ? value : "";
    isValidValue(cell, value);
}

function clearAllClass(classToClear) {
    let previous = document.querySelectorAll(`.${classToClear}`);
    previous.forEach(element => {
        element.classList.remove(classToClear);
    })
}

function isValidValue(cell, value) {
    let x = parseInt(cell.getAttribute("x"));
    let y = parseInt(cell.getAttribute("y"));
    let minX = (x >= 0 && x <= 2) ? 0
        : (x >= 3 && x <= 5) ? 3
        : 6;
    let minY = (y >= 0 && y <= 2) ? 0
        : (y >= 3 && y <= 5) ? 3
        : 6;
    let maxX = minX + 2;
    let maxY = minY + 2;

    let found = [];

    for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
            if (i==x && j==y) {
                continue;
            }
            else {
                found.push(board[j][i]);
            }
        }
    }

    for (let i = 0; i < 9; i++) {
        if (i != x) {
            found.push(board[y][i]);
        }
        if (i != y) {
            found.push(board[i][x]);
        }
    }

    for (let number in found) {
        if (found[number] == value) {
            console.log("FOUND", value);
            return false;
        }
    }
}