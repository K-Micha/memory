import { themes, type Theme } from './card-utils';
import { loadSettings, saveSettings } from './storage-utils';

type Player = 'blue' | 'orange';
type BoardSize = 16 | 24 | 36;

/** Current game settings.*/
export type GameSettings = {
    theme: Theme;
    players: Player[];
    boardSize: BoardSize | null;
};

/** Returns an input by its id.*/
function getInput(id: string): HTMLInputElement {
    const element = document.getElementById(id);

    if (!(element instanceof HTMLInputElement)) {
        throw new Error(`Input with id "${id}" not found`);
    }

    return element;
}

/** Returns an image by its id.*/
function getImage(id: string): HTMLImageElement {
    const element = document.getElementById(id);

    if (!(element instanceof HTMLImageElement)) {
        throw new Error(`Image with id "${id}" not found`);
    }

    return element;
}

/** Settings UI elements.*/
const UI = {
    theme: [getInput('theme-code'), getInput('theme-food')],
    player: [getInput('player-blue'), getInput('player-orange')],
    board: [getInput('board-16'), getInput('board-24'), getInput('board-36')],
    previewImage: getImage('theme-preview'),
} as const;

/** Updates the theme preview.*/
function updateThemePreview(theme: Theme): void {
    UI.previewImage.src = `./src/assets/img/${themes[theme].preview}`;
    UI.previewImage.alt = `${theme} theme preview`;
}

/** Resets player selection.*/
function resetPlayerSelection(): void {
    UI.player.forEach(player => {
        player.checked = false;
    });
}

/** Resets board selection.*/
function resetBoardSelection(): void {
    UI.board.forEach(board => {
        board.checked = false;
        board.dataset.selected = '0';
    });
}

/** Resets player and board selection.*/
function resetPlayerAndBoard(): void {
    resetPlayerSelection();
    resetBoardSelection();
}

/** Returns the selected theme.*/
function getTheme(): Theme {
    return (
        (UI.theme.find(theme => theme.checked)?.value as Theme) ??
        'code'
    );
}

/** Returns selected players.*/
function getPlayers(): Player[] {
    return UI.player
        .filter(player => player.checked)
        .map(player => player.value as Player);
}

/** Returns selected board size.*/
function getBoardSize(): BoardSize | null {
    const boardValue = UI.board.find(board => board.checked)?.value;

    return boardValue
        ? (Number(boardValue) as BoardSize)
        : null;
}

/** Returns current settings.*/
function getSettings(): GameSettings {
    return {
        theme: getTheme(),
        players: getPlayers(),
        boardSize: getBoardSize(),
    };
}

/** Saves current settings.*/
function saveCurrentSettings(): void {
    saveSettings(getSettings());
}

/** Updates saved theme.*/
function updateSavedTheme(settings: GameSettings): void {
    UI.theme.forEach(theme => {
        theme.checked = theme.value === settings.theme;
    });
}

/** Updates saved players.*/
function updateSavedPlayers(settings: GameSettings): void {
    UI.player.forEach(player => {
        player.checked = settings.players.includes(player.value as Player);
    });
}

/** Updates saved board.*/
function updateSavedBoard(settings: GameSettings): void {
    UI.board.forEach(board => {
        const isSelected = Number(board.value) === settings.boardSize;

        board.checked = isSelected;
        board.dataset.selected = isSelected ? '1' : '0';
    });
}

/** Applies saved settings.*/
function applySavedSettings(settings: GameSettings): void {
    updateSavedTheme(settings);
    updateSavedPlayers(settings);
    updateSavedBoard(settings);
    updateThemePreview(settings.theme);
}

/** Loads saved settings.*/
function loadSavedSettings(): void {
    const settings = loadSettings();

    if (!settings) {
        updateThemePreview('code');
        return;
    }

    applySavedSettings(settings);
}

/** Initializes theme selection.*/
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

/** Initializes player selection.*/
function initPlayerSelection(): void {
    UI.player.forEach(player => {
        player.addEventListener('change', saveCurrentSettings);
    });
}

/** Clears board selection.*/
function clearBoardSelection(): void {
    UI.board.forEach(board => {
        board.dataset.selected = '0';
    });
}

/** Toggles board selection.*/
function toggleBoardSelection(board: HTMLInputElement): boolean {
    if (board.checked && board.dataset.selected === '1') {
        board.checked = false;
        board.dataset.selected = '0';
        return true;
    }

    return false;
}

/** Selects a board.*/
function selectBoard(board: HTMLInputElement): void {
    clearBoardSelection();
    board.dataset.selected = '1';
}

/** Handles board clicks.*/
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

/** Initializes board selection.*/
function initBoardSelection(): void {
    UI.board.forEach(board => {
        board.addEventListener('click', () => handleBoardClick(board));
    });
}

/** Checks for selected players.*/
function hasSelectedPlayer(): boolean {
    return UI.player.some(player => player.checked);
}

/** Checks for selected board.*/
function hasSelectedBoard(): boolean {
    return UI.board.some(board => board.checked);
}

/** Checks if settings are valid.*/
function isSettingsValid(): boolean {
    return hasSelectedPlayer() && hasSelectedBoard();
}

/** Marks missing settings.*/
function markMissingSettings(): void {
    const summary = document.querySelector('.summary');
    summary?.classList.add('summary--error');
}

/** Starts the game.*/
function startGame(): void {
    if (!isSettingsValid()) {
        markMissingSettings();
        return;
    }

    saveCurrentSettings();
    window.location.href = './game.html';
}

/** Registers global html functions.*/
function registerWindowFunctions(): void {
    (window as any).startGame = startGame;
}

/** Initializes settings page.*/
function initSettings(): void {
    registerWindowFunctions();
    resetPlayerAndBoard();
    loadSavedSettings();
    initThemeSelection();
    initPlayerSelection();
    initBoardSelection();
}

initSettings();