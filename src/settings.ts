import { themes, type Theme } from './card-utils';
import { loadSettings, saveSettings } from './storage-utils';

type Player = 'blue' | 'orange';
type BoardSize = 16 | 24 | 36;

/** Current game settings.*/
export type GameSettings = {
    theme: Theme;
    startingPlayer: Player | null;
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

/** Returns the selected starting player.*/
function getStartingPlayer(): Player | null {
    const playerValue = UI.player.find(player => player.checked)?.value;

    return playerValue
        ? (playerValue as Player)
        : null;
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
        startingPlayer: getStartingPlayer(),
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

/** Updates saved starting player.*/
function updateSavedStartingPlayer(settings: GameSettings): void {
    UI.player.forEach(player => {
        player.checked = player.value === settings.startingPlayer;
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
    updateSavedStartingPlayer(settings);
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

    applySavedSettings(settings as GameSettings);
}

/** Initializes theme preview hover.*/
function initThemePreviewHover(input: HTMLInputElement): void {
    const item = input.closest('.options__item');

    item?.addEventListener('mouseenter', () => {
        updateThemePreview(input.value as Theme);
    });

    item?.addEventListener('mouseleave', () => {
        updateThemePreview(getTheme());
    });
}

/** Initializes theme selection.*/
function initThemeSelection(): void {
    UI.theme.forEach(input => {
        initThemePreviewHover(input);

        input.addEventListener('change', () => {
            if (input.checked) {
                updateThemePreview(input.value as Theme);
                saveCurrentSettings();
            }
        });
    });
}

/** Selects only one starting player.*/
function selectStartingPlayer(selectedPlayer: HTMLInputElement): void {
    UI.player.forEach(player => {
        player.checked = player === selectedPlayer;
    });
}

/** Initializes player selection.*/
function initPlayerSelection(): void {
    UI.player.forEach(player => {
        player.addEventListener('change', () => {
            selectStartingPlayer(player);
            saveCurrentSettings();
        });
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
        updateStartButtonState();
        return;
    }

    if (board.checked) {
        selectBoard(board);
        saveCurrentSettings();
        updateStartButtonState();
    }
}

/** Initializes board selection.*/
function initBoardSelection(): void {
    UI.board.forEach(board => {
        board.addEventListener('click', () => handleBoardClick(board));
    });
}

/** Checks for selected starting player.*/
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


/** Indicates whether the start button is active.*/
let isStartButtonActive = false;

/** Updates the start button state.*/
function updateStartButtonState(): void {
    const button = document.querySelector<HTMLButtonElement>('.summary__item--hight');

    if (!button) {
        return;
    }

    isStartButtonActive = isSettingsValid();
    button.classList.toggle('is-disabled', !isStartButtonActive);
}

/** Starts the game.*/
function startGame(): void {
    if (!isStartButtonActive) {
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
    updateStartButtonState();
}

initSettings();