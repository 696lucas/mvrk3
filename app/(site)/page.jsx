'use client';
import Link from 'next/link';

export default function LandingPB() {
  const fondo = '/landing/FONDO.mp4';

  // Nombres ASCII exactos en /public/landing/
  const senalShows = '/landing/SENAL_SHOWS_LARGA_FITTED.png';
  const senalMerch = '/landing/SENAL_MERCH.png';
  const senalPB = '/landing/SENAL_PORTATE_BIEN.png';

  return (
    <main>
      {/* Fondo video (cubre toda la pantalla) */}
      <video
        className="bg"
        src={fondo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* SHOWS (izquierda) */}
      <Link href="/shows" className="hit shows" aria-label="Ver shows">
        <img className="img" src={senalShows} alt="Shows" />
      </Link>

      {/* PORTATE BIEN (centro) */}
      <div className="center">
        <img className="img" src={senalPB} alt="Portate Bien" />
      </div>

      {/* MERCH (derecha) -> /catalogo */}
      <Link href="/catalogo" className="hit merch" aria-label="Ir a Merch">
        <img className="img" src={senalMerch} alt="Merch" />
      </Link>

      <style jsx>{`
        /* bloquear scroll global */
        :global(html),
        :global(body) {
          height: 100%;
          overflow: hidden;
        }

        main {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          background: #5c84d8;
        }

        .bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .hit {
          position: absolute;
          z-index: 2;
          transform-origin: center bottom;
          transition: transform 200ms ease, filter 200ms ease;
        }
        .hit:hover {
          transform: translateZ(0) scale(1.04) rotate(0.2deg);
          filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.35));
        }

        .img {
          display: block;
          width: 100%;
          height: auto;
          pointer-events: none;
          user-select: none;
        }

        .shows {
          left: 8vw;
          bottom: 8vh;
          width: min(30vw, 340px);
          transform: rotate(-3deg);
        }

        .merch {
          right: 8vw;
          bottom: 6vh;
          width: min(28vw, 320px);
          transform: rotate(3deg);
        }

        .center {
          position: absolute;
          left: 50%;
          bottom: 4vh;
          transform: translateX(-50%);
          width: min(50vw, 560px);
          z-index: 2;
        }
        .center .img {
          transform: rotate(-2deg);
        }

        @media (max-width: 640px) {
          .shows {
            left: 4vw;
            bottom: 10vh;
            width: 44vw;
          }
          .merch {
            right: 4vw;
            bottom: 8vh;
            width: 42vw;
          }
          .center {
            width: 76vw;
            bottom: 6vh;
          }
        }
      `}</style>
    </main>
  );
}
