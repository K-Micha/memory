import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: './',

    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },

    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                game: resolve(__dirname, 'game.html'),
                settings: resolve(__dirname, 'settings.html'),
            },
        },
    },
});