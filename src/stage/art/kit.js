// Drawing kit for the paper-theatre scenery.
// Every location is an 800x300 SVG made of "flats" (layers) at different
// depths; stage.js nudges each layer by its data-depth for parallax, so
// layers are drawn wider than the frame (-40..840) to avoid showing edges.

export const W = 800;
export const H = 300;

/** Deterministic PRNG - scenery looks the same on every visit. */
export function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

export const r1 = n => Math.round(n * 10) / 10;
export const lerp = (a, b, t) => a + (b - a) * t;

/** Per-drawing context that collects gradient defs with unique ids. */
export function makeKit(prefix) {
    const defs = [];
    let n = 0;
    const id = (p = "d") => `${prefix}-${p}${++n}`;
    const stopTags = stops => stops
        .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
        .join("");

    const k = {
        id,
        def(s) { defs.push(s); },

        lin(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
            const i = id("l");
            defs.push(`<linearGradient id="${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stopTags(stops)}</linearGradient>`);
            return `url(#${i})`;
        },

        rad(stops, cx = 0.5, cy = 0.5, r = 0.5) {
            const i = id("r");
            defs.push(`<radialGradient id="${i}" cx="${cx}" cy="${cy}" r="${r}">${stopTags(stops)}</radialGradient>`);
            return `url(#${i})`;
        },

        /** A soft pool of light. */
        glow(x, y, r, color, opacity = 0.7, cls = "") {
            const fill = k.rad([[0, color, opacity], [0.35, color, opacity * 0.45], [1, color, 0]]);
            return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" class="${cls}"/>`;
        },

        /** Elliptical light pool (e.g. on a floor). */
        pool(x, y, rx, ry, color, opacity = 0.5, cls = "") {
            const fill = k.rad([[0, color, opacity], [1, color, 0]]);
            return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" class="${cls}"/>`;
        },

        svg(body) {
            return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs.join("")}</defs>${body}</svg>`;
        }
    };
    return k;
}

/** A parallax flat. depth 0 = fixed backdrop, ~1 = nearest the audience. */
export const layer = (depth, body) => `<g class="layer" data-depth="${depth}">${body}</g>`;

export const rect = (x, y, w, h, fill, extra = "") =>
    `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${fill}" ${extra}/>`;
export const poly = (pts, fill, extra = "") =>
    `<polygon points="${pts.map(p => p.map(r1).join(",")).join(" ")}" fill="${fill}" ${extra}/>`;
export const path = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${extra}/>`;
export const line = (x1, y1, x2, y2, stroke, w = 1, extra = "") =>
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${stroke}" stroke-width="${w}" ${extra}/>`;
export const circle = (cx, cy, r, fill, extra = "") =>
    `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${fill}" ${extra}/>`;
export const text = (x, y, str, { size = 14, fill = "#fff", family = "Geist Variable, Inter Variable, sans-serif", extra = "" } = {}) =>
    `<text x="${r1(x)}" y="${r1(y)}" font-family="${family}" font-size="${size}" fill="${fill}" ${extra}>${str}</text>`;

/** Field of stars; some twinkle. */
export function stars(rand, n, { x0 = -30, x1 = 830, y0 = 0, y1 = 200, color = "#f1ecff", rMin = 0.4, rMax = 1.6 } = {}) {
    let out = "";
    for (let i = 0; i < n; i++) {
        const cls = i % 5 === 0 ? "twinkle" : i % 7 === 0 ? "twinkle alt" : "";
        out += circle(lerp(x0, x1, rand()), lerp(y0, y1, rand()), lerp(rMin, rMax, rand()), color,
            `opacity="${r1(0.3 + rand() * 0.6)}" class="${cls}"`);
    }
    return out;
}

/** Arched (Gothic/Georgian) window with mullions. */
export function archWindow(x, y, w, h, { glass = "#2c3a55", frame = "#0d0a07", bars = true, glassExtra = "" } = {}) {
    const r = w / 2;
    const d = `M${x} ${y + h} V${y + r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h} Z`;
    let out = path(d, frame);
    const inset = 4;
    const di = `M${x + inset} ${y + h - inset} V${y + r} A${r - inset} ${r - inset} 0 0 1 ${x + w - inset} ${y + r} V${y + h - inset} Z`;
    out += path(di, glass, glassExtra);
    if (bars) {
        out += line(x + r, y + inset, x + r, y + h - inset, frame, 2.5);
        for (let i = 1; i <= 3; i++) out += line(x + inset, y + r + (h - r) * i / 4, x + w - inset, y + r + (h - r) * i / 4, frame, 2);
    }
    return out;
}

/** Wall gas lamp on a bracket, with a flickering glow. */
export function gaslamp(k, x, y, s = 1, { color = "#ffcf7a", bracket = "#0d0a07", glowR = 70 } = {}) {
    return `<g>
        ${k.glow(x, y, glowR * s, color, 0.55, "flicker")}
        ${line(x - 16 * s, y + 18 * s, x, y + 8 * s, bracket, 2.5 * s)}
        ${poly([[x - 6 * s, y - 4 * s], [x + 6 * s, y - 4 * s], [x + 4 * s, y + 8 * s], [x - 4 * s, y + 8 * s]], bracket)}
        ${poly([[x - 4.5 * s, y - 2.5 * s], [x + 4.5 * s, y - 2.5 * s], [x + 3 * s, y + 6.5 * s], [x - 3 * s, y + 6.5 * s]], color, 'class="flicker alt" opacity="0.95"')}
        ${poly([[x - 7 * s, y - 4 * s], [x + 7 * s, y - 4 * s], [x, y - 10 * s]], bracket)}
    </g>`;
}

/** A candle with flame and glow. */
export function candle(k, x, y, s = 1, { wax = "#d9ccb0", color = "#ffcf7a" } = {}) {
    return `<g>
        ${k.glow(x, y - 16 * s, 60 * s, color, 0.55, "flicker")}
        ${rect(x - 3 * s, y - 12 * s, 6 * s, 12 * s, wax)}
        ${path(`M${x} ${y - 22 * s} C${x + 3 * s} ${y - 17 * s} ${x + 2.5 * s} ${y - 13 * s} ${x} ${y - 12.5 * s} C${x - 2.5 * s} ${y - 13 * s} ${x - 3 * s} ${y - 17 * s} ${x} ${y - 22 * s} Z`, color, 'class="flicker"')}
    </g>`;
}

/** Bookcase with procedurally varied spines. */
export function bookshelf(rand, x, y, w, h, { shelves = 5, frame = "#0b0806", colors = ["#3b2a20", "#2a3328", "#41241f", "#2c2a3d", "#4a3a22"], light = 1 } = {}) {
    let out = rect(x, y, w, h, frame);
    const shelfH = (h - 8) / shelves;
    for (let s = 0; s < shelves; s++) {
        const sy = y + 4 + s * shelfH;
        let bx = x + 5;
        while (bx < x + w - 8) {
            const bw = 4 + rand() * 7;
            const bh = shelfH * (0.62 + rand() * 0.3);
            if (bx + bw > x + w - 5) break;
            if (rand() < 0.06) { bx += bw; continue; } // gap
            const c = colors[Math.floor(rand() * colors.length)];
            const lean = rand() < 0.05;
            out += rect(bx, sy + shelfH - 3 - bh, bw, bh, c,
                `opacity="${r1(0.55 + rand() * 0.45 * light)}"${lean ? ` transform="rotate(8 ${r1(bx)} ${r1(sy + shelfH - 3)})"` : ""}`);
            bx += bw + 0.6;
        }
        out += rect(x, sy + shelfH - 3, w, 3, frame);
    }
    return out;
}

/** Classical column. */
export function column(x, y, w, h, fill, flute = "rgba(0,0,0,0.25)") {
    return rect(x - 4, y, w + 8, 8, fill) + rect(x - 2, y + 8, w + 4, 5, fill)
        + rect(x, y + 13, w, h - 26, fill)
        + [0.25, 0.5, 0.75].map(t => line(x + w * t, y + 16, x + w * t, y + h - 16, flute, 1.5)).join("")
        + rect(x - 4, y + h - 13, w + 8, 13, fill);
}

/** Seamless sine band for the .wave animation (period 160px). */
export function waveBand(y, amp, fill, extra = "") {
    let d = `M-200 ${y}`;
    for (let x = -200; x <= 1040; x += 40) {
        const cy = x % 80 === 0 ? y - amp : y + amp;
        d += ` Q${x + 20} ${cy} ${x + 40} ${y}`;
    }
    d += ` V320 H-200 Z`;
    return path(d, fill, extra);
}

/** London rooftops with chimneys. */
export function rooftops(rand, y, x0, x1, fill, { minH = 20, maxH = 70 } = {}) {
    let d = `M${x0} 320 V${y}`;
    let x = x0;
    while (x < x1) {
        const w = 30 + rand() * 60;
        const top = y - minH - rand() * (maxH - minH);
        const roof = rand();
        if (roof < 0.4) {
            d += ` V${r1(top)} L${r1(x + w / 2)} ${r1(top - 16)} L${r1(x + w)} ${r1(top)}`;
        } else {
            d += ` V${r1(top)} H${r1(x + w * 0.2)} V${r1(top - 14)} H${r1(x + w * 0.3)} V${r1(top)} H${r1(x + w)}`;
        }
        x += w;
    }
    d += ` V320 Z`;
    return path(d, fill);
}

/** Small standing figure in silhouette. hat: top | bonnet | helmet | none */
export function figure(x, yFeet, h, fill, hat = "none", extra = "") {
    const s = h / 100;
    const P = (px, py) => `${r1(x + px * s)} ${r1(yFeet - (100 - py) * s)}`;
    let d = `M${P(-12, 100)} L${P(-14, 40)} Q${P(-14, 28)} ${P(-4, 26)} L${P(-4, 20)} `
        + `Q${P(-9, 18)} ${P(-8, 10)} Q${P(-7, 2)} ${P(0, 2)} Q${P(7, 2)} ${P(8, 10)} Q${P(9, 18)} ${P(4, 20)} `
        + `L${P(4, 26)} Q${P(14, 28)} ${P(14, 40)} L${P(12, 100)} Z`;
    let out = path(d, fill, extra);
    if (hat === "top") out += rect(x - 6 * s, yFeet - 104 * s, 12 * s, 9 * s, fill) + rect(x - 10 * s, yFeet - 96 * s, 20 * s, 2 * s, fill);
    if (hat === "bonnet") out += path(`M${P(-10, 14)} Q${P(-10, -4)} ${P(2, -2)} Q${P(12, 0)} ${P(12, 10)} L${P(6, 8)} Q${P(0, 2)} ${P(-6, 10)} Z`, fill);
    if (hat === "helmet") out += path(`M${P(-9, 6)} Q${P(-8, -14)} ${P(0, -16)} Q${P(8, -14)} ${P(9, 6)} Z`, fill) + circle(x, yFeet - 115 * s, 2.5 * s, fill);
    return out;
}

/** Scattered glyphs (for Dreamspace and the Alphabet Vault). */
export function glyphs(rand, n, { x0 = 0, x1 = 800, y0 = 20, y1 = 220, chars = "ABCDEFGHIJKLMNOPQRSTUVXYZ&?", colors = ["#b9a6ff"], sMin = 12, sMax = 30, cls = "bob" } = {}) {
    let out = "";
    for (let i = 0; i < n; i++) {
        const ch = chars[Math.floor(rand() * chars.length)];
        const x = lerp(x0, x1, rand());
        const y = lerp(y0, y1, rand());
        const rot = r1((rand() - 0.5) * 40);
        out += `<g class="${i % 2 ? cls + " alt" : cls}">${text(x, y, ch, {
            size: r1(lerp(sMin, sMax, rand())),
            fill: colors[i % colors.length],
            extra: `opacity="${r1(0.35 + rand() * 0.5)}" transform="rotate(${rot} ${r1(x)} ${r1(y)})"`
        })}</g>`;
    }
    return out;
}
