// INSPECTOR VANE'S QUESTIONS - three questions; choose which thought to let her
// see. Time per question depends on Self and Suspicion.
// Outcomes: perfect | fair | poor
import { clamp, shuffle } from "./index.js";

function rounds(s) {
    return [
        {
            q: "Where were you on the night the letter was taken?",
            thoughts: [
                { text: "The dormitory clock, ticking", value: 2 },
                { text: "The sound of the sea, very far off", value: 1 },
                { text: "Molly laughing at the Vault door", value: 0 }
            ]
        },
        {
            q: "Who is Molly Roger?",
            thoughts: [
                { text: "A name from an old story", value: 2 },
                { text: "A voice I hear sometimes", value: 1 },
                { text: s.flags.has("promised_molly") ? "Someone I promised" : "My friend. My captain.", value: 0 }
            ]
        },
        {
            q: "And what is it you want, {name}?",
            thoughts: [
                { text: "To pass my examinations", value: 2 },
                { text: "To understand my Sight", value: 1 },
                { text: s.flags.has("pip_friend") ? "To keep Pip and Admiral away from you" : "To help her become real", value: 0 }
            ]
        }
    ];
}

const REACTION = [
    "Her pencil moves for a long time.",
    "Her pencil moves, once.",
    "Her pencil doesn't move at all."
];

export default {
    title: "Inspector Vane's Questions",
    help: "Vane asks; you choose which thought to let her see. The truest thought always pushes forward. Pick the safest before time runs out - <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> work too.",

    mount(root, ctx, finish) {
        const s = ctx.state;
        const seconds = clamp(4 + (s.self - 50) / 25 - s.suspicion / 50, 2.5, 7) * (ctx.reduced || ctx.gentle ? 1.6 : 1);
        const all = rounds(s);
        let round = 0;
        let score = 0;
        let timer = null;
        let raf = null;
        let locked = false;

        root.innerHTML = `
            <div class="sp-interrogation">
                <p class="sp-question"></p>
                <div class="sp-thoughts" role="group" aria-label="Thoughts"></div>
                <div class="sp-timer" role="progressbar" aria-label="Time remaining"><div></div></div>
                <p class="sp-reaction" aria-live="polite"></p>
                <div class="sp-pips" aria-hidden="true">${all.map(() => "<span></span>").join("")}</div>
            </div>`;
        const qEl = root.querySelector(".sp-question");
        const box = root.querySelector(".sp-thoughts");
        const bar = root.querySelector(".sp-timer div");
        const reaction = root.querySelector(".sp-reaction");
        const pips = [...root.querySelectorAll(".sp-pips span")];
        let current = [];

        const answer = value => {
            if (locked) return;
            locked = true;
            clearTimeout(timer);
            cancelAnimationFrame(raf);
            score += Math.max(0, value);
            pips[round].className = ["bad", "mid", "good"][Math.max(0, value)];
            reaction.textContent = value < 0 ? "You hesitate. She writes that down too." : REACTION[value];
            ctx.sfx("quill");
            round++;
            setTimeout(next, 1000);
        };

        const next = () => {
            if (round >= all.length) {
                if (score >= 5) finish("perfect", "Vane closes the ledger. 'Thank you. That will be all.'");
                else if (score >= 3) finish("fair", "'Dreams,' Vane says, 'are not yet an offence.'");
                else finish("poor", "Vane writes for a long time. 'You're a poor liar,' she says, not unkindly.");
                return;
            }
            locked = false;
            const r = all[round];
            qEl.textContent = `'${r.q.replace("{name}", s.player?.name || "")}'`;
            reaction.textContent = "";
            current = shuffle(r.thoughts);
            box.innerHTML = current.map((th, i) =>
                `<button type="button" class="sp-thought${th.value === 0 ? " intrusive" : ""}" data-i="${i}" style="--d:${(Math.random() * 2).toFixed(2)}s">
                    <span class="sp-key">${i + 1}</span>${th.text}</button>`).join("");
            box.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => answer(current[Number(btn.dataset.i)].value)));
            box.querySelector("button").focus();

            const start = performance.now();
            const tick = now => {
                const left = 1 - (now - start) / (seconds * 1000);
                bar.style.width = `${Math.max(0, left * 100)}%`;
                if (left > 0) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            timer = setTimeout(() => answer(-1), seconds * 1000); // -1 = hesitated
        };

        const onKey = e => {
            if (/^[1-3]$/.test(e.key) && current[Number(e.key) - 1]) {
                e.preventDefault();
                e.stopPropagation();
                answer(current[Number(e.key) - 1].value);
            }
        };
        window.addEventListener("keydown", onKey, true);
        next();

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(raf);
            window.removeEventListener("keydown", onKey, true);
        };
    }
};
