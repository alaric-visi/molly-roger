// THE EXAMINATION - keep the cube a cube against a wind that wants a sail.
// Outcomes: cube | sail | still
import { clamp } from "./index.js";

const CUBE = [[100, 30], [140, 50], [140, 95], [100, 115], [60, 95], [60, 50]];
const SAIL = [[98, 12], [152, 74], [146, 106], [100, 112], [95, 64], [97, 28]];
const BRASS = [201, 162, 39];
const VIOLET = [155, 130, 255];
const DURATION = 6;

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

export default {
    title: "The Examination",
    help: "Press and hold <b>Focus</b> (or hold <kbd>Space</kbd>) to keep the cube a cube. The wind wants a sail. You don't have to fight it.",

    mount(root, ctx, finish) {
        root.innerHTML = `
            <div class="sp-projection">
                <svg viewBox="0 0 200 130" class="sp-shape" aria-hidden="true">
                    <polygon class="sp-poly"/>
                    <g class="sp-edges"><line x1="100" y1="72" x2="100" y2="115"/><line x1="100" y1="72" x2="60" y2="50"/><line x1="100" y1="72" x2="140" y2="50"/></g>
                </svg>
                <div class="sp-gauge" aria-hidden="true">
                    <span>Cube</span><div class="sp-gauge-track"><div class="sp-gauge-mark"></div></div><span>Sail</span>
                </div>
                <div class="sp-timer" role="progressbar" aria-label="Time remaining"><div></div></div>
            </div>
            <div class="sp-actions">
                <button type="button" class="sp-btn primary" data-hold>Focus (hold)</button>
                <button type="button" class="sp-btn" data-sail>Let it become something else</button>
                <button type="button" class="sp-btn" data-still>Make nothing at all</button>
            </div>`;

        const poly = root.querySelector(".sp-poly");
        const edges = root.querySelector(".sp-edges");
        const mark = root.querySelector(".sp-gauge-mark");
        const timer = root.querySelector(".sp-timer div");
        const holdBtn = root.querySelector("[data-hold]");

        let m = 0.15;          // 0 = cube, 1 = sail
        let holding = false;
        let t = 0;
        let last = performance.now();
        const late = [];       // samples from the second half
        let raf = null;

        const draw = () => {
            const pts = CUBE.map((p, i) => [p[0] + (SAIL[i][0] - p[0]) * m, p[1] + (SAIL[i][1] - p[1]) * m]);
            poly.setAttribute("points", pts.map(p => p.map(n => n.toFixed(1)).join(",")).join(" "));
            const [r, g, b] = mix(BRASS, VIOLET, m);
            poly.style.fill = `rgba(${r},${g},${b},0.18)`;
            poly.style.stroke = `rgb(${r},${g},${b})`;
            edges.style.opacity = Math.max(0, 1 - m * 1.6).toFixed(2);
            edges.style.stroke = `rgb(${r},${g},${b})`;
            mark.style.left = `${(m * 100).toFixed(1)}%`;
            timer.style.width = `${Math.max(0, 100 - (t / DURATION) * 100)}%`;
        };

        const loop = now => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            t += dt;
            // The wind gusts; focusing pushes back.
            const wind = (0.3 + 0.22 * Math.sin(t * 2.3) + 0.14 * Math.sin(t * 5.7 + 1)) * (ctx.gentle ? 0.6 : 1);
            m = clamp(m + (holding ? -0.8 : wind) * dt, 0, 1);
            if (t > DURATION / 2) late.push(m);
            draw();
            if (t >= DURATION) {
                const avg = late.reduce((a, b) => a + b, 0) / Math.max(1, late.length);
                if (avg < 0.45) finish("cube", "Six faces. Twelve edges. No opinions. Worthington nods.");
                else finish("sail", "It billows. For one heartbeat the whole hall smells of the sea.");
                return;
            }
            raf = requestAnimationFrame(loop);
        };

        const hold = on => {
            holding = on;
            holdBtn.classList.toggle("active", on);
        };
        const onKey = e => {
            if (e.code !== "Space") return;
            e.preventDefault();
            hold(e.type === "keydown");
        };

        holdBtn.addEventListener("pointerdown", () => hold(true));
        holdBtn.addEventListener("pointerup", () => hold(false));
        holdBtn.addEventListener("pointerleave", () => hold(false));
        window.addEventListener("keydown", onKey);
        window.addEventListener("keyup", onKey);
        root.querySelector("[data-sail]").addEventListener("click", () => finish("sail", "You stop holding on. The cube loosens, and catches a wind that isn't blowing."));
        root.querySelector("[data-still]").addEventListener("click", () => finish("still", "You let the air stay empty, and in the quiet you hear someone humming."));

        draw();
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("keyup", onKey);
        };
    }
};
