"use client";

import { useEffect, useRef, useState } from "react";

export default function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const inputRef = useRef(null);

  // ===== CSS inyectado una sola vez
  useEffect(() => {
    const css =
      ".pb-newsletter-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);z-index:999990;display:none}"+
      ".pb-newsletter-overlay.is-open{display:block}"+
      ".pb-newsletter-modal{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(92vw,380px);background:#111;color:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.5);padding:16px}"+
      ".pb-newsletter-title{font:800 18px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;margin:0 0 8px}"+
      ".pb-newsletter-sub{opacity:.85;font:500 13px/1.3 system-ui;margin:0 0 12px}"+
      ".pb-newsletter-row{display:flex;gap:8px}"+
      ".pb-newsletter-input{flex:1;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:#222;color:#fff;font:500 14px/1.2 system-ui}"+
      ".pb-newsletter-btn{appearance:none;border:0;border-radius:8px;background:#eae400;color:#111;font-weight:800;padding:10px 12px;cursor:pointer}"+
      ".pb-newsletter-btn[disabled]{opacity:.6;cursor:not-allowed}"+
      ".pb-newsletter-close{appearance:none;border:0;background:transparent;color:#fff;position:absolute;right:8px;top:8px;font:700 18px/1 system-ui;cursor:pointer}"+
      ".pb-newsletter-msg{margin-top:10px;font:600 13px/1.2 system-ui}"+
      ".pb-newsletter-msg.error{color:#ff6b6b}"+
      ".pb-newsletter-msg.ok{color:#b4ff7a}";
    const style = document.createElement("style");
    style.setAttribute("data-pb-newsletter", "");
    style.textContent = css;
    document.head.appendChild(style);

    // enlaces que abren el modal
    const links = Array.from(
      document.querySelectorAll('a[href="/newsletter"], .pb-footer-link[href="/newsletter"]')
    );
    const onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setMsg("");
      setIsError(false);
      setEmail("");
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    };
    links.forEach((a) => a.addEventListener("click", onClick, { passive: false }));

    // cerrar con ESC
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);

    return () => {
      links.forEach((a) => a.removeEventListener("click", onClick));
      window.removeEventListener("keydown", onEsc);
      style.remove();
    };
  }, []);

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function submit(e) {
    e.preventDefault();
    if (loading) return;

    if (!validEmail(email)) {
      setIsError(true);
      setMsg("Email no válido");
      return;
    }

    setLoading(true);
    setMsg("");
    setIsError(false);

    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const j = await r.json().catch(() => ({ ok: false, error: "Respuesta inválida" }));

      if (j?.ok) {
        setIsError(false);
        setMsg("¡Gracias! Suscripción correcta.");
        setTimeout(() => setOpen(false), 1200);
      } else {
        // Acorta errores muy largos de GraphQL
        const raw = j?.error || "No se ha podido suscribir.";
        const pretty =
          typeof raw === "string" && raw.length > 220 ? raw.slice(0, 220) + "…" : raw;
        setIsError(true);
        setMsg(pretty);
      }
    } catch {
      setIsError(true);
      setMsg("No se ha podido suscribir.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return <div className="pb-newsletter-overlay" />;

  return (
    <div
      className={"pb-newsletter-overlay " + (open ? "is-open" : "")}
      onClick={() => setOpen(false)}
    >
      <div
        className="pb-newsletter-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Newsletter"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="pb-newsletter-close"
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
        >
          ×
        </button>

        <h3 className="pb-newsletter-title">Suscríbete al newsletter</h3>
        <p className="pb-newsletter-sub">Recibe novedades y lanzamientos por correo.</p>

        <form className="pb-newsletter-row" onSubmit={submit}>
          <input
            ref={inputRef}
            type="email"
            required
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pb-newsletter-input"
            autoComplete="email"
            inputMode="email"
          />
          <button type="submit" className="pb-newsletter-btn" disabled={loading}>
            {loading ? "Enviando..." : "Suscribirme"}
          </button>
        </form>

        {msg ? (
          <div className={"pb-newsletter-msg " + (isError ? "error" : "ok")}>{msg}</div>
        ) : null}
      </div>
    </div>
  );
}
