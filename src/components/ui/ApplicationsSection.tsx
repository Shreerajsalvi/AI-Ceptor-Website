"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const CounterUASMap = dynamic(
  () => import("./CounterUASMap").then((mod) => mod.CounterUASMap),
  { ssr: false }
);

interface AppPanel {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  visual: React.ReactNode;
}

function PerimeterVisual() {
  return (
    <svg viewBox="0 0 480 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <style>{`
          @keyframes scan-y { 0%,100%{transform:translateY(-10px);opacity:0.6} 50%{transform:translateY(110px);opacity:0.9} }
          .sc-bar { animation: scan-y 4s ease-in-out infinite; }
          @keyframes hub-p { 0%,100%{opacity:0.4;r:12} 50%{opacity:1;r:16} }
          .hub-ring { animation: hub-p 3s ease-in-out infinite; }
        `}</style>
      </defs>
      <rect width="480" height="300" fill="transparent" />
      {/* Terrain grid */}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="60" x2={i * 40} y2="280" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={60 + i * 36} x2="480" y2={60 + i * 36} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      ))}
      {/* Perimeter zone */}
      <polygon
        points="80,80 400,80 420,210 60,210"
        fill="rgba(255,255,255,0.02)"
        stroke="rgba(78,190,89,0.18)"
        strokeWidth="0.75"
        strokeDasharray="6 4"
      />
      {/* Scanner */}
      <g className="sc-bar" style={{ transformOrigin: "center" }}>
        <line x1="60" y1="80" x2="420" y2="80" stroke="#4EBE59" strokeWidth="0.75" style={{ filter: "drop-shadow(0 0 3px #4EBE59)" }} />
        <rect x="60" y="80" width="360" height="20" fill="url(#rg-a)" opacity="0.2" />
      </g>
      {/* Patrol nodes */}
      {[[150, 130], [330, 145], [240, 180]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <circle cx="0" cy="0" r="3" fill="rgba(255,255,255,0.7)" />
          <circle cx="0" cy="0" r="9" fill="none" stroke="rgba(78,190,89,0.2)" strokeWidth="0.75" strokeDasharray="2 3" />
        </g>
      ))}
      {/* Hub */}
      <g transform="translate(240,145)">
        <circle cx="0" cy="0" r="5" fill="#FFFFFF" style={{ filter: "drop-shadow(0 0 4px #4EBE59)" }} />
        <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(78,190,89,0.25)" strokeWidth="0.75" className="hub-ring" />
        <line x1="0" y1="0" x2="-90" y2="-15" stroke="rgba(78,190,89,0.15)" strokeWidth="0.5" strokeDasharray="3 4" />
        <line x1="0" y1="0" x2="90" y2="0" stroke="rgba(78,190,89,0.15)" strokeWidth="0.5" strokeDasharray="3 4" />
      </g>
      {/* Corner marks */}
      <polyline points="12,12 12,24 24,24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
      <polyline points="468,12 456,12 456,24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
      <polyline points="12,288 12,276 24,276" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
      <polyline points="468,288 456,288 456,276" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
      <text x="20" y="24" fill="rgba(255,255,255,0.18)" fontFamily="monospace" fontSize="9" letterSpacing="0.1em">PERIMETER // ALPHA_SECTOR</text>
      <text x="20" y="36" fill="rgba(255,255,255,0.5)" fontFamily="monospace" fontSize="8" letterSpacing="0.1em">STATUS: NOMINAL · PATROL: ACTIVE</text>
    </svg>
  );
}

function ResponseVisual() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#000000" }}>
      <img
        src="/soldier.png"
        alt="Tactical Soldier View"
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", opacity: 1 }}
      />

      {/* Green trajectory laser beam tracking the drone */}
      <svg
        viewBox="0 0 480 300"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
      >
        <motion.path
          fill="none"
          animate={{
            d: [
              "M 149 87 Q 250 20, 352 46",
              "M 149 87 Q 275 30, 402 76"
            ],
            strokeDashoffset: [0, -100]
          }}
          transition={{
            d: { duration: 7, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
            strokeDashoffset: { duration: 3, ease: "linear", repeat: Infinity }
          }}
          stroke="#4EBE59"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          style={{
            filter: "drop-shadow(0 0 3px #4EBE59)",
            opacity: 0.85
          }}
        />
      </svg>

      {/* Floating Drone with red frame of detection */}
      <motion.div
        animate={{
          x: [-35, 15],
          y: [-10, 20],
        }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          position: "absolute",
          top: "12%",
          left: "75%",
          width: "54px",
          height: "40px",
          border: "1px solid #FF3B30",
          boxShadow: "0 0 6px rgba(255, 59, 48, 0.6)",
          zIndex: 2,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2px"
        }}
      >
        <span style={{
          position: "absolute",
          top: "-12px",
          left: "-1px",
          backgroundColor: "#FF3B30",
          color: "#FFFFFF",
          fontSize: "7.5px",
          fontWeight: 800,
          fontFamily: "var(--font-mono), monospace",
          padding: "1px 2.5px",
          lineHeight: 1,
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}>
          TARGET
        </span>
        <img
          src="/drone.png"
          alt="Target drone"
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
      </motion.div>
    </div>
  );
}

function SwarmVisual() {
  return (
    <svg viewBox="0 0 480 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <style>{`
          @keyframes np1 { 0%,100%{opacity:0.5;r:3} 50%{opacity:1;r:4.5} }
          @keyframes np2 { 0%,100%{opacity:0.4;r:3} 50%{opacity:0.9;r:4} }
          @keyframes np3 { 0%,100%{opacity:0.6;r:2.5} 50%{opacity:1;r:4} }
          .n1{animation:np1 2s ease-in-out infinite}
          .n2{animation:np2 2.4s ease-in-out infinite}
          .n3{animation:np3 1.8s ease-in-out infinite}
          @keyframes threat-p { 0%,100%{opacity:0.8} 50%{opacity:0.4} }
          .threat-dot { animation: threat-p 1.2s ease-in-out infinite; }
          @keyframes data-flow {0%{stroke-dashoffset:24} 100%{stroke-dashoffset:0}}
          .d-pipe { stroke-dasharray:6 3; animation: data-flow 1.5s linear infinite; }
        `}</style>
      </defs>
      <rect width="480" height="300" fill="transparent" />
      {/* Background mesh */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`gv${i}`} x1={60 + i * 45} y1="40" x2={60 + i * 45} y2="270" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`gh${i}`} x1="40" y1={50 + i * 44} x2="440" y2={50 + i * 44} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
      ))}
      {/* Network links */}
      {[
        [120, 90, 240, 80], [240, 80, 360, 110], [120, 90, 160, 200],
        [360, 110, 330, 200], [160, 200, 240, 210], [330, 200, 240, 210],
        [240, 80, 240, 210],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(78,190,89,0.18)" strokeWidth="0.75" className="d-pipe" />
      ))}
      {/* Threat links */}
      <line x1="360" y1="110" x2="430" y2="80" stroke="rgba(255,77,77,0.2)" strokeWidth="0.75" strokeDasharray="3 4" />
      <line x1="330" y1="200" x2="430" y2="80" stroke="rgba(255,77,77,0.15)" strokeWidth="0.75" strokeDasharray="3 4" />
      {/* Interceptor nodes */}
      {[[120, 90], [240, 80], [360, 110], [160, 200], [330, 200], [240, 210]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" className={i % 3 === 0 ? "n1" : i % 3 === 1 ? "n2" : "n3"} style={{ filter: "drop-shadow(0 0 2px #4EBE59)" }} />
          <circle cx="0" cy="0" r="8" fill="none" stroke="rgba(78,190,89,0.12)" strokeWidth="0.5" />
        </g>
      ))}
      {/* Threat */}
      <g transform="translate(430,80)">
        <circle cx="0" cy="0" r="5" fill="#FF4D4D" className="threat-dot" style={{ filter: "drop-shadow(0 0 5px #FF4D4D)" }} />
        <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(255,77,77,0.3)" strokeWidth="0.75" strokeDasharray="2 2" />
        <text x="14" y="-4" fill="#FF4D4D" fontFamily="monospace" fontSize="9">SWARM_TGT</text>
        <text x="14" y="6" fill="rgba(255,77,77,0.6)" fontFamily="monospace" fontSize="7.5">MULTI_LOCK</text>
      </g>
      {/* Corner marks */}
      <polyline points="12,12 12,24 24,24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
      <polyline points="468,12 456,12 456,24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
      <polyline points="12,288 12,276 24,276" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
      <polyline points="468,288 456,288 456,276" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
      <text x="20" y="24" fill="rgba(255,255,255,0.18)" fontFamily="monospace" fontSize="9" letterSpacing="0.1em">SWARM_NET // MESH_COORD</text>
      <text x="20" y="36" fill="rgba(255,255,255,0.5)" fontFamily="monospace" fontSize="8" letterSpacing="0.1em">NODES: 6 ACTIVE · SYNC: 99.8%</text>
    </svg>
  );
}

export function ApplicationsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const applications: AppPanel[] = [
    {
      id: "cuas",
      num: "01",
      title: "COUNTER-UAV",
      subtitle: "Detect. Classify. Intercept.",
      description: "Autonomous detection, classification, pursuit, and kinetic interception of hostile or unauthorized unmanned aerial systems.",
      tag: "AIR / KINETIC",
      visual: <CounterUASMap radiusMeters={8000} />,
    },
    {
      id: "perimeter",
      num: "02",
      title: "OBJECT DETECTION",
      subtitle: "Establish. Patrol. Protect.",
      description: "Continuous autonomous aerial protection for critical facilities, strategic infrastructure, and sovereign restricted zones.",
      tag: "FIXED / MOBILE",
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#000000" }}>
          <img
            src="/objectdetection.png"
            alt="Track & Classify"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Main close-up Drone */}
          <motion.div
            animate={{
              x: [-300, -150, 0, 150, 350],
              y: [0, -15, 0, 15, 0],
              borderColor: [
                "rgba(255, 255, 255, 0)",
                "rgba(255, 255, 255, 0.4)",
                "#4EBE59",
                "#4EBE59",
                "rgba(255, 255, 255, 0)",
              ],
              boxShadow: [
                "0 0 0px rgba(0, 0, 0, 0)",
                "0 0 4px rgba(255, 255, 255, 0.1)",
                "0 0 10px rgba(78, 190, 89, 0.6)",
                "0 0 10px rgba(78, 190, 89, 0.6)",
                "0 0 0px rgba(0, 0, 0, 0)",
              ],
            }}
            transition={{
              duration: 12,
              times: [0, 0.25, 0.50, 0.75, 1],
              ease: "easeInOut",
              repeat: Infinity,
            }}
            style={{
              position: "absolute",
              top: "20%",
              left: "45%",
              width: "78px",
              height: "56px",
              border: "1px solid rgba(255, 255, 255, 0)",
              boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
              zIndex: 2,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px"
            }}
          >
            {/* Acquiring Tag */}
            <motion.span
              animate={{
                scale: [0, 1, 0, 0, 0],
                opacity: [0, 1, 0, 0, 0],
              }}
              transition={{
                duration: 12,
                times: [0, 0.25, 0.50, 0.75, 1],
                repeat: Infinity,
              }}
              style={{
                position: "absolute",
                top: "-14px",
                left: "-1px",
                backgroundColor: "#FFCC00",
                color: "#000000",
                fontSize: "7.5px",
                fontWeight: 800,
                fontFamily: "var(--font-mono), monospace",
                padding: "1px 3px",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
              }}
            >
              ACQ_TGT
            </motion.span>
            {/* Locked Tag */}
            <motion.span
              animate={{
                scale: [0, 0, 1.2, 1, 0],
                opacity: [0, 0, 1, 1, 0],
              }}
              transition={{
                duration: 12,
                times: [0, 0.25, 0.50, 0.75, 1],
                repeat: Infinity,
              }}
              style={{
                position: "absolute",
                top: "-14px",
                left: "-1px",
                backgroundColor: "#ffffffff",
                color: "#000000",
                fontSize: "8px",
                fontWeight: 800,
                fontFamily: "var(--font-mono), monospace",
                padding: "1px 3px",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
              }}
            >
              DRONE 1 // LOCKED
            </motion.span>
            <img
              src="/drone.png"
              alt="Drone target 1"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </motion.div>

          {/* Farther Drone 2 */}
          <motion.div
            animate={{
              x: [-300, -300, -150, 0, 150, 300],
              y: [10, 10, -5, 10, -5, 10],
              borderColor: [
                "rgba(255, 255, 255, 0)",
                "rgba(255, 255, 255, 0)",
                "rgba(255, 255, 255, 0.4)",
                "#4EBE59",
                "#4EBE59",
                "rgba(255, 255, 255, 0)",
              ],
              boxShadow: [
                "0 0 0px rgba(0, 0, 0, 0)",
                "0 0 0px rgba(0, 0, 0, 0)",
                "0 0 4px rgba(255, 255, 255, 0.1)",
                "0 0 10px rgba(78, 190, 89, 0.6)",
                "0 0 10px rgba(78, 190, 89, 0.6)",
                "0 0 0px rgba(0, 0, 0, 0)",
              ],
            }}
            transition={{
              duration: 12,
              times: [0, 0.15, 0.35, 0.60, 0.82, 1],
              ease: "easeInOut",
              repeat: Infinity,
            }}
            style={{
              position: "absolute",
              top: "12%",
              left: "22%",
              width: "48px",
              height: "36px",
              border: "1px solid rgba(255, 255, 255, 0)",
              boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
              zIndex: 2,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px"
            }}
          >
            {/* Acquiring Tag */}
            <motion.span
              animate={{
                scale: [0, 0, 1, 0, 0, 0],
                opacity: [0, 0, 1, 0, 0, 0],
              }}
              transition={{
                duration: 12,
                times: [0, 0.15, 0.35, 0.60, 0.82, 1],
                repeat: Infinity,
              }}
              style={{
                position: "absolute",
                top: "-12px",
                left: "-1px",
                backgroundColor: "#FFCC00",
                color: "#000000",
                fontSize: "6.5px",
                fontWeight: 800,
                fontFamily: "var(--font-mono), monospace",
                padding: "1px 2px",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
              }}
            >
              ACQ_TGT
            </motion.span>
            {/* Locked Tag */}
            <motion.span
              animate={{
                scale: [0, 0, 0, 1.2, 1, 0],
                opacity: [0, 0, 0, 1, 1, 0],
              }}
              transition={{
                duration: 12,
                times: [0, 0.15, 0.35, 0.60, 0.82, 1],
                repeat: Infinity,
              }}
              style={{
                position: "absolute",
                top: "-12px",
                left: "-1px",
                backgroundColor: "#ffffffff",
                color: "#000000",
                fontSize: "7px",
                fontWeight: 800,
                fontFamily: "var(--font-mono), monospace",
                padding: "1px 2px",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
              }}
            >
              DRONE 2 // LOCKED
            </motion.span>
            <img
              src="/drone.png"
              alt="Drone target 2"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </motion.div>

          {/* Farther Drone 3 */}
          <motion.div
            animate={{
              x: [-300, -300, -150, 0, 150, 300],
              y: [-10, -10, 5, -10, 5, -10],
              borderColor: [
                "rgba(255, 255, 255, 0)",
                "rgba(255, 255, 255, 0)",
                "rgba(255, 255, 255, 0.4)",
                "#4EBE59",
                "#4EBE59",
                "rgba(255, 255, 255, 0)",
              ],
              boxShadow: [
                "0 0 0px rgba(0, 0, 0, 0)",
                "0 0 0px rgba(0, 0, 0, 0)",
                "0 0 4px rgba(255, 255, 255, 0.2)",
                "0 0 10px rgba(34, 197, 94, 0.6)",
                "0 0 10px rgba(34, 197, 94, 0.6)",
                "0 0 0px rgba(0, 0, 0, 0)",
              ],
            }}
            transition={{
              duration: 12,
              times: [0, 0.28, 0.48, 0.70, 0.88, 1],
              ease: "easeInOut",
              repeat: Infinity,
            }}
            style={{
              position: "absolute",
              top: "22%",
              left: "68%",
              width: "36px",
              height: "28px",
              border: "1px solid rgba(255, 255, 255, 0)",
              boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
              zIndex: 2,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px"
            }}
          >
            {/* Acquiring Tag */}
            <motion.span
              animate={{
                scale: [0, 0, 1, 0, 0, 0],
                opacity: [0, 0, 1, 0, 0, 0],
              }}
              transition={{
                duration: 12,
                times: [0, 0.28, 0.48, 0.70, 0.88, 1],
                repeat: Infinity,
              }}
              style={{
                position: "absolute",
                top: "-11px",
                left: "-1px",
                backgroundColor: "#FFCC00",
                color: "#000000",
                fontSize: "6px",
                fontWeight: 800,
                fontFamily: "var(--font-mono), monospace",
                padding: "0.5px 1.5px",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
              }}
            >
              ACQ_TGT
            </motion.span>
            {/* Locked Tag */}
            <motion.span
              animate={{
                scale: [0, 0, 0, 1.2, 1, 0],
                opacity: [0, 0, 0, 1, 1, 0],
              }}
              transition={{
                duration: 12,
                times: [0, 0.28, 0.48, 0.70, 0.88, 1],
                repeat: Infinity,
              }}
              style={{
                position: "absolute",
                top: "-11px",
                left: "-1px",
                backgroundColor: "#ffffffff",
                color: "#000000",
                fontSize: "6.5px",
                fontWeight: 800,
                fontFamily: "var(--font-mono), monospace",
                padding: "0.5px 1.5px",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
              }}
            >
              DRONE 3 // LOCKED
            </motion.span>
            <img
              src="/drone.png"
              alt="Drone target 3"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </motion.div>

          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 40%)", pointerEvents: "none" }} />
        </div>
      ),
    },
    {
      id: "response",
      num: "03",
      title: "RAPID RESPONSE",
      subtitle: "Scramble. Vector. Neutralise.",
      description: "Sub-45-second deployment against fast-moving aerial threats where conventional response latency is operationally unacceptable.",
      tag: "TIME-CRITICAL",
      visual: <ResponseVisual />,
    },
    {
      id: "swarm",
      num: "04",
      title: "SWARM DEFENCE",
      subtitle: "Coordinate. Scale. Overwhelm.",
      description: "Scalable networked interception architecture delivering coordinated multi-vector response against simultaneous aerial threats.",
      tag: "NETWORKED",
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#000000" }}>
          <img
            src="/swarmdefence.jpg"
            alt="Swarm Defence Radar View"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          {/* Drone 1 */}
          <div
            style={{
              position: "absolute",
              border: "2px solid #4EBE59",
              boxShadow: "0 0 8px #4EBE59, inset 0 0 8px #4EBE59",
              top: "32.5%",
              left: "49%",
              width: "10%",
              height: "14%",
            }}
          />

          {/* Drone 2 */}
          <div
            style={{
              position: "absolute",
              border: "2px solid #4EBE59",
              boxShadow: "0 0 8px #4EBE59, inset 0 0 8px #4EBE59",
              top: "56.5%",
              left: "67%",
              width: "3%",
              height: "3.8%",
            }}
          />

          {/* Drone 3 */}
          <div
            style={{
              position: "absolute",
              border: "2px solid #4EBE59",
              boxShadow: "0 0 8px #4EBE59, inset 0 0 8px #4EBE59",
              top: "58.2%",
              left: "78.8%",
              width: "3%",
              height: "3.8%",
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <section
      id="applications"
      ref={sectionRef}
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        position: "relative",
        paddingBottom: "3rem",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 1024px) {
          .app-header-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .app-header-divider {
            display: none !important;
          }
          .app-header-timeline {
            margin-top: 1rem !important;
          }
        }
      `}</style>

      {/* Structural top line */}
      <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(15,23,42,0.08)" }} />

      {/* Section header */}
      <motion.div
        style={{ opacity: headerOpacity, y: headerY, position: "relative", zIndex: 2, marginBottom: "2rem" }}
        transition={{ ease: [0.25, 1, 0.5, 1] }}
      >
        <div style={{ padding: "1.8rem 3rem 3.2rem", maxWidth: "1280px", margin: "0 auto" }}>
          <div className="app-header-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1.2fr", alignItems: "stretch", gap: "3rem" }}>
            {/* Left Column: Heading */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              {/* Eyebrow */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1rem" }}>
                <div style={{ width: "32px", height: "1px", background: "#0F172A" }} />
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.28em",
                  color: "#0F172A",
                  textTransform: "uppercase",
                }}>APPLICATIONS</span>
              </div>

              <h2 style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(2rem, 3.5vw, 3.8rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "#0F172A",
                marginTop: "0",
                textTransform: "uppercase"
              }}>
                ENGINEERED FOR THE<br />
                <span style={{ color: "#8E9AA8" }}>FULL ENGAGEMENT CYCLE</span>
              </h2>
            </div>

            {/* Vertical Divider */}
            <div className="app-header-divider" style={{ width: "1px", backgroundColor: "rgba(15,23,42,0.12)", margin: "0 1rem" }} />

            {/* Right Column: Description & Timeline */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "1.05rem",
                fontWeight: 400,
                lineHeight: 1.75,
                color: "#1E293B",
                marginTop: "1.8rem",
                marginBottom: "0.8rem",
                maxWidth: "540px",
                textAlign: "justify",
                textJustify: "inter-word",
              }}>
                An integrated counter-UAS system connecting multi-sensor fusion, AI-enabled threat intelligence, unified command and autonomous interception for rapid response against evolving aerial threats.
              </p>

              {/* Horizontal Timeline */}
              <div className="app-header-timeline" style={{ position: "relative", width: "100%", paddingTop: "0.4rem", marginTop: "-0.4rem" }}>
                {/* Horizontal line */}
                <div style={{
                  position: "absolute",
                  top: "0.7rem",
                  left: "8%",
                  right: "8%",
                  height: "2px",
                  backgroundColor: "#4EBE59",
                }} />

                {/* 4 Nodes */}
                <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                  {[
                    { line1: "MULTI-SENSOR", line2: "FUSION" },
                    { line1: "UNIFIED COMMAND", line2: "SYSTEM" },
                    { line1: "AI-ENABLED", line2: "INTERCEPTION" },
                    { line1: "MODULAR", line2: "INTEGRATION" },
                  ].map((node, idx) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "22%", textAlign: "center" }}>
                      {/* Glowing Green Dot */}
                      <div style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#4EBE59",
                        border: "2px solid #FFFFFF",
                        boxShadow: "0 0 8px rgba(78, 190, 89, 0.6)",
                        marginBottom: "1.2rem",
                      }} />

                      {/* Label */}
                      <span style={{
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: "#0F172A",
                        lineHeight: 1.3,
                      }}>
                        {node.line1}<br />{node.line2}
                      </span>

                      {/* Small green dash below text */}
                      <div style={{
                        width: "16px",
                        height: "2px",
                        backgroundColor: "#4EBE59",
                        marginTop: "0.5rem"
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Application panels — DJI Style Bento Grid */}
      <div style={{ padding: "0 3rem", maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", position: "relative", zIndex: 2 }}>

        {/* 01: THREAT DETECTION (Wide Horizontal) */}
        <motion.div
          onMouseEnter={() => setHoveredCard(0)}
          onMouseLeave={() => setHoveredCard(null)}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          style={{
            gridColumn: "1 / -1",
            backgroundColor: "#06080D",
            borderRadius: 0,
            border: "none",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
            transition: "background-color 0.4s ease, border-color 0.4s ease",
          }}
        >
          <div style={{ padding: "4rem", flex: "1 1 50%" }}>
            <h3 style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "1rem",
              textTransform: "uppercase"
            }}>
              <span style={{ color: "#ffffffff", display: "block" }}>THREAT</span>
              <span style={{ color: "#4EBE59", display: "block" }}>DETECTION</span>
            </h3>

            {/* Glowing line with dot */}
            <div style={{ position: "relative", width: "100%", maxWidth: "340px", height: "1px", backgroundColor: "rgba(197, 34, 34, 1)", margin: "1.2rem 0 2.2rem" }}>
              <div style={{ position: "absolute", left: "25%", top: "-3px", width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#ffffffff", boxShadow: "0 0 10px #ffffffff" }} />
            </div>

            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1.05rem",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "#FFFFFF",
              maxWidth: "520px",
              marginBottom: "2.5rem",
            }}>
              Layered sensor detection enables operational redundancy, real-time threat validation and reliable aerial surveillance across complex environments. Multi-source correlation improves detection confidence while maintaining continuous awareness of emerging aerial threats.
            </p>

            {/* Horizontal divider */}
            <div style={{ width: "100%", maxWidth: "480px", height: "1px", backgroundColor: "rgba(255, 255, 255, 0.1)", marginBottom: "2rem" }} />

            {/* 01 & 02 Sub-features */}
            <div style={{ display: "flex", gap: "3rem", alignItems: "center", marginBottom: "2.5rem" }}>
              <div>
                <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#c52222ff", display: "block", lineHeight: 1, marginBottom: "0.5rem" }}>01</span>
                <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.04em", textTransform: "uppercase", display: "block" }}>RADAR DETECTION</span>
              </div>
              <div style={{ width: "1px", height: "38px", backgroundColor: "rgba(255, 255, 255, 0.15)" }} />
              <div>
                <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#c52222ff", display: "block", lineHeight: 1, marginBottom: "0.5rem" }}>02</span>
                <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.04em", textTransform: "uppercase", display: "block" }}>OPTICAL VERIFICATION</span>
              </div>
            </div>

            {/* Green 5 Dots accent */}
            <div style={{ display: "flex", gap: "6px" }}>
              {[0, 1, 2, 3, 4].map((dot) => (
                <div key={dot} style={{ width: "4px", height: "4px", backgroundColor: "rgba(78, 190, 89, 0.7)", borderRadius: "1px" }} />
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 50%", height: "480px", position: "relative", backgroundColor: "#06080D", overflow: "hidden" }}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              {applications[0].visual}
            </motion.div>
          </div>
        </motion.div>

        {/* 02: TRACK & CLASSIFY (Vertical Card) */}
        <motion.div
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          style={{
            backgroundColor: "#0A0D14",
            borderRadius: 0,
            border: "none",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            cursor: "pointer",
            transition: "background-color 0.4s ease, border-color 0.4s ease",
          }}
        >
          <div style={{ height: "320px", position: "relative", padding: "0", backgroundColor: "#06080D", overflow: "hidden" }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#000000" }}>
                <img
                  src="/objectdetection.png"
                  alt="Track & Classify"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Main close-up Drone */}
                <motion.div
                  animate={{
                    x: [-300, -150, 0, 150, 350],
                    y: [0, -15, 0, 15, 0],
                    borderColor: [
                      "rgba(255, 255, 255, 0)",
                      "rgba(255, 255, 255, 0.4)",
                      "#4EBE59",
                      "#4EBE59",
                      "rgba(255, 255, 255, 0)",
                    ],
                    boxShadow: [
                      "0 0 0px rgba(0, 0, 0, 0)",
                      "0 0 4px rgba(255, 255, 255, 0.1)",
                      "0 0 10px rgba(78, 190, 89, 0.6)",
                      "0 0 10px rgba(78, 190, 89, 0.6)",
                      "0 0 0px rgba(0, 0, 0, 0)",
                    ],
                  }}
                  transition={{
                    duration: 12,
                    times: [0, 0.25, 0.50, 0.75, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  style={{
                    position: "absolute",
                    top: "20%",
                    left: "45%",
                    width: "78px",
                    height: "56px",
                    border: "1px solid rgba(255, 255, 255, 0)",
                    boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
                    zIndex: 2,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2px"
                  }}
                >
                  {/* Acquiring Tag */}
                  <motion.span
                    animate={{
                      scale: [0, 1, 0, 0, 0],
                      opacity: [0, 1, 0, 0, 0],
                    }}
                    transition={{
                      duration: 12,
                      times: [0, 0.25, 0.50, 0.75, 1],
                      repeat: Infinity,
                    }}
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "-1px",
                      backgroundColor: "#FFCC00",
                      color: "#000000",
                      fontSize: "7.5px",
                      fontWeight: 800,
                      fontFamily: "var(--font-mono), monospace",
                      padding: "1px 3px",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                    }}
                  >
                    ACQ_TGT
                  </motion.span>
                  {/* Locked Tag */}
                  <motion.span
                    animate={{
                      scale: [0, 0, 1.2, 1, 0],
                      opacity: [0, 0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 12,
                      times: [0, 0.25, 0.50, 0.75, 1],
                      repeat: Infinity,
                    }}
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "-1px",
                      backgroundColor: "#ffffffff",
                      color: "#000000",
                      fontSize: "8px",
                      fontWeight: 800,
                      fontFamily: "var(--font-mono), monospace",
                      padding: "1px 3px",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                    }}
                  >
                    DRONE 1 // LOCKED
                  </motion.span>
                  <img
                    src="/drone.png"
                    alt="Drone target 1"
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                  />
                </motion.div>

                {/* Farther Drone 2 */}
                <motion.div
                  animate={{
                    x: [-300, -300, -150, 0, 150, 300],
                    y: [10, 10, -5, 10, -5, 10],
                    borderColor: [
                      "rgba(255, 255, 255, 0)",
                      "rgba(255, 255, 255, 0)",
                      "rgba(255, 255, 255, 0.4)",
                      "#4EBE59",
                      "#4EBE59",
                      "rgba(255, 255, 255, 0)",
                    ],
                    boxShadow: [
                      "0 0 0px rgba(0, 0, 0, 0)",
                      "0 0 0px rgba(0, 0, 0, 0)",
                      "0 0 4px rgba(255, 255, 255, 0.1)",
                      "0 0 10px rgba(78, 190, 89, 0.6)",
                      "0 0 10px rgba(78, 190, 89, 0.6)",
                      "0 0 0px rgba(0, 0, 0, 0)",
                    ],
                  }}
                  transition={{
                    duration: 12,
                    times: [0, 0.15, 0.35, 0.60, 0.82, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  style={{
                    position: "absolute",
                    top: "12%",
                    left: "22%",
                    width: "48px",
                    height: "36px",
                    border: "1px solid rgba(255, 255, 255, 0)",
                    boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
                    zIndex: 2,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2px"
                  }}
                >
                  {/* Acquiring Tag */}
                  <motion.span
                    animate={{
                      scale: [0, 0, 1, 0, 0, 0],
                      opacity: [0, 0, 1, 0, 0, 0],
                    }}
                    transition={{
                      duration: 12,
                      times: [0, 0.15, 0.35, 0.60, 0.82, 1],
                      repeat: Infinity,
                    }}
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "-1px",
                      backgroundColor: "#FFCC00",
                      color: "#000000",
                      fontSize: "6.5px",
                      fontWeight: 800,
                      fontFamily: "var(--font-mono), monospace",
                      padding: "1px 2px",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                    }}
                  >
                    ACQ_TGT
                  </motion.span>
                  {/* Locked Tag */}
                  <motion.span
                    animate={{
                      scale: [0, 0, 0, 1.2, 1, 0],
                      opacity: [0, 0, 0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 12,
                      times: [0, 0.15, 0.35, 0.60, 0.82, 1],
                      repeat: Infinity,
                    }}
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "-1px",
                      backgroundColor: "#ffffffff",
                      color: "#000000",
                      fontSize: "7px",
                      fontWeight: 800,
                      fontFamily: "var(--font-mono), monospace",
                      padding: "1px 2px",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                    }}
                  >
                    DRONE 2 // LOCKED
                  </motion.span>
                  <img
                    src="/drone.png"
                    alt="Drone target 2"
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                  />
                </motion.div>

                {/* Farther Drone 3 */}
                <motion.div
                  animate={{
                    x: [-300, -300, -150, 0, 150, 300],
                    y: [-10, -10, 5, -10, 5, -10],
                    borderColor: [
                      "rgba(255, 255, 255, 0)",
                      "rgba(255, 255, 255, 0)",
                      "rgba(255, 255, 255, 0.4)",
                      "#4EBE59",
                      "#4EBE59",
                      "rgba(255, 255, 255, 0)",
                    ],
                    boxShadow: [
                      "0 0 0px rgba(0, 0, 0, 0)",
                      "0 0 0px rgba(0, 0, 0, 0)",
                      "0 0 4px rgba(255, 255, 255, 0.2)",
                      "0 0 10px rgba(78, 190, 89, 0.6)",
                      "0 0 10px rgba(78, 190, 89, 0.6)",
                      "0 0 0px rgba(0, 0, 0, 0)",
                    ],
                  }}
                  transition={{
                    duration: 12,
                    times: [0, 0.28, 0.48, 0.70, 0.88, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  style={{
                    position: "absolute",
                    top: "22%",
                    left: "68%",
                    width: "36px",
                    height: "28px",
                    border: "1px solid rgba(255, 255, 255, 0)",
                    boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
                    zIndex: 2,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2px"
                  }}
                >
                  {/* Acquiring Tag */}
                  <motion.span
                    animate={{
                      scale: [0, 0, 1, 0, 0, 0],
                      opacity: [0, 0, 1, 0, 0, 0],
                    }}
                    transition={{
                      duration: 12,
                      times: [0, 0.28, 0.48, 0.70, 0.88, 1],
                      repeat: Infinity,
                    }}
                    style={{
                      position: "absolute",
                      top: "-11px",
                      left: "-1px",
                      backgroundColor: "#FFCC00",
                      color: "#000000",
                      fontSize: "6px",
                      fontWeight: 800,
                      fontFamily: "var(--font-mono), monospace",
                      padding: "0.5px 1.5px",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                    }}
                  >
                    ACQ_TGT
                  </motion.span>
                  {/* Locked Tag */}
                  <motion.span
                    animate={{
                      scale: [0, 0, 0, 1.2, 1, 0],
                      opacity: [0, 0, 0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 12,
                      times: [0, 0.28, 0.48, 0.70, 0.88, 1],
                      repeat: Infinity,
                    }}
                    style={{
                      position: "absolute",
                      top: "-11px",
                      left: "-1px",
                      backgroundColor: "#ffffffff",
                      color: "#000000",
                      fontSize: "6.5px",
                      fontWeight: 800,
                      fontFamily: "var(--font-mono), monospace",
                      padding: "0.5px 1.5px",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                    }}
                  >
                    DRONE 3 // LOCKED
                  </motion.span>
                  <img
                    src="/drone.png"
                    alt="Drone target 3"
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
          <div style={{ padding: "3rem", position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ position: "absolute", top: "1.8rem", right: "1.8rem", display: "flex", gap: "6px" }}>
              {[0, 1, 2, 3, 4].map((dot) => (
                <div key={dot} style={{ width: "4px", height: "4px", backgroundColor: "rgba(78, 190, 89, 0.6)", borderRadius: "1px" }} />
              ))}
            </div>
            <h3 style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "1rem",
              textTransform: "uppercase"
            }}>
              <span style={{ color: "#ffffffff", display: "block" }}>TRACK &</span>
              <span style={{ color: "#4EBE59", display: "block" }}>CLASSIFY</span>
            </h3>

            {/* Glowing line with dot */}
            <div style={{ position: "relative", width: "100%", maxWidth: "340px", height: "1px", backgroundColor: "rgba(197, 34, 34, 1)", margin: "1.2rem 0 2.2rem" }}>
              <div style={{ position: "absolute", left: "25%", top: "-3px", width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#ffffffff", boxShadow: "0 0 10px #ffffffff" }} />
            </div>

            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1.05rem",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "#FFFFFF",
              margin: 0,
            }}>
              AI-enabled object detection, classification and autonomous tracking continuously analyse aerial threats, maintaining target identity, trajectory and movement throughout the engagement cycle.
            </p>
          </div>
        </motion.div>

        {/* 03: ENGAGE & INTERCEPT (Vertical Card) */}
        <motion.div
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          style={{
            backgroundColor: "#0A0D14",
            borderRadius: 0,
            border: "none",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            cursor: "pointer",
            transition: "background-color 0.4s ease, border-color 0.4s ease",
          }}
        >
          <div style={{ height: "320px", position: "relative", padding: "0", backgroundColor: "#06080D", overflow: "hidden" }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              {applications[2].visual}
            </motion.div>
          </div>
          <div style={{ padding: "3rem", position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ position: "absolute", top: "1.8rem", right: "1.8rem", display: "flex", gap: "6px" }}>
              {[0, 1, 2, 3, 4].map((dot) => (
                <div key={dot} style={{ width: "4px", height: "4px", backgroundColor: "rgba(78, 190, 89, 0.6)", borderRadius: "1px" }} />
              ))}
            </div>
            <h3 style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "1rem",
              textTransform: "uppercase"
            }}>
              <span style={{ color: "#ffffffff", display: "block" }}>ENGAGE &</span>
              <span style={{ color: "#4EBE59", display: "block" }}>INTERCEPT</span>
            </h3>

            {/* Glowing line with dot */}
            <div style={{ position: "relative", width: "100%", maxWidth: "340px", height: "1px", backgroundColor: "rgba(197, 34, 34, 1)", margin: "1.2rem 0 2.2rem" }}>
              <div style={{ position: "absolute", left: "25%", top: "-3px", width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#ffffffff", boxShadow: "0 0 10px #ffffffff" }} />
            </div>

            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1.05rem",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "#FFFFFF",
              margin: 0,
            }}>
              Rapid interceptor deployment enabling high-speed pursuit, precision engagement and decisive neutralisation of time-critical aerial threats.
            </p>
          </div>
        </motion.div>

        {/* 04: SWARM RESPONSE (Wide Horizontal Reverse) */}
        <motion.div
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
          style={{
            gridColumn: "1 / -1",
            backgroundColor: "#06080D",
            borderRadius: 0,
            border: "none",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            cursor: "pointer",
            transition: "background-color 0.4s ease, border-color 0.4s ease",
          }}
        >
          <div style={{ padding: "4rem", flex: "1 1 50%", position: "relative" }}>
            <div style={{ position: "absolute", top: "2rem", right: "2rem", display: "flex", gap: "6px" }}>
              {[0, 1, 2, 3, 4].map((dot) => (
                <div key={dot} style={{ width: "4px", height: "4px", backgroundColor: "rgba(78, 190, 89, 0.6)", borderRadius: "1px" }} />
              ))}
            </div>
            <h3 style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "1rem",
              textTransform: "uppercase"
            }}>
              <span style={{ color: "#ffffffff", display: "block" }}>SWARM</span>
              <span style={{ color: "#4EBE59", display: "block" }}>RESPONSE</span>
            </h3>
            <div style={{ position: "relative", width: "100%", maxWidth: "340px", height: "1px", backgroundColor: "rgba(197, 34, 34, 1)", margin: "1.2rem 0 2.2rem" }}>
              <div style={{ position: "absolute", left: "25%", top: "-3px", width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#ffffffff", boxShadow: "0 0 10px #ffffffff" }} />
            </div>
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1.05rem",
              fontWeight: 400,
              lineHeight: 1.75,
              color: "#FFFFFF",
              maxWidth: "500px",
              marginBottom: "3rem",
            }}>
              Scalable networked interception architecture delivering coordinated multi-vector response against simultaneous aerial threats.
            </p>
            <div style={{ display: "flex", gap: "6px" }}>
              {[0, 1, 2, 3, 4].map((dot) => (
                <div key={dot} style={{ width: "4px", height: "4px", backgroundColor: "rgba(34, 197, 94, 0.7)", borderRadius: "1px" }} />
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 50%", height: "420px", position: "relative", backgroundColor: "#06080D", overflow: "hidden" }}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              {applications[3].visual}
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
