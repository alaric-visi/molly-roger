// The Codex: what you've learned, kept across playthroughs.
// Each entry unlocks the first time its `when` condition holds (a string, or a
// list of strings meaning "any of these"). Sections: people, letters, papers.

export const CODEX_SECTIONS = {
    people: "People",
    letters: "Roger Molly's Letters",
    papers: "Board Papers"
};

export const codex = [
    // ------------------------------------------------------------ People
    {
        id: "molly_1", section: "people", group: "Molly Roger", title: "The pirate in your head",
        when: "visited:start",
        text: "A psychic projection in a battered tricorn and a coat that has seen several centuries of weather. Loud, brave, rude, delighted. Recruits a new student every few years; most never answer."
    },
    {
        id: "molly_2", section: "people", group: "Molly Roger", title: "Ink in the gutters",
        when: "visited:heist_eve",
        text: "Before she was Molly, she was a margin: the space in a bank ledger where a clerk who never went anywhere drew a ship every day for eleven years. She never tired of being somebody's daydream. She only wanted, for once, to be the one dreaming."
    },
    {
        id: "molly_3", section: "people", group: "Molly Roger", title: "Written back",
        when: "flag:pirate_restored",
        text: "Struck from the Ledger by decree, and written back into the world by hand. Still thin at the edges, like a drawing rubbed out and drawn again."
    },
    {
        id: "worthington_1", section: "people", group: "Professor Worthington", title: "The approved path",
        when: "visited:prologue_exam",
        text: "Professor of Controlled Projection at Ridgewell. Smells of mothballs and misplaced authority. Not cruel - afraid, and organised about it. Makes cocoa for his only tutorial student."
    },
    {
        id: "worthington_2", section: "people", group: "Professor Worthington", title: "A feather in a drawer",
        when: "flag:saw_brass_bird",
        text: "Keeps a single brass feather wrapped in a handkerchief in his desk drawer, polished by years of handling. Goes pale at drawings of birds."
    },
    {
        id: "worthington_3", section: "people", group: "Professor Worthington", title: "Tuppence",
        when: "flag:worthington_ally",
        text: "At nine he projected a clockwork bird with a voice like a music box. At twenty-eight the Board offered him a teaching post, and the price was Tuppence. He paid it, and has told himself every day since that it was the sensible thing to do."
    },
    {
        id: "grace_1", section: "people", group: "Grace", title: "The most talented psychic at Ridgewell",
        when: ["visited:research", "visited:grace_help", "visited:term_grace", "visited:bank_planning"],
        text: "Ink on her fingers, chalk on her cuff. Runs a hideout behind a bookcase that opens when you pull on Hume, 'because nobody has ever voluntarily touched Hume'."
    },
    {
        id: "grace_2", section: "people", group: "Grace", title: "Eleanor Hale's granddaughter",
        when: ["visited:roger_story", "visited:grace_motives", "visited:grace_connection"],
        text: "Her grandmother learned projection at Roger Molly's kitchen table, stood witness at his merger, and was erased by the Board for it. Grace has spent her life finishing what Eleanor started."
    },
    {
        id: "vane_1", section: "people", group: "Inspector Vane", title: "Board Oversight",
        when: "flag:met_vane",
        text: "Inspector of the Board of Psychic Regulation. Grey coat, gloves, a small ledger. Finds threats untidy. Has never, in her career, looked the other way."
    },
    {
        id: "vane_2", section: "people", group: "Inspector Vane", title: "Kite",
        when: "flag:vane_secret",
        text: "In her filing-room mind, one drawer at the very bottom is locked, labelled in a child's handwriting: KITE. A girl on a green hill, and a red kite flying without a string."
    },
    {
        id: "vane_3", section: "people", group: "Inspector Vane", title: "Closed by subject",
        when: "visited:vane_page",
        text: "VANE, ADELAIDE. AGE 12. Nobody took her kite. She wrote it into a ledger herself and shut the book - and has been keeping it shut ever since."
    },
    {
        id: "pip_1", section: "people", group: "Pip", title: "The first-year with the frog",
        when: "visited:term_pip",
        text: "Eleven years old. Projected a frog called Admiral during morning assembly. The frog said 'ribbit'. Neither of them likes cubes."
    },
    {
        id: "pip_2", section: "people", group: "Pip", title: "Code name: the Frog",
        when: "flag:ally_pip",
        text: "Insists on the code name 'the Frog', on the grounds that Admiral is the Admiral. Lost a classmate who made it snow in the refectory. Nobody looks at first-years."
    },
    {
        id: "harrowgate_1", section: "people", group: "Lady Harrowgate", title: "Chair of the Board",
        when: "visited:inquiry_begins",
        text: "Plum silk, pearls, a single black plume, and a smile like a closed door. Believes every story should have one ending, approved and stamped in triplicate."
    },
    {
        id: "harrowgate_2", section: "people", group: "Lady Harrowgate", title: "Edmund",
        when: "flag:harrowgate_heard",
        text: "Her younger brother projected a gold lion at ten, and at fifteen followed it into Kensington Gardens with no witness and no safeguards. What came back never knew her name."
    },
    {
        id: "ashby_1", section: "people", group: "Thomas Ashby", title: "Cell nine",
        when: "visited:quiet_ward_ashby",
        text: "Nineteen. Projected a ship's cat called Biscuit at twelve. The Board cut her out and left a space the exact shape of her. Draws her on the wall, over and over, in burnt match."
    },
    {
        id: "ashby_2", section: "people", group: "Thomas Ashby", title: "Biscuit",
        when: "flag:ashby_restored",
        text: "Given back, by feel, in a white-tiled room. Ginger, purring like a kettle, and contemptuous of the Board. 'Oh, you idiot. Where have you been?'"
    },
    {
        id: "captain_1", section: "people", group: "The Captain", title: "Grammar Police",
        when: ["visited:reason_success", "visited:recruit_captain"],
        text: "Captain of the Royal Alphabet's grammar police, by the subordinate clauses on his sleeve. Lends letters in triplicate. Uses no contractions. Considers a postscript to a postscript irregular."
    },
    {
        id: "roger_1", section: "people", group: "Roger-and-Molly", title: "A medium-sized life",
        when: "visited:meet_roger",
        text: "Not quite Roger, not quite Molly: a clerk's sleeve-garters and a pirate's earring, a face that settles into one and then the other like a spun coin. 'I had a small life, and she had a big dream.'"
    },

    // ------------------------------------------------------------ Roger Molly's letters
    {
        id: "letter_1", section: "letters", group: "Letters", title: "I. March, 1803",
        when: ["visited:research", "visited:research_alone"],
        text: "My dear Agnes - The weather is foul and coal is ninepence. Mr Fotheringay has moved my desk nearer the window, which he says is a kindness and I suspect is a draught. I have taken to drawing a ship in the margin of the day-book when the sums are slow. Nobody has noticed. I find I rather hope somebody will. Your affectionate brother, Roger."
    },
    {
        id: "letter_2", section: "letters", group: "Letters", title: "II. November, 1803",
        when: "visited:research_alone",
        text: "Agnes - You will laugh. I have acquired an imaginary friend, at the age of thirty-four. She sails the ship in my margins and has very decided opinions about my accounts, most of them unrepeatable. She says I add up other people's money as if I were apologising for it. She is not wrong. R."
    },
    {
        id: "letter_3", section: "letters", group: "Letters", title: "III. April, 1804",
        when: "visited:term_restricted",
        text: "Dear Agnes - She told me today that I am braver than I look. I said that was not difficult. She said that was exactly her point. I walked home the long way, by the river, and did not once look at my boots. A small thing. You would not believe how large it felt. R."
    },
    {
        id: "letter_4", section: "letters", group: "Letters", title: "IV. January, 1805",
        when: "visited:meet_roger",
        text: "Agnes - We have been practising. Evenings, and Sundays. Some nights I go too far and wake convinced my name is Captain Something; some nights she goes too quiet and I sit up saying hers until she answers. She is patient, which surprises us both. Miss Hale from the school comes on Thursdays to take notes. R. (and M.)"
    },
    {
        id: "letter_5", section: "letters", group: "Letters", title: "V. Confiscated, 1805",
        when: ["visited:archive_success", "visited:archive_alarm"],
        text: "[Found in the Board archive, stamped NOT DELIVERED.] Agnes - Miss Hale says we are ready. I am frightened, and happy, and frightened of being happy, which she says is the sanest thing about me. If anyone tells you afterwards that I was lost, do not believe them. I am only going somewhere you cannot post letters to. R. and M."
    },
    {
        id: "letter_6", section: "letters", group: "Letters", title: "VI. Undated",
        when: ["visited:bank_planning", "visited:ritual_complete"],
        text: "Dear Agnes,\n\nGone plunderin'.\n\nYour loving brother (both of them)."
    },

    // ------------------------------------------------------------ Board papers
    {
        id: "paper_circular", section: "papers", group: "Papers", title: "On the Management of Persistent Projections",
        when: "item:board_circular",
        text: "BOARD CIRCULAR 17/41. Projections exhibiting persistence, opinion or humour beyond the eighteenth day are to be referred for quieting at the establishment in the sub-basement, Board Offices, Whitehall. Parents need not be informed. Signed, H. Harrowgate, Chair."
    },
    {
        id: "paper_vane_file", section: "papers", group: "Papers", title: "Inspector's file: one student",
        when: "visited:vane_interview",
        text: "SUBJECT: second-year, Ridgewell. RECORD: unremarkable, until recently. NOTES: hears the sea. Lies (well / badly - delete as applicable). RECOMMENDATION: observe. A second hand, smaller, has added in pencil and then rubbed out: 'reminds me of'."
    },
    {
        id: "paper_ward", section: "papers", group: "Papers", title: "Quiet Ward intake card",
        when: "visited:quiet_ward_entry",
        text: "NAME: ________. PROJECTION: ________. PROCEDURE: quieting (standard). OUTCOME: cooperative. There are forty-one of these cards in the drawer beside the door. Every OUTCOME says the same thing."
    },
    {
        id: "paper_erasure", section: "papers", group: "Papers", title: "Order of Erasure",
        when: "visited:inquiry_verdict",
        text: "BY ORDER OF THE BOARD. At the autumn equinox, the concept PIRATE shall be struck from the Ledger of the British Dreamspace. Persistent projections dependent on the concept will cease. No further action is anticipated. H.H."
    },
    {
        id: "paper_safeguards", section: "papers", group: "Papers", title: "Eleanor Hale's safeguards",
        when: ["visited:grace_warning", "flag:grace_witness"],
        text: "One: only when both are certain, not merely eager. Two: a witness who knows your name, and will say it aloud if you begin to forget it. Three: anchors - a street, a door, a stolen thing. The Board burned every copy but this one."
    }
];
