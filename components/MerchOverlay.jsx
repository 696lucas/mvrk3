"use client";
import { useEffect, useRef } from "react";
import CatalogoPage from "./catalogo/catalogo";
import { useView } from "./view/ViewContext";

export default function MerchOverlay() {
  const { setView } = useView();
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const prevFocusRef = useRef(null);

  const close = () => setView("landing");

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
      className="pb-merch-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Catálogo"
      ref={panelRef}
    >
      <button
        className="pb-merch-close"
        aria-label="Cerrar catálogo"
        onClick={close}
        ref={closeBtnRef}
      >
        ×
      </button>
      <CatalogoPage />
      <style jsx>{`
        .pb-merch-overlay{ position:fixed; inset:0; z-index:80; background:transparent; overflow:auto; }
        .pb-merch-close{
          position:fixed; left:12px; top:12px; z-index:999999; width:40px; height:40px;
          border-radius:10px; border:1px solid rgba(255,255,255,.3); background:rgba(0,0,0,.4); color:#fff;
          font-size:26px; line-height:1; display:grid; place-items:center; cursor:pointer;
        }
        .pb-merch-close:hover{ background:rgba(0,0,0,.55); }
        @media (max-width:768px){ .pb-merch-close{ width:34px; height:34px; font-size:22px; left:8px; top:8px; } }
      `}</style>
    </div>
  );
}

