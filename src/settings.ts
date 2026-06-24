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
    theme: [getInput('theme-code'), getInput('theme-food')],
    player: [getInput('player-blue'), getInput('player-orange')],
    board: [getInput('board-16'), getInput('board-24'), getInput('board-36')],
    previewImage: getImage('theme-preview'),
} as const;

function updateThemePreview(theme: Theme): void {
    UI.previewImage.src = `./src/assets/img/${themes[theme].preview}`;
    UI.previewImage.alt = `${theme} theme preview`;
}

function resetPlayerAndBoard(): void {
    UI.player.forEach(player => {
        player.checked = false;
    });

    UI.board.forEach(board => {
        board.checked = false;
        board.dataset.selected = '0';
    });
}

function getSettings(): GameSettings {
    const theme = (UI.theme.find(theme => theme.checked)?.value as Theme) ?? 'code';

    const players = UI.player
        .filter(player => player.checked)
        .map(player => player.value as Player);

    const boardValue = UI.board.find(board => board.checked)?.value;
    const boardSize = boardValue ? (Number(boardValue) as BoardSize) : null;

    return { theme, players, boardSize };
}

function saveSettings(): void {
    const settings = getSettings();
    console.log('save', settings);
    localStorage.setItem('gameSettings', JSON.stringify(settings));
}

function loadSavedSettings(): void {
    const saved = localStorage.getItem('gameSettings');

    if (!saved) {
        updateThemePreview('code');
        return;
    }

    const settings = JSON.parse(saved) as GameSettings;

    UI.theme.forEach(theme => {
        theme.checked = theme.value === settings.theme;
    });

    UI.player.forEach(player => {
        player.checked = settings.players.includes(player.value as Player);
    });

    UI.board.forEach(board => {
        const isSelected = Number(board.value) === settings.boardSize;

        board.checked = isSelected;
        board.dataset.selected = isSelected ? '1' : '0';
    });

    updateThemePreview(settings.theme);
}

function initThemeSelection(): void {
    UI.theme.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked) {
                updateThemePreview(input.value as Theme);
                saveSettings();
            }
        });
    });
}

function initPlayerSelection(): void {
    UI.player.forEach(player => {
        player.addEventListener('change', saveSettings);
    });
}

function initBoardSelection(): void {
    UI.board.forEach(board => {
        board.addEventListener('click', () => {
            if (board.checked && board.dataset.selected === '1') {
                board.checked = false;
                board.dataset.selected = '0';
                saveSettings();
                return;
            }

            if (board.checked) {
                UI.board.forEach(other => {
                    other.dataset.selected = '0';
                });

                board.dataset.selected = '1';
                saveSettings();
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

    saveSettings();
    window.location.href = './game.html';
}

(window as any).startGame = startGame;

resetPlayerAndBoard();
loadSavedSettings();

initThemeSelection();
initPlayerSelection();
initBoardSelection();