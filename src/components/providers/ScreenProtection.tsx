"use client";

import { useEffect } from "react";

/**
 * ScreenProtection — Prevents screenshots, printing, and content copying.
 *
 * Layers of protection:
 * 1. Blocks keyboard shortcuts: PrintScreen, Ctrl+P, Ctrl+Shift+S, Ctrl+Shift+I, F12
 * 2. Disables right-click context menu
 * 3. Injects @media print CSS to blank the page
 * 4. Prevents text selection via CSS
 * 5. Blocks drag events on images
 */
export default function ScreenProtection() {
  useEffect(() => {
    // ── 1. Block keyboard shortcuts ──
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        e.stopImmediatePropagation();
        // Overwrite clipboard with empty content
        navigator.clipboard?.writeText?.("").catch(() => {});
        return false;
      }

      // Ctrl+P (Print)
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // Ctrl+Shift+S (Save as / Screenshot in some browsers)
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // Ctrl+S (Save Page)
      if (e.ctrlKey && !e.shiftKey && e.key === "s") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // Ctrl+C (Copy) — optional, blocks copying text
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // Windows+Shift+S (Windows Screenshot tool)
      if (e.metaKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        e.stopImmediatePropagation();
        navigator.clipboard?.writeText?.("").catch(() => {});
        return false;
      }
    };

    // ── 2. Block right-click context menu ──
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // ── 3. Block drag (prevents dragging images to desktop) ──
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // ── 4. Block copy event ──
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.clipboardData?.setData("text/plain", "");
      return false;
    };

    // ── 5. Inject print-blocking styles ──
    const styleEl = document.createElement("style");
    styleEl.id = "screen-protection-styles";
    styleEl.textContent = `
      /* Block printing — show blank page */
      @media print {
        html, body {
          display: none !important;
          visibility: hidden !important;
        }
      }

      /* Prevent text selection */
      body {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }

      /* Prevent image dragging */
      img {
        -webkit-user-drag: none !important;
        pointer-events: auto;
      }
    `;
    document.head.appendChild(styleEl);

    // Attach listeners
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    document.addEventListener("dragstart", handleDragStart, { capture: true });
    document.addEventListener("copy", handleCopy, { capture: true });

    // ── 6. beforeprint event — last-resort blank ──
    const handleBeforePrint = () => {
      document.body.style.display = "none";
    };
    const handleAfterPrint = () => {
      document.body.style.display = "";
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      document.removeEventListener("dragstart", handleDragStart, { capture: true });
      document.removeEventListener("copy", handleCopy, { capture: true });
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      const el = document.getElementById("screen-protection-styles");
      if (el) el.remove();
    };
  }, []);

  // Render nothing — this is a behavior-only component
  return null;
}
