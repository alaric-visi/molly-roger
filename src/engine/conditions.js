// Condition strings, used by `requires` on choices and by [[if ...]] in text.
//
//   flag:met_vane          item:roger_letters        visited:meet_roger
//   rel:grace>=40          self<50                   suspicion>=75      psychic>=8
//   count:allies>=3        (story counters, see `counters` effect)
//   endings>=6             (endings discovered across all playthroughs)
//   !flag:met_vane         (prefix ! to negate)
//   item:grace_photo & rel:grace>=30                  (& means AND)
//
// All functions take the raw game state.

import { characterByKey, characters, items } from "../story/index.js";

const OPS = {
    ">=": (a, b) => a >= b,
    "<=": (a, b) => a <= b,
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
    "==": (a, b) => a === b,
    "!=": (a, b) => a !== b
};

const SET_RE = /^(flag|item|visited):([\w-]+)$/;
const NUM_RE = /^(?:rel:(\w+)|count:(\w+)|(self|suspicion|psychic|endings))\s*(>=|<=|==|!=|>|<)\s*(-?\d+)$/;

/** Parse one atom into a structured form (throws on bad syntax). */
export function parseAtom(raw) {
    let atom = raw.trim();
    let negate = false;
    if (atom.startsWith("!")) {
        negate = true;
        atom = atom.slice(1).trim();
    }
    let m = atom.match(SET_RE);
    if (m) return { negate, kind: m[1], id: m[2] };
    m = atom.match(NUM_RE);
    if (m) {
        if (m[1] && !characterByKey[m[1]]) throw new Error(`Unknown character key "${m[1]}" in "${raw}"`);
        const kind = m[1] ? "rel" : m[2] ? "count" : m[3];
        const id = m[1] ? characterByKey[m[1]] : m[2] || null;
        return { negate, kind, id, op: m[4], value: Number(m[5]) };
    }
    throw new Error(`Can't understand condition "${raw}"`);
}

export const parseCondition = expr => expr.split("&").map(parseAtom);

function numberFor(atom, state) {
    switch (atom.kind) {
        case "rel": return state.relationships[atom.id] ?? 0;
        case "count": return state.counters?.[atom.id] ?? 0;
        case "self": return state.self;
        case "suspicion": return state.suspicion;
        case "psychic": return state.psychicLevel;
        case "endings": return (state.discoveredEndings || []).length;
    }
}

function atomHolds(atom, state) {
    let result;
    if (atom.kind === "flag") result = state.flags.includes(atom.id);
    else if (atom.kind === "item") result = state.items.includes(atom.id);
    else if (atom.kind === "visited") result = state.visited.includes(atom.id);
    else result = OPS[atom.op](numberFor(atom, state), atom.value);
    return atom.negate ? !result : result;
}

export function evaluate(expr, state) {
    return parseCondition(expr).every(atom => atomHolds(atom, state));
}

/** Human-readable reason an atom isn't met, for locked-choice hints. */
function describe(atom) {
    const sym = { ">=": "at least", "<=": "at most", ">": "above", "<": "below", "==": "exactly", "!=": "not" }[atom.op];
    switch (atom.kind) {
        case "item": return atom.negate ? `Without ${items[atom.id]?.name || atom.id}` : `Requires ${items[atom.id]?.name || atom.id}`;
        case "rel": return `${characters[atom.id].relationshipLabel}'s trust ${sym} ${atom.value}`;
        case "self": return `Self ${sym} ${atom.value}`;
        case "suspicion": return `Suspicion ${sym} ${atom.value}`;
        case "psychic": return `Psychic level ${sym} ${atom.value}`;
        case "count": return atom.id === "allies" ? `Needs ${atom.value} allies` : "Not yet";
        case "endings": return `Discover ${atom.value} endings first`;
        default: return atom.negate ? "Not possible right now" : "Something you haven't discovered yet";
    }
}

/** { ok, hint } for a choice's `requires` string. */
export function checkRequirement(expr, state) {
    if (!expr) return { ok: true, hint: "" };
    const failing = parseCondition(expr).filter(atom => !atomHolds(atom, state));
    return { ok: failing.length === 0, hint: [...new Set(failing.map(describe))].join(" · ") };
}

// [[if COND]] yes [[else]] no [[/if]] - innermost blocks are resolved first, so nesting works.
const IF_BLOCK = /\[\[if ([^\]]+)\]\]((?:(?!\[\[if )[\s\S])*?)\[\[\/if\]\]/;

export function renderConditionals(text, state) {
    let prev;
    do {
        prev = text;
        text = text.replace(IF_BLOCK, (_, expr, body) => {
            const [yes, no = ""] = body.split("[[else]]");
            return evaluate(expr, state) ? yes : no;
        });
    } while (text !== prev);
    return text;
}

/** Every condition string used inside [[if]] blocks (for the linter). */
export function conditionsInText(text) {
    return [...text.matchAll(/\[\[if ([^\]]+)\]\]/g)].map(m => m[1]);
}
