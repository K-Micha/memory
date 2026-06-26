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
    updateGameOverScores,
    updateScore,
    updateThemeIcons,
    updateWinnerIcon,
    updateWinnerName,
    updateScorePanelState,
    updateDrawIcon,
    type Player,
} from './game-utils';

const settings = loadSettings();

const exitBtn = document.getElementById('exit-btn') as HTMLButtonElement;
const exitModal = document.getElementById('exit-modal') as HTMLElement;
const gameOverOverlay = document.getElementById('game-over') as HTMLElement;
const winnerOverlay = document.getElementById('winner-overlay') as HTMLElement;

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

function finishTurn(): void {
    flippedCards = [];

    if (document.querySelectorAll('.is-matched').length === settings.boardSize) {
        showEndSequence();
        return;
    }

    switchPlayer();
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
        finishTurn();

        return;
    }

    setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');

        finishTurn();
    }, 800);
}

function getWinner(): Player {
    const scores = getScores();

    if (settings.players.length === 1) {
        return settings.players[0];
    }

    return scores.blue >= scores.orange ? 'blue' : 'orange';
}

function openGameOverOverlay(): void {
    updateGameOverScores(settings);
    lockScroll();
    gameOverOverlay.classList.add('game-over--open');
}

function closeGameOverOverlay(): void {
    gameOverOverlay.classList.remove('game-over--open');
}

function isDraw(): boolean {
    const scores = getScores();

    return settings.players.length > 1 && scores.blue === scores.orange;
}

function openWinnerOverlay(): void {
    if (isDraw()) {
        winnerOverlay.classList.add('winner--draw');
        updateDrawIcon(settings.theme);
    } else {
        const winner = getWinner();

        winnerOverlay.classList.remove('winner--draw');
        updateWinnerName(winner);
        updateWinnerIcon(settings.theme, winner);
    }

    lockScroll();
    winnerOverlay.classList.add('winner--open');
}

function showEndSequence(): void {
    openGameOverOverlay();

    setTimeout(() => {
        closeGameOverOverlay();
        openWinnerOverlay();
    }, 6000); // original 3000
}

function cheatWin(): void {
    const cards = Array.from(
        document.querySelectorAll<HTMLButtonElement>('.card')
    );

    const openCards = cards.filter(card => {
        return (
            !card.classList.contains('is-matched') &&
            card.dataset.card
        );
    });

    const firstCard = openCards[0];

    if (!firstCard) {
        showEndSequence();
        return;
    }

    const secondCard = openCards.find(card => {
        return (
            card !== firstCard &&
            card.dataset.card === firstCard.dataset.card
        );
    });

    if (!secondCard) {
        return;
    }

    firstCard.classList.add('is-flipped');
    secondCard.classList.add('is-flipped');

    firstCard.classList.add('is-matched');
    secondCard.classList.add('is-matched');

    updateScore(getCurrentPlayer(settings.players, currentPlayerIndex));

    if (document.querySelectorAll('.is-matched').length === settings.boardSize) {
        showEndSequence();
    }
}

exitBtn.addEventListener('click', openExitModal);
exitModal.addEventListener('click', handleModalBackdropClick);

(window as any).backGame = backGame;
(window as any).exitGame = exitGame;
(window as any).backToStart = backToStart;
(window as any).cheatWin = cheatWin;

updateScorePanelState(settings);
setupGameLayout(settings);
applyGameTheme(settings.theme);
applyBodyTheme(settings.theme);
updateThemeIcons(settings.theme);
renderCards(settings, handleCardClick);


updateCurrentPlayerDisplay(
    settings.theme,
    getCurrentPlayer(settings.players, currentPlayerIndex)
);


function cheatDraw(): void {
    winnerOverlay.classList.add('winner--draw');
    openWinnerOverlay();
}

(window as any).cheatDraw = cheatDraw;

// openWinnerOverlay();
// showEndSequence();

//cheatWin()
//cheatDraw()