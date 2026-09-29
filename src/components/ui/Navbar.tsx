"use client";

import React, { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";

interface NavbarProps {
  activeSection?: string;
}

export function Navbar({ activeSection = "technology" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "1.5rem",
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <motion.nav
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, rgba(8, 10, 15, 0.95) 0%, rgba(4, 5, 8, 0.98) 100%)",
          border: scrolled ? "1px solid rgba(255, 255, 255, 0.22)" : "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "9999px",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          width: "calc(100% - 5rem)",
          maxWidth: "1360px",
          padding: scrolled ? "0.65rem 2.8rem" : "0.9rem 3.4rem",
          boxShadow: scrolled
            ? "0 20px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
            : "0 15px 35px rgba(0, 0, 0, 0.65), 0 0 15px rgba(255, 255, 255, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          transition: "padding 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        {/* Left Side: Logo & Divider */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Logo */}
          <a href="#technology" style={{ display: "flex", alignItems: "center", textDecoration: "none", cursor: "pointer" }}>
            <img
              src="/AI CEPTOR/AI CEPTOR WHITE  PNG.png"
              alt="AI-CEPTOR"
              style={{
                height: "52px",
                width: "auto",
                display: "block",
                objectFit: "contain",
                transition: "height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </a>

          {/* Vertical Divider with Center Green Dot */}
          <div style={{ display: "flex", alignItems: "center", height: "26px", marginLeft: "2.4rem", marginRight: "2.4rem" }}>
            <div style={{ position: "relative", width: "1px", height: "100%", backgroundColor: "rgba(255, 255, 255, 0.15)" }}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#4EBE59",
                  borderRadius: "50%",
                  boxShadow: "0 0 8px #4EBE59, 0 0 16px #4EBE59",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Nav Links */}
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            alignItems: "center",
            margin: 0,
            padding: 0,
            gap: 0,
          }}
        >
          {["Technology", "Engineering", "Applications", "Deployment", "Ecosystem", "Contact"].map((label, index) => {
            const id = label.toLowerCase();
            const isActive = activeSection === id;

            return (
              <Fragment key={label}>
                {index > 0 && (
                  <span
                    style={{
                      color: "#4EBE59",
                      fontSize: "0.55rem",
                      margin: "0 1.25rem",
                      display: "inline-block",
                      opacity: 0.85,
                      textShadow: "0 0 4px rgba(78, 190, 89, 0.6)",
                    }}
                  >
                    •
                  </span>
                )}
                <li>
                  <a
                    href={`#${id}`}
                    style={{
                      fontFamily: "var(--font-ibm-plex-mono), var(--font-mono), 'IBM Plex Mono', monospace",
                      fontSize: "0.82rem",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#4EBE59" : "#CBD5E1",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      letterSpacing: "0.13em",
                      transition: "color 0.3s ease",
                      display: "inline-block",
                      padding: "0.4rem 0.2rem",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLAnchorElement).style.color = "#CBD5E1";
                      }
                    }}
                  >
                    <span className="magnetic-inner" style={{ display: "inline-block" }}>
                      {label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: "absolute",
                          bottom: "-4px",
                          left: 0,
                          right: 0,
                          height: "2px",
                          backgroundColor: "#4EBE59",
                          boxShadow: "0 0 8px #4EBE59, 0 0 16px #4EBE59",
                          borderRadius: "1px",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              </Fragment>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
}
