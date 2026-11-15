// Every place a scene can happen.
//   name     - shown on the stage label
//   set      - which scenery to draw (stage/art/locations.js), plus optional variant
//   realm    - institution | neutral | dream: picks the transition effect into it
//   ambience - particle effect: dust | moondust | dream | letters | embers | rain | stars | none
export const locations = {
    lecture_hall:       { name: "Lecture Hall · Ridgewell",         set: "lecture_hall",       realm: "institution", ambience: "dust" },
    library:            { name: "The Combination Library",          set: "library",            realm: "neutral",     ambience: "dust" },
    grace_hideout:      { name: "Grace's Hideout",                  set: "grace_hideout",      realm: "neutral",     ambience: "dust" },
    observatory:        { name: "The Abandoned Observatory",        set: "observatory",        realm: "dream",       ambience: "stars" },
    practice_rooms:     { name: "Practice Rooms · Ridgewell",       set: "practice_rooms",     realm: "institution", ambience: "dust" },
    worthington_office: { name: "Professor Worthington's Office",   set: "worthington_office", realm: "institution", ambience: "dust" },
    corridor:           { name: "Ridgewell Corridors",              set: "corridor",           realm: "institution", ambience: "dust" },
    dreamspace:         { name: "The Dreamspace",                   set: "dreamspace",         realm: "dream",       ambience: "dream" },
    dream_inner:        { name: "Dreamspace · The Inner Chamber",   set: "dream_inner",        realm: "dream",       ambience: "dream" },
    alphabet_vault:     { name: "The Royal Alphabet Vault",         set: "alphabet_vault",     realm: "dream",       ambience: "letters" },
    old_bank:           { name: "The Old Bank",                     set: "old_bank",           realm: "dream",       ambience: "moondust" },
    ritual_chamber:     { name: "The Old Bank · Ritual Chamber",    set: "ritual_chamber",     realm: "dream",       ambience: "embers" },
    ridgewell_later:    { name: "Ridgewell · Months Later",         set: "ridgewell_exterior", variant: "later", realm: "neutral", ambience: "dust" },
    ridgewell_after:    { name: "Ridgewell · Afterwards",           set: "ridgewell_exterior", variant: "after", realm: "institution", ambience: "rain" },
    letter:             { name: "A Letter, Months Later",           set: "writing_desk",       realm: "neutral",     ambience: "dust" },
    conceptual_seas:    { name: "The Conceptual Seas",              set: "conceptual_seas",    realm: "dream",       ambience: "dream" },
    between_worlds:     { name: "Between Worlds",                   set: "between_worlds",     realm: "neutral",     ambience: "dream" },
    ridgewell_term:     { name: "Ridgewell · Michaelmas Term",      set: "corridor",           realm: "institution", ambience: "dust" },
    hearing_room:       { name: "The Great Hall · Board Inquiry",   set: "hearing_room",       realm: "institution", ambience: "dust" },
    quiet_ward:         { name: "The Quiet Ward · Whitehall",       set: "quiet_ward",         realm: "institution", ambience: "moondust" },
    board_archive:      { name: "The Board Archive · Whitehall",    set: "board_archive",      realm: "institution", ambience: "dust" },
    dream_ledger:       { name: "The Ledger · Deep Dreamspace",     set: "dream_ledger",       realm: "dream",       ambience: "letters" },
    london_street:      { name: "London, Without a W",              set: "london_street",      realm: "neutral",     ambience: "dust" },
    headmaster_study:   { name: "The Headmaster's Study",           set: "worthington_office", realm: "institution", ambience: "dust" }
};

export const AMBIENCES = ["dust", "moondust", "dream", "letters", "embers", "rain", "stars", "none"];
