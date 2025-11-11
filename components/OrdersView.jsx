"use client";

import { useEffect, useState } from "react";

// Reuse Shopify client settings
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

const Q_ORDERS = `query Orders($token:String!){
  customer(customerAccessToken:$token){
    id
    firstName
    orders(first:20, reverse:true){
      edges{ node{
        id
        name
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        totalPriceV2{ amount currencyCode }
        lineItems(first:3){ edges{ node{
          title
          quantity
          variant{ image{ url } product{ title } }
        } } }
      } }
    }
  }
}`;

function getToken(){ try { return localStorage.getItem("pb_customer_token") || ""; } catch { return ""; } }
function formatMoney(amount, currency){
  try { return new Intl.NumberFormat("es-ES", { style:"currency", currency: currency||"EUR" }).format(Number(amount||0)); }
  catch { return `${amount} ${currency}`; }
}

function statusLabel(node){
  const f = (node?.fulfillmentStatus||"").toLowerCase();
  if (f.includes("fulfilled") || f.includes("delivered")) return "Entregado";
  if (f.includes("in_progress") || f.includes("in transit") || f.includes("shipped")) return "En camino";
  const fin = (node?.financialStatus||"").toLowerCase();
  if (fin.includes("paid")) return "Confirmado";
  if (fin.includes("pending")) return "Pendiente de pago";
  return node?.fulfillmentStatus || node?.financialStatus || "-";
}

export default function OrdersView(){
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // basic styles
    const style = document.createElement("style");
    style.textContent = `
    .pb-orders__panel{ background:transparent; color:var(--fg); display:flex; flex-direction:column; }
    .pb-orders__grid{ padding:12px 14px 28px; display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:14px; }
    .pb-order{ background:#fff; border:1px solid rgba(0,0,0,.08); border-radius:14px; overflow:hidden; display:flex; flex-direction:column; }
    .pb-order__status{ padding:10px 12px; background:#f7f7f7; }
    .pb-order__thumb{ width:100%; aspect-ratio: 1.1; background:#f3f3f3; display:grid; place-items:center; }
    .pb-order__thumb img{ width:100%; height:100%; object-fit:contain; }
    .pb-order__body{ padding:12px; display:flex; flex-direction:column; gap:6px; }
    .pb-order__btnrow{ display:flex; gap:10px; margin-top:8px; }
    .pb-btn{ background:#111; color:#fff; border:none; padding:10px 14px; border-radius:10px; cursor:pointer; font-weight:700; }
    .pb-btn--ghost{ background:#efefef; color:#111; }
    .pb-orders__empty{ min-height:60vh; display:grid; place-items:center; text-align:center; font-weight:700; font-size:18px; }
    .pb-orders__empty a{ color:#111; text-decoration:underline; }
    `;
    document.head.appendChild(style);

    async function fetchOrders(){
      const token = getToken();
      if (!token){ setOrders([]); return; }
      setLoading(true);
      try{
        const data = await gql(Q_ORDERS, { token });
        const edges = data?.customer?.orders?.edges || [];
        setOrders(edges.map(e => e.node));
      } finally { setLoading(false); }
    }

    fetchOrders();

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  function goCatalog(ev){ ev?.preventDefault?.(); if (window.showCatalog) window.showCatalog(); }

  return (
    <section className="pb-orders__panel" aria-label="Tus pedidos">

        {loading && <div className="pb-orders__head" style={{opacity:.7}}>Cargando…</div>}

      {!loading && (!orders || orders.length===0) && (
        <div className="pb-orders__empty">
          <div>
            No hay pedidos todavía, <a href="/" onClick={goCatalog}>¡corre a comprar!</a>
          </div>
        </div>
      )}

      {!loading && orders && orders.length>0 && (
        <div className="pb-orders__grid">
          {orders.map((o)=>{
              const img = o?.lineItems?.edges?.[0]?.node?.variant?.image?.url;
              const qty = o?.lineItems?.edges?.reduce((s, e)=> s + (e?.node?.quantity||0), 0) || 1;
              return (
                <div key={o.id} className="pb-order">
                  <div className="pb-order__status">
                    <div style={{fontWeight:700}}>{statusLabel(o)}</div>
                    <div style={{opacity:.7, fontSize:12}}>{new Date(o.processedAt).toLocaleDateString('es-ES')}</div>
                  </div>
                  <div className="pb-order__thumb">
                    {img ? <img src={img} alt={o.name||'Pedido'} /> : <div style={{opacity:.6}}>Sin imagen</div>}
                  </div>
                  <div className="pb-order__body">
                    <div style={{opacity:.8, fontSize:12}}>{qty} artículo{o && qty!==1?'s':''}</div>
                    <div style={{opacity:.8, fontSize:12}}>Pedido {o.name || ('#'+o.orderNumber)}</div>
                    <div style={{fontWeight:700}}>{o.totalPriceV2 ? formatMoney(o.totalPriceV2.amount, o.totalPriceV2.currencyCode) : ''}</div>
                    <div className="pb-order__btnrow">
                      <a className="pb-btn" href="/" onClick={goCatalog}>Volver a comprar</a>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}
