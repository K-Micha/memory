function getEl<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);

    if (!el) {
        throw new Error(`Element "${id}" not found`);
    }

    return el as T;
}

export const field = getEl<HTMLElement>('field');
export const exitBtn = getEl<HTMLButtonElement>('exit-btn');
export const exitModal = getEl<HTMLElement>('exit-modal');

export const gameOverOverlay = getEl<HTMLElement>('game-over');
export const winnerOverlay = getEl<HTMLElement>('winner-overlay');

export const scoreBlue = getEl<HTMLElement>('score-blue');
export const scoreOrange = getEl<HTMLElement>('score-orange');