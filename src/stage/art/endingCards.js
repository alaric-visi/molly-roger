// Tarot-style ending cards (200x340). Each discovered ending shows its card;
// undiscovered ones show the card back in the Endings gallery.
import { HEAD } from "./portraits.js";

const GOLD = "#c9a227";
const INK = "#1a130c";

function frame(id, { bg, numeral, title, motif, accent }) {
    return `<svg class="tarot" viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
        <defs>
            <linearGradient id="${id}-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#f4ead0"/><stop offset="1" stop-color="#e2d2a8"/>
            </linearGradient>
            <linearGradient id="${id}-scene" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/>
            </linearGradient>
            <clipPath id="${id}-clip"><rect x="22" y="44" width="156" height="226" rx="2"/></clipPath>
        </defs>
        <rect x="1" y="1" width="198" height="338" rx="10" fill="url(#${id}-face)" stroke="${INK}" stroke-width="2"/>
        <rect x="10" y="10" width="180" height="320" rx="6" fill="none" stroke="${GOLD}" stroke-width="1.5"/>
        <rect x="14" y="14" width="172" height="312" rx="4" fill="none" stroke="${GOLD}" stroke-width="0.6"/>
        ${[[14, 14], [186, 14], [14, 326], [186, 326]].map(([x, y]) => `<path d="M${x} ${y - 5} L${x + 5} ${y} L${x} ${y + 5} L${x - 5} ${y} Z" fill="${GOLD}"/>`).join("")}
        <text x="100" y="34" text-anchor="middle" font-family="Geist Variable, Inter Variable, sans-serif" font-size="15" fill="${INK}">${numeral}</text>
        <rect x="22" y="44" width="156" height="226" rx="2" fill="url(#${id}-scene)"/>
        <g clip-path="url(#${id}-clip)">${motif}</g>
        <rect x="22" y="44" width="156" height="226" rx="2" fill="none" stroke="${INK}" stroke-width="1.2"/>
        <path d="M18 284 H182 L176 296 L182 308 H18 L24 296 Z" fill="${accent}" stroke="${INK}" stroke-width="1"/>
        <text x="100" y="301" text-anchor="middle" font-family="Geist Variable, Inter Variable, sans-serif" font-size="${title.length > 16 ? 12 : 14}" fill="#f6ecd2">${title}</text>
    </svg>`;
}

const head = (x, y, s, fill, flip = false, op = 1) =>
    `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" opacity="${op}"><path d="${HEAD}" fill="${fill}"/></g>`;

const stars = (n, seed, color = "#efe8ff") => {
    let s = seed, out = "";
    for (let i = 0; i < n; i++) {
        s = (s * 9301 + 49297) % 233280;
        const x = 24 + (s / 233280) * 152;
        s = (s * 9301 + 49297) % 233280;
        const y = 48 + (s / 233280) * 120;
        out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.5 + (i % 3) * 0.4).toFixed(1)}" fill="${color}" opacity="0.8"/>`;
    }
    return out;
};

const MOTIFS = {
    pirate_life: {
        bg: ["#2a1d5c", "#0d0826"], accent: "#5b3fd9",
        // Two profiles nose to nose - the space between them makes a third shape.
        motif: stars(24, 7) + head(-8, 70, 0.62, "#c9b8ff", false, 0.85) + head(208, 70, 0.62, "#ffe6c0", true, 0.85)
            + `<circle cx="100" cy="128" r="30" fill="#fff6d8" opacity="0.25"/>`
            + `<path d="M22 238 Q60 226 100 238 T178 238 V270 H22 Z" fill="#120a30"/>`
            + `<path d="M84 236 L118 236 L112 246 L90 246 Z M100 236 V200 M100 204 Q114 214 100 226" fill="#0b0716" stroke="#0b0716" stroke-width="2"/>`
    },
    peaceful_merger: {
        bg: ["#f2c58a", "#3a2a6a"], accent: "#8a6dff",
        motif: `<circle cx="100" cy="100" r="28" fill="#fff2cf" opacity="0.9"/>`
            + `<path d="M30 270 C40 220 80 210 92 180 C96 168 100 160 100 150" stroke="#3fd6ff" stroke-width="9" fill="none" opacity="0.8"/>`
            + `<path d="M170 270 C160 220 120 210 108 180 C104 168 100 160 100 150" stroke="#c9a227" stroke-width="9" fill="none" opacity="0.8"/>`
            + `<path d="M100 150 C100 130 100 110 100 100" stroke="#efe6ff" stroke-width="12" fill="none" opacity="0.85"/>`
    },
    approved_psychic: {
        bg: ["#3a2c1a", "#120d08"], accent: "#8a6a12",
        motif: `<path d="M50 250 V120 Q100 50 150 120 V250" fill="none" stroke="${GOLD}" stroke-width="2"/>`
            + [62, 76, 90, 100, 110, 124, 138].map(x => `<line x1="${x}" y1="${x === 100 ? 82 : 100}" x2="${x}" y2="250" stroke="${GOLD}" stroke-width="1.6"/>`).join("")
            + `<line x1="44" y1="250" x2="156" y2="250" stroke="${GOLD}" stroke-width="4"/><circle cx="100" cy="74" r="5" fill="none" stroke="${GOLD}" stroke-width="2"/>`
            + `<path d="M100 160 L124 172 L100 184 L76 172 Z M76 172 V198 L100 210 L124 198 V172 M100 184 V210" fill="rgba(240,220,160,0.15)" stroke="#f2e0a8" stroke-width="1.5"/>`
    },
    teacher_ending: {
        bg: ["#1d2a24", "#0d1410"], accent: "#2f6b4f",
        motif: `<rect x="34" y="70" width="132" height="90" fill="#22302a" stroke="#4a3420" stroke-width="5"/>`
            + `<path d="M70 128 C84 112 116 112 130 128 L118 134 L82 134 Z" fill="none" stroke="#efe6d6" stroke-width="1.5" opacity="0.8"/>`
            + `<text x="100" y="100" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#efe6d6" opacity="0.7">Lesson the First</text>`
            + `<path d="M140 250 C150 210 160 190 176 178 C160 200 152 226 146 252 Z" fill="#efe6d6"/>`
            + `<rect x="60" y="200" width="80" height="50" fill="#120c07"/><rect x="54" y="194" width="92" height="8" fill="#2a1d12"/>`
    },
    friends_ending: {
        bg: ["#a7743f", "#2a1d5c"], accent: "#1f7fb0",
        motif: `<path d="M22 230 Q100 120 178 230 V270 H162 V236 Q100 150 38 236 V270 H22 Z" fill="#120c14"/>`
            + `<g fill="#120c14"><path d="M78 176 l-4 0 l1 -20 q-6 -2 -4 -10 q2 -8 9 -6 q7 2 5 10 q-1 6 -5 6 l1 20 Z"/>`
            + `<path d="M122 176 l4 0 l-1 -20 q6 -2 4 -10 q-2 -8 -9 -6 q-7 2 -5 10 q1 6 5 6 l-1 20 Z"/></g>`
            + `<line x1="86" y1="160" x2="114" y2="160" stroke="#f6ecd2" stroke-width="2"/>` + stars(10, 3)
    },
    informant: {
        bg: ["#2a2016", "#0b0805"], accent: "#6a4a2a",
        motif: `<path d="M30 200 L100 214 L170 200 L170 248 L100 262 L30 248 Z" fill="#efe6cf"/>`
            + `<path d="M100 214 V262" stroke="#8a7a5a" stroke-width="1.2"/>`
            + [0, 1, 2, 3].map(i => `<line x1="42" y1="${212 + i * 9}" x2="92" y2="${220 + i * 9}" stroke="#5a4a3a" stroke-width="0.8"/>`).join("")
            + `<path d="M120 196 C130 140 150 110 172 90 C156 130 140 166 126 200 Z" fill="#efe6cf"/>`
            + `<path d="M60 100 q8 18 0 26 q-8 -8 0 -26 Z" fill="#8fbfe0" opacity="0.8"/>`
            + head(-10, 70, 0.55, "#0b0805", false, 0.6)
    },
    silenced: {
        bg: ["#3b4250", "#14161c"], accent: "#4a4f5c",
        motif: `<ellipse cx="100" cy="170" rx="56" ry="20" fill="none" stroke="#9aa3ad" stroke-width="10"/>`
            + `<ellipse cx="100" cy="170" rx="56" ry="20" fill="none" stroke="#2a2e36" stroke-width="2" stroke-dasharray="3 7"/>`
            + `<rect x="86" y="182" width="28" height="24" rx="3" fill="#9aa3ad"/><path d="M92 182 V174 Q100 162 108 174 V182" fill="none" stroke="#9aa3ad" stroke-width="4"/>`
            + `<circle cx="100" cy="194" r="3" fill="#14161c"/>`
            + `<path d="M150 90 q10 -4 14 4 M156 104 q10 -2 12 6" stroke="#c9b8ff" stroke-width="1.4" fill="none" opacity="0.45"/>`
    },
    ritual_consumed: {
        bg: ["#2a0f2a", "#08040c"], accent: "#7a1f3a",
        motif: `<path d="M64 110 Q100 70 136 110 Q144 170 100 220 Q56 170 64 110 Z" fill="#e8dcf4" opacity="0.92"/>`
            + `<ellipse cx="84" cy="130" rx="11" ry="8" fill="#08040c"/><ellipse cx="116" cy="130" rx="11" ry="8" fill="#08040c"/>`
            + `<path d="M88 176 Q100 168 112 176" stroke="#08040c" stroke-width="3" fill="none"/>`
            + `<path d="M100 76 L94 104 L104 120 L96 150" stroke="#08040c" stroke-width="1.6" fill="none"/>`
            + head(36, 50, 0.7, "#8a6dff", false, 0.25)
    },
    three_day_weekend: {
        bg: ["#f0c070", "#6a3a7a"], accent: "#a0522d",
        motif: `<rect x="56" y="80" width="88" height="110" rx="4" fill="#f6ecd2" stroke="${INK}" stroke-width="1.5"/>`
            + `<rect x="56" y="80" width="88" height="24" rx="4" fill="#9a1f24"/>`
            + `<text x="100" y="98" text-anchor="middle" font-family="Geist Variable, Inter Variable, sans-serif" font-size="13" fill="#f6ecd2">MONDAY</text>`
            + `<text x="100" y="160" text-anchor="middle" font-family="Geist Variable, Inter Variable, sans-serif" font-size="46" fill="${INK}" opacity="0.25">?</text>`
            + `<path d="M56 190 L68 176 L80 192 L92 178 L104 194 L116 180 L128 194 L144 180 V190 Z" fill="#6a3a7a"/>`
            + `<path d="M62 70 C80 58 120 58 138 70 C128 74 118 72 110 70 C104 56 96 56 90 70 C82 72 72 74 62 70 Z" fill="${INK}"/>`
            + `<path d="M40 240 Q100 220 160 240" stroke="#f6ecd2" stroke-width="3" fill="none" opacity="0.7"/>`
    },
    vane_unbound: {
        bg: ["#9fc6e8", "#e8d6b0"], accent: "#9a1f24",
        motif: `<path d="M120 70 L146 100 L120 140 L94 100 Z" fill="#c0393f" stroke="${INK}" stroke-width="1.2"/>`
            + `<path d="M120 70 V140 M94 100 H146" stroke="${INK}" stroke-width="1" opacity="0.6"/>`
            + `<path d="M120 140 C110 170 130 190 112 214 C100 230 92 236 80 248" stroke="${INK}" stroke-width="1.2" fill="none"/>`
            + [0, 1, 2].map(i => `<path d="M${116 - i * 10} ${160 + i * 26} l8 -4 l-2 8 Z" fill="#c0393f"/>`).join("")
            + `<path d="M40 262 L80 248 L120 262 L120 270 L40 270 Z" fill="#efe6cf" stroke="${INK}" stroke-width="1"/>`
    },
    lending_library: {
        bg: ["#2a1d5c", "#120c30"], accent: "#2f6b4f",
        motif: `<path d="M50 250 V110 Q100 60 150 110 V250 Z" fill="#ffd98a" opacity="0.85"/>`
            + `<path d="M58 250 V114 Q100 72 142 114 V250 Z" fill="none" stroke="${INK}" stroke-width="2"/>`
            + [0, 1, 2].map(r => [0, 1, 2, 3, 4, 5].map(c => `<rect x="${64 + c * 12}" y="${150 + r * 32}" width="9" height="24" fill="${["#3b2a20", "#2a3328", "#41241f", "#2c2a3d"][(r + c) % 4]}"/>`).join("")).join("")
            + `<path d="M100 130 C110 122 122 128 118 138 C126 140 124 150 116 150 L100 146 Z" fill="#8a6dff" opacity="0.8"/>`
    },
    ledger_burned: {
        bg: ["#3a1408", "#0b0503"], accent: "#c0571f",
        motif: `<path d="M44 220 C70 206 92 210 100 222 C108 210 130 206 156 220 L156 250 C130 238 108 240 100 252 C92 240 70 238 44 250 Z" fill="#efe6cf"/>`
            + `<path d="M64 214 C60 180 84 170 78 140 C96 156 98 176 100 190 C104 168 114 150 112 120 C134 146 138 180 132 214 Z" fill="#f2a03a" opacity="0.9"/>`
            + `<path d="M80 214 C78 192 92 186 90 168 C100 180 104 196 104 206 C110 192 116 184 116 170 C126 188 124 204 118 214 Z" fill="#ffe6a8"/>`
            + [0, 1, 2, 3, 4].map(i => `<circle cx="${70 + i * 15}" cy="${100 - (i % 2) * 20}" r="1.6" fill="#ffd59a"/>`).join("")
    },
    exposed: {
        bg: ["#d8cfbd", "#9a8f7a"], accent: "#2a2a2a",
        motif: `<rect x="40" y="70" width="120" height="170" fill="#f4eee0" stroke="${INK}" stroke-width="1.2" transform="rotate(-4 100 155)"/>`
            + `<g transform="rotate(-4 100 155)"><text x="100" y="94" text-anchor="middle" font-family="Geist Variable, Inter Variable, sans-serif" font-size="14" fill="${INK}">THE TIMES</text>`
            + `<line x1="48" y1="100" x2="152" y2="100" stroke="${INK}"/>`
            + `<text x="100" y="120" text-anchor="middle" font-family="Geist Variable, Inter Variable, sans-serif" font-size="11" fill="${INK}">THE BOARD'S</text>`
            + `<text x="100" y="134" text-anchor="middle" font-family="Geist Variable, Inter Variable, sans-serif" font-size="11" fill="${INK}">SECRET WARD</text>`
            + [0, 1, 2, 3, 4, 5, 6].map(i => `<line x1="50" y1="${150 + i * 10}" x2="${i % 3 === 2 ? 110 : 150}" y2="${150 + i * 10}" stroke="${INK}" stroke-width="0.8" opacity="0.5"/>`).join("") + `</g>`
    },
    hollow: {
        bg: ["#c9d3cc", "#5f6f68"], accent: "#4a5752",
        motif: head(20, 46, 0.9, "none", false, 1).replace('fill="none"', 'fill="none" stroke="#1c2421" stroke-width="2.5" stroke-dasharray="6 5"')
            + `<rect x="22" y="232" width="156" height="38" fill="#4a5752"/>`
            + [0, 1, 2, 3, 4, 5, 6].map(i => `<line x1="${34 + i * 22}" y1="44" x2="${34 + i * 22}" y2="232" stroke="#2e3834" stroke-width="2" opacity="0.35"/>`).join("")
    },
    pips_teacher: {
        bg: ["#1d2a24", "#0d1410"], accent: "#3a8a4a",
        motif: `<rect x="34" y="66" width="132" height="84" fill="#22302a" stroke="#4a3420" stroke-width="5"/>`
            + `<text x="100" y="98" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#efe6d6" opacity="0.8">Not a cube.</text>`
            + `<path d="M84 128 C84 116 96 110 106 116 C114 110 124 118 118 128 Z" fill="#7bd389" opacity="0.8"/>`
            + `<path d="M70 250 C70 226 82 214 100 214 C118 214 130 226 130 250 Z" fill="#0b0910"/>`
            + `<circle cx="100" cy="196" r="16" fill="#0b0910"/><path d="M84 188 C90 176 112 174 120 184 C124 186 128 188 132 190 C118 192 100 190 84 192 Z" fill="#0b0910"/>`
            + `<path d="M110 212 C110 204 118 200 124 204 C130 200 136 206 132 212 Z" fill="#7bd389"/>`
    },
    brass_bird: {
        bg: ["#3a2c1a", "#120d08"], accent: "#8a6a12",
        motif: `<circle cx="100" cy="140" r="54" fill="#ffd98a" opacity="0.15"/>`
            + `<path d="M100 150 C84 150 74 140 72 128 C86 132 92 130 100 120 C108 130 114 132 128 128 C126 140 116 150 100 150 Z" fill="#c9a227"/>`
            + `<path d="M72 128 C54 108 40 92 30 70 C52 80 66 96 82 120 Z" fill="#e7c46a"/><path d="M128 128 C146 108 160 92 170 70 C148 80 134 96 118 120 Z" fill="#e7c46a"/>`
            + `<circle cx="100" cy="114" r="10" fill="#c9a227"/><path d="M108 114 L118 116 L108 118 Z" fill="#8a6a12"/><circle cx="103" cy="112" r="1.6" fill="${INK}"/>`
            + `<path d="M96 150 L92 168 M104 150 L108 168" stroke="#8a6a12" stroke-width="2"/>`
            + [0, 1, 2].map(i => `<path d="M${46 + i * 8} ${96 + i * 6} l18 4" stroke="#8a6a12" stroke-width="1"/>`).join("")
    }
};


// The hidden ending: the Ledger opened into a book of every ending at once.
MOTIFS.true_ending = {
    bg: ["#1c1440", "#05030f"], accent: "#c9a227",
    motif: stars(30, 11, "#ffe6c0")
        + `<path d="M100 170 C80 156 50 154 30 162 L30 238 C50 230 80 232 100 246 Z" fill="#efe6cf"/>`
        + `<path d="M100 170 C120 156 150 154 170 162 L170 238 C150 230 120 232 100 246 Z" fill="#e6dcc0"/>`
        + `<line x1="100" y1="170" x2="100" y2="246" stroke="#8a7a5a" stroke-width="1.2"/>`
        + [[60, 120, 0.9], [96, 92, 1], [132, 116, 0.85], [78, 66, 0.7], [122, 60, 0.75], [100, 132, 0.95]].map(([x, y, s]) =>
            `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 6 L12 6 L8 12 L-8 12 Z M0 6 V-12 M0 -11 Q9 -4 0 3" fill="#c9a227" stroke="#c9a227" stroke-width="1.4"/></g>`).join("")
        + head(18, 186, 0.32, "#c9b8ff", false, 0.7) + head(182, 186, 0.32, "#ffe6c0", true, 0.7)
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

export function endingCard(endingId, index, title) {
    const m = MOTIFS[endingId] || { bg: ["#2a2016", "#0b0805"], accent: "#5a4a3a", motif: "" };
    return frame(`card-${endingId}`, { ...m, numeral: ROMAN[index] || "", title });
}

export function cardBack(index) {
    const id = `cardback-${index}`;
    return `<svg class="tarot" viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Undiscovered ending">
        <defs>
            <pattern id="${id}-p" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="20" height="20" fill="#1c1440"/><path d="M0 10 H20 M10 0 V20" stroke="#2b2068" stroke-width="1"/>
            </pattern>
        </defs>
        <rect x="1" y="1" width="198" height="338" rx="10" fill="url(#${id}-p)" stroke="#0b0716" stroke-width="2"/>
        <rect x="10" y="10" width="180" height="320" rx="6" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="0.8"/>
        <circle cx="100" cy="170" r="46" fill="#120c30" stroke="${GOLD}" stroke-width="1.5"/>
        <path d="M64 170 Q100 136 136 170 Q100 204 64 170 Z" fill="none" stroke="${GOLD}" stroke-width="1.5"/>
        <circle cx="100" cy="170" r="12" fill="${GOLD}" opacity="0.85"/><circle cx="100" cy="170" r="5" fill="#120c30"/>
        <text x="100" y="40" text-anchor="middle" font-family="Geist Variable, Inter Variable, sans-serif" font-size="15" fill="${GOLD}">${ROMAN[index] || ""}</text>
        <text x="100" y="304" text-anchor="middle" font-family="Geist Variable, Inter Variable, sans-serif" font-size="14" fill="${GOLD}" opacity="0.8">Unwritten</text>
    </svg>`;
}
