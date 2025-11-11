"use client";

import { useEffect, useState } from "react";

export default function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const css = (
      ".pb-newsletter-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);z-index:999990;display:none}"+
      ".pb-newsletter-overlay.is-open{display:block}"+
      ".pb-newsletter-modal{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(92vw,380px);background:#111;color:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.5);padding:16px}"+
      ".pb-newsletter-title{font:800 18px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;margin:0 0 8px}"+
      ".pb-newsletter-sub{opacity:.85;font:500 13px/1.3 system-ui;margin:0 0 12px}"+
      ".pb-newsletter-row{display:flex;gap:8px}"+
      ".pb-newsletter-input{flex:1;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:#222;color:#fff;font:500 14px/1.2 system-ui}"+
      ".pb-newsletter-btn{appearance:none;border:0;border-radius:8px;background:#eae400;color:#111;font-weight:800;padding:10px 12px;cursor:pointer}"+
      ".pb-newsletter-close{appearance:none;border:0;background:transparent;color:#fff;position:absolute;right:8px;top:8px;font:700 18px/1 system-ui;cursor:pointer}"+
      ".pb-newsletter-msg{margin-top:10px;font:600 13px/1.2 system-ui}"
    );
    const style = document.createElement("style");
    style.setAttribute("data-pb-newsletter", "");
    style.textContent = css;
    document.head.appendChild(style);

    const links = Array.from(document.querySelectorAll('a[href="/newsletter"], .pb-footer-link[href="/newsletter"]'));
    const onClick = (e) => { e.preventDefault(); e.stopPropagation(); setMsg(""); setEmail(""); setOpen(true); };
    links.forEach(a => a.addEventListener('click', onClick));
    return () => { links.forEach(a => a.removeEventListener('click', onClick)); style.remove(); };
  }, []);

  async function submit(e){
    e.preventDefault(); if (!email || loading) return;
    setLoading(true); setMsg("");
    try{
      const r = await fetch('/api/newsletter', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ email }) });
      const j = await r.json().catch(()=>({ ok:false }));
      if (j && j.ok){ setMsg('Gracias! Suscripcion correcta.'); setTimeout(()=>setOpen(false), 1200); }
      else { setMsg(j && j.error ? j.error : 'No se ha podido suscribir.'); }
    }catch(err){ setMsg('No se ha podido suscribir.'); }
    finally{ setLoading(false); }
  }

  if (!open) return (<div className="pb-newsletter-overlay" />);

  return (
    <div className={"pb-newsletter-overlay " + (open? 'is-open':'') } onClick={()=>setOpen(false)}>
      <div className="pb-newsletter-modal" role="dialog" aria-modal="true" aria-label="Newsletter" onClick={(e)=>e.stopPropagation()}>
        <button className="pb-newsletter-close" onClick={()=>setOpen(false)} aria-label="Cerrar">x</button>
        <h3 className="pb-newsletter-title">Suscribete al newsletter</h3>
        <p className="pb-newsletter-sub">Recibe novedades y lanzamientos por correo.</p>
        <form className="pb-newsletter-row" onSubmit={submit}>
          <input type="email" required placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} className="pb-newsletter-input" />
          <button type="submit" className="pb-newsletter-btn" disabled={loading}>{loading? 'Enviando...':'Suscribirme'}</button>
        </form>
        {msg? <div className="pb-newsletter-msg">{msg}</div> : null}
      </div>
    </div>
  );
}
