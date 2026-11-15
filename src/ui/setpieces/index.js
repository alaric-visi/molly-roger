// Runs an interactive set piece in place of the choice list and resolves with
// an outcome key (one of the launching choice's `outcomes`).
import projection from "./projection.js";
import vault from "./vault.js";
import interrogation from "./interrogation.js";
import anchors from "./anchors.js";

const PIECES = { projection, vault, interrogation, anchors };

const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

/**
 * @param {string} type        set piece id
 * @param {HTMLElement} host   container to draw into (the choices area)
 * @param {object} opts        { state: rules.view(), skipOutcome, sfx(name) }
 * @returns {Promise<string>}  outcome key
 */
export function runSetPiece(type, host, { state, skipOutcome, sfx = () => {}, gentle = false }) {
    const piece = PIECES[type];
    if (!piece) return Promise.resolve(skipOutcome);

    return new Promise(resolve => {
        host.innerHTML = `
            <section class="setpiece" aria-label="${piece.title}">
                <header class="sp-head">
                    <h3 class="sp-title">${piece.title}</h3>
                    <p class="sp-help">${typeof piece.help === "function" ? piece.help(state) : piece.help}</p>
                </header>
                <div class="sp-body"></div>
                <p class="sp-result" aria-live="assertive"></p>
                <footer class="sp-foot">
                    <button type="button" class="sp-skip">Skip - decide for me</button>
                </footer>
            </section>`;
        const body = host.querySelector(".sp-body");
        const result = host.querySelector(".sp-result");
        let finished = false;
        let cleanup = () => {};

        const finish = (key, message) => {
            if (finished) return;
            finished = true;
            cleanup();
            host.querySelector(".sp-skip").disabled = true;
            if (message) {
                result.textContent = message;
                result.classList.add("shown");
            }
            sfx(key === skipOutcome ? "choice" : "setpiece");
            setTimeout(() => {
                host.innerHTML = "";
                resolve(key);
            }, message ? 1500 : 0);
        };

        host.querySelector(".sp-skip").addEventListener("click", () => finish(skipOutcome));

        // Nothing starts until the player is ready.
        body.innerHTML = `<div class="sp-ready"><button type="button" class="sp-btn primary sp-begin">Begin</button></div>`;
        const begin = body.querySelector(".sp-begin");
        begin.addEventListener("click", () => {
            if (finished) return;
            cleanup = piece.mount(body, { state, reduced: !!reducedMotion?.matches, sfx, gentle }, finish) || (() => {});
            body.querySelector("button")?.focus();
        }, { once: true });
        begin.focus();
    });
}

// ---------- small shared helpers ----------
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};
