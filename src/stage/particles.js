// Ambient particles drawn on a canvas over the scenery.
// Each preset describes how to spawn, move and draw its particles.

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVXYZ&?";

const PRESETS = {
    dust: {
        count: 46,
        spawn: (w, h) => ({ x: rand(0, w), y: rand(0, h), r: rand(0.5, 1.8), vx: rand(-0.06, 0.06), vy: rand(-0.08, 0.03), a: rand(0.15, 0.55), t: rand(0, TAU) }),
        color: p => `rgba(255, 222, 165, ${p.a * (0.6 + 0.4 * Math.sin(p.t))})`
    },
    moondust: {
        count: 50,
        spawn: (w, h) => ({ x: rand(w * 0.3, w * 0.75), y: rand(0, h), r: rand(0.4, 1.5), vx: rand(-0.05, 0.05), vy: rand(0.02, 0.1), a: rand(0.2, 0.6), t: rand(0, TAU) }),
        color: p => `rgba(210, 220, 255, ${p.a * (0.6 + 0.4 * Math.sin(p.t))})`
    },
    dream: {
        count: 56,
        spawn: (w, h, initial) => ({ x: rand(0, w), y: initial ? rand(0, h) : h + 5, r: rand(0.6, 2.2), vx: rand(-0.1, 0.1), vy: rand(-0.35, -0.1), a: rand(0.3, 0.8), t: rand(0, TAU), hue: Math.random() < 0.6 ? 255 : 190 }),
        color: p => `hsla(${p.hue}, 100%, 78%, ${p.a * (0.5 + 0.5 * Math.sin(p.t))})`,
        glow: true
    },
    letters: {
        count: 18,
        spawn: (w, h, initial) => ({ x: rand(0, w), y: initial ? rand(0, h) : h + 20, r: rand(10, 20), vx: rand(-0.1, 0.1), vy: rand(-0.3, -0.12), a: rand(0.25, 0.6), t: rand(0, TAU), rot: rand(-0.5, 0.5), vr: rand(-0.004, 0.004), ch: LETTERS[Math.floor(Math.random() * LETTERS.length)] }),
        draw(ctx, p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.font = `${p.r}px "Geist Variable", sans-serif`;
            ctx.fillStyle = `rgba(190, 170, 255, ${p.a})`;
            ctx.fillText(p.ch, 0, 0);
            ctx.restore();
        }
    },
    embers: {
        count: 60,
        spawn: (w, h, initial) => ({ x: rand(w * 0.15, w * 0.85), y: initial ? rand(0, h) : h + 5, r: rand(0.6, 2), vx: rand(-0.15, 0.15), vy: rand(-0.9, -0.3), a: rand(0.5, 1), t: rand(0, TAU), life: 1 }),
        color: p => `rgba(255, ${Math.round(150 + 80 * p.life)}, 90, ${p.a * p.life})`,
        glow: true,
        age: p => { p.life -= 0.003; return p.life > 0; }
    },
    rain: {
        count: 140,
        spawn: (w, h, initial) => ({ x: rand(-50, w), y: initial ? rand(0, h) : rand(-40, -5), len: rand(8, 16), vx: 1.4, vy: rand(6, 9), a: rand(0.15, 0.35) }),
        draw(ctx, p) {
            ctx.strokeStyle = `rgba(190, 205, 230, ${p.a})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 2, p.y - p.len);
            ctx.stroke();
        }
    },
    stars: {
        count: 30,
        spawn: (w, h) => ({ x: rand(0, w), y: rand(0, h * 0.6), r: rand(0.5, 1.4), vx: 0, vy: 0, a: rand(0.3, 0.9), t: rand(0, TAU) }),
        color: p => `rgba(235, 230, 255, ${p.a * (0.4 + 0.6 * Math.abs(Math.sin(p.t)))})`,
        shooting: true
    },
    none: { count: 0 }
};

export function createParticles(canvas) {
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let preset = PRESETS.none;
    let particles = [];
    let shooter = null;
    let w = 0, h = 0, dpr = 1;
    let raf = null;

    /**
     * Match the drawing buffer to the canvas's on-screen size. Ignore zero
     * sizes (the canvas is hidden or mid-layout): a 0x0 buffer stretched over
     * the stage paints as solid black in Chromium.
     */
    function resize() {
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        if (!cw || !ch) return false;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = cw;
        h = ch;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return true;
    }

    const sizeIsStale = () => canvas.clientWidth !== w || canvas.clientHeight !== h || canvas.width === 0;

    function step() {
        if (sizeIsStale()) {
            const wasEmpty = !w || !h;
            if (resize() && wasEmpty) particles = particles.map(() => preset.spawn(w, h, true));
        }
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.t !== undefined) p.t += 0.02;
            if (p.vr) p.rot += p.vr;
            const alive = preset.age ? preset.age(p) : true;
            if (!alive || p.y < -30 || p.y > h + 30 || p.x < -60 || p.x > w + 60) {
                particles[i] = preset.spawn(w, h, false);
                if (preset === PRESETS.dust || preset === PRESETS.moondust) particles[i].y = rand(0, h);
                continue;
            }
            if (preset.draw) {
                preset.draw(ctx, p);
            } else {
                ctx.fillStyle = preset.color(p);
                if (preset.glow) {
                    ctx.shadowColor = ctx.fillStyle;
                    ctx.shadowBlur = 6;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, TAU);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        // The odd shooting star.
        if (preset.shooting) {
            if (!shooter && Math.random() < 0.004) shooter = { x: rand(w * 0.2, w), y: rand(0, h * 0.3), life: 1 };
            if (shooter) {
                const g = ctx.createLinearGradient(shooter.x, shooter.y, shooter.x + 60, shooter.y - 20);
                g.addColorStop(0, `rgba(255,255,255,${shooter.life})`);
                g.addColorStop(1, "rgba(255,255,255,0)");
                ctx.strokeStyle = g;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(shooter.x, shooter.y);
                ctx.lineTo(shooter.x + 60, shooter.y - 20);
                ctx.stroke();
                shooter.x -= 6;
                shooter.y += 2;
                shooter.life -= 0.025;
                if (shooter.life <= 0) shooter = null;
            }
        }
    }

    function loop() {
        step();
        raf = requestAnimationFrame(loop);
    }

    function stop() {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
    }

    function start() {
        stop();
        if (!preset.count) {
            ctx.clearRect(0, 0, w, h);
            return;
        }
        if (reduced?.matches) {
            step(); // one still frame
            return;
        }
        loop();
    }

    function set(name) {
        const next = PRESETS[name] || PRESETS.none;
        if (next === preset && particles.length) return;
        preset = next;
        resize();
        particles = Array.from({ length: preset.count || 0 }, () => preset.spawn(w, h, true));
        start();
    }

    new ResizeObserver(() => { if (resize() && !raf) start(); }).observe(canvas);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    return { set };
}
