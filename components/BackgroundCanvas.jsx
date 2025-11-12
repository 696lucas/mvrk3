'use client';

import { useEffect, useRef, useState } from 'react';

// Replaced frames-based canvas with a full-screen background video.
// Uses the asset placed under /public/fondo/
export default function BackgroundCanvas() {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try { window.PB_BG_OWNER = 'react'; } catch (_) {}
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => {
      v.play().catch(() => {
        // Autoplay blocked or codec unsupported → keep poster
      });
    };
    const onError = () => setFailed(true);
    v.addEventListener('error', onError);
    v.addEventListener('stalled', onError);
    v.addEventListener('abort', onError);
    v.addEventListener('emptied', onError);
    v.addEventListener('suspend', () => {});
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener('canplay', tryPlay, { once: true });
    return () => {
      try {
        v.removeEventListener('error', onError);
        v.removeEventListener('stalled', onError);
        v.removeEventListener('abort', onError);
        v.removeEventListener('emptied', onError);
      } catch {}
    };
  }, []);

  return (
    <>
      <video
        id="bg-video"
        ref={ref}
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/frames/frame_001.webp"
        src="/fondo/FONDO SIN SOMBRA.mp4"
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, display: 'block', background: '#000' }}
      >
        {/* Fuentes opcionales para compatibilidad */}
        <source src="/fondo/FONDO SIN SOMBRA.mp4" type="video/mp4" />
        <source src="/fondo/FONDO ANIMADO WEB.mov" type="video/quicktime" />
      </video>
      {failed && (
        <img
          src="/frames/frame_001.webp"
          alt=""
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, display: 'block' }}
        />
      )}
    </>
  );
}
