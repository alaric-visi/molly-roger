// Player identity: name, how Molly addresses you, and pronouns.
//
// Scene text can use these tokens (capitalise the first letter for a
// capitalised result, e.g. {They_are}):
//   {name}  {lass}
//   {they} {them} {their} {theirs} {themself}
//   {they_are} {they_were} {they_have}

export const ADDRESS_OPTIONS = {
    lass:  { label: "Lass",  word: "lass" },
    lad:   { label: "Lad",   word: "lad" },
    matey: { label: "Matey", word: "matey" }
};

export const PRONOUN_OPTIONS = {
    she: {
        label: "she / her",
        they: "she", them: "her", their: "her", theirs: "hers", themself: "herself",
        they_are: "she is", they_were: "she was", they_have: "she has"
    },
    he: {
        label: "he / him",
        they: "he", them: "him", their: "his", theirs: "his", themself: "himself",
        they_are: "he is", they_were: "he was", they_have: "he has"
    },
    they: {
        label: "they / them",
        they: "they", them: "them", their: "their", theirs: "theirs", themself: "themself",
        they_are: "they are", they_were: "they were", they_have: "they have"
    }
};

export const DEFAULT_PLAYER = { name: "Ada", address: "lass", pronouns: "she" };

export const NAME_MAX_LENGTH = 24;

export const PRONOUN_TOKENS = ["they", "them", "their", "theirs", "themself", "they_are", "they_were", "they_have"];
export const TOKENS = ["name", "lass", ...PRONOUN_TOKENS];
