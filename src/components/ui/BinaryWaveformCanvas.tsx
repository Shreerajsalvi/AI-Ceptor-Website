"use client";

import React, { useEffect, useRef } from "react";

export function BinaryWaveformCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const fontSize = 11;
    const colWidth = 14;

    interface ColumnData {
      x: number;
      minY: number;
      maxY: number;
      bits: string[];
    }

    let columns: ColumnData[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const numCols = Math.ceil(width / colWidth);
      columns = [];

      for (let i = 0; i < numCols; i++) {
        const x = i * colWidth;
        // Waveform shape math: sum of sine waves + peak variations
        const normX = (x / width) * Math.PI * 4;
        const wave = Math.sin(normX) * 0.25 + Math.sin(normX * 2.3 + 1.2) * 0.15 + Math.cos(normX * 0.7) * 0.2;
        const center = height * 0.5 + Math.sin(normX * 0.5) * (height * 0.08);
        
        // Height of column waveform
        const waveAmplitude = height * 0.35 * (0.4 + Math.abs(wave));
        const minY = Math.max(10, center - waveAmplitude / 2);
        const maxY = Math.min(height - 10, center + waveAmplitude / 2);

        const totalRows = Math.max(1, Math.floor((maxY - minY) / fontSize));
        const bits: string[] = [];
        for (let r = 0; r < totalRows; r++) {
          bits.push(Math.random() > 0.5 ? "1" : "0");
        }

        columns.push({ x, minY, maxY, bits });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let lastFlipTime = 0;

    const render = (time: number) => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Periodically flip random bits (every ~90ms)
      if (time - lastFlipTime > 90) {
        lastFlipTime = time;
        columns.forEach((col) => {
          for (let r = 0; r < col.bits.length; r++) {
            if (Math.random() < 0.12) {
              col.bits[r] = Math.random() > 0.5 ? "1" : "0";
            }
          }
        });
      }

      ctx.font = `600 ${fontSize}px var(--font-mono), monospace`;

      // Render columns
      columns.forEach((col) => {
        const numRows = col.bits.length;
        if (numRows === 0) return;

        for (let r = 0; r < numRows; r++) {
          const y = col.minY + r * fontSize;
          const char = col.bits[r];

          // Calculate distance from center for smooth fade out at edges
          const midY = (col.minY + col.maxY) / 2;
          const distFromCenter = Math.abs(y - midY) / ((col.maxY - col.minY) / 2 || 1);
          const alpha = Math.max(0.08, (1 - Math.pow(distFromCenter, 1.8)) * 0.45);

          // Glowing green color matching brand #4EBE59
          ctx.fillStyle = `rgba(78, 190, 89, ${alpha.toFixed(2)})`;
          ctx.fillText(char, col.x, y);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.85,
      }}
    />
  );
}
