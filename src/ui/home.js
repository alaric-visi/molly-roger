// The start screen: key art, Continue / New game, and the things that carry
// across runs (endings found, codex). Shown at boot and from the header title.
import { els, escapeHtml } from "./dom.js";
import { buildSet } from "../stage/art/locations.js";
import { portraits } from "../stage/art/portraits.js";
import { scenes, acts, endingIds, codex, characters } from "../story/index.js";

let open = false;
let artDrawn = false;

export const isHomeOpen = () => open;

function drawArt() {
    if (artDrawn) return;
    artDrawn = true;
    els.homeScenery.innerHTML = buildSet("conceptual_seas");
    els.homeFigure.innerHTML = portraits["Molly Roger"];
    els.homeFigure.style.color = characters["Molly Roger"].color;
}

/** Where a saved run is, in a few words: "Wren · Act III · The Inquiry". */
function describeRun(state) {
    const scene = scenes[state.currentSceneId];
    if (!scene) return state.player.name;
    if (scene.ending) return `${state.player.name} · Ending: ${scene.endingTitle}`;
    const act = acts[scene.act];
    return [state.player.name, act && `${act.title} · ${act.subtitle}`].filter(Boolean).join(" · ");
}

function endingDots(state) {
    const found = new Set(state.discoveredEndings);
    const dots = endingIds.map(id => `<span class="home-dot${found.has(id) ? " found" : ""}"></span>`).join("");
    const label = found.size
        ? `${found.size} of ${endingIds.length} endings found${state.runs > 1 ? ` · ${state.runs} runs` : ""}`
        : `${endingIds.length} endings to find`;
    return `<div class="home-dots" aria-hidden="true">${dots}</div><span class="home-dots-label">${escapeHtml(label)}</span>`;
}

/**
 * @param {object} state the saved (or fresh) game state
 * @param {{ hasSave: boolean }} opts
 */
export function showHome(state, { hasSave }) {
    drawArt();
    els.homeContinue.hidden = !hasSave;
    els.homeContinueMeta.textContent = hasSave ? describeRun(state) : "";
    els.homeNew.classList.toggle("primary", !hasSave);
    els.homeNewMeta.textContent = hasSave
        ? "Starts over. Endings and the codex are kept."
        : `Choose your name, then begin. There are ${endingIds.length} endings to find.`;
    const codexCount = state.codex?.length || 0;
    els.homeGalleryCount.textContent = `${state.discoveredEndings.length}/${endingIds.length}`;
    els.homeCodexCount.textContent = `${codexCount}/${codex.length}`;
    els.homeEndings.innerHTML = endingDots(state);

    els.home.hidden = false;
    document.querySelector(".app")?.setAttribute("inert", "");
    document.body.classList.add("home-open");
    open = true;
    requestAnimationFrame(() => (hasSave ? els.homeContinue : els.homeNew).focus({ preventScroll: true }));
}

export function hideHome() {
    if (!open) return;
    open = false;
    els.home.hidden = true;
    document.querySelector(".app")?.removeAttribute("inert");
    document.body.classList.remove("home-open");
}
