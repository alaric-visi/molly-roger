// PROLOGUE - THE CUBE
// The projection exam. Introduces Worthington, the approved forms, and - silently - Vane.

export const prologueScenes = {
    prologue_exam: {
        act: 1,
        theme: "institution",
        location: "lecture_hall",
        speaker: "Professor Worthington",
        cast: [{ who: "Professor Worthington", mood: "stern", pos: "right" }, { who: "Inspector Vane", mood: "stern", pos: "left" }],
        text: "RIDGEWELL EDUTAINMENT CENTRE. EXAMINATION DAY.\n\nThe lecture hall smells of chalk, wet wool and the particular fear of forty students who have been told, many times, that this matters.\n\nProfessor Worthington walks the rows with his hands clasped behind his back. 'Controlled Projection, Part the First. You will each project a cube. Six faces. Twelve edges. No opinions.'\n\nAt the back of the hall sits a woman in Board grey you have never seen before. She has a small ledger open on her knee and a pencil she has not yet used.\n\nYour turn comes. The air in front of you waits to be told what to be.[[if flag:ghost_memory]]\n\nYou have the oddest feeling you have sat this examination before. More than once. The air in front of you seems to remember you, too.[[/if]]",
        choices: [
            {
                text: "Sit the examination",
                setPiece: "projection",
                skipOutcome: "cube",
                outcomes: {
                    cube: { nextScene: "prologue_cube", relationshipChanges: { "Professor Worthington": 10 }, suspicionChange: -5, setFlags: ["perfect_cube"] },
                    sail: { nextScene: "prologue_sail", psychicChange: 1, suspicionChange: 10, setFlags: ["cube_sail"] },
                    still: { nextScene: "prologue_nothing", selfChange: 10, setFlags: ["still_mind"] }
                }
            },
            {
                plainOnly: true,
                text: "Project a perfect cube",
                nextScene: "prologue_cube",
                relationshipChanges: { "Professor Worthington": 10 },
                suspicionChange: -5,
                setFlags: ["perfect_cube"]
            },
            {
                plainOnly: true,
                text: "Let the cube become something else",
                nextScene: "prologue_sail",
                psychicChange: 1,
                suspicionChange: 10,
                setFlags: ["cube_sail"]
            },
            {
                plainOnly: true,
                text: "Project nothing. Hold your mind perfectly still.",
                nextScene: "prologue_nothing",
                selfChange: 10,
                setFlags: ["still_mind"]
            }
        ]
    },

    prologue_cube: {
        act: 1,
        theme: "institution",
        location: "lecture_hall",
        speaker: "Professor Worthington",
        cast: [{ who: "Professor Worthington", mood: "pleased", pos: "right" }, { who: "Inspector Vane", mood: "stern", pos: "left" }],
        text: "It comes out perfect. Six faces, twelve edges, corners you could cut yourself on. It turns slowly in the air, humming faintly - a small grey monument to doing as you're told.\n\n'Exemplary,' says Worthington, and he means it. He writes something in his book. At the back of the hall, the woman in grey writes nothing at all.\n\nAs the cube winks out you hear, very faintly, from somewhere that is not the room, someone yawn.",
        choices: [
            { text: "Go on to the afternoon lecture", nextScene: "start" }
        ]
    },

    prologue_sail: {
        act: 1,
        theme: "institution",
        location: "lecture_hall",
        speaker: null,
        cast: [{ who: "Professor Worthington", mood: "afraid", pos: "right" }, { who: "Inspector Vane", mood: "stern", pos: "left" }],
        text: "It starts as a cube. You promise it does.\n\nThen one face loosens, the way a sheet loosens on a washing line, and catches a wind that isn't blowing - and the cube is a sail. A small, impossible, salt-stiff sail, bellied out over your desk.\n\nFor one heartbeat the whole hall smells of the sea.\n\nWorthington stops dead. Forty students stop breathing. At the back of the hall, the woman in grey makes her first mark of the day.\n\nAnd from somewhere that is not the room, someone laughs - delighted, enormous, like a door being kicked open.",
        choices: [
            { text: "Let it fold away, and say nothing", nextScene: "start" }
        ]
    },

    prologue_nothing: {
        act: 1,
        theme: "institution",
        location: "lecture_hall",
        speaker: null,
        cast: [{ who: "Professor Worthington", mood: "thoughtful", pos: "right" }],
        text: "You let the air stay empty. Not a cube, not a refusal - just a stillness, held the way you'd hold a full cup.\n\n@none: Worthington frowns and writes 'absent of mind?' in the margin, question mark and all. The woman in grey glances up, then down again. Nothing about you has earned a mark.\n\nBut in the stillness you hear something the others don't: a voice, far off, humming a sea shanty slightly out of tune. It sounds as if it has been waiting a long while for a room to go quiet enough.",
        choices: [
            { text: "Go on to the afternoon lecture", nextScene: "start" }
        ]
    }
};
