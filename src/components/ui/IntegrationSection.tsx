"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

interface DomainItem {
  id: string;
  code: string;
  name: string;
  tagline: string;
  eyebrowLabel: string;
  heading: React.ReactNode;
  description: React.ReactNode;
  body: React.ReactNode;
  stats?: { title: string; subtitle: string }[];
  metadata?: { label: string; value: string }[];
  visual: React.ReactNode;
}

function LandVisual() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#050709" }}>
      <img
        loading="lazy"
        decoding="async"
        src="/Canister.jpg"
        alt="Land Deployment Canister"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          opacity: 0.9,
          filter: "contrast(1.05) brightness(0.95)",
        }}
      />
    </div>
  );
}

function VehicleVisual() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#050709" }}>
      <img
        loading="lazy"
        decoding="async"
        src="/maritime_integration.jpg"
        alt="Vehicle Deployment"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          opacity: 0.9,
          filter: "contrast(1.05) brightness(0.95)",
        }}
      />
      {/* Subtle dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, rgba(3,5,8,0.3) 0%, rgba(3,5,8,0.1) 50%, rgba(3,5,8,0.5) 100%)",
        }}
      />
      {/* HUD overlay labels */}
      <svg
        viewBox="0 0 560 360"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <polyline points="12,12 12,28 28,28" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
        <polyline points="548,12 532,12 532,28" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
        <polyline points="12,348 12,332 28,332" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
        <polyline points="548,348 532,348 532,332" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
      </svg>
    </div>
  );
}

function CoastalVisual() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#050709" }}>
      <img
        loading="lazy"
        decoding="async"
        src="/networkdefence.png"
        alt="Coastal Deployment"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          opacity: 0.9,
          filter: "contrast(1.05) brightness(0.95)",
        }}
      />
      {/* Subtle dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, rgba(3,5,8,0.3) 0%, rgba(3,5,8,0.1) 50%, rgba(3,5,8,0.5) 100%)",
        }}
      />
      {/* HUD overlay labels */}
      <svg
        viewBox="0 0 560 360"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <polyline points="12,12 12,28 28,28" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
        <polyline points="548,12 532,12 532,28" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
        <polyline points="12,348 12,332 28,332" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
        <polyline points="548,348 532,348 532,332" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
      </svg>
    </div>
  );
}

function WarshipVisual() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "480px", overflow: "hidden" }}>
      {/* Background image */}
      <img
        loading="lazy"
        decoding="async"
        src="/networkdefence.png"
        alt="Warship Deployment"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      {/* Subtle dark overlay to blend with the section's dark theme */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, rgba(3,5,8,0.35) 0%, rgba(3,5,8,0.15) 50%, rgba(3,5,8,0.55) 100%)",
        }}
      />
      {/* Corner marks & HUD labels */}
      <svg
        viewBox="0 0 560 360"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <polyline points="12,12 12,28 28,28" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
        <polyline points="548,12 532,12 532,28" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
        <polyline points="12,348 12,332 28,332" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
        <polyline points="548,348 532,348 532,332" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
      </svg>
    </div>
  );
}

export function IntegrationSection() {
  const [activeTab, setActiveTab] = useState("land");

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const ids = ["land", "vehicle", "coastal", "warship"];
        const currentIndex = ids.indexOf(prev);
        const nextIndex = (currentIndex + 1) % ids.length;
        return ids[nextIndex];
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [activeTab]);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
  const headerOp = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const G = "#4EBE59";
  const domains: DomainItem[] = [
    {
      id: "land",
      code: "DOM-01",
      name: "LAND DEPLOYMENT",
      tagline: "Fixed / Distributed",
      eyebrowLabel: "LAND DEPLOYMENT",
      heading: (<>GROUND-BASED<br /><span style={{ color: G }}>COUNTER-DRONE DEFENCE.</span></>),
      description: (
        <p>AI-CEPTOR enables rapid ground-based interception of hostile drones and UAV threats across borders, military bases, forward locations and critical infrastructure.</p>
      ),
      body: (
        <p>The AI-enabled <em style={{ fontStyle: "italic", fontWeight: 500, color: G }}>interceptor</em> can operate through <em style={{ fontStyle: "italic", fontWeight: 500, color: G }}>standalone, tripod or multi-pod</em> launcher configurations with <em style={{ fontStyle: "italic", fontWeight: 500, color: G }}>autonomous, semi-autonomous or manual</em> deployment to ensure mission success in any environment.</p>
      ),
      stats: [

      ],
      metadata: [

      ],
      visual: <LandVisual />,
    },
    {
      id: "vehicle",
      code: "DOM-02",
      name: "VEHICLE DEPLOYMENT",
      tagline: "Expeditionary / Mobile",
      eyebrowLabel: "VEHICLE DEPLOYMENT",
      heading: (<>MOBILE DEFENCE.<br /><span style={{ color: G }}>DOMINANT ADVANTAGE.</span></>),
      description: (
        <p>Engineered for mobile counter-drone defence, the interceptor system can be <em style={{ fontStyle: "italic", fontWeight: 500, color: G }}>custom-mounted</em> on military tanks, armoured vehicles and tactical ground platforms to deliver reliable protection on the move.</p>
      ),
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <p>The modular multi-pod architecture supports fully configurable setups with <em style={{ fontStyle: "italic", fontWeight: 500, color: G }}>5, 10, 15 or more</em> interceptors as per mission needs, enabling scalable coverage for moving formations, forward operating bases and critical defence assets.</p>
          <p>Built for speed, flexibility and survivability – <em style={{ fontStyle: "italic", fontWeight: 500, color: G }}>deploy, engage and dominate</em> any aerial threat, anywhere.</p>
        </div>
      ),
      stats: [

      ],
      metadata: [
      ],
      visual: <VehicleVisual />,
    },
    {
      id: "coastal",
      code: "DOM-03",
      name: "COASTAL DEPLOYMENT",
      tagline: "Offshore / Coastal",
      eyebrowLabel: "COASTAL DEPLOYMENT",
      heading: (<>INTERCEPT AT SEA.<br /><span style={{ color: G }}>PROTECT THE SHORE.</span></>),
      description: (
        <p>Optimized for integration with offshore platforms, coastal defence networks, and naval vessels. Features salt-fog corrosion resistance and advanced launch mechanics designed for severe marine environments.</p>
      ),
      body: (
        <p>The <em style={{ fontStyle: "italic", fontWeight: 500, color: G }}>maritime interceptor</em> deploys via <em style={{ fontStyle: "italic", fontWeight: 500, color: G }}>vertical silo or deck container</em> systems with <em style={{ fontStyle: "italic", fontWeight: 500, color: G }}>SAT-COMM datalink</em> connectivity and <em style={{ fontStyle: "italic", fontWeight: 500, color: G }}>autonomous engagement</em> protocols for persistent coastal surveillance.</p>
      ),
      stats: [
      ],
      metadata: [
      ],
      visual: <CoastalVisual />,
    },
    {
      id: "warship",
      code: "DOM-04",
      name: "AIRBORNE DEPLOYMENT",
      tagline: "Air-to-Air / Autonomous",
      eyebrowLabel: "AIRBORNE DEPLOYMENT",
      heading: (<>TAKE INTERCEPTION <span style={{ color: G }}>HIGHER.</span><br />ENGAGE <span style={{ color: G }}>AIR-TO-AIR.</span></>),
      description: (
        <p>AI-CEPTOR integrates with unmanned aerial platforms for rapid air-to-air counter-UAS missions.</p>
      ),
      body: (
        <p>Multi-interceptor configurations support autonomous, semi-autonomous and command-directed engagement.</p>
      ),
      stats: [
      ],
      metadata: [
      ],
      visual: <WarshipVisual />,
    },
  ];

  const activeDomain = domains.find((d) => d.id === activeTab) || domains[0];

  return (
    <section
      id="deployment"
      ref={sectionRef}
      style={{
        width: "100%",
        backgroundColor: "#050709",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Top Header + Tab Options Header with background2.jpeg ── */}
      <div
        style={{
          position: "relative",
          backgroundImage: "url('/background2.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Light subtle overlay for contrast while keeping background bright */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(5,7,11,0.25) 0%, rgba(5,7,11,0.4) 100%)",
            zIndex: 1,
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Top line */}
          <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(255,255,255,0.04)" }} />

          {/* Header block */}
          <motion.div style={{ opacity: headerOp, y: headerY }}>
            <div style={{ padding: "1.2rem 3rem 1.8rem", maxWidth: "1280px", margin: "0 auto" }}>
              {/* Eyebrow */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "2.5rem" }}>
                <div style={{ width: "32px", height: "1px", background: "#FFFFFF" }} />
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.28em",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                }}>DEPLOYMENT</span>
              </div>

              {/* Split title */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "3rem" }}>
                {/* Left side: Heading + subtext */}
                <div>
                  <h2 style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "clamp(3rem, 6vw, 6.5rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.9,
                    color: "#FFFFFF",
                  }}>
                    DEPLOYED,<br />
                    <span style={{ color: "rgba(242,242,242,0.4)" }}>ANYWHERE.</span>
                  </h2>

                  {/* Separator line */}
                  <div style={{ margin: "1.8rem 0 1.2rem", maxWidth: "260px", height: "1px", backgroundColor: "rgba(255,255,255,0.15)" }} />


                </div>

                {/* Right side: Three paragraphs */}
                <div style={{ maxWidth: "480px", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  <p style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 300,
                    lineHeight: 1.85,
                    color: "#ffffffff",
                  }}>
                    The AI-CEPTOR counter drone interceptor system can be deployed in various scenarios for defence: <em style={{ fontStyle: "italic", fontWeight: 500, color: "#4EBE59" }}>land defence</em>, <em style={{ fontStyle: "italic", fontWeight: 500, color: "#4EBE59" }}>coastal defence</em>, <em style={{ fontStyle: "italic", fontWeight: 500, color: "#4EBE59" }}>border defence</em> and <em style={{ fontStyle: "italic", fontWeight: 500, color: "#4EBE59" }}>offshore defence</em>.
                  </p>
                  <p style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 300,
                    lineHeight: 1.85,
                    color: "#ffffffff",
                  }}>
                    It can be launched using <em style={{ fontStyle: "italic", fontWeight: 500, color: "#4EBE59" }}>single pod tripod launchers, multi-pod launching systems, warship launching systems</em>, or deployed from <em style={{ fontStyle: "italic", fontWeight: 500, color: "#4EBE59" }}>unmanned aerial flight platforms</em>.
                  </p>
                  <p style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 300,
                    lineHeight: 1.85,
                    color: "#ffffffff",
                  }}>
                    The system supports <em style={{ fontStyle: "italic", fontWeight: 500, color: "#4EBE59" }}>autonomous</em>, <em style={{ fontStyle: "italic", fontWeight: 500, color: "#4EBE59" }}>manual</em> and <em style={{ fontStyle: "italic", fontWeight: 500, color: "#4EBE59" }}>semi-autonomous</em> launch modes to ensure mission flexibility and operational effectiveness in any environment.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tab row (Land Deployment -> Warship Deployment) */}
          <div style={{ padding: "0 3rem", maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{
              display: "flex",
              gap: "0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              overflowX: "auto",
              scrollbarWidth: "none",
              marginBottom: "0",
            }}>
              {domains.map((domain) => {
                const isActive = domain.id === activeTab;
                return (
                  <button
                    key={domain.id}
                    onClick={() => setActiveTab(domain.id)}
                    style={{
                      position: "relative",
                      background: "none",
                      border: "none",
                      borderRight: "1px solid rgba(255,255,255,0.04)",
                      padding: "1.4rem 2rem",
                      cursor: "pointer",
                      flexShrink: 0,
                      textAlign: "left",
                      transition: "background 0.3s ease",
                      backgroundColor: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                    }}
                  >
                    <div style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontSize: "1rem",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      color: isActive ? "#F2F2F2" : "#5A5A5A",
                      transition: "color 0.3s",
                    }}>
                      {domain.name}
                    </div>

                    {/* Active bottom border loading line */}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-1px",
                          left: "2rem",
                          right: "2rem",
                          height: "2px",
                          backgroundColor: "rgba(255,255,255,0.1)",
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          key={activeTab}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 5, ease: "linear" }}
                          style={{
                            height: "100%",
                            backgroundColor: "#4EBE59",
                          }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Area Sub-Section (Clean without background2 image) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDomain.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1fr) minmax(min(100%, 400px), 440px)",
            minHeight: "560px",
          }}
        >
          {/* LEFT: Full-height visual panel */}
          <div style={{
            position: "relative",
            backgroundColor: "rgba(10, 17, 27, 0.4)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            overflow: "hidden",
          }}>
            <div style={{ width: "100%", height: "100%", minHeight: "480px" }}>
              {activeDomain.visual}
            </div>

            {/* Status bar overlay at bottom of visual */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "1.2rem 1.8rem",
              background: "linear-gradient(to top, rgba(3,5,8,0.95) 0%, rgba(3,5,8,0.4) 60%, transparent 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "#F2F2F2",
                  marginBottom: "0.2rem",
                }}>{activeDomain.name}</div>

              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "#4EBE59",
                  boxShadow: "0 0 6px #4EBE59",
                  animation: "pulse-slow 2s infinite",
                }} />
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.45rem",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.3)",
                }}>FEED_LIVE</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Heading + body + stats panel */}
          <motion.div
            key={`meta-${activeDomain.id}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              padding: "3.5rem 3rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#050709",
            }}
          >
            <div>
              {/* Eyebrow: line + domain label */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "24px", height: "2px", backgroundColor: "#4EBE59" }} />
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.22em",
                  color: "#4EBE59",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}>{activeDomain.eyebrowLabel}</span>
              </div>

              {/* Big heading */}
              <h3 style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "#FFFFFF",
                marginBottom: "2rem",
              }}>{activeDomain.heading}</h3>

              {/* Chevron separator */}
              <div style={{ marginBottom: "1.8rem", color: "rgba(255,255,255,0.2)", fontSize: "1.2rem" }}>&#8964;</div>

              {/* Description paragraph */}
              <div style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.95rem",
                fontWeight: 300,
                lineHeight: 1.85,
                color: "#FFFFFF",
                marginBottom: "1.4rem",
              }}>{activeDomain.description}</div>

              {/* Body paragraph with green keywords */}
              <div style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.95rem",
                fontWeight: 300,
                lineHeight: 1.85,
                color: "#FFFFFF",
              }}>{activeDomain.body}</div>
            </div>

            {/* Bottom stats row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              marginTop: "2.5rem",
              paddingTop: "1.2rem",
            }}>
              {(activeDomain.stats || []).map((stat, i) => (
                <div key={i} style={{
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  paddingLeft: i > 0 ? "1rem" : "0",
                  paddingRight: "1rem",
                }}>
                  <div style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    marginBottom: "0.2rem",
                  }}>{stat.title}</div>
                  <div style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                  }}>{stat.subtitle}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
