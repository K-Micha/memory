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

/** Loaded game settings.*/
const settings = loadSettings();

let currentPlayerIndex = 0;
let flippedCards: HTMLButtonElement[] = [];

/** Locks page scrolling.*/
function lockScroll(): void {
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
}

/** Unlocks page scrolling.*/
function unlockScroll(): void {
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
}

/** Opens the exit modal.*/
function openExitModal(): void {
    lockScroll();
    exitModal.classList.add('modal--open');
}

/** Closes the exit modal.*/
function closeExitModal(): void {
    exitModal.classList.remove('modal--open');
    unlockScroll();
}

/** Closes the modal and returns to the game.*/
function backGame(): void {
    closeExitModal();
}

/** Exits the current game.*/
function exitGame(): void {
    unlockScroll();
    window.history.back();
}

/** Returns to the start page.*/
function backToStart(): void {
    unlockScroll();
    window.location.href = './index.html';
}

/** Closes the modal on backdrop click.*/
function handleModalBackdropClick(event: MouseEvent): void {
    if (event.target === exitModal) {
        closeExitModal();
    }
}

/** Switches to the next player.*/
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

/** Checks if all cards are matched.*/
function isGameFinished(): boolean {
    const matchedCards = document.querySelectorAll('.is-matched');

    return matchedCards.length === settings.boardSize;
}

/** Finishes the current turn.*/
function finishTurn(): void {
    flippedCards = [];

    if (isGameFinished()) {
        showEndSequence();
        return;
    }

    switchPlayer();
}

/** Handles a matching card pair.*/
function handleMatch(
    firstCard: HTMLButtonElement,
    secondCard: HTMLButtonElement
): void {
    firstCard.classList.add('is-matched');
    secondCard.classList.add('is-matched');

    updateScore(getCurrentPlayer(settings.players, currentPlayerIndex));
    finishTurn();
}

/** Resets unmatched cards.*/
function resetCards(
    firstCard: HTMLButtonElement,
    secondCard: HTMLButtonElement
): void {
    firstCard.classList.remove('is-flipped');
    secondCard.classList.remove('is-flipped');

    finishTurn();
}

/** Checks the flipped cards.*/
function checkCards(): void {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.card === secondCard.dataset.card) {
        handleMatch(firstCard, secondCard);
        return;
    }

    setTimeout(() => resetCards(firstCard, secondCard), 800);
}

/** Checks if a card can be flipped.*/
function canFlipCard(card: HTMLButtonElement): boolean {
    return (
        !card.classList.contains('is-flipped') &&
        !card.classList.contains('is-matched') &&
        flippedCards.length < 2
    );
}

/** Handles a card click.*/
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

/** Returns the winner.*/
function getWinner(): Player {
    const scores = getScores();

    if (settings.players.length === 1) {
        return settings.players[0];
    }

    return scores.blue >= scores.orange ? 'blue' : 'orange';
}

/** Checks if the game is a draw.*/
function isDraw(): boolean {
    const scores = getScores();

    return settings.players.length > 1 && scores.blue === scores.orange;
}

/** Opens the game over overlay.*/
function openGameOverOverlay(): void {
    updateGameOverScores(settings);
    lockScroll();
    gameOverOverlay.classList.add('game-over--open');
}

/** Closes the game over overlay.*/
function closeGameOverOverlay(): void {
    gameOverOverlay.classList.remove('game-over--open');
}

/** Shows the winner overlay state.*/
function showWinner(): void {
    const winner = getWinner();

    winnerOverlay.classList.remove('winner--draw');
    updateWinnerName(winner);
    updateWinnerIcon(settings.theme, winner);
}

/** Shows the draw overlay state.*/
function showDraw(): void {
    winnerOverlay.classList.add('winner--draw');
    updateDrawIcon(settings.theme);
}

/** Opens the winner overlay.*/
function openWinnerOverlay(): void {
    if (isDraw()) {
        showDraw();
    } else {
        showWinner();
    }

    lockScroll();
    winnerOverlay.classList.add('winner--open');
}

/** Shows the final game sequence.*/
function showEndSequence(): void {
    openGameOverOverlay();

    setTimeout(() => {
        closeGameOverOverlay();
        openWinnerOverlay();
    }, 3000);
}

/** Returns all open cards.*/
function getOpenCards(): HTMLButtonElement[] {
    const cards = document.querySelectorAll<HTMLButtonElement>('.card');

    return Array.from(cards).filter(card => {
        return !card.classList.contains('is-matched') && card.dataset.card;
    });
}

/** Finds a matching card.*/
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

/** Returns a matching cheat pair.*/
function getCheatPair(): HTMLButtonElement[] {
    const [firstCard] = getOpenCards();

    if (!firstCard) {
        return [];
    }

    const secondCard = findMatchingCard(firstCard);

    return secondCard ? [firstCard, secondCard] : [];
}

/** Matches cheat cards.*/
function matchCheatCards(
    firstCard: HTMLButtonElement,
    secondCard: HTMLButtonElement
): void {
    firstCard.classList.add('is-flipped', 'is-matched');
    secondCard.classList.add('is-flipped', 'is-matched');

    updateScore(getCurrentPlayer(settings.players, currentPlayerIndex));
}

/** Wins one cheat pair.*/
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

/** Shows a draw for testing.*/
function cheatDraw(): void {
    showDraw();
    openWinnerOverlay();
}

exitBtn.addEventListener('click', openExitModal);
exitModal.addEventListener('click', handleModalBackdropClick);

/** Registers global html functions.*/
function registerWindowFunctions(): void {
    (window as any).backGame = backGame;
    (window as any).exitGame = exitGame;
    (window as any).backToStart = backToStart;
    (window as any).cheatWin = cheatWin;
    (window as any).cheatDraw = cheatDraw;
}

/** Sets up the game UI.*/
function setupGame(): void {
    updateScorePanelState(settings);
    setupGameLayout(settings);
    applyGameTheme(settings.theme);
    applyBodyTheme(settings.theme);
    updateThemeIcons(settings.theme);
    renderCards(settings, handleCardClick);
}

/** Initializes the game.*/
function initGame(): void {
    registerWindowFunctions();
    setupGame();

    updateCurrentPlayerDisplay(
        settings.theme,
        getCurrentPlayer(settings.players, currentPlayerIndex)
    );
}

initGame();