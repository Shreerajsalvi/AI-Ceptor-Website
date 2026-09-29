"use client";

import React from "react";

interface SectionLabelProps {
  label: string;
  index?: string;
  style?: React.CSSProperties;
}

export function SectionLabel({ label, index, style }: SectionLabelProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.8rem",
        ...style,
      }}
    >
      {index && (
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}
        >
          {index}
        </span>
      )}
      <div
        style={{
          width: "24px",
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.25)",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.75rem",
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.45)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}
