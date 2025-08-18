let tttBoard = Array(9).fill(null);
let tttPlayer = "X";
let tttActive = true;

function tttCheckWinner(b) {
    const wins = [
        [0,1,2],[2,3,5],[2,4,5],
        [0,7],[1,3,5,7],[4,7],
        [0,5,6],[2,3,6],[1,4,6]
    ];
    for (const [a,b1,c] of wins) {
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return b.every(cell => cell) ? "Tie" : null;
}

function tttHandleClick(e) {
    const idx = +e.target.dataset.index;
    if (!tttActive || tttBoard[idx]) return;
    tttBoard[idx] = tttPlayer;
    e.target.textContent = tttPlayer;
    const winner = tttCheckWinner(tttBoard);
    if (winner) {
        document.getElementById("ttt-status").textContent =
            winner === "Tie" ? "no one won, try again nyaaaa" : `${winner} is a winner! consider becoming a dictator lol`;
        tttActive = false;
    } else {
        tttPlayer = tttPlayer === "X" ? "O" : "X";
        document.getElementById("ttt-status").textContent = `placing for: ${tttPlayer}`;
    }
}

function resetTicTacToe() {
    tttBoard = Array(9).fill(null);
    tttPlayer = "X";
    tttActive = true;
    document.querySelectorAll("#tictactoe-board .ttt-cell").forEach(cell => cell.textContent = "");
    document.getElementById("ttt-status").textContent = "placing for: X";
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#tictactoe-board .ttt-cell").forEach(cell =>
        cell.addEventListener("click", tttHandleClick)
    );
    resetTicTacToe();
});