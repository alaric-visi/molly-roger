// Procedural sound: everything is synthesised with the Web Audio API, so
// there are no audio files to load. Off by default; switched on in Settings.
//
//   setEnabled(true|false), setVolume(0..1)
//   setScene(realm, ambience)   - crossfades the background bed
//   sfx(name)                   - choice, quill, curtain, ending, item, scandal, anchor, wrong, setpiece

let ctx = null;
let master = null;
let enabled = false;
let volume = 0.6;
let noise = null;
let bed = null;        // { gain, stop() }
let bedKey = "";
let pending = null;    // scene requested before the context could start

function ensureContext() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    // Two seconds of white noise, looped by every noise source.
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return ctx;
}

function noiseSource() {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;
    return src;
}

function filter(type, freq, q = 0.7) {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
}

function gainNode(value) {
    const g = ctx.createGain();
    g.gain.value = value;
    return g;
}

function lfo(target, rate, depth) {
    const osc = ctx.createOscillator();
    const amt = gainNode(depth);
    osc.frequency.value = rate;
    osc.connect(amt).connect(target);
    osc.start();
    return osc;
}

// ---------------------------------------------------------------- beds

function buildBed(realm, ambience) {
    const out = gainNode(0);
    out.connect(master);
    const nodes = [];
    const timers = [];
    const keep = n => { nodes.push(n); return n; };

    if (realm === "institution") {
        // Room tone, a low gas hum, and a slow clock.
        const n = keep(noiseSource());
        n.connect(filter("lowpass", 280)).connect(gainNode(0.06)).connect(out);
        n.start();
        const hum = keep(ctx.createOscillator());
        hum.frequency.value = 55;
        hum.connect(gainNode(0.018)).connect(out);
        hum.start();
        timers.push(setInterval(() => tick(out, 2600, 0.05), 1000));
    } else if (realm === "dream") {
        // A slow, shimmering chord.
        const chord = [220, 277.2, 329.6, 440];
        const pad = gainNode(0.022);
        pad.connect(filter("lowpass", 1400)).connect(out);
        chord.forEach((f, i) => {
            const o = keep(ctx.createOscillator());
            o.type = i % 2 ? "sine" : "triangle";
            o.frequency.value = f;
            o.detune.value = (i - 1.5) * 6;
            o.connect(pad);
            o.start();
        });
        keep(lfo(pad.gain, 0.07, 0.012));
        timers.push(setInterval(() => { if (Math.random() < 0.5) ping(out, 880 + Math.random() * 1200, 0.025); }, 2600));
    } else {
        // Lamplight: a soft hiss and a warm low note.
        const n = keep(noiseSource());
        n.connect(filter("bandpass", 900, 0.4)).connect(gainNode(0.02)).connect(out);
        n.start();
        const o = keep(ctx.createOscillator());
        o.frequency.value = 110;
        o.connect(gainNode(0.012)).connect(out);
        o.start();
    }

    if (ambience === "rain") {
        const n = keep(noiseSource());
        n.connect(filter("highpass", 1200)).connect(filter("lowpass", 6000)).connect(gainNode(0.07)).connect(out);
        n.start();
    }
    if (ambience === "dream" || ambience === "letters") {
        // The sea, breathing.
        const n = keep(noiseSource());
        const swell = gainNode(0.03);
        n.connect(filter("lowpass", 520)).connect(swell).connect(out);
        n.start();
        keep(lfo(swell.gain, 0.11, 0.025));
    }
    if (ambience === "embers") {
        timers.push(setInterval(() => { if (Math.random() < 0.6) tick(out, 4000 + Math.random() * 3000, 0.03); }, 180));
    }

    return {
        gain: out,
        stop() {
            timers.forEach(clearInterval);
            const t = ctx.currentTime;
            out.gain.cancelScheduledValues(t);
            out.gain.setTargetAtTime(0, t, 0.4);
            setTimeout(() => {
                nodes.forEach(n => { try { n.stop(); } catch { /* already stopped */ } });
                out.disconnect();
            }, 2500);
        }
    };
}

function tick(dest, freq, level) {
    const n = noiseSource();
    const g = gainNode(0);
    n.connect(filter("bandpass", freq, 6)).connect(g).connect(dest);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    n.start(t);
    n.stop(t + 0.06);
}

function ping(dest, freq, level, decay = 1.6, when = 0) {
    const o = ctx.createOscillator();
    const g = gainNode(0);
    o.frequency.value = freq;
    o.connect(g).connect(dest);
    const t = ctx.currentTime + when;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.start(t);
    o.stop(t + decay + 0.05);
}

function sweep(from, to, seconds, level) {
    const o = ctx.createOscillator();
    const g = gainNode(0);
    o.frequency.setValueAtTime(from, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + seconds);
    o.connect(g).connect(master);
    g.gain.linearRampToValueAtTime(level, ctx.currentTime + seconds * 0.3);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + seconds);
    o.start();
    o.stop(ctx.currentTime + seconds + 0.05);
}

// ---------------------------------------------------------------- effects

const EFFECTS = {
    choice() { tick(master, 3200, 0.09); setTimeout(() => tick(master, 2400, 0.05), 45); },
    quill() { for (let i = 0; i < 4; i++) setTimeout(() => tick(master, 3000 + Math.random() * 1500, 0.05), i * 55); },
    curtain() { sweep(90, 45, 1.6, 0.12); },
    ending() { [523.3, 659.3, 784, 1046.5].forEach((f, i) => ping(master, f, 0.07, 2.2, i * 0.18)); },
    item() { ping(master, 880, 0.08, 1.2); ping(master, 1320, 0.04, 1.4, 0.02); },
    scandal() { ping(master, 660, 0.05, 0.4); ping(master, 990, 0.04, 0.5, 0.08); },
    anchor() { ping(master, 392, 0.09, 1.0); },
    wrong() { sweep(140, 70, 0.25, 0.1); },
    setpiece() { ping(master, 587.3, 0.06, 1.4); ping(master, 880, 0.05, 1.6, 0.12); }
};

// ---------------------------------------------------------------- public API

export function setEnabled(on) {
    enabled = on;
    if (on) {
        if (!ensureContext()) return;
        master.gain.setTargetAtTime(volume, ctx.currentTime, 0.2);
        Promise.resolve(ctx.resume?.()).then(() => { if (pending) setScene(...pending); });
    } else if (ctx) {
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
        bed?.stop();
        bed = null;
        bedKey = "";
    }
}

export function setVolume(v) {
    volume = v;
    if (ctx && enabled) master.gain.setTargetAtTime(v, ctx.currentTime, 0.1);
}

export function setScene(realm, ambience) {
    pending = [realm, ambience];
    if (!enabled || !ctx || ctx.state !== "running") return;
    const key = `${realm}:${ambience}`;
    if (key === bedKey) return;
    bedKey = key;
    bed?.stop();
    bed = buildBed(realm, ambience);
    bed.gain.gain.setTargetAtTime(1, ctx.currentTime, 0.8);
}

export function sfx(name) {
    if (!enabled || !ctx || ctx.state !== "running") return;
    EFFECTS[name]?.();
}

/** Browsers only allow audio after a user gesture; call on the first one. */
export function unlock() {
    if (!enabled) return;
    ensureContext();
    ctx.resume?.().then(() => { if (pending) setScene(...pending); });
}
