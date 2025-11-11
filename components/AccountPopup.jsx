"use client";

import { useEffect, useState } from "react";

// Minimal Shopify Storefront client (aligned with CartDrawer)
const SHOPIFY_DOMAIN = "qhzkkr-2d.myshopify.com";
const STOREFRONT_TOKEN = "b919997de07b4172affb1803d79a6509";
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2025-01/graphql.json`;

async function gql(query, variables = {}) {
  const r = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) console.error(j.errors);
  return j.data;
}

const MUT_LOGIN = `mutation Login($email:String!, $password:String!){
  customerAccessTokenCreate(input:{email:$email, password:$password}){
    customerAccessToken{ accessToken expiresAt }
    userErrors{ field message }
  }
}`;

const MUT_REGISTER = `mutation Register($email:String!, $password:String!, $firstName:String, $lastName:String){
  customerCreate(input:{ email:$email, password:$password, firstName:$firstName, lastName:$lastName }){
    customer{ id }
    userErrors{ field message }
  }
}`;

const Q_CUSTOMER = `query Me($token:String!){
  customer(customerAccessToken:$token){
    id
    firstName
    lastName
    email
    orders(first:10, sortKey: PROCESSED_AT, reverse:true){
      edges{ node{
        id
        name
        orderNumber
        processedAt
        totalPriceV2{ amount currencyCode }
        financialStatus
        fulfillmentStatus
      } }
    }
  }
}`;

function getToken(){ try { return localStorage.getItem("pb_customer_token") || ""; } catch { return ""; } }
function setToken(v){ try { if(!v) localStorage.removeItem("pb_customer_token"); else localStorage.setItem("pb_customer_token", v); } catch {} }

function formatMoney(amount, currency){
  try { return new Intl.NumberFormat("es-ES", { style:"currency", currency: currency||"EUR" }).format(Number(amount||0)); }
  catch { return `${amount} ${currency}`; }
}

export default function AccountPopup(){
  const [open, setOpen] = useState(false);            // small dropdown near icon
  const [mode, setMode] = useState("login"); // login | register | profile
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // Inject minimal styles
    const style = document.createElement("style");
    style.textContent = `
    /* Small dropdown near the user icon */
    #pb-account-dlg{ position:fixed; inset:0; z-index:100001; display:none; }
    #pb-account-dlg.is-open{ display:block; }
    .pb-acc__overlay{ position:absolute; inset:0; background:transparent; }
    .pb-acc__panel{ position:absolute; top:64px; right:12px; width:min(92vw, 360px); background:#fff; color:#111; border-radius:12px; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,.25); border:1px solid rgba(0,0,0,.06); }
    .pb-acc__head{ padding:12px 14px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(0,0,0,.08); font-weight:700; }
    .pb-acc__body{ padding:14px; display:flex; flex-direction:column; gap:12px; max-height:70vh; overflow:auto; }
    .pb-acc__tabs{ display:flex; gap:6px; padding:0 14px 10px; border-bottom:1px solid rgba(0,0,0,.06); }
    .pb-acc__tab{ background:#f4f4f4; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:700; }
    .pb-acc__tab.active{ background:#111; color:#fff; }
    .pb-acc__row{ display:flex; flex-direction:column; gap:6px; }
    .pb-acc__input{ padding:10px 12px; border:1px solid #ddd; border-radius:8px; font-size:14px; }
    .pb-acc__btn{ background:#111; color:#fff; border:none; padding:10px 14px; border-radius:8px; cursor:pointer; font-weight:700; }
    .pb-acc__btn--sec{ background:#efefef; color:#111; }
    .pb-acc__err{ color:#d00; font-size:13px; }
    .pb-acc__orders{ display:flex; flex-direction:column; gap:10px; }
    .pb-acc__order{ padding:10px; border:1px solid #eee; border-radius:10px; }

    /* Orders view styles moved to OrdersView */
    `;
    document.head.appendChild(style);

    // Global open/close helpers
    window.openAccountPopup = () => {
      setError("");
      const existing = getToken();
      if (existing) { fetchCustomer(existing); setMode("profile"); }
      else { setMode("login"); }
      setOpen(true);
    };
    window.closeAccountPopup = () => setOpen(false);
    // Delegate to page-level toggles
    window.openOrdersPopup = () => { if (window.showOrders) window.showOrders(); };
    window.closeOrdersPopup = () => { if (window.showCatalog) window.showCatalog(); };

    // No extra listeners here; handled in OrdersView

    return () => {
      try{ document.head.removeChild(style); }catch{}
      delete window.openAccountPopup;
      delete window.closeAccountPopup;
      delete window.openOrdersPopup;
      delete window.closeOrdersPopup;
    };
  }, []);

  async function fetchCustomer(token){
    setLoading(true); setError("");
    try{
      const data = await gql(Q_CUSTOMER, { token });
      setCustomer(data?.customer || null);
    }catch(e){
      console.error(e);
      setError("No se pudo cargar el perfil.");
    }finally{ setLoading(false); }
  }

  async function handleLogin(e){
    e?.preventDefault(); setLoading(true); setError("");
    try{
      const data = await gql(MUT_LOGIN, { email, password });
      const res = data?.customerAccessTokenCreate;
      const err = res?.userErrors?.[0]?.message;
      if (err){ setError(err); return; }
      const token = res?.customerAccessToken?.accessToken;
      if (token){ setToken(token); setMode("profile"); await fetchCustomer(token); }
      else setError("Error al iniciar sesión");
    }catch(ex){ setError("Error al iniciar sesión"); }
    finally{ setLoading(false); }
  }

  async function handleRegister(e){
    e?.preventDefault(); setLoading(true); setError("");
    try{
      const data = await gql(MUT_REGISTER, { email, password, firstName, lastName });
      const res = data?.customerCreate;
      const err = res?.userErrors?.[0]?.message;
      if (err){ setError(err); return; }
      // Auto-login after registration
      await handleLogin();
    }catch(ex){ setError("Error al registrarse"); }
    finally{ setLoading(false); }
  }

  function handleLogout(){ setToken(""); setCustomer(null); setMode("login"); }

  function openOrders(){
    if (!customer){
      const t = getToken();
      if (t) fetchCustomer(t);
    }
    if (window.showOrders) window.showOrders();
    setOpen(false);
  }

  return (
    <>
    <div id="pb-account-dlg" className={open ? "is-open" : ""} aria-hidden={!open}>
      <div className="pb-acc__overlay" onClick={()=>setOpen(false)} />
      <div className="pb-acc__panel" role="dialog" aria-modal="true" aria-label="Cuenta">
        <div className="pb-acc__head">
          <span>{mode === "profile" ? "Perfil" : mode === "register" ? "Crear cuenta" : "Iniciar sesión"}</span>
          <button className="pb-acc__btn pb-acc__btn--sec" onClick={()=>setOpen(false)}>Cerrar</button>
        </div>

        {mode !== "profile" && (
          <div>
            <div className="pb-acc__tabs">
              <button className={"pb-acc__tab "+(mode==='login'?'active':'')} onClick={()=>setMode('login')}>Iniciar sesión</button>
              <button className={"pb-acc__tab "+(mode==='register'?'active':'')} onClick={()=>setMode('register')}>Registrarse</button>
            </div>
            <div className="pb-acc__body">
              {mode === 'register' && (
                <>
                  <div className="pb-acc__row">
                    <label>Nombre</label>
                    <input className="pb-acc__input" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Nombre" />
                  </div>
                  <div className="pb-acc__row">
                    <label>Apellido</label>
                    <input className="pb-acc__input" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Apellido" />
                  </div>
                </>
              )}
              <div className="pb-acc__row">
                <label>Email</label>
                <input type="email" className="pb-acc__input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
              </div>
              <div className="pb-acc__row">
                <label>Contraseña</label>
                <input type="password" className="pb-acc__input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="******" />
              </div>
              {error && <div className="pb-acc__err">{error}</div>}
              <button disabled={loading} className="pb-acc__btn" onClick={mode==='login'?handleLogin:handleRegister}>
                {loading ? 'Procesando…' : mode==='login' ? 'Entrar' : 'Crear cuenta'}
              </button>
            </div>
          </div>
        )}

        {mode === "profile" && (
          <div className="pb-acc__body">
            {loading && <div>Cargando…</div>}
            {!loading && (
              <>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
                  <div>
                    <div style={{fontWeight:700}}>Hola {customer?.firstName || ''} {customer?.lastName || ''}</div>
                    <div style={{opacity:.8, fontSize:13}}>{customer?.email}</div>
                  </div>
                </div>
                <div style={{display:'flex', gap:8, marginTop:8}}>
                  <button className="pb-acc__btn" onClick={openOrders}>Ver tus pedidos</button>
                  <button className="pb-acc__btn pb-acc__btn--sec" onClick={handleLogout}>Cerrar sesión</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Orders view handled by OrdersView component */}
    </>
  );
}
