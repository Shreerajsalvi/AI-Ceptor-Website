"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollyCanvas, FRAME_COUNT } from "@/components/canvas/ScrollyCanvas";
import { LoadingScreen } from "@/components/canvas/LoadingScreen";
import { Navbar } from "@/components/ui/Navbar";
import { HeroText } from "@/components/ui/HeroText";
import { ScrollSections } from "@/components/ui/ScrollSections";
import { ParallaxGrid } from "@/components/ui/ParallaxGrid";
import { TelemetryOverlay } from "@/components/ui/TelemetryOverlay";
import { HighlightsStrip } from "@/components/ui/HighlightsStrip";
import { ApplicationsSection } from "@/components/ui/ApplicationsSection";
import { IntegrationSection } from "@/components/ui/IntegrationSection";
import { PartnersMarquee } from "@/components/ui/PartnersMarquee";
import { CapacityHighlightsStrip } from "@/components/ui/CapacityHighlightsStrip";
import { Footer } from "@/components/ui/Footer";
import { CookieConsent } from "@/components/ui/CookieConsent";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);
  const [cookiePopupOpen, setCookiePopupOpen] = useState(false);

  const handleLoadProgress = useCallback((p: number) => {
    setLoadProgress(p);
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
    setTimeout(() => {
      setShowLoading(false);
      setTimeout(() => setHeroVisible(true), 400);
    }, 300);
  }, []);

  useScrollyCanvas({
    canvasRef,
    spacerRef,
    onLoadProgress: handleLoadProgress,
    onLoaded: handleLoaded,
  });

  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end end"],
  });

  const canvasOpacity = useTransform(scrollYProgress, [0.94, 1.0], [1, 0.3]);
  const telemetryOpacity = useTransform(scrollYProgress, [0.93, 0.98], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0.93, 0.98], [1, 0]);
  const vignetteOpacity = useTransform(scrollYProgress, [0.93, 0.98], [1, 0]);
  const blueBlendOpacity = useTransform(scrollYProgress, [0.75, 0.98], [0, 1]);

  // Lock scroll during preloading
  useEffect(() => {
    document.body.style.overflow = isLoaded ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isLoaded]);

  return (
    <>
      {/* ── Skip Link ── */}
      <a
        href="#main-content"
        style={{
          position: "fixed",
          top: "-100px",
          left: "1.5rem",
          zIndex: 10000,
          background: "#0A111B",
          color: "#FFFFFF",
          padding: "0.8rem 1.5rem",
          border: "1px solid #4EBE59",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "top 0.2s ease",
        }}
        onFocus={(e) => { e.currentTarget.style.top = "1.5rem"; }}
        onBlur={(e)  => { e.currentTarget.style.top = "-100px"; }}
      >
        Skip to Main Content
      </a>

      {/* ── Preloader ── */}
      <LoadingScreen progress={loadProgress} isVisible={showLoading} />

      {/* ── Navbar ── */}
      {heroVisible && <Navbar />}

      {/* ── Main Content ── */}
      <main id="main-content">
        {/* ── Scroll spacer (1400vh scroll height for ultra-smooth 3D animation) ── */}
        <div ref={spacerRef} style={{ position: "relative", height: "1400vh", zIndex: 1 }}>

          {/* Named anchors for nav links positioned at optimal scroll points for best view */}
          <div id="technology"  style={{ position: "absolute", top: "0%", height: "20%", width: "100%" }} />
          <div id="engineering" style={{ position: "absolute", top: "20%", height: "80%", width: "100%" }} />

          {/* ── Sticky container ── */}
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              width: "100vw",
              overflow: "hidden",
            }}
          >
            {/* ── Canvas Layer (3D sequence 1 → 530) ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                opacity: isLoaded ? canvasOpacity : 0,
              }}
            >
              <canvas
                ref={canvasRef}
                id="sequenceCanvas"
                aria-hidden="true"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  background: "#05070B",
                }}
              />
            </motion.div>

            {/* ── Parallax Technical Grid Background ── */}
            {isLoaded && (
              <motion.div style={{ opacity: gridOpacity }}>
                <ParallaxGrid />
              </motion.div>
            )}

            {/* ── Edge vignette ── */}
            <motion.div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                pointerEvents: "none",
                background: `
                  radial-gradient(ellipse 85% 85% at 50% 50%, transparent 70%, rgba(5,7,11,0.85) 100%),
                  linear-gradient(to bottom, rgba(5,7,11,0.3) 0%, transparent 22%, transparent 78%, rgba(5,7,11,0.95) 100%)
                `,
                opacity: vignetteOpacity,
              }}
            />

            {/* ── Side Borders Light Shade ── */}
            <motion.div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 6,
                pointerEvents: "none",
                background: `
                  linear-gradient(to right, rgba(241, 245, 249, 0.15) 0%, rgba(203, 213, 225, 0.05) 18%, rgba(203, 213, 225, 0.01) 30%, transparent 40%, transparent 60%, rgba(203, 213, 225, 0.01) 70%, rgba(203, 213, 225, 0.05) 82%, rgba(241, 245, 249, 0.15) 100%)
                `,
                opacity: vignetteOpacity,
              }}
            />

            {/* ── Telemetry HUD ── */}
            {heroVisible && (
              <motion.div style={{ opacity: telemetryOpacity }}>
                <TelemetryOverlay spacerRef={spacerRef} />
              </motion.div>
            )}

            {/* ── Hero copy ── */}
            <HeroText isVisible={heroVisible} spacerRef={spacerRef} />

            {/* ── Scroll-driven text panels ── */}
            <ScrollSections spacerRef={spacerRef} />

            {/* ── Electric Blue Hero Bottom Blend Effect ── */}
            <motion.div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "38vh",
                zIndex: 6,
                pointerEvents: "none",
                background: `
                  radial-gradient(ellipse 80% 60% at 50% 100%, rgba(78, 190, 89, 0.22) 0%, rgba(78, 190, 89, 0.08) 45%, transparent 75%),
                  linear-gradient(to bottom, transparent 0%, rgba(5, 7, 11, 0.45) 45%, rgba(5, 7, 11, 0.88) 78%, #05070B 100%)
                `,
                opacity: blueBlendOpacity,
              }}
            />
          </div>
        </div>

        {/* ── Below-fold sections ── */}
        <div style={{ position: "relative", zIndex: 30, width: "100%" }}>
          <HighlightsStrip />
          <ApplicationsSection />
          <IntegrationSection />
          <CapacityHighlightsStrip />
          <PartnersMarquee />
          <Footer onCookiePolicyClick={() => setCookiePopupOpen(true)} />
        </div>
      </main>

      {/* ── Cookie Consent ── */}
      <CookieConsent
        externalOpen={cookiePopupOpen}
        onClose={() => setCookiePopupOpen(false)}
      />
    </>
  );
}
