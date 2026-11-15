// Light/dark mode. Priority: the player's setting, then the OS preference.
import { getSettings, onSettingsChange } from "./settings.js";

const media = window.matchMedia("(prefers-color-scheme: dark)");

export function syncTheme() {
    const chosen = getSettings().theme;
    const theme = (chosen === "dark" || chosen === "light" ? chosen : null)
        || (media.matches ? "dark" : "light");
    document.body.classList.toggle("light-mode", theme === "light");
}

export function watchTheme() {
    syncTheme();
    media.addEventListener?.("change", syncTheme);
    onSettingsChange(syncTheme);
}
