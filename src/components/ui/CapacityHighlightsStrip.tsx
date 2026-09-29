"use client";

import { motion } from "framer-motion";

const highlights = [
  { value: "300+", unit: "UNITS", label: "Monthly Capacity", code: "CAP_MTH" },
  { value: "3", unit: "DOMAINS", label: "Air / Land / Sea", code: "DOM_SYS" },
  { value: "10+", unit: "MODELS", label: "Interceptor Variants", code: "MOD_VAR" },
  { value: "3+", unit: "OPTIONS", label: "Power Sources", code: "PWR_SRC" },
  { value: "5", unit: "SYSTEMS", label: "Detection Technologies", code: "DET_TEC" },
];

export function CapacityHighlightsStrip() {
  return (
    <section
      id="capacity-highlights-strip"
      style={{
        width: "100%",
        position: "relative",
        backgroundImage: "url('/background1.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "4rem 3rem",
        borderTop: "none",
        borderBottom: "none",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
        .capacity-highlights-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
        }
        @media (max-width: 1024px) {
          .capacity-highlights-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 3rem !important;
          }
          .hide-mobile-divider {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .capacity-highlights-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>

      {/* Edge dark gradients matching image 2 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(5,7,11,0.92) 0%, rgba(5,7,11,0.3) 25%, rgba(5,7,11,0.3) 75%, rgba(5,7,11,0.92) 100%)",
          zIndex: 1,
        }}
      />
      <div
        className="capacity-highlights-grid"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {highlights.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", position: "relative", width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                alignItems: "flex-start",
                paddingLeft: i === 0 ? "1rem" : "2.5rem",
                paddingRight: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <span
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "clamp(3.2rem, 5.5vw, 4.8rem)",
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    color: "#D1D5DB",
                    lineHeight: 0.95,
                  }}
                >
                  {item.value}
                </span>
                {item.unit && (
                  <span
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "clamp(1.1rem, 1.8vw, 1.45rem)",
                      fontWeight: 700,
                      color: "#C7CBD1",
                      letterSpacing: "0.05em",
                      marginLeft: "0.4rem",
                      lineHeight: 1,
                    }}
                  >
                    {item.unit}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  color: "#B8BEC7",
                  opacity: 0.78,
                  margin: "0.4rem 0 0 0",
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </p>
            </motion.div>
            {i < highlights.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "15%",
                  bottom: "15%",
                  width: "1px",
                  backgroundColor: "rgba(209, 213, 219, 0.22)",
                }}
                className="hide-mobile-divider"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
