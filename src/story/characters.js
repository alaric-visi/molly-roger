// Characters who can appear on stage and/or have a relationship bar.
// Keys are the display names used in scene data (relationshipChanges, speaker, cast).
// `key` is the short id used in condition strings, e.g. "rel:grace>=40", and in
// dialogue tags ("@grace:"). `short` labels spoken lines; `aliases` are the names
// that identify the character in narration (engine/dialogue.js).
export const characters = {
    "Molly Roger": {
        short: "Molly",
        aliases: ["Molly Roger", "Molly"],
        key: "molly",
        color: "#8A6DFF",
        relationship: true,
        relationshipLabel: "Molly Roger"
    },
    "Professor Worthington": {
        short: "Worthington",
        aliases: ["Professor Worthington", "Worthington", "the Professor"],
        key: "worthington",
        color: "#C9A227",
        relationship: true,
        relationshipLabel: "Prof. Worthington"
    },
    "Grace": {
        short: "Grace",
        aliases: ["Grace"],
        key: "grace",
        color: "#3FBBFF",
        relationship: true,
        relationshipLabel: "Grace"
    },
    "Inspector Vane": {
        short: "Vane",
        aliases: ["Inspector Vane", "Vane", "the Inspector"],
        key: "vane",
        color: "#9AA3AD", // Board grey
        relationship: true,
        relationshipLabel: "Inspector Vane"
    },
    "Pip": {
        short: "Pip",
        aliases: ["Pip"],
        key: "pip",
        color: "#7BD389", // frog green
        relationship: true,
        relationshipLabel: "Pip",
        revealWhen: "visited:term_pip" // no bar until you've met Pip
    },
    "Lady Harrowgate": {
        short: "Lady Harrowgate",
        aliases: ["Lady Harrowgate", "Harrowgate"],
        key: "harrowgate",
        color: "#B8475A", // plum silk
        relationship: false
    },
    "Thomas Ashby": {
        short: "Ashby",
        aliases: ["Thomas Ashby", "Ashby", "Thomas"],
        key: "ashby",
        color: "#C9CED6",
        relationship: false
    },
    "Roger-and-Molly": {
        short: "Roger-and-Molly",
        aliases: ["Roger-and-Molly"],
        key: "roger",
        color: "#E0A6FF",
        relationship: false
    },
    "The Captain": {
        short: "The Captain",
        aliases: ["The Captain", "the Captain"],
        key: "captain",
        color: "#6F8FE0",
        relationship: false
    }
};

export const relationshipNames = Object.keys(characters).filter(n => characters[n].relationship);

export const characterByKey = Object.fromEntries(
    Object.entries(characters).map(([name, c]) => [c.key, name])
);

export function emptyRelationships() {
    return Object.fromEntries(relationshipNames.map(n => [n, 0]));
}
