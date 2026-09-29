"use client";

import { useState, useEffect } from "react";
import { DatasheetModal } from "./DatasheetModal";

interface FooterProps {
  onCookiePolicyClick?: () => void;
}

export function Footer({ onCookiePolicyClick }: FooterProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState("");
  const [isDatasheetOpen, setIsDatasheetOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        };
        setTimeStr(new Intl.DateTimeFormat("en-IN", options).format(new Date()));
      } catch {
        setTimeStr(new Date().toTimeString().split(" ")[0]);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Required fields missing.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMsg("Invalid email address.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message.");
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send message.";
      setErrorMsg(message);
      setStatus("idle");
    }
  };



  return (
    <>
      <style>{`
        @keyframes sparkSlide {
          0%   { transform: translateX(-100%) scaleX(0.5); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(900%) scaleX(0.5); opacity: 0; }
        }
        @keyframes scanLine {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.04; }
          90% { opacity: 0.04; }
          100% { transform: translateY(400%); opacity: 0; }
        }

        .ft-grid-container {
          display: grid;
          grid-template-columns: 1.15fr auto 0.85fr auto 1fr;
          gap: 2rem;
          align-items: stretch;
        }

        .ft-field-wrap {
          position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          transition: border-color 0.25s ease;
          margin-bottom: 1rem;
        }
        .ft-field-wrap.focused { border-color: rgba(255,255,255,0.5); }
        .ft-field-wrap::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0%;
          height: 1px;
          background: #F1F5F9;
          transition: width 0.35s ease;
        }
        .ft-field-wrap.focused::after { width: 100%; }

        .ft-input, .ft-textarea {
          width: 100%;
          background: transparent;
          border: none;
          padding: 0.8rem 0;
          color: #FFFFFF;
          font-family: var(--font-inter), sans-serif;
          font-size: 0.84rem;
          outline: none;
          caret-color: #FFFFFF;
          box-sizing: border-box;
        }
        .ft-input::placeholder, .ft-textarea::placeholder {
          color: #FFFFFF;
          font-size: 0.82rem;
        }
        .ft-textarea { height: 70px; resize: none; }
        .ft-input:focus, .ft-input:focus-visible,
        .ft-textarea:focus, .ft-textarea:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }

        .ft-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          align-self: flex-start;
          background: #F1F5F9;
          color: #0F172A;
          border: none;
          border-radius: 9999px;
          padding: 0.9rem 2.2rem;
          font-family: var(--font-mono), monospace;
          font-size: 0.52rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.22s ease, transform 0.18s ease, box-shadow 0.22s ease;
          box-shadow: 0 2px 0 rgba(0,0,0,0.3);
        }
        .ft-btn:hover:not(:disabled) {
          background: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .ft-btn:active:not(:disabled) { transform: translateY(0px); }
        .ft-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .ft-legal-link {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-family: var(--font-inter), sans-serif;
          font-size: 0.72rem;
          transition: color 0.2s ease;
        }
        .ft-legal-link:hover {
          color: #FFFFFF;
        }

        @media (max-width: 1024px) {
          .ft-grid-container {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
          .ft-vertical-separator {
            display: none !important;
          }
          .ft-contact-strip {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.2rem !important;
          }
          .ft-contact-separator {
            display: none !important;
          }
          .ft-sub-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>

      <footer
        id="contact"
        style={{
          width: "100%",
          backgroundColor: "#05070B",
          backgroundImage: "url('/background3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "local",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Background image dark overlay ── */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(3,5,8,0.5) 0%, rgba(3,5,8,0.7) 60%, rgba(3,5,8,0.92) 100%)",
          zIndex: 0,
          pointerEvents: "none",
        }} />

        {/* ── Top border spark rail ── */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "1px",
          backgroundColor: "rgba(255,255,255,0.06)",
          overflow: "hidden", zIndex: 2,
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: "14%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(148,163,184,0.4) 35%, #FFFFFF 50%, rgba(148,163,184,0.4) 65%, transparent)",
            animation: "sparkSlide 6s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: "7%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(148,163,184,0.25), transparent)",
            animation: "sparkSlide 6s ease-in-out infinite",
            animationDelay: "3s",
          }} />
        </div>

        {/* ── Dot grid decorative background ── */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 1,
          pointerEvents: "none",
        }} />

        {/* ── Main Content ── */}
        <div style={{
          position: "relative", zIndex: 3,
          maxWidth: "1280px", margin: "0 auto",
          padding: "5rem 3rem 0",
        }}>

          {/* ── Grid Container ── */}
          <div className="ft-grid-container">

            {/* COLUMN 1: LET'S CONNECT FORM */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", height: "100%" }}>
              {/* Secure Transmission badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "18px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.4))" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}>
                  SECURE TRANSMISSION
                </span>
              </div>

              {/* Heading */}
              <h2 style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "2.1rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
                margin: 0,
                lineHeight: 1.1,
              }}>
                Let&apos;s Connect.
              </h2>

              {/* Form / Success Screen */}
              {status === "success" ? (
                <div style={{
                  display: "flex", flexDirection: "column", gap: "1rem",
                  padding: "2rem",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  flex: 1,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "0.72rem", letterSpacing: "0.14em",
                      color: "#FFFFFF", fontWeight: 700, textTransform: "uppercase",
                    }}>Message Dispatched</span>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0,
                  }}>
                    Your inquiry has been logged. Our coordinator will reply via secure channel within 12 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    style={{
                      alignSelf: "flex-start", background: "none", border: "none",
                      color: "#FFFFFF", fontFamily: "var(--font-mono), monospace",
                      fontSize: "0.68rem", letterSpacing: "0.14em", cursor: "pointer",
                      padding: 0, textDecoration: "underline", fontWeight: 700,
                      textTransform: "uppercase",
                      marginTop: "auto",
                      paddingTop: "1rem",
                    }}
                  >New Transmission →</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem", flex: 1 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {(["name", "email"] as const).map((field) => (
                      <div key={field} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.74rem", color: "#FFFFFF", fontWeight: 500 }}>
                          {field === "name" ? "Full Name" : "Email Address"} <span style={{ color: "#EF4444" }}>*</span>
                        </label>
                        <div
                          className={`ft-field-wrap${focusedField === field ? " focused" : ""}`}
                        >
                          <input
                            type={field === "email" ? "email" : "text"}
                            placeholder={field === "name" ? "Enter your full name" : "Enter your email address"}
                            value={formData[field]}
                            onFocus={() => setFocusedField(field)}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            disabled={status === "sending"}
                            className="ft-input"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <label style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.74rem", color: "#FFFFFF", fontWeight: 500 }}>
                      Message <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <div className={`ft-field-wrap${focusedField === "message" ? " focused" : ""}`}>
                      <textarea
                        placeholder="Enter your message…"
                        value={formData.message}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        disabled={status === "sending"}
                        className="ft-textarea"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <p style={{ color: "#EF4444", fontSize: "0.75rem", margin: 0, fontFamily: "var(--font-mono), monospace" }}>{errorMsg}</p>
                  )}

                  {/* Button + Encryption tag */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "auto", paddingTop: "1.2rem" }}>
                    <button type="submit" disabled={status === "sending"} className="ft-btn">
                      {status === "sending" ? "Transmitting…" : "Send Message"}
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#FFFFFF" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "0.44rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}>
                        ENCRYPTED & SECURE
                      </span>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* SEPARATOR 1 */}
            <div className="ft-vertical-separator" style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", width: "10px" }}>
              <div style={{ width: "1px", height: "100%", backgroundColor: "rgba(255,255,255,0.08)" }} />
              <div style={{
                width: "6px",
                height: "6px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(45deg)",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 0 4px #FFFFFF",
              }} />
            </div>

            {/* COLUMN 2: CENTER BRANDING AND SLOGAN */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", height: "100%", textAlign: "center" }}>
              {/* Spacer aligning logo height with Let's Connect */}
              <div style={{ height: "18px" }} />

              {/* AI-CEPTOR Stylized Logo */}
              <img
                loading="lazy"
                decoding="async"
                src="/AI CEPTOR/AI CEPTOR WHITE  PNG.png"
                alt="AI-CEPTOR"
                style={{ height: "95px", width: "auto", display: "block", objectFit: "contain" }}
              />

              {/* Subheading badge positioned close to the logo */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#FFFFFF", marginTop: "-0.4rem" }}>
                <div style={{ width: "16px", height: "1px", backgroundColor: "#FFFFFF" }} />
                <span style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}>
                  AI-ENABLED INTERCEPTOR
                </span>
                <div style={{ width: "16px", height: "1px", backgroundColor: "#FFFFFF" }} />
              </div>

              {/* Slogan elements wrapper pushed lower in the column */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.1rem", marginTop: "auto", marginBottom: "0.2rem" }}>
                {/* Top HUD widget divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#FFFFFF" }}>
                  <div style={{ width: "10px", height: "1px", backgroundColor: "rgba(255,255,255,0.3)" }} />
                  <div style={{ width: "24px", height: "2px", backgroundColor: "#FFFFFF" }} />
                  <div style={{ width: "10px", height: "1px", backgroundColor: "rgba(255,255,255,0.3)" }} />
                </div>

                {/* Slogan */}
                <p style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.89rem",
                  letterSpacing: "0.15em",
                  color: "#FFFFFF",
                  margin: 0,
                  fontWeight: 500,
                }}>
                  DETECT. DECIDE. NEUTRALIZE.
                </p>

                {/* Bottom HUD widget divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#FFFFFF" }}>
                  <div style={{ width: "10px", height: "1px", backgroundColor: "rgba(255,255,255,0.3)" }} />
                  <div style={{ width: "24px", height: "2px", backgroundColor: "#FFFFFF" }} />
                  <div style={{ width: "10px", height: "1px", backgroundColor: "rgba(255,255,255,0.3)" }} />
                </div>
              </div>

              {/* View Datasheet Button Container */}
              <div style={{ marginTop: "auto", paddingTop: "1.2rem" }}>
                <button
                  type="button"
                  onClick={() => setIsDatasheetOpen(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.6rem 1.4rem",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "9999px",
                    background: "rgba(255,255,255,0.03)",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#FFFFFF";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.color = "#000000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.background = "#E2E8F0";
                    e.currentTarget.style.color = "#000000";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.background = "#FFFFFF";
                    e.currentTarget.style.color = "#000000";
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  View Data Sheet
                </button>
              </div>
            </div>

            {/* SEPARATOR 2 */}
            <div className="ft-vertical-separator" style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", width: "10px" }}>
              <div style={{ width: "1px", height: "100%", backgroundColor: "rgba(255,255,255,0.08)" }} />
              <div style={{
                width: "6px",
                height: "6px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(45deg)",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 0 4px #FFFFFF",
              }} />
            </div>

            {/* COLUMN 3: CORPORATE LOGOS & NATIONAL BADGES */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", height: "100%", position: "relative" }}>
              {/* Spacer aligning logo height with Let's Connect */}
              <div style={{ height: "18px" }} />

              <div style={{ position: "relative", display: "inline-block" }}>
                {/* Product By Aeromac overlapping label */}
                <div style={{
                  position: "absolute",
                  top: "-22px",
                  left: "18px",
                  zIndex: 5,
                  pointerEvents: "none",
                }}>
                  <span style={{
                    fontFamily: "var(--font-ibm-plex-mono), var(--font-mono), 'IBM Plex Mono', monospace",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    lineHeight: 1,
                    textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 0 12px rgba(255,255,255,0.4)",
                  }}>
                    A PRODUCT BY
                  </span>
                </div>

                <img
                loading="lazy"
                decoding="async"
                  src="/AD-Horizontal-white.png"
                  alt="Aeromac Dynamics"
                  style={{ height: "240px", width: "auto", display: "block", objectFit: "contain", position: "relative", zIndex: 2, marginTop: "-72.5px" }}
                />
              </div>

              {/* Separator line with diamond */}
              <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: "240px", marginTop: "-53px" }}>
                <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.12)" }} />
                <div style={{
                  width: "5px",
                  height: "5px",
                  transform: "rotate(45deg)",
                  backgroundColor: "#FFFFFF",
                  margin: "0 0.5rem",
                  boxShadow: "0 0 4px #FFFFFF",
                }} />
                <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.12)" }} />
              </div>

              {/* Make in India silhouette */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", paddingTop: "0.4rem", marginTop: "-23px" }}>
                <img
                loading="lazy"
                decoding="async"
                  src="/makeinindia.png"
                  alt="Make in India"
                  style={{ height: "170px", width: "auto", objectFit: "contain" }}
                />

                {/* Tricolor bars representing Indian Flag */}
                <div style={{ display: "flex", gap: "4px", width: "80px", height: "4px", marginTop: "0.4rem" }}>
                  <div style={{ flex: 1, backgroundColor: "#FF9933", borderRadius: "1px" }} />
                  <div style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: "1px" }} />
                  <div style={{ flex: 1, backgroundColor: "#138808", borderRadius: "1px" }} />
                </div>
              </div>
            </div>

          </div>

          {/* Divider line before contact strip */}
          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)", marginTop: "4rem" }} />

          {/* ── CONTACT STRIP ── */}
          <div className="ft-contact-strip" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "1.4rem 0",
            flexWrap: "wrap",
            gap: "1.2rem",
          }}>
            {/* Phone */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.78rem",
                color: "#FFFFFF",
                letterSpacing: "0.05em",
              }}>
                +91 86551 01564
              </span>
            </div>

            <div className="ft-contact-separator" style={{ width: "1px", height: "18px", backgroundColor: "rgba(255,255,255,0.15)" }} />

            {/* Email */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.78rem",
                color: "#FFFFFF",
                letterSpacing: "0.05em",
              }}>
                info@aeromacdynamics.com
              </span>
            </div>

            <div className="ft-contact-separator" style={{ width: "1px", height: "18px", backgroundColor: "rgba(255,255,255,0.15)" }} />

            {/* Website */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.78rem",
                color: "#FFFFFF",
                letterSpacing: "0.05em",
              }}>
                www.aeromacdynamics.com
              </span>
            </div>

            <div className="ft-contact-separator" style={{ width: "1px", height: "18px", backgroundColor: "rgba(255,255,255,0.15)" }} />

            {/* Location */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.78rem",
                color: "#FFFFFF",
                letterSpacing: "0.05em",
              }}>
                Navi Mumbai, MH, India
              </span>
            </div>

            <div className="ft-contact-separator" style={{ width: "1px", height: "18px", backgroundColor: "rgba(255,255,255,0.15)" }} />

            {/* Made In India Flag */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <div style={{
                  width: "18px",
                  height: "12px",
                  borderRadius: "1px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <div style={{ flex: 1, backgroundColor: "#FF9933" }} />
                  <div style={{ flex: 1, backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "3px", height: "3px", borderRadius: "50%", border: "0.5px solid #000080" }} />
                  </div>
                  <div style={{ flex: 1, backgroundColor: "#138808" }} />
                </div>
              </div>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.78rem",
                color: "#FFFFFF",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}>
                MADE IN INDIA
              </span>
            </div>

          </div>

          {/* Divider line before bottom bar */}
          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />

          {/* ── SUB-FOOTER ── */}
          <div className="ft-sub-footer" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "1.4rem 0 2rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}>
            {/* Left: Brand name + Copyright */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
              {/* Replacing AI-CEPTOR Text with Logo */}
              <img
                loading="lazy"
                decoding="async"
                src="/AI CEPTOR/AI CEPTOR WHITE  PNG.png"
                alt="AI-CEPTOR"
                style={{
                  height: "22px",
                  width: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />
              <div style={{ width: "1px", height: "14px", backgroundColor: "rgba(255,255,255,0.15)" }} />
              <span style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.6)",
              }}>
                © 2026 Aeromac Dynamics Pvt. Ltd. All rights reserved.
              </span>
            </div>

            {/* Center: Dynamic Time */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                color: "#FFFFFF",
                fontWeight: 600,
              }}>
                IST {timeStr || "--:--:--"}
              </span>
            </div>

            {/* Right: Policies */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
              {["Legal Notice", "Privacy Policy", "Cookie Policy"].map((l, idx, arr) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (l === "Cookie Policy" && onCookiePolicyClick) {
                        onCookiePolicyClick();
                      }
                    }}
                    className="ft-legal-link"
                    style={{
                      color: "#FFFFFF",
                    }}
                  >
                    {l}
                  </a>
                  {idx < arr.length - 1 && (
                    <div style={{ width: "1px", height: "12px", backgroundColor: "rgba(255,255,255,0.15)" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </footer>

      <DatasheetModal isOpen={isDatasheetOpen} onClose={() => setIsDatasheetOpen(false)} />
    </>
  );
}
