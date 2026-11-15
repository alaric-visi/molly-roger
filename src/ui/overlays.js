// Modal overlays: open/close, backdrop click, Escape, and a simple focus trap.
// An overlay with the `data-locked` attribute can only be closed by its own buttons.
let lastFocus = null;
const closeHandlers = new WeakMap();

export function openOverlay(overlay, { onClose } = {}) {
    if (!overlay.classList.contains("open")) lastFocus = document.activeElement;
    overlay.classList.add("open");
    if (onClose) closeHandlers.set(overlay, onClose);
    const focusTarget = overlay.querySelector("[autofocus], input, [data-close]:not([hidden])");
    focusTarget?.focus();
}

export function closeOverlay(overlay) {
    if (!overlay.classList.contains("open")) return;
    overlay.classList.remove("open");
    const handler = closeHandlers.get(overlay);
    closeHandlers.delete(overlay);
    handler?.();
    if (!anyOverlayOpen()) lastFocus?.focus?.();
}

export const anyOverlayOpen = () => !!document.querySelector(".overlay.open");

const isLocked = overlay => overlay.hasAttribute("data-locked");

export function wireOverlays() {
    document.querySelectorAll(".overlay").forEach(overlay => {
        overlay.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", () => closeOverlay(overlay)));
        overlay.addEventListener("click", e => {
            if (e.target === overlay && !isLocked(overlay)) closeOverlay(overlay);
        });
    });

    document.addEventListener("keydown", e => {
        const open = [...document.querySelectorAll(".overlay.open")];
        const top = open[open.length - 1];
        if (!top) return;

        if (e.key === "Escape" && !isLocked(top)) {
            closeOverlay(top);
            return;
        }
        // Keep Tab focus inside the top-most overlay.
        if (e.key === "Tab") {
            const focusable = [...top.querySelectorAll("button, input, a[href], [tabindex]:not([tabindex='-1'])")]
                .filter(el => !el.disabled && !el.hidden && el.offsetParent !== null);
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
            else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
    });
}
