import { themes, type Theme } from './card-utils';

type Player = 'blue' | 'orange';
type BoardSize = 16 | 24 | 36;

type GameSettings = {
    theme: Theme;
    players: Player[];
    boardSize: BoardSize | null;
};

function getInput(id: string): HTMLInputElement {
    const element = document.getElementById(id);

    if (!(element instanceof HTMLInputElement)) {
        throw new Error(`Input with id "${id}" not found`);
    }

    return element;
}

function getImage(id: string): HTMLImageElement {
    const element = document.getElementById(id);

    if (!(element instanceof HTMLImageElement)) {
        throw new Error(`Image with id "${id}" not found`);
    }

    return element;
}

const UI = {
    theme: [
        getInput('theme-code'),
        getInput('theme-food'),
    ],
    player: [
        getInput('player-blue'),
        getInput('player-orange'),
    ],
    board: [
        getInput('board-16'),
        getInput('board-24'),
        getInput('board-36'),
    ],
    previewImage: getImage('theme-preview'),
} as const;

function updateThemePreview(theme: Theme): void {
    UI.previewImage.src = `./src/assets/img/${themes[theme].preview}`;
    UI.previewImage.alt = `${theme} theme preview`;
}

function initThemeSelection(): void {
    UI.theme.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked) {
                updateThemePreview(input.value as Theme);
            }
        });
    });

    updateThemePreview('code');
}

function initPlayerSelection(): void {
    UI.player.forEach(player => {
        player.checked = false;
    });
}

function initBoardSelection(): void {
    UI.board.forEach(board => {
        board.checked = false;
        board.dataset.selected = '0';

        board.addEventListener('click', () => {
            if (board.checked && board.dataset.selected === '1') {
                board.checked = false;
                board.dataset.selected = '0';
                return;
            }

            if (board.checked) {
                UI.board.forEach(other => {
                    other.dataset.selected = '0';
                });

                board.dataset.selected = '1';
            }
        });
    });
}

function isSettingsValid(): boolean {
    const hasPlayer = UI.player.some(player => player.checked);
    const hasBoard = UI.board.some(board => board.checked);

    return hasPlayer && hasBoard;
}

function markMissingSettings(): void {
    const summary = document.querySelector('.summary');

    summary?.classList.add('summary--error');
}

function startGame(): void {
    if (!isSettingsValid()) {
        markMissingSettings();
        return;
    }

    window.location.href = './game.html';
}

(window as any).startGame = startGame;

initThemeSelection();
initPlayerSelection();
initBoardSelection();