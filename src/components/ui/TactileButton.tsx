"use client";

import React from "react";

interface TactileButtonProps {
  id?: string;
  href?: string;
  variant?: "primary" | "secondary";
  showIcon?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function TactileButton({
  id,
  href,
  variant = "primary",
  showIcon = true,
  children,
  onClick,
}: TactileButtonProps) {
  const isPrimary = variant === "primary";

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.9rem 2rem",
    borderRadius: "9999px",
    fontFamily: "var(--font-mono), monospace",
    fontSize: "0.52rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    transition: "all 0.22s ease",
    ...(isPrimary
      ? {
          backgroundColor: "#FFFFFF",
          color: "#0A0F1A",
          boxShadow: "0 2px 0 rgba(0,0,0,0.12)",
        }
      : {
          backgroundColor: "transparent",
          color: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.2)",
        }),
  };

  const content = (
    <>
      {children}
      {showIcon && (
        <svg
          viewBox="0 0 24 24"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <a id={id} href={href} style={baseStyle}>
        {content}
      </a>
    );
  }

  return (
    <button id={id} style={baseStyle} onClick={onClick}>
      {content}
    </button>
  );
}
