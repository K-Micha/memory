import {
    applyBodyTheme,
    applyGameTheme,
    getCurrentPlayer,
    getNextPlayerIndex,
    loadSettings,
    renderCards,
    setupGameLayout,
    updateCurrentPlayerDisplay,
    updateScore,
} from './game-utils';

import { updateThemeIcons } from './game-utils';

const settings = loadSettings();

const exitBtn = document.getElementById('exit-btn') as HTMLButtonElement;
const exitModal = document.getElementById('exit-modal') as HTMLElement;

let currentPlayerIndex = 0;
let flippedCards: HTMLButtonElement[] = [];


function openExitModal(): void {
    exitModal.classList.add('modal--open');
}

function closeExitModal(): void {
    exitModal.classList.remove('modal--open');
}

exitBtn.addEventListener('click', openExitModal);

exitModal.addEventListener('click', event => {
    if (event.target === exitModal) {
        closeExitModal();
    }
});

function switchPlayer(): void {
    currentPlayerIndex = getNextPlayerIndex(
        settings.players,
        currentPlayerIndex
    );

    updateCurrentPlayerDisplay(
        settings.theme,
        getCurrentPlayer(settings.players, currentPlayerIndex)
    );
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
    const currentPlayer = getCurrentPlayer(
        settings.players,
        currentPlayerIndex
    );

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

setupGameLayout(settings);
applyGameTheme(settings.theme);
applyBodyTheme(settings.theme);
updateThemeIcons(settings.theme);
renderCards(settings, handleCardClick);

updateCurrentPlayerDisplay(
    settings.theme,
    getCurrentPlayer(settings.players, currentPlayerIndex)
);