/** Available card images for the code theme.*/
export const techCards = [
    'angular',
    'clip',
    'css',
    'django',
    'firebase',
    'git-icon',
    'github',
    'group-16',
    'group-17',
    'html',
    'javascript',
    'node',
    'python',
    'sass',
    'sql',
    'terminal',
    'type-script',
    'vs-code',
] as const;

/** Available card images for the food theme.*/
export const foodCards = [
    'burger',
    'donat',
    'eis',
    'food1',
    'food2',
    'food3',
    'food4',
    'food5',
    'food6',
    'food7',
    'food8',
    'food9',
    'food10',
    'pizza',
    'pommes',
    'sandwitch',
    'shoko',
    'sushi',
] as const;

/** Theme configuration for cards, icons and assets.*/
export const themes = {
    code: {
        cards: techCards,
        preview: 'dev-theme.svg',
        className: 'game--code',
        cardPath: './src/assets/game-1/',

        playerIcons: {
            blue: './src/assets/img/blue.svg',
            orange: './src/assets/img/orange.svg',
        },

        currentPlayerIcons: {
            blue: './src/assets/img/blue.svg',
            orange: './src/assets/img/orange.svg',
        },

        winnerIcons: {
            blue: './src/assets/img/food-blue.svg',
            orange: './src/assets/img/food-orange.svg',
            draw: './src/assets/img/code-draw.svg',
        },

        winnerTitle: './src/assets/img/winner.svg',

        exitIcon: './src/assets/img/exit.svg',
    },

    food: {
        cards: foodCards,
        preview: 'food-theme.svg',
        className: 'game--food',
        cardPath: './src/assets/game-2/',

        playerIcons: {
            blue: './src/assets/img/food-blue.svg',
            orange: './src/assets/img/food-orange.svg',
        },

        currentPlayerIcons: {
            blue: './src/assets/img/player-with.svg',
            orange: './src/assets/img/player-with.svg',
        },

        winnerIcons: {
            blue: './src/assets/img/food-blue.svg',
            orange: './src/assets/img/food-orange.svg',
             draw: './src/assets/img/food-draw.svg',
        },

        winnerTitle: './src/assets/img/winner-food.svg',

        exitIcon: './src/assets/img/food-exit.svg',
    },
} as const;

/** Available game themes.*/
export type Theme = keyof typeof themes;