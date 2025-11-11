"use client";

import { useEffect, useState } from "react";

const ACCOUNT_URL =
  process.env.NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL ||
  "https://shopify.com/95655526787/account";

export default function AccountPopup() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [wantsNewsletter, setWantsNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      #pb-account-dlg{ position:fixed; inset:0; z-index:100001; display:none; }
      #pb-account-dlg.is-open{ display:block; }
      .pb-acc__overlay{ position:absolute; inset:0; background:rgba(0,0,0,.35); }
      .pb-acc__panel{ position:absolute; top:64px; right:12px; width:min(92vw, 360px); background:#fff; color:#111; border-radius:12px; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,.25); border:1px solid rgba(0,0,0,.06); }
      .pb-acc__body{ padding:14px; display:flex; flex-direction:column; gap:12px; max-height:70vh; overflow:auto; }
      .pb-acc__tabs{ display:flex; gap:6px; margin-bottom:10px; }
      .pb-acc__tab{ flex:1; background:#f4f4f4; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:700; text-align:center; }
      .pb-acc__tab.active{ background:#111; color:#fff; }
      .pb-acc__row{ display:flex; flex-direction:column; gap:6px; }
      .pb-acc__input{ padding:10px 12px; border:1px solid #ddd; border-radius:8px; font-size:14px; }
      .pb-acc__btn{ background:#111; color:#fff; border:none; padding:10px 14px; border-radius:8px; cursor:pointer; font-weight:700; width:100%; }
      .pb-acc__err{ color:#d00; font-size:13px; }
      .pb-acc__check{ display:flex; align-items:center; gap:8px; font-size:13px; }
      .pb-acc__check input{ width:16px; height:16px; }
      .pb-acc__title{ font-weight:700; font-size:16px; margin-bottom:4px; }
    `;
    document.head.appendChild(style);

    window.openAccountPopup = () => {
      setError("");
      setMode("login");
      setOpen(true);
    };
    window.closeAccountPopup = () => setOpen(false);

    return () => {
      try {
        document.head.removeChild(style);
      } catch (e) {}
      delete window.openAccountPopup;
      delete window.closeAccountPopup;
    };
  }, []);

  async function handleContinue(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError("");

    if (!email || !/.+@.+\..+/.test(email)) {
      setError("Introduce un email válido");
      return;
    }

    setLoading(true);
    try {
      if (wantsNewsletter) {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        let data = {};
        try {
          data = await res.json();
        } catch (e) {}

        if (!res.ok || !data.ok) {
          console.error("Newsletter error", data);
          setError(
            data.error ||
              "No se pudo suscribir al newsletter. Inténtalo de nuevo."
          );
          setLoading(false);
          return;
        }
      }

      window.location.href = ACCOUNT_URL;
    } catch (err) {
      console.error(err);
      setError("Error inesperado. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div
      id="pb-account-dlg"
      className={open ? "is-open" : ""}
      aria-hidden={!open}
    >
      {/* Cerrar haciendo click fuera */}
      <div className="pb-acc__overlay" onClick={() => setOpen(false)} />
      <div
        className="pb-acc__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Cuenta"
      >
        <form className="pb-acc__body" onSubmit={handleContinue}>
          <div className="pb-acc__title">
            {mode === "login" ? "Iniciar sesión" : "Crear tu cuenta"}
          </div>

          <div className="pb-acc__tabs">
            <button
              type="button"
              className={"pb-acc__tab " + (mode === "login" ? "active" : "")}
              onClick={() => setMode("login")}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={
                "pb-acc__tab " + (mode === "register" ? "active" : "")
              }
              onClick={() => setMode("register")}
            >
              Crear tu cuenta
            </button>
          </div>

          {mode === "register" && (
            <>
              <div className="pb-acc__row">
                <label>Nombre</label>
                <input
                  className="pb-acc__input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div className="pb-acc__row">
                <label>Apellido</label>
                <input
                  className="pb-acc__input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellido"
                />
              </div>
            </>
          )}

          <div className="pb-acc__row">
            <label>Email</label>
            <input
              type="email"
              className="pb-acc__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div className="pb-acc__check">
            <input
              id="pb-acc-news"
              type="checkbox"
              checked={wantsNewsletter}
              onChange={(e) => setWantsNewsletter(e.target.checked)}
            />
            <label htmlFor="pb-acc-news">
              Quiero recibir novedades y lanzamientos por email
            </label>
          </div>

          {error && <div className="pb-acc__err">{error}</div>}

          <button type="submit" disabled={loading} className="pb-acc__btn">
            {loading
              ? "Procesando…"
              : mode === "login"
              ? "Continuar"
              : "Crear cuenta y continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
