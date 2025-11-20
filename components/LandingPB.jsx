"use client";
import { useEffect, useState } from "react";
import { useView } from "./view/ViewContext";

export default function LandingPB() {
  const { setView } = useView();
  const [hovered, setHovered] = useState(null);
  const [isMerchTransition, setIsMerchTransition] = useState(false);
  const [isMerchReturn, setIsMerchReturn] = useState(() => {
    if (
      typeof window !== "undefined" &&
      (window.__pbFromMerch || window.__pbFromShows)
    ) {
      try {
        window.__pbFromMerch = false;
        window.__pbFromShows = false;
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

  const openShows = () => {
    if (isMerchTransition) return;
    setHovered("shows");
    setIsMerchTransition(true);
    setTimeout(() => {
      setView("gira");
    }, 900);
  };

  const handleMerchClick = () => {
    // En móvil/tablet NO navegamos a merch de momento
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(max-width: 768px)").matches
    ) {
      return;
    }

    if (isMerchTransition) return;
    setHovered("merch");
    setIsMerchTransition(true);
    setTimeout(() => {
      setView("merch");
    }, 900);
  };

  const openMerchFromMobile = () => {
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
        "--floorScale": 1.3, // ya no lo usamos pero lo dejo
        "--floorX": "0vw",
        "--floorY": "0vh",
      }}
    >
      {/* Suelo en home, fijado al bottom y escalado solo por width */}
      <div className="floor">
        <img
          src="/fondo/suelo.png"
          alt="Suelo"
          className="floor-image"
        />
      </div>

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
        onClick={openShows}
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

      {/* 🔥 FUEGO SOBRE EL CARTEL CENTRAL */}
      <video
        className="fuego-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/landing/FUEGO_ALPHA.webm" type="video/webm" />
      </video>

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
        onClick={openMerchFromMobile}
        onMouseEnter={() => setHovered("merch")}
        onMouseLeave={() => setHovered(null)}
        aria-label="Abrir merch"
      />

      {/* Versión móvil */}
      <div className="slot mobile-title" aria-hidden="true">
        <img
          src="/landing/SENAL_PORTATE_BIEN.png"
          alt="Pórtate Bien"
        />
      </div>
      <button
        type="button"
        className="slot mobile-main"
        aria-label="Ir a Merch"
        onClick={openMerchFromMobile}
      >
        <img
          src="/landing/movil/señal_ movil.png"
          alt="Merch"
        />
      </button>

      {/* Hitboxes SOLO móvil */}
      <div
        className="shows-hitbox-mobile"
        onClick={() => setView("gira")}
        aria-label="Abrir gira (móvil)"
      />
      <div
        className="merch-hitbox-mobile"
        onClick={openMerchFromMobile}
        aria-label="Abrir merch (móvil)"
      />

      <style jsx>{`
        /* Escena fija sin scroll: el main ocupa la pantalla y recorta lo que sobresalga */
        main {
          position: relative;
          min-height: 100svh;
          max-height: 100svh;
          overflow: hidden; /* 🔒 nada de scroll, frame fijo */

          --scale: 1;
          --shows: 1;
          --center: 1.2;
          --merch: 1;
        }

        /* ===== FLOOR FIJO ABAJO, ESCALADO POR WIDTH ===== */
        .floor {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%); /* centrado horizontal */
          pointer-events: none;
          z-index: 2;
        }

        .floor-image {
          display: block;
          position: relative;
          width: 100vw; /* ⬅️ TAMAÑO DEL SUELO: súbelo/bájalo aquí */
          max-width: none;
          height: auto;
          user-select: none;
        }
        /* ===== FIN FLOOR ===== */
        /* 🎯 AJUSTES DEL SUELO SOLO EN MÓVIL */
@media (max-width: 768px) {
  .floor {
    bottom: 0vh;   /* sube/baja el suelo en móvil */
  }

  .floor-image {
    width: 280vw;   /* haz el suelo más ancho SOLO en móvil */
  }
}


        /* 🔥 FUEGO SOBRE EL CARTEL CENTRAL */ 
        .fuego-video {
          position: absolute;
          left: 47%;
          bottom: -9vh; /* ajusta hasta que coincida con tu mock */
          transform: translateX(-50%) rotate(-7deg);
          width: 200vh;
          max-width: none;
          height: auto;
          pointer-events: none;
          z-index: 4; /* por encima del cartel central */
        }

        /* 🔥 Ocultar fuego en pantallas móviles */
        @media (max-width: 768px) {
          .fuego-video {
            display: none !important;
          }
        }
          

        .slot {
          position: absolute;
          z-index: 3;
          transform-origin: center bottom;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: default;
          transition: transform 180ms ease-out, filter 180ms ease-out;
          translate: 0 0;
          animation: pb-slot-breathe 5200ms ease-in-out infinite;
        }

        .mobile-title,
        .mobile-main {
          display: none;
        }

        .shows-hitbox-mobile,
        .merch-hitbox-mobile {
          position: absolute;
          z-index: 4;
          display: none;
          cursor: pointer;
          pointer-events: auto;
        }

        .slot img {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
        }

        .slot.shows {
          pointer-events: none;
        }
        .slot.shows img {
          pointer-events: none;
        }

        .slot.merch {
          pointer-events: none;
        }
        .slot.merch img {
          pointer-events: none;
        }

        main.merch-transition .slot,
        main.merch-return .slot {
          animation: none;
          translate: 0 0;
        }

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

        main.hover-shows .slot.shows {
          transform: rotate(-2deg) translateY(-0.8vh) scale(1.05);
          filter: brightness(1.08);
        }

        main.hover-merch .slot.merch {
          transform: translateX(var(--merchShift)) rotate(1deg)
            translateY(-0.8vh) scale(1.05);
          filter: brightness(1.08);
        }

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

        /* Incluimos el suelo en la animación de caída */
        main.merch-transition .floor {
          transition: transform 900ms cubic-bezier(0.3, 0, 0.15, 1);
          transform: translateX(-50%) translateY(120vh);
        }

        main.merch-transition .shows-hitbox,
        main.merch-transition .merch-hitbox {
          pointer-events: none;
        }

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

        /* Suelo vuelve a su sitio cuando regresamos de merch */
        main.merch-return .floor {
          animation: merch-return-floor 900ms cubic-bezier(0.3, 0, 0.15, 1)
            forwards;
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

          @keyframes merch-return-floor {
            from {
              transform: translateX(-50%) translateY(120vh);
            }
            to {
              transform: translateX(-50%) translateY(0);
            }
          }

          /* Fuego acompaña a las señales en la animación */
          main.merch-transition .fuego-video {
            transition: transform 900ms cubic-bezier(0.3, 0, 0.15, 1),
              opacity 550ms ease-in;
            transition-delay: 180ms; /* cae un poco más tarde que las señales */
            transform: translateX(-50%) rotate(-7deg) translateY(120vh);
            opacity: 0;
          }

          main.merch-return .fuego-video {
            animation: merch-return-fire 900ms cubic-bezier(0.3, 0, 0.15, 1)
              forwards;
            animation-delay: 120ms; /* y vuelve ligeramente después */
          }

          @keyframes merch-return-fire {
            from {
              transform: translateX(-50%) rotate(-7deg) translateY(120vh);
              opacity: 0;
            }
            to {
              transform: translateX(-50%) rotate(-7deg) translateY(0);
              opacity: 1;
            }
          }

        .shows-hitbox {
          position: absolute;
          z-index: 4;
          width: 25vw;
          height: 25vw;
          left: 1vw;
          bottom: 25vw;
          background: transparent;
          cursor: pointer;
          pointer-events: auto;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          transform: rotate(-2deg);
          transform-origin: center;
        }

        .merch-hitbox {
          position: absolute;
          z-index: 4;
          width: 29vw;
          height: 29vw;
          right: 4vw;
          bottom: 2vw;
          background: transparent;
          cursor: pointer;
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

        @media (max-width: 768px) {
          .slot.shows,
          .slot.center,
          .slot.merch,
          .shows-hitbox,
          .merch-hitbox {
            display: none;
          }

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
            top: 15vh;
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

          .shows-hitbox-mobile {
            display: block;
            left: 52%;
            top: 28vh;
            transform: translateX(-50%);
            width: 42vw;
            height: 8vh;
            background: transparent;
          }

          .merch-hitbox-mobile {
            display: block;
            left: 52%;
            top: 38vh;
            transform: translateX(-50%);
            width: 40vw;
            height: 7vh;
            background: transparent;
          }
        }

        @media (max-width: 1024px) {
          .shows-hitbox,
          .merch-hitbox {
            pointer-events: none !important;
          }
        }

        @media (max-width: 768px) {
          .mobile-title {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
