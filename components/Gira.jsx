"use client";
import { useEffect, useRef } from "react";
import { useView } from "./view/ViewContext";

export default function Gira(){
  const { setView } = useView();
  const prevFocusRef = useRef(null);

  useEffect(() => {
    prevFocusRef.current = document.activeElement;
    return () => {
      const prev = prevFocusRef.current; if (prev && prev.focus) prev.focus();
    };
  }, []);

  return (
    <main style={{minHeight:'100svh', display:'grid', placeItems:'center', color:'#fff'}}>
      <div style={{textAlign:'center'}}>
        <h1>Gira — próximamente</h1>
        <button onClick={() => setView('landing')} aria-label="Volver a inicio" style={{marginTop:12, padding:'8px 12px', borderRadius:8}}>Volver</button>
      </div>
    </main>
  );
}

