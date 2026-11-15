// The scenery: one builder per set. Each returns an SVG string of layered
// flats. Palettes follow the realms - institution (brass & ink), neutral
// (teal & lamplight), dream (violet & cyan).
import {
    makeKit, layer, rng, rect, poly, path, line, circle, text, stars, archWindow, gaslamp,
    candle, bookshelf, column, waveBand, rooftops, figure, glyphs, lerp, r1
} from "./kit.js";
import { HEAD } from "./portraits.js";

const FELL = "Geist Variable, Inter Variable, sans-serif";
const HAND = "Georgia, serif";

// ---------------------------------------------------------------- Institution

function lecture_hall() {
    const k = makeKit("lh");
    const rand = rng(11);
    const beam = k.lin([[0, "#c8d6ff", 0.22], [1, "#c8d6ff", 0]]);
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#3b2c1b"], [1, "#130e08"]]));
    for (const x of [30, 128, 610, 708]) {
        back += archWindow(x, 26, 62, 150, { glass: "#27344d", frame: "#100b07" });
        back += poly([[x + 4, 176], [x + 58, 176], [x + 120, 300], [x - 50, 300]], beam, 'class="shimmer"');
    }
    back += rect(-40, 186, 880, 120, "#1c140c") + line(-40, 186, 840, 186, "#3d2c18", 2);

    // Chalkboard with the approved syllabus.
    const cx = 330, cy = 100, s = 24;
    let mid = rect(250, 40, 300, 136, "#4a3420") + rect(258, 48, 284, 120, "#1d2822");
    mid += path(`M${cx} ${cy - s} L${cx + s} ${cy - s / 2} L${cx} ${cy} L${cx - s} ${cy - s / 2} Z M${cx - s} ${cy - s / 2} V${cy + s / 2} L${cx} ${cy + s} L${cx + s} ${cy + s / 2} V${cy - s / 2} M${cx} ${cy} V${cy + s}`,
        "none", 'stroke="#e9e5d6" stroke-width="1.6" opacity="0.75"');
    mid += circle(410, 100, 22, "none", 'stroke="#e9e5d6" stroke-width="1.5" opacity="0.7"')
        + `<ellipse cx="410" cy="100" rx="22" ry="7" fill="none" stroke="#e9e5d6" stroke-width="1" opacity="0.5"/>`;
    mid += text(272, 66, "Approved Forms:", { size: 11, fill: "#e9e5d6", family: HAND, extra: 'opacity="0.7"' })
        + text(272, 158, "I. Cube   II. Sphere", { size: 10, fill: "#e9e5d6", family: HAND, extra: 'opacity="0.6"' })
        + text(462, 112, "✗", { size: 26, fill: "#e9e5d6", extra: 'opacity="0.45"' })
        + path("M470 136 C480 126 500 126 512 136 L500 142 L482 142 Z", "none", 'stroke="#e9e5d6" stroke-width="1.2" opacity="0.4"');
    mid += gaslamp(k, 222, 92, 1.1) + gaslamp(k, 578, 92, 1.1);
    mid += poly([[380, 196], [420, 196], [428, 250], [372, 250]], "#120c07");

    let front = "";
    for (let row = 0; row < 3; row++) {
        const y = 222 + row * 30;
        const c = ["#140e08", "#0d0905", "#060403"][row];
        let heads = "";
        for (let x = -30 + rand() * 20; x < 840; x += 34 + rand() * 12) {
            heads += circle(x, y - 10 - rand() * 4, 9 + rand() * 2, c);
            heads += path(`M${r1(x - 16)} ${y + 4} Q${r1(x)} ${r1(y - 8)} ${r1(x + 16)} ${y + 4} Z`, c);
        }
        front += heads + rect(-40, y, 880, 40, c);
    }

    return k.svg(layer(0.1, back) + layer(0.3, mid) + layer(0.7, front));
}

function practice_rooms() {
    const k = makeKit("pr");
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#2e2416"], [1, "#120d08"]]));
    for (let x = -40; x < 840; x += 80) back += rect(x + 6, 20, 68, 150, "none", 'stroke="#3d2f1c" stroke-width="2"');
    back += circle(400, 52, 22, "#e9dcc0", 'opacity="0.85"') + circle(400, 52, 22, "none", 'stroke="#4a3420" stroke-width="4"')
        + line(400, 52, 400, 38, "#1a120a", 2) + line(400, 52, 410, 56, "#1a120a", 2);
    back += rect(560, 40, 150, 70, "#e6d6b2", 'opacity="0.9"') + rect(566, 46, 138, 58, "none", 'stroke="#7a5a2a" stroke-width="1"')
        + text(578, 70, "APPROVED FORMS ONLY", { size: 10.5, fill: "#3a2510" })
        + text(588, 92, "By Order of the Board", { size: 9, fill: "#5a3e1e", family: HAND });

    let mid = "";
    const shapes = [[160, 120, "cube"], [290, 90, "sphere"], [520, 130, "cube"], [660, 100, "sphere"], [400, 150, "cube"]];
    shapes.forEach(([x, y, kind], i) => {
        const g = k.glow(x, y, 46, "#e7c46a", 0.35);
        const s = 20;
        const shape = kind === "cube"
            ? path(`M${x} ${y - s} L${x + s} ${y - s / 2} L${x} ${y} L${x - s} ${y - s / 2} Z M${x - s} ${y - s / 2} V${y + s / 2} L${x} ${y + s} L${x + s} ${y + s / 2} V${y - s / 2} M${x} ${y} V${y + s}`, "rgba(201,162,39,0.12)", 'stroke="#e7c46a" stroke-width="1.6"')
            : circle(x, y, s, "rgba(201,162,39,0.12)", 'stroke="#e7c46a" stroke-width="1.6"') + `<ellipse cx="${x}" cy="${y}" rx="${s}" ry="6" fill="none" stroke="#e7c46a" stroke-width="1" opacity="0.6"/>`;
        mid += `<g class="bob${i % 2 ? " alt" : ""}">${g}${shape}</g>`;
    });

    let front = poly([[-40, 200], [840, 200], [840, 320], [-40, 320]], "#0e0a06");
    for (let i = -8; i <= 8; i++) front += line(400 + i * 30, 200, 400 + i * 140, 320, "#3a2c18", 1, 'opacity="0.7"');
    for (const y of [212, 230, 255, 290]) front += line(-40, y, 840, y, "#3a2c18", 1, 'opacity="0.6"');
    front += rect(80, 230, 150, 14, "#070503") + rect(92, 244, 8, 60, "#070503") + rect(210, 244, 8, 60, "#070503");

    return k.svg(layer(0.1, back) + layer(0.35, mid) + layer(0.7, front));
}

function worthington_office() {
    const k = makeKit("wo");
    const rand = rng(23);
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#33261a"], [1, "#140e09"]]));
    back += bookshelf(rand, -30, 10, 230, 230, { shelves: 6 });
    // Rainy window.
    back += archWindow(560, 30, 120, 160, { glass: "#1b2638", frame: "#0f0a06" });
    for (let i = 0; i < 26; i++) {
        const x = 566 + rand() * 108, y = 50 + rand() * 130;
        back += line(x, y, x - 3, y + 10, "#8fa6c8", 1, 'opacity="0.35"');
    }
    back += `<ellipse cx="400" cy="70" rx="34" ry="44" fill="#4a3420"/><ellipse cx="400" cy="70" rx="27" ry="37" fill="#1e1610"/>`
        + path(`M386 104 C384 82 392 60 404 56 C418 60 420 84 414 104 Z`, "#0c0806") + circle(402, 62, 10, "#0c0806");

    let mid = k.glow(300, 168, 120, "#9fd38a", 0.32, "flicker");
    mid += rect(170, 182, 330, 18, "#100a06") + rect(180, 200, 310, 100, "#0c0805");
    mid += poly([[290, 150], [312, 150], [318, 166], [284, 166]], "#2d5a35") + rect(298, 166, 6, 16, "#0c0805");
    mid += rect(360, 172, 60, 10, "#d9ccb0", 'opacity="0.8" transform="rotate(-6 390 177)"')
        + rect(380, 168, 50, 10, "#e6dcc4", 'opacity="0.7" transform="rotate(4 405 173)"');
    mid += circle(460, 172, 9, "#0c0805") + line(460, 163, 474, 150, "#d9ccb0", 1.5);
    mid += circle(230, 158, 22, "#1a2a24") + `<ellipse cx="230" cy="158" rx="22" ry="7" fill="none" stroke="#c9a227" stroke-width="1" opacity="0.6"/>`
        + line(230, 136, 230, 182, "#c9a227", 1.5, 'opacity="0.7"') + rect(222, 180, 16, 4, "#0c0805");
    mid += path("M560 300 V210 Q560 180 600 180 H660 Q700 180 700 210 V300 Z", "#0b0705");

    let front = rect(-40, -20, 140, 340, "#080504") + rect(14, 40, 70, 120, "#c79a4a", 'opacity="0.35"');
    front += figure(50, 168, 104, "#080504", "bonnet", 'opacity="0.55"');
    front += circle(92, 170, 4, "#c9a227", 'opacity="0.8"');

    return k.svg(layer(0.1, back) + layer(0.35, mid) + layer(0.75, front));
}

function corridor() {
    const k = makeKit("co");
    const VP = { x: 400, y: 138 };
    const far = { x0: 352, x1: 448, y0: 104, y1: 172 };
    let back = rect(-40, -20, 880, 340, "#0d0905");
    back += poly([[-40, -20], [far.x0, far.y0], [far.x0, far.y1], [-40, 320]], k.lin([[0, "#2c2014"], [1, "#16100a"]], 0, 0, 1, 0));
    back += poly([[840, -20], [far.x1, far.y0], [far.x1, far.y1], [840, 320]], k.lin([[0, "#2c2014"], [1, "#16100a"]], 1, 0, 0, 0));
    back += poly([[-40, -20], [840, -20], [far.x1, far.y0], [far.x0, far.y0]], "#140e08");
    back += poly([[-40, 320], [840, 320], [far.x1, far.y1], [far.x0, far.y1]], k.lin([[0, "#1a120b"], [1, "#2e2114"]]));
    back += rect(far.x0, far.y0, far.x1 - far.x0, far.y1 - far.y0, "#3a2a17") + rect(384, 120, 32, 52, "#d9b469", 'opacity="0.55"');
    // Doors along each wall, receding.
    for (const t of [0.2, 0.45, 0.65, 0.8]) {
        for (const side of [-1, 1]) {
            const xNear = side < 0 ? -40 : 840;
            const xFar = side < 0 ? far.x0 : far.x1;
            const xa = lerp(xNear, xFar, t), xb = lerp(xNear, xFar, t + 0.08);
            const topA = lerp(-20, far.y0, t) + lerp(90, 14, t), topB = lerp(-20, far.y0, t + 0.08) + lerp(90, 14, t + 0.08);
            const botA = lerp(320, far.y1, t), botB = lerp(320, far.y1, t + 0.08);
            back += poly([[xa, topA], [xb, topB], [xb, botB], [xa, botA]], "#0b0704");
        }
    }
    let mid = "";
    for (const t of [0.12, 0.38, 0.6, 0.76]) {
        const s = lerp(1.6, 0.45, t);
        mid += gaslamp(k, lerp(-40, far.x0, t) + 14 * s, lerp(60, 120, t), s, { glowR: 60 });
        mid += gaslamp(k, lerp(840, far.x1, t) - 14 * s, lerp(60, 120, t), s, { glowR: 60 });
        mid += k.pool(VP.x, lerp(300, far.y1 + 4, t), lerp(260, 40, t), lerp(26, 4, t), "#ffcf7a", 0.18);
    }
    mid += figure(400, 171, 44, "#0a0705", "bonnet");
    mid += rect(404, 150, 6, 8, "#0a0705");
    return k.svg(layer(0.05, back) + layer(0.25, mid));
}

function ridgewell_exterior(variant = "later") {
    const k = makeKit("rx" + variant);
    const rand = rng(variant === "after" ? 41 : 42);
    const rainy = variant === "after";
    const sky = rainy
        ? k.lin([[0, "#3b4250"], [1, "#1a1d24"]])
        : k.lin([[0, "#2c2346"], [0.55, "#a8664a"], [1, "#e7b26f"]]);
    let back = rect(-40, -20, 880, 340, sky);
    if (!rainy) back += k.glow(620, 210, 160, "#ffd59a", 0.55) + stars(rand, 18, { y1: 90 });
    back += rooftops(rand, 230, -40, 840, rainy ? "#262a33" : "#3b2a3a", { minH: 10, maxH: 50 });

    const b = rainy ? "#121419" : "#160f14";
    let mid = rect(150, 120, 500, 180, b);
    mid += poly([[140, 122], [400, 70], [660, 122]], b);
    mid += rect(370, 30, 60, 100, b) + poly([[364, 32], [400, 0], [436, 32]], b);
    mid += circle(400, 70, 16, rainy ? "#d8d2c0" : "#f2e3bd", 'opacity="0.85"') + line(400, 70, 400, 59, b, 2) + line(400, 70, 408, 74, b, 2);
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 10; c++) {
            const lit = rand() < (rainy ? 0.35 : 0.5);
            mid += rect(172 + c * 47, 140 + r * 44, 18, 26, lit ? "#f2c46b" : "#1e1a1c", lit ? 'opacity="0.85" class="flicker alt"' : "");
        }
    }
    const tree = (x, s) => path(`M${x} 300 V${240 - 20 * s} M${x} 260 Q${x - 60 * s} ${200 - 30 * s} ${x - 20 * s} ${160 - 40 * s} Q${x + 10 * s} ${120 - 40 * s} ${x + 50 * s} ${170 - 30 * s} Q${x + 80 * s} ${220 - 20 * s} ${x} 260`, b, `stroke="${b}" stroke-width="${6 * s}"`);
    mid += tree(70, 1.2) + tree(740, 1.1);

    let front = rect(-40, 280, 880, 40, "#07060a");
    for (let x = -40; x < 840; x += 16) {
        front += rect(x, 222, 3, 60, "#07060a") + poly([[x - 2, 224], [x + 1.5, 214], [x + 5, 224]], "#07060a");
    }
    front += rect(-40, 232, 880, 4, "#07060a") + rect(-40, 262, 880, 4, "#07060a");
    front += rect(350, 200, 6, 82, "#07060a") + rect(444, 200, 6, 82, "#07060a");
    front += gaslamp(k, 300, 186, 1.1, { glowR: 70 }) + rect(298, 196, 4, 90, "#07060a");

    return k.svg(layer(0.05, back) + layer(0.3, mid) + layer(0.75, front));
}

// ---------------------------------------------------------------- Neutral

function library() {
    const k = makeKit("li");
    const rand = rng(7);
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#17302f"], [1, "#081314"]]));
    back += archWindow(355, 18, 90, 150, { glass: "#2d5550", frame: "#091416" });
    back += k.glow(400, 90, 120, "#8fe0cf", 0.25);
    const farColors = ["#1f3d3a", "#244542", "#1b3633", "#2a4a40"];
    back += bookshelf(rand, -40, 30, 380, 170, { shelves: 5, frame: "#0e2022", colors: farColors, light: 0.6 });
    back += bookshelf(rand, 460, 30, 380, 170, { shelves: 5, frame: "#0e2022", colors: farColors, light: 0.6 });
    back += rect(-40, 200, 880, 120, "#0b1a1c");

    let mid = bookshelf(rand, -30, -10, 170, 300, { shelves: 7, frame: "#050c0d" });
    mid += bookshelf(rand, 660, -10, 170, 300, { shelves: 7, frame: "#050c0d" });
    mid += line(170, -10, 236, 300, "#0a0605", 5) + line(196, -10, 262, 300, "#0a0605", 5);
    for (let i = 1; i < 10; i++) {
        const t = i / 10;
        mid += line(lerp(170, 236, t), lerp(-10, 300, t), lerp(196, 262, t), lerp(-10, 300, t), "#0a0605", 3);
    }
    mid += `<g class="sway">${line(520, -20, 520, 58, "#050c0d", 1.5)}${poly([[504, 58], [536, 58], [546, 76], [494, 76]], "#050c0d")}${k.glow(520, 82, 90, "#ffd58a", 0.45, "flicker")}</g>`;

    let front = k.glow(310, 222, 130, "#7cd9a0", 0.28, "flicker");
    front += rect(220, 236, 380, 14, "#040909") + rect(236, 250, 10, 70, "#040909") + rect(574, 250, 10, 70, "#040909");
    front += poly([[294, 214], [326, 214], [334, 228], [286, 228]], "#1f5a3c") + rect(306, 228, 8, 8, "#040909");
    front += rect(420, 226, 80, 10, "#3b2a20") + rect(426, 216, 70, 10, "#41241f") + rect(430, 208, 56, 8, "#2a3328");
    front += path("M520 236 L556 230 L590 236 L556 240 Z", "#d9ccb0", 'opacity="0.75"');

    return k.svg(layer(0.1, back) + layer(0.35, mid) + layer(0.75, front));
}

function grace_hideout() {
    const k = makeKit("gh");
    const rand = rng(31);
    k.def(`<pattern id="gh-brick" width="40" height="20" patternUnits="userSpaceOnUse">
        <rect width="40" height="20" fill="#132726"/>
        <path d="M0 0 H40 M0 10 H40 M20 0 V10 M0 10 V20 M40 10 V20" stroke="#0a1716" stroke-width="2"/></pattern>`);
    let back = rect(-40, -20, 880, 340, "url(#gh-brick)");
    back += rect(-40, -20, 880, 340, k.lin([[0, "#000", 0.1], [1, "#000", 0.6]]));
    back += rect(420, 32, 240, 130, "#2c1d12") + rect(428, 40, 224, 114, "#1b2524");
    back += circle(490, 96, 34, "none", 'stroke="#e6efe9" stroke-width="1.4" opacity="0.7"')
        + circle(520, 96, 34, "none", 'stroke="#e6efe9" stroke-width="1.4" opacity="0.7"')
        + text(455, 150, "R.M. + M.R. = ?", { size: 13, fill: "#e6efe9", family: HAND, extra: 'opacity="0.65"' })
        + path("M570 70 C590 60 610 74 600 92 L612 90", "none", 'stroke="#e6efe9" stroke-width="1.3" opacity="0.6"')
        + text(582, 120, "anchor", { size: 11, fill: "#e6efe9", family: HAND, extra: 'opacity="0.55" transform="rotate(-8 582 120)"' });
    back += rect(40, 70, 200, 6, "#0a1514");
    for (let i = 0; i < 6; i++) {
        const x = 52 + i * 31, h = 18 + rand() * 18;
        back += rect(x, 70 - h, 20, h, ["#2a6a64", "#5a4a2a", "#3fbbff"][i % 3], `opacity="${r1(0.35 + rand() * 0.3)}"`) + rect(x + 4, 70 - h - 4, 12, 4, "#0a1514");
    }

    let mid = k.glow(200, 140, 110, "#3fbbff", 0.4, "pulse");
    mid += line(200, 150, 200, 250, "#7d6a3a", 4) + poly([[176, 250], [224, 250], [212, 238], [188, 238]], "#7d6a3a");
    mid += `<g class="spin"><ellipse cx="200" cy="140" rx="54" ry="16" fill="none" stroke="#c9a227" stroke-width="2.5" opacity="0.9"/></g>`;
    mid += `<ellipse cx="200" cy="140" rx="16" ry="54" fill="none" stroke="#c9a227" stroke-width="2" opacity="0.7"/>`;
    mid += `<ellipse cx="200" cy="140" rx="40" ry="40" fill="none" stroke="#c9a227" stroke-width="1.5" opacity="0.6" transform="rotate(45 200 140)"/>`;
    mid += poly([[200, 124], [210, 140], [200, 156], [190, 140]], "#9ff0ff", 'class="pulse"');
    mid += rect(620, 180, 70, 70, "#0e1c1c") + rect(626, 168, 60, 12, "#2a3328") + rect(632, 156, 50, 12, "#41241f");

    let front = rect(-40, 252, 880, 70, "#050a0a") + rect(-40, 246, 880, 8, "#0b1414");
    front += candle(k, 560, 246, 1.3);
    front += path("M380 246 L430 238 L470 246 L430 250 Z", "#d9ccb0", 'opacity="0.8"') + line(430, 238, 430, 250, "#5a4a2a", 1);
    front += rect(300, 240, 22, 4, "#e6efe9", 'opacity="0.8" transform="rotate(-12 311 242)"');

    return k.svg(layer(0.1, back) + layer(0.4, mid) + layer(0.75, front));
}

function writing_desk() {
    const k = makeKit("wd");
    const rand = rng(53);
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#1d2a2c"], [1, "#0a1112"]]));
    back += rect(440, 20, 220, 180, "#0a0f10");
    back += rect(450, 30, 200, 160, k.lin([[0, "#1a2340"], [1, "#3a3a5a"]]));
    back += stars(rand, 14, { x0: 452, x1: 648, y0: 32, y1: 110, rMax: 1.1 }) + circle(600, 64, 14, "#f2ecd8", 'opacity="0.9"') + circle(594, 60, 13, "#1a2340");
    back += rooftops(rand, 190, 450, 650, "#0b0e18", { minH: 20, maxH: 70 });
    back += line(550, 30, 550, 190, "#0a0f10", 5) + line(450, 110, 650, 110, "#0a0f10", 5);

    let mid = rect(-40, 210, 880, 110, k.lin([[0, "#2b1d14"], [1, "#120c08"]]));
    mid += candle(k, 300, 212, 1.6);
    mid += poly([[360, 224], [520, 216], [532, 270], [372, 278]], "#efe6cf");
    for (let i = 0; i < 6; i++) mid += line(380, 236 + i * 6.5, 504 - (i === 5 ? 50 : 0), 230 + i * 6.5, "#5a4a3a", 1, 'opacity="0.6"');
    mid += circle(500, 262, 9, "#9a1f24") + circle(500, 262, 5, "#c0393f", 'opacity="0.7"');
    mid += path("M560 250 C590 200 640 170 690 150 C650 190 610 220 566 254 Z", "#e6dcc4", 'opacity="0.85"') + line(566, 254, 548, 270, "#3a2a1a", 2);
    mid += rect(600, 236, 30, 26, "#0b0806") + rect(606, 228, 18, 8, "#0b0806");

    return k.svg(layer(0.1, back) + layer(0.5, mid));
}

function between_worlds() {
    const k = makeKit("bw");
    const rand = rng(61);
    let back = rect(-40, -20, 460, 340, k.lin([[0, "#3d3020"], [1, "#a7743f"]]));
    back += rect(400, -20, 440, 340, k.lin([[0, "#130d33"], [1, "#3b2a7a"]]));
    back += rect(300, -20, 200, 340, k.lin([[0, "#3d3020", 0], [0.5, "#5a3a6a", 0.9], [1, "#130d33", 0]], 0, 0, 1, 0));
    back += stars(rand, 36, { x0: 420, x1: 830, y1: 180 });
    const clip = k.id("clip");
    k.def(`<clipPath id="${clip}"><rect x="360" y="-20" width="500" height="340"/></clipPath>`);
    back += `<g clip-path="url(#${clip})">${waveBand(236, 5, "#21185a", 'class="wave slow"')}</g>`;
    back += rooftops(rand, 230, -40, 380, "#1a130c", { minH: 20, maxH: 90 });

    let mid = path("M120 300 V250 Q400 90 680 250 V300 H630 V262 Q400 140 170 262 V300 Z", "#0d0a12");
    for (let i = 1; i < 12; i++) {
        const t = i / 12;
        const x = lerp(170, 630, t);
        const y = 262 - Math.sin(Math.PI * t) * 108;
        mid += line(x, y, x, y - 18, "#0d0a12", 2);
    }
    mid += path("M150 252 Q400 110 650 252", "none", 'stroke="#0d0a12" stroke-width="4"');
    mid += figure(400, 166, 34, "#0d0a12", "none");
    mid += gaslamp(k, 150, 220, 1, { glowR: 60 }) + rect(148, 228, 4, 80, "#0d0a12");

    let front = rect(-40, 286, 420, 40, "#0a0806");
    front += `<g clip-path="url(#${clip})">${waveBand(282, 6, "#120c38", 'class="wave"')}</g>`;
    front += glyphs(rand, 6, { x0: 460, x1: 800, y0: 40, y1: 200, colors: ["#b9a6ff", "#8fe8ff"] });

    return k.svg(layer(0.05, back) + layer(0.35, mid) + layer(0.7, front));
}

// ---------------------------------------------------------------- Dream

function dreamSky(k, rand, top = "#2a2154", bottom = "#08061a") {
    return rect(-40, -20, 880, 340, k.lin([[0, top], [1, bottom]])) + stars(rand, 60);
}

function observatory() {
    const k = makeKit("ob");
    const rand = rng(17);
    let back = dreamSky(k, rand, "#1a1640", "#0a0820");
    back += k.glow(400, 70, 90, "#d8d0ff", 0.4) + circle(400, 70, 26, "#ece8ff") + circle(392, 64, 5, "#c9c0ee") + circle(410, 78, 3, "#c9c0ee");

    let mid = path("M-40 320 V140 Q400 -150 840 140 V320 Z M368 -40 L432 -40 L428 170 L372 170 Z", "#0a0816", 'fill-rule="evenodd"');
    for (const t of [0.15, 0.3, 0.7, 0.85]) {
        const x = lerp(-40, 840, t);
        mid += path(`M${x} 320 Q${lerp(x, 400, 0.6)} 60 ${t < 0.5 ? 372 : 428} 10`, "none", 'stroke="#1a1533" stroke-width="3"');
    }
    mid += rect(-40, 250, 880, 70, "#07060f");

    let front = `<g transform="rotate(-32 470 210)">${rect(330, 196, 240, 26, "#05040c")}${rect(560, 190, 24, 38, "#05040c")}</g>`;
    front += line(470, 214, 430, 300, "#05040c", 6) + line(470, 214, 520, 300, "#05040c", 6) + line(470, 214, 470, 300, "#05040c", 5);
    const sh = (x, y, d, cls) => `<g class="${cls}">${k.glow(x, y, 50, "#8a6dff", 0.35)}${d}</g>`;
    front += sh(170, 150, path("M170 130 L190 140 L170 150 L150 140 Z M150 140 V160 L170 170 L190 160 V140 M170 150 V170", "rgba(138,109,255,0.15)", 'stroke="#b9a6ff" stroke-width="1.5"'), "bob");
    front += sh(260, 110, circle(260, 110, 18, "rgba(63,214,255,0.12)", 'stroke="#8fe8ff" stroke-width="1.5"'), "bob alt");
    front += sh(660, 120, path("M630 128 C650 112 682 112 696 128 L684 134 L642 134 Z", "rgba(138,109,255,0.18)", 'stroke="#d6cbff" stroke-width="1.6"'), "bob");

    return k.svg(layer(0.05, back) + layer(0.3, mid) + layer(0.7, front));
}

function dreamspace() {
    const k = makeKit("ds");
    const rand = rng(5);
    let back = dreamSky(k, rand);
    back += path("M-40 90 C120 40 280 130 420 80 C560 30 700 110 840 60 L840 110 C700 160 560 80 420 130 C280 180 120 90 -40 140 Z", k.lin([[0, "#3fd6ff", 0.16], [1, "#8a6dff", 0.04]]), 'class="shimmer"');
    back += circle(640, 70, 34, "#ece8ff", 'opacity="0.9"') + circle(626, 62, 32, "#1d1748");

    const island = (x, y, w, cls) => `<g class="${cls}">${path(`M${x - w} ${y} Q${x} ${y - 12} ${x + w} ${y} L${x + w * 0.5} ${y + 24} L${x + w * 0.1} ${y + 46} L${x - w * 0.4} ${y + 22} Z`, "#120c30")}
        ${rect(x - w * 0.5, y - 14, w * 0.25, 12, "#efe6cf", 'opacity="0.55"')}${rect(x - w * 0.2, y - 18, w * 0.2, 16, "#d9ccb0", 'opacity="0.45"')}
        ${line(x + w * 0.3, y - 4, x + w * 0.3, y - 34, "#120c30", 2)}${circle(x + w * 0.3, y - 38, 9, "#120c30")}</g>`;
    let mid = island(170, 140, 60, "bob") + island(520, 170, 44, "bob alt") + island(720, 120, 36, "bob");
    mid += glyphs(rand, 14, { y1: 200, colors: ["#b9a6ff", "#8fe8ff", "#ff8fcf"] });

    let front = waveBand(230, 7, "#1d1550", 'class="wave slow" opacity="0.9"')
        + waveBand(250, 8, "#140e3c", 'class="wave rev"')
        + waveBand(272, 9, "#0b0726", 'class="wave"');
    front += k.pool(640, 240, 140, 10, "#d8d0ff", 0.25, "shimmer");

    return k.svg(layer(0.05, back) + layer(0.35, mid) + layer(0.75, front));
}

function dream_inner() {
    const k = makeKit("di");
    const rand = rng(9);
    let back = rect(-40, -20, 880, 340, k.rad([[0, "#6a4a7a"], [0.5, "#2a1a48"], [1, "#0a0618"]], 0.5, 0.45, 0.7));
    for (let i = 0; i < 6; i++) {
        const s = 1 - i * 0.15;
        const w = 380 * s, h = 300 * s, x = 400 - w / 2, y = 290 - h;
        back += path(`M${r1(x)} 300 V${r1(y + w / 2)} A${r1(w / 2)} ${r1(w / 2)} 0 0 1 ${r1(x + w)} ${r1(y + w / 2)} V300`, "none",
            `stroke="${i % 2 ? "#c9a227" : "#9b82ff"}" stroke-width="${r1(2.5 * s)}" opacity="${r1(0.25 + i * 0.1)}"`);
    }
    back += k.glow(400, 160, 140, "#ffd9a0", 0.55, "pulse");

    const headL = `<g transform="translate(300 60) scale(0.9)"><path d="${HEAD}" fill="#ffe6c0" opacity="0.18"/></g>`;
    const headR = `<g transform="translate(500 60) scale(-0.9 0.9)"><path d="${HEAD}" fill="#c9b8ff" opacity="0.18"/></g>`;
    let mid = `<g class="bob">${headL}${headR}</g>`;
    mid += glyphs(rand, 8, { y0: 40, y1: 260, chars: "·✦✧", colors: ["#ffe6c0", "#c9b8ff"], sMin: 10, sMax: 18 });

    return k.svg(layer(0.05, back) + layer(0.3, mid));
}

function alphabet_vault() {
    const k = makeKit("av");
    const rand = rng(13);
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#1c1440"], [1, "#07051a"]]));
    for (let x = -40; x < 840; x += 40) for (let y = 0; y < 300; y += 40) back += circle(x + 20, y + 20, 1.6, "#3a2e6b");
    back += circle(400, 140, 128, "#0d0924") + circle(400, 140, 120, "#2b2068") + circle(400, 140, 104, "#1a1245");
    back += k.glow(400, 140, 150, "#bfa8ff", 0.5, "pulse");
    // The door itself swung half open to the right.
    back += `<ellipse cx="560" cy="140" rx="40" ry="122" fill="#2b2068" stroke="#5c4fa8" stroke-width="3"/>`;
    for (let a = 0; a < 12; a++) {
        const t = (a / 12) * Math.PI * 2;
        back += circle(400 + Math.cos(t) * 112, 140 + Math.sin(t) * 112, 5, "#5c4fa8");
    }

    let mid = "";
    for (const [x0, x1] of [[-30, 230], [570, 830]]) {
        for (let row = 0; row < 4; row++) {
            const y = 60 + row * 52;
            mid += rect(x0, y + 6, x1 - x0, 5, "#0a0720");
            for (let x = x0 + 10; x < x1 - 10; x += 26) {
                mid += text(x, y, "ABCDEFGHIJKLMNOPQRSTUVXYZ"[Math.floor(rand() * 25)], { size: 22, fill: "#9b82ff", extra: `opacity="${r1(0.35 + rand() * 0.4)}"` });
            }
        }
    }
    mid += rect(372, 214, 56, 60, "#0d0924") + rect(364, 208, 72, 8, "#2b2068");
    mid += `<g class="pulse">${k.glow(400, 172, 60, "#3fd6ff", 0.6)}</g>`;
    mid += text(372, 196, "W", { size: 50, fill: "#e8faff" }) + text(375, 198, "W", { size: 50, fill: "#3fd6ff", extra: 'opacity="0.5"' });

    const beam = k.lin([[0, "#fff6d0", 0.35], [1, "#fff6d0", 0]], 0, 0, 1, 1);
    let front = `<g class="sway">${poly([[120, 150], [130, 150], [420, 300], [250, 300]], beam)}</g>`;
    front += `<g class="sway" style="animation-delay:-3s">${poly([[680, 150], [690, 150], [560, 300], [380, 300]], beam)}</g>`;
    front += figure(120, 300, 150, "#05030f", "helmet") + figure(690, 300, 150, "#05030f", "helmet");
    front += rect(-40, 290, 880, 30, "#05030f");

    return k.svg(layer(0.05, back) + layer(0.35, mid) + layer(0.8, front));
}

function old_bank() {
    const k = makeKit("ob2");
    const rand = rng(29);
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#1f1838"], [1, "#0b0918"]]));
    back += poly([[300, -20], [500, -20], [480, 18], [440, 6], [400, 24], [350, 8], [320, 20]], "#cfd6ff", 'opacity="0.35"');
    const beam = k.lin([[0, "#cfd6ff", 0.3], [1, "#cfd6ff", 0]]);
    back += poly([[320, 10], [480, 10], [600, 300], [220, 300]], beam, 'class="shimmer"');
    for (const x of [40, 170, 590, 720]) back += column(x, 10, 46, 260, "#2a2346", "rgba(0,0,0,0.3)");
    back += rect(-40, 270, 880, 50, "#120e22");

    let mid = rect(80, 180, 640, 20, "#1a1430") + rect(80, 200, 640, 100, "#100c20");
    for (let i = 0; i < 6; i++) {
        const x = 110 + i * 100;
        mid += path(`M${x} 180 V120 Q${x + 35} 96 ${x + 70} 120 V180`, "none", 'stroke="#8a7a3a" stroke-width="2" opacity="0.8"');
        for (let b = 1; b < 6; b++) mid += line(x + b * 11.6, 110, x + b * 11.6, 180, "#8a7a3a", 1.2, 'opacity="0.6"');
    }
    mid += rect(200, 166, 50, 14, "#3a2a20") + rect(206, 154, 40, 12, "#41241f") + rect(560, 168, 60, 12, "#2c2a3d");

    let front = "";
    for (let i = 0; i < 14; i++) {
        const x = rand() * 800, y = 270 + rand() * 30;
        front += rect(x, y, 16, 11, "#d9ccb0", `opacity="${r1(0.25 + rand() * 0.4)}" transform="rotate(${r1(rand() * 60 - 30)} ${r1(x)} ${r1(y)})"`);
    }
    front += path("M-40 -20 L90 -20 Q40 20 -40 90 Z", "none", 'stroke="#cfd6ff" stroke-width="0.6" opacity="0.4"')
        + path("M-40 20 Q20 0 60 -20 M-40 50 Q30 20 80 -20", "none", 'stroke="#cfd6ff" stroke-width="0.6" opacity="0.35"');
    front += path("M640 300 L660 250 L700 250 L690 300 Z M650 250 L640 210 L690 205 L700 250", "#06040e");

    return k.svg(layer(0.05, back) + layer(0.35, mid) + layer(0.8, front));
}

function ritual_chamber() {
    const k = makeKit("rc");
    const rand = rng(19);
    let back = rect(-40, -20, 880, 340, k.rad([[0, "#2a1a50"], [1, "#05030c"]], 0.5, 0.6, 0.7));
    for (const x of [-20, 120, 600, 740]) back += path(`M${x} 260 V90 Q${x + 40} 50 ${x + 80} 90 V260`, "#0d0820");
    const col = k.lin([[0, "#d6cbff", 0], [0.4, "#b9a6ff", 0.45], [1, "#8fe8ff", 0.6]]);
    back += `<g class="pulse">${rect(360, -20, 80, 270, col)}</g>`;

    let mid = "";
    for (const [rx, ry, op] of [[280, 48, 0.8], [220, 38, 0.6], [150, 26, 0.7], [70, 12, 0.9]]) {
        mid += `<ellipse cx="400" cy="250" rx="${rx}" ry="${ry}" fill="none" stroke="#b9a6ff" stroke-width="1.6" opacity="${op}"/>`;
    }
    mid += path("M400 212 L590 268 L210 268 Z", "none", 'stroke="#c9a227" stroke-width="1.2" opacity="0.6"');
    const runes = "ᚱᛗᛟᛚᛚᛖᚱᛟᚷᛖᚱ";
    for (let i = 0; i < 14; i++) {
        const t = (i / 14) * Math.PI * 2;
        mid += text(400 + Math.cos(t) * 250 - 6, 254 + Math.sin(t) * 43, runes[i % runes.length], { size: 14, fill: "#d6cbff", family: "serif", extra: 'opacity="0.75" class="twinkle"' });
    }
    mid += k.pool(400, 250, 200, 30, "#8a6dff", 0.35, "pulse");

    let front = "";
    for (let i = 0; i < 7; i++) {
        const t = Math.PI * (0.1 + (i / 6) * 0.8);
        front += candle(k, 400 - Math.cos(t) * 330, 300 - Math.sin(t) * 16, 1.3 + rand() * 0.3, { wax: "#cfc4e8" });
    }
    front += rect(-40, 296, 880, 30, "#05030c");

    return k.svg(layer(0.05, back) + layer(0.4, mid) + layer(0.8, front));
}

function conceptual_seas() {
    const k = makeKit("cs");
    const rand = rng(3);
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#1a1240"], [0.6, "#6a3a7a"], [1, "#f0a36a"]]));
    back += stars(rand, 40, { y1: 120 }) + k.glow(560, 230, 200, "#ffd59a", 0.6) + circle(560, 230, 34, "#ffe6b8", 'opacity="0.9"');
    back += waveBand(232, 4, "#3a2668", 'class="wave slow"');

    let mid = `<g class="rock">
        ${path("M220 236 L470 236 L440 268 L250 268 Z", "#0b0716")}
        ${line(300, 236, 300, 90, "#0b0716", 4)}${line(390, 236, 390, 110, "#0b0716", 4)}
        ${path("M304 96 Q350 130 304 170 Z", "#efe6cf", 'opacity="0.9"')}${path("M304 176 Q360 200 304 226 Z", "#efe6cf", 'opacity="0.85"')}
        ${path("M394 116 Q436 150 394 186 Z", "#efe6cf", 'opacity="0.85"')}
        ${path("M300 90 L330 96 L300 104 Z", "#0b0716")}${circle(312, 97, 2.5, "#efe6cf")}
        ${line(220, 236, 180, 206, "#0b0716", 3)}${line(180, 206, 300, 92, "#0b0716", 1)}
    </g>`;
    mid += glyphs(rand, 10, { y0: 250, y1: 290, colors: ["#ffe6b8", "#b9a6ff"], sMin: 10, sMax: 18 });

    let front = waveBand(262, 7, "#24164e", 'class="wave rev"') + waveBand(284, 8, "#120a30", 'class="wave"');
    front += k.pool(560, 270, 160, 8, "#ffd59a", 0.35, "shimmer");

    return k.svg(layer(0.05, back) + layer(0.4, mid) + layer(0.8, front));
}


// ---------------------------------------------------------------- Phase 3 sets

function hearing_room() {
    const k = makeKit("hr");
    const rand = rng(71);
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#2c2117"], [1, "#100c08"]]));
    for (const x of [-10, 110, 600, 720]) back += archWindow(x, 20, 70, 160, { glass: "#2a3348", frame: "#0f0a06" });
    // The Board's banner: an eye over an open ledger.
    back += path("M330 0 H470 V150 L400 128 L330 150 Z", "#3a1420") + path("M330 0 H470 V150 L400 128 L330 150 Z", "none", 'stroke="#c9a227" stroke-width="2"');
    back += path("M362 64 Q400 36 438 64 Q400 92 362 64 Z", "none", 'stroke="#c9a227" stroke-width="2"') + circle(400, 64, 9, "#c9a227");
    back += path("M368 100 L400 108 L432 100 L432 118 L400 126 L368 118 Z", "none", 'stroke="#c9a227" stroke-width="1.5"');
    back += gaslamp(k, 240, 80, 1.1) + gaslamp(k, 560, 80, 1.1);

    // The long table, and the Board seated behind it.
    let mid = "";
    for (let i = 0; i < 9; i++) {
        const x = 150 + i * 62;
        const tall = i === 4;
        if (tall) mid += path(`M${x - 26} 196 V${120} Q${x} 100 ${x + 26} 120 V196 Z`, "#2a0c14");
        mid += circle(x, tall ? 146 : 156, tall ? 13 : 11, "#0b0806") + path(`M${x - 22} 196 Q${x} ${tall ? 150 : 162} ${x + 22} 196 Z`, "#0b0806");
    }
    mid += rect(110, 192, 580, 16, "#1c3a26") + rect(110, 208, 580, 70, "#173020");
    for (const x of [200, 330, 470, 600]) mid += path(`M${x} 192 V178 Q${x + 6} 170 ${x + 12} 178 V192 Z`, "#b9c6d6", 'opacity="0.55"');

    let front = "";
    for (let row = 0; row < 2; row++) {
        const y = 256 + row * 30;
        let heads = "";
        for (let x = -30 + rand() * 20; x < 840; x += 36 + rand() * 12) heads += circle(x, y - 12, 10 + rand() * 2, row ? "#060403" : "#0c0805");
        front += heads + rect(-40, y, 880, 40, row ? "#060403" : "#0c0805");
    }
    return k.svg(layer(0.08, back) + layer(0.3, mid) + layer(0.7, front));
}

function quiet_ward() {
    const k = makeKit("qw");
    const VP = { x: 400, y: 140 };
    const far = { x0: 360, x1: 440, y0: 110, y1: 168 };
    k.def(`<pattern id="qw-tile" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#9fb0a8"/><path d="M0 0 H22 M0 0 V22" stroke="#7d8f87" stroke-width="1.5"/></pattern>`);
    let back = rect(-40, -20, 880, 340, "#5f6f68");
    back += poly([[-40, -20], [far.x0, far.y0], [far.x0, far.y1], [-40, 320]], "url(#qw-tile)");
    back += poly([[840, -20], [far.x1, far.y0], [far.x1, far.y1], [840, 320]], "url(#qw-tile)");
    back += poly([[-40, -20], [840, -20], [far.x1, far.y0], [far.x0, far.y0]], "#4a5752");
    back += poly([[-40, 320], [840, 320], [far.x1, far.y1], [far.x0, far.y1]], "#6c7c75");
    back += rect(far.x0, far.y0, far.x1 - far.x0, far.y1 - far.y0, "#2e3834");
    back += rect(-40, -20, 880, 340, k.lin([[0, "#0a100e", 0.55], [0.5, "#0a100e", 0.2], [1, "#0a100e", 0.65]]));

    // Cell doors with barred windows, and still figures behind them.
    let mid = "";
    for (const t of [0.12, 0.36, 0.56, 0.72]) {
        for (const side of [-1, 1]) {
            const xNear = side < 0 ? -40 : 840, xFar = side < 0 ? far.x0 : far.x1;
            const xa = lerp(xNear, xFar, t), xb = lerp(xNear, xFar, t + 0.09);
            const top = (tt) => lerp(-20, far.y0, tt) + lerp(70, 10, tt);
            const bot = (tt) => lerp(320, far.y1, tt);
            mid += poly([[xa, top(t)], [xb, top(t + 0.09)], [xb, bot(t + 0.09)], [xa, bot(t)]], "#2f3a36");
            const wy = lerp(top(t), bot(t), 0.22), wh = (bot(t) - top(t)) * 0.18;
            const wx = lerp(xa, xb, 0.25), ww = (xb - xa) * 0.5;
            mid += rect(Math.min(wx, wx + ww), wy, Math.abs(ww), wh, "#c8d4cc", 'opacity="0.35"');
            for (let b = 1; b < 4; b++) mid += line(wx + ww * b / 4, wy, wx + ww * b / 4, wy + wh, "#1c2421", Math.max(1, 2.5 * (1 - t)));
        }
    }
    mid += k.pool(VP.x, 290, 260, 22, "#e6f0e8", 0.18) + gaslamp(k, 400, 40, 1.2, { color: "#e8f2ea", glowR: 90 });
    mid += figure(400, 166, 34, "#1c2421", "none", 'opacity="0.7"');
    return k.svg(layer(0.05, back) + layer(0.25, mid));
}

function board_archive() {
    const k = makeKit("ba");
    const rand = rng(83);
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#241b10"], [1, "#0c0906"]]));
    const cabinets = (x0, x1, y, h, c, light) => {
        let out = "";
        for (let x = x0; x < x1; x += 34) {
            out += rect(x, y, 32, h, c);
            for (let d = 0; d < Math.floor(h / 22); d++) {
                out += rect(x + 3, y + 3 + d * 22, 26, 18, "none", `stroke="#000" stroke-opacity="0.35" stroke-width="1"`)
                    + rect(x + 12, y + 10 + d * 22, 8, 3, "#c9a227", `opacity="${r1(0.25 + rand() * 0.4 * light)}"`);
            }
        }
        return out;
    };
    back += cabinets(-40, 300, 40, 180, "#3a2c1a", 0.5) + cabinets(500, 840, 40, 180, "#3a2c1a", 0.5);
    back += k.glow(400, 120, 140, "#ffd98a", 0.25);
    let mid = cabinets(-40, 180, -10, 290, "#21180d", 1) + cabinets(620, 840, -10, 290, "#21180d", 1);
    mid += line(190, -10, 250, 300, "#0b0806", 5) + line(214, -10, 274, 300, "#0b0806", 5);
    for (let i = 1; i < 10; i++) { const t = i / 10; mid += line(lerp(190, 250, t), lerp(-10, 300, t), lerp(214, 274, t), lerp(-10, 300, t), "#0b0806", 3); }
    // The waking Ledger under its glass dome.
    let front = k.glow(400, 200, 110, "#ffe6a8", 0.45, "pulse");
    front += rect(350, 232, 100, 70, "#120d08") + rect(340, 226, 120, 8, "#2a1d10");
    front += path("M356 226 V180 Q400 140 444 180 V226 Z", "rgba(220,235,255,0.10)", 'stroke="#d8e2f0" stroke-width="1.5" stroke-opacity="0.6"');
    front += path("M372 214 L400 220 L428 214 L428 200 L400 206 L372 200 Z", "#efe3c4") + line(400, 206, 400, 220, "#8a6a3a", 1);
    return k.svg(layer(0.08, back) + layer(0.35, mid) + layer(0.7, front));
}

function dream_ledger() {
    const k = makeKit("dl");
    const rand = rng(97);
    let back = dreamSky(k, rand, "#1c1440", "#05030f");
    back += k.glow(400, 150, 260, "#b9a6ff", 0.25);
    let mid = "";
    // Drifting pages, each a life.
    for (let i = 0; i < 16; i++) {
        const x = rand() * 800, y = rand() * 260, rot = r1(rand() * 70 - 35);
        mid += `<g class="bob${i % 2 ? " alt" : ""}">${rect(x, y, 26, 34, "#efe6ff", `opacity="${r1(0.25 + rand() * 0.35)}" transform="rotate(${rot} ${r1(x + 13)} ${r1(y + 17)})"`)}</g>`;
    }
    // The Ledger: a vast open book floating in the dark.
    let front = `<g class="bob">
        ${path("M400 120 C340 100 250 104 190 124 L190 262 C250 244 340 242 400 262 Z", "#efe6cf")}
        ${path("M400 120 C460 100 550 104 610 124 L610 262 C550 244 460 242 400 262 Z", "#e6dcc0")}
        ${path("M190 262 C250 244 340 242 400 262 C460 242 550 244 610 262 L610 270 C550 254 460 254 400 274 C340 254 250 254 190 270 Z", "#8a7a5a")}
        ${line(400, 120, 400, 262, "#8a7a5a", 1.5)}`;
    for (let r = 0; r < 9; r++) {
        const y = 140 + r * 12;
        front += line(212, y + 2, 384, y - 1, "#3a2e1a", 1, 'opacity="0.5"') + line(416, y - 1, 590 - (r === 4 ? 70 : 0), y + 2, "#3a2e1a", 1, 'opacity="0.5"');
    }
    front += text(440, 196, "PIRATE", { size: 18, fill: "#2a1d10" }) + line(436, 191, 520, 191, "#9a1f24", 2.5, 'class="shimmer"');
    front += `</g>`;
    front += k.pool(400, 290, 220, 14, "#b9a6ff", 0.35, "pulse");
    return k.svg(layer(0.05, back) + layer(0.35, mid) + layer(0.65, front));
}

function london_street() {
    const k = makeKit("ls");
    const rand = rng(107);
    let back = rect(-40, -20, 880, 340, k.lin([[0, "#3a3240"], [0.6, "#7a5a48"], [1, "#b98a5a"]]));
    back += rooftops(rand, 150, -40, 840, "#2a2230", { minH: 20, maxH: 70 });
    back += rect(-40, 140, 880, 200, k.lin([[0, "#d9c8b0", 0.18], [1, "#d9c8b0", 0]]));

    // Shopfronts with their W's missing.
    const shop = (x, w, sign, c) => rect(x, 120, w, 150, c) + rect(x + 8, 132, w - 16, 26, "#1a120c")
        + text(x + w / 2, 151, sign, { size: 14, fill: "#e8c97a", extra: 'text-anchor="middle"' })
        + rect(x + 12, 172, w - 24, 70, "#f2c46b", 'opacity="0.55" class="flicker alt"') + line(x + w / 2, 172, x + w / 2, 242, c, 3);
    let mid = shop(-20, 190, "HITE HART", "#2a1a14") + shop(180, 170, "ORKSHOP", "#22201c") + shop(360, 200, "BOOTS & ELLINGTONS", "#2a1a24") + shop(570, 150, "INE CELLARS", "#1e2022") + shop(730, 140, "THE TIMES", "#2a1a14");
    mid += rect(-40, 268, 880, 60, "#2a2420");
    for (let x = -40; x < 840; x += 18) for (let y = 274; y < 320; y += 10) mid += rect(x + (y % 20 ? 9 : 0), y, 16, 8, "#332c27", 'opacity="0.8"');

    let front = gaslamp(k, 120, 170, 1.4, { glowR: 90 }) + rect(117, 182, 6, 130, "#0b0806");
    // A newspaper boy, and a carriage bearing the Board's seal.
    front += figure(260, 300, 70, "#0b0806", "none") + rect(268, 252, 20, 14, "#efe6cf", 'transform="rotate(-8 278 259)"');
    front += path("M520 300 V236 Q520 214 548 214 H660 Q690 214 690 240 V300 Z", "#0b0806") + circle(560, 296, 22, "none", 'stroke="#0b0806" stroke-width="6"') + circle(660, 296, 22, "none", 'stroke="#0b0806" stroke-width="6"');
    front += circle(605, 250, 11, "none", 'stroke="#c9a227" stroke-width="2"') + circle(605, 250, 3, "#c9a227");
    return k.svg(layer(0.06, back) + layer(0.35, mid) + layer(0.75, front));
}

// ---------------------------------------------------------------- Registry

export const sets = {
    lecture_hall,
    practice_rooms,
    worthington_office,
    corridor,
    ridgewell_exterior,
    library,
    grace_hideout,
    writing_desk,
    between_worlds,
    observatory,
    dreamspace,
    dream_inner,
    alphabet_vault,
    old_bank,
    ritual_chamber,
    conceptual_seas,
    hearing_room,
    quiet_ward,
    board_archive,
    dream_ledger,
    london_street
};

const cache = new Map();

/** Build (and cache) the SVG for a set, e.g. buildSet("ridgewell_exterior", "after"). */
export function buildSet(name, variant) {
    const key = `${name}:${variant || ""}`;
    if (!cache.has(key)) cache.set(key, sets[name](variant));
    return cache.get(key);
}
