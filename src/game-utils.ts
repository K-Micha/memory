import { themes, type Theme } from './card-utils';

export type Player = 'blue' | 'orange';
export type BoardSize = 16 | 24 | 36;

export type GameSettings = {
    theme: Theme;
    players: Player[];
    boardSize: BoardSize;
};

const fallbackSettings: GameSettings = {
    theme: 'code',
    players: ['blue'],
    boardSize: 16,
};

const gameEl = document.querySelector<HTMLElement>('.game');
const field = document.getElementById('field') as HTMLElement;
const template = document.querySelector('.card') as HTMLButtonElement;

const scoreBlue = document.getElementById('score-blue') as HTMLElement;
const scoreOrange = document.getElementById('score-orange') as HTMLElement;
const exitIcon = document.getElementById('exit-icon') as HTMLImageElement;

const bluePlayerIcon =
    document.getElementById('player-blue-icon') as HTMLImageElement;

const orangePlayerIcon =
    document.getElementById('player-orange-icon') as HTMLImageElement;

const currentPlayerWrapper =
    document.getElementById('current-player-wrapper') as HTMLElement;

const currentPlayerIcon =
    document.getElementById('current-player-icon') as HTMLImageElement;

const scores: Record<Player, number> = {
    blue: 0,
    orange: 0,
};

const imageCache = new Map<string, HTMLImageElement>();

export function loadSettings(): GameSettings {
    const saved = localStorage.getItem('gameSettings');

    if (!saved) {
        return fallbackSettings;
    }

    return JSON.parse(saved) as GameSettings;
}

export function setupGameLayout(settings: GameSettings): void {
    field.classList.add(`game__board-wrapper--${settings.boardSize}`);
}

export function applyGameTheme(theme: Theme): void {
    if (!gameEl) {
        return;
    }

    gameEl.classList.remove('game--code', 'game--food');
    gameEl.classList.add(themes[theme].className);
}

export function applyBodyTheme(theme: Theme): void {
    document.body.classList.remove('body--code', 'body--food');
    document.body.classList.add(`body--${theme}`);
}

export function updateThemeIcons(theme: Theme): void {
    const playerIcons = themes[theme].playerIcons;

    bluePlayerIcon.src = playerIcons.blue;
    bluePlayerIcon.alt = 'blue';

    orangePlayerIcon.src = playerIcons.orange;
    orangePlayerIcon.alt = 'orange';

    exitIcon.src = themes[theme].exitIcon;
    exitIcon.alt = 'exit game';
}

export function getCurrentPlayer(
    players: Player[],
    currentPlayerIndex: number
): Player {
    return players[currentPlayerIndex];
}

export function getNextPlayerIndex(
    players: Player[],
    currentPlayerIndex: number
): number {
    if (players.length < 2) {
        return currentPlayerIndex;
    }

    return currentPlayerIndex === 0 ? 1 : 0;
}

export function updateCurrentPlayerDisplay(
    theme: Theme,
    player: Player
): void {
    currentPlayerIcon.src = themes[theme].currentPlayerIcons[player];
    currentPlayerIcon.alt = player;

    currentPlayerWrapper.classList.remove(
        'header__current-icon--blue',
        'header__current-icon--orange'
    );

    currentPlayerWrapper.classList.add(`header__current-icon--${player}`);
}

export function updateScore(player: Player): void {
    scores[player]++;

    if (player === 'blue') {
        scoreBlue.textContent = String(scores[player]);
    }

    if (player === 'orange') {
        scoreOrange.textContent = String(scores[player]);
    }
}

export function getGameCards(settings: GameSettings): string[] {
    const pairCount = settings.boardSize / 2;
    const themeCards = [...themes[settings.theme].cards];

    const selectedCards = themeCards
        .sort(() => Math.random() - 0.5)
        .slice(0, pairCount);

    return [...selectedCards, ...selectedCards].sort(() => Math.random() - 0.5);
}

export function preloadImages(settings: GameSettings, imageNames: string[]): void {
    imageNames.forEach(imageName => {
        const imagePath = `${themes[settings.theme].cardPath}${imageName}.svg`;
        const image = new Image();

        image.src = imagePath;
        imageCache.set(imageName, image);
    });
}

export function createCard(
    imageName: string,
    handleCardClick: (card: HTMLButtonElement) => void
): HTMLButtonElement {
    const card = template.cloneNode(true) as HTMLButtonElement;
    const image = card.querySelector('.card__image') as HTMLImageElement;
    const cachedImage = imageCache.get(imageName);

    card.classList.remove('card--template', 'is-flipped', 'is-matched');
    card.dataset.card = imageName;

    if (cachedImage) {
        image.src = cachedImage.src;
    }

    image.alt = imageName;

    card.addEventListener('click', () => handleCardClick(card));

    return card;
}

export function renderCards(
    settings: GameSettings,
    handleCardClick: (card: HTMLButtonElement) => void
): void {
    const cards = getGameCards(settings);

    preloadImages(settings, cards);

    field.innerHTML = '';

    cards.forEach(cardName => {
        field.appendChild(createCard(cardName, handleCardClick));
    });
}