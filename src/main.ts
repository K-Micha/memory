import './scss/main.scss';

function playGame(): void {
    localStorage.removeItem('gameSettings');
    window.location.href = './settings.html';
}

(window as any).playGame = playGame;