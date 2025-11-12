export const runtime = "nodejs";

const ADMIN_API_VERSION = "2024-10";
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

async function shopifyAdmin(query, variables = {}) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify Admin API error: ${res.status} ${text}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !validEmail(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Email no válido" }), { status: 400 });
    }
    if (!SHOPIFY_DOMAIN || !ADMIN_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: "Faltan credenciales de Shopify" }), { status: 500 });
    }

    const nowISO = new Date().toISOString();

    const createMutation = `
      mutation CreateCustomer($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer { id email emailMarketingConsent { marketingState } }
          userErrors { field message }
        }
      }
    `;
    const createVars = {
      input: {
        email,
        tags: ["newsletter", "pb-newsletter"],
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN",
          consentUpdatedAt: nowISO,
        },
      },
    };
    const createData = await shopifyAdmin(createMutation, createVars);
    const createErrors = createData.customerCreate.userErrors || [];
    if (createErrors.length === 0 && createData.customerCreate.customer) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const alreadyExists = createErrors.some(e => {
      const m = (e?.message || "").toLowerCase();
      return m.includes("already") || m.includes("taken");
    });
    if (!alreadyExists) {
      return new Response(
        JSON.stringify({ ok: false, error: createErrors.map(e => e.message).join(" / ") || "Error creando cliente" }),
        { status: 400 }
      );
    }

    const queryCustomer = `
      query FindCustomer($query: String!) {
        customers(first: 1, query: $query) {
          edges { node { id email } }
        }
      }
    `;
    const find = await shopifyAdmin(queryCustomer, { query: `email:${JSON.stringify(email)}` });
    const edge = find?.customers?.edges?.[0];
    const customerId = edge?.node?.id;
    if (!customerId) {
      return new Response(JSON.stringify({ ok: false, error: "No se pudo localizar el cliente existente" }), { status: 404 });
    }

    // 1) Actualizar consentimiento de marketing con la mutación dedicada
    const consentMutation = `
      mutation UpdateConsent($input: CustomerEmailMarketingConsentUpdateInput!) {
        customerEmailMarketingConsentUpdate(input: $input) {
          customer { id email emailMarketingConsent { marketingState } }
          userErrors { field message }
        }
      }
    `;
    const consentVars = {
      input: {
        customerId,
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN",
          consentUpdatedAt: nowISO,
        },
      },
    };
    const consentData = await shopifyAdmin(consentMutation, consentVars);
    const consentErrors = consentData.customerEmailMarketingConsentUpdate.userErrors || [];
    if (consentErrors.length) {
      return new Response(
        JSON.stringify({ ok: false, error: consentErrors.map(e => e.message).join(" / ") }),
        { status: 400 }
      );
    }

    // 2) Añadir tags al cliente (si no están)
    const tagsMutation = `
      mutation AddTags($id: ID!, $tags: [String!]!) {
        tagsAdd(id: $id, tags: $tags) {
          userErrors { field message }
        }
      }
    `;
    const tagsVars = { id: customerId, tags: ["newsletter", "pb-newsletter"] };
    const tagsData = await shopifyAdmin(tagsMutation, tagsVars);
    const tagErrors = tagsData.tagsAdd?.userErrors || [];
    if (tagErrors.length) {
      return new Response(
        JSON.stringify({ ok: false, error: tagErrors.map(e => e.message).join(" / ") }),
        { status: 400 }
      );
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message || "Error desconocido" }), { status: 500 });
  }
}
