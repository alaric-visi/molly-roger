import { prologueScenes } from "./scenes/prologue.js";
import { act1Scenes } from "./scenes/act1.js";
import { act2Scenes } from "./scenes/act2.js";
import { termScenes } from "./scenes/act2_term.js";
import { inquiryScenes } from "./scenes/act3_inquiry.js";
import { ledgerScenes } from "./scenes/act4_ledger.js";
import { act3Scenes } from "./scenes/act3.js";
import { endingScenes } from "./scenes/endings.js";

export { characters, characterByKey, relationshipNames, emptyRelationships } from "./characters.js";
export { locations } from "./locations.js";
export { acts, crew } from "./acts.js";
export { items } from "./items.js";
export { flags } from "./flags.js";
export { epilogues } from "./epilogues.js";
export { codex, CODEX_SECTIONS } from "./codex.js";
export * from "./player.js";

export const START_SCENE = "prologue_exam";

// File names follow the original build; acts are set per scene:
//   prologue.js       Prologue
//   act1.js           Act I    Awakening
//   act2.js           Act II   The Heist (Molly's scenes and the heist itself)
//   act2_term.js      Act II   The Michaelmas Term hub and London without a W
//   act3_inquiry.js   Act III  The Inquiry
//   act4_ledger.js    Act IV   The Ledger
//   act3.js           Act V    The Old Bank (the original finale)
//   endings.js        all endings
const raw = {
    ...prologueScenes, ...act1Scenes, ...act2Scenes, ...termScenes,
    ...inquiryScenes, ...ledgerScenes, ...act3Scenes, ...endingScenes
};

// Normalise: stamp each scene with its id, default the optional fields, and
// give every ending a "Play Again" choice so scene files don't repeat it.
export const scenes = Object.fromEntries(
    Object.entries(raw).map(([id, scene]) => [id, {
        id,
        speaker: null,
        ...scene,
        choices: scene.ending
            ? [{ text: "Play Again", nextScene: START_SCENE, playAgain: true }]
            : (scene.choices || [])
    }])
);

export const endingIds = Object.keys(scenes).filter(id => scenes[id].ending);
