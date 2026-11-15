// ACT IV - THE LEDGER
// The Grand Erasure. Muster a crew from the allies you've earned, then rob the
// Board's Ledger - in the waking world and the Dreamspace at once.

const backToBank = { text: "Back to the bank", nextScene: "crew_muster" };

export const ledgerScenes = {
    molly_fading: {
        act: 5,
        theme: "dream",
        location: "dreamspace",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "sad" }],
        text: "You find Molly at the edge of Dreamspace, sitting on an upturned boat that keeps forgetting to be there. She's thinner. You can see the sea through her.\n\n'Can't remember the word for what I am,' she says, and tries to laugh. 'Starts with a P. Parson? Parsnip?' The laugh doesn't come off.\n\nShe tells you about the Ledger: the Board's great book, where every decision they've ever made is written down, and which the Dreamspace obeys the way a tide obeys the moon. There are two copies - one in the Board's archive at Whitehall, and its reflection, floating in the deep Dreamspace. Change the book, and you change the world.\n\n'It's a heist, {lass}. The biggest there's ever been. And I can't do it alone. Not like this.' She holds up a hand. It's mostly sea. 'We need a crew.'",
        choices: [
            { text: "Muster a crew", nextScene: "crew_muster" }
        ]
    },

    crew_muster: {
        act: 5,
        theme: "dream",
        location: "old_bank",
        speaker: null,
        text: "The old bank, after midnight. Dust, moonlight, the smell of ledgers. A good place to plan the theft of a bigger one.\n\n[[if flag:ally_grace]]Grace is here, chalk in hand, already drawing maps.\n[[/if]][[if flag:ally_worthington]]Worthington is here, in a coat he has clearly bought specially, looking terrified and proud.\n[[/if]][[if flag:ally_pip]]Pip is here, with Admiral the frog on one shoulder.\n[[/if]][[if flag:ally_roger]]Roger-and-Molly is here, half bank clerk and half buccaneer, quietly counting the exits.\n[[/if]][[if flag:ally_captain]]The Captain of the grammar police is here, correcting the punctuation on the plans.\n[[/if]][[if flag:ally_ashby]]Thomas Ashby is here, with Biscuit the cat asleep on the counter.\n[[/if]][[if flag:ally_vane]]And, impossibly, Inspector Vane is here - standing a little apart, coat buttoned to the chin.\n[[/if]][[if count:allies==0]]So far it's just you, and what's left of Molly.\n[[/if]]\nWho else will you ask?",
        choices: [
            { text: "Ask Grace to join you", nextScene: "recruit_grace", requires: "rel:grace>=30 & !flag:grace_taken", hideWhen: "flag:ally_grace" },
            { text: "Ask Professor Worthington", nextScene: "recruit_worthington", requires: "flag:worthington_ally", hideWhen: "flag:ally_worthington" },
            { text: "Ask Pip", nextScene: "recruit_pip", requires: "flag:pip_friend", hideWhen: "flag:ally_pip" },
            { text: "Call on Roger-and-Molly in the deep Dreamspace", nextScene: "recruit_roger", requires: "flag:met_roger_molly", hideWhen: "flag:ally_roger" },
            { text: "Write to the Captain of the grammar police", nextScene: "recruit_captain", requires: "flag:captain_owes", hideWhen: "flag:ally_captain" },
            { text: "Go back for Thomas Ashby", nextScene: "recruit_ashby", requires: "flag:ashby_restored", hideWhen: "flag:ally_ashby" },
            { text: "Knock on Inspector Vane's door", nextScene: "recruit_vane", requires: "flag:vane_secret", hideWhen: "flag:ally_vane" },
            { text: "Set sail with the crew you have", nextScene: "eve_of_ledger" }
        ]
    },

    recruit_grace: {
        act: 5,
        theme: "neutral",
        location: "old_bank",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "pleased" }],
        text: "Grace doesn't let you finish the question.\n\n'My grandmother stood witness for Roger Molly,' she says. 'The Board erased her for it - her post, her pension, her name. She died in a boarding house in Margate, still writing letters to the Times that nobody printed.' She's quiet for a moment. 'I have been waiting my whole life for someone to give me a reason to be brave instead of careful.'\n\nShe picks up her chalk, weighs it in her hand like a weapon, and smiles - a real smile, the first you've seen from her in weeks.\n\n'I'll draw the maps,' she says. 'And when we get to the Ledger, I want to find her page.'",
        choices: [backToBank],
        relationshipChanges: { "Grace": 10 },
        setFlags: ["ally_grace"],
        counters: { allies: 1 }
    },

    recruit_worthington: {
        act: 5,
        theme: "institution",
        location: "old_bank",
        speaker: "Professor Worthington",
        cast: [{ who: "Professor Worthington", mood: "afraid" }],
        text: "Worthington goes very pale, then very red, then pale again, like a lamp being turned up and down.\n\n'I am fifty-eight years old,' he says. 'I have a bad knee, a pension, a cat called Principle, and a lifetime of cowardice to my name. I have never broken a rule in my life without immediately reporting myself for it.'\n\nHe takes his coat from the hook anyway. His hands shake as he does up the buttons, and he gets them wrong, and does them again.\n\n'The night porter at Whitehall still thinks I'm in the Board's good books,' he says. 'He's a sentimental man. He keeps a photograph of the 1821 intake on his wall, and I'm in the front row.' He settles his hat with great care. 'Let's find out how long that lasts.'\n\nAt the door he stops. 'Tuppence would have liked this,' he says, to nobody in particular. 'She always did enjoy a fuss.'",
        choices: [backToBank],
        relationshipChanges: { "Professor Worthington": 10 },
        setFlags: ["ally_worthington"],
        counters: { allies: 1 }
    },

    recruit_pip: {
        act: 5,
        theme: "neutral",
        location: "old_bank",
        speaker: "Pip",
        cast: [{ who: "Pip", mood: "pleased" }],
        text: "'A HEIST?' Pip says, loudly enough to wake the whole dormitory - and then, at once, in a whisper: 'A heist. Yes. Obviously yes. Do I get a code name? I want to be called the Frog.'\n\nYou point out that Admiral is the frog.\n\n'Admiral is the Admiral,' Pip says, scandalised. 'I'm the Frog. It's completely different.'\n\nAdmiral climbs to Pip's shoulder and settles there like a very small, very damp parrot, surveying the dormitory with the air of a commander inspecting a regrettable ship.\n\nThen Pip goes serious, suddenly, the way children do. 'They took a girl from my year last month,' Pip says. 'She made it snow in the refectory. Everyone laughed, and it was lovely, and then she was gone.' A pause. 'Nobody looks at first-years. We can go anywhere. Let me be useful.'",
        choices: [backToBank],
        relationshipChanges: { "Pip": 15 },
        setFlags: ["ally_pip"],
        counters: { allies: 1 }
    },

    recruit_roger: {
        act: 5,
        theme: "dream",
        location: "dream_inner",
        speaker: "Roger-and-Molly",
        cast: [{ who: "Roger-and-Molly", mood: "thoughtful" }],
        text: "The inner chamber is warm, and smells of ink and tar. The presence that is both Roger and Molly - a bank clerk's careful voice, a pirate's grin - hears the whole plan without interrupting once, its fingers steepled.\n\nWhen you've finished, it is quiet for a long while.\n\n'I kept the Board's accounts for nine years, you know,' it says at last. 'Before I kept my own. The old bank, second floor, the desk by the window. I know how a ledger thinks. Columns. Margins. Where the mistakes like to hide.' The face settles, briefly, into Roger's - mild, spectacled, unexpectedly fierce. 'And I know where they hid Eleanor Hale's page. I filed it myself, God forgive me, before I knew what it was.'\n\nThen it's Molly's grin again, all teeth.\n\n@roger: 'Count me in, {lass}. Count both of me.'",
        choices: [backToBank],
        setFlags: ["ally_roger"],
        counters: { allies: 1 }
    },

    recruit_captain: {
        act: 5,
        theme: "dream",
        location: "alphabet_vault",
        speaker: "The Captain",
        cast: [{ who: "The Captain", mood: "stern" }],
        text: "The Captain's reply arrives within the hour, delivered by a junior grammar policeman who salutes, hands it over, and leaves without using a single contraction.\n\nIt's written on headed paper - OFFICE OF THE ROYAL ALPHABET, GRAMMAR AND PUNCTUATION DIVISION - in a hand so correct it's almost painful to look at.\n\n'Sir or Madam,\n\nErasing a noun by decree is a gross misuse of the language, a personal affront to this Office, and quite possibly unconstitutional - although the constitution is unwritten, and therefore outside our jurisdiction.\n\nThe grammar police will provide an escort through the Ledger's margins. We know them well. We patrol them nightly.\n\nThis does not make us friends.\n\n- The Captain.\n\nP.S. You still owe us a serif.\n\nP.P.S. A postscript to a postscript is irregular, and I apologise for it. Good luck.'",
        choices: [backToBank],
        setFlags: ["ally_captain"],
        counters: { allies: 1 }
    },

    recruit_ashby: {
        act: 5,
        theme: "neutral",
        location: "old_bank",
        speaker: "Thomas Ashby",
        cast: [{ who: "Thomas Ashby", mood: "pleased" }],
        text: "Thomas Ashby is waiting by the Ward's back gate, as if he knew you'd come. Biscuit is draped round his neck like a fur stole, one paw dangling, purring audibly from ten yards away.\n\nHe has put on a coat that doesn't fit him and combed his hair with water, and he looks, for the first time since you met him, like someone who expects to have a future.\n\n'There are forty-one people still in there,' he says. 'I've counted every night for six years. I know all their names, and what was taken from each of them.' He recites them, quietly - a tin soldier, a snowstorm, a horse, a voice that sang - until you lose count.\n\n'If the Board's book has a page for each of them,' he says, 'I want to be the one who finds it.' Biscuit opens one eye at you, unimpressed. 'She's coming too. She has opinions about the Board.'",
        choices: [backToBank],
        setFlags: ["ally_ashby"],
        counters: { allies: 1 }
    },

    recruit_vane: {
        act: 5,
        theme: "institution",
        location: "corridor",
        speaker: "Inspector Vane",
        cast: [{ who: "Inspector Vane", mood: "stern" }],
        text: "Vane lives in a narrow house in Pimlico with a polished brass knocker and nothing whatever in the window boxes.\n\nShe opens the door herself, sees you, and begins - smoothly, without a word - to close it again.\n\nYou say one word. 'Kite.'\n\nThe door stops.\n\nFor a long moment there is nothing but the hiss of the street lamp and her face in the gap of the door, perfectly still, the way a pond is still.\n\nShe doesn't invite you in. She doesn't agree to anything. She tells you, in precise and level sentences, that what you're planning is illegal, impossible and unwise; that she has sent people to the Quiet Ward for considerably less; that she has never in her career looked the other way, and does not intend to begin.\n\nThen she takes a small brass key from her watch chain and lays it on the hall table, between the umbrella stand and a vase with no flowers in it.\n\n'The archive's night entrance,' she says. 'I shall be elsewhere at two o'clock. At a concert. Brahms. I dislike Brahms intensely.'\n\nThe door closes. Through it, very quietly, you hear: 'Don't make me regret this.' And then, quieter still, so quietly you might have imagined it: 'Please.'",
        choices: [backToBank],
        relationshipChanges: { "Inspector Vane": 15 },
        suspicionChange: -10,
        setFlags: ["ally_vane"],
        counters: { allies: 1 }
    },

    the_plan: {
        act: 5,
        theme: "dream",
        location: "old_bank",
        speaker: null,
        text: "You lay it out on the bank's long counter, where a hundred years of clerks counted other people's money - Roger Molly among them, once, at the desk by the window.\n\nTwo Ledgers, one truth. The Board keeps its great book in the archive at Whitehall, under glass. And the Dreamspace keeps a reflection of it, vast as a cliff, floating in the deep dark where the Board's decisions turn into the shape of the world. Change one and the other will fight to change it back. Change both at the same moment, and the change will hold.\n\nSo: two crews. One walks into Whitehall at two in the morning, past porters and locks and the Board's own night watch. The other sails into the deep Dreamspace, past pages that whisper and margins that bite.\n\n[[if count:allies>=3]]Looking round the table at the crew you've gathered - every face lit gold by the one lamp - you think it might actually work.[[else]][[if count:allies>=1]]It's a thin crew for a job this size. But it is a crew, and they're looking at you as if you know what you're doing.[[else]]It's just you, and a pirate who can barely remember her own name. It will have to do.[[/if]][[/if]]\n\n'Ye can only lead one,' Molly says. 'The other lot'll have to manage on their own.' She tries for a grin. 'Choose the one ye'd be sorriest to miss.'",
        choices: [
            { text: "Lead the waking crew into the Board's archive", nextScene: "archive_enter" },
            { text: "Lead the dream crew to the Ledger's reflection", nextScene: "dream_ledger_enter" }
        ]
    },

    archive_enter: {
        act: 5,
        theme: "institution",
        location: "board_archive",
        speaker: null,
        text: "Whitehall at two in the morning is all locked doors and echoes: gaslight on marble, the distant cough of a sentry who has been awake too long.[[if flag:ally_vane]] Vane's key turns in the night entrance with a soft, well-oiled click, and the night porter's chair, as promised, is empty. Somewhere across London, Brahms is being played to a woman who dislikes him intensely.[[/if]][[if flag:ally_worthington]] Worthington nods to a guard at the second door, who brightens - 'Professor! Not seen you since the '21 dinner!' - and waves the whole party through without a second glance.[[/if]][[if flag:ally_pip]] Admiral the frog hops into the porter's lodge and creates a diversion of truly unreasonable size, involving a teapot, a coal scuttle and a great deal of shouting.[[/if]]\n\nThe archive opens up before you like a cathedral built by accountants. Filing cabinets rise in tiers to a vaulted ceiling, aisle after aisle of them, every drawer a life the Board has had an opinion about. Brass ladders lean against the cliffs of drawers. Somewhere a clock ticks very slowly, as if it too has been filed.\n\nAt the far end, under a dome of glass, something glows faintly gold.\n\nThe waking Ledger.",
        choices: [
            {
                text: "Make for the heart of the archive",
                risky: true,
                nextScene: s => (s.flags.has("ally_vane") || (s.counters.allies || 0) >= 2 ? "archive_success" : "archive_alarm"),
                targets: ["archive_success", "archive_alarm"]
            }
        ]
    },

    archive_success: {
        act: 5,
        theme: "institution",
        location: "board_archive",
        speaker: null,
        text: "You reach the Ledger. Nobody stops you.\n\nIt's smaller than you imagined - a plain book with a plain brown cover, the sort of thing you'd find in any bank - and when you lift away the glass dome and pick it up, it's heavier than anything you have ever held. Not heavy like stone. Heavy like a decision.\n\nWhen you open it, you feel the other crew open its twin, far away in the deep Dreamspace, as clearly as if someone had laid a hand on your shoulder. Two books, one breath.\n\nThe pages turn by themselves. Names. Dates. Verdicts. QUIETED. QUIETED. APPROVED. QUIETED.[[if visited:quiet_ward_ashby]] Your eye catches on a name you know - ASHBY, THOMAS - and slides off it, because the book is moving faster now,[[else]] The book is moving faster now,[[/if]] riffling toward the letter it knows you've come for.\n\nP.\n\nAnd then, all around you, the archive goes dark - and you realise you're not alone.",
        choices: [
            { text: "Look up", nextScene: "ledger_heart" }
        ]
    },

    archive_alarm: {
        act: 5,
        theme: "institution",
        location: "board_archive",
        speaker: null,
        text: "A bell. Then another. Then every bell in Whitehall at once, a great iron clamour that seems to come out of the walls themselves.\n\nLamps flare up the length of the archive. Boots on marble. Shouts. Someone blowing a whistle as if their life depended on it.\n\nYou don't think. You grab the Ledger - heavier than anything you've ever lifted, heavy like a decision - and you run. Not for the door; there are men at the door. For the tall gilt mirror at the end of the hall, the way Molly taught you on a sandbank of misplaced keys: don't look at your reflection, look through it, and keep going.\n\nYou hit the glass, and it gives like water.\n\nYou crash through into the cold deep Dreamspace with the book clutched to your chest and Whitehall's bells fading behind you into a seasick echo. You land hard, on nothing, and roll.\n\nThe Ledger falls open. Its pages turn by themselves, faster and faster, and stop.\n\nP.",
        choices: [
            { text: "Get up", nextScene: "ledger_heart" }
        ],
        suspicionChange: 20,
        selfChange: -5
    },

    dream_ledger_enter: {
        act: 5,
        theme: "dream",
        location: "dream_ledger",
        speaker: null,
        cast: [{ who: "Molly Roger", mood: "sad" }],
        text: "The deep Dreamspace is very quiet. Nobody comes here unless they're lost, or very determined, or a Board clerk with a pass.\n\nPages drift past like autumn leaves - thousands of them, each one a life, each one written in the Board's neat, sloping hand. You catch fragments as they turn: born, Leeds, 1831... projected a dog, 1840... approved... quieted... Some pages are blank but for a single word. Most of the words are QUIETED.[[if flag:ally_captain]] The grammar police form an honour guard along the margins, saluting smartly as you pass, every man correctly spaced.[[/if]][[if flag:ally_roger]] Roger-and-Molly stands at the prow, reading the currents like a balance sheet, steering you through the drifts with a clerk's precision and a pirate's nerve.[[/if]][[if flag:ally_grace]] Grace calls out the anchors whenever the pages begin to whisper - street, door, stolen thing - and the whispering falls back.[[/if]]\n\nAnd then, ahead of you, vast as a cliff, rising out of the dark: the Ledger itself.\n\nIt floats open, its spine a mile long, its pages turning slowly, like a sleeper breathing. A wind comes off it that smells of ink and dust and very old, very certain decisions.\n\nMolly, beside you, has gone almost transparent. 'There,' she whispers. 'Somewhere in there is the page that says I can't exist.' She swallows. 'Let's go and argue with it.'",
        choices: [
            {
                text: "Sail for the open page",
                risky: true,
                nextScene: s => (s.flags.has("sea_legs") || (s.counters.allies || 0) >= 2 ? "ledger_heart" : "dream_lost"),
                targets: ["ledger_heart", "dream_lost"]
            }
        ]
    },

    dream_lost: {
        act: 5,
        theme: "dream",
        location: "dream_ledger",
        speaker: null,
        text: "The pages close in.\n\nAt first it's almost pleasant. Each one is somebody's life, and each one is so easy to read - a childhood in Bristol, a first love in a rainstorm, a terrible Christmas - and so hard to stop reading. You turn one page, and then another. Then you're turning them faster, hungrily, and then you notice that some of the pages are in your handwriting, and you can't remember writing them.\n\nYou lose an hour. You lose your middle name. You lose the colour of a door you used to know, and the taste of something you once stole, and the name of the street where - where -\n\n[[if flag:anchored]]Then, from somewhere very deep, the rope Grace gave you pulls tight. Street. Door. Stolen thing. You say them out loud, in order, in a voice that cracks, and the pages scatter from you like startled birds.[[else]]It's Molly who finds you, more sea than pirate now, wading through the drifts of other people's lives. She takes you by the collar and hauls, swearing magnificently in four centuries of naval slang, until you're out.[[/if]]\n\nYou sit for a while on the margin, shaking, gathering yourself back piece by piece. Not every piece comes.",
        choices: [
            { text: "Go on, a little less yourself", nextScene: "ledger_heart" }
        ],
        selfChange: -15
    },

    ledger_heart: {
        act: 5,
        theme: "dream",
        location: "dream_ledger",
        speaker: "Lady Harrowgate",
        cast: [{ who: "Lady Harrowgate", mood: "stern", pos: "right" }, { who: "Molly Roger", mood: "sad", pos: "left" }],
        text: "The page is the size of a ballroom. It reads, in letters taller than you are: PIRATE. And under it, in fresh wet ink: TO BE STRUCK AT THE EQUINOX. H.H.\n\n'I did wonder who it would be.'\n\nLady Harrowgate stands on the margin of the page as if it were a drawing-room carpet. She's younger here - the Ledger shows people as they think of themselves - and much less kind. Her plume stirs in a wind that isn't blowing. In her hand is a pen.\n\n'Do you know what this book is, {name}?' she says. 'It's mercy. Every story in it has one ending, approved and stamped in triplicate. No one in this book ever has to be afraid of what they might become. No mother in this book ever stands in Kensington Gardens calling a name that nobody answers to.'\n\nShe smiles. 'Put down the pen. Go home. Be a cube. I promise you'll be happy - or at least you'll never notice that you aren't.'[[if flag:harrowgate_heard]]\n\nYou think of a boy and a lion, and of a blank book on a tea table, and you understand that she means every word.[[/if]]\n\nThe pen is in your hand. You don't remember picking it up. Behind you, Molly is a smudge of violet on the dark, holding very still, the way you hold still when you're trying not to be erased.\n\nThe whole Ledger waits.[[if flag:ghost_memory]]\n\nAnd you could swear the Ledger has more than one page with your name on it - in different hands, with different endings, all of them yours.[[/if]]",
        choices: [
            { text: "Strike out the Erasure, and write PIRATE back into the world", nextScene: "ledger_rewrite" },
            { text: "Write every ending at once", nextScene: "true_ending", requires: "flag:ghost_memory & flag:named_her & endings>=8", hideLocked: true },
            { text: "Burn the Ledger - every page of it", nextScene: "ledger_burned", requires: "count:allies>=3", risky: true },
            { text: "Copy the pages and send them to every newspaper in London", nextScene: "exposed", requires: "item:board_circular" },
            { text: "Turn to Inspector Vane's page, and open it", nextScene: "vane_page", requires: "flag:vane_secret" },
            { text: "Forget the book. Steal Monday, and run.", nextScene: "three_day_weekend", requires: "item:stolen_w" },
            {
                text: "Face Harrowgate, mind to mind",
                risky: true,
                // Knowing about Edmund gives you something to show her, and makes this a little less impossible.
                nextScene: s => ((s.self >= 70 && s.psychicLevel >= 18) || (s.flags.has("harrowgate_heard") && s.self >= 60 && s.psychicLevel >= 14) ? "harrowgate_falls" : "hollow"),
                targets: ["harrowgate_falls", "hollow"]
            }
        ]
    },

    harrowgate_falls: {
        act: 5,
        theme: "dream",
        location: "dream_ledger",
        speaker: "Lady Harrowgate",
        cast: [{ who: "Lady Harrowgate", mood: "afraid" }],
        text: "You don't argue with her. You simply show her.\n\nThe sail that was a cube, salt-stiff over a schoolroom desk. A frog called Admiral, unimpressed by everything. A cat called Biscuit, purring in a white-tiled room. A kite on a green hill, flying without a string. A boy's tin soldier, saluting. Snow falling in a refectory, and a hundred children with their faces turned up into it. Every unapproved thing you've ever seen. Every ending nobody stamped.\n\nYou pour them onto her page, one after another, and the page can't hold them.\n\nHarrowgate staggers, as if the margin had tilted under her feet. 'Stop,' she says. 'Stop it - there are too many endings, I can't file them all, there isn't room, I can't -'[[if flag:harrowgate_heard]]\n\nAnd last of all, gently, you show her one she has never let herself picture: a boy and a gold lion in Kensington Gardens, and beside them a witness - someone who knows the boy's name, and keeps on saying it, and doesn't let go.\n\nLady Harrowgate makes a sound like a cup breaking. 'Edmund,' she says.[[/if]]\n\nShe steps back off the margin, into the white, and is gone.\n\nWhere she stood there's only her pen, lying on the page, its nib still wet.",
        choices: [
            { text: "Write PIRATE back into the world", nextScene: "ledger_rewrite" }
        ],
        suspicionChange: -20
    },

    ledger_rewrite: {
        act: 5,
        theme: "dream",
        location: "dream_ledger",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "pleased" }],
        text: "You strike the line through.\n\nIt takes more strength than you expected. The ink fights you, the way a door fights you in a high wind. Then the line is through, and the words beneath it - TO BE STRUCK AT THE EQUINOX - curl up and flake away like old paint.\n\nBeside it, in the margin, in your own handwriting, you write a single word.\n\nIt goes out through the Dreamspace like a bell. You feel it go - out through the pages, out through the margins, out into the dreaming heads of London. In a thousand bedrooms, a thousand children turn over in their sleep and dream of ships. In a Quiet Ward cell, somebody sits up and begins to hum. In a narrow house in Pimlico, a woman who dislikes Brahms looks up at her bedroom ceiling, though she couldn't tell you why.\n\nMolly gasps. Colour floods back into her like dawn coming up over water: the violet of the coat, the gold of the earring, the battered black of that terrible hat. She looks down at her own hands and laughs, and whoops so loudly that somewhere in Whitehall a night porter falls off his stool.\n\n'Ye did it! Ye wrote me back!'\n\nBut when she hugs you, you can feel it: she's still thin at the edges, like a drawing that's been rubbed out and drawn again. The Erasure took something it can't give back. 'I'm real enough for now,' she says into your shoulder. 'Not for always. Not unless...' She doesn't finish. She doesn't need to.[[if !visited:harrowgate_falls]]\n\nLady Harrowgate is gone. On the margin where she stood, a single line of ink reads: This is not over. Nothing is ever over.[[/if]]",
        choices: [
            { text: "Wake up in the old bank", nextScene: "help_molly" }
        ],
        relationshipChanges: { "Molly Roger": 15 },
        setFlags: ["pirate_restored"]
    },

    vane_page: {
        act: 5,
        theme: "dream",
        location: "dream_ledger",
        speaker: "Inspector Vane",
        cast: [{ who: "Inspector Vane", mood: "afraid" }],
        text: "You find it among the V's, between VANCE and VARLEY, in the Board's neat hand:\n\nVANE, ADELAIDE. AGE 12. PROJECTION: ONE KITE (PAPER, RED). STATUS: CLOSED BY SUBJECT.\n\nYou read it twice before you understand. Closed by subject. Nobody took Vane's kite. Nobody came for it with a velvet chair and a quiet machine. She wrote it into a ledger herself and shut the book, because she was twelve, and frightened, and somebody she trusted told her that was what grown-ups did with things that flew.\n\nAnd every day since, she has been keeping the book shut.\n\nAs you lay your hand on the page the Dreamspace shudders, and Vane is there - the real Vane, in her grey coat and gloves, pulled into the deep dark by the tug of her own name. She looks round at the drifting pages, the vast cliff of the Ledger, the pen in your hand. She doesn't look surprised. She looks like someone who has had this dream before, many times, and always woken up just here.\n\nHer eyes go to the page.\n\n'Don't,' she says. And then, very quietly, as if the word costs more than anything she has ever said: 'Please.'\n\nYou can't tell which she means.",
        choices: [
            { text: "Let the kite fly", nextScene: "vane_unbound" },
            { text: "Close it again, gently, and turn back to P", nextScene: "ledger_rewrite", relationshipChanges: { "Inspector Vane": 10 } }
        ]
    },
    eve_of_ledger: {
        act: 5,
        theme: "dream",
        location: "old_bank",
        speaker: null,
        cast: [{ who: "Molly Roger", mood: "sad" }],
        text: "Nobody sleeps the night before. You sit on the floor of the old bank with the lamps turned low, and the crew talk the way people do before something enormous: about everything except the enormous thing.\n\n[[if flag:ally_grace]]Grace teaches the others her anchors, briskly, as if it were a spelling test. By midnight everyone knows the colour of everyone else's mother's front door.\n\n[[/if]][[if flag:ally_worthington]]Worthington tells a long and very bad story about the Board's Christmas party of 1829, and laughs at it himself until he wheezes. It's the first time you have ever heard him laugh.\n\n[[/if]][[if flag:ally_pip]]Pip falls asleep at one in the morning, mid-sentence, with Admiral the frog keeping watch from the top of Pip's head.\n\n[[/if]][[if flag:ally_roger]]Roger-and-Molly sits apart, doing sums in the dust with one finger, then rubbing them out and drawing a ship instead.\n\n[[/if]][[if flag:ally_captain]]The Captain declines a cup of tea on the grounds that it has not been properly introduced.\n\n[[/if]][[if flag:ally_ashby]]Thomas Ashby reads out the forty-one names from the Ward, one by one, and nobody speaks until he has finished.\n\n[[/if]][[if flag:ally_vane]]Vane does not come. But at three o'clock a boy delivers a parcel: a map of the archive's back corridors, annotated in a small, neat hand.\n\n[[/if]][[if count:allies==0]]It's just you and Molly, in the end. She sits beside you on the counter and tells you the names of every ship she has ever dreamed, until you lose count.\n\n[[/if]]Towards dawn, Molly - what's left of her - comes and sits by you.\n\n'Whatever happens tomorrow,' she says, 'ye gave a ghost a crew. That's more than most get.'",
        choices: [{ text: "Lay out the plan", nextScene: "the_plan" }],
        selfChange: 5
    }
};
