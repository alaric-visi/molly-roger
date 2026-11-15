// ACT III - THE INQUIRY
// The Board arrives. Vane's interview, Grace in danger, Worthington's brass
// bird, and the Quiet Ward - where the Board makes its Hollow Ones.

// Every interview ends the same way: out into the corridor, where what
// happens to Grace depends on whether you warned her.
const leaveInterview = {
    text: "Leave the interview room",
    nextScene: s => (s.flags.has("grace_safe") ? "grace_spared" : "grace_taken"),
    targets: ["grace_spared", "grace_taken"]
};

// How to get into the Quiet Ward: Worthington's keys, if you've earned them, or Dreamspace.
const intoTheWard = [
    { text: "Ask Worthington about the brass feather", nextScene: "worthington_confession", requires: "flag:saw_brass_bird" },
    { text: "Ask Worthington to help you, plainly", nextScene: "worthington_confession", requires: "rel:worthington>=25", hideWhen: "flag:saw_brass_bird" },
    { text: "Go in the back way, through Dreamspace, with Molly", nextScene: "quiet_ward_entry", selfChange: -5 }
];

export const inquiryScenes = {
    inquiry_begins: {
        act: 4,
        theme: "institution",
        location: "hearing_room",
        speaker: "Lady Harrowgate",
        cast: [{ who: "Lady Harrowgate", mood: "stern", pos: "right" }, { who: "Inspector Vane", mood: "stern", pos: "left" }],
        text: "The carriages keep coming all night. By morning there are eleven of them in the quad, black and polished, each bearing the Board's seal on its door: an open eye above an open ledger.\n\nThe Great Hall has been turned into a court. A long table, green baize, water jugs nobody touches. Behind it sits the Board of Psychic Regulation - nine grey coats, nine pairs of spectacles, nine identical expressions of mild and permanent disappointment. Above them hangs a crimson banner with the eye and the ledger picked out in gold thread. The whole school sits in rows facing them, as if for a play nobody wanted to see.\n\nIn the centre of the table sits a woman who is not grey at all. Lady Harrowgate, Chair of the Board, wears plum silk and pearls and a smile like a closed door. Her hair is an architectural achievement crowned with a single black plume. When she speaks, the hall goes so quiet you can hear the gaslights.\n\n'A letter has been taken from the Crown,' she says. 'Letters are not toys. Letters are how a world is spelled. Take away a letter and you take away every word that needs it - and every thought that needs those words.' She lets that settle. 'Each of you will be interviewed. Inspector Vane will conduct the interviews. And when we are finished' - the smile widens by a precise quarter-inch - 'everything will be exactly as it should be.'\n\nBeside you, invisible to everyone else, Molly lets out a low whistle. 'Now that,' she murmurs, 'is a proper admiral.'",
        choices: [
            { text: "Wait your turn, and keep your face still", nextScene: "vane_interview" },
            { text: "Slip out to warn Grace before they reach the library", nextScene: "grace_warned", requires: "flag:knows_hideout", suspicionChange: 5 }
        ],
        setFlags: ["met_vane"]
    },

    grace_warned: {
        act: 4,
        theme: "neutral",
        location: "grace_hideout",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "afraid" }],
        text: "You take the back stairs three at a time. The library is empty - everyone's in the Great Hall - and the bookcase swings open before you've finished pulling on Hume.\n\nGrace is already packing. She heard the carriages too. She doesn't waste breath asking how you knew; she just hands you a sack.\n\nTogether you strip the hideout bare. Slates scrubbed with spit and sleeves. Notebooks sewn, with frantic uneven stitches, into the lining of a winter coat. The brass apparatus taken apart ring by ring and posted, piece by piece, into the library's returns chute, where it clanks down into the dark like a very guilty orchestra. The glowing jars go into the coal scuttle, under the coal.\n\nWhen you've finished, it's just a cupboard behind a bookcase again: dust, a mop, one forgotten sock. Grace leans against the wall, breathing hard, chalk on her cheek.\n\n'If they'd found it...' She doesn't finish. She doesn't need to. 'My grandmother lost everything for a room like this.' She looks at you properly. 'Thank you. I won't forget it.'\n\nYou're back in your seat in the Great Hall with eleven seconds to spare. Inspector Vane, at the end of the row, turns a page in her ledger, and does not look up.",
        choices: [
            { text: "Take your seat as if you'd never left", nextScene: "vane_interview" }
        ],
        relationshipChanges: { "Grace": 15 },
        setFlags: ["grace_safe"]
    },

    vane_interview: {
        act: 4,
        theme: "institution",
        location: "hearing_room",
        speaker: "Inspector Vane",
        cast: [{ who: "Inspector Vane", mood: "stern" }],
        text: "Vane's interview room is a cleaning cupboard with the mops taken out. One table. Two chairs. One gas jet, turned low. One ledger.\n\nShe doesn't look up when you come in. She finishes writing a sentence, blots it, and only then raises her eyes - grey, steady, and so entirely without malice that it's worse than malice would have been.\n\n'Name,' she says, though she knows it. You give it. '{name}. Second year. Unremarkable record, until recently.' She turns a page. [[if suspicion>=50]]You glimpse your own name on it, followed by rather a lot of small, neat marks.[[else]]Your name is there, followed by a handful of small, neat marks.[[/if]][[if flag:cube_sail]] 'You made a sail on examination day,' she adds. 'I wrote that down too. I thought at the time it might be the beginning of something.'[[/if]]\n\nShe lays her pencil parallel to the edge of the ledger, exactly.\n\n'I'm not going to threaten you,' she says. 'I find it untidy, and it rarely helps. I am going to ask you one question, and then I'm going to write down the answer, and then the answer will be true for as long as this book exists.' A pause. 'Where were you on the night the letter was taken?'",
        choices: [
            {
                text: "Answer her questions - and guard your thoughts",
                setPiece: "interrogation",
                skipOutcome: "fair",
                outcomes: {
                    perfect: { nextScene: "interview_lie_ok" },
                    fair: { nextScene: "interview_halftruth" },
                    poor: { nextScene: "interview_lie_caught" }
                }
            },
            {
                plainOnly: true,
                text: "Lie, smoothly",
                risky: true,
                nextScene: s => (s.psychicLevel >= 12 && s.self >= 60 ? "interview_lie_ok" : "interview_lie_caught"),
                targets: ["interview_lie_ok", "interview_lie_caught"]
            },
            { plainOnly: true, text: "Tell her a careful half-truth", nextScene: "interview_halftruth" },
            { text: "Say nothing at all", nextScene: "interview_silent" },
            { text: "Read her mind while she reads yours", nextScene: "interview_read", requires: "psychic>=14", risky: true },
            { text: "Offer her the stray comma", nextScene: "interview_comma", requires: "item:stray_comma", hideLocked: true }
        ]
    },

    interview_lie_ok: {
        act: 4,
        theme: "institution",
        location: "hearing_room",
        speaker: "Inspector Vane",
        cast: [{ who: "Inspector Vane", mood: "thoughtful" }],
        text: "You tell her you were asleep.\n\nAnd you believe it - you believe it so completely that for a moment you can feel the pillow under your cheek, hear the dormitory clock, smell the damp in the curtains. You let the memory you've made unfold in your mind like a map, and you lay it on the table between you.\n\nVane watches you for a long time. Her pencil doesn't move. Somewhere behind her eyes you have the strangest sense of drawers opening and closing, of someone checking one file against another.\n\nThen she writes something short, and closes the ledger.\n\n'Thank you, {name}. That will be all.'\n\nYou almost make it to the door before she speaks again, without looking up.\n\n'You lie very well,' she says. 'Remarkably well, for your age. I'd keep an eye on that, if I were you.' A pause. 'It's how most of us start.'",
        choices: [leaveInterview],
        suspicionChange: -10
    },

    interview_lie_caught: {
        act: 4,
        theme: "institution",
        location: "hearing_room",
        speaker: "Inspector Vane",
        cast: [{ who: "Inspector Vane", mood: "stern" }],
        text: "You tell her you were asleep.\n\nVane lets the sentence sit on the table between you until it begins, visibly, to wilt. You add a detail - the dormitory clock - and then another - a dream about cake - and each one lands on the table beside the first like a small dead bird.\n\n'You're a poor liar,' she says at last, not unkindly. 'That's rather to your credit. Good liars are made, usually by someone who frightened them.'\n\nShe picks up her pencil.\n\n'It is also,' she says, 'going in the book.'\n\nShe writes for some time. You count the strokes. When she finally blots the page and closes the ledger she looks almost sorry - the way a doctor looks sorry, handing you something bitter in a spoon.",
        choices: [leaveInterview],
        relationshipChanges: { "Inspector Vane": 5 },
        suspicionChange: 20
    },

    interview_halftruth: {
        act: 4,
        theme: "institution",
        location: "hearing_room",
        speaker: "Inspector Vane",
        cast: [{ who: "Inspector Vane", mood: "thoughtful" }],
        text: "You tell her you've been dreaming of the sea. That you've heard a voice - a woman's voice, loud and cheerful and frequently rude. That you don't know what it wants from you. Not really.\n\nAll of it true. None of it the truth.\n\nVane listens without interrupting, her pencil moving in short, neat strokes. When you've finished she reads back what she has written, under her breath, and for a moment something crosses her face. Not suspicion, exactly. Something more like recognition.\n\n'Dreams,' she says, 'are not yet an offence.'\n\nA pause, exactly long enough.\n\n'Yet.'\n\nShe closes the ledger, then hesitates with her hand flat on the cover. 'The sea,' she says, not quite to you. 'It's always the sea, or the sky. Never anything sensible. Never a nice cupboard.' She seems to hear herself, and straightens. 'Next.'",
        choices: [leaveInterview],
        relationshipChanges: { "Inspector Vane": 10 },
        suspicionChange: 5
    },

    interview_silent: {
        act: 4,
        theme: "institution",
        location: "hearing_room",
        speaker: "Inspector Vane",
        cast: [{ who: "Inspector Vane", mood: "stern" }],
        text: "You say nothing.\n\nThe clock says a great deal. A cart goes by in the street outside. Somewhere far off, a first-year is crying in a corridor and being shushed. The gas jet hisses. You look at a knot in the wood of the table, and count your breaths, and say nothing at all.\n\nVane doesn't fill the silence. She simply waits, pencil poised, with the terrible patience of someone who has outlasted far braver people than you.\n\nAfter four minutes - you know it's four, because you counted - she closes the ledger.\n\n'Silence is an answer,' she says. 'Usually the honest one.'\n\nShe writes a single word on the cover, which you can't read upside down. But there's something in the way she says it - something almost like respect - that you'll find yourself thinking about for days. As if, once, a long time ago, she had sat on the other side of a table like this one, and wished she had been brave enough to say nothing too.",
        choices: [leaveInterview],
        relationshipChanges: { "Inspector Vane": 5 },
        suspicionChange: 15,
        selfChange: 5
    },

    interview_read: {
        act: 4,
        theme: "institution",
        location: "hearing_room",
        speaker: "Inspector Vane",
        cast: [{ who: "Inspector Vane", mood: "angry" }],
        text: "While she reads your face, you read her mind.\n\nIt's like opening a door in a house you were told was empty. Her mind is a filing room: cabinet after cabinet, every drawer labelled in the same small hand, everything in alphabetical order. ARREST WARRANTS. CORRESPONDENCE. GRIEVANCES (PERSONAL) - a very thin drawer. You walk the aisles of her, and nothing is out of place.\n\nExcept one drawer, at the very bottom of the last cabinet. Locked. With a label in a child's handwriting.\n\nKITE.\n\nFor an instant you see inside it. A girl of twelve on a green hill, in a high wind. A red paper kite above her - flying without a string, without the wind, simply because she wants it to. The girl is laughing so hard she has to sit down in the grass.\n\nThen the drawer slams so hard the whole filing room shakes.\n\nVane is on her feet. Her chair has gone over behind her. She is white to the lips, and her hand is pressed flat on her ledger as if to hold something in.\n\n'Get out,' she says.\n\nIt is the first time you have ever heard her raise her voice.",
        choices: [leaveInterview],
        relationshipChanges: { "Inspector Vane": -10 },
        psychicChange: 2,
        suspicionChange: 10,
        setFlags: ["vane_secret"]
    },

    interview_comma: {
        act: 4,
        theme: "institution",
        location: "hearing_room",
        speaker: "Inspector Vane",
        cast: [{ who: "Inspector Vane", mood: "pleased" }],
        text: "You set the stray comma on the table.\n\nIt curls there under the gas jet, small and apologetic, like something that knows it's been brought to the wrong party.\n\nVane looks at it. Then at you. Then at the comma again.\n\nSomething at the corner of her mouth moves - very slightly, a fraction of a fraction - and is immediately disciplined back into line, the way you'd straighten a picture frame.\n\n'That,' she says, 'is the least threatening piece of evidence I have ever been offered.' She picks it up between finger and thumb and examines it against the light. 'It's from the Vault. You can tell by the curl. Royal commas have a curl.'\n\nShe doesn't write anything down. She does, you notice, put the comma in her waistcoat pocket, very carefully, as if it might break.\n\n'You may go,' she says. And then, as you reach the door, in a voice you've never heard her use before: 'Thank you. It's been a long week.'",
        choices: [leaveInterview],
        relationshipChanges: { "Inspector Vane": 15 },
        suspicionChange: -10,
        removeItems: ["stray_comma"]
    },

    grace_taken: {
        act: 4,
        theme: "neutral",
        location: "library",
        speaker: null,
        cast: [{ who: "Grace", mood: "afraid", pos: "right" }, { who: "Inspector Vane", mood: "stern", pos: "left" }],
        text: "You come out into the corridor just in time to see them bring Grace down the library stairs.\n\nTwo enforcers, one at each arm. Vane walking ahead with a box of Grace's notebooks held against her chest, the way you'd carry something fragile. Behind them a porter with the brass apparatus in a sack, its rings clanking at every step.\n\nThe whole corridor has gone silent. Students press back against the walls. Nobody says anything. That's the worst of it: how quiet everyone is, as if they've practised.\n\nGrace sees you. She doesn't call out - she's far too clever for that - but as she passes she mouths three words, slowly, so you can't mistake them. [[if flag:anchored]]Street. Door. Stolen thing. Your anchors, and hers. She's telling you she'll hold.[[else]]Remember who you are.[[/if]]\n\nAt the foot of the stairs she stumbles - or pretends to - and for one second her hand brushes yours. When she's gone, you find a scrap of paper in your palm. On it, in chalk-smeared pencil: Q.W. - WHITEHALL - SUB-BASEMENT. FIND THE OTHERS.\n\nThe Board's carriage takes her away toward Whitehall. The notice pinned to the hideout door says: Removed for assessment.\n\nEveryone knows what assessment means.",
        choices: intoTheWard,
        relationshipChanges: { "Grace": 5 },
        setFlags: ["grace_taken"]
    },

    grace_spared: {
        act: 4,
        theme: "neutral",
        location: "grace_hideout",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "thoughtful" }],
        text: "The Board searches the library for three hours. They pull down every book, tap every panel, sniff the coal scuttle with professional suspicion. They find a cupboard, a mop and one forgotten sock.\n\nGrace watches from a window seat, a book of sermons open upside down on her lap, and by the end looks almost disappointed in them.\n\nThat night she finds you on the observatory stairs. She has her grandmother's notebook with her, the one she sewed into her coat.\n\n'They've done this before,' she says. 'For years. Not just to us.' She unfolds a list written in an old, neat hand, added to here and there in Grace's own. 'Students who projected something unapproved. A boy who made a tin soldier that saluted. A girl who made it snow indoors. They all went to Whitehall for assessment, and none of them came back the same. Some of them didn't come back at all.'\n\nHer finger stops on one name, underlined twice.\n\n'Thomas Ashby. He was in my grandmother's last class. He drew a cat in the margin of everything.' She folds the list away. 'I want to know what's down there. I want to know what assessment means.' She looks at you. 'And I'd rather not go alone.'",
        choices: intoTheWard,
        relationshipChanges: { "Grace": 10 }
    },

    worthington_confession: {
        act: 4,
        theme: "institution",
        location: "worthington_office",
        speaker: "Professor Worthington",
        cast: [{ who: "Professor Worthington", mood: "sad" }],
        text: "Worthington lets you in, looks at your face, and pours two brandies, although you are certainly not allowed one.\n\n'Her name was Tuppence,' he says. 'A brass bird. I projected her when I was nine - clockwork wings, a voice like a music box. She used to sit on my shoulder in lectures.' He unwraps the feather from its handkerchief. 'When the Board offered me a teaching post, the price was Tuppence. I paid it. They took her to the Quiet Ward. I've told myself every day since that it was the sensible thing to do.'\n\nHe presses the feather into your hand, and then a heavy ring of iron keys. 'Sub-basement. Third door. Bring them back, if you can.' His voice cracks. 'All of them.'",
        choices: [
            { text: "Go to Whitehall tonight", nextScene: "quiet_ward_entry" }
        ],
        relationshipChanges: { "Professor Worthington": 20 },
        addItems: ["brass_feather"],
        setFlags: ["worthington_ally"]
    },

    quiet_ward_entry: {
        act: 4,
        theme: "institution",
        location: "quiet_ward",
        speaker: "Molly Roger",
        cast: [{ who: "Molly Roger", mood: "afraid" }],
        text: "[[if flag:worthington_ally]]Worthington's keys turn in the locks as if they've been waiting thirty years to be used. The night porter at the Board Offices nods you through without looking up; he knows the professor's face, and doesn't know enough to wonder why it's grey.[[else]]You go in the back way - through Dreamspace, where the Board's offices cast a shadow like a cold stone tower. Molly comes with you as far as she can, and then a little further, gritting her teeth, until the dream thins to nothing and you step out of a broom cupboard into the real world, three floors beneath Whitehall.[[/if]]\n\nThe Quiet Ward is white tile and gaslight turned low. It smells of carbolic soap, and under that of something worse: the absence of smell. The absence of anything. Even your footsteps sound muffled, as if the corridor were swallowing them.\n\nMolly flickers beside you like a candle in a draught. Her colours have gone pale, the violet of her coat washed almost to grey.\n\n'Can't hold me shape in here, {lass},' she whispers. 'This place eats the colour out of a thought.'\n\nBehind small barred windows, people sit very still on narrow beds. They don't look up as you pass. Some of them are drawing on the walls with whatever they have - a fingernail, a spoon, a burnt match. The same few shapes, over and over: a soldier, a snowflake, a ship.\n\nMost of them are young. Some of them are younger than Pip.",
        choices: [
            { text: "Look for Thomas Ashby", nextScene: "quiet_ward_ashby" }
        ],
        selfChange: -5,
        relationshipChanges: { "Molly Roger": 5 }
    },

    quiet_ward_ashby: {
        act: 4,
        theme: "institution",
        location: "quiet_ward",
        speaker: "Thomas Ashby",
        cast: [{ who: "Thomas Ashby", mood: "sad" }],
        text: "Cell nine. Thomas Ashby is nineteen and looks older and younger at the same time. He is drawing on the wall with a burnt match: the same shape, over and over. A cat, curled up, tail over its nose.\n\n@ashby: 'Biscuit,' he says, when you ask. 'She was mine. Ship's cat. I projected her when I was twelve.' He taps his temple. 'They took her out. Said I'd thank them for it. There's a space in here now, the exact shape of her.'\n\n@ashby: He hands you the drawing, very politely, as if it were a calling card. 'That's what a Hollow One is. Not a merger gone wrong. Just a person with the best bit cut out.'\n\nThe Board doesn't find Hollow Ones. The Board makes them.[[if flag:grace_taken]]\n\nFurther down the corridor, in cell fourteen, Grace sits very upright, whispering three things to herself, over and over.[[/if]]",
        choices: [
            { text: "Get Grace out of cell fourteen", nextScene: "grace_freed", requires: "flag:grace_taken", hideLocked: true },
            { text: "Try to give Ashby back what they took", nextScene: "ashby_restored", requires: "psychic>=14", risky: true },
            { text: "Promise him you'll come back for everyone", nextScene: "inquiry_verdict" }
        ],
        addItems: ["ashby_drawing"],
        setFlags: ["knows_hollow_truth", "knows_hollow"]
    },

    grace_freed: {
        act: 4,
        theme: "institution",
        location: "quiet_ward",
        speaker: "Grace",
        cast: [{ who: "Grace", mood: "sad" }],
        text: "[[if flag:worthington_ally]]There's a key on Worthington's ring for cell fourteen. Of course there is. He would have known exactly which door.[[else]]You have no key, so Molly pours what's left of her colour into the lock - you watch her fade to a sketch, then to an outline - until the lock forgets it was ever shut.[[/if]]\n\nGrace walks out on her own two feet. She's shaking, and there's a bruise on her wrist where someone held it too hard, but she's herself. Her eyes are clear. Her anchors held.\n\n'They were going to start tomorrow,' she says. Her voice is very steady, the way voices get when they're working hard at it. 'They have a machine. A brass cabinet with a velvet chair. It's very quiet. They told me I wouldn't feel a thing, and I believed them, and that was the most frightening part.'\n\nShe takes your hand and holds it hard enough to hurt.\n\n'Thank you.'\n\nOn the way out she stops at every cell. She reads every name she can find on the cards beside the doors, out loud and clearly, the way her grandmother's rules say a witness should - so that someone has. Some of the people behind the doors look up at the sound of their names. One of them, very slowly, smiles.",
        choices: [
            { text: "Get out before the night porter's round", nextScene: "inquiry_verdict" }
        ],
        relationshipChanges: { "Grace": 20 },
        suspicionChange: 15,
        clearFlags: ["grace_taken"],
        setFlags: ["grace_safe"]
    },

    ashby_restored: {
        act: 4,
        theme: "institution",
        location: "quiet_ward",
        speaker: "Thomas Ashby",
        cast: [{ who: "Thomas Ashby", mood: "pleased" }],
        text: "You don't know how to do it. Nobody has ever taught anybody how to do it. So you do it the way Molly taught you to sail: by feeling, not by sight.\n\nYou reach - carefully, the way you'd reach into dark water - into the space in Thomas Ashby. It's exactly where he said it would be. A hollow the precise shape of a cat: the curve of a spine, four neat paws, a tail wrapped over a nose. The edges are clean. Somebody cut very carefully.\n\nYou think of warmth. Of whiskers. Of the specific, unarguable weight of an animal that has decided your lap is its property and will not be persuaded otherwise. Of a purr like a kettle coming to the boil. You think of ginger, because the cats on his wall are coloured with rust from the bedframe, and rust is the nearest thing in this place to ginger.\n\nIt costs you something. You feel it go - some small warm thing of your own, a memory or a colour; you'll never be quite sure which.\n\nAnd then Thomas Ashby laughs. It's a startled, rusty sound, as if he'd forgotten where he kept it. There's a small ginger cat in his arms, purring like a kettle and regarding the Board's white tiles with enormous contempt.\n\n'Biscuit,' he says. 'Oh, you idiot. Where have you been?'",
        choices: [
            { text: "Get out before the night porter's round", nextScene: "inquiry_verdict" }
        ],
        psychicChange: 2,
        selfChange: -10,
        setFlags: ["ashby_restored"]
    },

    inquiry_verdict: {
        act: 4,
        theme: "institution",
        location: "hearing_room",
        speaker: "Lady Harrowgate",
        cast: [{ who: "Lady Harrowgate", mood: "pleased", pos: "right" }, { who: "Inspector Vane", mood: "stern", pos: "left" }],
        text: "Next morning the whole school is summoned to the Great Hall to hear the Board's findings. Nobody has slept. The air smells of cold porridge and fear.\n\n'The letter W has been returned,' Lady Harrowgate announces. [[if flag:returned_w]]'Voluntarily, I'm told. How sweet.'[[else]]'By the grammar police, after some unpleasantness.'[[/if]] A ripple of relief runs through the rows - and dies as she raises one gloved hand.\n\n'But a letter is only a symptom. The disease is the idea that a projection may outgrow its maker. That a thought may become a person. That a girl may become a pirate.' She lets the word hang in the air like something held up with tongs. 'This Board has tolerated that idea for forty years. It will not tolerate it for forty-one.'\n\nShe unrolls a parchment. Her voice does not rise. It doesn't need to.\n\n'At the autumn equinox, by order of this Board, the concept of PIRATE will be struck from the Ledger of the British Dreamspace. Without the concept, such projections cannot persist. They will simply...' - a small, precise gesture, like brushing crumbs from a tablecloth - '...stop.'\n\nBeside you, invisible to everyone else, Molly flickers like a gas jet in a draught. For an instant you can see the far wall straight through her.\n\n'{Lass},' she says, very quietly. It's the first time you have ever heard her sound afraid.[[if suspicion>=70]]\n\nThen Inspector Vane rises and reads out a short list of 'persons of interest'. Your name is third. Four hundred heads turn to look at you.[[/if]]",
        choices: [
            { text: "Find Molly before she fades", nextScene: "molly_fading" },
            { text: "Answer the note in plum ink: tea with Lady Harrowgate, at five", nextScene: "harrowgate_tea", requires: "suspicion>=40", hideLocked: true },
            {
                text: "Stand up and object, in front of everyone",
                risky: true,
                nextScene: s => (s.suspicion >= 75 ? "hollow" : "public_objection"),
                targets: ["public_objection", "hollow"]
            }
        ]
    },

    public_objection: {
        act: 4,
        theme: "institution",
        location: "hearing_room",
        speaker: "Lady Harrowgate",
        cast: [{ who: "Lady Harrowgate", mood: "pleased" }],
        text: "You stand.\n\nYou don't decide to. Your legs simply do it, the way they'd catch you if you tripped. Four hundred heads turn. The Board's nine grey faces turn as one, like owls.\n\n'You can't erase an idea,' you say, and your voice only shakes a little. 'People will just think it again. Children will think it. You can't stop children thinking about pirates. You'd have to stop them having baths.'\n\nSomebody at the back laughs, and turns it into a cough.\n\nLady Harrowgate regards you with real interest, the way a collector regards a butterfly that has done something unusual on its way to the pin.\n\n'They'll try,' she agrees pleasantly. 'And there will be nothing there for the thought to land on. They'll reach for it and find a sort of... draught.' She smiles. 'Children are very adaptable. Sit down, {name}.'\n\nYou sit. Your face is burning.\n\nBut in the back row a first-year begins, slowly, to clap - [[if flag:pip_friend]]Pip, of course, with Admiral the frog peering out of one pocket[[else]]a small child you don't know, with ink on their cuffs[[/if]] - three, four, five claps, loud in the silence, before a prefect hushes them.\n\nFor the rest of the day the corridors hum. Somebody chalks a tiny ship on the door of the Great Hall. By evening there are eleven.",
        choices: [
            { text: "Find Molly before she fades", nextScene: "molly_fading" },
            { text: "Accept the invitation that arrives that evening: tea with Lady Harrowgate", nextScene: "harrowgate_tea" }
        ],
        relationshipChanges: { "Pip": 10 },
        suspicionChange: 15,
        selfChange: 5
    },
    harrowgate_tea: {
        act: 4,
        theme: "institution",
        location: "headmaster_study",
        speaker: "Lady Harrowgate",
        cast: [{ who: "Lady Harrowgate", mood: "sad" }],
        text: "Lady Harrowgate takes her tea in the Headmaster's study, which she has occupied the way weather occupies a valley. The good china is out. There are cucumber sandwiches with the crusts cut off, and beside them a small leather-bound book bearing the Board's seal.\n\n'Sit, {name}. You look like a student who has been told a great many frightening things about me. Most of them are true.' She pours. 'Milk?'\n\nFor a while she talks about nothing - the weather, the price of coal - in a voice like a well-oiled lock. Then, quite suddenly, she sets down her cup.\n\n'I had a brother,' she says. 'Edmund. When he was ten he projected a lion. A beautiful thing - gold, enormous, gentle as a cat with him. Our parents thought it charming. Nobody taught him anything; nobody thought there was anything to teach.' She turns the cup a precise quarter-turn on its saucer. 'When he was fifteen, the lion got out into Kensington Gardens. And Edmund, who could not bear to be parted from it, went after it - into it - the only way he knew. There was no witness. No safeguards. No book.'\n\nShe looks at you. Her eyes are perfectly dry.\n\n'What came back wore my brother's face, and was very polite, and never knew my name again. So you see, I am not your villain. I am the person who decided that no one else's mother would ever have to watch that.'\n\nShe slides the little book across the table. Its pages are blank. 'Write me one good reason,' she says, 'why a story should be allowed more than one ending.'",
        choices: [
            { text: "Write: \"Because Edmund had no witness. I do.\"", nextScene: "molly_fading", selfChange: 5, suspicionChange: 5, setFlags: ["harrowgate_heard"] },
            { text: "Write nothing. Leave the sandwiches.", nextScene: "molly_fading", suspicionChange: 10 },
            { text: "Write: \"You may be right.\" - and find you half mean it", nextScene: "molly_fading", selfChange: -5, suspicionChange: -10, setFlags: ["harrowgate_heard"] }
        ]
    }
};
