#!/usr/bin/env node
// Plays the game thousands of times with random choices, using the real
// rules (including locked choices), to check that every ending is reachable
// and to see how the gated checks actually play out.
//   npm run simulate                    (20,000 runs, random choices)
//   npm run simulate -- 100000
//   npm run simulate:explore            (a curious player: prefers new scenes,
//                                        avoids rushing to endings, plays set pieces well)

import { scenes, START_SCENE, endingIds, items } from "../src/story/index.js";
import { createState, newRun, enterScene, applyChoice, resolveNext, choicesFor, effectiveChoice } from "../src/engine/rules.js";
import { codex } from "../src/story/index.js";

const args = process.argv.slice(2);
const RUNS = Number(args.find(a => /^\d+$/.test(a))) || 20000;
const EXPLORE = args.includes("--explore");
const GOOD_OUTCOMES = new Set(["cube", "win", "perfect", "held"]);

function pickWeighted(items, weight) {
    const ws = items.map(weight);
    let r = Math.random() * ws.reduce((a, b) => a + b, 0);
    for (let i = 0; i < items.length; i++) if ((r -= ws[i]) <= 0) return items[i];
    return items[items.length - 1];
}

/** Where a choice probably leads (for the explorer's preferences). */
function likelyTarget(choice, state) {
    const branch = choice.outcomes ? choice.outcomes[choice.skipOutcome] : choice;
    try { return resolveNext(branch, state); } catch { return null; }
}
const MAX_STEPS = 200;

// Scenes whose entry state we want to inspect (they precede a gated check).
const WATCH = ["vane_interview", "the_plan", "ledger_heart", "bank_ritual"];
const STATS = [
    ["psychic", s => s.psychicLevel],
    ["self", s => s.self],
    ["suspicion", s => s.suspicion],
    ["Molly", s => s.relationships["Molly Roger"]],
    ["Worthington", s => s.relationships["Professor Worthington"]],
    ["allies", s => s.counters.allies || 0]
];

const endingCounts = Object.fromEntries(endingIds.map(id => [id, 0]));
const lengths = Object.fromEntries(endingIds.map(id => [id, []]));
const watched = Object.fromEntries(WATCH.map(id => [id, []]));
const sceneVisits = Object.fromEntries(Object.keys(scenes).map(id => [id, 0]));
const itemCounts = Object.fromEntries(Object.keys(items).map(id => [id, 0]));
let stuck = 0;

// One "player" replaying again and again, so endings and codex carry over and
// Ghost Memory (New Game+) kicks in after the first ending. Set pieces are on
// for half the runs, with a random outcome each time.
let previous = null;
let ghostRuns = 0;
for (let run = 0; run < RUNS; run++) {
    const state = newRun(previous, undefined);
    previous = state;
    if (state.flags.includes("ghost_memory")) ghostRuns++;
    const setPieces = Math.random() < 0.5;
    let scene = scenes[START_SCENE];
    enterScene(state, scene, null);

    for (let step = 0; step < MAX_STEPS && !scene.ending; step++) {
        sceneVisits[scene.id]++;
        if (WATCH.includes(scene.id)) watched[scene.id].push(Object.fromEntries(STATS.map(([k, f]) => [k, f(state)])));

        const open = choicesFor(scene, state, { setPieces }).filter(c => !c.locked);
        if (!open.length) break;
        let choice;
        if (EXPLORE) {
            ({ choice } = pickWeighted(open, ({ choice: c }) => {
                const target = scenes[likelyTarget(c, state)];
                let w = 1;
                if (target?.ending) w *= 0.15;
                else if (target && !state.visited.includes(target.id)) w *= 3;
                if (c.risky) w *= 0.6;
                return w;
            }));
        } else {
            ({ choice } = open[Math.floor(Math.random() * open.length)]);
        }
        const keys = choice.outcomes ? Object.keys(choice.outcomes) : [];
        let outcome = null;
        if (keys.length) {
            const good = keys.filter(k => GOOD_OUTCOMES.has(k));
            outcome = EXPLORE && good.length && Math.random() < 0.7
                ? good[0]
                : keys[Math.floor(Math.random() * keys.length)];
        }
        const picked = effectiveChoice(choice, outcome);
        applyChoice(state, picked);
        scene = scenes[resolveNext(picked, state)];
        enterScene(state, scene, choice.text);
    }

    state.items.forEach(id => itemCounts[id]++);
    if (scene.ending) {
        sceneVisits[scene.id]++;
        endingCounts[scene.id]++;
        lengths[scene.id].push(state.journeySteps.length - 1);
    } else {
        stuck++;
    }
}

const pct = n => `${((n / RUNS) * 100).toFixed(1)}%`.padStart(6);
const median = a => (a.length ? [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)] : "-");

console.log(`\n${RUNS} ${EXPLORE ? "explorer" : "random"} playthroughs\n`);
console.log("Ending".padEnd(22) + "Share   Median choices");
for (const id of endingIds) {
    console.log(`${scenes[id].endingTitle.padEnd(22)}${pct(endingCounts[id])}   ${median(lengths[id])}`);
}
if (stuck) console.log(`\n${stuck} runs hit ${MAX_STEPS} steps or a fully locked scene without an ending.`);

const never = endingIds.filter(id => endingCounts[id] === 0);
if (never.length) console.log(`\n⚠ Endings never reached: ${never.join(", ")}`);
const unvisited = Object.keys(scenes).filter(id => sceneVisits[id] === 0);
if (unvisited.length) console.log(`⚠ Scenes never visited: ${unvisited.join(", ")}`);

console.log("\nRuns ending with each item:");
for (const [id, n] of Object.entries(itemCounts)) console.log(`  ${items[id].name.padEnd(24)}${pct(n)}`);

console.log("\nState on arrival at gated scenes (min / median / max):");
for (const id of WATCH) {
    const rows = watched[id];
    if (!rows.length) { console.log(`  ${id}: never visited`); continue; }
    const stat = key => {
        const v = rows.map(r => r[key]).sort((a, b) => a - b);
        return `${v[0]}/${v[Math.floor(v.length / 2)]}/${v[v.length - 1]}`;
    };
    console.log(`  ${id} (${rows.length} visits): ${STATS.map(([k]) => `${k} ${stat(k)}`).join(", ")}`);
}

console.log(`\nNew Game+: ${ghostRuns} of ${RUNS} runs started with Ghost Memory. Codex: ${previous.codex.length} of ${codex.length} entries found overall.`);
