// ACT I - AWAKENING
// Scene fields:
//   act, theme ("institution" | "dream" | "neutral"), location (see locations.js),
//   speaker (character name or null), text (string or (state) => string).
//
// Effects - on a scene they apply the FIRST time it is entered; on a choice, every time it's picked:
//   relationshipChanges, psychicChange, selfChange, suspicionChange,
//   setFlags / clearFlags, addItems / removeItems
//
// Choices: { text, nextScene, ...effects, risky?, requires?, hideLocked?, lockedHint?, targets? }
//   - requires: condition string, e.g. "item:roger_letters & rel:grace>=30" (see engine/conditions.js).
//     Unmet choices show greyed out with a hint, or are hidden with hideLocked: true.
//   - when nextScene is a function, `targets` lists every scene it can return (checked by story-lint).
//
// Text may use [[if COND]]...[[else]]...[[/if]] and the tokens in story/player.js ({name}, {lass}, {they}...).

export const act1Scenes = {
    start: {
        theme: "neutral",
        location: "lecture_hall",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "pleased", pos: "right" }, { who: "Professor Worthington", mood: "stern", pos: "left" }],
        act: 2,
        text: "LONDON, 1845. RIDGEWELL EDUTAINMENT CENTRE.\n\nThe afternoon lecture is Containment Theory, which is the Board's way of saying Don't. Rain ticks on the tall windows. The gas lamps hiss. Forty pens scratch the same sentence into forty identical notebooks: A projection is a tool, and a tool has no opinions.\n\nYou - {name}, a second-year with an unremarkable record - are on your fourth copy of that sentence when the droning voice of Professor Worthington begins to fade, as if someone has shut a door on it. In its place comes the sound of the sea.\n\nThen she's there. Not in the room - in your head, where nobody is supposed to be able to stand. A woman in a battered tricorn and a coat that has seen several centuries' worth of weather, with wild eyes, a gold hoop in one ear, and a smirk like a dropped anchor.\n\n'I be Molly Roger, {lass}! [[if flag:cube_sail]]That sail o' yours this morning - I near fell off me ship! [[/if]][[if flag:perfect_cube]]A perfect cube, was it? Ye can do better than that. [[/if]][[if flag:still_mind]]Ye heard me humming, didn't ye? Nobody ever hears me humming. [[/if]][[if flag:ghost_memory]]Have we... met? Ye feel like a song I've heard before. [[/if]]Ye have the Sight! Meet me in Dreamspace tonight, or spend yer life as another dull London drone!'\n\nShe winks. Your pen, entirely of its own accord, draws a small ship in the margin.\n\nAt the front of the hall, Worthington pauses mid-sentence and looks straight at you, as if he has heard something too. Then he clears his throat, and carries on.\n\nYour Sight is waking up. The Board watches for unauthorised projections. Somewhere between this sentence and the next, you're going to have to decide which side of the door you're on.",
        choices: [
            { text: "Investigate this Molly Roger in the library", nextScene: "research" },
            { text: "Practise basic projections after class", nextScene: "practice" },
            { text: "Report the incident to Professor Worthington", nextScene: "report" },
            {
                text: "Say her name before she can - you remember it",
                nextScene: "practice",
                requires: "flag:ghost_memory",
                hideLocked: true,
                relationshipChanges: { "Molly Roger": 20 },
                setFlags: ["named_her"]
            }
        ],
        relationshipChanges: { "Molly Roger": 10 },
        psychicChange: 0
    },

    research: {
        theme: "neutral",
        location: "library",
        speaker: "Grace",
        act: 2,
        text: "The Combination Library is called that because nobody has ever agreed what it's a combination of. It smells of old paper, lamp oil, and the faint sour tang of the genetic samples kept in jars on the top shelves, which no one has ever been brave enough to label.\n\nIn the restricted section, behind a run of Parliamentary reports so dull they work better than a lock, you find a bundle of letters tied with string. The hand is careful and clerkly, every t crossed. They're from a bank clerk named Roger Molly to his sister, and they begin with the weather and the price of coal, and end, a year later, with only two words: Gone plunderin'.\n\nYou're halfway through the bundle when a shadow falls across the page.\n\n'I see you've found the good stuff.' The girl leaning on the end of the stack is Grace - the school's most talented psychic, and the one the teachers never quite look in the eye. Ink on her fingers, chalk on her cuff. 'Molly's been in touch, hasn't she? You've got the look. Like someone's left a window open in your head.'\n\nShe doesn't wait for an answer. 'She's been recruiting. She does this every few years. Most of the people she calls never answer.' A pause. 'I can help you understand what's happening to you - properly, not the way they teach it here. But I'll want something in return. I've some extracurricular activities that could use another pair of hands.'",
        choices: [
            { text: "Accept Grace's offer - learn from the best", nextScene: "grace_help", relationshipChanges: { "Grace": 15 } },
            { text: "Decline politely and research alone", nextScene: "research_alone" },
            { text: "Ask about Molly Roger's true intentions", nextScene: "molly_truth" }
        ],
        relationshipChanges: { "Molly Roger": 5, "Grace": 5 },
        psychicChange: 1,
        addItems: ["roger_letters"]
    },

    practice: {
        theme: "dream",
        location: "observatory",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "pleased" }],
        act: 2,
        text: "[[if flag:named_her]]'Ye knew me name,' she says, before anything else. 'How'd ye know me name, {lass}?' She looks at you very strangely for a moment, and then grins. 'Never mind. Some things ye just know.'\n\n[[/if]]The abandoned observatory sits on the roof of the east wing, forgotten by everyone except the pigeons. The great telescope points at nothing. The dome's slit is stuck permanently open, so the room is always full of sky.\n\nYou sit cross-legged on the cold boards and try to project. Your first attempts are pitiful - a shimmer, a smudge, a cube that sags like a wet loaf - and then the air in front of you gives a kind of shrug, and Molly Roger is standing there: boots, coat, earring and all, looking at your cube with professional pity.\n\n'Not bad for a landlubber,' she says. 'Not good, mind.'\n\nShe walks a slow circle round you, and her boots make no sound at all. Up close she's both more and less real than you'd expected. You can see the stars through the brim of her hat; you can also smell the tar on her hands.\n\n'Now. Let's see if ye've real spirit, or just the Sight.' She crouches, eye to eye. 'I need a partner for a little... conceptual acquisition.'\n\nThe plan, when she explains it, is either the most ridiculous thing you have ever heard or the most wonderful. Somewhere in the Dreamspace there is a vault where the British alphabet is kept, and Molly intends to borrow a letter from it. Just the one. 'The W,' she says, with relish. 'They'll never miss it. Well. They'll miss it a bit.'\n\nIt's harmless fun. It could also get you expelled, collared, or written into a ledger you never get out of.",
        choices: [
            { text: "Sign on for Molly's heist", nextScene: "term_begins", relationshipChanges: { "Molly Roger": 20 }, selfChange: -5 },
            { text: "Practise conventional projections instead", nextScene: "conventional" },
            { text: "Ask Molly about Roger Molly's transformation", nextScene: "transformation_questions" }
        ],
        relationshipChanges: { "Molly Roger": 25, "Professor Worthington": -10 },
        psychicChange: 2,
        selfChange: -5, // a pirate in your head, fully formed
        suspicionChange: 10 // an unauthorised projection
    },

    grace_help: {
        theme: "neutral",
        location: "grace_hideout",
        speaker: "Grace",
        act: 2,
        text: "Grace's hideout is behind a bookcase in the Combination Library, and the bookcase opens when you pull on a volume of Hume - 'because nobody,' Grace says, 'has ever voluntarily touched Hume.'\n\nInside is a room no bigger than a pantry and twice as crowded. Stolen projection equipment hums on every surface: a brass apparatus of nested rings, a slate dense with diagrams, jars of something that glows faintly whenever you aren't looking at it. There are books here the Board has burned, and books the Board doesn't know exist.\n\n'First lesson,' Grace says, perching on a crate. 'Projection isn't about making something new. It's about revealing what's already there.' She nods at the faint shimmer that has followed you in. 'Molly thinks she created herself. She didn't. Roger Molly had that pirate in him all along - forty years of adding up other people's money, and underneath it a woman with a cutlass, waiting to be let out.'\n\nShe watches you take that in. 'Which means whatever comes out of you was always yours. That's the part the Board can't stand.'\n\nShe offers proper training - real training, not cubes - but warns you that the Board is cracking down on what it calls 'unauthorised creativity'. 'If they find this room, they'll close it. If they find me in it, they'll close me.'[[if flag:double_agent]]\n\nWhen you tell her what Vane asked of you, she goes very still. 'Then we'd better give Inspector Vane something boring to read,' she says.[[/if]]",
        choices: [
            { text: "Begin training with Grace", nextScene: "grace_training", relationshipChanges: { "Grace": 20 } },
            { text: "Ask about her connection to Molly Roger", nextScene: "grace_connection" },
            { text: "This feels too dangerous - leave", nextScene: "research_alone", relationshipChanges: { "Grace": -15 } }
        ],
        relationshipChanges: { "Grace": 10 },
        psychicChange: 2,
        suspicionChange: 5,
        setFlags: ["knows_hideout"]
    },

    report: {
        theme: "institution",
        location: "worthington_office",
        speaker: "Professor Worthington",
        cast: [{ who: "Professor Worthington", mood: "thoughtful", pos: "right" }, { who: "Inspector Vane", mood: "stern", pos: "left" }],
        act: 2,
        text: "Professor Worthington listens to the whole thing without interrupting, which is somehow worse than if he'd shouted. When you've finished he takes off his spectacles and pinches the bridge of his nose.\n\n'Molly Roger,' he says. 'We'd hoped she'd faded away. She represents everything the Board fears - uncontrolled creativity, dangerous individuality, the notion that a thought might get above itself.'\n\nHe glances toward the door, where a spectacled woman in Board grey has been standing for some time without saying a word. When she finally leaves, the room feels warmer by a degree or two. 'Inspector Vane oversees cases like this now,' he says quietly. 'She's the reason I can't simply look the other way any more.'\n\nHe offers to become your mentor - extra tutorials, a word in the right ears, protection from Molly's influence - in exchange for your loyalty. The safe path. The approved path. He says it kindly, and you can tell he means the kindness.\n\nThat night, Molly appears in your dreams anyway, sitting on the end of your bed with her boots on the blanket. 'So ye chose the cage over the sea?' she says. Not angry. Just tired. 'Pity. I'll find another heart brave enough.' She tips her hat. 'But the window's open, {lass}, if ye ever want to climb out of it.'",
        choices: [
            { text: "Accept Worthington's mentorship", nextScene: "apprentice" },
            { text: "Change your mind and contact Molly", nextScene: "contact_molly_late", relationshipChanges: { "Professor Worthington": -30 } }
        ],
        relationshipChanges: { "Professor Worthington": 20, "Molly Roger": -20, "Inspector Vane": 10 },
        psychicChange: 0,
        suspicionChange: -15, // coming forward of your own accord counts in your favour
        setFlags: ["met_vane"]
    },

    research_alone: {
        theme: "neutral",
        location: "library",
        speaker: null,
        act: 2,
        text: "You keep reading, alone, long after the library lamps have been turned down to a glimmer.\n\n@none: Roger Molly's letters change as they go on. The early ones are all weather and coal prices and complaints about the manager, a Mr Fotheringay. Then a ship begins to appear in the margins. Then a woman's voice, quoted - at first with apologies, 'my imaginary friend, as you will laugh to hear', and then without them. By the last dozen letters he is writing to his sister about the two of them, Roger and Molly, as if they were a firm.\n\nThe last letter is two words long.\n\nThe more you read, the more you understand why the school fears such unions. A merged psychic isn't a student with a projection. It's a new kind of person - one who answers to nobody's syllabus, and can't be graded, filed or contained.\n\nYou sit in the dark with the letters in your lap, and Molly's voice somewhere very close, waiting - politely, for once - to see what you'll do.",
        choices: [
            { text: "Seek out Molly with your new understanding", nextScene: "practice" },
            { text: "Share your findings with Professor Worthington", nextScene: "report" },
            { text: "Look for Grace to discuss what you've learned", nextScene: "grace_help" },
            {
                text: "Slip behind the false bookshelf and ask Grace to train you",
                nextScene: "grace_training",
                requires: "flag:knows_hideout",
                relationshipChanges: { "Grace": 5 }
            }
        ],
        relationshipChanges: { "Molly Roger": 5 },
        psychicChange: 2,
        selfChange: 5, // time alone with your own thoughts
        addItems: ["roger_letters"]
    },

    conventional: {
        theme: "institution",
        location: "practice_rooms",
        speaker: null,
        cast: [{ who: "Professor Worthington", mood: "pleased", pos: "left" }],
        act: 2,
        text: "You throw yourself into approved projection. Cubes, spheres, the occasional daring tetrahedron. You learn to make them crisp-edged and silent and exactly the size requested. Professor Worthington praises your progress in front of the whole class, and something in your chest that has always been hungry for praise sits up and purrs.\n\nYour name goes up on the examination board with a gold star beside it. Inspector Vane, passing through, pauses to look at it, and nods.\n\nBut at night, Molly's voice still whispers at the edge of your hearing. Not words, mostly. The creak of rigging. A gull. Somebody laughing a long way off, on a ship you will never see.\n\nOne evening you project a perfect cube and, without meaning to, give it a tiny porthole. You stare at it for a long time before you let it go.\n\nThe pull between safety and freedom grows stronger with each passing day.",
        choices: [
            { text: "Continue with conventional training", nextScene: "approved_psychic" },
            { text: "Give in and contact Molly", nextScene: "term_begins", relationshipChanges: { "Molly Roger": 10 } }
        ],
        relationshipChanges: { "Professor Worthington": 10, "Inspector Vane": 5 },
        psychicChange: 1,
        suspicionChange: -10
    },

    molly_truth: {
        theme: "neutral",
        location: "library",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "afraid" }],
        act: 2,
        text: "Grace leans closer, her voice dropping to a whisper. 'Molly wants what all projections want - to be real. But she's different. Most projections fade when their creators lose interest, but Molly... she's grown beyond Roger Molly.'\n\nShe glances around nervously before continuing. 'The Board fears her because she represents a new kind of being - one that doesn't need a creator to exist. If she succeeds in becoming fully real, it would change everything we know about psychic abilities.'",
        choices: [
            { text: "That makes me want to help her more", nextScene: "practice", relationshipChanges: { "Molly Roger": 15 } },
            { text: "That sounds dangerously unstable", nextScene: "report", relationshipChanges: { "Molly Roger": -10 } },
            { text: "Ask Grace why she's helping Molly", nextScene: "grace_motives" }
        ],
        relationshipChanges: { "Grace": 5 },
        psychicChange: 1
    },

    grace_motives: {
        theme: "neutral",
        location: "library",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "sad" }],
        act: 2,
        text: "Grace's expression softens. 'My grandmother was one of Roger Molly's first students. She believed in what he and Molly were trying to achieve - a world where we don't have to choose between being psychic and being ourselves.'\n\n@grace: She shows you a faded photograph of a woman who looks remarkably like Molly Roger. 'The Board took everything from my family when they declared Roger Molly a rogue. I'm not just helping Molly - I'm finishing what my grandmother started.'",
        choices: [
            { text: "Join Grace in her mission", nextScene: "grace_help", relationshipChanges: { "Grace": 20 } },
            { text: "This is too personal for me", nextScene: "research_alone", relationshipChanges: { "Grace": -10 } }
        ],
        relationshipChanges: { "Grace": 10 },
        psychicChange: 1,
        addItems: ["grace_photo"]
    },

    grace_connection: {
        theme: "neutral",
        location: "grace_hideout",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "sad" }],
        act: 2,
        text: "Grace hesitates, then shows you a faded photograph: a woman who looks remarkably like Molly Roger, but isn't. 'My grandmother. She stood witness at Roger Molly's own merger. The Board took her post at the school for it, and erased the record afterward - afraid of what precedent it might set.'\n\nHer voice drops. 'I have the Sight too, same as you. I've just never dared use it the way Molly's asking you to.'",
        choices: [
            { text: "Trust Grace fully - train with her", nextScene: "grace_training" },
            { text: "This is a lot to take in - step back and think", nextScene: "research_alone" }
        ],
        relationshipChanges: { "Grace": 10 },
        psychicChange: 1,
        addItems: ["grace_photo"]
    },

    apprentice: {
        theme: "institution",
        location: "worthington_office",
        speaker: "Inspector Vane",
        cast: [{ who: "Inspector Vane", mood: "stern", pos: "left" }, { who: "Professor Worthington", mood: "sad", pos: "right" }],
        act: 2,
        text: "For three weeks you are the very model of an approved psychic. Cubes before breakfast. Spheres after supper. Worthington lends you his own annotated copy of the Principles of Containment, and you find yourself, absurdly, wanting to deserve it.\n\nThen one afternoon Inspector Vane is waiting in his office when you arrive. Worthington stands at the window and does not turn round.\n\n'You spend a good deal of time in the Combination Library,' Vane says. 'So does a student named Grace. You'll tell me what she reads, who she meets, and what she projects when she thinks no one is watching.' She turns a page. 'This is not a request. It's an opportunity.'",
        choices: [
            { text: "Agree to watch Grace", nextScene: "approved_psychic", relationshipChanges: { "Inspector Vane": 15, "Grace": -30 }, suspicionChange: -10 },
            { text: "Refuse, as politely as you can", nextScene: "apprentice_refuse", relationshipChanges: { "Inspector Vane": -10, "Professor Worthington": 10 }, suspicionChange: 10 },
            { text: "Agree - then warn Grace the moment you're out of the room", nextScene: "grace_help", risky: true, relationshipChanges: { "Grace": 15 }, suspicionChange: 10, setFlags: ["double_agent"] }
        ],
        relationshipChanges: { "Professor Worthington": 10 },
        setFlags: ["met_vane"]
    },

    apprentice_refuse: {
        theme: "institution",
        location: "worthington_office",
        speaker: "Professor Worthington",
        cast: [{ who: "Professor Worthington", mood: "sad" }],
        act: 2,
        text: "Vane writes one word, closes the ledger, and leaves without another.\n\nWorthington is quiet for a long time. 'I refused her predecessor once,' he says at last, to the window. 'Thirty years ago. It was the only brave thing I ever did, and I have spent every year since apologising for it.'\n\nHe turns. He looks older than you have ever seen him. 'Go carefully. Go quickly. And for heaven's sake, don't tell me where.'",
        choices: [
            { text: "That night, call out for Molly", nextScene: "contact_molly_late" }
        ],
        relationshipChanges: { "Professor Worthington": 5 }
    }
};
