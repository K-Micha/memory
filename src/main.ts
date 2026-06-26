import './scss/main.scss';

/** Starts a new game.*/
function playGame(): void {
    localStorage.removeItem('gameSettings');
    window.location.href = './settings.html';
}

(window as any).playGame = playGame;