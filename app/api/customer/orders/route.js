const ORDERS_QUERY = `
  query OrdersFirst20 {
    customer {
      id
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPriceSet { presentmentMoney { amount currencyCode } }
            lineItems(first: 50) {
              edges { node { title quantity } }
            }
          }
        }
      }
    }
  }
`;

export async function GET(req) {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/ca_access=([^;]+)/);
  const access = m && m[1];

  // Sin token → lista vacía (UI mostrará botón “Conectar pedidos”)
  if (!access) {
    return new Response(JSON.stringify({ orders: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const r = await fetch(process.env.SHOPIFY_CA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({ query: ORDERS_QUERY }),
  });

  if (!r.ok) {
    const t = await r.text().catch(() => "");
    return new Response(JSON.stringify({ orders: [], error: t }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await r.json();
  const edges = data?.data?.customer?.orders?.edges || [];
  const orders = edges.map((e) => e.node);

  return new Response(JSON.stringify({ orders }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
