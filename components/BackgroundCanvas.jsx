'use client';

import { useEffect } from 'react';

// Replaced frames-based canvas with a full-screen background video.
// Uses the asset placed under /public/fondo/
export default function BackgroundCanvas() {
  useEffect(() => {
    try { window.PB_BG_OWNER = 'react'; } catch (_) {}
  }, []);

  return (
    <video
      id="bg-video"
      aria-hidden="true"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      src="/fondo/FONDO ANIMADO WEB.mov"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, display: 'block' }}
    />
  );
}
