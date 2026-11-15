// Character setup, settings, satchel and the confirm dialog.
import { els, escapeHtml } from "./dom.js";
import { openOverlay, closeOverlay } from "./overlays.js";
import { getSettings, updateSettings, TEXT_SPEEDS, THEMES } from "./settings.js";
import {
    ADDRESS_OPTIONS, PRONOUN_OPTIONS, DEFAULT_PLAYER, NAME_MAX_LENGTH, items, flags, scenes, endingIds,
    codex, CODEX_SECTIONS
} from "../story/index.js";
import { applyTokens, typeset } from "../engine/text.js";
import { endingCard, cardBack } from "../stage/art/endingCards.js";

// ---------- endings gallery ----------

export function openGallery(state) {
    const found = new Set(state.discoveredEndings);
    els.gallerySubtitle.textContent = `${found.size} of ${endingIds.length} discovered`;
    els.galleryGrid.innerHTML = endingIds.map((id, i) => {
        const scene = scenes[id];
        return found.has(id)
            ? `<figure class="gallery-card found">${endingCard(id, i, scene.endingTitle)}
                   <figcaption class="gallery-name">${escapeHtml(scene.endingTitle)}</figcaption></figure>`
            : `<figure class="gallery-card">${cardBack(i)}
                   <figcaption class="gallery-hint">${escapeHtml(scene.hint || "Not yet written.")}</figcaption></figure>`;
    }).join("");
    openOverlay(els.galleryOverlay);
}

// ---------- pill radio groups ----------

function renderPills(container, name, options, selected) {
    container.innerHTML = Object.entries(options).map(([value, label]) => `
        <label class="pill">
            <input type="radio" name="${name}" value="${value}" ${value === selected ? "checked" : ""}>
            <span>${escapeHtml(label)}</span>
        </label>`).join("");
}

const selectedValue = (container, name) => container.querySelector(`input[name="${name}"]:checked`)?.value;

// ---------- confirm dialog ----------

export function confirmDialog(message, okLabel = "OK") {
    return new Promise(resolve => {
        let answer = false;
        els.confirmMessage.textContent = message;
        els.confirmOk.textContent = okLabel;
        els.confirmOk.onclick = () => { answer = true; closeOverlay(els.confirmOverlay); };
        openOverlay(els.confirmOverlay, { onClose: () => resolve(answer) });
        els.confirmCancel.focus();
    });
}

// ---------- character setup ----------

/**
 * Ask for name / address / pronouns.
 * mandatory: no Cancel, can't be dismissed (first game).
 * Resolves with the player object, or null if cancelled.
 */
export function askForPlayer(current = DEFAULT_PLAYER, { mandatory = false, submitLabel = "Sign the register" } = {}) {
    return new Promise(resolve => {
        let result = null;
        const overlay = els.setupOverlay;
        overlay.toggleAttribute("data-locked", mandatory);
        els.setupCancel.hidden = mandatory;
        overlay.querySelector("#setup-submit").textContent = submitLabel;

        els.setupName.maxLength = NAME_MAX_LENGTH;
        els.setupName.value = current.name || "";
        els.setupName.placeholder = DEFAULT_PLAYER.name;
        renderPills(els.setupAddress, "address",
            Object.fromEntries(Object.entries(ADDRESS_OPTIONS).map(([k, v]) => [k, v.label])), current.address);
        renderPills(els.setupPronouns, "pronouns",
            Object.fromEntries(Object.entries(PRONOUN_OPTIONS).map(([k, v]) => [k, v.label])), current.pronouns);

        const read = () => ({
            name: els.setupName.value.trim().slice(0, NAME_MAX_LENGTH) || DEFAULT_PLAYER.name,
            address: selectedValue(els.setupAddress, "address") || DEFAULT_PLAYER.address,
            pronouns: selectedValue(els.setupPronouns, "pronouns") || DEFAULT_PLAYER.pronouns
        });
        const preview = () => {
            els.setupPreview.textContent = applyTokens(
                "Molly: 'I be Molly Roger, {lass}!' · Vane's ledger: '{Name}. {They_are} one to watch.'", read());
        };
        preview();
        els.setupForm.oninput = preview;
        els.setupForm.onsubmit = e => {
            e.preventDefault();
            result = read();
            overlay.removeAttribute("data-locked");
            closeOverlay(overlay);
        };
        openOverlay(overlay, { onClose: () => resolve(result) });
        els.setupName.focus();
        els.setupName.select();
    });
}

// ---------- settings ----------

export function wireSettings({ onEditPlayer }) {
    const s = getSettings();
    renderPills(els.settingsSpeed, "speed",
        Object.fromEntries(Object.entries(TEXT_SPEEDS).map(([k, v]) => [k, v.label])), s.textSpeed);
    renderPills(els.settingsTheme, "theme", THEMES, s.theme);
    els.settingsChanges.checked = s.showChanges;
    els.settingsSetPieces.checked = s.setPieces;
    els.settingsGentle.checked = s.gentle;
    els.settingsSound.checked = s.sound;
    els.settingsVolume.value = s.volume;

    els.settingsSpeed.addEventListener("change", () => updateSettings({ textSpeed: selectedValue(els.settingsSpeed, "speed") }));
    els.settingsTheme.addEventListener("change", () => updateSettings({ theme: selectedValue(els.settingsTheme, "theme") }));
    els.settingsChanges.addEventListener("change", () => updateSettings({ showChanges: els.settingsChanges.checked }));
    els.settingsSetPieces.addEventListener("change", () => updateSettings({ setPieces: els.settingsSetPieces.checked }));
    els.settingsGentle.addEventListener("change", () => updateSettings({ gentle: els.settingsGentle.checked }));
    els.settingsSound.addEventListener("change", () => updateSettings({ sound: els.settingsSound.checked }));
    els.settingsVolume.addEventListener("input", () => updateSettings({ volume: Number(els.settingsVolume.value) }));
    els.settingsEditPlayer.addEventListener("click", onEditPlayer);
    els.settingsLink.addEventListener("click", () => openOverlay(els.settingsOverlay));
}

// ---------- satchel ----------

export function openSatchel(state) {
    const carried = state.items.map(id => items[id]).filter(Boolean);
    const notes = state.flags.map(id => flags[id]?.note).filter(Boolean);
    const total = Object.keys(items).length;

    els.satchelBody.innerHTML = `
        <h2 class="satchel-heading">Carried <span>${carried.length} of ${total} found</span></h2>
        ${carried.length ? `<ul class="satchel-list">${carried.map(item => `
            <li class="satchel-item">
                <i class="fas ${item.icon}"></i>
                <div>
                    <div class="satchel-name">${escapeHtml(item.name)}</div>
                    <div class="satchel-desc">${escapeHtml(typeset(item.description))}</div>
                </div>
            </li>`).join("")}</ul>` : '<p class="journey-empty">Nothing yet. Keep your eyes open.</p>'}
        <h2 class="satchel-heading">What you know</h2>
        ${notes.length ? `<ul class="satchel-notes">${notes.map(n => `<li>${escapeHtml(typeset(n))}</li>`).join("")}</ul>`
            : '<p class="journey-empty">You know very little, so far.</p>'}`;
    openOverlay(els.satchelOverlay);
}

// ---------- codex ----------

let codexTab = "people";

export function openCodex(state) {
    const unlocked = new Set(state.codex);
    els.codexSubtitle.textContent = `${unlocked.size} of ${codex.length} entries found - kept across every playthrough`;

    els.codexTabs.innerHTML = Object.entries(CODEX_SECTIONS).map(([id, label]) => {
        const all = codex.filter(e => e.section === id);
        const found = all.filter(e => unlocked.has(e.id)).length;
        return `<button type="button" role="tab" class="codex-tab${id === codexTab ? " active" : ""}" data-tab="${id}" aria-selected="${id === codexTab}">
            ${escapeHtml(label)} <span>${found}/${all.length}</span></button>`;
    }).join("");
    els.codexTabs.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
        codexTab = b.dataset.tab;
        openCodex(state);
    }));

    // Group entries (one group per character; letters and papers are one group each).
    const groups = new Map();
    for (const e of codex.filter(e => e.section === codexTab)) {
        if (!groups.has(e.group)) groups.set(e.group, []);
        groups.get(e.group).push(e);
    }
    els.codexBody.innerHTML = [...groups.entries()].map(([group, entries]) => {
        const any = entries.some(e => unlocked.has(e.id));
        const heading = codexTab === "people"
            ? `<h2 class="codex-group">${any ? escapeHtml(group) : "Someone you haven't met"}</h2>`
            : "";
        return `<section class="codex-section">${heading}${entries.map(e => unlocked.has(e.id)
            ? `<article class="codex-entry"><h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(typeset(e.text)).replace(/\n/g, "<br>")}</p></article>`
            : `<article class="codex-entry locked"><h3>Not yet discovered</h3></article>`).join("")}</section>`;
    }).join("");

    if (!els.codexOverlay.classList.contains("open")) openOverlay(els.codexOverlay);
}
