import { themes, type Theme } from './card-utils';
import { loadSettings, saveSettings } from './storage-utils';

type Player = 'blue' | 'orange';
type BoardSize = 16 | 24 | 36;

export type GameSettings = {
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

function resetPlayerSelection(): void {
    UI.player.forEach(player => {
        player.checked = false;
    });
}

function resetBoardSelection(): void {
    UI.board.forEach(board => {
        board.checked = false;
        board.dataset.selected = '0';
    });
}

function resetPlayerAndBoard(): void {
    resetPlayerSelection();
    resetBoardSelection();
}

function getTheme(): Theme {
    return (
        (UI.theme.find(theme => theme.checked)?.value as Theme) ??
        'code'
    );
}

function getPlayers(): Player[] {
    return UI.player
        .filter(player => player.checked)
        .map(player => player.value as Player);
}

function getBoardSize(): BoardSize | null {
    const boardValue = UI.board.find(board => board.checked)?.value;

    return boardValue
        ? (Number(boardValue) as BoardSize)
        : null;
}

function getSettings(): GameSettings {
    return {
        theme: getTheme(),
        players: getPlayers(),
        boardSize: getBoardSize(),
    };
}

function saveCurrentSettings(): void {
    saveSettings(getSettings());
}

function updateSavedTheme(settings: GameSettings): void {
    UI.theme.forEach(theme => {
        theme.checked = theme.value === settings.theme;
    });
}

function updateSavedPlayers(settings: GameSettings): void {
    UI.player.forEach(player => {
        player.checked = settings.players.includes(player.value as Player);
    });
}

function updateSavedBoard(settings: GameSettings): void {
    UI.board.forEach(board => {
        const isSelected = Number(board.value) === settings.boardSize;

        board.checked = isSelected;
        board.dataset.selected = isSelected ? '1' : '0';
    });
}

function applySavedSettings(settings: GameSettings): void {
    updateSavedTheme(settings);
    updateSavedPlayers(settings);
    updateSavedBoard(settings);
    updateThemePreview(settings.theme);
}

function loadSavedSettings(): void {
    const settings = loadSettings();

    if (!settings) {
        updateThemePreview('code');
        return;
    }

    applySavedSettings(settings);
}

function initThemeSelection(): void {
    UI.theme.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked) {
                updateThemePreview(input.value as Theme);
                saveCurrentSettings();
            }
        });
    });
}

function initPlayerSelection(): void {
    UI.player.forEach(player => {
        player.addEventListener('change', saveCurrentSettings);
    });
}

function clearBoardSelection(): void {
    UI.board.forEach(board => {
        board.dataset.selected = '0';
    });
}

function toggleBoardSelection(board: HTMLInputElement): boolean {
    if (board.checked && board.dataset.selected === '1') {
        board.checked = false;
        board.dataset.selected = '0';
        return true;
    }

    return false;
}

function selectBoard(board: HTMLInputElement): void {
    clearBoardSelection();
    board.dataset.selected = '1';
}

function handleBoardClick(board: HTMLInputElement): void {
    if (toggleBoardSelection(board)) {
        saveCurrentSettings();
        return;
    }

    if (board.checked) {
        selectBoard(board);
        saveCurrentSettings();
    }
}

function initBoardSelection(): void {
    UI.board.forEach(board => {
        board.addEventListener('click', () => handleBoardClick(board));
    });
}

function hasSelectedPlayer(): boolean {
    return UI.player.some(player => player.checked);
}

function hasSelectedBoard(): boolean {
    return UI.board.some(board => board.checked);
}

function isSettingsValid(): boolean {
    return hasSelectedPlayer() && hasSelectedBoard();
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

    saveCurrentSettings();
    window.location.href = './game.html';
}

function registerWindowFunctions(): void {
    (window as any).startGame = startGame;
}

function initSettings(): void {
    registerWindowFunctions();
    resetPlayerAndBoard();
    loadSavedSettings();
    initThemeSelection();
    initPlayerSelection();
    initBoardSelection();
}

initSettings();