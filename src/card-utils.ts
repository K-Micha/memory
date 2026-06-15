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

export const themes = {
    code: {
        cards: techCards,
        preview: 'dev-theme.svg',
        className: 'game--code',
    },

    food: {
        cards: foodCards,
        preview: 'food-theme.svg',
        className: 'game--food',
    },
} as const;

export type Theme = keyof typeof themes;