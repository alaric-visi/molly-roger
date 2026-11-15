import "@fontsource-variable/inter";
import "@fontsource-variable/inter/wght-italic.css";
import "@fontsource-variable/geist";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/stage.css";
import "./styles/scene.css";
import "./styles/overlays.css";
import "./styles/ending.css";
import "./styles/systems.css";
import "./styles/setpieces.css";
import "./styles/home.css";

import { collectElements, els } from "./ui/dom.js";
import { loadSettings, getSettings, onSettingsChange } from "./ui/settings.js";
import * as audio from "./audio/audio.js";
import { watchTheme } from "./ui/theme.js";
import { wireOverlays, openOverlay, anyOverlayOpen } from "./ui/overlays.js";
import { wireSettings } from "./ui/panels.js";
import { skipTyping } from "./ui/typewriter.js";
import {
    boot, restart, persist, openJourney, openSatchel, openGallery, openCodex, editPlayer, chooseByNumber, refreshChoices,
    openHome, continueGame, startNewGame
} from "./game.js";
import { isHomeOpen } from "./ui/home.js";
import { initStage } from "./stage/stage.js";

function wireControls() {
    els.restartBtn.addEventListener("click", restart);
    els.saveBtn.addEventListener("click", () => persist(true));
    els.aboutLink.addEventListener("click", () => openOverlay(els.aboutOverlay));
    els.storyLink.addEventListener("click", () => openOverlay(els.storyOverlay));
    els.journeyLink.addEventListener("click", openJourney);
    els.satchelLink.addEventListener("click", openSatchel);
    els.carriedOpen.addEventListener("click", openSatchel);
    els.carriedList.addEventListener("click", e => { if (e.target.closest(".carried-chip")) openSatchel(); });
    els.galleryLink.addEventListener("click", openGallery);
    els.codexLink.addEventListener("click", openCodex);

    // Start screen
    els.homeLink.addEventListener("click", openHome);
    els.homeContinue.addEventListener("click", continueGame);
    els.homeNew.addEventListener("click", startNewGame);
    els.homeGallery.addEventListener("click", openGallery);
    els.homeCodex.addEventListener("click", openCodex);
    els.homeAbout.addEventListener("click", () => openOverlay(els.aboutOverlay));
    els.homeSettings.addEventListener("click", () => openOverlay(els.settingsOverlay));

    // Sound and set-piece settings take effect immediately.
    let setPiecesWas = getSettings().setPieces;
    onSettingsChange(s => {
        audio.setVolume(s.volume);
        audio.setEnabled(s.sound);
        if (s.setPieces !== setPiecesWas) {
            setPiecesWas = s.setPieces;
            refreshChoices();
        }
    });
    // Browsers only allow audio after a gesture.
    window.addEventListener("pointerdown", audio.unlock, { once: true });
    window.addEventListener("keydown", audio.unlock, { once: true });
    els.dismissContinueBanner.addEventListener("click", () => { els.continueBanner.hidden = true; });
    wireSettings({ onEditPlayer: editPlayer });

    // Click the text to reveal it all at once.
    els.sceneText.addEventListener("click", skipTyping);

    document.addEventListener("keydown", e => {
        if (anyOverlayOpen() || isHomeOpen() || e.ctrlKey || e.metaKey || e.altKey) return;
        const tag = document.activeElement?.tagName;
        const onButton = tag === "BUTTON" || tag === "A";

        if (e.key === " " && !onButton) {
            // Space is the "skip" key here, never page-scroll.
            e.preventDefault();
            skipTyping();
            return;
        }
        if (e.key === "Enter" && !onButton) {
            if (skipTyping()) e.preventDefault();
            return;
        }
        if (/^[1-9]$/.test(e.key)) chooseByNumber(Number(e.key));
    });
}

window.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    audio.setVolume(getSettings().volume);
    audio.setEnabled(getSettings().sound);
    collectElements();
    watchTheme();
    wireOverlays();
    wireControls();
    initStage();
    boot();
});
