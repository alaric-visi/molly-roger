// ACT II - THE MICHAELMAS TERM, AND LONDON WITHOUT A W
// Three weeks until the Vault opens. Each week the player picks one activity
// (counters.term goes up by one per activity). After three, the heist.

const backToTerm = { text: "Back to the term", nextScene: "term_hub" };

export const termScenes = {
    term_begins: {
        act: 3,
        theme: "dream",
        location: "observatory",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "pleased" }],
        text: "'Not tonight!' Molly laughs at your face. 'Did ye think the Royal Alphabet Vault just leaves its door ajar? It opens at the dark of the moon, and not a night before. Three weeks hence.'\n\nShe paces the observatory floor, her boots making no sound at all. 'Three weeks is a gift, {lass}. A crew's only as good as its sea legs. Learn what ye can. Make friends. Make trouble, if ye must - small trouble.' A wink. 'Save the big trouble for me.'\n\nOutside, the moon is a fat, unhelpful coin. Far below, the school bell rings in the Michaelmas term.",
        choices: [
            { text: "Begin the term", nextScene: "term_hub" }
        ]
    },

    term_hub: {
        act: 3,
        theme: "neutral",
        location: "ridgewell_term",
        speaker: null,
        text: "THE MICHAELMAS TERM.\n\n[[if count:term==0]]Three weeks until the dark of the moon. Ridgewell carries on around you, oblivious: bells, porridge, Latin, chalk.[[/if]][[if count:term==1]]Two weeks left. The moon is thinning. Molly has started humming in your sleep.[[/if]][[if count:term==2]]One week left. You catch yourself checking the sky between lessons, like a sailor - or a thief.[[/if]][[if count:term>=3]]The moon has shrunk to a paring of fingernail. Tonight is the night.[[/if]]\n\n[[if count:term<3]]How will you spend the week?[[/if]]",
        choices: [
            { text: "Take lessons in secret from Grace", nextScene: "term_grace", requires: "count:term<3", hideLocked: true, hideWhen: "visited:term_grace" },
            { text: "Sail the night seas of Dreamspace with Molly", nextScene: "term_sailing", requires: "count:term<3", hideLocked: true, hideWhen: "visited:term_sailing" },
            { text: "Stay behind for Professor Worthington's extra tutorial", nextScene: "term_tutorial", requires: "count:term<3", hideLocked: true, hideWhen: "visited:term_tutorial" },
            { text: "Find out why everyone is laughing at a first-year", nextScene: "term_pip", requires: "count:term<3", hideLocked: true, hideWhen: "visited:term_pip" },
            { text: "Break into the restricted stacks at midnight", nextScene: "term_restricted", risky: true, requires: "count:term<3", hideLocked: true, hideWhen: "visited:term_restricted" },
            { text: "Write home, eat properly and sleep", nextScene: "term_rest", requires: "count:term<3", hideLocked: true, hideWhen: "visited:term_rest" },
            { text: "The dark of the moon: meet Molly at the Vault", nextScene: "heist_eve", requires: "count:term>=3", hideLocked: true },
            { text: "Tell Molly you're ready now, whatever the moon says", nextScene: "dream_heist", selfChange: -5, hideWhen: "count:term>=3" }
        ]
    },

    term_grace: {
        act: 3,
        theme: "neutral",
        location: "grace_hideout",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "thoughtful" }],
        text: "[[if !flag:knows_hideout]]Grace finds you before you find her. She takes you by the elbow, walks you to a bookcase in the Combination Library, and pulls on a copy of Hume until the whole shelf swings inward.\n\n[[/if]]'Projection's the easy part,' Grace says, chalk squeaking. 'Anyone with the Sight can throw a shape. The hard part is coming back.'\n\nShe makes you write three things on the slate: the street you were born on, the colour of your mother's front door, the taste of the first thing you ever stole. 'Anchors,' she says. 'When something bigger than you is pulling, you say those, in that order, and you remember which way is home.'\n\nYou say them until they stop sounding like words and start sounding like a rope.",
        choices: [backToTerm],
        relationshipChanges: { "Grace": 15 },
        selfChange: 15,
        psychicChange: 1,
        setFlags: ["knows_hideout", "anchored"],
        counters: { term: 1 }
    },

    term_sailing: {
        act: 3,
        theme: "dream",
        location: "dreamspace",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "pleased" }],
        text: "Molly teaches you to sail a sea made of everything anyone has ever forgotten. The waves are lost umbrellas and unsent letters; the spray tastes of names on the tip of the tongue.\n\n'Steer by feeling, not by sight!' she bellows, as you take the wheel of a ship she dreamed up out of a rowing boat and sheer stubbornness. You run aground on a sandbank of misplaced keys. You steal the smell of rain from a sleeping bishop. By the third night you can tack into a nightmare and out again without spilling your tea.\n\nYou wake each morning a little more salt, a little less yourself, and grinning.",
        choices: [backToTerm],
        relationshipChanges: { "Molly Roger": 15 },
        psychicChange: 3,
        selfChange: -5,
        setFlags: ["sea_legs"],
        counters: { term: 1 }
    },

    term_tutorial: {
        act: 3,
        theme: "institution",
        location: "worthington_office",
        speaker: "Professor Worthington",
        cast: [{ who: "Professor Worthington", mood: "thoughtful" }],
        text: "Worthington's extra tutorials are attended by exactly one student: you. He drills you on containment theory until your head aches, and then, unexpectedly, makes cocoa.\n\nWhile he's at the stove you doodle in your margin without thinking - a bird, wings half open. When he sets the cup down he sees it, and the cup rattles in its saucer.\n\nHe says nothing. But when he opens his desk drawer for a pencil you glimpse something inside, wrapped in a handkerchief: a single feather made of brass, polished by years of handling. He shuts the drawer a little too quickly.\n\n'Again,' he says. 'From the third principle.'",
        choices: [backToTerm],
        relationshipChanges: { "Professor Worthington": 15 },
        psychicChange: 1,
        suspicionChange: -5,
        setFlags: ["saw_brass_bird"],
        counters: { term: 1 }
    },

    term_pip: {
        act: 3,
        theme: "institution",
        location: "corridor",
        speaker: null,
        cast: [{ who: "Pip", mood: "afraid" }],
        text: "The first-year is called Pip, is eleven years old, and three days ago projected a frog during morning assembly. Not a cube. A frog. It sat on the Headmaster's lectern and said, quite distinctly, 'ribbit'.\n\nNow three prefects have Pip backed against a radiator, demanding that the frog be produced for 'inspection'. Pip's hands are shaking, and something in Pip's coat pocket is shaking too.\n\nThe prefects haven't noticed you yet.",
        choices: [
            { text: "Step in and stand up for Pip", nextScene: "term_pip_stand", relationshipChanges: { "Pip": 25 }, suspicionChange: 5 },
            { text: "Wait until they've gone, then teach Pip to hide the frog", nextScene: "term_pip_hide", relationshipChanges: { "Pip": 15 } },
            { text: "Keep walking. It's none of your business.", nextScene: "term_hub", selfChange: -5 }
        ],
        counters: { term: 1 }
    },

    term_pip_stand: {
        act: 3,
        theme: "institution",
        location: "corridor",
        speaker: "Pip",
        cast: [{ who: "Pip", mood: "pleased" }],
        text: "'The frog,' you announce, 'is mine. I'm conducting an approved study of amphibian projection under Professor Worthington. Would you like to fill in the forms? There are eleven.'\n\nThe prefects flee from the paperwork as if it were on fire.\n\nPip peels off the radiator and stares at you. Then, very carefully, Pip opens the coat pocket. A small green face peers out, unimpressed.\n\n'His name's Admiral,' Pip says. 'He doesn't like cubes either.'",
        choices: [backToTerm],
        setFlags: ["pip_friend"]
    },

    term_pip_hide: {
        act: 3,
        theme: "neutral",
        location: "corridor",
        speaker: "Pip",
        cast: [{ who: "Pip", mood: "pleased" }],
        text: "When the prefects have gone you crouch down beside Pip and show the trick Molly showed you: how to fold a projection small, smaller, until it's no bigger than a thought and fits behind your ear.\n\nIt takes Pip four tries. On the fifth, Admiral the frog vanishes with a faint, offended 'ribbit', and Pip's whole face lights up.\n\n'Will you teach me more?' Pip whispers. 'Not cubes. The real things.'",
        choices: [backToTerm],
        psychicChange: 1,
        setFlags: ["pip_friend"]
    },

    term_restricted: {
        act: 3,
        theme: "neutral",
        location: "library",
        speaker: null,
        text: "At midnight the Combination Library is a different country. You pick the lock on the restricted stacks with a hairpin and a projected key that only half exists.\n\n@none: Roger Molly's letters are where you left them. But behind them, newer, sits a red folder: ON THE MANAGEMENT OF PERSISTENT PROJECTIONS. It recommends 'quieting' at an establishment called the Quiet Ward, sub-basement, Board Offices, Whitehall. The signature at the bottom is all loops and certainty: H. Harrowgate, Chair.\n\nYou take the circular. On the way out, a lamp is burning in the corridor that wasn't burning when you came in.",
        choices: [backToTerm],
        psychicChange: 1,
        suspicionChange: 15,
        addItems: ["board_circular"],
        setFlags: ["knows_quiet_ward"],
        counters: { term: 1 }
    },

    term_rest: {
        act: 3,
        theme: "neutral",
        location: "letter",
        speaker: null,
        text: "You write home. It takes four drafts, because the first three mention pirates.\n\nYou eat porridge that tastes of porridge and nothing else. You sleep nine hours without dreaming of the sea. On Sunday you walk by the river and watch real ships, made of real wood, doing real and boring things, and it is wonderful.\n\nWhen you look in the mirror on Monday, the face looking back is unmistakably, reassuringly yours.",
        choices: [backToTerm],
        selfChange: 20,
        counters: { term: 1 }
    },

    // Talking your way into the Vault (from reason_attempt).
    reason_success: {
        act: 3,
        theme: "dream",
        location: "alphabet_vault",
        speaker: "The Captain",
        cast: [{ who: "The Captain", mood: "stern", pos: "left" }, { who: "Molly Roger", mood: "afraid", pos: "right" }],
        text: "The tallest of the grammar police steps forward - a Captain, by the subordinate clauses on his sleeve. He looks at you for a long, punctuated moment.\n\n@captain: 'A loan,' he says. 'Freely returned. In writing.' He produces a form in triplicate. Molly gapes. You sign.\n\n'Three days,' the Captain says, stamping it. 'Return by Thursday, in good condition, with all serifs intact.' He hands Molly the letter W as if it were a borrowed umbrella. 'And do mind the full stops on your way out.'\n\nMolly is almost speechless. Almost. 'Ye talked us IN, {lass}. Nobody talks their way in.'",
        choices: [
            { text: "Promise to help her become real", nextScene: "without_w", relationshipChanges: { "Molly Roger": 15 }, setFlags: ["promised_molly"] },
            { text: "Suggest finding another way", nextScene: "alternative_solutions" },
            { text: "Ask what happened to Roger Molly exactly", nextScene: "roger_fate" }
        ],
        relationshipChanges: { "Molly Roger": 20 },
        psychicChange: 2,
        suspicionChange: 5,
        addItems: ["stolen_w"],
        setFlags: ["captain_owes"]
    },

    without_w: {
        act: 3,
        theme: "neutral",
        location: "london_street",
        speaker: null,
        cast: [{ who: "Molly Roger", mood: "pleased" }],
        text: "For three days, the British Empire stammers.\n\nShop signs read HITE HART and ORKSHOP and BOOTS & ELLINGTONS. The Times appears with the headline HAT HAS HAPPENED? and nobody can say why it looks wrong. Professor Worthington begins his Monday lecture - '...elcome, students. Today... e shall... discuss...' - and sits down quite suddenly, pale.\n\nParliament spends an afternoon unable to ask why, and passes four bills by accident. Children love it. Poets weep with joy. Molly wears the W as a brooch and refuses to take it off.\n\nOn the third evening, carriages bearing the Board's seal begin to arrive at Ridgewell, one after another, in silence.[[if flag:captain_owes]]\n\nA stiff note arrives from the grammar police: 'Loan noted. Thursday. - The Captain.'[[/if]]",
        choices: [
            { text: "Enjoy it while it lasts", nextScene: "inquiry_begins" },
            {
                text: "Return the W early, before the Board can trace it",
                nextScene: "inquiry_begins",
                requires: "item:stolen_w",
                removeItems: ["stolen_w"],
                suspicionChange: -15,
                relationshipChanges: { "Molly Roger": -10 },
                setFlags: ["returned_w"]
            }
        ]
    },
    heist_eve: {
        act: 3,
        theme: "dream",
        location: "observatory",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "thoughtful" }],
        text: "The night before the dark of the moon, Molly takes you up onto the observatory roof. The slates are still warm from a day you barely remember, and London spreads out below in a thousand gaslit pinpricks.\n\n[[if visited:term_grace]]'Grace has been teaching ye anchors,' she says. 'Good. She's right, ye know. The coming back's the hard part.'\n\n[[/if]][[if visited:term_sailing]]'Three nights at sea and ye didn't fall in once,' she says. 'Well. Twice. But ye climbed out.'\n\n[[/if]][[if visited:term_tutorial]]'And old Worthington. Cocoa!' She shakes her head. 'There's more in that man than cubes, {lass}. Mark me.'\n\n[[/if]][[if flag:pip_friend]]'And ye've a first-year and a frog following ye about like a pair of ducklings. Suits ye.'\n\n[[/if]]For a while neither of you says anything. A train crosses the river, small and bright.[[if flag:ghost_memory]]\n\n'Funny thing,' Molly says. 'I keep dreamin' we've done this before. Different every time. Ye always come back, though.'[[/if]]\n\n'D'ye know what I was, before?' Molly says suddenly. 'Before I was me? A margin. A space in a ledger where a clerk who never went anywhere drew a ship, every day, for eleven years. I was ink in the gutters of other people's sums.' She laughs a little. 'Ye'd think a body would get tired of being somebody's daydream. I never did. I just wanted to be the one dreaming, for once.'\n\nShe stands, stretches, and is a pirate again.\n\n'Tomorrow,' she says. 'Get some sleep. Thieves need their beauty rest.'",
        choices: [{ text: "Tomorrow, then", nextScene: "dream_heist" }],
        relationshipChanges: { "Molly Roger": 10 },
        selfChange: 5
    }
};
