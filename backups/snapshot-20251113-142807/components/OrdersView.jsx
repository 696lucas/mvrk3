"use client";

import { useEffect, useState } from "react";

export default function OrdersView() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetch("/api/customer/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => setOrders([]));
  }, []);

  if (orders === null) return <p style={{padding:16}}>Cargando pedidos…</p>;

  if (!orders.length) {
    return (
      <div style={{ padding: 16 }}>
        <p>No hay pedidos todavía o necesitamos conectar tu cuenta.</p>
        <a href="/api/customer/login" className="pb-acc__btn">Conectar pedidos</a>
      </div>
    );
  }

  return (
    <div className="pb-orders" style={{ padding: 16 }}>
      {orders.map((o) => (
        <div key={o.id} className="pb-order" style={{ marginBottom: 16 }}>
          <div className="pb-order__head" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <strong>{o.name}</strong>
            <span>{new Date(o.processedAt).toLocaleDateString("es-ES")}</span>
            <span>
              {o.totalPriceSet.presentmentMoney.amount}{" "}
              {o.totalPriceSet.presentmentMoney.currencyCode}
            </span>
          </div>
          <ul className="pb-order__lines" style={{ margin: "8px 0 0" }}>
            {o.lineItems.edges.map((li, i) => (
              <li key={i}>
                {li.node.title} × {li.node.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

