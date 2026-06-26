import { themes, type Theme } from './card-utils';
import { gameElements as el } from './game-elements';

/** Player color.*/
export type Player = 'blue' | 'orange';

/** Available board sizes.*/
export type BoardSize = 16 | 24 | 36;

/** Current game settings.*/
export type GameSettings = {
    theme: Theme;
    players: Player[];
    boardSize: BoardSize;
};

/** Default game settings.*/
const fallbackSettings: GameSettings = {
    theme: 'code',
    players: ['blue'],
    boardSize: 16,
};

/** Current player scores.*/
const scores: Record<Player, number> = {
    blue: 0,
    orange: 0,
};

/** Cached card images.*/
const imageCache = new Map<string, HTMLImageElement>();

/** Updates the winner icon.*/
export function updateWinnerIcon(theme: Theme, winner: Player): void {
    el.winnerIcon.src = themes[theme].winnerIcons[winner];
    el.winnerIcon.alt = winner;
}

/** Updates the draw icon.*/
export function updateDrawIcon(theme: Theme): void {
    el.winnerIcon.src = themes[theme].winnerIcons.draw;
    el.winnerIcon.alt = 'Draw';
}

/** Updates the winner name.*/
export function updateWinnerName(winner: Player): void {
    el.winnerName.classList.remove(
        'winner__name--blue',
        'winner__name--orange'
    );

    el.winnerName.classList.add(`winner__name--${winner}`);
    el.winnerName.textContent = `${winner.toUpperCase()} PLAYER`;
}

/** Updates the player state.*/
export function updatePlayerState(
    element: HTMLElement,
    active: boolean
): void {
    element.classList.toggle('is-inactive', !active);
}

/** Updates the score panel.*/
export function updateScorePanelState(settings: GameSettings): void {
    updatePlayerState(el.headerPlayerBlue, settings.players.includes('blue'));
    updatePlayerState(el.headerPlayerOrange, settings.players.includes('orange'));
}

/** Loads saved game settings.*/
export function loadSettings(): GameSettings {
    const saved = localStorage.getItem('gameSettings');

    if (!saved) {
        return fallbackSettings;
    }

    return JSON.parse(saved) as GameSettings;
}

/** Sets the game layout.*/
export function setupGameLayout(settings: GameSettings): void {
    el.field.classList.add(`game__board-wrapper--${settings.boardSize}`);
}

/** Applies the game theme.*/
export function applyGameTheme(theme: Theme): void {
    el.gameEl.classList.remove('game--code', 'game--food');
    el.gameEl.classList.add(themes[theme].className);
}

/** Applies the body theme.*/
export function applyBodyTheme(theme: Theme): void {
    document.body.classList.remove('body--code', 'body--food');
    document.body.classList.add(`body--${theme}`);
}

/** Updates all theme icons.*/
export function updateThemeIcons(theme: Theme): void {
    const playerIcons = themes[theme].playerIcons;

    el.bluePlayerIcon.src = playerIcons.blue;
    el.bluePlayerIcon.alt = 'blue';

    el.orangePlayerIcon.src = playerIcons.orange;
    el.orangePlayerIcon.alt = 'orange';

    el.exitIcon.src = themes[theme].exitIcon;
    el.exitIcon.alt = 'exit game';
}

/** Returns the current player.*/
export function getCurrentPlayer(
    players: Player[],
    currentPlayerIndex: number
): Player {
    return players[currentPlayerIndex];
}

/** Returns the next player index.*/
export function getNextPlayerIndex(
    players: Player[],
    currentPlayerIndex: number
): number {
    if (players.length < 2) {
        return currentPlayerIndex;
    }

    return currentPlayerIndex === 0 ? 1 : 0;
}

/** Updates the current player.*/
export function updateCurrentPlayerDisplay(
    theme: Theme,
    player: Player
): void {
    el.currentPlayerIcon.src = themes[theme].currentPlayerIcons[player];
    el.currentPlayerIcon.alt = player;

    el.currentPlayerWrapper.classList.remove(
        'header__current-icon--blue',
        'header__current-icon--orange'
    );

    el.currentPlayerWrapper.classList.add(`header__current-icon--${player}`);
}

/** Updates the player score.*/
export function updateScore(player: Player): void {
    scores[player]++;

    if (player === 'blue') {
        el.scoreBlue.textContent = String(scores[player]);
    }

    if (player === 'orange') {
        el.scoreOrange.textContent = String(scores[player]);
    }
}

/** Updates the game over visibility.*/
function updateGameOverVisibility(
    settings: GameSettings
): void {
    el.gameOverBlue.classList.toggle(
        'is-hidden',
        !settings.players.includes('blue')
    );

    el.gameOverOrange.classList.toggle(
        'is-hidden',
        !settings.players.includes('orange')
    );
}

/** Updates the game over player state.*/
function updateGameOverPlayerState(
    settings: GameSettings
): void {
    updatePlayerState(
        el.gameOverBlue,
        settings.players.includes('blue')
    );

    updatePlayerState(
        el.gameOverOrange,
        settings.players.includes('orange')
    );
}

/** Updates the game over icons.*/
function updateGameOverIcons(
    settings: GameSettings
): void {
    const playerIcons = themes[settings.theme].playerIcons;

    el.gameOverBlueIcon.src = playerIcons.blue;
    el.gameOverBlueIcon.alt = 'Blue player';

    el.gameOverOrangeIcon.src = playerIcons.orange;
    el.gameOverOrangeIcon.alt = 'Orange player';
}

/** Updates the game over scores.*/
function updateGameOverPoints(): void {
    el.gameOverBlueScore.textContent = String(scores.blue);
    el.gameOverOrangeScore.textContent = String(scores.orange);
}

/** Updates the game over panel.*/
export function updateGameOverScores(
    settings: GameSettings
): void {
    updateGameOverVisibility(settings);
    updateGameOverPlayerState(settings);
    updateGameOverIcons(settings);
    updateGameOverPoints();
}

/** Returns all player scores.*/
export function getScores(): Record<Player, number> {
    return scores;
}

/** Returns shuffled game cards.*/
export function getGameCards(settings: GameSettings): string[] {
    const pairCount = settings.boardSize / 2;
    const themeCards = [...themes[settings.theme].cards];

    const selectedCards = themeCards
        .sort(() => Math.random() - 0.5)
        .slice(0, pairCount);

    return [...selectedCards, ...selectedCards].sort(() => Math.random() - 0.5);
}

/** Preloads all card images.*/
export function preloadImages(
    settings: GameSettings,
    imageNames: string[]
): void {
    imageNames.forEach(imageName => {
        const imagePath = `${themes[settings.theme].cardPath}${imageName}.svg`;
        const image = new Image();

        image.src = imagePath;
        imageCache.set(imageName, image);
    });
}

/** Returns a cloned card.*/
function cloneCard(): HTMLButtonElement {
    return el.template.cloneNode(true) as HTMLButtonElement;
}

/** Returns the card image.*/
function getCardImage(
    card: HTMLButtonElement
): HTMLImageElement {
    return card.querySelector('.card__image') as HTMLImageElement;
}

/** Resets the card state.*/
function resetCard(card: HTMLButtonElement): void {
    card.classList.remove(
        'card--template',
        'is-flipped',
        'is-matched'
    );
}

/** Sets the card image.*/
function setCardImage(
    image: HTMLImageElement,
    imageName: string
): void {
    const cachedImage = imageCache.get(imageName);

    if (cachedImage) {
        image.src = cachedImage.src;
    }

    image.alt = imageName;
}

/** Binds the card click.*/
function bindCardClick(
    card: HTMLButtonElement,
    handleCardClick: (card: HTMLButtonElement) => void
): void {
    card.addEventListener('click', () => handleCardClick(card));
}

/** Creates a game card.*/
export function createCard(
    imageName: string,
    handleCardClick: (card: HTMLButtonElement) => void
): HTMLButtonElement {
    const card = cloneCard();
    const image = getCardImage(card);

    resetCard(card);
    card.dataset.card = imageName;

    setCardImage(image, imageName);
    bindCardClick(card, handleCardClick);

    return card;
}

/** Renders all game cards.*/
export function renderCards(
    settings: GameSettings,
    handleCardClick: (card: HTMLButtonElement) => void
): void {
    const cards = getGameCards(settings);

    preloadImages(settings, cards);

    el.field.innerHTML = '';

    cards.forEach(cardName => {
        el.field.appendChild(createCard(cardName, handleCardClick));
    });
}