// The game loop: owns the live state, moves between scenes, renders.
import { scenes, START_SCENE, codex, locations, acts, characters } from "./story/index.js";
import { splitLines, stripTags, PLAYER } from "./engine/dialogue.js";
import {
    createState, newRun, enterScene, applyChoice, resolveNext, resolveText, rewindTo, highestAct,
    choicesFor, snapshot, describeChanges, castFor, effectiveChoice, view
} from "./engine/rules.js";
import * as saves from "./engine/save.js";
import { els, escapeHtml } from "./ui/dom.js";
import { typeText, cancelTyping, isTyping, skipTyping } from "./ui/typewriter.js";
import {
    renderStatus, renderRelationships, clearRelationships, renderPersistenceNote, showSaveToast, renderChanges, renderProgress
} from "./ui/hud.js";
import { renderBreadcrumbs, renderJourneyList } from "./ui/journey.js";
import { showActTransition, renderEnding, clearEnding } from "./ui/presentation.js";
import { openOverlay, closeOverlay } from "./ui/overlays.js";
import {
    askForPlayer, confirmDialog, openSatchel as showSatchel, openGallery as showGallery, openCodex as showCodex
} from "./ui/panels.js";
import { getSettings, textSpeedMs } from "./ui/settings.js";
import { renderStage } from "./stage/stage.js";
import { runSetPiece } from "./ui/setpieces/index.js";
import { showHome, hideHome, isHomeOpen } from "./ui/home.js";
import * as audio from "./audio/audio.js";

let state = createState();
let lastShownAct = 0;
let visibleChoices = []; // [{ choice, locked, hint, text }]
let busy = false;        // an act card or set piece is playing
let shown = false;       // the current scene has been drawn on the main screen
let hasSave = false;     // there is a journey to continue

const codexTitle = id => codex.find(e => e.id === id)?.title || id;

// ---------- navigation ----------

async function goTo(sceneId, choiceText, before = null) {
    const scene = scenes[sceneId];
    if (!scene) {
        showSceneError({ id: sceneId }, new Error("missing scene"));
        return;
    }

    if (scene.act && scene.act > lastShownAct) {
        busy = true;
        audio.sfx("curtain");
        await showActTransition(scene.act);
        lastShownAct = scene.act;
        busy = false;
    }

    const unlocked = enterScene(state, scene, choiceText);
    const changes = before ? describeChanges(before, snapshot(state)) : [];
    changes.push(...unlocked.map(id => ({ kind: "codex", label: codexTitle(id) })));
    if (changes.some(c => c.kind === "item" && c.gained)) audio.sfx("item");
    if (scene.ending) audio.sfx("ending");
    render(scene, changes);
    persist(false);
}

async function choose(index) {
    const entry = visibleChoices[index];
    if (!entry || entry.locked || busy) return;
    const { choice } = entry;
    clearChoices(); // stop double-clicks while an act card or set piece plays
    audio.sfx("choice");

    if (choice.playAgain) {
        newGame(state.player);
        return;
    }

    let outcome = null;
    if (choice.setPiece) {
        busy = true;
        outcome = await runSetPiece(choice.setPiece, els.choices, {
            state: view(state),
            skipOutcome: choice.skipOutcome,
            sfx: audio.sfx,
            gentle: getSettings().gentle
        });
        busy = false;
    }

    const picked = effectiveChoice(choice, outcome);
    const before = snapshot(state);
    applyChoice(state, picked);
    goTo(resolveNext(picked, state), entry.text, before);
}

export function chooseByNumber(n) {
    if (isTyping() || busy || isHomeOpen()) return;
    choose(n - 1);
}

export function jumpTo(index) {
    if (busy || !rewindTo(state, index)) return;
    lastShownAct = highestAct(state, scenes);
    closeOverlay(els.journeyOverlay);
    render(scenes[state.currentSceneId], []);
    persist(false);
}

function newGame(player) {
    // Endings found, codex entries and the run count carry over (and unlock Ghost Memory).
    state = newRun(state, player);
    lastShownAct = 0;
    hasSave = true;
    els.continueBanner.hidden = true;
    goTo(START_SCENE, null);
}

export async function restart() {
    if (busy) return;
    const ok = await confirmDialog("Start a new game? Your current journey will be lost (discovered endings and the codex are kept).", "Restart");
    if (!ok) return;
    const player = await askForPlayer(state.player, { submitLabel: "Begin again" });
    if (player) newGame(player);
}

export async function editPlayer() {
    closeOverlay(els.settingsOverlay);
    const player = await askForPlayer(state.player, { submitLabel: "Amend the register" });
    if (!player) return;
    state.player = player;
    if (!hasSave) return; // nothing to redraw or save yet: the start screen is up
    if (!busy && shown) render(scenes[state.currentSceneId], []);
    persist(false);
}

export function openJourney() {
    renderJourneyList(state.journeySteps, { onJump: jumpTo });
    openOverlay(els.journeyOverlay);
}

export const openSatchel = () => showSatchel(state);
export const openGallery = () => showGallery(state);
export const openCodex = () => showCodex(state);

/** Re-show the current scene's choices (e.g. after the set-piece setting changes). */
export function refreshChoices() {
    if (busy || isTyping()) return;
    const scene = scenes[state.currentSceneId];
    if (scene) renderChoices(scene);
}

// ---------- rendering ----------

function clearChoices() {
    visibleChoices = [];
    els.choices.innerHTML = "";
}

function render(scene, changes) {
    shown = true;
    document.body.dataset.theme = scene.theme || "neutral";
    renderStage(scene, castFor(scene, state));
    const location = locations[scene.location] || {};
    els.sceneHeading.textContent = scene.ending ? `Ending: ${scene.endingTitle}` : (location.name || "");
    audio.setScene(location.realm || scene.theme, location.ambience || "none");
    if (scene.ending) renderEnding(scene, state, { onShowGallery: openGallery });
    else clearEnding();

    clearChoices();
    renderStatus(state);
    renderRelationships(state); // the sidebar stays populated while the text types
    renderProgress(state, scene);
    const act = acts[scene.act];
    els.actPill.textContent = scene.ending ? "Ending" : act ? `${act.title} · ${act.subtitle}` : "";
    renderChanges(getSettings().showChanges ? changes : []);
    renderBreadcrumbs(state.journeySteps, { onJump: jumpTo, onShowAll: openJourney });

    els.sceneText.classList.remove("fade-in");
    void els.sceneText.offsetWidth; // restart the fade animation
    els.sceneText.classList.add("fade-in");
    els.sceneText.parentElement.scrollTop = 0; // new scene starts at the top of its card
    els.skipHint.classList.add("visible");
    els.srLive.textContent = "";

    let text;
    try {
        text = resolveText(scene, state);
    } catch (err) {
        showSceneError(scene, err);
        return;
    }
    showChoicesWaiting(scene);
    typeText(linesFor(text, scene), els.sceneText, () => {
        els.skipHint.classList.remove("visible");
        els.srLive.textContent = stripTags(text);
        renderRelationships(state);
        renderProgress(state, scene);
        renderChoices(scene);
    }, textSpeedMs());
}

/**
 * While the text types, the choices area shows placeholder cards (one per
 * choice to come) so it's clear something will appear there.
 */
function showChoicesWaiting(scene) {
    let count = 3;
    try {
        count = Math.max(1, Math.min(4, choicesFor(scene, state, { setPieces: getSettings().setPieces }).length));
    } catch { /* fall back to three */ }
    els.choices.innerHTML = `
        <div class="choices-waiting" role="status">
            <div class="waiting-head">
                <span class="waiting-dots" aria-hidden="true"><i></i><i></i><i></i></span>
                <span>Your choices will appear here</span>
            </div>
            ${Array.from({ length: count }, (_, i) => `<div class="waiting-card" style="--i:${i}" aria-hidden="true"><span></span><span></span></div>`).join("")}
            <button type="button" class="waiting-skip">Show them now <kbd>Space</kbd></button>
        </div>`;
    els.choices.querySelector(".waiting-skip").addEventListener("click", () => skipTyping());
}

/** Scene text as paragraphs, with spoken lines labelled by speaker. */
function linesFor(text, scene) {
    return splitLines(text, scene.speaker).map(({ text, speaker }) => {
        if (speaker === PLAYER) {
            return { text, speaker: { label: state.player.name || "You", color: "var(--accent)", player: true } };
        }
        const c = speaker && characters[speaker];
        return { text, speaker: c ? { label: c.short || speaker, color: c.color } : null };
    });
}

/** If a scene can't be shown, say so and offer a way back rather than a blank page. */
function showSceneError(scene, err) {
    console.error(`Scene "${scene?.id}" failed to render`, err);
    els.skipHint.classList.remove("visible");
    els.sceneText.textContent = "The Dreamspace hiccups. This page of the story wouldn't open - it's our fault, not yours.";
    els.choices.innerHTML = "";
    const back = document.createElement("button");
    back.type = "button";
    back.className = "choice-btn";
    back.innerHTML = '<span class="choice-number">1</span><span class="choice-body">Go back one step</span>';
    back.addEventListener("click", () => jumpTo(Math.max(0, state.journeySteps.length - 2)));
    els.choices.appendChild(back);
}

function renderChoices(scene) {
    visibleChoices = choicesFor(scene, state, { setPieces: getSettings().setPieces });
    els.choices.innerHTML = "";
    visibleChoices.forEach((entry, i) => {
        const { choice, locked, hint, text } = entry;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice-btn fade-in"
            + (choice.risky ? " risky" : "")
            + (choice.playAgain ? " play-again" : "")
            + (choice.setPiece ? " setpiece-choice" : "")
            + (locked ? " locked" : "");
        btn.style.animationDelay = `${i * 60}ms`;
        btn.disabled = locked;
        const icon = locked
            ? '<i class="fas fa-lock lock-icon" aria-hidden="true"></i>'
            : choice.risky ? '<i class="fas fa-triangle-exclamation risky-icon" title="This choice carries real risk"></i>' : "";
        btn.innerHTML = `
            <span class="choice-number">${i + 1}</span>
            <span class="choice-body">
                <span>${icon}${escapeHtml(text)}</span>
                ${locked && hint ? `<span class="choice-hint">${escapeHtml(hint)}</span>` : ""}
                ${choice.setPiece && !locked ? '<span class="choice-hint"><i class="fas fa-hand-sparkles"></i> Interactive</span>' : ""}
            </span>`;
        if (locked) btn.setAttribute("aria-label", `${text} (locked: ${hint})`);
        btn.addEventListener("click", () => choose(i));
        els.choices.appendChild(btn);
    });
    // The button you pressed has gone; if focus fell back to the page, carry it to the new choices.
    if (document.activeElement === document.body || !document.activeElement) {
        els.choices.querySelector("button:not(:disabled)")?.focus({ preventScroll: true });
    }
}

// ---------- persistence ----------

export async function persist(showToast) {
    const ok = await saves.save(state);
    renderPersistenceNote(saves.persistenceMode);
    if (showToast) showSaveToast(ok);
}

export async function boot() {
    const saved = await saves.load();
    renderPersistenceNote(saves.persistenceMode);
    if (saved) {
        state = saved;
        lastShownAct = highestAct(state, scenes);
        hasSave = true;
    }
    showHome(state, { hasSave });
}

// ---------- start screen ----------

export function openHome() {
    if (busy) return;
    showHome(state, { hasSave });
}

export function continueGame() {
    if (!hasSave) return;
    hideHome();
    if (!shown) render(scenes[state.currentSceneId], []);
}

export async function startNewGame() {
    if (hasSave) {
        const ok = await confirmDialog("Start a new game? Your current journey will be lost (discovered endings and the codex are kept).", "Start again");
        if (!ok) return;
    }
    const player = await askForPlayer(state.player, { submitLabel: hasSave ? "Begin again" : "Sign the register" });
    if (!player) return;
    hideHome();
    newGame(player);
}

export function stopTyping() {
    cancelTyping();
}
