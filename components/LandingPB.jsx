"use client";
import { useEffect, useState } from "react";
import { useView } from "./view/ViewContext";

export default function LandingPB() {
  const { setView } = useView();
  const [hovered, setHovered] = useState(null);
  const [isMerchTransition, setIsMerchTransition] = useState(false);
  const [isMerchReturn, setIsMerchReturn] = useState(() => {
    if (typeof window !== "undefined" && window.__pbFromMerch) {
      try {
        window.__pbFromMerch = false;
      } catch {}
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (!isMerchReturn) return;
    const timer = setTimeout(() => setIsMerchReturn(false), 900);
    return () => clearTimeout(timer);
  }, [isMerchReturn]);

  const mainClassName = [
    hovered ? `hover-${hovered}` : "",
    isMerchTransition ? "merch-transition" : "",
    isMerchReturn ? "merch-return" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleMerchClick = () => {
    if (isMerchTransition) return;
    setHovered("merch");
    setIsMerchTransition(true);
    setTimeout(() => {
      setView("merch");
    }, 900);
  };

  return (
    <main
      className={mainClassName}
      style={{
        "--scale": 1.0, // escala global
        "--shows": 1.14, // ajuste fino solo SHOWS
        "--center": 3, // ajuste fino solo Pórtate Bien
        "--merch": 3.75, // ajuste fino solo MERCH
        "--merchShift": "20vw",
      }}
    >
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
        <img src="/landing/SENAL_MERCH.png" alt="Merch" />
      </button>

      {/* Hitbox rombo para MERCH */}
      <div
        className="merch-hitbox"
        onClick={handleMerchClick}
        onMouseEnter={() => setHovered("merch")}
        onMouseLeave={() => setHovered(null)}
        aria-label="Abrir merch"
      />

      {/* Versión móvil: lettering arriba + señal móvil centrada (solo visible en mobile via CSS) */}
      <div className="slot mobile-title" aria-hidden="true">
        <img
          src="/landing/SENAL_PORTATE_BIEN.png"
          alt="P��rtate Bien"
        />
      </div>
      <button
        type="button"
        className="slot mobile-main"
        aria-label="Ir a Merch"
        onClick={handleMerchClick}
      >
        <img
          src="/landing/movil/señal_ movil.png"
          alt="Merch"
        />
      </button>

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

        .slot {
          position: absolute;
          z-index: 3;
          transform-origin: center bottom;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: default; /* flecha normal por defecto */
          transition: transform 180ms ease-out, filter 180ms ease-out;
          /* leve movimiento para que la casita "respire" */
          translate: 0 0;
          animation: pb-slot-breathe 5200ms ease-in-out infinite;
        }

        /* Slots específicos de móvil: ocultos por defecto (solo se activan en media query) */
        .mobile-title,
        .mobile-main {
          display: none;
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

        /* Pausar la respiracion durante transiciones grandes */
        main.merch-transition .slot,
        main.merch-return .slot {
          animation: none;
          translate: 0 0;
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

        /* Animacion de "respirar" suave usando translate
           (no interfiere con los transform existentes) */
        @keyframes pb-slot-breathe {
          0% {
            translate: 0 0;
          }
          50% {
            translate: 0 -0.6vh;
          }
          100% {
            translate: 0 0;
          }
        }

        /* Transición hacia MERCH: las señales se hunden hacia abajo */
        main.merch-transition .slot {
          cursor: default;
          transition: transform 900ms cubic-bezier(0.3, 0, 0.15, 1),
            filter 360ms ease-out, opacity 550ms ease-in;
        }

        main.merch-transition .slot.shows,
        main.merch-transition .slot.center,
        main.merch-transition .slot.merch {
          opacity: 0;
        }

        main.merch-transition .slot.shows {
          transition-delay: 60ms;
          transform: rotate(-6deg) translateY(120vh) scale(0.9);
        }
        main.merch-transition .slot.center {
          transition-delay: 140ms;
          transform: translateX(-50%) rotate(-8deg) translateY(120vh)
            scale(0.9);
        }
        main.merch-transition .slot.merch {
          transition-delay: 220ms;
          transform: translateX(var(--merchShift)) rotate(8deg)
            translateY(120vh) scale(0.9);
        }

        /* Desactivar los clics mientras las traga la tierra */
        main.merch-transition .shows-hitbox,
        main.merch-transition .merch-hitbox {
          pointer-events: none;
        }

        /* Vuelta desde MERCH: las señales salen desde abajo hacia su sitio */
        main.merch-return .slot {
          cursor: default;
          animation-duration: 900ms;
          animation-timing-function: cubic-bezier(0.3, 0, 0.15, 1);
          animation-fill-mode: forwards;
        }
        main.merch-return .slot.shows {
          animation-name: merch-return-shows;
        }
        main.merch-return .slot.center {
          animation-name: merch-return-center;
        }
        main.merch-return .slot.merch {
          animation-name: merch-return-merch;
        }

        @keyframes merch-return-shows {
          from {
            transform: rotate(-6deg) translateY(120vh) scale(0.9);
            opacity: 0;
          }
          to {
            transform: rotate(-2deg) translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes merch-return-center {
          from {
            transform: translateX(-50%) rotate(-8deg) translateY(120vh)
              scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) rotate(-3deg) translateY(0)
              scale(1);
            opacity: 1;
          }
        }
        @keyframes merch-return-merch {
          from {
            transform: translateX(var(--merchShift)) rotate(8deg)
              translateY(120vh) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(var(--merchShift)) rotate(1deg)
              translateY(0) scale(1);
            opacity: 1;
          }
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

        /* ===== Versión móvil (NO tocar escritorio) ===== */
        @media (max-width: 768px) {
          /* Oculta señales y hitboxes de escritorio */
          .slot.shows,
          .slot.center,
          .slot.merch,
          .shows-hitbox,
          .merch-hitbox {
            display: none;
          }

          /* Activa layout móvil */
          .mobile-title,
          .mobile-main {
            display: block;
            animation: none;
          }

          .mobile-title {
            position: absolute;
            left: 50%;
            top: 10vh;
            transform: translateX(-50%) rotate(-3deg);
            width: min(82vw, 420px);
            z-index: 3;
          }

          .mobile-main {
            position: absolute;
            left: 50%;
            top: 32vh;
            transform: translateX(-50%);
            width: min(86vw, 460px);
            z-index: 3;
            cursor: pointer;
          }

          .mobile-main img,
          .mobile-title img {
            width: 100%;
            height: auto;
          }
        }

        /* Override extra: en móvil ocultamos el título suelto de "Pórtate bien"
           para que solo quede la señal vertical móvil centrada */
        @media (max-width: 768px) {
          .mobile-title {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

