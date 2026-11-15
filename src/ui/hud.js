import { els, escapeHtml } from "./dom.js";
import { characters, relationshipNames, endingIds, codex, acts, crew, items } from "../story/index.js";
import { portraits } from "../stage/art/portraits.js";
import { evaluate } from "../engine/conditions.js";

export function renderStatus(state) {
    els.playerName.textContent = state.player.name;
    els.galleryCount.textContent = `${state.discoveredEndings.length}/${endingIds.length}`;
    els.codexCount.textContent = state.codex?.length ? `${state.codex.length}/${codex.length}` : "";
    els.psychicLevel.textContent = `Psychic ${state.psychicLevel}`;
    els.path.textContent = state.currentPath;
    els.satchelCount.textContent = state.items.length ? String(state.items.length) : "";
}

function bar(label, value, color, dotColor = color) {
    return `
        <div class="relationship-bar">
            <div class="relationship-label">
                <span class="relationship-dot" style="background:${dotColor}"></span>${escapeHtml(label)}
            </div>
            <div class="relationship-track" role="meter" aria-label="${escapeHtml(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}">
                <div class="relationship-fill" style="width:${value}%;background:${color}"></div>
            </div>
            <span class="relationship-value">${value}</span>
        </div>`;
}

/** Suspicion drawn as tally marks in Vane's ledger: one stroke per 5 points, gated in fives. */
function ledger(suspicion) {
    const strokes = Math.round(suspicion / 5);
    let groups = "";
    for (let i = 0; i < strokes; i += 5) {
        const n = Math.min(5, strokes - i);
        groups += `<span class="tally${n === 5 ? " full" : ""}">${"<i></i>".repeat(Math.min(n, 4))}</span>`;
    }
    const level = suspicion >= 75 ? "Under watch" : suspicion >= 40 ? "Noted" : suspicion > 0 ? "A mark or two" : "Clean";
    return `
        <div class="relationship-bar ledger-row">
            <div class="relationship-label">
                <span class="relationship-dot" style="background:#9AA3AD"></span>Vane's ledger
            </div>
            <div class="ledger" role="meter" aria-label="Suspicion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${suspicion}">
                ${groups || '<span class="ledger-empty">no marks</span>'}
            </div>
            <span class="relationship-value ledger-level${suspicion >= 75 ? " danger" : ""}">${level}</span>
        </div>`;
}

export function renderRelationships(state) {
    const selfColor = state.self < 40 ? "var(--bad)" : state.self < 70 ? "var(--warn)" : "var(--ink-soft)";
    els.relationships.innerHTML = `
        <div class="hud-columns">
            <section>
                <h3>Relationships</h3>
                ${relationshipNames.filter(n => !characters[n].revealWhen || evaluate(characters[n].revealWhen, state)).map(n => bar(characters[n].relationshipLabel, state.relationships[n], characters[n].color)).join("")}
            </section>
            <section>
                <h3>State of mind</h3>
                ${bar("Self", state.self, selfColor)}
                ${ledger(state.suspicion)}
            </section>
        </div>`;
}

// ---------- Progress, crew and what you carry ----------

/** The act's current aim: the first objective whose condition holds. */
export function objectiveFor(act, state) {
    for (const [cond, text] of act?.objectives || []) {
        if (!cond || evaluate(cond, state)) return text;
    }
    return "";
}

/** A character's silhouette cropped to the head, for small avatars. */
function avatar(name) {
    const svg = (portraits[name] || "").replace('viewBox="0 0 200 260"', 'viewBox="30 14 150 150"');
    const c = characters[name];
    return `<span class="avatar" style="--speaker:${c?.color || "var(--accent)"}">${svg}</span>`;
}

export function renderProgress(state, scene) {
    const actNumbers = Object.keys(acts).map(Number).sort((a, b) => a - b);
    const current = scene?.ending ? Infinity : (scene?.act || 1);
    const act = acts[scene?.act];

    els.actTrack.innerHTML = actNumbers.map(n => {
        const status = n < current ? "done" : n === current ? "current" : "todo";
        const a = acts[n];
        return `<li class="act-step ${status}" title="${escapeHtml(`${a.title} · ${a.subtitle}`)}"${status === "current" ? ' aria-current="step"' : ""}>
            <span class="act-bar"></span><span class="act-short">${escapeHtml(a.short || a.title)}</span>
            <span class="sr-only">${escapeHtml(`${a.title}: ${a.subtitle}`)}${status === "done" ? " (done)" : ""}</span>
        </li>`;
    }).join("");

    if (scene?.ending) {
        els.progressAct.textContent = "Ending";
        const found = state.discoveredEndings.length;
        els.objective.innerHTML = `<span class="objective-label">The end</span>${escapeHtml(scene.endingTitle || "")}. You've found ${found} of ${endingIds.length} endings.`;
    } else {
        els.progressAct.textContent = act ? `${act.title} · ${act.subtitle}` : "";
        const aim = objectiveFor(act, state);
        els.objective.innerHTML = aim ? `<span class="objective-label">Current aim</span>${escapeHtml(aim)}` : "";
    }

    // Crew: shown once anyone has signed on, or once the muster begins.
    const signed = Object.entries(crew).filter(([, flag]) => state.flags.includes(flag)).map(([name]) => name);
    const mustering = (scene?.act === 5) || evaluate("visited:crew_muster", state);
    if (signed.length || mustering) {
        els.crewCount.textContent = `${signed.length} of ${Object.keys(crew).length}`;
        els.crewList.innerHTML = signed.length
            ? signed.map(name => `<li class="crew-member" title="${escapeHtml(name)}">${avatar(name)}<span class="crew-name">${escapeHtml(characters[name]?.short || name)}</span></li>`).join("")
            : '<li class="crew-empty">No one yet. Allies you\'ve earned can be asked to join.</li>';
    } else {
        els.crewCount.textContent = "";
        els.crewList.innerHTML = "";
    }

    els.carriedList.innerHTML = state.items.map(id => {
        const item = items[id];
        if (!item) return "";
        return `<li><button type="button" class="carried-chip" data-item="${escapeHtml(id)}" title="${escapeHtml(item.description)}">
            <i class="fas ${escapeHtml(item.icon)}" aria-hidden="true"></i>${escapeHtml(item.name)}</button></li>`;
    }).join("");
}

export function clearRelationships() {
    els.relationships.innerHTML = "";
}

/** Small chips under the text showing what the last choice changed. */
export function renderChanges(changes) {
    const visible = changes.filter(c => c.kind !== "flag");
    const learned = changes.some(c => c.kind === "flag");
    if (!visible.length && !learned) {
        els.changes.innerHTML = "";
        return;
    }
    const chip = c => {
        if (c.kind === "codex") {
            return `<span class="change-chip item"><i class="fas fa-book-open"></i>Codex: ${escapeHtml(c.label)}</span>`;
        }
        if (c.kind === "item") {
            return `<span class="change-chip item"><i class="fas ${c.gained ? "fa-plus" : "fa-minus"}"></i>${escapeHtml(c.label)}</span>`;
        }
        // For Suspicion, "up" is bad news.
        const good = c.kind === "suspicion" ? c.delta < 0 : c.delta > 0;
        const sign = c.delta > 0 ? "+" : "−";
        const dot = c.color ? `<span class="relationship-dot" style="background:${c.color}"></span>` : "";
        return `<span class="change-chip ${good ? "up" : "down"}">${dot}${escapeHtml(c.label)} ${sign}${Math.abs(c.delta)}</span>`;
    };
    els.changes.innerHTML = visible.map(chip).join("")
        + (learned ? '<span class="change-chip note"><i class="fas fa-feather"></i>New note in your satchel</span>' : "");
}

const PERSISTENCE_NOTES = {
    local: "Progress saves to this browser.",
    memory: "Progress won't be saved after you close this tab."
};

export function renderPersistenceNote(mode) {
    els.persistenceNote.textContent = PERSISTENCE_NOTES[mode] || "";
    els.persistenceNote.classList.toggle("warning", mode === "memory");
}

let saveToastTimer = null;
export function showSaveToast(ok) {
    const el = els.saveIndicator;
    el.classList.toggle("warning", !ok);
    el.querySelector("span").textContent = ok ? "Progress Saved" : "Saved for this session only";
    el.classList.add("visible");
    clearTimeout(saveToastTimer);
    saveToastTimer = setTimeout(() => el.classList.remove("visible"), 2200);
}
