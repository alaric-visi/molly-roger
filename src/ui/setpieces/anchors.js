// HOLD ON - at the ritual, say your three anchors in order before Molly's
// rising voice drowns you out. Outcomes: held | lost
import { shuffle } from "./index.js";

const ANCHORS = [
    "The street you were born on",
    "The colour of your mother's door",
    "The first thing you ever stole"
];
const DECOYS = [
    "The smell of tar on her hands",
    "The name of her ship",
    "The word for what she is",
    "The sound of the sea",
    "The weight of a cutlass"
];

export default {
    title: "Hold On",
    help: s => (s.flags.has("anchored") || s.flags.has("grace_witness")
        ? "Molly's voice is rising like a tide. Say your anchors in Grace's order - <b>street, door, stolen thing</b> - before it drowns you out. Keys <kbd>1</kbd>-<kbd>6</kbd> work too."
        : "Molly's voice is rising like a tide. Somewhere in it are three things that are only yours. Find them, in the right order, before it drowns you out. Nobody taught you the order - guess, and hold on."),

    mount(root, ctx, finish) {
        const s = ctx.state;
        const anchored = s.flags.has("anchored");
        const witness = s.flags.has("grace_witness");
        const total = (9 + (anchored ? 3 : 0)) * (ctx.reduced || ctx.gentle ? 1.6 : 1);
        let remaining = total;
        let said = 0;
        let tiles = [];
        let last = performance.now();
        let raf = null;

        root.innerHTML = `
            <div class="sp-anchors">
                <div class="sp-tide" aria-hidden="true"><div></div></div>
                <p class="sp-said" aria-live="polite"></p>
                <div class="sp-tiles" role="group" aria-label="Phrases"></div>
                ${witness ? '<p class="sp-witness">Somewhere close, Grace is saying your name.</p>' : ""}
            </div>`;
        const tide = root.querySelector(".sp-tide div");
        const saidEl = root.querySelector(".sp-said");
        const box = root.querySelector(".sp-tiles");

        // Three anchors among three decoys. Each anchor you say leaves the board;
        // if Grace never taught you, the rest reshuffle every time.
        tiles = shuffle([...ANCHORS, ...shuffle(DECOYS).slice(0, 3)]);

        const render = () => {
            box.innerHTML = tiles.map((text, i) => {
                const hint = witness && text === ANCHORS[said];
                return `<button type="button" class="sp-tile${hint ? " hint" : ""}" data-i="${i}"><span class="sp-key">${i + 1}</span>${text}</button>`;
            }).join("");
            box.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => pick(Number(btn.dataset.i))));
            saidEl.textContent = ANCHORS.slice(0, said).map(a => a.replace(/^The /, "")).join(" - ");
        };

        const pick = i => {
            const text = tiles[i];
            if (!text) return;
            if (text === ANCHORS[said]) {
                said++;
                tiles = tiles.filter(t => t !== text);
                if (!anchored) tiles = shuffle(tiles);
                ctx.sfx("anchor");
                if (said === ANCHORS.length) {
                    finish("held", "Street. Door. Stolen thing. You hold on - and your name stays yours.");
                    return;
                }
                render();
            } else {
                remaining -= ctx.gentle ? 1 : 1.8;
                const btn = box.querySelector(`[data-i="${i}"]`);
                btn?.classList.add("wrong");
                ctx.sfx("wrong");
            }
        };

        const loop = now => {
            remaining -= (now - last) / 1000;
            last = now;
            tide.style.width = `${Math.min(100, (1 - remaining / total) * 100)}%`;
            if (remaining <= 0) {
                finish("lost", "The tide comes in over everything. You'll have to hope you're strong enough without them.");
                return;
            }
            raf = requestAnimationFrame(loop);
        };

        const onKey = e => {
            if (/^[1-6]$/.test(e.key)) {
                e.preventDefault();
                e.stopPropagation();
                pick(Number(e.key) - 1);
            }
        };
        window.addEventListener("keydown", onKey, true);
        render();
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("keydown", onKey, true);
        };
    }
};
