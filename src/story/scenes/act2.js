// ACT II - THE HEIST

export const act2Scenes = {
    dream_heist: {
        theme: "dream",
        location: "alphabet_vault",
        speaker: "Molly Roger",
        act: 3,
        text: "[[if flag:sea_legs]]You take the wheel without being asked. Molly grins, and lets you.[[else]]Molly takes the wheel. You hold on to anything that will hold still.[[/if]]\n\nThe Dreamspace at the dark of the moon is a sea of concepts and half-memories, black and violet and shot through with lights that might be stars or might be other people's dreams. Islands drift past, built out of forgotten birthdays. A shoal of lost umbrellas turns, flashing, and is gone.\n\nThen the Vault rises out of the dark: the Royal Alphabet Vault, a round iron door the size of a cathedral, studded with rivets, glowing from within. Through the crack around its edge you can see the letters on their shelves - twenty-six of them, polished, each humming its own note.\n\n'There she be,' Molly breathes.\n\nThe Vault is guarded. Conceptual hounds pace its threshold, made of growls and the idea of teeth. The grammar police stand at the door in their tall helmets, their searchlights sweeping the dark in long, correct sentences.\n\n'We need a distraction,' Molly says, 'while I nip in and snatch our prize. Ye've the makings of a fine liar, {lass}. Make 'em look the other way.'\n\nYour projection skills are still raw. But Molly believes in you, which is not something you're used to. This could prove your worth - or get your Sight locked away for good.",
        choices: [
            {
                text: "Create a distraction with false memories",
                setPiece: "vault",
                skipOutcome: "win",
                outcomes: {
                    win: { nextScene: "distraction_success" },
                    lose: { nextScene: "molly_lead", relationshipChanges: { "Molly Roger": -5 }, suspicionChange: 5 }
                }
            },
            { plainOnly: true, text: "Create a distraction with false memories", nextScene: "distraction_success" },
            { text: "Try to reason with the conceptual guardians", nextScene: "reason_attempt" },
            { text: "Let Molly take the lead completely", nextScene: "molly_lead", relationshipChanges: { "Molly Roger": -5 } }
        ],
        relationshipChanges: { "Molly Roger": 10 },
        psychicChange: 3,
        selfChange: -5,       // your first deep dive into someone else's dream
        suspicionChange: 10
    },

    distraction_success: {
        theme: "dream",
        location: "alphabet_vault",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "pleased", pos: "right" }, { who: "Inspector Vane", mood: "stern", pos: "left" }],
        act: 3,
        text: "You close your eyes and project the most distracting thing you can think of: a scandal. Specifically, a series of extremely vivid and entirely invented royal scandals, each more improbable than the last, fanned out across the dark like a hand of cards.\n\nThe grammar police are only human, or near enough. Their searchlights swing. Their helmets turn. One of them actually takes out a notebook.\n\nMolly slips past them like a rumour. A moment later she's back with the W held over her head like a trophy, and the two of you are running, and laughing, while the Vault's alarms ring out behind you in perfect Received Pronunciation.\n\nThe letter W disappears from British consciousness. It will be gone for three glorious days.\n\nWhen you're safe, Molly laughs until she has to sit down. 'Ye've the makings of a proper pirate!' Then the laugh goes out of her, slowly, like a tide. 'Now. About that body I need...'\n\nShe tells you what she wants, plainly, for the first time: to be real. Not a dream somebody has, but a person who has dreams. She thinks you could help her do what Roger Molly did.\n\nBack in the waking halls of Ridgewell, a little before dawn, you pass a woman in Board grey standing very still at the end of the corridor, a small ledger open in her gloved hands. [[if visited:report]]You recognise her from Worthington's doorway. [[/if]]Inspector Vane doesn't call out. She simply watches you walk past, makes a single mark, and closes the book.",
        choices: [
            { text: "Promise to help her become real", nextScene: "without_w", relationshipChanges: { "Molly Roger": 25 }, selfChange: -10, setFlags: ["promised_molly"] },
            { text: "Suggest finding another way", nextScene: "alternative_solutions" },
            { text: "Ask what happened to Roger Molly exactly", nextScene: "roger_fate" }
        ],
        relationshipChanges: { "Molly Roger": 15, "Inspector Vane": -10 },
        psychicChange: 2,
        selfChange: -5, // projecting false memories leaves a residue
        suspicionChange: 15, // Vane makes her mark
        setFlags: ["met_vane"],
        addItems: ["stolen_w"]
    },

    transformation_questions: {
        theme: "dream",
        location: "dreamspace",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "thoughtful" }],
        act: 3,
        text: "Molly's projection flickers, the way a candle does when somebody opens a door in another room.\n\n'Roger Molly,' she says. 'Everyone tells it like he vanished. He didn't. We merged. Two souls in one skin, like sailors sharing a hammock - one sleeps while the other keeps watch, and in the morning ye swap.'\n\nShe holds out her hand. You take it, and the observatory goes away.\n\nYou see a narrow life in Lombard Street: ledgers, inkwells, a rented room with one window, a man in sleeve-garters who whistled sea shanties under his breath and never knew why. You see a ship that existed only between the columns of his figures, sailed by a woman who was all the things he had never let himself be - loud, brave, rude, delighted. And you see the night they met properly, halfway between his world and hers, and understood that neither of them was finished without the other.\n\n'They call it a merger,' Molly says quietly, when the observatory comes back. 'Makes it sound like banking. It's more like... becoming whole. He got adventure. I got reality. We both got to be someone new.'\n\nShe looks at you sidelong. 'It's not a thing ye do to someone, {lass}. It's a thing ye do with them.'",
        choices: [
            { text: "That sounds wonderful", nextScene: "embrace_possibility", relationshipChanges: { "Molly Roger": 15 }, selfChange: -5 },
            { text: "That sounds terrifying", nextScene: "fear_possibility", relationshipChanges: { "Molly Roger": -10 } },
            { text: "Ask if you could meet Roger Molly", nextScene: "meet_roger" }
        ],
        relationshipChanges: { "Molly Roger": 5 },
        psychicChange: 1
    },

    help_molly: {
        theme: "dream",
        location: "dreamspace",
        speaker: "Molly Roger",
        act: 6,
        text: "[[if visited:ledger_rewrite]]Back in the waking world, in the old bank, Molly sits on the long counter swinging her legs - solid again, mostly. The Board is in disarray; Lady Harrowgate hasn't been seen since the night of the Ledger. For the first time in a long while, the next move is yours.\n\n[[/if]]Molly's excitement fills the room like weather. 'There be two paths, {lass}!' She holds up one finger. 'The slow way: months of practice, the way Roger did it. Evenings and Sundays, learning each other's edges, till the merger's as easy as shutting a door.' A second finger. 'Or the fast way: a ritual, here, in the old bank where he worked. There's psychic residue in these walls thick as treacle. One night. Risky - but done.'\n\nShe doesn't say which she wants. She doesn't have to; you can see it in the way she keeps looking at her own hand, checking it's still there.[[if flag:worthington_ally]]\n\nWorthington, when you tell him, takes off his spectacles and polishes them for a very long time. 'Whichever you choose,' he says at last, 'I should like to be at the door.'[[else]]\n\nMeanwhile, Professor Worthington has noticed your unusual psychic activity. He sends a note in his careful hand: a place on the approved psychics' list is still open to you, if you will renounce Molly's influence. He has underlined 'still' twice.[[/if]]",
        choices: [
            { text: "Begin slow training with Molly", nextScene: "slow_path", relationshipChanges: { "Molly Roger": 10, "Professor Worthington": -20 } },
            { text: "Plan the bank ritual", nextScene: "vane_confrontation", relationshipChanges: { "Molly Roger": 15, "Professor Worthington": -30 }, selfChange: -10 },
            { text: "Consider Worthington's offer", nextScene: "worthington_offer", relationshipChanges: { "Molly Roger": -25, "Professor Worthington": 20 }, hideWhen: "flag:worthington_ally" },
            { text: "Build a sanctuary where projections can live without merging", nextScene: "lending_library", requires: "flag:sanctuary_idea & flag:ally_grace" }
        ],
        relationshipChanges: { "Molly Roger": 5 },
        psychicChange: 1
    },

    reason_attempt: {
        theme: "dream",
        location: "alphabet_vault",
        speaker: null,
        act: 3,
        text: "You step forward, addressing the conceptual hounds and grammar police directly. 'We mean no lasting harm - only a brief loan, freely returned.'\n\nThe guardians pause, considering. Whether they yield depends on how convincingly you've mastered your own mind so far - and whether Molly trusts you enough to let you speak for her.",
        choices: [
            {
                text: "See if your words are enough",
                risky: true,
                // Both halves of the description now count: mastery AND Molly's trust.
                nextScene: (s) => (s.psychicLevel >= 8 && s.relationships["Molly Roger"] >= 40) ? "reason_success" : "silenced",
                targets: ["reason_success", "silenced"]
            },
            { text: "Retreat and let Molly handle it", nextScene: "molly_lead" }
        ]
    },

    molly_lead: {
        theme: "dream",
        location: "alphabet_vault",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "sad" }],
        act: 3,
        text: "You hang back, letting Molly work alone. She's audacious but reckless without a steadying hand - she comes back clutching only a stray comma instead of the full letter, a smaller victory, and a flicker of disappointment crosses her projection.\n\n'Ye could've helped, {lass}. Still - not nothing, eh?'",
        choices: [
            { text: "Ask what she plans to do with it", nextScene: "without_w" },
            { text: "Promise to be braver next time", nextScene: "distraction_success" }
        ],
        relationshipChanges: { "Molly Roger": -5 },
        psychicChange: 1,
        addItems: ["stray_comma"]
    },

    alternative_solutions: {
        theme: "dream",
        location: "dreamspace",
        speaker: null,
        cast: [{ who: "Molly Roger", mood: "thoughtful" }],
        act: 3,
        text: "'What if,' you say slowly, 'you didn't have to become real? Not all the way?'\n\nMolly looks at you as if you've suggested she take up knitting.\n\nBut you keep going, because the idea is getting bigger as you say it. What if there were places - sanctuaries - where projections could simply live? Not cut out and quieted, not fused into somebody else's skin, but kept, the way a library keeps books: on a shelf of their own, taken out and loved and brought back. Half real. Real enough.\n\nMolly crosses her arms. Her hat, unaccountably, tilts in a sceptical direction all by itself.\n\n'Never heard of such a place,' she says.\n\n'Nobody's built one yet.'\n\nThe silence goes on just long enough for you to realise she isn't dismissing it. She's thinking. 'Ye'd need someone with a head for rules,' she says at last. 'And a building nobody wants. And a sight more nerve than the Board has.' She squints at you. 'Clever. Not sure I like it. Clever, though.'",
        choices: [
            { text: "Research sanctuary theory with Grace", nextScene: "grace_connection" },
            { text: "Decide the safe theory isn't enough - help her merge after all", nextScene: "without_w", relationshipChanges: { "Molly Roger": 10 }, setFlags: ["promised_molly"] }
        ],
        psychicChange: 1,
        selfChange: 5,
        setFlags: ["sanctuary_idea"]
    },

    roger_fate: {
        theme: "dream",
        location: "dreamspace",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "thoughtful" }],
        act: 3,
        text: "Molly is quiet for a long moment. Then she tells it properly - not the legend, which has thunder in it, but the truth, which has mostly Tuesday evenings.\n\nRoger Molly didn't vanish in a flash of light. He practised. Every evening after the bank closed he would sit in his rented room with the curtains drawn and let her a little further in: an hour, then two, then whole Sundays. Some evenings it went wrong, and he spent the night convinced his name was Captain Something. Some evenings she went too quiet, and he was frightened she'd gone for good. They learned each other's edges the way you learn a house in the dark.\n\nIt took them fourteen months. By the end, the merger didn't feel like a leap. It felt like closing a door gently behind them.\n\n'He wasn't reckless, {lass},' Molly says. 'He was ready. That's the difference. Everyone who tells ye about Roger Molly tells ye about the jump. Nobody tells ye about the fourteen months of walking up to the edge.'",
        choices: [
            { text: "That settles it - commit to helping her merge", nextScene: "without_w", relationshipChanges: { "Molly Roger": 10 }, setFlags: ["promised_molly"] },
            { text: "You want proof this is safe first - find Grace", nextScene: "grace_connection" }
        ],
        psychicChange: 1,
        selfChange: 5,
        setFlags: ["knows_roger_truth"]
    },

    grace_training: {
        theme: "neutral",
        location: "grace_hideout",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "afraid" }],
        act: 3,
        text: "Weeks of secret training follow. Grace is a patient, exacting teacher, and your projections sharpen from shimmering guesses into deliberate, controlled shapes.\n\nOne evening she sets down her chalk and admits something she hasn't told anyone: she's been quietly working against the Board for years, ever since they erased her grandmother's part in Roger Molly's story. She's not just teaching you. She's recruiting you.\n\nA shadow crosses the frosted glass of the library door. Grace goes still, chalk halfway to the slate, until the footsteps pass on. 'Inspector Vane,' she says quietly, once it's safe. 'She doesn't knock. She just... checks. She's been checking on me for a year.'",
        choices: [
            { text: "Continue toward Molly's heist", nextScene: "practice" },
            { text: "Ask Grace to stand witness for you, when the time comes", nextScene: "practice", relationshipChanges: { "Grace": 5 }, setFlags: ["grace_will_witness"] }
        ],
        relationshipChanges: { "Grace": 10, "Inspector Vane": -5 },
        psychicChange: 3,
        selfChange: 10, // control, not just power
        suspicionChange: 5
    },

    embrace_possibility: {
        theme: "dream",
        location: "dreamspace",
        speaker: "Molly Roger",
        act: 3,
        text: "You let yourself imagine it fully - a life fused with Molly's spirit, adventure and caution woven together. Molly lights up at your enthusiasm and pulls you deeper into Dreamspace, showing you flickering visions of possible futures: a ship's deck, a lecture hall, a sanctuary built from stolen concepts.\n\n'See? It's not an ending, {lass}. It's a whole new chapter.'",
        choices: [
            { text: "Pursue this - join the dream heist", nextScene: "dream_heist" },
            { text: "Ask what could go wrong, just to be sure", nextScene: "fear_possibility" }
        ],
        relationshipChanges: { "Molly Roger": 10 },
        psychicChange: 1,
        selfChange: -5
    },

    fear_possibility: {
        theme: "dream",
        location: "dreamspace",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "sad" }],
        act: 3,
        text: "Molly's bravado drops, just for a moment, and you see what's under it: someone who has thought about this a great deal more than she lets on.\n\n'Mergers can go wrong,' she says. 'Aye. Rush it, or do it without trust between ye, and some psychics come out the other side... hollow. The Board calls 'em Hollow Ones. Husks wearing a person's face. Ye'll hear stories at school. They're very fond of those stories at school.'\n\nShe sits on the edge of the telescope platform, boots dangling over nothing.\n\n'I saw one, once. A lad who tried to swallow his projection whole, because someone told him it was the only way to keep it. At least, that's what the Board said he'd done.' She frowns at nothing. 'There was nothing left of him but good manners.'\n\nShe meets your eyes, unusually serious. 'That's why I'd rather wait for ye to be ready than have ye be sorry. I'm a pirate, {lass}. I'm not a monster.'",
        choices: [
            { text: "Agree - build trust slowly first", nextScene: "practice" },
            { text: "Decide the risk isn't worth it - report to Worthington", nextScene: "report", relationshipChanges: { "Molly Roger": -15 } }
        ],
        selfChange: 5,
        setFlags: ["knows_hollow"]
    },

    meet_roger: {
        theme: "dream",
        location: "dream_inner",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "thoughtful" }],
        act: 3, // was 1, but it is only reachable from Act II
        text: "Molly hesitates - you've never seen her hesitate - and then takes you deeper into the Dreamspace than you've ever been. Past the sea of stolen concepts, past the islands of lost things, down a corridor of warm arches that grow smaller as you go, like the inside of a shell.\n\nAt the centre is a room that smells of ink and tar and good tobacco. Someone is sitting in it. Or two someones. It's hard to tell.\n\nThe presence that greets you is not quite Roger and not quite Molly, but both at once: a careful, polite voice with a laugh hidden underneath it, a clerk's sleeve-garters and a pirate's earring, a face that keeps settling into one and then the other, the way a spun coin settles.\n\n@roger: 'So you're the new one,' it says kindly. 'She's told me about you. She hardly ever tells me about anyone.'\n\nYou ask - because you have to - whether it hurt. The presence considers the question with real seriousness.\n\n@roger: 'Losing things hurts,' it says. 'This wasn't losing. I had a small life, and she had a big dream, and now we have a medium-sized life with excellent stories in it.' The smile turns thoughtful. 'But the Board's grown crueller since my time. They used to be frightened of people like us. Now they're organised about it. Be careful who you trust with your plans.'",
        choices: [
            { text: "Feel reassured - continue toward practice", nextScene: "practice" },
            { text: "Ask what 'crueller' means now", nextScene: "grace_connection" }
        ],
        relationshipChanges: { "Molly Roger": 10 },
        psychicChange: 2,
        selfChange: 5,
        setFlags: ["met_roger_molly"]
    },

    worthington_offer: {
        theme: "institution",
        location: "worthington_office",
        speaker: "Professor Worthington",
        cast: [{ who: "Professor Worthington", mood: "afraid" }],
        act: 6,
        text: "You meet Worthington privately, in his cramped, mothball-scented office, and for the first time you notice how much of it is an apology: the neat stacks, the polished brass, the framed certificate from the Board hung exactly level.\n\nHe isn't cruel, you realise. He's afraid. He shows you files - real ones, with photographs - of psychics who merged badly and came out the other side empty. A girl from Leeds who forgot her mother's name. A boy who laughs at nothing, all day, every day. 'Hollow Ones,' he says. 'You'll have heard the word. You'll not have seen what it means.'\n\n'I can protect you from that,' he says quietly. Then, lower: 'Inspector Vane already suspects. If it comes from me first, I might be able to soften how this goes for you. If it comes from her alone, I can promise nothing.'\n\nHe folds his hands on the desk. They aren't quite steady. 'I'm asking you to tell me where Molly Roger means to do it. That's all. One address. Then you can go back to being a student, and I can go back to pretending I don't know what you are.'",
        choices: [
            { text: "Betray Molly's plans to protect yourself", risky: true, nextScene: "informant", relationshipChanges: { "Inspector Vane": 20, "Molly Roger": -40, "Grace": -40 }, suspicionChange: -30 },
            { text: "Protect Molly and lie to his face", nextScene: "bank_planning", relationshipChanges: { "Professor Worthington": -10 }, suspicionChange: 5 }
        ],
        setFlags: ["knows_hollow"]
    },

    contact_molly_late: {
        theme: "dream",
        location: "dreamspace",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "angry" }],
        act: 3,
        text: "That night you reach into Dreamspace, desperate, calling for her. Molly appears, arms crossed, wary in a way she never was before.\n\n'Changed yer mind, have ye? Trust's not so easily won back, {lass}.' She'll work with you - but she keeps you at arm's length from here on.",
        choices: [
            { text: "Prove yourself through practice", nextScene: "practice" },
            { text: "Accept a more cautious, distant partnership", nextScene: "friends_ending" }
        ],
        relationshipChanges: { "Molly Roger": 5 },
        psychicChange: 0,
        suspicionChange: 5
    }
};
