"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  progress: number; // 0–1
  isVisible: boolean;
}

export function LoadingScreen({ progress, isVisible }: LoadingScreenProps) {
  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#05070B",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
            style={{ marginBottom: "3rem", textAlign: "center" }}
          >
            <img
              src="/AI CEPTOR/AI CEPTOR WHITE  PNG.png"
              alt="AI-CEPTOR"
              style={{
                height: "100px",
                maxWidth: "80vw",
                width: "auto",
                display: "block",
                margin: "0 auto 0.75rem",
                opacity: 0.95,
                objectFit: "contain",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "0.95rem",
                fontWeight: 500,
                letterSpacing: "0.22em",
                color: "rgba(255, 255, 255, 0.7)",
                textTransform: "uppercase",
                margin: "0",
              }}
            >
              AI-Enabled Precision Interceptor
            </p>
          </motion.div>

          {/* Progress bar track */}
          <div
            style={{
              width: "180px",
              height: "2px",
              background: "rgba(255, 255, 255, 0.1)",
              position: "relative",
              overflow: "hidden",
              borderRadius: "2px",
            }}
          >
            {/* Fill */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                background: "#4EBE59",
                boxShadow: "0 0 10px #4EBE59",
                width: `${pct}%`,
                transition: "width 0.15s ease",
              }}
            />
          </div>

          {/* Percentage label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontFamily: "var(--font-ibm-plex-mono), 'IBM Plex Mono', monospace",
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: "1.2rem",
              textTransform: "uppercase",
            }}
          >
            {pct < 100 ? `LOADING ${pct}%` : "INITIALISING"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
