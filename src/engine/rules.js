// Pure game rules - no DOM. Shared by the browser runtime and tools/.
//
// EFFECT FIELDS (on a scene = applied on first visit; on a choice = every time):
//   relationshipChanges: { "Grace": 10 }
//   psychicChange: 2        selfChange: -10        suspicionChange: 15
//   setFlags: ["met_vane"]  clearFlags: [...]
//   addItems: ["roger_letters"]  removeItems: [...]
//   counters: { allies: 1 }   (adds to a named counter, checked with "count:allies>=3")

import { emptyRelationships, characters, relationshipNames, items, DEFAULT_PLAYER, epilogues, codex } from "../story/index.js";
import { checkRequirement, evaluate } from "./conditions.js";
import { renderText } from "./text.js";

export const SAVE_VERSION = 5;

/** Interactive set pieces a choice can launch (see ui/setpieces/). */
export const SET_PIECES = ["projection", "vault", "interrogation", "anchors"];
export const SELF_START = 100;
export const SUSPICION_START = 0;

export function createState(player = DEFAULT_PLAYER) {
    return {
        currentSceneId: null,
        psychicLevel: 1,
        self: SELF_START,          // how much of "you" is intact; protects you in a merger
        suspicion: SUSPICION_START, // marks in Inspector Vane's ledger
        currentPath: "Undecided",
        relationships: emptyRelationships(),
        flags: [],
        items: [],
        counters: {},
        visited: [],          // scenes whose entry effects have already been applied
        journeySteps: [],     // [{ sceneId, choiceText, snapshot }]
        discoveredEndings: [], // persists across restarts
        codex: [],             // unlocked codex entries - also persists across restarts
        runs: 0,               // how many playthroughs have been started
        player: { ...DEFAULT_PLAYER, ...player }
    };
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const addUnique = (list, ids) => { for (const id of ids || []) if (!list.includes(id)) list.push(id); };
const removeAll = (list, ids) => list.filter(id => !(ids || []).includes(id));

export function computePath(rel) {
    const molly = rel["Molly Roger"];
    const worthington = rel["Professor Worthington"];
    if (molly > 50 && worthington < 30) return "Rebellion";
    if (worthington > 50 && molly < 30) return "Institutional";
    if (molly > 30 && worthington > 30) return "Balanced";
    return "Undecided";
}

export function applyEffects(state, src) {
    for (const [name, delta] of Object.entries(src.relationshipChanges || {})) {
        if (name in state.relationships) {
            state.relationships[name] = clamp(state.relationships[name] + delta, 0, 100);
        }
    }
    if (src.psychicChange) state.psychicLevel = Math.max(1, state.psychicLevel + src.psychicChange);
    if (src.selfChange) state.self = clamp(state.self + src.selfChange, 0, 100);
    if (src.suspicionChange) state.suspicion = clamp(state.suspicion + src.suspicionChange, 0, 100);
    addUnique(state.flags, src.setFlags);
    state.flags = removeAll(state.flags, src.clearFlags);
    addUnique(state.items, src.addItems);
    state.items = removeAll(state.items, src.removeItems);
    for (const [name, delta] of Object.entries(src.counters || {})) {
        state.counters[name] = (state.counters[name] || 0) + delta;
    }
    state.currentPath = computePath(state.relationships);
}

/** The read-only view handed to dynamic text / nextScene functions. */
export function view(state) {
    return {
        psychicLevel: state.psychicLevel,
        self: state.self,
        suspicion: state.suspicion,
        relationships: { ...state.relationships },
        currentPath: state.currentPath,
        flags: new Set(state.flags),
        items: new Set(state.items),
        counters: { ...state.counters },
        visited: new Set(state.visited),
        player: { ...state.player }
    };
}

/** Effects of picking a choice. Applies every time the choice is taken. */
export function applyChoice(state, choice) {
    applyEffects(state, choice);
}

export function resolveNext(choice, state) {
    return typeof choice.nextScene === "function" ? choice.nextScene(view(state)) : choice.nextScene;
}

/** Epilogue lines that apply to this ending, given everything the player did. */
export function epiloguesFor(scene, state) {
    if (!scene.ending || scene.epilogue === false) return [];
    return epilogues.filter(e => !(e.except || []).includes(scene.id) && evaluate(e.when, state));
}

export function resolveText(scene, state) {
    let raw = typeof scene.text === "function" ? scene.text(view(state)) : scene.text;
    const extra = epiloguesFor(scene, state);
    if (extra.length) raw += "\n\n✦\n\n" + extra.map(e => e.text).join("\n\n");
    return renderText(raw, state);
}

/**
 * A choice may launch a set piece with several `outcomes`, each a choice-like
 * object ({ nextScene, ...effects }). This returns the object to apply.
 */
export function effectiveChoice(choice, outcomeKey) {
    if (!choice.outcomes) return choice;
    const key = outcomeKey || choice.skipOutcome;
    const outcome = choice.outcomes[key];
    if (!outcome) throw new Error(`Choice "${choice.text}" has no outcome "${key}"`);
    return { ...outcome, text: choice.text };
}

/**
 * The choices to show for a scene, with lock state.
 * A choice whose `requires` isn't met is shown greyed out with a hint,
 * unless it has `hideLocked: true`, in which case it is hidden entirely.
 * A choice whose `hideWhen` condition holds is always hidden.
 * With set pieces on, choices marked `plainOnly` are hidden; with them off,
 * choices that launch a `setPiece` are hidden instead.
 */
export function choicesFor(scene, state, { setPieces = false } = {}) {
    return scene.choices
        .filter(choice => !(choice.hideWhen && evaluate(choice.hideWhen, state)))
        .filter(choice => (setPieces ? !choice.plainOnly : !choice.setPiece))
        .map(choice => {
            const { ok, hint } = checkRequirement(choice.requires, state);
            return { choice, locked: !ok, hint: choice.lockedHint || hint, text: renderText(choice.text, state) };
        })
        .filter(c => !(c.locked && c.choice.hideLocked));
}

/**
 * Who stands on stage. `scene.cast` is a list of { who, mood?, pos?, when? };
 * without one, the speaker (if any) stands alone. Entries whose `when`
 * condition fails are left off. Positions default to right, then left.
 */
export function castFor(scene, state) {
    if (scene.ending) return [];
    const list = scene.cast || (scene.speaker ? [{ who: scene.speaker }] : []);
    const used = new Set();
    return list
        .filter(c => !c.when || evaluate(c.when, state))
        .map(c => {
            const pos = c.pos || (used.has("right") ? "left" : "right");
            used.add(pos);
            return { who: c.who, mood: c.mood || null, pos };
        });
}

export function snapshot(state) {
    return {
        psychicLevel: state.psychicLevel,
        self: state.self,
        suspicion: state.suspicion,
        currentPath: state.currentPath,
        relationships: { ...state.relationships },
        flags: [...state.flags],
        items: [...state.items],
        counters: { ...state.counters },
        visited: [...state.visited]
    };
}

/**
 * Enter a scene: apply its entry effects (first visit only, so looping between
 * scenes can't farm stats) and record it in the journey.
 */
export function enterScene(state, scene, choiceText) {
    if (!state.visited.includes(scene.id)) {
        applyEffects(state, scene);
        state.visited.push(scene.id);
    }
    state.currentPath = computePath(state.relationships);
    state.currentSceneId = scene.id;

    if (scene.ending && !state.discoveredEndings.includes(scene.id)) {
        state.discoveredEndings.push(scene.id);
    }

    state.journeySteps.push({ sceneId: scene.id, choiceText: choiceText || null, snapshot: snapshot(state) });
    return unlockCodex(state);
}

/** Unlock any codex entries whose condition now holds. Returns the newly unlocked ids. */
export function unlockCodex(state) {
    const added = [];
    for (const entry of codex) {
        if (state.codex.includes(entry.id)) continue;
        const conditions = Array.isArray(entry.when) ? entry.when : [entry.when];
        if (conditions.some(c => evaluate(c, state))) {
            state.codex.push(entry.id);
            added.push(entry.id);
        }
    }
    return added;
}

/** Start a new playthrough, keeping what carries over between runs. */
export function newRun(previous, player) {
    const state = createState(player);
    state.discoveredEndings = [...(previous?.discoveredEndings || [])];
    state.codex = [...(previous?.codex || [])];
    state.runs = (previous?.runs || 0) + 1;
    // Ghost Memory: after a first ending, Molly half-remembers you.
    if (state.discoveredEndings.length) state.flags.push("ghost_memory");
    return state;
}

/** Rewind to an earlier journey step. */
export function rewindTo(state, index) {
    const step = state.journeySteps[index];
    if (!step) return false;
    const s = step.snapshot;
    state.psychicLevel = s.psychicLevel;
    state.self = s.self ?? SELF_START;
    state.suspicion = s.suspicion ?? SUSPICION_START;
    state.currentPath = s.currentPath;
    state.relationships = { ...emptyRelationships(), ...s.relationships };
    state.flags = [...(s.flags || [])];
    state.items = [...(s.items || [])];
    state.counters = { ...(s.counters || {}) };
    state.visited = [...(s.visited || [])];
    state.journeySteps = state.journeySteps.slice(0, index + 1);
    state.currentSceneId = step.sceneId;
    return true;
}

/** Highest act reached in the journey so far (drives the act title cards). */
export function highestAct(state, scenes) {
    return state.journeySteps.reduce((max, step) => Math.max(max, scenes[step.sceneId]?.act || 0), 0);
}

/** What changed between two snapshots, for the on-screen feedback chips. */
export function describeChanges(before, after) {
    const out = [];
    for (const name of relationshipNames) {
        const d = after.relationships[name] - before.relationships[name];
        if (d) out.push({ kind: "rel", label: characters[name].relationshipLabel, delta: d, color: characters[name].color });
    }
    const num = (key, label, kind) => {
        const d = after[key] - before[key];
        if (d) out.push({ kind, label, delta: d });
    };
    num("self", "Self", "self");
    num("suspicion", "Suspicion", "suspicion");
    num("psychicLevel", "Psychic level", "psychic");
    for (const id of after.items) {
        if (!before.items.includes(id)) out.push({ kind: "item", label: items[id]?.name || id, gained: true });
    }
    for (const id of before.items) {
        if (!after.items.includes(id)) out.push({ kind: "item", label: items[id]?.name || id, gained: false });
    }
    for (const id of after.flags) {
        if (!before.flags.includes(id)) out.push({ kind: "flag", id });
    }
    return out;
}
