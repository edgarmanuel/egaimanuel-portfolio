"use client";

import { useEffect, useRef } from "react";

export default function BackgroundLayers() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const scrollVideoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rafPendingRef = useRef(false);

  // Fade hero-04 out when hero section leaves the viewport
  useEffect(() => {
    const heroSection = document.getElementById("hero");
    const video = heroVideoRef.current;
    if (!heroSection || !video) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        video.style.transition = "opacity 0.6s ease";
        video.style.opacity = entry.isIntersecting ? "1" : "0";
      },
      { threshold: 0.05 }
    );
    obs.observe(heroSection);
    return () => obs.disconnect();
  }, []);

  // Scroll-scrub scroll-06 — one seek per rAF tick, zero seeks when idle
  useEffect(() => {
    const video = scrollVideoRef.current;
    if (!video) return;

    video.pause();

    const onScroll = () => {
      if (rafPendingRef.current) return;
      rafPendingRef.current = true;

      requestAnimationFrame(() => {
        rafPendingRef.current = false;
        if (!video.duration) return;

        const heroSection = document.getElementById("hero");
        const heroBottom = heroSection
          ? heroSection.offsetTop + heroSection.offsetHeight
          : window.innerHeight;
        const scrollableAfterHero =
          document.documentElement.scrollHeight - window.innerHeight - heroBottom;
        const scrolledPastHero = Math.max(0, window.scrollY - heroBottom);
        const progress =
          scrollableAfterHero > 0
            ? Math.min(scrolledPastHero / scrollableAfterHero, 1)
            : 0;
        const target = progress * video.duration;

        if (Math.abs(target - video.currentTime) > 1 / 30) {
          video.currentTime = target;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Forward pointer movement to the fluid iframe's externalSplat API
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;
      const normX = e.clientX / window.innerWidth;
      const normY = e.clientY / window.innerHeight;
      const dx = e.movementX / window.innerWidth;
      const dy = e.movementY / window.innerHeight;
      try {
        (iframe.contentWindow as unknown as {
          externalSplat?: (x: number, y: number, dx: number, dy: number) => void;
        }).externalSplat?.(normX, normY, dx, dy);
      } catch { /* cross-origin guard */ }
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <>
      {/* Layer 1 — scroll-06: persistent background, frame-scrubbed by scroll */}
      <video
        ref={scrollVideoRef}
        src="/scroll-06.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Layer 2 — hero-04: covers scroll-06 while hero is in view */}
      <video
        ref={heroVideoRef}
        src="/hero-04.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/*
        Layer 3 — fluid simulation.
        TRANSPARENT: true in fluid.html so the WebGL canvas only paints dye colors;
        empty areas are alpha=0 and let the videos below show through.
      */}
      <iframe
        ref={iframeRef}
        src="/fluid.html"
        title=""
        aria-hidden="true"
        className="fixed inset-0 w-full h-full border-0 pointer-events-none"
        style={{ zIndex: 3, background: "transparent" }}
        tabIndex={-1}
      />
    </>
  );
}
