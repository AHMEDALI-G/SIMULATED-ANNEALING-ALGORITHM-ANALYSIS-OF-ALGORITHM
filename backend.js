// ================= CONFIG =================
const N = 8;

// ================= STATE =================
let board = createEmptyBoard();

let humanBoard = null;
let humanCost = Infinity;

let aiBestSolution = null;
let aiBestCost = Infinity;

let isAIRunning = false;

// ================= DOM =================
const $ = id => document.getElementById(id);

const UI = {
    board: $("chessboard"),
    queenCount: $("queenCountDisplay"),
    humanCost: $("humanCostDisplay"),
    aiCost: $("aiCostDisplay"),
    winner: $("winnerDisplay"),
    runAI: $("runSABtn"),
    runSlow: $("runSlowBtn"),
    reset: $("startGameBtn"),
    compare: $("compareBtn"),
    toast: $("toast")
};

// ================= UTIL =================
function createEmptyBoard() {
    return Array.from({ length: N }, () => Array(N).fill(0));
}

function countQueens() {
    return board.flat().filter(x => x === 1).length;
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

function showToast(msg, type = "success") {
    UI.toast.className = `toast ${type} show`;
    UI.toast.innerHTML = (type === "success" ? "✅" : "⚠️") + msg;
    setTimeout(() => UI.toast.classList.remove("show"), 3000);
}

// ================= COST =================
function calculateCost(board) {
    let queens = [];

    board.forEach((row, r) => {
        row.forEach((val, c) => {
            if (val) queens.push([r, c]);
        });
    });

    let attacks = 0;

    for (let i = 0; i < queens.length; i++) {
        for (let j = i + 1; j < queens.length; j++) {
            let [r1, c1] = queens[i];
            let [r2, c2] = queens[j];

            if (
                r1 === r2 ||
                c1 === c2 ||
                Math.abs(r1 - r2) === Math.abs(c1 - c2)
            ) {
                attacks++;
            }
        }
    }

    return attacks;
}

// ================= HUMAN =================
function saveHumanSolution() {
    if (countQueens() !== N) {
        clearHuman();
        return;
    }

    humanBoard = board.map(r => [...r]);
    humanCost = calculateCost(board);

    UI.humanCost.innerText = humanCost;
}

function clearHuman() {
    humanBoard = null;
    humanCost = Infinity;
    UI.humanCost.innerText = "—";
}

// ================= BOARD =================
function renderBoard() {
    UI.board.innerHTML = "";

    board.forEach((row, r) => {
        row.forEach((val, c) => {
            const cell = document.createElement("div");

            cell.className = `cell ${(r + c) % 2 ? "dark" : ""}`;
            if (val) cell.classList.add("queen");

            cell.onclick = () => handleClick(r, c);

            UI.board.appendChild(cell);
        });
    });

    updateUI();
    highlightAttacks();
}

function updateUI() {
    const count = countQueens();
    UI.queenCount.innerText = `${count} / ${N}`;

    if (count === N && !humanBoard) {
        saveHumanSolution();
    }
}

// ================= ATTACKS =================
function highlightAttacks() {
    const cells = UI.board.children;
    const queens = [];

    board.forEach((row, r) => {
        row.forEach((val, c) => {
            if (val) queens.push({ r, c, index: r * N + c });
        });
    });

    for (let i = 0; i < queens.length; i++) {
        for (let j = i + 1; j < queens.length; j++) {
            const q1 = queens[i];
            const q2 = queens[j];

            if (
                q1.r === q2.r ||
                q1.c === q2.c ||
                Math.abs(q1.r - q2.r) === Math.abs(q1.c - q2.c)
            ) {
                cells[q1.index].classList.add("attacking");
                cells[q2.index].classList.add("attacking");
            }
        }
    }
}

// ================= USER =================
function handleClick(r, c) {
    if (isAIRunning) return showToast("AI is running...", "error");

    const count = countQueens();

    if (board[r][c]) {
        board[r][c] = 0;
    } else {
        if (count < N) board[r][c] = 1;
        else return showToast("Max 8 queens!", "error");
    }

    if (count !== N) clearHuman();

    renderBoard();
}

// =====================================================
// ================= ALGORITHM BLOCK ====================
// ============== SIMULATED ANNEALING ===================
// =====================================================

function randomState() {
    return Array.from({ length: N }, () =>
        Math.floor(Math.random() * N)
    );
}

function costFromRows(rows) {
    let attacks = 0;

    for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
            if (
                rows[i] === rows[j] ||
                Math.abs(rows[i] - rows[j]) === Math.abs(i - j)
            ) {
                attacks++;
            }
        }
    }

    return attacks;
}

function getNeighbor(rows) {
    const newRows = [...rows];

    const col = Math.floor(Math.random() * N);
    let newRow;

    do {
        newRow = Math.floor(Math.random() * N);
    } while (newRow === newRows[col]);

    newRows[col] = newRow;

    return newRows;
}

function rowsToBoard(rows) {
    const newBoard = createEmptyBoard();

    rows.forEach((r, c) => {
        newBoard[r][c] = 1;
    });

    return newBoard;
}

async function runSimulatedAnnealing(slow = false) {
    if (isAIRunning) return;

    isAIRunning = true;
    toggleButtons(true);

    let temperature = 500;
    let rows = randomState();

    let currentCost = costFromRows(rows);
    let bestRows = [...rows];
    let bestCost = currentCost;

    const iterations = slow ? 5000 : 20000;

    for (let i = 0; i < iterations && temperature > 0.01; i++) {
        const next = getNeighbor(rows);
        const nextCost = costFromRows(next);

        const delta = nextCost - currentCost;

        if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
            rows = next;
            currentCost = nextCost;

            if (currentCost < bestCost) {
                bestCost = currentCost;
                bestRows = [...rows];
            }

            if (slow) {
                board = rowsToBoard(rows);
                renderBoard();
                await sleep(100);
            }
        }

        temperature *= 0.997;
    }

    aiBestSolution = rowsToBoard(bestRows);
    aiBestCost = bestCost;

    board = aiBestSolution.map(r => [...r]);

    UI.aiCost.innerText = bestCost;
    renderBoard();

    isAIRunning = false;
    toggleButtons(false);

    showToast(`AI finished (cost ${bestCost})`);
}

// ================= GAME CONTROL =================
function compare() {
    if (!humanBoard) return showToast("Place 8 queens first", "error");
    if (!aiBestSolution) return showToast("Run AI first", "error");

    let result =
        humanCost < aiBestCost ? "🏆 HUMAN WINS" :
        aiBestCost < humanCost ? "🤖 AI WINS" :
        "🤝 TIE";

    if (humanCost === 0 && aiBestCost === 0) {
        result = "✨ DOUBLE PERFECT";
    }

    UI.winner.innerHTML =
        `${result}<br>Human: ${humanCost} | AI: ${aiBestCost}`;
}

function resetGame() {
    if (isAIRunning) return;

    board = createEmptyBoard();
    aiBestSolution = null;

    clearHuman();
    UI.aiCost.innerText = "—";

    renderBoard();
}

// ================= HELPERS =================
function toggleButtons(disabled) {
    UI.runAI.disabled = disabled;
    UI.runSlow.disabled = disabled;
    UI.reset.disabled = disabled;
    UI.compare.disabled = disabled;
}

// ================= EVENTS =================
UI.runAI.onclick = () => runSimulatedAnnealing(false);
UI.runSlow.onclick = () => runSimulatedAnnealing(true);
UI.reset.onclick = resetGame;
UI.compare.onclick = compare;

// ================= INIT =================
renderBoard();