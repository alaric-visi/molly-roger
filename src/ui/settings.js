// Per-browser preferences (not part of the save game).
const KEY = "molly-roger-settings";

export const TEXT_SPEEDS = {
    slow: { label: "Slow", ms: 35 },
    normal: { label: "Normal", ms: 20 },
    fast: { label: "Fast", ms: 8 },
    instant: { label: "Instant", ms: 0 }
};

export const THEMES = {
    system: "Match system",
    dark: "Dark",
    light: "Light"
};

const DEFAULTS = {
    textSpeed: "normal",
    theme: "system",
    showChanges: true,
    setPieces: true,   // interactive set pieces; off = choose from a plain list
    gentle: false,     // gentler set pieces: more time, slower searchlights
    sound: false,      // procedural ambience and effects
    volume: 0.6
};

let current = { ...DEFAULTS };
const listeners = new Set();

export function loadSettings() {
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) current = { ...DEFAULTS, ...JSON.parse(raw) };
    } catch { /* storage blocked - defaults are fine */ }
    return current;
}

export const getSettings = () => current;

export function updateSettings(patch) {
    current = { ...current, ...patch };
    try { localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* ignore */ }
    listeners.forEach(fn => fn(current));
}

export const onSettingsChange = fn => listeners.add(fn);

export const textSpeedMs = () => (TEXT_SPEEDS[current.textSpeed] || TEXT_SPEEDS.normal).ms;
