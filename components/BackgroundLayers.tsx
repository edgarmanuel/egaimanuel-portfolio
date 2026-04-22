"use client";

import { useEffect, useRef } from "react";

const TOTAL_FRAMES = 192;

function frameSrc(i: number) {
  return `/frames/frame${String(i).padStart(4, "0")}.webp`;
}

export default function BackgroundLayers() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  // Preload all frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      imgs.push(img);
    }
    framesRef.current = imgs;
    imgs[0].onload = () => drawFrame(0);
  }, []);

  // Size canvas to viewport with DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Scroll → frame index: starts after hero, spans rest of page
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero");
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight - heroBottom;
      const past = Math.max(0, window.scrollY - heroBottom);
      const progress = scrollable > 0 ? Math.min(past / scrollable, 1) : 0;
      targetFrameRef.current = Math.round(progress * (TOTAL_FRAMES - 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // rAF loop: redraws only when target frame changes
  useEffect(() => {
    const tick = () => {
      const t = targetFrameRef.current;
      if (t !== currentFrameRef.current) {
        const img = framesRef.current[t];
        if (img?.complete) {
          drawFrame(t);
          currentFrameRef.current = t;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Fade hero video out (and canvas in) when hero section leaves viewport
  useEffect(() => {
    const hero = document.getElementById("hero");
    const canvas = canvasRef.current;
    const video = heroVideoRef.current;
    if (!hero || !video || !canvas) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        const entering = e.isIntersecting;
        video.style.transition = "opacity 0.6s ease";
        video.style.opacity = entering ? "1" : "0";
        canvas.style.transition = "opacity 0.6s ease";
        canvas.style.opacity = entering ? "0" : "1";
      },
      { threshold: 0.05 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  // Forward pointer to fluid — manual delta for iOS Safari compatibility
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;
      const normX = e.clientX / window.innerWidth;
      const normY = e.clientY / window.innerHeight;
      const dx = (e.clientX - prevPointerRef.current.x) / window.innerWidth;
      const dy = (e.clientY - prevPointerRef.current.y) / window.innerHeight;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
      if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) return;
      try {
        (iframe.contentWindow as unknown as {
          externalSplat?: (x: number, y: number, dx: number, dy: number) => void;
        }).externalSplat?.(normX, normY, dx, dy);
      } catch { /* cross-origin */ }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img?.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    const iw = img.naturalWidth || 1440;
    const ih = img.naturalHeight || 810;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  };

  return (
    <>
      {/* Layer 1 — WebP frame sequence: white bg, frames advance as user scrolls past hero */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1, background: "#ffffff", opacity: 0 }}
      />

      {/* Layer 2 — hero video: covers frame canvas while hero is visible */}
      <video
        ref={heroVideoRef}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Layer 3 — fluid simulation: transparent dyes paint over both layers */}
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
