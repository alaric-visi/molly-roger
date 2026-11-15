// Engine tests. Run with `npm test` (also runs before every build).
import { test } from "node:test";
import assert from "node:assert/strict";

import { scenes, codex, endingIds, START_SCENE } from "../src/story/index.js";
import { evaluate, checkRequirement, renderConditionals } from "../src/engine/conditions.js";
import { applyTokens, renderText, typeset } from "../src/engine/text.js";
import {
    createState, newRun, applyEffects, enterScene, applyChoice, choicesFor, effectiveChoice,
    resolveNext, resolveText, rewindTo, snapshot, castFor, epiloguesFor, view
} from "../src/engine/rules.js";
import { migrate } from "../src/engine/save.js";
import { endingCard } from "../src/stage/art/endingCards.js";
import { splitLines, quoteRuns, stripTags, PLAYER } from "../src/engine/dialogue.js";
import { acts } from "../src/story/index.js";

const fresh = () => createState({ name: "Wren", address: "matey", pronouns: "they" });

// ---------------------------------------------------------------- conditions

test("conditions: flags, items, relationships, counters, negation and AND", () => {
    const s = fresh();
    s.flags.push("met_vane");
    s.items.push("roger_letters");
    s.relationships.Grace = 40;
    s.counters.allies = 3;
    assert.equal(evaluate("flag:met_vane", s), true);
    assert.equal(evaluate("!flag:met_vane", s), false);
    assert.equal(evaluate("item:roger_letters & rel:grace>=40", s), true);
    assert.equal(evaluate("rel:grace>40", s), false);
    assert.equal(evaluate("count:allies>=3 & self==100", s), true);
    assert.equal(evaluate("endings>=1", s), false);
});

test("conditions: unknown syntax and character keys throw", () => {
    assert.throws(() => evaluate("rel:nobody>=1", fresh()));
    assert.throws(() => evaluate("banana", fresh()));
});

test("conditions: locked-choice hints describe what's missing", () => {
    const { ok, hint } = checkRequirement("item:grace_photo & psychic>=14", fresh());
    assert.equal(ok, false);
    assert.match(hint, /faded photograph/);
    assert.match(hint, /Psychic level at least 14/);
    assert.equal(checkRequirement("!flag:grace_taken", { ...fresh(), flags: ["grace_taken"] }).hint, "Not possible right now");
});

test("conditional text: if/else and nesting", () => {
    const s = fresh();
    s.flags.push("a");
    assert.equal(renderConditionals("[[if flag:a]]yes[[else]]no[[/if]]", s), "yes");
    assert.equal(renderConditionals("[[if flag:b]]yes[[else]]no[[/if]]", s), "no");
    assert.equal(renderConditionals("[[if flag:a]]A[[if flag:b]]B[[/if]]C[[/if]]", s), "AC");
});

// ---------------------------------------------------------------- text

test("tokens: name, address, pronouns and capitals", () => {
    const p = { name: "Wren", address: "matey", pronouns: "they" };
    assert.equal(applyTokens("Ahoy, {lass}! {Name}? {They_are} late, and {their} hat is {theirs}.", p),
        "Ahoy, matey! Wren? They are late, and their hat is theirs.");
    assert.equal(applyTokens("{unknown}", p), "{unknown}");
    assert.equal(applyTokens("{they} {them}", { ...p, pronouns: "she" }), "she her");
});

test("typeset: curly quotes, apostrophes, dashes and ellipses", () => {
    assert.equal(typeset("'Ye can't,' she said - softly..."), "‘Ye can’t,’ she said – softly…");
    assert.equal(typeset("Make 'em look. Since '21."), "Make ’em look. Since ’21.");
    assert.equal(typeset('He said "no".'), "He said “no”.");
    assert.equal(typeset("Gone plunderin'."), "Gone plunderin’.");
    assert.equal(typeset("- The Captain."), "– The Captain.");
});

test("renderText collapses blank lines left by hidden blocks", () => {
    const s = fresh();
    assert.equal(renderText("One.\n\n[[if flag:x]]Two.[[/if]]\n\nThree.", s).includes("\n\n\n"), false);
});

// ---------------------------------------------------------------- rules

test("effects clamp to 0-100 and psychic level never drops below 1", () => {
    const s = fresh();
    applyEffects(s, { relationshipChanges: { Grace: 150 }, selfChange: 50, suspicionChange: -20, psychicChange: -9 });
    assert.equal(s.relationships.Grace, 100);
    assert.equal(s.self, 100);
    assert.equal(s.suspicion, 0);
    assert.equal(s.psychicLevel, 1);
});

test("scene effects apply on first visit only; choice effects every time", () => {
    const s = fresh();
    enterScene(s, scenes.research, null);
    const grace = s.relationships.Grace;
    enterScene(s, scenes.research, null);
    assert.equal(s.relationships.Grace, grace, "revisiting doesn't farm stats");
    const choice = scenes.research.choices[0];
    applyChoice(s, choice);
    applyChoice(s, choice);
    assert.equal(s.relationships.Grace, grace + 30);
});

test("choicesFor: requirements lock, hideLocked/hideWhen hide, set-piece mode swaps choices", () => {
    const s = fresh();
    const exam = scenes.prologue_exam;
    assert.deepEqual(choicesFor(exam, s, { setPieces: true }).map(c => c.choice.setPiece), ["projection"]);
    assert.equal(choicesFor(exam, s, { setPieces: false }).length, 3);
    const term = choicesFor(scenes.term_hub, s);
    assert.ok(!term.some(c => c.text.startsWith("The dark of the moon")), "heist is hidden until the term is over");
    s.counters.term = 3;
    assert.ok(choicesFor(scenes.term_hub, s).some(c => c.text.startsWith("The dark of the moon")));
    assert.ok(!choicesFor(scenes.term_hub, s).some(c => c.text.startsWith("Take lessons")));
});

test("set-piece outcomes resolve, and skipOutcome is the default", () => {
    const choice = scenes.prologue_exam.choices.find(c => c.setPiece);
    assert.equal(effectiveChoice(choice, "sail").nextScene, "prologue_sail");
    assert.equal(effectiveChoice(choice, null).nextScene, "prologue_cube");
    assert.throws(() => effectiveChoice(choice, "nope"));
});

test("rewind restores stats, flags, items and counters", () => {
    const s = fresh();
    enterScene(s, scenes[START_SCENE], null);
    const before = snapshot(s);
    applyEffects(s, { setFlags: ["x"], addItems: ["stolen_w"], counters: { allies: 2 }, selfChange: -30 });
    enterScene(s, scenes.research, "go");
    rewindTo(s, 0);
    assert.deepEqual(snapshot(s), before);
    assert.equal(s.journeySteps.length, 1);
});

test("newRun carries endings and codex, counts runs, and switches on Ghost Memory", () => {
    const first = newRun(null, { name: "A" });
    assert.equal(first.runs, 1);
    assert.ok(!first.flags.includes("ghost_memory"));
    first.discoveredEndings.push("hollow");
    first.codex.push("molly_1");
    const second = newRun(first, first.player);
    assert.equal(second.runs, 2);
    assert.deepEqual(second.discoveredEndings, ["hollow"]);
    assert.deepEqual(second.codex, ["molly_1"]);
    assert.ok(second.flags.includes("ghost_memory"));
    assert.equal(second.self, 100, "stats start fresh");
});

test("codex entries unlock once their condition holds", () => {
    const s = fresh();
    const unlocked = enterScene(s, scenes.start, null);
    assert.ok(unlocked.includes("molly_1"));
    assert.deepEqual(enterScene(s, scenes.start, null), [], "only reported the first time");
});

test("cast: `when` filters and positions default right then left", () => {
    const s = fresh();
    s.suspicion = 50;
    assert.deepEqual(castFor(scenes.bank_ritual, s).map(c => `${c.who}@${c.pos}`),
        ["Professor Worthington@right", "Inspector Vane@left"]);
    s.suspicion = 0;
    assert.ok(castFor(scenes.bank_ritual, s).some(c => c.who === "Molly Roger"));
    assert.deepEqual(castFor(scenes.hollow, s), [], "endings show a card, not a cast");
});

test("epilogues: matching lines are appended, excluded endings skip them", () => {
    const s = fresh();
    s.flags.push("pip_friend", "captain_owes");
    assert.deepEqual(epiloguesFor(scenes.hollow, s).map(e => e.id), ["pip_friend", "captain"]);
    assert.ok(!epiloguesFor(scenes.pips_teacher, s).some(e => e.id === "pip_friend"));
    assert.deepEqual(epiloguesFor(scenes.true_ending, s), [], "the hidden ending has no epilogue");
});

// ---------------------------------------------------------------- story integrity

test("every scene renders for a fresh player and a well-travelled one", () => {
    const plain = fresh();
    const rich = fresh();
    rich.flags.push(...["anchored", "pip_friend", "grace_witness", "worthington_ally", "ghost_memory", "harrowgate_heard", "vane_secret"]);
    rich.suspicion = 80;
    rich.counters.allies = 4;
    for (const [id, scene] of Object.entries(scenes)) {
        for (const s of [plain, rich]) {
            const text = resolveText(scene, s);
            assert.ok(text.length > 40, `${id} text too short`);
            assert.ok(!/\{\w+\}|\[\[/.test(text), `${id} left a token or [[if]] unrendered`);
        }
    }
});

test("every dynamic choice resolves to a real scene", () => {
    const s = fresh();
    for (const scene of Object.values(scenes)) {
        for (const choice of scene.choices) {
            const branches = choice.outcomes ? Object.values(choice.outcomes) : [choice];
            for (const b of branches) {
                if (choice.playAgain) continue;
                assert.ok(scenes[resolveNext(b, s)], `${scene.id}: "${choice.text}" goes nowhere`);
            }
        }
    }
});

test("every ending has a card and a hint", () => {
    endingIds.forEach((id, i) => {
        assert.ok(scenes[id].hint, `${id} has no hint`);
        assert.match(endingCard(id, i, scenes[id].endingTitle), /<svg/);
    });
    assert.equal(endingIds.length, 17);
});

test("codex ids are unique", () => {
    assert.equal(new Set(codex.map(e => e.id)).size, codex.length);
});

// ---------------------------------------------------------------- saves

test("a v1 save (the original single-file game) migrates all the way", () => {
    const v1 = {
        currentSceneId: "practice", psychicLevel: 4, currentPath: "Undecided",
        relationships: { "Molly Roger": 35, "Professor Worthington": 0, "Grace": 5 },
        journeySteps: [{ sceneId: "start", label: "Start", choiceText: null, snapshot: { psychicLevel: 1, currentPath: "Undecided", relationships: { "Molly Roger": 10 } } }],
        discoveredEndings: ["approved_psychic"]
    };
    const s = migrate(v1);
    assert.equal(s.currentSceneId, "practice");
    assert.equal(s.relationships["Inspector Vane"], 0);
    assert.equal(s.relationships.Pip, 0);
    assert.equal(s.self, 100);
    assert.deepEqual(s.counters, {});
    assert.deepEqual(s.codex, []);
    assert.ok(s.player.name);
    assert.deepEqual(s.discoveredEndings, ["approved_psychic"]);
});

test("a save pointing at a scene that no longer exists is discarded", () => {
    assert.equal(migrate({ version: 5, currentSceneId: "deleted_scene", journeySteps: [] }), null);
});

test("view() is a read-only copy", () => {
    const s = fresh();
    const v = view(s);
    v.relationships.Grace = 99;
    assert.equal(s.relationships.Grace, 0);
});

// ---------------------------------------------------------------- dialogue

test("dialogue: quotes vs apostrophes", () => {
    const runs = quoteRuns(typeset("'Ye've done it,' she says. 'A share o' the plunder, lass!'"));
    assert.deepEqual(runs.map(r => r.quoted), [true, false, true]);
    assert.equal(runs[2].text, "‘A share o’ the plunder, lass!’");
});

test("dialogue: attribution by name, carry-over, scene speaker, player and tags", () => {
    const text = typeset([
        "The rain keeps on.",
        "'I see you've found the good stuff,' Grace says.",
        "She doesn't wait. 'Molly's been in touch, hasn't she?'",
        "'Who are you, then?' you ask her quietly.",
        "Worthington clears his throat at the front of the hall.",
        "'Again,' he says. 'From the third principle.'",
        "@vane: 'Name,' she says, though she knows it already.",
        "@none: The note reads 'absent of mind?' in the margin."
    ].join("\n\n"));
    const lines = splitLines(text, "Molly Roger");
    assert.deepEqual(lines.map(l => l.speaker), [
        null, "Grace", "Grace", PLAYER, null, "Professor Worthington", "Inspector Vane", null
    ]);
    assert.ok(!lines[6].text.startsWith("@"));
    assert.equal(splitLines(typeset("'Not bad for a landlubber,' she says."), "Molly Roger")[0].speaker, "Molly Roger");
    assert.equal(stripTags("One.\n\n@grace: 'Two.'"), "One.\n\n'Two.'");
});

test("dialogue: every scene splits, and tags never reach the reader", () => {
    const s = fresh();
    for (const scene of Object.values(scenes)) {
        for (const line of splitLines(resolveText(scene, s), scene.speaker)) {
            assert.ok(!/^@[a-z]+:/.test(line.text), `${scene.id} leaks a dialogue tag`);
        }
    }
});

test("acts: every act has a fallback objective", () => {
    for (const [n, act] of Object.entries(acts)) {
        assert.ok(act.objectives?.length, `act ${n} has objectives`);
        assert.equal(act.objectives.at(-1)[0], null, `act ${n} ends with a fallback`);
    }
});
