"use client";

import { useEffect, useRef, useState } from "react";
import { useView } from "./view/ViewContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Shows() {
  const { setView } = useView();
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const [isLeaving, setIsLeaving] = useState(false);

  // FONDO DINÁMICO EN CANVAS (frames /frames/frame_XXX.webp)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameCount = 150;
    const frameSrc = (i) => `/frames/frame_${String(i).padStart(3, "0")}.webp`;

    const images = new Array(frameCount);
    let raf = null;

    const drawCover = (img) => {
      if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;

      const cRatio = (canvas.width || 1) / (canvas.height || 1);
      const iRatio = (img.width || 1) / (img.height || 1);

      let w;
      let h;

      if (iRatio > cRatio) {
        h = canvas.height;
        w = img.width * (canvas.height / img.height);
      } else {
        w = canvas.width;
        h = img.height * (canvas.width / img.width);
      }

      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, w, h);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    for (let i = 0; i < frameCount; i += 1) {
      const img = new window.Image();
      img.src = frameSrc(i + 1);
      images[i] = img;
    }

    const update = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const maxScrollTop =
        (document.documentElement.scrollHeight || 0) - window.innerHeight;
      const frac = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;

      const rawIndex = Math.floor(frac * frameCount);
      const maxIndex = frameCount - 10; // evita los últimos frames si cambian de fondo
      const idx = Math.min(maxIndex, rawIndex);

      const img = images[idx];
      if (img) drawCover(img);
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    const first = images[0];
    if (first) {
      if (first.complete) drawCover(first);
      else first.addEventListener("load", () => drawCover(first));
    }

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Fade-in simple con IntersectionObserver (ciudades)
  useEffect(() => {
    const rows = Array.from(
      document.querySelectorAll(".shows-page .city-row")
    );
    if (!rows.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    rows.forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  // GSAP: LETTERING se agranda y se difumina al hacer scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(".intro .lettering", {
        scale: 1.5,
        autoAlpha: 0, // opacity + visibility
        ease: "none",
        scrollTrigger: {
          endTrigger: ".content",
          end: "top top",
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleBackToLanding = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      window.__pbFromShows = true;
    } catch {}
    setTimeout(() => {
      setView("landing");
    }, 400);
  };

  return (
    <main
      className={`shows-page${isLeaving ? " is-leaving" : ""}`}
      ref={rootRef}
    >
      {/* FONDO */}
      <canvas
        id="scroll-canvas"
        ref={canvasRef}
        className="shows-bg-canvas"
        aria-hidden="true"
      />

      {/* Botón volver dentro de la app */}
        <button
          type="button"
          className="shows-back"
          onClick={handleBackToLanding}
          aria-label="Volver a inicio"
        >
        <img src="/icon/casa.png" alt="" className="shows-back-icon" />
      </button>

      {/* INTRO */}
      <section className="intro">
        <div className="lettering">
          <img
            src="/shows/lettering.webp"
            alt="lettering portate bien"
          />
        </div>
        <div className="scroll-arrow">
          <img src="/shows/flecha.png" alt="Haz scroll" />
        </div>
      </section>

      {/* CIUDADES */}
      <section className="content">
        {/* Nuevas fechas Latinoamérica (CDMX, Bogotá) */}
        <div className="city-row left">
          <a
            href="https://mvrk-cdmx.boletia.com/"
            target="_blank"
            className="city"
          >
            <img src="/shows/mexico.png" alt="CdMx - 08.May - Foro Niebla" />
          </a>
        </div>

        <div className="city-row right">
          <a
            href="https://tickets.eticketablanca.com/event/mvrk-bogota-j2q9ly?eventId=6939e87fdd218d70df5403b2"
            target="_blank"
            className="city"
          >
            <img src="/shows/colombia.png" alt="Bogot� - 15.May - Boro Room" />
          </a>
        </div>

        <div className="city-row left">
          <a
            href="https://inverfest.com/events/mvrk/"
            target="_blank"
            className="city"
          >
            <img src="/shows/madrid.webp" alt="Madrid" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row right">
          <a
            href="https://entradas.crashmusic.es/event/concierto-mvrk-granada-sala-tren-viernes-10-de-octubre"
            target="_blank"
            className="city"
          >
            <img src="/shows/granada.webp" alt="Granada" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row left">
          <a
            href="https://www.fourvenues.com/rollercoaster/1LIV"
            target="_blank"
            className="city"
          >
            <img src="/shows/sevilla.webp" alt="Sevilla" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row right">
          <a
            href="https://www.bringthenoise.events/evento/mvrk-a-coruna-2025/"
            target="_blank"
            className="city"
          >
            <img src="/shows/corunaa.png" alt="A Coruna" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row left">
          <a
            href="https://www.bringthenoise.events/evento/mvrk-vigo-2025/"
            target="_blank"
            className="city"
          >
            <img src="/shows/vigo.webp" alt="Vigo" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row right">
          <a
            href="https://www.ticketmaster.es/event/706838424"
            target="_blank"
            className="city"
          >
            <img src="/shows/mallorca.webp" alt="Mallorca" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row left">
          <a
            href="https://www.fourvenues.com/grupo-13-14/VBYX"
            target="_blank"
            className="city"
          >
            <img src="/shows/valenciaNuevo.png" alt="Valencia" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row right">
          <a
            href="https://link.dice.fm/M8ba31cf71df"
            target="_blank"
            className="city"
          >
            <img src="/shows/valencia.webp" alt="Valencia" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row left">
          <a
            href="https://www.fourvenues.com/grupo-13-14/VBYX"
            target="_blank"
            className="city"
          >
            <img src="/shows/alicante.webp" alt="Alicante" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row right">
          <a
            href="https://feverup.com/m/316826"
            target="_blank"
            className="city"
          >
            <img src="/shows/zaragoza.webp" alt="Zaragoza" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row left">
          <a
            href="https://feverup.com/m/316838"
            target="_blank"
            className="city"
          >
            <img src="/shows/bilbao.webp" alt="Bilbao" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row right">
          <a
            href="https://www.ticketmaster.es/event/1284323430"
            target="_blank"
            className="city"
          >
            <img src="/shows/tenerife.webp" alt="Tenerife" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row left">
          <a
            href="https://www.enterticket.es/eventos/mvrk-444523"
            target="_blank"
            className="city"
          >
            <img src="/shows/murciaa.png" alt="Murcia" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        {/* MÁLAGA �?" imagen editable con su propio CSS */}
        <div className="city-row right malaga-row">
          <a
            href="https://entradas.crashmusic.es/event/concierto-mvrk-malaga-sala-paris-15-sabado-10-de-enero"
            target="_blank"
            className="city"
          >
            <img
              src="\shows\malagaa.png"
              alt="Málaga"
              className="malaga-img"
            />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row left">
          <a
            href="https://www.ticketmaster.es/event/1022992046?brand=base_mb_es"
            target="_blank"
            className="city"
          >
            <img src="/shows/gijonNuevo.png" alt="Gijon" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row right">
          <a
            href="https://www.ticketmaster.es/event/478619055?brand=base_mb_es"
            target="_blank"
            className="city"
          >
            <img src="/shows/gijonn.png" alt="Gijon" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row left">
          <a
            href="https://link.dice.fm/d2b5e48f79e8"
            target="_blank"
            className="city"
          >
            <img src="/shows/barcelonaNuevo.png" alt="Barcelona" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

        <div className="city-row right">
          <a
            href="https://link.dice.fm/x3674ede6542"
            target="_blank"
            className="city"
          >
            <img src="/shows/barcelona.webp" alt="Barcelona" />
          </a>
          <img src="/shows/sold.png" alt="Sold out" className="info-tickets" />
        </div>

      </section>

      {/* Imagen final, como una sección más */}
      <section className="closing-banner">
        <img
          src="/shows/mvrk.webp"
          alt="mvrk"
          className="closing-banner__img"
        />
      </section>

      <style jsx>{`
        .shows-page {
          position: relative;
          min-height: 100svh;
          padding: 0;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          z-index: 1;
        }

        .shows-bg-canvas {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          display: block;
          z-index: 0;
          pointer-events: none;
        }

        .shows-back {
          position: fixed;
          left: 12px;
          top: 12px;
          z-index: 20;
          border: none;
          background: transparent;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .shows-back-icon {
          width: 32px;
          height: 32px;
          display: block;
          object-fit: contain;
          transform-origin: center;
          transform: scale(1);
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

          .intro {
            position: relative;
            width: 100%;
            height: 100vh;
          }

          /* LETTERING centrado en medio de la pantalla */
            .lettering {
              position: fixed;
              top: 25%;
              left: 50%;
              transform: translate(-50%, -50%) translateZ(0);
              transform-origin: center center;
              will-change: transform, opacity;
              backface-visibility: hidden;
            }

        .lettering img {
          width: 80vw;
          max-width: 700px;
          display: block;
          animation: mvrk-wiggle-img 3.4s linear infinite both;
          animation-delay: -1.7s;
          transform-origin: 50% 50%;
          will-change: transform;
            backface-visibility: hidden;
          }

        .scroll-arrow {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          animation: bounce 2s infinite;
          z-index: 10;
        }

          .scroll-arrow img {
            width: 40px;
            height: auto;
            opacity: 0.8;
            display: block;
          }

          /* Fade in/out del lettering al entrar/salir de la página de shows */
          @keyframes shows-lettering-fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .shows-page.is-leaving .lettering {
            animation: shows-lettering-fade-out 320ms ease-in forwards;
          }

          @keyframes shows-lettering-fade-out {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }

        @keyframes mvrk-wiggle-img {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          10% {
            transform: translate3d(6px, -4px, 0) rotate(1deg);
          }
          20% {
            transform: translate3d(-5px, 5px, 0) rotate(-0.9deg);
          }
          30% {
            transform: translate3d(4px, 3px, 0) rotate(0.8deg);
          }
          40% {
            transform: translate3d(-4px, -3px, 0) rotate(-0.7deg);
          }
          50% {
            transform: translate3d(3px, 1px, 0) rotate(0.5deg);
          }
          60% {
            transform: translate3d(-3px, -1px, 0) rotate(-0.4deg);
          }
          70% {
            transform: translate3d(2px, 2px, 0) rotate(0.3deg);
          }
          80% {
            transform: translate3d(-2px, -2px, 0) rotate(-0.2deg);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, 10px);
          }
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 60px;
          padding: 40px 40px 80px;
          width: 100%;
        }

        .city-row {
          display: flex;
          width: 75%;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transform: translate3d(0, 60px, 0) scale(0.9);
          transition:
            opacity 0.6s ease-out,
            transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform, opacity;
        }

        .city-row.left {
          justify-content: flex-start;
        }

        .city-row.right {
          justify-content: flex-end;
        }

        .city-row.is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }

        .city img {
          width: auto;
          height: auto;
          max-height: 150px;
          max-width: 350px;
          display: block;
          transition:
            transform 0.3s ease-out,
            filter 0.3s ease-out;
          will-change: transform, filter;
          cursor: pointer;
        }

        .city img:hover {
          transform: scale(0.9);
          filter: brightness(1.1);
        }

        .info-tickets {
          display: block;
          width: auto;
          max-width: 90px;
          height: auto;
        }

        /* --- MÁLAGA --- */
        .malaga-row {
          width: 75%;
        }

        .malaga-img {
          width: 420px;
          height: auto;
          position: relative;
          transform: translate(-60px, 15px);
        }

        @media (max-width: 768px) {
          .malaga-img {
            width: 280px;
            transform: translate(0px, 0px);
          }
        }

        /* Centrar fechas/imagenes en móvil SIN cambiar su tamaño */
        @media (max-width: 768px) {
          .content .city-row {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .content .city-row .city {
            margin-left: auto;
            margin-right: auto;
          }

          .content .city-row .city img,
          .content .city-row .info-tickets {
            display: block;
            margin-left: auto;
            margin-right: auto;
          }
        }

        /* Texto para fechas sin imagen */
        .city-text{
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:4px;
          color:#ffe600;
          font-weight:900;
          text-decoration:none;
          text-align:center;
          text-shadow: 2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000;
          font-size: clamp(18px, 3vw, 30px);
        }
        .city-text-line{ line-height:1.1; display:block; }

        @media (max-width: 600px) {
          .shows-back {
            left: 8px;
            top: 8px;
          }

          .content {
            padding: 32px 20px 60px;
            gap: 40px;
          }

          .city-row {
            width: 100%;
          }

          .city img {
            max-height: 80px;
            max-width: 175px;
          }

          .city-row.left,
          .city-row.right {
            justify-content: flex-start;
          }

          .info-tickets {
            max-width: 75px;
          }
        }

        /* Imagen final al fondo de la página, por encima del canvas */
        .closing-banner {
          position: relative;
          z-index: 1;
          width: 100%;
          margin-top: 40px;
        }

        .closing-banner__img {
          display: block;
          width: 100%;
          height: auto;
          max-height: 95vh;
          object-fit: cover;
        }

        @media (max-width: 480px) {
          .city img {
            height: 50px;
            width: 160px;
          }

          .scroll-arrow {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}


