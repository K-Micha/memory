/** Returns an HTML element by its id.*/
function getEl<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Element "${id}" not found`);
    }

    return element as T;
}

/** Returns an HTML element by its selector.*/
function getQueryEl<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector(selector);

    if (!element) {
        throw new Error(`Element "${selector}" not found`);
    }

    return element as T;
}

/** Game UI elements.*/
export const gameElements = {
    gameEl: getQueryEl<HTMLElement>('.game'),
    field: getEl<HTMLElement>('field'),
    template: getQueryEl<HTMLButtonElement>('.card'),

    scoreBlue: getEl<HTMLElement>('score-blue'),
    scoreOrange: getEl<HTMLElement>('score-orange'),
    exitIcon: getEl<HTMLImageElement>('exit-icon'),

    headerPlayerBlue: getEl<HTMLElement>('header-player-blue'),
    headerPlayerOrange: getEl<HTMLElement>('header-player-orange'),

    bluePlayerIcon: getEl<HTMLImageElement>('player-blue-icon'),
    orangePlayerIcon: getEl<HTMLImageElement>('player-orange-icon'),

    currentPlayerWrapper: getEl<HTMLElement>('current-player-wrapper'),
    currentPlayerIcon: getEl<HTMLImageElement>('current-player-icon'),

    gameOverBlue: getEl<HTMLElement>('game-over-blue'),
    gameOverOrange: getEl<HTMLElement>('game-over-orange'),

    gameOverBlueIcon: getEl<HTMLImageElement>('game-over-blue-icon'),
    gameOverOrangeIcon: getEl<HTMLImageElement>('game-over-orange-icon'),

    gameOverBlueScore: getEl<HTMLElement>('game-over-blue-score'),
    gameOverOrangeScore: getEl<HTMLElement>('game-over-orange-score'),

    winnerIcon: getEl<HTMLImageElement>('winner-icon'),
    winnerName: getEl<HTMLElement>('winner-name'),

    exitBtn: getEl<HTMLButtonElement>('exit-btn'),
    exitModal: getEl<HTMLElement>('exit-modal'),
    gameOverOverlay: getEl<HTMLElement>('game-over'),
    winnerOverlay: getEl<HTMLElement>('winner-overlay'),
};

export const exitBtn = gameElements.exitBtn;
export const exitModal = gameElements.exitModal;
export const gameOverOverlay = gameElements.gameOverOverlay;
export const winnerOverlay = gameElements.winnerOverlay;