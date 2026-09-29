"use client";

interface CounterUASMapProps {
  radiusMeters?: number;
}

export function CounterUASMap({ radiusMeters: _radiusMeters = 8000 }: CounterUASMapProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <img
        loading="lazy"
        decoding="async"
        src="/map.png"
        alt="Counter UAS Deployment Map"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />
      {/* Blinking/Pulsing Red Dot (Radar Center) */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "60%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {/* Glow pulse ring 1 */}
        <div
          style={{
            position: "absolute",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 59, 48, 0.55)",
            animation: "pulse 2.2s infinite ease-in-out",
          }}
        />
        {/* Glow pulse ring 2 */}
        <div
          style={{
            position: "absolute",
            width: "92px",
            height: "92px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 59, 48, 0.3)",
            animation: "pulse 2.2s infinite ease-in-out 0.7s",
          }}
        />
        {/* Solid Center Red Dot */}
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: "#FF3B30",
            boxShadow: "0 0 28px 8px #FF3B30, 0 0 12px 3px #FF3B30, inset 0 0 4px #FFFFFF",
          }}
        />
        <style>{`
          @keyframes pulse {
            0% {
              transform: scale(0.15);
              opacity: 0.95;
            }
            100% {
              transform: scale(2.0);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
