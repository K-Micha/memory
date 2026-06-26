import {
    applyBodyTheme,
    applyGameTheme,
    getCurrentPlayer,
    getNextPlayerIndex,
    getScores,
    loadSettings,
    renderCards,
    setupGameLayout,
    updateCurrentPlayerDisplay,
    updateDrawIcon,
    updateGameOverScores,
    updateScore,
    updateScorePanelState,
    updateThemeIcons,
    updateWinnerIcon,
    updateWinnerName,
    type Player,
} from './game-utils';

import {
    exitBtn,
    exitModal,
    gameOverOverlay,
    winnerOverlay,
} from './game-elements';

const settings = loadSettings();

let currentPlayerIndex = 0;
let flippedCards: HTMLButtonElement[] = [];

function lockScroll(): void {
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
}

function unlockScroll(): void {
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
}

function openExitModal(): void {
    lockScroll();
    exitModal.classList.add('modal--open');
}

function closeExitModal(): void {
    exitModal.classList.remove('modal--open');
    unlockScroll();
}

function backGame(): void {
    closeExitModal();
}

function exitGame(): void {
    unlockScroll();
    window.history.back();
}

function backToStart(): void {
    unlockScroll();
    window.location.href = './index.html';
}

function handleModalBackdropClick(event: MouseEvent): void {
    if (event.target === exitModal) {
        closeExitModal();
    }
}

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

function isGameFinished(): boolean {
    const matchedCards = document.querySelectorAll('.is-matched');

    return matchedCards.length === settings.boardSize;
}

function finishTurn(): void {
    flippedCards = [];

    if (isGameFinished()) {
        showEndSequence();
        return;
    }

    switchPlayer();
}

function handleMatch(
    firstCard: HTMLButtonElement,
    secondCard: HTMLButtonElement
): void {
    firstCard.classList.add('is-matched');
    secondCard.classList.add('is-matched');

    updateScore(getCurrentPlayer(settings.players, currentPlayerIndex));
    finishTurn();
}

function resetCards(
    firstCard: HTMLButtonElement,
    secondCard: HTMLButtonElement
): void {
    firstCard.classList.remove('is-flipped');
    secondCard.classList.remove('is-flipped');

    finishTurn();
}

function checkCards(): void {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.card === secondCard.dataset.card) {
        handleMatch(firstCard, secondCard);
        return;
    }

    setTimeout(() => resetCards(firstCard, secondCard), 800);
}

function canFlipCard(card: HTMLButtonElement): boolean {
    return (
        !card.classList.contains('is-flipped') &&
        !card.classList.contains('is-matched') &&
        flippedCards.length < 2
    );
}

function handleCardClick(card: HTMLButtonElement): void {
    if (!canFlipCard(card)) {
        return;
    }

    card.classList.add('is-flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkCards();
    }
}

function getWinner(): Player {
    const scores = getScores();

    if (settings.players.length === 1) {
        return settings.players[0];
    }

    return scores.blue >= scores.orange ? 'blue' : 'orange';
}

function isDraw(): boolean {
    const scores = getScores();

    return settings.players.length > 1 && scores.blue === scores.orange;
}

function openGameOverOverlay(): void {
    updateGameOverScores(settings);
    lockScroll();
    gameOverOverlay.classList.add('game-over--open');
}

function closeGameOverOverlay(): void {
    gameOverOverlay.classList.remove('game-over--open');
}

function showWinner(): void {
    const winner = getWinner();

    winnerOverlay.classList.remove('winner--draw');
    updateWinnerName(winner);
    updateWinnerIcon(settings.theme, winner);
}

function showDraw(): void {
    winnerOverlay.classList.add('winner--draw');
    updateDrawIcon(settings.theme);
}

function openWinnerOverlay(): void {
    if (isDraw()) {
        showDraw();
    } else {
        showWinner();
    }

    lockScroll();
    winnerOverlay.classList.add('winner--open');
}

function showEndSequence(): void {
    openGameOverOverlay();

    setTimeout(() => {
        closeGameOverOverlay();
        openWinnerOverlay();
    }, 3000);
}

function getOpenCards(): HTMLButtonElement[] {
    const cards = document.querySelectorAll<HTMLButtonElement>('.card');

    return Array.from(cards).filter(card => {
        return !card.classList.contains('is-matched') && card.dataset.card;
    });
}

function findMatchingCard(
    firstCard: HTMLButtonElement
): HTMLButtonElement | undefined {
    return getOpenCards().find(card => {
        return (
            card !== firstCard &&
            card.dataset.card === firstCard.dataset.card
        );
    });
}

function getCheatPair(): HTMLButtonElement[] {
    const [firstCard] = getOpenCards();

    if (!firstCard) {
        return [];
    }

    const secondCard = findMatchingCard(firstCard);

    return secondCard ? [firstCard, secondCard] : [];
}

function matchCheatCards(
    firstCard: HTMLButtonElement,
    secondCard: HTMLButtonElement
): void {
    firstCard.classList.add('is-flipped', 'is-matched');
    secondCard.classList.add('is-flipped', 'is-matched');

    updateScore(getCurrentPlayer(settings.players, currentPlayerIndex));
}

function cheatWin(): void {
    const [firstCard, secondCard] = getCheatPair();

    if (!firstCard || !secondCard) {
        showEndSequence();
        return;
    }

    matchCheatCards(firstCard, secondCard);

    if (isGameFinished()) {
        showEndSequence();
    }
}

function cheatDraw(): void {
    showDraw();
    openWinnerOverlay();
}

exitBtn.addEventListener('click', openExitModal);
exitModal.addEventListener('click', handleModalBackdropClick);

function registerWindowFunctions(): void {
    (window as any).backGame = backGame;
    (window as any).exitGame = exitGame;
    (window as any).backToStart = backToStart;
    (window as any).cheatWin = cheatWin;
    (window as any).cheatDraw = cheatDraw;
}

function setupGame(): void {
    updateScorePanelState(settings);
    setupGameLayout(settings);
    applyGameTheme(settings.theme);
    applyBodyTheme(settings.theme);
    updateThemeIcons(settings.theme);
    renderCards(settings, handleCardClick);
}

function initGame(): void {
    registerWindowFunctions();
    setupGame();

    updateCurrentPlayerDisplay(
        settings.theme,
        getCurrentPlayer(settings.players, currentPlayerIndex)
    );
}

initGame();