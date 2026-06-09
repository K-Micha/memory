import './scss/main.scss';

function playGame(): void {
    window.location.href = './settings.html';
}

(window as any).playGame = playGame;