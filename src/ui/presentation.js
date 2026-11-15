// Act title cards (with curtains) and the ending presentation.
import { els, escapeHtml } from "./dom.js";
import { acts, relationshipNames, characters, endingIds, items } from "../story/index.js";
import { evaluate } from "../engine/conditions.js";

const wait = ms => new Promise(r => setTimeout(r, ms));
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

export async function showActTransition(actNumber) {
    const info = acts[actNumber];
    if (!info) return;
    els.actTitle.textContent = info.title;
    els.actSubtitle.textContent = info.subtitle;
    els.actTransition.classList.add("visible");
    await wait(reducedMotion?.matches ? 1400 : 2400);
    els.actTransition.classList.remove("visible");
    await wait(reducedMotion?.matches ? 50 : 750);
}

export function renderEnding(scene, state, { onShowGallery } = {}) {
    els.stage.classList.add("ending-panel");
    els.endingEyebrow.hidden = false;
    els.endingTitle.hidden = false;
    els.endingTitle.textContent = scene.endingTitle || "The end";

    const row = (label, value) =>
        `<div class="ending-summary-row"><span class="ending-summary-label">${escapeHtml(label)}</span><span class="ending-summary-value">${escapeHtml(value)}</span></div>`;

    els.endingSummary.innerHTML = [
        row("Path", state.currentPath),
        row("Psychic level", state.psychicLevel),
        row("Self", `${state.self}%`),
        row("Marks in Vane's ledger", state.suspicion),
        row("Items found", `${state.items.length} of ${Object.keys(items).length}`),
        row("Choices made", Math.max(0, state.journeySteps.length - 1)),
        ...relationshipNames.filter(n => !characters[n].revealWhen || evaluate(characters[n].revealWhen, state)).map(n => row(characters[n].relationshipLabel, `${state.relationships[n]}%`)),
        `<div class="ending-discovered">${state.discoveredEndings.length} of ${endingIds.length} endings discovered
            <button type="button" data-show-gallery>View the cards</button></div>`
    ].join("");
    els.endingSummary.hidden = false;
    els.endingSummary.querySelector("[data-show-gallery]")?.addEventListener("click", onShowGallery);
}

export function clearEnding() {
    els.stage.classList.remove("ending-panel");
    els.endingEyebrow.hidden = true;
    els.endingTitle.hidden = true;
    els.endingSummary.hidden = true;
}
