"use client";
import { useState } from "react";
import { useView } from "./view/ViewContext";

export default function LandingPB() {
  const { setView } = useView();
  const [hovered, setHovered] = useState(null);

  return (
    <main
      className={hovered ? `hover-${hovered}` : ""}
      style={{
        "--scale": 1.0, // escala global
        "--shows": 1.14, // ajuste fino solo SHOWS
        "--center": 3, // ajuste fino solo Pórtate Bien
        "--merch": 3.75, // ajuste fino solo MERCH
        "--merchShift": "20vw",
      }}
    >
      <video
        className="bg"
        src="/landing/FONDO.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* SHOWS (solo decorativo, el click va en shows-hitbox) */}
      <button
        type="button"
        className="slot shows"
        aria-label="Ver gira"
      >
        <img
          src="/landing/SENAL_SHOWS_LARGA_FITTED.png"
          alt="Shows"
        />
      </button>

      {/* Hitbox rombo para SHOWS */}
      <div
        className="shows-hitbox"
        onClick={() => setView("gira")}
        onMouseEnter={() => setHovered("shows")}
        onMouseLeave={() => setHovered(null)}
        aria-label="Abrir gira"
      />

      {/* Pórtate Bien */}
      <div className="slot center">
        <img
          src="/landing/SENAL_PORTATE_BIEN.png"
          alt="Pórtate Bien"
        />
      </div>

      {/* MERCH (solo decorativo, el click va en merch-hitbox) */}
      <button
        type="button"
        className="slot merch"
        aria-label="Ir a Merch"
        id="btn-open-merch"
      >
        <img
          src="/landing/SENAL_MERCH.png"
          alt="Merch"
        />
      </button>

      {/* Hitbox rombo para MERCH */}
      <div
        className="merch-hitbox"
        onClick={() => setView("merch")}
        onMouseEnter={() => setHovered("merch")}
        onMouseLeave={() => setHovered(null)}
        aria-label="Abrir merch"
      />

      <style jsx>{`
        main {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          /* defaults si no pasas inline */
          --scale: 1;
          --shows: 1;
          --center: 1.2;
          --merch: 1;
        }

        .bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .slot {
          position: absolute;
          z-index: 3;
          transform-origin: center bottom;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: default; /* flecha normal por defecto */
          transition: transform 180ms ease-out, filter 180ms ease-out;
        }

        .slot img {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
        }

        /* SHOWS: solo decorativo (click en shows-hitbox) */
        .slot.shows {
          pointer-events: none;
        }
        .slot.shows img {
          pointer-events: none;
        }

        /* MERCH: solo decorativo (click en merch-hitbox) */
        .slot.merch {
          pointer-events: none;
        }
        .slot.merch img {
          pointer-events: none;
        }

        /* width = clamp(...) * var(--scale) * factor_individual */
        .shows {
          left: 3vw;
          bottom: 7vh;
          transform: rotate(-2deg);
          width: clamp(
            calc(260px * var(--scale) * var(--shows)),
            calc(28vw * var(--scale) * var(--shows)),
            calc(360px * var(--scale) * var(--shows))
          );
        }

        .center {
          left: 50%;
          bottom: 0.1vh;
          transform: translateX(-50%) rotate(-3deg);
          width: clamp(
            calc(420px * var(--scale) * var(--center)),
            calc(42vw * var(--scale) * var(--center)),
            calc(560px * var(--scale) * var(--center))
          );
        }

        .merch {
          right: 1vw;
          bottom: 0vh;
          transform: translateX(var(--merchShift)) rotate(1deg);
          width: clamp(
            calc(240px * var(--scale) * var(--merch)),
            calc(26vw * var(--scale) * var(--merch)),
            calc(340px * var(--scale) * var(--merch))
          );
        }

        /* 🔹 Estados de hover “reactivos” */
        main.hover-shows .slot.shows {
          transform: rotate(-2deg) translateY(-0.8vh) scale(1.05);
          filter: brightness(1.08);
        }

        main.hover-merch .slot.merch {
          transform: translateX(var(--merchShift)) rotate(1deg)
            translateY(-0.8vh) scale(1.05);
          filter: brightness(1.08);
        }

        /* 🔷 ROMBO SHOWS (ajústalo a mano igual que hiciste con MERCH) */
        .shows-hitbox {
          position: absolute;
          z-index: 4;
          width: 25vw; /* TOCA ESTO para encajar al cartel SHOWS */
          height: 25vw; /* TOCA ESTO también */
          left: 1vw; /* posición aproximada, ajústala en DevTools */
          bottom: 25vw;

          background: transparent; /* pon verde si quieres verlo */
          cursor: pointer; /* mano solo aquí */
          pointer-events: auto;

          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          transform: rotate(-2deg);
          transform-origin: center;
        }

        /* 🔷 ROMBO MERCH (ya con tus valores) */
        .merch-hitbox {
          position: absolute;
          z-index: 4;
          width: 29vw;
          height: 29vw;
          right: 4vw;
          bottom: 2vw;

          background: transparent; /* pon verde si quieres verlo */
          cursor: pointer; /* mano solo aquí */
          pointer-events: auto;

          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          transform: rotate(1deg);
          transform-origin: center;
        }

        @media (max-width: 1024px) {
          .shows {
            left: 8vw;
            bottom: 12vh;
          }
          .center {
            bottom: 8vh;
          }
          .merch {
            right: 8vw;
            bottom: 10vh;
          }
        }

        @media (max-width: 640px) {
          .shows {
            left: 4vw;
            bottom: 12vh;
            transform: rotate(-5deg);
          }
          .center {
            bottom: 7vh;
            transform: translateX(-50%) rotate(-3deg);
          }
          .merch {
            right: 4vw;
            bottom: 10vh;
            transform: rotate(3deg);
          }
        }
      `}</style>
    </main>
  );
}
