// Breadcrumb trail + the full Journey overlay. Both let you leap back to an
// earlier step via the onJump callback.
import { els, escapeHtml } from "./dom.js";

export function sceneLabel(sceneId) {
    return sceneId.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

const MAX_CRUMBS = 5;
const arrow = () => {
    const a = document.createElement("span");
    a.className = "breadcrumb-arrow";
    a.innerHTML = '<i class="fas fa-chevron-right"></i>';
    return a;
};

export function renderBreadcrumbs(steps, { onJump, onShowAll }) {
    const root = els.breadcrumbs;
    root.innerHTML = "";
    if (!steps.length) return;

    const start = Math.max(0, steps.length - MAX_CRUMBS);

    if (start > 0) {
        const more = document.createElement("button");
        more.type = "button";
        more.className = "breadcrumb-more";
        more.textContent = `+${start} earlier…`;
        more.title = "See your full journey";
        more.addEventListener("click", onShowAll);
        root.append(more, arrow());
    }

    for (let idx = start; idx < steps.length; idx++) {
        const step = steps[idx];
        const isCurrent = idx === steps.length - 1;
        const chip = document.createElement(isCurrent ? "span" : "button");
        chip.className = "breadcrumb-item" + (isCurrent ? " current" : "");
        chip.textContent = sceneLabel(step.sceneId);
        if (step.choiceText) chip.title = `You chose: "${step.choiceText}"`;
        if (!isCurrent) {
            chip.type = "button";
            chip.addEventListener("click", () => onJump(idx));
        } else {
            chip.setAttribute("aria-current", "step");
        }
        root.appendChild(chip);
        if (!isCurrent) root.appendChild(arrow());
    }
}

export function renderJourneyList(steps, { onJump }) {
    const list = els.journeyList;
    list.innerHTML = "";

    if (!steps.length) {
        list.innerHTML = '<div class="journey-empty">Your journey hasn\'t begun yet.</div>';
        return;
    }

    steps.forEach((step, idx) => {
        const isCurrent = idx === steps.length - 1;
        const item = document.createElement(isCurrent ? "div" : "button");
        item.className = "journey-item" + (isCurrent ? " current" : "");
        const choice = step.choiceText || (idx === 0 ? "Begin the story" : "");
        item.innerHTML = `
            <div class="journey-step-number">${idx + 1}</div>
            <div class="journey-step-content">
                <div class="journey-step-label">${escapeHtml(sceneLabel(step.sceneId))}</div>
                ${choice ? `<div class="journey-step-choice">"${escapeHtml(choice)}"</div>` : ""}
            </div>
            ${isCurrent
                ? '<i class="fas fa-map-marker-alt journey-jump-icon" title="You are here"></i>'
                : '<i class="fas fa-undo journey-jump-icon" title="Jump back here"></i>'}`;
        if (!isCurrent) {
            item.type = "button";
            item.addEventListener("click", () => onJump(idx));
        }
        list.appendChild(item);
    });
}
