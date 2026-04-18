"use client";

export default function ScrollVideo() {
  return (
    <section className="relative h-screen overflow-hidden" style={{ zIndex: 1 }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/scroll-06.mp4" type="video/mp4" />
      </video>

      {/* Subtle vignette so fluid bleeds in at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.18) 100%)",
        }}
      />
    </section>
  );
}
