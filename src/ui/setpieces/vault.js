// THE ROYAL ALPHABET VAULT - divert the grammar police's searchlights while
// Molly crosses to the Vault door. Outcomes: win | lose
import { clamp } from "./index.js";

const BEAMS = [0.3, 0.55, 0.8];   // where each searchlight is anchored
const SWING = 0.13;               // how far each sweeps either side
const DIVERT_TIME = 1.8;          // seconds a scandal holds a beam's attention
const CATCH_DIST = 0.035;
const SCANDALS = 5;

const SCANDAL_LINES = [
    "A duchess, a tuba and the Archbishop of Canterbury.",
    "The Prince Consort's secret career as a music-hall juggler.",
    "Three cabinet ministers in one very small rowing boat.",
    "The Lord Chancellor's wig, discovered to be a cat.",
    "An entirely fictional affair involving the Royal Mint."
];

export default {
    title: "The Royal Alphabet Vault",
    help: "Molly is crossing to the Vault door. When a searchlight sweeps near her, press its number (<kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>) or click it to project a scandal and turn it away. Scandals are limited - spend them wisely.",

    mount(root, ctx, finish) {
        const fast = ctx.state.flags.has("sea_legs");
        const crossTime = fast ? 6.5 : 8;
        const beamSpeed = ctx.gentle ? 0.6 : 1;
        const catchDist = ctx.gentle ? CATCH_DIST * 0.75 : CATCH_DIST;
        const startScandals = ctx.gentle ? SCANDALS + 2 : SCANDALS;

        root.innerHTML = `
            <div class="sp-vault">
                <div class="sp-lane">
                    <div class="sp-door" aria-hidden="true"></div>
                    ${BEAMS.map((_, i) => `<div class="sp-beam" data-beam="${i}"><span class="sp-beam-cone"></span><span class="sp-beam-spot"></span></div>`).join("")}
                    <div class="sp-path" aria-hidden="true"></div>
                    <div class="sp-molly" aria-label="Molly"><i class="fas fa-skull-crossbones"></i></div>
                    <div class="sp-scandal" aria-live="polite"></div>
                </div>
            </div>
            <div class="sp-actions">
                ${BEAMS.map((_, i) => `<button type="button" class="sp-btn" data-divert="${i}">${i + 1}. Distract light ${i + 1}</button>`).join("")}
            </div>
            <p class="sp-count">Scandals left: <b>${startScandals}</b>${fast ? " &middot; Your sea legs carry you quickly." : ""}</p>`;

        const molly = root.querySelector(".sp-molly");
        const scandalEl = root.querySelector(".sp-scandal");
        const countEl = root.querySelector(".sp-count b");
        const beams = BEAMS.map((anchor, i) => ({
            anchor,
            phase: Math.random() * Math.PI * 2,
            speed: 1.1 + Math.random() * 0.6,
            diverted: 0,
            el: root.querySelector(`[data-beam="${i}"]`),
            btn: root.querySelector(`[data-divert="${i}"]`)
        }));
        let scandals = startScandals;
        let t = 0;
        let last = performance.now();
        let raf = null;
        let lineIndex = 0;

        const divert = i => {
            const b = beams[i];
            if (!b || b.diverted > 0 || scandals <= 0) return;
            scandals--;
            b.diverted = DIVERT_TIME;
            countEl.textContent = scandals;
            scandalEl.textContent = SCANDAL_LINES[lineIndex++ % SCANDAL_LINES.length];
            scandalEl.classList.remove("pop");
            void scandalEl.offsetWidth;
            scandalEl.classList.add("pop");
            ctx.sfx("scandal");
        };

        const loop = now => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            t += dt;
            const mollyX = clamp(0.04 + (t / crossTime) * 0.9, 0, 0.94);
            molly.style.left = `${(mollyX * 100).toFixed(2)}%`;

            for (const b of beams) {
                b.diverted = Math.max(0, b.diverted - dt);
                const x = b.diverted > 0
                    ? b.anchor - 0.22 // swung away, gawping at the scandal
                    : b.anchor + SWING * Math.sin(t * b.speed * beamSpeed + b.phase);
                b.el.style.left = `${(x * 100).toFixed(2)}%`;
                b.el.classList.toggle("diverted", b.diverted > 0);
                b.btn.disabled = b.diverted > 0 || scandals <= 0;
                if (b.diverted <= 0 && Math.abs(x - mollyX) < catchDist) {
                    molly.classList.add("caught");
                    finish("lose", "Caught in the light! Molly snatches what she can - a single comma - and runs.");
                    return;
                }
            }
            if (mollyX >= 0.93) {
                finish("win", "Molly slips through the Vault door like a rumour.");
                return;
            }
            raf = requestAnimationFrame(loop);
        };

        const onKey = e => {
            if (/^[1-3]$/.test(e.key)) {
                e.preventDefault();
                e.stopPropagation();
                divert(Number(e.key) - 1);
            }
        };
        beams.forEach((b, i) => {
            b.btn.addEventListener("click", () => divert(i));
            b.el.addEventListener("click", () => divert(i));
        });
        window.addEventListener("keydown", onKey, true);
        // A short breath before Molly sets off.
        const start = setTimeout(() => { last = performance.now(); raf = requestAnimationFrame(loop); }, 900);

        return () => {
            clearTimeout(start);
            cancelAnimationFrame(raf);
            window.removeEventListener("keydown", onKey, true);
        };
    }
};
