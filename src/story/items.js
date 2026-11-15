// Things the player can carry. Gained with `addItems: ["id"]`, checked with
// `requires: "item:id"` or `[[if item:id]]` in text. Shown in the Satchel.
// Icons are Font Awesome 6 (solid) names.
export const items = {
    roger_letters: {
        name: "Roger Molly's letters",
        icon: "fa-envelope-open-text",
        description: "A bundle of letters from the restricted section, in a bank clerk's careful hand. The last one reads, simply: 'Gone plunderin'.'"
    },
    grace_photo: {
        name: "A faded photograph",
        icon: "fa-image",
        description: "Grace's grandmother, who stood witness at Roger Molly's merger. She looks remarkably like Molly Roger - but isn't."
    },
    stolen_w: {
        name: "The letter W",
        icon: "fa-w",
        description: "Borrowed from the Royal Alphabet Vault. It hums faintly. For three days, London will have to manage without it."
    },
    stray_comma: {
        name: "A stray comma",
        icon: "fa-quote-right",
        description: "All Molly managed to grab without you. Small, curled, and faintly embarrassed."
    },
    board_circular: {
        name: "The Board circular",
        icon: "fa-folder-closed",
        description: "ON THE MANAGEMENT OF PERSISTENT PROJECTIONS. Recommends 'quieting' at the Quiet Ward, Whitehall. Signed in loops and certainty: H. Harrowgate, Chair."
    },
    brass_feather: {
        name: "A brass feather",
        icon: "fa-feather-pointed",
        description: "From Tuppence, the clockwork bird Professor Worthington projected when he was nine, and gave up for a teaching post. Warm to the touch."
    },
    ashby_drawing: {
        name: "Ashby's drawing",
        icon: "fa-cat",
        description: "A cat, curled up, tail over its nose, drawn in burnt match on the back of a Board form. Her name was Biscuit."
    }
};
