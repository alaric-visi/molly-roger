// Epilogue lines appended to endings (after a ✦), chosen from what the player
// did. `when` is a condition string; `except` lists endings that already tell
// that part of the story themselves.
export const epilogues = [
    {
        id: "pip_friend",
        when: "flag:pip_friend",
        except: ["pips_teacher"],
        text: "Pip grows up to be impossible to manage and wonderful to know. Admiral the frog lives to a scandalous age."
    },
    {
        id: "pip_missed",
        when: "visited:term_pip & !flag:pip_friend",
        text: "Now and then you think about the first-year with the frog, and wonder whether anyone ever stood up for them."
    },
    {
        id: "ashby_free",
        when: "flag:ashby_restored",
        text: "Thomas Ashby opens a bookshop by the docks. Biscuit the cat sleeps in the window and is rude to customers."
    },
    {
        id: "ashby_left",
        when: "visited:quiet_ward_ashby & !flag:ashby_restored",
        except: ["ledger_burned", "exposed"],
        text: "You never stop thinking about cell nine, and the cat drawn over and over on its wall in burnt match."
    },
    {
        id: "feather",
        when: "item:brass_feather",
        except: ["brass_bird"],
        text: "You keep Worthington's brass feather in a drawer. On quiet nights, it hums."
    },
    {
        id: "kite",
        when: "flag:vane_secret",
        except: ["vane_unbound"],
        text: "Whenever you see a red kite, you think of a locked drawer in a tidy mind, and hope that someone, someday, opens it."
    },
    {
        id: "captain",
        when: "flag:captain_owes",
        text: "Every Christmas, a card arrives from the grammar police. The punctuation is perfect. It is signed, simply, 'The Captain'."
    }
];
