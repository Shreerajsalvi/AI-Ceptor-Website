"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TelemetryOverlayProps {
  spacerRef?: React.RefObject<HTMLDivElement | null>;
}

export function TelemetryOverlay({ spacerRef }: TelemetryOverlayProps) {
  const [coords, setCoords] = useState({ x: "0.000", y: "0.000" });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setCoords({ x: nx.toFixed(3), y: ny.toFixed(3) });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end end"],
  });

  // Segment 1: System Init (0.00 -> 0.08) | Top-Right (Hero Title is Bottom-Left)
  const opacity1 = useTransform(scrollYProgress, [0.0, 0.02, 0.06, 0.08], [0, 1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0.0, 0.02, 0.06, 0.08], [10, 0, 0, -10]);

  // Segment 2: Threat Acquisition (0.10 -> 0.24) | Mid-Right (Engineering section is Left)
  const opacity2 = useTransform(scrollYProgress, [0.10, 0.13, 0.21, 0.24], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.10, 0.13, 0.21, 0.24], [10, 0, 0, -10]);

  // Segment 3: Interceptor Launch (0.26 -> 0.38) | Mid-Left (Materials section is Right)
  const opacity3 = useTransform(scrollYProgress, [0.26, 0.29, 0.35, 0.38], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.26, 0.29, 0.35, 0.38], [10, 0, 0, -10]);

  // Segment 4: Sensor Intelligence (0.40 -> 0.52) | Top-Right (Autonomy section is Bottom-Left)
  const opacity4 = useTransform(scrollYProgress, [0.40, 0.43, 0.49, 0.52], [0, 1, 1, 0]);
  const y4 = useTransform(scrollYProgress, [0.40, 0.43, 0.49, 0.52], [10, 0, 0, -10]);

  // Segment 5: Terminal Engagement (0.54 -> 0.65) | Bottom-Left (Performance Stats is Top-Right)
  const opacity5 = useTransform(scrollYProgress, [0.54, 0.57, 0.62, 0.65], [0, 1, 1, 0]);
  const y5 = useTransform(scrollYProgress, [0.54, 0.57, 0.62, 0.65], [10, 0, 0, -10]);

  // Segment 6: Mission Metrics Sync (0.67 -> 0.77) | Bottom-Right (Manufacturing is Mid-Left)
  const opacity6 = useTransform(scrollYProgress, [0.67, 0.70, 0.74, 0.77], [0, 1, 1, 0]);
  const y6 = useTransform(scrollYProgress, [0.67, 0.70, 0.74, 0.77], [10, 0, 0, -10]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 15,
        pointerEvents: "none",
        fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
        fontSize: "0.70rem",
        color: "#A8B2BD",
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        lineHeight: 1.85,
      }}
    >
      {/* ── SEGMENT 1: SYSTEM INITIALIZATION (0.00 -> 0.08) ── Top Right */}
      <motion.div
        style={{
          position: "absolute",
          top: "10rem",
          right: "3.5rem",
          opacity: opacity1,
          y: y1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.15rem",
          maxWidth: "340px",
          textAlign: "right",
        }}
      >
        <div style={{ color: "#A8B2BD", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.24em", marginBottom: "0.3rem" }}>
          // PHASE 01 — SYSTEM INITIALIZATION
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>SYS_CORE: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>AI-CEPTOR</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>C2_LINK: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>SECURE</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>C2 STATUS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>CONNECTED</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>COMMAND LINK: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>SECURE</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>SYSTEM STATUS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>NOMINAL</span>
        </div>
      </motion.div>

      {/* ── SEGMENT 2: THREAT ACQUISITION (0.10 -> 0.24) ── Mid Right */}
      <motion.div
        style={{
          position: "absolute",
          top: "46%",
          transform: "translateY(-50%)",
          right: "3.5rem",
          opacity: opacity2,
          y: y2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.15rem",
          maxWidth: "360px",
          textAlign: "right",
        }}
      >
        <div style={{ color: "#A8B2BD", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.24em", marginBottom: "0.3rem" }}>
          // PHASE 02 — THREAT ACQUISITION
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>TARGET DETECTED: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>UAV-01</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>TARGET RANGE: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>0.10 KM</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>NEAREST TARGET: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>100 M</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>THREAT CLASS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>HOSTILE UAV</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>TRACK STATUS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>LOCKED</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>TARGET VECTOR: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>UPDATED</span>
        </div>
      </motion.div>

      {/* ── SEGMENT 3: INTERCEPTOR LAUNCH (0.26 -> 0.38) ── Mid Left */}
      <motion.div
        style={{
          position: "absolute",
          top: "46%",
          transform: "translateY(-50%)",
          left: "3.5rem",
          opacity: opacity3,
          y: y3,
          display: "flex",
          flexDirection: "column",
          gap: "0.15rem",
          maxWidth: "340px",
        }}
      >
        <div style={{ color: "#A8B2BD", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.24em", marginBottom: "0.3rem" }}>
          // PHASE 03 — INTERCEPTOR LAUNCH
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>INTERCEPTOR: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>AD-V0021</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>LAUNCH STATUS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>DEPLOYED</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>ENGAGEMENT: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>ACTIVE</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>INTERCEPT PATH: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>OPTIMIZED</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>MISSION MODE: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>INTERCEPT</span>
        </div>
      </motion.div>

      {/* ── SEGMENT 4: SENSOR INTELLIGENCE (0.40 -> 0.52) ── Top Right */}
      <motion.div
        style={{
          position: "absolute",
          top: "8rem",
          right: "3.5rem",
          opacity: opacity4,
          y: y4,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.15rem",
          maxWidth: "360px",
          textAlign: "right",
        }}
      >
        <div style={{ color: "#A8B2BD", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.24em", marginBottom: "0.3rem" }}>
          // PHASE 04 — MULTI-SENSOR INTELLIGENCE
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>SENSOR FUSION: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>ACTIVE</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>SENSOR INPUTS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>SYNCHRONIZED</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>MULTI-SENSOR TRACK: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>VERIFIED</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>TARGET CONFIDENCE: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>HIGH</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>SWARM TRACKS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>06 ACTIVE</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>INTERCEPT QUEUE: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>03</span>
        </div>
      </motion.div>

      {/* ── SEGMENT 5: TERMINAL ENGAGEMENT (0.54 -> 0.65) ── Bottom Left */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "7rem",
          left: "3.5rem",
          opacity: opacity5,
          y: y5,
          display: "flex",
          flexDirection: "column",
          gap: "0.15rem",
          maxWidth: "340px",
        }}
      >
        <div style={{ color: "#A8B2BD", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.24em", marginBottom: "0.3rem" }}>
          // PHASE 05 — TERMINAL ENGAGEMENT
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>NETWORKED C2: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>CONNECTED</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>INTERCEPTOR: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>AD-V0021</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>LAUNCH_STATUS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>DEPLOYED</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>INTERCEPT PATH: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>ACTIVE</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>ENGAGEMENT_STATUS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>ACTIVE</span>
        </div>
      </motion.div>

      {/* ── SEGMENT 6: MISSION METRICS SYNC (0.67 -> 0.77) ── Bottom Right */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "7rem",
          right: "3.5rem",
          opacity: opacity6,
          y: y6,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.15rem",
          maxWidth: "360px",
          textAlign: "right",
        }}
      >
        <div style={{ color: "#A8B2BD", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.24em", marginBottom: "0.3rem" }}>
          // PHASE 06 — MISSION METRICS
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>MULTI_SENSOR_TRACK: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>VERIFIED</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>TARGET_CONFIDENCE: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>HIGH</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>C2_STATUS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>CONNECTED</span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>SYSTEM STATUS: </span>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>NOMINAL</span>
        </div>
      </motion.div>

      {/* ── Dynamic Mouse Grid Coordinates ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "6.5rem",
          left: "3.5rem",
          fontSize: "0.5rem",
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        GRID // X:{coords.x} Y:{coords.y}
      </div>
    </div>
  );
}
