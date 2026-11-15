// Act numbers are internal ordering; the title card shows `title` and `subtitle`.
// A card appears the first time the player reaches a scene in a later act.
// `short` labels the progress track in the sidebar. `objectives` are
// [condition, text] pairs: the first whose condition holds is shown as the
// current aim (null always holds). Conditions use engine/conditions.js syntax.
export const acts = {
    1: {
        title: "Prologue", subtitle: "The Cube", short: "Pro",
        objectives: [[null, "Get through the Board's projection exam without giving yourself away."]]
    },
    2: {
        title: "Act I", subtitle: "Awakening", short: "I",
        objectives: [
            ["visited:report", "Worthington knows about Molly now. Decide who you trust: the Board, or her."],
            ["visited:research", "Find out who Molly Roger really is - and what she wants with you."],
            [null, "A pirate is talking to you in your head. Work out what that means."]
        ]
    },
    3: {
        title: "Act II", subtitle: "The Heist", short: "II",
        objectives: [
            ["visited:heist_eve", "Tonight's the night. Borrow the letter W from the Royal Alphabet Vault."],
            ["visited:without_w", "London is missing a letter. Keep your head down until the hunt dies away."],
            ["visited:term_begins", "Three weeks until the heist. Train hard, and find people you can trust."],
            [null, "Help Molly borrow the letter W from the Royal Alphabet Vault."]
        ]
    },
    4: {
        title: "Act III", subtitle: "The Inquiry", short: "III",
        objectives: [
            ["visited:inquiry_verdict", "The Board means to erase the idea of pirates. Find a way to stop it."],
            ["visited:quiet_ward_entry", "Get out of the Quiet Ward, with whoever you can bring."],
            [null, "The Board is hunting the thief. Keep your name out of Inspector Vane's ledger."]
        ]
    },
    5: {
        title: "Act IV", subtitle: "The Ledger", short: "IV",
        objectives: [
            ["visited:the_plan", "Rewrite the Ledger: both copies, at the same moment."],
            [null, "Molly is fading. Muster a crew to rob the Board's Ledger."]
        ]
    },
    6: {
        title: "Act V", subtitle: "The Old Bank", short: "V",
        objectives: [[null, "Decide what you and Molly will become."]]
    }
};

/** Crew members for the Ledger heist: character name -> the flag that signs them on. */
export const crew = {
    "Grace": "ally_grace",
    "Professor Worthington": "ally_worthington",
    "Pip": "ally_pip",
    "Roger-and-Molly": "ally_roger",
    "The Captain": "ally_captain",
    "Thomas Ashby": "ally_ashby",
    "Inspector Vane": "ally_vane"
};
