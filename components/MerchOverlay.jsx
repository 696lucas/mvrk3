"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CatalogoPage from "./catalogo/catalogo";
import { useView } from "./view/ViewContext";

export default function MerchOverlay() {
  const { setView } = useView();
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const prevFocusRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  const close = () => {
    if (isClosing) return;
    setIsClosing(true);
    try {
      window.__pbFromMerch = true;
    } catch {}
    setTimeout(() => {
      setView("landing");
    }, 900);
  };

  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.classList.add("pb-modal-open");
    body.style.overflow = "hidden";
    prevFocusRef.current = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
    };
    document.addEventListener("keydown", onKey);
    // initial focus
    setTimeout(() => {
      const root = panelRef.current;
      if (!root) return;
      const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusables = root.querySelectorAll(sel);
      const target = focusables[0] || closeBtnRef.current || root;
      if (target && target.focus) target.focus({ preventScroll: true });
    }, 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.classList.remove("pb-modal-open");
      body.style.overflow = prevOverflow || "";
      const prev = prevFocusRef.current;
      if (prev && prev.focus) setTimeout(() => prev.focus(), 0);
    };
  }, []);

  return (
    <div
      className={`pb-merch-overlay${isClosing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Catálogo"
      ref={panelRef}
    >
      <button
        className="pb-merch-close"
        aria-label="Cerrar catálogo"
        onClick={close}
        ref={closeBtnRef}>
      <Image src="/icon/casa.png" alt="" aria-hidden="true" width={32} height={32} className="pb-merch-close-icon" />
      </button>
      <CatalogoPage />
      <style jsx>{`
        .pb-merch-overlay {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: transparent;
          overflow: auto;
          opacity: 0;
          transform: translateY(-40px);
          animation: pb-merch-enter 520ms cubic-bezier(0.2, 0.8, 0.2, 1)
            forwards;
        }
        .pb-merch-overlay.is-closing {
          animation: pb-merch-exit 400ms ease-out forwards;
        }
        .pb-merch-close {
          position: fixed;
          left: 12px;
          top: 12px;
          z-index: 999999;
          border: none;
          background: transparent;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .pb-merch-close-icon {
          width: 32px;
          height: 32px;
          display: block;
          object-fit: contain;
          transform-origin: center;
          transform: scale(1); /* cambia este scale para el tamaño */
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .pb-merch-close:hover {
          background: transparent;
        }
        .pb-merch-close:hover .pb-merch-close-icon,
        .pb-merch-close:focus-visible .pb-merch-close-icon {
          transform: scale(1.08);
          opacity: 0.9;
        }
        @keyframes pb-merch-enter {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pb-merch-exit {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @media (max-width: 768px) {
          .pb-merch-close {
            left: 8px;
            top: 8px;
          }
        }
      `}</style>
    </div>
  );
}



