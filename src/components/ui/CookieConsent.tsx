"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_KEY = "aeromac_cookie_consent";

interface CookieConsentProps {
  externalOpen?: boolean;
  onClose?: () => void;
}

export function CookieConsent({ externalOpen, onClose }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      setTimeout(() => setVisible(true), 0);
    }
  }, []);

  useEffect(() => {
    if (externalOpen) {
      setTimeout(() => setVisible(true), 0);
    }
  }, [externalOpen]);

  const accept = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
    onClose?.();
  }, [onClose]);

  const reject = useCallback(() => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
    onClose?.();
  }, [onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cookie-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => { setVisible(false); onClose?.(); }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Cookie Banner */}
          <motion.div
            key="cookie-banner"
            role="dialog"
            aria-label="Cookie consent"
            initial={{ y: 50, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            style={{
              position: "fixed",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              width: "min(92vw, 680px)",
              background: "#09090B",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(0,0,0,0.95)",
            }}
          >
            {/* Shimmer top border */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.15) 80%, transparent 100%)",
            }} />

            {/* Main layout — horizontal */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.3rem 1.4rem",
            }}>

              {/* Left — Icon block */}
              <div style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
                paddingRight: "1.2rem",
                borderRight: "1px solid rgba(255,255,255,0.07)",
              }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="8.5" cy="9" r="1" fill="white" stroke="none" />
                    <circle cx="15" cy="8" r="1" fill="white" stroke="none" />
                    <circle cx="10" cy="14.5" r="1" fill="white" stroke="none" />
                    <circle cx="16" cy="14" r="1" fill="white" stroke="none" />
                  </svg>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.38rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                }}>
                  Cookies
                </span>
              </div>

              {/* Center — Message */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: "0 0 0.2rem 0",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  lineHeight: 1.4,
                }}>
                  We care about your privacy
                </p>
                <p style={{
                  margin: 0,
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.73rem",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.45)",
                  fontWeight: 300,
                }}>
                  Cookies help us enhance your experience and analyse traffic.
                  Accept all or manage your preferences below.
                </p>
              </div>

              {/* Right — Buttons */}
              <div style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                minWidth: "130px",
              }}>
                {/* Accept — solid white pill */}
                <button
                  onClick={accept}
                  style={{
                    width: "100%",
                    padding: "0.6rem 1.2rem",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.5rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#09090B",
                    background: "#FFFFFF",
                    border: "none",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    transition: "all 0.16s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#D1D5DB";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#FFFFFF";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Accept All
                </button>

                {/* Reject — ghost pill */}
                <button
                  onClick={reject}
                  style={{
                    width: "100%",
                    padding: "0.6rem 1.2rem",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.5rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.5)",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    transition: "all 0.16s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Reject
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
