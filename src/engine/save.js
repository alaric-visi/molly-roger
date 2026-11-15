// Versioned save/load with a two-tier storage fallback:
//   1. localStorage - the normal case in the browser
//   2. memory only  - private windows / blocked storage
import { SAVE_VERSION, createState } from "./rules.js";
import { scenes, emptyRelationships } from "../story/index.js";

const STORAGE_KEY = "molly-roger-save";

export let persistenceMode = "unknown"; // "local" | "memory"

function hasLocalStorage() {
    try {
        const k = "__molly_roger_probe__";
        localStorage.setItem(k, "1");
        localStorage.removeItem(k);
        return true;
    } catch {
        return false;
    }
}

async function storageSet(key, value) {
    if (hasLocalStorage()) {
        try { localStorage.setItem(key, value); persistenceMode = "local"; return true; } catch { /* fall through */ }
    }
    persistenceMode = "memory";
    return false;
}

async function storageGet(key) {
    if (hasLocalStorage()) {
        persistenceMode = "local";
        try { return localStorage.getItem(key); } catch { return null; }
    }
    persistenceMode = "memory";
    return null;
}

export function serialise(state) {
    return JSON.stringify({ version: SAVE_VERSION, ...state });
}

/** Upgrade older save formats. Returns null if the data can't be used. */
export function migrate(data) {
    if (!data || typeof data !== "object") return null;
    const version = data.version || 1;

    if (version < 2) {
        // v1 (the single-file build): no Inspector Vane bar, no visited list,
        // journey steps carried a label, discoveredEndings was an array.
        const fill = rel => ({ ...emptyRelationships(), ...(rel || {}) });
        data.relationships = fill(data.relationships);
        data.journeySteps = (data.journeySteps || []).map((step, i, all) => ({
            sceneId: step.sceneId,
            choiceText: step.choiceText || null,
            snapshot: {
                ...step.snapshot,
                relationships: fill(step.snapshot?.relationships),
                visited: all.slice(0, i + 1).map(s => s.sceneId)
            }
        }));
        data.visited = data.journeySteps.map(s => s.sceneId);
        data.version = 2;
    }

    if (data.version < 3) {
        // v2 -> v3: Self, Suspicion, flags, items and player identity.
        // Older runs start with full Self, a clean ledger and the default identity.
        const fresh = createState();
        const upgrade = snap => ({
            self: fresh.self,
            suspicion: fresh.suspicion,
            flags: [],
            items: [],
            ...snap
        });
        Object.assign(data, upgrade(data));
        data.player = data.player || fresh.player;
        data.journeySteps = data.journeySteps.map(step => ({ ...step, snapshot: upgrade(step.snapshot) }));
        data.version = 3;
    }

    if (data.version < 4) {
        // v3 -> v4: story counters, and new relationship bars (Pip).
        data.counters = data.counters || {};
        data.journeySteps = data.journeySteps.map(step => ({ ...step, snapshot: { counters: {}, ...step.snapshot } }));
        data.version = 4;
    }

    if (data.version < 5) {
        // v4 -> v5: codex and run count.
        data.codex = data.codex || [];
        data.runs = data.runs || 1;
        data.version = 5;
    }

    // Always top up relationships, so adding a character never breaks a save.
    const fill = rel => ({ ...emptyRelationships(), ...(rel || {}) });
    data.relationships = fill(data.relationships);
    data.journeySteps = data.journeySteps.map(step => ({ ...step, snapshot: { ...step.snapshot, relationships: fill(step.snapshot?.relationships) } }));

    const state = { ...createState(), ...data };
    delete state.version;

    // Drop the save if it points at a scene that no longer exists.
    if (!scenes[state.currentSceneId]) return null;
    state.journeySteps = state.journeySteps.filter(s => scenes[s.sceneId]);
    state.discoveredEndings = (state.discoveredEndings || []).filter(id => scenes[id]);
    return state;
}

export async function save(state) {
    return storageSet(STORAGE_KEY, serialise(state));
}

export async function load() {
    const raw = await storageGet(STORAGE_KEY);
    if (!raw) return null;
    try {
        return migrate(JSON.parse(raw));
    } catch (e) {
        console.warn("Saved data was unreadable; starting fresh.", e);
        return null;
    }
}
