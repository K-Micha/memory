const UI = {
    player: [
        document.getElementById("player-blue") as HTMLInputElement,
        document.getElementById("player-orange") as HTMLInputElement,
    ],
    board: [
        document.getElementById("board-16") as HTMLInputElement,
        document.getElementById("board-24") as HTMLInputElement,
        document.getElementById("board-36") as HTMLInputElement,
    ],
} as const;


UI.player.forEach(player => {
    player.checked = false;
});


UI.board.forEach(board => {
    board.checked = false;

    board.onclick = () => {
        if (board.checked && board.dataset.x === "1") {
            board.checked = false;
            board.dataset.x = "0";
        } else if (board.checked) {
            UI.board.forEach(other => other.dataset.x = "0");
            board.dataset.x = "1";
        }
    };
});