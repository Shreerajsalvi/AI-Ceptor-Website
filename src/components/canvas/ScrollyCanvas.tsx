"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Config ────────────────────────────────────────────────
export const FRAME_COUNT = 397; // 397-frame sequence in /public/frames (1 → 397)

function getFramePath(index: number): string {
  const padded = String(index + 1).padStart(6, "0");
  return `/frames/frame_${padded}.png`;
}

// ─── Object-fit cover draw — crisp high quality ─────────────
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number
) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;
  if (!imgW || !imgH) return;

  const imgAspect = imgW / imgH;
  const canvasAspect = canvasW / canvasH;

  let drawW: number, drawH: number, offsetX: number, offsetY: number;

  if (canvasAspect > imgAspect) {
    // Canvas is wider → fit width, clip top/bottom
    drawW = Math.round(canvasW);
    drawH = Math.round(canvasW / imgAspect);
    offsetX = 0;
    offsetY = Math.round((canvasH - drawH) / 2);
  } else {
    // Canvas is taller → fit height, clip left/right
    drawH = Math.round(canvasH);
    drawW = Math.round(canvasH * imgAspect);
    offsetX = Math.round((canvasW - drawW) / 2);
    offsetY = 0;
  }

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

// Helper to load a single frame image asynchronously
function loadSingleFrame(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    if (img.complete && img.naturalWidth > 0) {
      resolve(img);
      return;
    }
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
  });
}

// ─── Hook Props ────────────────────────────────────────────
interface UseScrollyCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  spacerRef: React.RefObject<HTMLDivElement | null>;
  onLoadProgress: (p: number) => void;
  onLoaded: () => void;
}

export function useScrollyCanvas({
  canvasRef,
  spacerRef,
  onLoadProgress,
  onLoaded,
}: UseScrollyCanvasProps) {
  const framesRef = useRef<HTMLImageElement[]>(new Array(FRAME_COUNT));
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // ── Find nearest loaded frame if target frame is still downloading ─────────
  const getNearestAvailableFrame = useCallback((targetIndex: number): HTMLImageElement | null => {
    const frames = framesRef.current;
    if (frames[targetIndex]?.complete && frames[targetIndex]?.naturalWidth > 0) {
      return frames[targetIndex];
    }
    // Search outwards for nearest cached frame
    for (let offset = 1; offset < FRAME_COUNT; offset++) {
      const left = targetIndex - offset;
      const right = targetIndex + offset;
      if (left >= 0 && frames[left]?.complete && frames[left]?.naturalWidth > 0) {
        return frames[left];
      }
      if (right < FRAME_COUNT && frames[right]?.complete && frames[right]?.naturalWidth > 0) {
        return frames[right];
      }
    }
    return null;
  }, []);

  // ── Draw frame at physical resolution ───────────
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = getNearestAvailableFrame(frameIndex);
    if (!img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCover(ctx, img, canvas.width, canvas.height);
  }, [canvasRef, getNearestAvailableFrame]);

  // ── Resize handler ──
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    drawFrame(currentFrameRef.current);
  }, [canvasRef, drawFrame]);

  // ── RAF render loop ─────────
  const startRenderLoop = useCallback(() => {
    let lastFrame = -1;

    const loop = () => {
      const frame = currentFrameRef.current;
      if (frame !== lastFrame) {
        drawFrame(frame);
        lastFrame = frame;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [drawFrame]);

  // ── Seamless Balanced Keyframe Preloader Engine ─────────
  useEffect(() => {
    let cancelled = false;

    const handleResizeFn = () => handleResize();

    async function initSeamlessStream() {
      const frames = new Array<HTMLImageElement>(FRAME_COUNT);
      framesRef.current = frames;

      // STEP 1: Preload keyframes across entire sequence (every 2nd frame) for 100% smooth coverage
      const keyFrameIndices: number[] = [];
      for (let i = 0; i < FRAME_COUNT; i += 2) {
        keyFrameIndices.push(i);
      }
      if (!keyFrameIndices.includes(FRAME_COUNT - 1)) {
        keyFrameIndices.push(FRAME_COUNT - 1);
      }

      let loadedCount = 0;
      const totalKeyFrames = keyFrameIndices.length;

      // Load keyframes in fast parallel batches of 25 (~1.2s total load time)
      const BATCH_SIZE = 25;
      for (let k = 0; k < totalKeyFrames; k += BATCH_SIZE) {
        if (cancelled) break;
        const chunk = keyFrameIndices.slice(k, k + BATCH_SIZE);
        await Promise.all(
          chunk.map((idx) =>
            loadSingleFrame(getFramePath(idx)).then((img) => {
              if (!cancelled) {
                frames[idx] = img;
                loadedCount++;
                onLoadProgress(loadedCount / totalKeyFrames);
              }
            })
          )
        );
      }

      if (cancelled) return;

      // Reveal site smoothly with full scroll fluency!
      onLoaded();
      handleResize();
      window.addEventListener("resize", handleResizeFn);
      startRenderLoop();
      drawFrame(0);

      // GSAP ScrollTrigger
      if (spacerRef.current) {
        ScrollTrigger.create({
          trigger: spacerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            const frame = Math.round(self.progress * (FRAME_COUNT - 1));
            currentFrameRef.current = Math.min(Math.max(frame, 0), FRAME_COUNT - 1);
          },
        });
      }

      // STEP 2: Fill in remaining intermediate odd frames in background for 1:1 pixel perfection
      const fillIndices: number[] = [];
      for (let i = 1; i < FRAME_COUNT; i += 2) {
        if (!frames[i]) fillIndices.push(i);
      }

      for (let f = 0; f < fillIndices.length; f += BATCH_SIZE) {
        if (cancelled) break;
        const chunk = fillIndices.slice(f, f + BATCH_SIZE);
        await Promise.all(
          chunk.map((idx) =>
            loadSingleFrame(getFramePath(idx)).then((img) => {
              if (!cancelled) {
                frames[idx] = img;
              }
            })
          )
        );
        await new Promise((r) => setTimeout(r, 15));
      }
    }

    initSeamlessStream();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResizeFn);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
