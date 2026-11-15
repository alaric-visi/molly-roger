#!/usr/bin/env node
// Checks the story data for mistakes before a build.
//   npm run lint:story
// Errors fail the build; warnings are printed only.

import {
    scenes, characters, locations, acts, crew, items, flags, epilogues, codex, CODEX_SECTIONS, START_SCENE, relationshipNames, DEFAULT_PLAYER
} from "../src/story/index.js";
import { parseCondition, conditionsInText } from "../src/engine/conditions.js";
import { unknownTokens } from "../src/engine/text.js";
import { dialogueTags, validTag } from "../src/engine/dialogue.js";
import { createState, view, SET_PIECES } from "../src/engine/rules.js";
import { sets } from "../src/stage/art/locations.js";
import { portraits, MOODS } from "../src/stage/art/portraits.js";
import { AMBIENCES } from "../src/story/locations.js";

const errors = [];
const warnings = [];
const err = (id, msg) => errors.push(`  ✗ [${id}] ${msg}`);
const warn = (id, msg) => warnings.push(`  ! [${id}] ${msg}`);

const THEMES = new Set(["institution", "dream", "neutral"]);
const SCENE_KEYS = new Set([
    "id", "act", "theme", "location", "speaker", "cast", "text", "choices", "ending", "endingTitle", "hint",
    "relationshipChanges", "psychicChange", "selfChange", "suspicionChange",
    "setFlags", "clearFlags", "addItems", "removeItems", "counters", "epilogue"
]);
const CHOICE_KEYS = new Set([
    "text", "nextScene", "targets", "risky", "requires", "hideLocked", "hideWhen", "lockedHint", "playAgain",
    "setPiece", "outcomes", "skipOutcome", "plainOnly",
    "relationshipChanges", "psychicChange", "selfChange", "suspicionChange",
    "setFlags", "clearFlags", "addItems", "removeItems", "counters"
]);

const OUTCOME_KEYS = new Set([
    "nextScene", "targets", "relationshipChanges", "psychicChange", "selfChange", "suspicionChange",
    "setFlags", "clearFlags", "addItems", "removeItems", "counters"
]);

// Flags the engine sets itself rather than a scene (see rules.newRun).
const ENGINE_FLAGS = ["ghost_memory"];
const flagsSet = new Set(ENGINE_FLAGS);
const flagsRead = new Set();
const itemsGiven = new Set();
const itemsRead = new Set();

function checkEffects(id, where, src) {
    for (const name of Object.keys(src.relationshipChanges || {})) {
        if (!relationshipNames.includes(name)) err(id, `${where} changes unknown relationship "${name}"`);
    }
    for (const f of [...(src.setFlags || []), ...(src.clearFlags || [])]) {
        if (!flags[f]) err(id, `${where} uses undeclared flag "${f}" (add it to flags.js)`);
    }
    (src.setFlags || []).forEach(f => flagsSet.add(f));
    for (const i of [...(src.addItems || []), ...(src.removeItems || [])]) {
        if (!items[i]) err(id, `${where} uses unknown item "${i}" (add it to items.js)`);
    }
    (src.addItems || []).forEach(i => itemsGiven.add(i));
}

function checkCondition(id, where, expr) {
    let atoms;
    try {
        atoms = parseCondition(expr);
    } catch (e) {
        err(id, `${where}: ${e.message}`);
        return;
    }
    for (const a of atoms) {
        if (a.kind === "flag") { flagsRead.add(a.id); if (!flags[a.id]) err(id, `${where} checks undeclared flag "${a.id}"`); }
        if (a.kind === "item") { itemsRead.add(a.id); if (!items[a.id]) err(id, `${where} checks unknown item "${a.id}"`); }
        if (a.kind === "visited" && !scenes[a.id]) err(id, `${where} checks visited:"${a.id}", which isn't a scene`);
    }
}

function checkText(id, where, text) {
    if (typeof text !== "string") return;
    for (const expr of conditionsInText(text)) checkCondition(id, `${where} [[if ${expr}]]`, expr);
    const opens = (text.match(/\[\[if /g) || []).length;
    const closes = (text.match(/\[\[\/if\]\]/g) || []).length;
    if (opens !== closes) err(id, `${where} has ${opens} [[if]] but ${closes} [[/if]]`);
    for (const t of unknownTokens(text)) err(id, `${where} uses unknown token {${t}}`);
    for (const t of dialogueTags(text)) if (!validTag(t)) err(id, `${where} uses unknown dialogue tag @${t}: (use a character key, @you: or @none:)`);
}

// A spread of states to probe dynamic nextScene / text functions with.
function probeStates() {
    const out = [];
    const base = createState(DEFAULT_PLAYER);
    for (const psychicLevel of [1, 5, 10, 14, 20, 40]) {
        for (const rel of [0, 30, 60, 100]) {
            for (const self of [0, 50, 100]) {
                for (const suspicion of [0, 50, 100]) {
                    for (const rich of [false, true]) {
                        out.push(view({
                            ...base,
                            psychicLevel, self, suspicion,
                            relationships: Object.fromEntries(relationshipNames.map(n => [n, rel])),
                            flags: rich ? Object.keys(flags) : [],
                            items: rich ? Object.keys(items) : [],
                            counters: rich ? { allies: 5, term: 3 } : {}
                        }));
                    }
                }
            }
        }
    }
    return out;
}
const PROBES = probeStates();

// Outgoing edges per scene, for the reachability pass.
const edges = {};

function checkNext(id, where, choice) {
    if (typeof choice.nextScene === "function") {
        if (!Array.isArray(choice.targets) || !choice.targets.length) {
            err(id, `${where} is dynamic but has no "targets" list`);
            return;
        }
        const seen = new Set();
        for (const p of PROBES) {
            const t = choice.nextScene(p);
            seen.add(t);
            if (!choice.targets.includes(t)) err(id, `${where} returned "${t}", which isn't in targets`);
        }
        for (const t of choice.targets) {
            if (!scenes[t]) err(id, `${where} target "${t}" does not exist`);
            else edges[id].add(t);
            if (!seen.has(t)) warn(id, `${where} never returned "${t}" for any probe state`);
        }
    } else if (!scenes[choice.nextScene]) {
        err(id, `${where} points to missing scene "${choice.nextScene}"`);
    } else {
        edges[id].add(choice.nextScene);
    }
}

if (!scenes[START_SCENE]) err(START_SCENE, "start scene is missing");

for (const [id, scene] of Object.entries(scenes)) {
    edges[id] = new Set();

    for (const key of Object.keys(scene)) if (!SCENE_KEYS.has(key)) err(id, `unknown scene field "${key}" (typo?)`);
    if (!THEMES.has(scene.theme)) err(id, `unknown theme "${scene.theme}"`);
    if (!scene.location) warn(id, "no location");
    else if (!locations[scene.location]) err(id, `unknown location "${scene.location}"`);
    if (scene.speaker && !characters[scene.speaker]) err(id, `unknown speaker "${scene.speaker}"`);
    if (!scene.ending && !acts[scene.act]) err(id, `act ${scene.act} is not defined in acts.js`);
    if (scene.ending && !scene.endingTitle) err(id, "ending has no endingTitle");
    if (scene.ending && !scene.hint) err(id, "ending has no hint (shown on its card back in the gallery)");
    if (scene.speaker && !portraits[scene.speaker]) err(id, `speaker "${scene.speaker}" has no portrait`);
    for (const [i, c] of (scene.cast || []).entries()) {
        const where = `cast ${i + 1}`;
        if (!characters[c.who] || !portraits[c.who]) err(id, `${where}: unknown or unportrayed character "${c.who}"`);
        if (c.mood && !MOODS.includes(c.mood)) err(id, `${where}: unknown mood "${c.mood}" (use ${MOODS.join(", ")})`);
        if (c.pos && !["left", "right", "center"].includes(c.pos)) err(id, `${where}: pos must be left, right or center`);
        if (c.when) checkCondition(id, `${where} when`, c.when);
    }
    if (!scene.text) err(id, "no text");
    if (typeof scene.text === "function") {
        for (const p of PROBES) {
            const t = scene.text(p);
            if (typeof t !== "string" || !t.trim()) { err(id, "text function returned nothing for some state"); break; }
        }
        // Check the text the function can produce, too.
        new Set(PROBES.map(p => scene.text(p))).forEach(t => checkText(id, "text", t));
    } else {
        checkText(id, "text", scene.text);
    }
    checkEffects(id, "scene", scene);

    if (!scene.choices.length) err(id, "dead end: no choices and not an ending");
    if (!scene.ending && scene.choices.every(c => c.requires)) {
        err(id, "every choice has a requirement - the player could get stuck");
    }

    scene.choices.forEach((choice, i) => {
        const where = `choice ${i + 1} ("${choice.text}")`;
        for (const key of Object.keys(choice)) if (!CHOICE_KEYS.has(key)) err(id, `${where} has unknown field "${key}" (typo?)`);
        checkText(id, where, choice.text);
        if (choice.requires) checkCondition(id, `${where} requires`, choice.requires);
        if (choice.hideWhen) checkCondition(id, `${where} hideWhen`, choice.hideWhen);
        if (choice.playAgain) return;

        // A set-piece choice has several outcome branches; a plain choice is one branch.
        let branches = [[where, choice]];
        if (choice.setPiece || choice.outcomes) {
            if (!SET_PIECES.includes(choice.setPiece)) err(id, `${where} uses unknown set piece "${choice.setPiece}"`);
            if (!choice.outcomes || !Object.keys(choice.outcomes).length) { err(id, `${where} launches a set piece but has no outcomes`); return; }
            if (!choice.outcomes[choice.skipOutcome]) err(id, `${where} skipOutcome "${choice.skipOutcome}" is not one of its outcomes`);
            branches = Object.entries(choice.outcomes).map(([k, o]) => [`${where} outcome "${k}"`, o]);
            for (const [w, o] of branches) for (const key of Object.keys(o)) if (!OUTCOME_KEYS.has(key)) err(id, `${w} has unknown field "${key}"`);
        }
        for (const [w, branch] of branches) {
            checkEffects(id, w, branch);
            checkNext(id, w, branch);
        }
    });

    // Set-piece and plain-only choices never show together, so compare within each mode.
    for (const mode of [true, false]) {
        const texts = scene.choices.filter(c => (mode ? !c.plainOnly : !c.setPiece)).map(c => c.text);
        if (new Set(texts).size !== texts.length) warn(id, "two choices have the same text");
    }
}

// Act objectives (sidebar "Current aim") and the crew list.
for (const [n, act] of Object.entries(acts)) {
    const objectives = act.objectives || [];
    if (!objectives.length) warn(`act ${n}`, "has no objectives");
    else if (objectives[objectives.length - 1][0] !== null) warn(`act ${n}`, "last objective should have a null condition (a fallback)");
    for (const [cond] of objectives) if (cond) checkCondition(`act ${n}`, "objective", cond);
}
for (const [name, flag] of Object.entries(crew)) {
    if (!characters[name]) err("crew", `unknown character "${name}"`);
    if (!flags[flag]) err("crew", `${name} uses undeclared flag "${flag}"`);
}

// Reachability from the start scene (ignoring requirements - see simulate.js for that).
const reachable = new Set([START_SCENE]);
const queue = [START_SCENE];
while (queue.length) {
    for (const next of edges[queue.shift()] || []) {
        if (!reachable.has(next)) { reachable.add(next); queue.push(next); }
    }
}
for (const id of Object.keys(scenes)) {
    if (!reachable.has(id)) err(id, "unreachable from the start scene");
}

// Every non-ending scene should be able to reach some ending.
const canEnd = new Set(Object.keys(scenes).filter(id => scenes[id].ending));
let changed = true;
while (changed) {
    changed = false;
    for (const [id, outs] of Object.entries(edges)) {
        if (!canEnd.has(id) && [...outs].some(o => canEnd.has(o))) { canEnd.add(id); changed = true; }
    }
}
for (const id of Object.keys(scenes)) {
    if (!canEnd.has(id)) err(id, "can never reach an ending");
}

for (const e of epilogues) {
    checkCondition(`epilogue:${e.id}`, "when", e.when);
    checkText(`epilogue:${e.id}`, "text", e.text);
    for (const x of e.except || []) if (!scenes[x]?.ending) err(`epilogue:${e.id}`, `except lists "${x}", which isn't an ending`);
}

const codexIds = new Set();
for (const e of codex) {
    const where = `codex:${e.id}`;
    if (codexIds.has(e.id)) err(where, "duplicate codex id");
    codexIds.add(e.id);
    if (!CODEX_SECTIONS[e.section]) err(where, `unknown section "${e.section}"`);
    if (!e.title || !e.text) err(where, "needs a title and text");
    for (const c of Array.isArray(e.when) ? e.when : [e.when]) checkCondition(where, "when", c);
}

for (const f of flagsRead) if (!flagsSet.has(f)) err(f, "flag is checked but never set anywhere");
for (const f of Object.keys(flags)) if (!flagsSet.has(f)) warn(f, "flag is declared but never set");
for (const i of itemsRead) if (!itemsGiven.has(i)) err(i, "item is required but never given anywhere");
for (const i of Object.keys(items)) if (!itemsGiven.has(i)) warn(i, "item is declared but never given");
for (const [id, loc] of Object.entries(locations)) {
    if (!Object.values(scenes).some(s => s.location === id)) warn(id, "location is never used");
    if (!sets[loc.set]) err(id, `location uses unknown set "${loc.set}"`);
    if (!THEMES.has(loc.realm)) err(id, `location has unknown realm "${loc.realm}"`);
    if (!AMBIENCES.includes(loc.ambience)) err(id, `location has unknown ambience "${loc.ambience}"`);
    try { sets[loc.set]?.(loc.variant); } catch (e) { err(id, `set "${loc.set}" failed to draw: ${e.message}`); }
}

const total = Object.keys(scenes).length;
const endings = Object.values(scenes).filter(s => s.ending).length;
console.log(`Story: ${total} scenes, ${endings} endings, ${Object.keys(locations).length} locations, ${Object.keys(items).length} items, ${Object.keys(flags).length} flags.`);
if (warnings.length) console.log(`\nWarnings (${warnings.length}):\n${warnings.join("\n")}`);
if (errors.length) {
    console.error(`\nErrors (${errors.length}):\n${errors.join("\n")}`);
    process.exit(1);
}
console.log("Story lint passed.");
