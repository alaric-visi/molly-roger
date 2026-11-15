// ACT V - THE OLD BANK (the original finale; file name kept from the first build)

export const act3Scenes = {
    vane_confrontation: {
        theme: "institution",
        location: "corridor",
        speaker: "Inspector Vane",
        act: 6,
        text: "She's waiting for you in the corridor outside, as if she already knew which way you'd choose. Inspector Vane, Board Oversight. She doesn't raise her voice.\n\n'I know about the letter W. I know about the bank. I know about Grace's grandmother, too - these things are all written down somewhere, if you know where to look.' She lets that sit. 'I'm not here to stop you tonight. I'm here so that whatever happens next, you can't say you weren't warned.'\n\nShe walks on before you can answer.",
        choices: [
            // These used to be identical. Defiance now emboldens Molly but hardens Vane;
            // silence keeps Vane guessing and costs you a little of Molly's swagger.
            { text: "Defy her openly - you've made your choice", nextScene: "ritual_eve", relationshipChanges: { "Molly Roger": 10, "Inspector Vane": -15 }, suspicionChange: 15 },
            { text: "Say nothing and let her wonder", nextScene: "ritual_eve", relationshipChanges: { "Inspector Vane": 10, "Molly Roger": -5 }, suspicionChange: 5 }
        ],
        setFlags: ["met_vane"]
    },

    bank_planning: {
        theme: "dream",
        location: "old_bank",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "pleased", pos: "right" }, { who: "Grace", mood: "afraid", pos: "left" }],
        act: 6,
        text: "The old bank stands abandoned, but psychic residue from Roger Molly's time there makes it a perfect convergence point.\n\nGrace appears unexpectedly. 'I helped Roger Molly with his merger. It's dangerous - some personalities don't blend well. You could lose yourself entirely.'\n\nMolly scoffs. 'Grace always was the cautious one! Life's about risk, me heartie!'",
        choices: [
            { text: "Trust Molly and proceed", nextScene: "bank_ritual", relationshipChanges: { "Molly Roger": 20, "Grace": -15 }, selfChange: -10 },
            { text: "Listen to Grace's concerns", nextScene: "grace_warning", relationshipChanges: { "Molly Roger": -10, "Grace": 15 } },
            { text: "Ask Grace about helping Roger Molly", nextScene: "roger_story" },
            {
                text: "Show Grace the photograph of her grandmother",
                nextScene: "roger_story",
                requires: "item:grace_photo",
                relationshipChanges: { "Grace": 10 }
            }
        ],
        relationshipChanges: { "Molly Roger": 5, "Grace": 5 },
        psychicChange: 1
    },

    bank_ritual: {
        theme: "dream",
        location: "ritual_chamber",
        speaker: "Professor Worthington",
        cast: [
            { who: "Professor Worthington", mood: "angry", pos: "right" },
            { who: "Inspector Vane", mood: "stern", pos: "left", when: "suspicion>=40" },
            { who: "Molly Roger", mood: "pleased", pos: "left", when: "suspicion<40" }
        ],
        act: 6,
        text: "Midnight, in the old bank's vault. A chalk circle glows faintly on the floor. The air tastes of ozone and old ledgers, and the hum of psychic energy is so strong your teeth ache with it.\n\nMolly stands in the centre of the circle, more solid than you have ever seen her. Her coat is real cloth now, her boots real leather; when she shifts her weight, the floorboards creak. She holds out her hands.\n\n'Ready to become legend, {lass}? This'll change everything.'\n\nAnd then the door bangs open.\n\n[[if flag:worthington_ally]]It's the enforcers - with Professor Worthington at their head, because the Board ordered him to lead them and he couldn't think how to refuse. His face is grey. 'Stop this madness!' he shouts, for the benefit of the men behind him. 'That projection will consume you!' Then, so quietly only you can hear: 'Be quick. Be careful. Be both.'[[else]]Professor Worthington bursts in, enforcers at his back. 'Stop this madness!' he shouts. 'That projection will consume you!'[[/if]]\n\n[[if suspicion>=40]]Inspector Vane comes in last, calm as a closing door, and says nothing at all. She doesn't need to.[[if suspicion>=65]] She isn't watching you. She's watching Molly's hands, the way you'd watch a conjuror whose tricks you've already written down.[[/if]][[else]]There's no sign of Inspector Vane. Whatever her ledger says about you, it hasn't been enough to bring her here tonight.[[/if]]\n\n[[if self<50]]Somewhere under Molly's laughter, your own voice sounds very small.[[/if]]",
        choices: [
            {
                text: "Complete the ritual quickly",
                risky: true,
                setPiece: "anchors",
                skipOutcome: "lost",
                outcomes: {
                    // Holding your anchors replaces the Self requirement.
                    held: {
                        nextScene: (s) => (s.psychicLevel >= 12 && s.relationships["Molly Roger"] >= 60) ? "ritual_complete" : "ritual_consumed",
                        targets: ["ritual_complete", "ritual_consumed"]
                    },
                    lost: {
                        nextScene: (s) => (s.psychicLevel >= 12 && s.relationships["Molly Roger"] >= 60 && (s.self >= 70 || (s.flags.has("anchored") && s.self >= 55))) ? "ritual_complete" : "ritual_consumed",
                        targets: ["ritual_complete", "ritual_consumed"]
                    }
                }
            },
            {
                plainOnly: true,
                text: "Complete the ritual quickly",
                risky: true,
                // You need preparation (psychic level), Molly's trust, and enough of yourself
                // left to hold on to. Fail any of the three and the merger swallows you.
                nextScene: (s) => (s.psychicLevel >= 12 && s.relationships["Molly Roger"] >= 60 && (s.self >= 70 || (s.flags.has("anchored") && s.self >= 55))) ? "ritual_complete" : "ritual_consumed",
                targets: ["ritual_complete", "ritual_consumed"]
            },
            { text: "Try to reason with Worthington", nextScene: "reason_with_professor" },
            {
                text: "Have Molly create a distraction",
                risky: true,
                relationshipChanges: { "Molly Roger": 10 },
                // If Vane has been watching you very closely, she has read about Molly's tricks
                // (the scene text warns you: she's watching Molly's hands).
                nextScene: (s) => s.suspicion >= 65 ? "vane_anticipates" : "escape_attempt",
                targets: ["escape_attempt", "vane_anticipates"]
            }
        ],
        relationshipChanges: { "Professor Worthington": -10 },
        psychicChange: 2
    },

    ritual_complete: {
        theme: "dream",
        location: "ritual_chamber",
        speaker: null,
        cast: [{ who: "Molly Roger", mood: "pleased", pos: "center" }],
        act: 6,
        text: "Energy floods through you like a tide coming in over flat sand - slowly, and then everywhere at once.\n\n[[if flag:grace_witness]]Through it you hear Grace's voice, steady as a metronome, saying your name. Then your anchors come back to you exactly when you need them - street, door, stolen thing - and you hold on.[[else]][[if flag:anchored]]Your anchors come back to you exactly when you need them - street, door, stolen thing - and you hold on.[[else]]There's nothing to hold on to, so you hold on to Molly, and she holds on back.[[/if]][[/if]]\n\nMolly's laughter mixes with your thoughts. Her memories become yours: a deck in a storm, the smell of tar, a bank clerk whistling in a rented room. Yours become hers: a lecture hall, the rain on the windows,[[if flag:cube_sail]] a cube that became a sail,[[/if]][[if flag:pip_friend]] a frog called Admiral,[[/if]] the colour of your mother's door.\n\nWhen you open your eyes you see through both sets of memories at once, the way you see through both eyes.\n\nYou're still you. But more. Molly's confidence, Roger Molly's kindness, your own stubborn, careful self - woven together into something new, and not at all finished.\n\nThe enforcers stare. There's a light around you, faint and violet, that wasn't there before. Professor Worthington lowers his arm slowly and whispers, to nobody in particular, 'What have we done?'\n\n'Something grand,' you answer - and it takes you a moment to realise which of you said it.",
        choices: [
            { text: "Embrace your new existence", nextScene: "grace_epilogue_pirate" },
            { text: "Try to reverse the process", nextScene: "reversal_attempt" }
        ],
        relationshipChanges: { "Molly Roger": 50 },
        psychicChange: 10
    },

    slow_path: {
        theme: "dream",
        location: "ridgewell_later",
        speaker: null,
        act: 6,
        text: "Months pass, the way Roger Molly's did: not in a leap, but in evenings.\n\nYou practise after lights-out and on Sunday afternoons, letting Molly a little further in each time. Some nights it goes wrong, and you wake with salt in your mouth and a shanty you've never heard stuck in your head. Some nights she goes too quiet, and you sit up in the dark saying her name until she answers. You learn each other's edges the way you'd learn a house in the dark.[[if flag:anchored]] Grace's anchors help - street, door, stolen thing. You say them so often they wear smooth.[[/if]]\n\nYour projections become legendary at Ridgewell, even as you hide what they're for. First-years follow you down corridors.[[if flag:pip_friend]] Pip follows you everywhere, Admiral the frog peering out of a pocket, taking notes.[[/if]]\n\nThen graduation comes, all at once, the way graduations do. Professor Worthington offers you a teaching post - real, permanent, with a room of your own and forty pounds a year. And Molly comes to you one night, shining, to say she's found a ship: a real one, in a dream-harbour off the coast of the conceptual seas, with a crew in want of a captain.\n\nYour bond is strong enough now for a safe merger. Everyone who knows about it agrees on that.\n\nThe question is whether it's still what you want.",
        choices: [
            { text: "Merge with Molly and become pirates", nextScene: "grace_epilogue_peaceful" },
            { text: "Accept the teaching position", nextScene: "teacher_ending" },
            { text: "Remain friends but stay separate", nextScene: "friends_ending" },
            { text: "Open a secret school in the old bank, for first-years like Pip", nextScene: "pips_teacher", requires: "flag:pip_friend" }
        ],
        relationshipChanges: { "Molly Roger": 10 },
        psychicChange: 5,
        selfChange: 10 // time to grow into it
    },

    grace_warning: {
        theme: "neutral",
        location: "old_bank",
        speaker: "Grace",
        act: 6,
        text: "Before anyone lights a candle, Grace sits you both down on the dusty floor of the old bank - you, and Molly, who for once does as she's told.\n\n'Safeguards,' she says. 'My grandmother wrote them down after Roger's merger, and the Board burned every copy but one.' She unfolds it: brittle paper, a neat old hand. 'One. You do it only when you're both certain, not just eager. Two. You have a witness who knows your name, and will say it out loud if you start to forget it. Three. Anchors.' She looks at you. 'You know your anchors?'\n\n[[if flag:anchored]]Street. Door. Stolen thing. You say them, and Grace nods.[[else]]You don't. She teaches you three, there on the floor: the street you were born on, your mother's front door, the first thing you ever stole. You say them until they hold.[[/if]]\n\nMolly is quiet through all of it. At the end she says, gruffly, 'Ye'd have liked my Roger, Grace. He was careful too.'\n\nIt isn't the fast path. But it's a careful one, and when it's done you feel steadier than you have in weeks.",
        choices: [
            { text: "Proceed to the ritual, now properly prepared", nextScene: "bank_ritual", relationshipChanges: { "Molly Roger": 15, "Grace": 10 }, psychicChange: 2 },
            { text: "Decide it's too risky after all - walk away", nextScene: "friends_ending" }
        ],
        psychicChange: 1,
        selfChange: 15, // anchoring phrases
        setFlags: ["grace_witness"]
    },

    roger_story: {
        theme: "neutral",
        location: "old_bank",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "sad" }],
        act: 6,
        text: "Grace tells it plainly, sitting on the bank's long counter with her knees drawn up.\n\nHer grandmother, Eleanor Hale, learned projection at Roger Molly's kitchen table and went on to teach it at Ridgewell, back when Ridgewell let its teachers have opinions. Forty years ago, in this very building, she stood witness at Roger's merger. She held his hand. She said his name every few minutes, as the rules required, until two voices answered. Afterwards she wrote it all down: every safeguard, every word.\n\nThe Board took her post for it. Then her pension. Then her name off the school's roll of honour, then the record of the merger itself. By the time Grace was born, the official history said Roger Molly had been a sad case of psychic breakdown, and that Eleanor Hale had never existed.\n\n'They didn't fear that it failed,' Grace says. 'They feared that it worked.' She looks round the empty bank - the cobwebs, the moonlight on the brass grilles. 'If a merger can be done well - carefully, willingly, with a witness - then every story they tell about Hollow Ones is a lie. And then what are they for?'",
        choices: [
            { text: "This gives you confidence - proceed to the ritual", nextScene: "bank_ritual" },
            { text: "Ask Grace to stand witness for you too", nextScene: "grace_warning" }
        ],
        relationshipChanges: { "Grace": 10 },
        psychicChange: 1
    },

    reason_with_professor: {
        theme: "institution",
        location: "ritual_chamber",
        speaker: null,
        cast: [{ who: "Professor Worthington", mood: "thoughtful" }],
        act: 6,
        text: "'This isn't consumption,' you tell Worthington, standing your ground. 'It's collaboration. Ask Roger Molly, if you don't believe me - he's still in there, and he's not sorry.'\n\nWorthington hesitates, torn between fear and something that might be doubt. Whether he stands his enforcers down depends on whether you've given him any reason, until now, to trust you.",
        choices: [
            {
                text: "See if he listens",
                risky: true,
                // Trust is usually low by now (planning the ritual and the ritual itself both cost it),
                // but if he's already your ally, he listens.
                nextScene: (s) => (s.flags.has("worthington_ally") || s.relationships["Professor Worthington"] >= 10) ? "ritual_complete" : "silenced",
                targets: ["ritual_complete", "silenced"]
            },
            { text: "Hold up the brass feather", nextScene: "brass_bird", requires: "item:brass_feather" },
            {
                text: "Hand him Roger Molly's letters",
                nextScene: "letters_for_worthington",
                requires: "item:roger_letters"
            },
            { text: "Give up talking and act fast instead", nextScene: "escape_attempt" }
        ]
    },

    letters_for_worthington: {
        theme: "institution",
        location: "ritual_chamber",
        speaker: "Professor Worthington",
        cast: [{ who: "Professor Worthington", mood: "sad" }],
        act: 6,
        text: "You press the bundle of letters into his hands. Worthington means to toss them aside - and then he sees the handwriting, and stops.\n\nHe reads one. Then another. The enforcers shift their weight behind him. The last letter is only two words long, and he reads it three times.\n\n'He was happy,' Worthington says at last, as if the idea had never once occurred to him. 'All these years, I told my students he was a cautionary tale. He was happy.'\n\nHe folds the letters carefully and raises a hand. The enforcers stand down.[[if suspicion>=40]] Inspector Vane looks at him for a long moment, then closes her ledger without a word.[[/if]]",
        choices: [
            { text: "Finish what you started", nextScene: "ritual_complete" }
        ],
        relationshipChanges: { "Professor Worthington": 25 },
        selfChange: 5
    },

    vane_anticipates: {
        theme: "institution",
        location: "ritual_chamber",
        speaker: "Inspector Vane",
        act: 6,
        text: "Molly conjures a squall of illusory gulls and cannon-smoke - and Inspector Vane doesn't so much as blink.\n\n@vane: 'Gulls,' she says, turning a page in her ledger. 'Page forty-one. Smoke, page forty-three. You've been very thorough in showing me what you can do, {name}. I've been very thorough in writing it down.'\n\nThe enforcers aren't looking at the gulls. They're already at your sides.",
        choices: [
            { text: "There's nowhere left to run", nextScene: "silenced" }
        ],
        relationshipChanges: { "Inspector Vane": 5 }
    },

    escape_attempt: {
        theme: "dream",
        location: "ritual_chamber",
        speaker: null,
        cast: [{ who: "Molly Roger", mood: "pleased" }],
        act: 6,
        text: "'Gulls!' Molly roars. 'Smoke! Give 'em the whole Navy!'\n\nThe chamber erupts. Illusory gulls wheel shrieking round the enforcers' heads. Cannon-smoke rolls across the floor, thick and grey and smelling convincingly of powder. Somewhere a bosun's whistle shrills. One enforcer fires his dampening-lamp at a gull, which bursts into feathers and a rude word.\n\nIn the chaos you kneel in the circle, take Molly's hands, and finish the binding - breathless, half-laughing, entirely too close for comfort. The last thing you see before the light takes you is Worthington, coughing in the smoke, wearing an expression that is very nearly a smile.",
        choices: [
            { text: "Finish becoming whole", nextScene: "ritual_complete" }
        ],
        relationshipChanges: { "Molly Roger": 10 },
        psychicChange: 2,
        selfChange: -5
    },

    reversal_attempt: {
        theme: "dream",
        location: "ritual_chamber",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "thoughtful" }],
        act: 6,
        text: "You try to pull back, to unmake what's been done - but a merger, once willingly begun, doesn't unravel so easily. Molly's voice, gentler now than you've ever heard it, tells you it's alright, that you don't have to be afraid, that you can still choose how you live this.\n\n[[if self>=60]]You find your own edges again - still there, still yours - and slowly, you stop fighting it.[[else]]You reach for the edges of yourself and find them blurred, softer than they used to be. Slowly, because there's nothing else to do, you stop fighting it.[[/if]]",
        choices: [
            { text: "Accept what you've become", nextScene: "grace_epilogue_pirate" }
        ],
        relationshipChanges: { "Molly Roger": 20 },
        psychicChange: 3
    },

    grace_epilogue_pirate: {
        theme: "neutral",
        location: "letter",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "pleased", when: "rel:grace>=50" }, { who: "Grace", mood: "sad", when: "rel:grace<50" }],
        act: 6,
        text: graceEpilogueText,
        choices: [
            { text: "Continue", nextScene: "pirate_life" }
        ]
    },

    grace_epilogue_peaceful: {
        theme: "neutral",
        location: "letter",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "pleased", when: "rel:grace>=50" }, { who: "Grace", mood: "sad", when: "rel:grace<50" }],
        act: 6,
        text: graceEpilogueText,
        choices: [
            { text: "Continue", nextScene: "peaceful_merger" }
        ]
    },
    ritual_eve: {
        act: 6,
        theme: "dream",
        location: "old_bank",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "thoughtful" }],
        text: "The night before the ritual you climb onto the old bank's roof, because it seems like the sort of thing one ought to do the night before something like this. Molly comes too. London hums below you, and the river runs dark and patient through it.\n\n'Can I ask ye something, {lass}?' she says - and it's so unlike her to ask permission that you turn to look at her. 'When we're one... what d'ye want to keep? Of yerself. I don't want to take anything ye'd miss.'\n\nYou think about it properly, because she has asked properly.\n\n[[if flag:anchored]]Your street. Your mother's door. The first thing you ever stole. [[/if]][[if flag:still_mind]]The stillness - the full cup, held. [[/if]][[if flag:cube_sail]]The sail. You'd like to keep the sail. [[/if]][[if flag:perfect_cube]]Even the cube, perhaps. There's something to be said for a straight edge. [[/if]]The way you laugh at the wrong moments. The way you're afraid of heights and climb things anyway.\n\nYou tell her. She listens to every word.\n\n'Done,' she says. 'And I'll give ye the sea. Fair trade?'\n\nBelow you a bell begins to ring the hour, and it doesn't sound like an ending at all.",
        choices: [{ text: "\"Fair trade.\"", nextScene: "bank_planning" }],
        relationshipChanges: { "Molly Roger": 10 },
        selfChange: 10
    }
};

function graceEpilogueText(state) {
    if (state.relationships["Grace"] >= 50) {
        return "Word reaches you, months later, folded into an ordinary letter. Grace has done it. Quietly, carefully, with every safeguard the two of you once discussed, she merged with her own long-suppressed Sight.\n\nShe signs the letter with a new steadiness in her handwriting: 'Grace - and something more.' The Board never even noticed. That, she writes, was rather the point.";
    }
    return "You hear about Grace secondhand, weeks later, from a nervous first-year. She tried her own merger alone, without the safeguards she once tried to teach you.\n\nInspector Vane caught her mid-ritual. She wasn't silenced - not quite - but she was quietly reassigned to a distant parish school, her research confiscated, her name struck from the register of promising students. You never got the chance to say goodbye.";
}
