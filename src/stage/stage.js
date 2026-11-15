// The stage controller: scenery crossfades, parallax, scene-change effects,
// cast staging and the ending card.
import { buildSet } from "./art/locations.js";
import { portraits, castDefaults } from "./art/portraits.js";
import { endingCard } from "./art/endingCards.js";
import { createParticles } from "./particles.js";
import { locations, characters, endingIds } from "../story/index.js";
import { els } from "../ui/dom.js";

const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
const TRANSITION_FOR_REALM = { dream: "tear", institution: "ink", neutral: "glow" };

let particles = null;
let currentSet = null;
let currentRealm = null;
let parallax = { x: 0, y: 0 };

export function initStage() {
    particles = createParticles(els.stageParticles);

    els.stage.addEventListener("pointermove", e => {
        const r = els.stage.getBoundingClientRect();
        parallax = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 };
        applyParallax();
    });
    els.stage.addEventListener("pointerleave", () => {
        parallax = { x: 0, y: 0 };
        applyParallax();
    });
}

function applyParallax() {
    if (reducedMotion?.matches) return;
    const { x, y } = parallax;
    els.stageScenery.querySelectorAll(".scenery-frame.shown .layer").forEach(g => {
        const d = Number(g.dataset.depth) || 0;
        g.style.transform = `translate(${(-x * d * 24).toFixed(1)}px, ${(-y * d * 8).toFixed(1)}px)`;
    });
    els.stageCast.style.transform = `translate(${(-x * 12).toFixed(1)}px, ${(-y * 3).toFixed(1)}px)`;
}

function playTransition(kind) {
    if (reducedMotion?.matches) return;
    const el = els.stageTransition;
    el.className = "stage-transition";
    void el.offsetWidth; // restart the animation
    el.classList.add(kind);
}

function showScenery(location) {
    const key = `${location.set}:${location.variant || ""}`;
    if (key === currentSet) return;

    const frame = document.createElement("div");
    frame.className = "scenery-frame";
    frame.innerHTML = buildSet(location.set, location.variant);
    const old = [...els.stageScenery.children];
    els.stageScenery.appendChild(frame);
    requestAnimationFrame(() => requestAnimationFrame(() => {
        frame.classList.add("shown");
        applyParallax();
    }));
    old.forEach(f => {
        f.classList.remove("shown");
        setTimeout(() => f.remove(), 1000);
    });

    if (currentSet !== null) {
        playTransition(location.realm !== currentRealm ? TRANSITION_FOR_REALM[location.realm] || "glow" : "glow");
    }
    currentSet = key;
    currentRealm = location.realm;
}

/** Update the cast in place so characters who stay on stage don't re-enter. */
function showCast(cast, speaker) {
    const keep = new Set();
    for (const member of cast) {
        const key = `${member.who}@${member.pos}`;
        keep.add(key);
        const defaults = castDefaults[member.who] || {};
        const mood = member.mood || defaults.mood || "neutral";
        const color = characters[member.who]?.color || "#ffffff";

        let el = els.stageCast.querySelector(`[data-key="${CSS.escape(key)}"]`);
        if (el && el._leaving) {
            // They were on their way off - call them back instead of letting the timer remove them.
            clearTimeout(el._leaving);
            el._leaving = null;
            el.style.opacity = "";
        }
        if (!el) {
            el = document.createElement("div");
            el.dataset.key = key;
            el.innerHTML = `<div class="figure">${portraits[member.who] || ""}</div>`;
            el.style.setProperty("--char", color);
            el.style.color = color;
            el.setAttribute("aria-hidden", "true");
            els.stageCast.appendChild(el);
        }
        el.className = [
            "cast-member",
            `pos-${member.pos}`,
            `mood-${mood}`,
            defaults.projection ? "projection" : "",
            speaker && member.who !== speaker ? "listening" : ""
        ].filter(Boolean).join(" ");
    }
    [...els.stageCast.children].forEach(el => {
        if (!keep.has(el.dataset.key) && !el._leaving) {
            el.style.opacity = "0";
            el._leaving = setTimeout(() => el.remove(), 450);
        }
    });
}

/**
 * Render the stage for a scene.
 * cast: from rules.castFor(); ending: the scene if it's an ending, else null.
 */
export function renderStage(scene, cast) {
    const location = locations[scene.location] || { set: "dreamspace", realm: "dream", ambience: "dream" };
    showScenery(location);
    particles.set(location.ambience || "none");

    els.stageLocation.textContent = location.name || "";
    els.stageSpeaker.textContent = scene.ending ? "" : (scene.speaker || "");
    showCast(cast, scene.speaker);

    if (scene.ending) {
        const index = endingIds.indexOf(scene.id);
        els.stageCard.innerHTML = endingCard(scene.id, index, scene.endingTitle);
    } else {
        els.stageCard.innerHTML = "";
    }
}
