// Victorian cut-paper profile silhouettes. All drawings face RIGHT in a
// 200x260 box; the stage flips figures standing on the right so they face
// centre. Fine details (spectacles, earring, brooch) are drawn in
// `currentColor`, which the stage sets to the character's colour so they
// catch the light. Mood is shown by posture and rim light (see stage.css).

/** Shared head-and-neck profile (forehead, nose, lips, chin). */
export const HEAD = "M72 205 C74 185 70 170 62 158 C50 140 52 100 62 80 C72 58 96 48 116 52 "
    + "C134 56 144 70 146 88 C147 96 146 100 148 106 L160 123 C161 126 158 128 152 128 "
    + "C153 132 155 135 154 137 C152 139 151 140 153 142 C154 145 152 148 149 149 "
    + "C150 155 152 160 146 164 C140 168 130 168 124 170 C120 178 120 190 122 205 Z";

const INK = "#0b0910";

function silhouette({ key, fill = INK, behind = "", bust, front = "", details = "", head = "", hollow = false }) {
    // `head` is an optional transform for the head group (e.g. a smaller head for a child).
    // `hollow` draws an empty outline instead of a filled shape - for the Hollow Ones.
    const body = hollow
        ? `fill="${INK}" fill-opacity="0.25" stroke="currentColor" stroke-width="1.6" stroke-dasharray="5 4"`
        : `fill="${fill}"`;
    return `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-who="${key}">
        <g ${body}>
            <g ${head ? `transform="${head}"` : ""}>${behind}</g>
            <path d="${bust}"/>
            <g ${head ? `transform="${head}"` : ""}><path d="${HEAD}"/>${front}</g>
        </g>
        <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.9">${details}</g>
    </svg>`;
}

const molly = silhouette({
    key: "molly",
    fill: "url(#molly-ghost)",
    behind: `
        <defs>
            <linearGradient id="molly-ghost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#1b1240"/>
                <stop offset="0.7" stop-color="#0d0920"/>
                <stop offset="1" stop-color="#0d0920" stop-opacity="0.35"/>
            </linearGradient>
        </defs>
        <path d="M66 74 C42 96 34 140 40 182 C44 212 34 236 26 256 L60 252 C62 222 68 190 72 160 Z"/>
        <path d="M58 120 C46 150 50 190 44 222 C52 200 58 170 64 150 Z"/>`,
    bust: "M24 260 C28 228 50 208 84 200 L100 230 L118 200 C150 204 172 222 180 260 Z",
    front: `
        <path d="M30 74 C56 56 90 46 120 46 C148 46 170 54 184 66 C174 74 162 70 150 66
                 C142 42 120 26 98 28 C78 30 64 44 58 64 C48 66 38 72 30 74 Z"/>
        <path d="M84 200 L70 232 L96 226 Z"/><path d="M118 200 L134 232 L110 226 Z"/>`,
    details: `
        <circle cx="98" cy="134" r="6"/>
        <path d="M60 64 C90 52 130 52 152 62" stroke-dasharray="2 4" opacity="0.6"/>
        <circle cx="100" cy="40" r="3"/><path d="M95 45 L105 35 M95 35 L105 45" opacity="0.7"/>`
});

const worthington = silhouette({
    key: "worthington",
    behind: `<path d="M62 84 C50 102 52 134 62 152 C70 142 72 112 70 92 Z"/>`,
    bust: "M30 260 C34 228 58 206 94 204 C130 202 162 214 174 260 Z",
    front: `
        <path d="M100 148 C108 172 124 182 138 172 C132 164 120 160 112 148 Z"/>
        <path d="M118 196 L136 214 L118 214 Z"/>
        <path d="M124 210 C116 206 112 216 120 218 C112 222 118 230 126 222 C132 230 138 222 130 218 C138 216 134 206 126 210 Z"/>`,
    details: `
        <ellipse cx="151" cy="104" rx="4" ry="5"/>
        <path d="M147 103 L100 96"/>
        <path d="M150 109 C152 120 146 130 140 136" opacity="0.6"/>`
});

const grace = silhouette({
    key: "grace",
    behind: `<circle cx="56" cy="96" r="19"/><path d="M58 72 C68 54 96 44 120 50 C100 50 84 58 74 72 Z"/>`,
    bust: "M36 260 C38 232 60 210 94 206 C128 204 158 216 168 260 Z",
    front: `
        <path d="M118 172 L134 170 L132 208 L114 208 Z"/>
        <path d="M60 222 C56 208 70 200 84 206 C76 212 70 220 60 222 Z"/>
        <path d="M138 62 C146 60 150 68 144 72 C140 70 138 66 138 62 Z"/>`,
    details: `
        <circle cx="124" cy="196" r="4"/>
        <path d="M120 182 L132 180 M119 190 L131 188" opacity="0.5"/>
        <path d="M46 88 C52 82 62 84 64 92" opacity="0.4"/>`
});

const vane = silhouette({
    key: "vane",
    behind: `<path d="M54 152 C40 122 42 80 60 60 C80 38 122 34 152 50 C164 58 168 70 166 80
                      C158 82 150 78 142 76 C128 66 104 64 88 72 C76 80 70 100 72 120 C74 136 70 146 66 152 Z"/>`,
    bust: "M30 260 C32 230 56 208 92 204 C128 202 158 214 170 260 Z",
    front: `
        <path d="M152 50 C168 56 176 70 172 84 C166 82 160 80 156 76 Z"/>
        <path d="M120 192 L138 198 L134 214 L118 210 Z"/>`,
    details: `
        <circle cx="149" cy="104" r="6"/>
        <path d="M143 103 L104 96"/>
        <path d="M108 150 L122 176 M122 176 C114 176 112 186 120 184 M122 176 C130 176 132 186 124 184" opacity="0.8"/>
        <circle cx="150" cy="224" r="1.6" fill="currentColor"/><circle cx="154" cy="238" r="1.6" fill="currentColor"/><circle cx="158" cy="252" r="1.6" fill="currentColor"/>`
});

// A first-year: smaller head, a flat cap, and a frog called Admiral on one shoulder.
const pip = silhouette({
    key: "pip",
    head: "translate(26 40) scale(0.82)",
    bust: "M46 260 C48 238 66 222 96 218 C126 216 150 226 158 260 Z",
    front: `<path d="M56 74 C66 50 110 42 140 54 C152 58 162 66 176 70 C166 76 150 74 136 72 C112 64 86 68 64 82 Z"/>`,
    details: `
        <path d="M120 222 C120 210 132 204 142 210 C150 204 160 212 154 222 Z" fill="currentColor" opacity="0.85"/>
        <circle cx="138" cy="209" r="2.2" fill="#0b0910"/><circle cx="150" cy="211" r="2.2" fill="#0b0910"/>`
});

// Chair of the Board: a towering coiffure with a plume, a stiff ruff, pearls and a lorgnette.
const harrowgate = silhouette({
    key: "harrowgate",
    behind: `<path d="M56 124 C34 92 42 38 80 18 C110 2 152 12 162 44 C152 48 142 52 136 60 C120 50 96 52 82 64 C70 78 64 100 66 124 Z"/>
             <path d="M104 22 C98 -2 124 -24 158 -28 C136 -12 122 4 112 24 Z"/>`,
    bust: "M28 260 C30 228 54 206 92 202 C130 200 162 214 176 260 Z",
    front: `<path d="M110 194 C124 182 146 186 146 202 C158 206 156 222 140 222 L112 214 Z"/>`,
    details: `
        <circle cx="128" cy="184" r="2.2"/><circle cx="134" cy="188" r="2.2"/><circle cx="139" cy="193" r="2.2"/>
        <circle cx="157" cy="102" r="5.5"/><path d="M157 108 L162 132"/>`
});

// A Hollow One: drawn as an outline with nothing inside.
const ashby = silhouette({
    key: "ashby",
    hollow: true,
    behind: `<path d="M66 70 C78 52 104 46 124 52 C112 54 98 58 88 66 Z"/>`,
    bust: "M34 260 C36 232 58 210 92 206 C126 204 156 216 168 260 Z",
    details: `<path d="M86 120 C96 112 108 112 116 120" opacity="0.4"/>`
});

// The merged Roger-and-Molly: a clerk's bowler with a pirate's feather in the band, an earring, a cravat.
const roger = silhouette({
    key: "roger",
    fill: "url(#roger-blend)",
    behind: `<defs><linearGradient id="roger-blend" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#1b1240"/><stop offset="1" stop-color="#1a130c"/></linearGradient></defs>
             <path d="M64 120 C52 140 50 170 44 196 C56 180 62 160 68 140 Z"/>`,
    bust: "M30 260 C34 228 58 206 94 204 C130 202 162 214 174 260 Z",
    front: `<path d="M60 72 C62 46 88 32 112 34 C134 36 146 50 148 66 C158 68 166 72 168 76 C140 80 90 80 52 76 Z"/>
            <path d="M118 196 L136 214 L118 214 Z"/>`,
    details: `
        <circle cx="98" cy="134" r="6"/>
        <path d="M70 66 C64 50 74 36 90 30" stroke-width="2.4"/>
        <path d="M112 66 L150 66" opacity="0.6"/>`
});

// Captain of the grammar police: a custodian helmet with a section-mark badge and a chin strap.
const captain = silhouette({
    key: "captain",
    bust: "M28 260 C30 226 56 204 94 202 C132 200 164 214 176 260 Z",
    front: `<path d="M56 80 C54 50 80 16 106 12 C134 10 152 38 152 70 C158 74 162 78 160 82 C130 86 90 86 50 84 Z"/>
            <path d="M116 192 L140 196 L138 214 L114 210 Z"/>`,
    details: `
        <text x="98" y="58" font-family="Geist Variable, Inter Variable, sans-serif" font-size="20" fill="currentColor" stroke="none">§</text>
        <path d="M128 84 C134 110 140 130 146 150" opacity="0.8"/>
        <circle cx="150" cy="226" r="1.6" fill="currentColor"/><circle cx="154" cy="240" r="1.6" fill="currentColor"/>`
});

export const portraits = {
    "Molly Roger": molly,
    "Professor Worthington": worthington,
    "Grace": grace,
    "Inspector Vane": vane,
    "Pip": pip,
    "Lady Harrowgate": harrowgate,
    "Thomas Ashby": ashby,
    "Roger-and-Molly": roger,
    "The Captain": captain
};

/** Default mood and stage behaviour per character. */
export const castDefaults = {
    "Molly Roger": { mood: "pleased", projection: true },
    "Professor Worthington": { mood: "stern" },
    "Grace": { mood: "thoughtful" },
    "Inspector Vane": { mood: "stern" },
    "Pip": { mood: "pleased" },
    "Lady Harrowgate": { mood: "stern" },
    "Thomas Ashby": { mood: "sad" },
    "Roger-and-Molly": { mood: "thoughtful", projection: true },
    "The Captain": { mood: "stern" }
};

export const MOODS = ["neutral", "pleased", "angry", "afraid", "sad", "stern", "thoughtful"];
