"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function LandingPB() {
  return (
    <main
      style={{
        "--scale": 1.0,   // escala global
        "--shows": 1.14,  // ajuste fino solo SHOWS
        "--center": 3,    // ajuste fino solo Pórtate Bien
        "--merch": 3.75,  // ajuste fino solo MERCH
        "--merchShift": "20vw",
      }}
    >
      <video className="bg" src="/landing/FONDO.mp4" autoPlay muted loop playsInline preload="auto" />

      {/* SHOWS */}
      <div className="slot shows">
        <Link href="/shows" aria-label="Ver shows">
          <img src="/landing/SENAL_SHOWS_LARGA_FITTED.png" alt="Shows" />
        </Link>
      </div>

      {/* Pórtate Bien */}
      <div className="slot center">
        <img src="/landing/SENAL_PORTATE_BIEN.png" alt="Pórtate Bien" />
      </div>

      {/* MERCH */}
      <div className="slot merch">
        <Link href="/catalogo" aria-label="Ir a Merch">
          <img src="/landing/SENAL_MERCH.png" alt="Merch" />
        </Link>
      </div>

      <style jsx>{`
        main{
          position:relative; min-height:100svh; overflow:hidden;
          /* defaults si no pasas inline */
          --scale: 1; --shows: 1; --center: 1.2; --merch: 1;
        }
        .bg{ position:fixed; inset:0; width:100%; height:100%; object-fit:cover; z-index:0; }

        .slot{ position:absolute; z-index:3; transform-origin:center bottom; }
        .slot a{ display:block; width:100%; height:100%; }
        .slot img{ display:block; width:100%; height:auto; pointer-events:none; user-select:none; }

        /* width = clamp(...) * var(--scale) * factor_individual */
        .shows{
          left:3vw; bottom:7vh; transform: rotate(-2deg);
          width: clamp(calc(260px * var(--scale) * var(--shows)),
                       calc(28vw   * var(--scale) * var(--shows)),
                       calc(360px * var(--scale) * var(--shows)));
        }
        .center{
          left:50%; bottom:0.1vh; transform: translateX(-50%) rotate(-3deg);
          width: clamp(calc(420px * var(--scale) * var(--center)),
                       calc(42vw   * var(--scale) * var(--center)),
                       calc(560px * var(--scale) * var(--center)));
        }
        .merch{
          right:1vw; bottom:0vh;
          transform: translateX(var(--merchShift)) rotate(1deg);
          width: clamp(calc(240px * var(--scale) * var(--merch)),
                       calc(26vw   * var(--scale) * var(--merch)),
                       calc(340px * var(--scale) * var(--merch)));
        }

        @media (max-width:1024px){
          .shows{ left:8vw;  bottom:12vh; }
          .center{           bottom:8vh;  }
          .merch{ right:8vw; bottom:10vh; }
        }
        @media (max-width:640px){
          .shows{ left:4vw;  bottom:12vh; transform: rotate(-5deg); }
          .center{           bottom:7vh;  transform: translateX(-50%) rotate(-3deg); }
          .merch{ right:4vw; bottom:10vh; transform: rotate(3deg); }
        }
      `}</style>
    </main>
  );
}

