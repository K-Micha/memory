import type { GameSettings } from './settings';

const SETTINGS_KEY = 'gameSettings';

export function saveSettings(settings: GameSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings(): GameSettings | null {
    const saved = localStorage.getItem(SETTINGS_KEY);

    if (!saved) {
        return null;
    }

    return JSON.parse(saved) as GameSettings;
}

export function clearSettings(): void {
    localStorage.removeItem(SETTINGS_KEY);
}