"use client";

import React, { useState, useCallback, useRef } from "react";

interface FamilyItem {
  name: string;
}

interface EcosystemItem {
  name: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  shape: "drone" | "jet" | "target" | "radar";
  color: string;
  rotation: number;
}

const FAMILY_ITEMS: FamilyItem[] = [
  { name: "HIGH-SPEED" },
  { name: "HEAVY-PAYLOAD" },
  { name: "LONG-RANGE" },
  { name: "FOLDABLE / QUICK-LAUNCH" },
  { name: "BATTERY-POWERED" },
  { name: "ENGINE-POWERED" },
  { name: "STEALTH" },
  { name: "DAY / NIGHT" },
];

const ECOSYSTEM_ITEMS: EcosystemItem[] = [
  { name: "COASTAL DEFENCE" },
  { name: "SWARM DEFENCE" },
  { name: "MULTI-SENSOR INTEGRATION" },
  { name: "BORDER DEFENCE" },
  { name: "AIRBASE PROTECTION" },
  { name: "STRATEGIC ASSET PROTECTION" },
  { name: "MILITARY BASE PROTECTION" },
  { name: "HIGH-SECURITY SITES" },
];

function ParticleGraphic({ shape, size, color }: { shape: Particle["shape"]; size: number; color: string }) {
  if (shape === "drone") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="3.5" fill={color} />
        <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.8" />
        <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.8" />
        <circle cx="5" cy="5" r="2.5" fill={color} />
        <circle cx="19" cy="5" r="2.5" fill={color} />
        <circle cx="5" cy="19" r="2.5" fill={color} />
        <circle cx="19" cy="19" r="2.5" fill={color} />
      </svg>
    );
  }

  if (shape === "jet") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 1L15 10L23 16L15 14L12 23L9 14L1 16L9 10L12 1Z" />
      </svg>
    );
  }

  if (shape === "target") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2" fill={color} />
        <line x1="12" y1="1" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="1" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="23" y2="12" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" fill={color} />
      <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
    </svg>
  );
}

export function PartnersMarquee() {
  const family3 = [...FAMILY_ITEMS, ...FAMILY_ITEMS, ...FAMILY_ITEMS];
  const ecosystem3 = [...ECOSYSTEM_ITEMS, ...ECOSYSTEM_ITEMS, ...ECOSYSTEM_ITEMS];

  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);
  const lastSpawnTime = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastSpawnTime.current < 45) return;
    lastSpawnTime.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const shapes: Particle["shape"][] = ["drone", "jet", "target", "radar"];
    const colors = ["#4EBE59", "#FFFFFF", "#38BDF8", "#94A3B8"];

    const count = Math.floor(Math.random() * 2) + 1;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 44;
      const offsetY = (Math.random() - 0.5) * 24;
      newParticles.push({
        id: nextId.current++,
        x: x + offsetX,
        y: y + offsetY,
        size: Math.floor(Math.random() * 8) + 12,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.floor(Math.random() * 30) - 15,
      });
    }

    setParticles((prev) => [...prev.slice(-24), ...newParticles]);
  }, []);

  return (
    <section
      id="ecosystem"
      onMouseMove={handleMouseMove}
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
        padding: "3.8rem 0 4.2rem",
        borderTop: "1px solid rgba(15, 23, 42, 0.08)",
        borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
      }}
    >
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-33.333%,0,0); }
        }
        .grid-marquee-track-left {
          display: flex;
          width: max-content;
          animation: scrollLeft 55s linear infinite;
          will-change: transform;
        }
        .grid-marquee-track-left:hover { animation-play-state: paused; }

        @keyframes scrollRight {
          0% { transform: translate3d(-33.333%,0,0); }
          100% { transform: translate3d(0,0,0); }
        }
        .grid-marquee-track-right {
          display: flex;
          width: max-content;
          animation: scrollRight 60s linear infinite;
          will-change: transform;
        }
        .grid-marquee-track-right:hover { animation-play-state: paused; }

        /* Refined Dark Charcoal Olyyx Marquee Cell Strip */
        .olyyx-dark-strip-cell {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.45rem 3.6rem;
          border-right: 1px solid rgba(255, 255, 255, 0.09);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(180deg, #11141A 0%, #0B0C10 100%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.25s ease;
          cursor: default;
        }
        .olyyx-dark-strip-cell:hover {
          background: linear-gradient(180deg, #191D26 0%, #12151D 100%);
          border-color: rgba(78, 190, 89, 0.4);
        }

        /* Floating Drone Cursor Particle Animation */
        @keyframes floatDroneParticle {
          0% {
            opacity: 0.9;
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
            filter: drop-shadow(0 0 6px rgba(78, 190, 89, 0.6));
          }
          100% {
            opacity: 0;
            transform: translate3d(0, -50px, 0) scale(0.3) rotate(25deg);
            filter: drop-shadow(0 0 0px transparent);
          }
        }
        .cursor-spark-particle {
          position: absolute;
          pointer-events: none;
          z-index: 100;
          animation: floatDroneParticle 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Interactive Drone Cursor Particle Trail */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="cursor-spark-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        >
          <ParticleGraphic shape={p.shape} size={p.size} color={p.color} />
        </div>
      ))}

      {/* Section Header (White Background) */}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginBottom: "2.8rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.55rem",
            marginBottom: "0.9rem",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#4EBE59",
              boxShadow: "0 0 8px #4EBE59",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono), var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: "0.85rem",
              letterSpacing: "0.28em",
              color: "#4EBE59",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Counter-Drone Ecosystem
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#0F172A",
            lineHeight: 1.15,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          One Threat. Multiple Responses.
        </h2>
      </div>

      {/* Marquee Row 1: AI-CEPTOR Family */}
      <div style={{ marginBottom: "2.8rem", position: "relative", zIndex: 2 }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 4rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono), var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: "0.85rem",
              letterSpacing: "0.24em",
              color: "rgba(15, 23, 42, 0.55)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            AI-CEPTOR Family
          </span>
        </div>

        {/* Dark Marquee Strip on White Section */}
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            maskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            boxShadow: "0 14px 35px rgba(0, 0, 0, 0.14)",
          }}
        >
          <div className="grid-marquee-track-left">
            {family3.map((item, index) => (
              <div key={index} className="olyyx-dark-strip-cell">
                <div
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), var(--font-mono), 'IBM Plex Mono', monospace",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    color: "#FFFFFF",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Row 2: Counter-Drone Ecosystem */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 4rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono), var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: "0.85rem",
              letterSpacing: "0.24em",
              color: "rgba(15, 23, 42, 0.55)",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Counter-Drone Ecosystem
          </span>
        </div>

        {/* Dark Marquee Strip on White Section */}
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            maskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            boxShadow: "0 14px 35px rgba(0, 0, 0, 0.14)",
          }}
        >
          <div className="grid-marquee-track-right">
            {ecosystem3.map((item, index) => (
              <div key={index} className="olyyx-dark-strip-cell">
                <div
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), var(--font-mono), 'IBM Plex Mono', monospace",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    color: "#FFFFFF",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
