import { themes, type Theme } from './card-utils';

type Player = 'blue' | 'orange';
type BoardSize = 16 | 24 | 36;

type GameSettings = {
    theme: Theme;
    players: Player[];
    boardSize: BoardSize;
};

const fallbackSettings: GameSettings = {
    theme: 'code',
    players: ['blue'],
    boardSize: 16,
};

const playerIcons = {
    blue: './src/assets/img/blue.svg',
    orange: './src/assets/img/orange.svg',
} as const;

function loadSettings(): GameSettings {
    const saved = localStorage.getItem('gameSettings');

    if (!saved) {
        return fallbackSettings;
    }

    return JSON.parse(saved) as GameSettings;
}

const settings = loadSettings();

const gameEl = document.querySelector<HTMLElement>('.game');
const field = document.getElementById('field') as HTMLElement;
const template = document.querySelector('.card') as HTMLButtonElement;

const imageCache = new Map<string, HTMLImageElement>();

function preloadImages(imageNames: string[]): void {
    imageNames.forEach(imageName => {
        const imagePath =
            `${themes[settings.theme].cardPath}${imageName}.svg`;

        const image = new Image();

        image.src = imagePath;

        imageCache.set(imageName, image);
    });
}

const scoreBlue = document.getElementById('score-blue') as HTMLElement;
const scoreOrange = document.getElementById('score-orange') as HTMLElement;
const currentPlayerIcon = document.getElementById('current-player-icon') as HTMLImageElement;

let currentPlayerIndex = 0;
let flippedCards: HTMLButtonElement[] = [];

const scores: Record<Player, number> = {
    blue: 0,
    orange: 0,
};

if (gameEl) {
    gameEl.className = `game ${themes[settings.theme].className}`;
}

function getCurrentPlayer(): Player {
    return settings.players[currentPlayerIndex];
}

function updateCurrentPlayerDisplay(): void {
    const player = getCurrentPlayer();

    currentPlayerIcon.src = playerIcons[player];
    currentPlayerIcon.alt = player;
}

function switchPlayer(): void {
    if (settings.players.length < 2) {
        return;
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    updateCurrentPlayerDisplay();
}

function updateScore(player: Player): void {
    scores[player]++;

    if (player === 'blue') {
        scoreBlue.textContent = String(scores[player]);
    }

    if (player === 'orange') {
        scoreOrange.textContent = String(scores[player]);
    }
}

function getGameCards(): string[] {
    const pairCount = settings.boardSize / 2;
    const themeCards = [...themes[settings.theme].cards];

    const selectedCards = themeCards
        .sort(() => Math.random() - 0.5)
        .slice(0, pairCount);

    return [...selectedCards, ...selectedCards]
        .sort(() => Math.random() - 0.5);
}

function createCard(imageName: string): HTMLButtonElement {
    const card = template.cloneNode(true) as HTMLButtonElement;
    const image = card.querySelector('.card__image') as HTMLImageElement;

    card.classList.remove('card--template', 'is-flipped', 'is-matched');
    card.dataset.card = imageName;

    const cachedImage = imageCache.get(imageName);

    if (cachedImage) {
        image.src = cachedImage.src;
    }

    image.alt = imageName;

    card.addEventListener('click', () => handleCardClick(card));

    return card;
}

function handleCardClick(card: HTMLButtonElement): void {
    if (
        card.classList.contains('is-flipped') ||
        card.classList.contains('is-matched') ||
        flippedCards.length === 2
    ) {
        return;
    }

    card.classList.add('is-flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkCards();
    }
}

function checkCards(): void {
    const [firstCard, secondCard] = flippedCards;
    const currentPlayer = getCurrentPlayer();

    if (firstCard.dataset.card === secondCard.dataset.card) {
        firstCard.classList.add('is-matched');
        secondCard.classList.add('is-matched');

        updateScore(currentPlayer);
        flippedCards = [];
        return;
    }

    setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');

        flippedCards = [];
        switchPlayer();
    }, 800);
}

function renderCards(): void {
    const cards = getGameCards();

    preloadImages(cards);

    field.innerHTML = '';

    cards.forEach(cardName => {
        field.appendChild(createCard(cardName));
    });
}

renderCards();
updateCurrentPlayerDisplay();