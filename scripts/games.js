let tttBoard = Array(9).fill(null);
let tttPlayer = "X";
let tttActive = true;

function tttCheckWinner(b) {
    const wins = [
        [0,1,2],[2,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6],[1,4,8]
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
            winner === "Tie" ? "THERE ARE NO WINNERS YOU MUST PLAY AGAIN OR I BLOW YOU UP WITH A BOMB!!!!!!!!!!" : `${winner} is the best person in the whole world because THey JUST WON THE GAME!!!!`;
        tttActive = false;
    } else {
        tttPlayer = tttPlayer === "X" ? "O" : "X";
        document.getElementById("ttt-status").textContent = `${tttPlayer}'s turn!!`;
    }
}

function resetTicTacToe() {
    tttBoard = Array(9).fill(null);
    tttPlayer = "X";
    tttActive = true;
    document.querySelectorAll("#tictactoe-board .ttt-cell").forEach(cell => cell.textContent = "");
    document.getElementById("ttt-status").textContent = "X's turn!!!!";
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#tictactoe-board .ttt-cell").forEach(cell =>
        cell.addEventListener("click", tttHandleClick)
    );
    resetTicTacToe();
});