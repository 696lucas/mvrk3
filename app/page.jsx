'use client';
import Link from 'next/link';
import { useRef } from 'react';

export default function LandingPB() {
  const fondo = "/landing/FONDO.mp4";
  const fuego = "/landing/fuego.mp4"; // si luego exportas fuego.webm con alpha, cámbialo aquí

  const senalShows = encodeURI("/landing/SEÑAL SHOWS LARGA FITTED.png");
  const senalMerch = encodeURI("/landing/SEÑAL MERCH.png");
  const senalPB = encodeURI("/landing/SEÑAL PORTATE BIEN.png");

  const fuegoRef = useRef(null);

  return (
    <main>
      {/* Fondo vídeo */}
      <video className="bg" src={fondo} autoPlay muted loop playsInline preload="auto" />

      {/* SHOWS (izquierda) */}
      <Link href="/shows" className="hit shows" aria-label="Ver shows">
        <img className="img" src={senalShows} alt="Shows" />
      </Link>

      {/* PÓRTATE BIEN (centro) + fuego encima */}
      <div className="center">
        <img className="img" src={senalPB} alt="Pórtate Bien" />
        <video
          ref={fuegoRef}
          className="fuego"
          src={fuego}
          autoPlay
          muted
          loop
          playsInline
          onError={() => {
            if (fuegoRef.current) fuegoRef.current.style.display = 'none';
          }}
        />
      </div>

      {/* MERCH (derecha) → abre catálogo */}
      <Link href="/catalogo" className="hit merch" aria-label="Ir a Merch">
        <img className="img" src={senalMerch} alt="Merch" />
      </Link>

      <style jsx>{`
        main { position: relative; min-height: 100svh; overflow: hidden; background: #5c84d8; }
        .bg { position: fixed; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }

        .hit { position: absolute; z-index: 2; transform-origin: center bottom;
               transition: transform 200ms ease, filter 200ms ease; }
        .hit:hover { transform: translateZ(0) scale(1.04) rotate(0.2deg);
                     filter: drop-shadow(0 10px 24px rgba(0,0,0,.35)); }
        .img { display: block; width: 100%; height: auto; pointer-events: none; user-select: none; }

        .shows { left: 8vw; bottom: 8vh; width: min(30vw, 340px); rotate: -3deg; }
        .merch { right: 8vw; bottom: 6vh; width: min(28vw, 320px); rotate: 3deg; }

        .center { position: absolute; left: 50%; bottom: 4vh; transform: translateX(-50%);
                  width: min(50vw, 560px); z-index: 2; }
        .center .img { rotate: -2deg; }

        /* fuego.mp4 no tiene alpha; mezclamos para integrarlo */
        .fuego { position: absolute; left: 50%; top: -8%; transform: translateX(-50%);
                 width: 120%; height: auto; pointer-events: none; mix-blend-mode: screen; }

        @media (max-width: 640px) {
          .shows { left: 4vw; bottom: 10vh; width: 44vw; }
          .merch { right: 4vw; bottom: 8vh; width: 42vw; }
          .center { width: 76vw; bottom: 6vh; }
        }
      `}</style>
    </main>
  );
}


