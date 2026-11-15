// Splits a scene's finished (typeset) text into paragraphs and works out who
// is speaking in each, so spoken lines can be styled apart from narration.
//
// Attribution, in order:
//   1. an explicit tag at the start of the paragraph: "@grace: 'Line.'"
//      ("@you:" for the player, "@none:" to force plain narration);
//   2. the first character named, or "you say/ask...", in the narration
//      around the quotes ("'Line,' Grace says.");
//   3. the speaker of the previous paragraph, if that was dialogue too;
//   4. the first character named in the previous paragraph of narration
//      ("Molly stands in the circle..." then "'Ready?'");
//   5. the scene's speaker.
// Pure: shared by the browser, the linter and the tests.
import { characters, characterByKey } from "../story/characters.js";

export const PLAYER = "you";
export const NARRATION = "none";

const TAG = /^@([a-z]+):\s*/;

// Names that identify a character in narration. Longer names first.
const ALIASES = Object.entries(characters)
    .flatMap(([name, c]) => (c.aliases || [name]).map(alias => [alias, name]))
    .sort((a, b) => b[0].length - a[0].length);

const PLAYER_VERB = /\byou (?:say|said|ask|asked|tell|told|whisper|whispered|reply|replied|answer|answered|admit|admitted|manage|managed|murmur|murmured|shout|shouted|call|called|hear yourself say|begin|began|insist|insisted|offer|offered|snap|snapped|mutter|muttered)\b/i;

/** Splits a paragraph into quoted and unquoted runs (after typeset: ‘ … ’). */
export function quoteRuns(paragraph) {
    const runs = [];
    let i = 0;
    let buf = "";
    let inQuote = false;
    const flush = quoted => {
        if (buf) runs.push({ quoted, text: buf });
        buf = "";
    };
    while (i < paragraph.length) {
        const ch = paragraph[i];
        if (!inQuote && ch === "‘") {
            flush(false);
            inQuote = true;
            buf = ch;
        } else if (inQuote && ch === "’" && isClosing(paragraph, i)) {
            buf += ch;
            flush(true);
            inQuote = false;
        } else {
            buf += ch;
        }
        i++;
    }
    flush(inQuote);
    return runs;
}

// A ’ closes a quote when it follows punctuation, ends the paragraph, or is
// followed by punctuation; otherwise it's an apostrophe (don’t, o’ the, plunderin’).
function isClosing(s, i) {
    const before = s[i - 1] || "";
    const after = s[i + 1] || "";
    if (!after || /[\s]/.test(after) && /[.,!?;:…–—)]/.test(before)) return true;
    if (/[.,!?;:…–—)]/.test(after)) return !/[a-z]/i.test(after);
    return false;
}

const isSpoken = runs => runs.some(r => r.quoted && r.text.replace(/[‘’]/g, "").trim().length >= 12);

function speakerIn(narration) {
    let best = null;
    for (const [alias, name] of ALIASES) {
        const m = new RegExp(`\\b${alias.replace(/[-]/g, "\\-")}\\b`).exec(narration);
        if (m && (!best || m.index < best.index)) best = { index: m.index, name };
    }
    const you = PLAYER_VERB.exec(narration);
    if (you && (!best || you.index < best.index)) best = { index: you.index, name: PLAYER };
    return best?.name || null;
}

/**
 * @returns {{ text: string, speaker: string|null }[]} speaker is a character's
 *   display name, PLAYER, or null for narration.
 */
export function splitLines(text, sceneSpeaker = null) {
    let previous = null;
    let lastNamed = null;
    return text.split(/\n{2,}/).map(raw => {
        let paragraph = raw;
        let tagged;
        const tag = TAG.exec(paragraph);
        if (tag) {
            paragraph = paragraph.slice(tag[0].length);
            tagged = tag[1] === NARRATION ? null : tag[1] === PLAYER ? PLAYER : (characterByKey[tag[1]] || null);
        }
        const runs = quoteRuns(paragraph);
        let speaker;
        if (tag) {
            speaker = tagged;
        } else if (!isSpoken(runs)) {
            speaker = null;
        } else {
            const narration = runs.filter(r => !r.quoted).map(r => r.text).join(" ");
            speaker = speakerIn(narration) || previous || lastNamed || sceneSpeaker || null;
        }
        const named = speaker ? null : speakerIn(paragraph);
        lastNamed = named === PLAYER ? null : named;
        previous = speaker;
        return { text: paragraph, speaker };
    });
}

/** Tags used in scene text ("@grace:"), for the linter. */
export function dialogueTags(text) {
    return [...text.matchAll(/(?:^|\n\n)@([a-z]+):/g)].map(m => m[1]);
}

export const validTag = key => key === PLAYER || key === NARRATION || key in characterByKey;

/** The text with any @tags removed (for screen readers and comparisons). */
export const stripTags = text => text.replace(/(^|\n\n)@[a-z]+:\s*/g, "$1");
