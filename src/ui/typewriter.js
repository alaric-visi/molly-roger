// Typewriter effect. A scene arrives as lines (engine/dialogue.js): each
// becomes a <p>. Spoken lines get the speaker's colour, a name tag, and their
// quoted words set apart from the narration around them. Characters are
// appended to text nodes (cheap), and the whole thing can be skipped instantly.
import { quoteRuns } from "../engine/dialogue.js";

const DEFAULT_SPEED_MS = 20;
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

let timer = null;
let finishNow = null;

export function cancelTyping() {
    if (timer) clearInterval(timer);
    timer = null;
    finishNow = null;
}

/**
 * @param {{ text: string, speaker?: { label: string, color: string, player?: boolean } | null }[] | string} lines
 */
function buildParagraphs(lines) {
    if (typeof lines === "string") lines = lines.split(/\n{2,}/).map(text => ({ text, speaker: null }));
    let previousLabel = null;
    return lines.map(({ text, speaker }) => {
        const p = document.createElement("p");
        const segments = [];
        if (speaker) {
            p.className = "line" + (speaker.player ? " line-player" : "");
            p.style.setProperty("--speaker", speaker.color);
            if (speaker.label === previousLabel) {
                p.classList.add("line-cont"); // same voice again: no repeated tag
            } else {
                const tag = document.createElement("span");
                tag.className = "speaker-tag";
                tag.textContent = speaker.label;
                p.appendChild(tag);
            }
            for (const run of quoteRuns(text)) {
                const span = document.createElement("span");
                span.className = run.quoted ? "said" : "aside";
                const node = document.createTextNode("");
                span.appendChild(node);
                p.appendChild(span);
                segments.push({ node, text: run.text });
            }
        } else {
            const node = document.createTextNode("");
            p.appendChild(node);
            segments.push({ node, text });
        }
        previousLabel = speaker?.label || null;
        return { p, segments };
    });
}

export function typeText(lines, el, onDone, speed = DEFAULT_SPEED_MS) {
    cancelTyping();
    const paragraphs = buildParagraphs(lines);
    el.textContent = "";
    if (paragraphs[0]) el.appendChild(paragraphs[0].p);
    el.classList.add("typing");
    el.setAttribute("aria-busy", "true");

    const finish = () => {
        cancelTyping();
        for (const { p, segments } of paragraphs) {
            for (const s of segments) s.node.data = s.text;
            if (!p.isConnected) el.appendChild(p);
        }
        el.classList.remove("typing");
        el.removeAttribute("aria-busy");
        onDone?.();
    };
    finishNow = finish;

    if (reducedMotion?.matches || speed <= 0) {
        finish();
        return;
    }

    let para = 0;
    let seg = 0;
    let i = 0;
    timer = setInterval(() => {
        const current = paragraphs[para];
        if (!current) return finish();
        const segment = current.segments[seg];
        if (segment && i < segment.text.length) {
            segment.node.appendData(segment.text[i++]);
            return;
        }
        i = 0;
        if (segment && seg < current.segments.length - 1) {
            seg++;
            return;
        }
        seg = 0;
        para++;
        if (para < paragraphs.length) el.appendChild(paragraphs[para].p);
        else finish();
    }, speed);
}

/** Reveal the whole text immediately. Returns true if typing was in progress. */
export function skipTyping() {
    if (!finishNow) return false;
    finishNow();
    return true;
}

export const isTyping = () => finishNow !== null;
