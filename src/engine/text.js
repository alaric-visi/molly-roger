// Turns authored scene text into what the player reads:
// [[if]] blocks -> {tokens} -> tidy whitespace and punctuation.
import { renderConditionals } from "./conditions.js";
import { ADDRESS_OPTIONS, PRONOUN_OPTIONS, DEFAULT_PLAYER, TOKENS } from "../story/index.js";

function tokenValue(token, player) {
    const p = { ...DEFAULT_PLAYER, ...player };
    if (token === "name") return p.name || DEFAULT_PLAYER.name;
    if (token === "lass") return (ADDRESS_OPTIONS[p.address] || ADDRESS_OPTIONS.lass).word;
    const pronouns = PRONOUN_OPTIONS[p.pronouns] || PRONOUN_OPTIONS.they;
    return pronouns[token];
}

const capitalise = s => s.charAt(0).toUpperCase() + s.slice(1);

export function applyTokens(text, player) {
    return text.replace(/\{(\w+)\}/g, (match, raw) => {
        const token = raw.charAt(0).toLowerCase() + raw.slice(1);
        if (!TOKENS.includes(token)) return match;
        const value = tokenValue(token, player);
        return raw.charAt(0) === raw.charAt(0).toUpperCase() ? capitalise(value) : value;
    });
}

/** Unknown {tokens} in a string (for the linter). */
export function unknownTokens(text) {
    return [...text.matchAll(/\{(\w+)\}/g)]
        .map(m => m[1].charAt(0).toLowerCase() + m[1].slice(1))
        .filter(t => !TOKENS.includes(t));
}

/** Puts back a missing space after sentence punctuation ("end.Next" -> "end. Next"). */
export function tidyPunctuation(text) {
    return text
        .replace(/([.!?])([A-Za-z])/g, "$1 $2")
        .replace(/([.!?]')([A-Za-z])/g, "$1 $2")
        .replace(/([.!?]"\s*)([A-Za-z])/g, "$1 $2");
}

/**
 * Book typography for display: curly quotes and apostrophes, en-dashes and
 * ellipses. Scene files keep plain keyboard punctuation; this runs last.
 */
export function typeset(text) {
    return text
        .replace(/\.\.\./g, "…")
        .replace(/(^|\n)- /g, "$1– ")                                   // "- The Captain." signatures
        .replace(/ - /g, " – ")                                          // spaced dashes
        .replace(/(^|[\s(])'(?=(em|tis|twas|til|cause|n)\b|\d)/g, "$1’")  // 'em, '21: apostrophes, not quotes
        .replace(/(^|[\s(\[–—“])'/g, "$1‘")               // opening single quotes
        .replace(/'/g, "’")                                              // closing quotes and apostrophes
        .replace(/(^|[\s(\[–—‘])"/g, "$1“")
        .replace(/"/g, "”");
}

export function renderText(raw, state) {
    let text = renderConditionals(raw, state);
    text = applyTokens(text, state.player);
    text = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    return typeset(tidyPunctuation(text));
}
