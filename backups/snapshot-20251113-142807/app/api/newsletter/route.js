export const runtime = "nodejs";

const ADMIN_API_VERSION = "2024-10";
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

async function shopifyAdmin(query, variables = {}, operationName) {
  const body = { query, variables };
  if (operationName) body.operationName = operationName;

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Shopify Admin API error: ${res.status} ${text}`);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Respuesta no JSON desde Shopify: ${text.slice(0, 300)}`);
  }

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

    // 1) Intentar crear el cliente (ya suscrito)
    const createMutation = /* GraphQL */ `
      mutation CreateCustomer($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer { id email emailMarketingConsent { marketingState } }
          userErrors { field message code }
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
    const createData = await shopifyAdmin(createMutation, createVars, "CreateCustomer");
    const createPayload = createData && createData.customerCreate;
    const createErrors = (createPayload && createPayload.userErrors) || [];

    if (!createErrors.length && createPayload && createPayload.customer) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const alreadyExists = createErrors.some((e) => {
      const m = String((e && e.message) || "").toLowerCase();
      return m.includes("already") || m.includes("taken") || e?.code === "TAKEN";
    });

    if (!alreadyExists) {
      const scopeErr = createErrors.find((e) => /access denied|required access: write_customers/i.test(String(e && e.message)));
      const msg = scopeErr
        ? "Falta el scope write_customers en tu token de Admin API."
        : (createErrors.map((e) => e.message).join(" / ") || "Error creando cliente");
      return new Response(JSON.stringify({ ok: false, error: msg }), { status: 400 });
    }

    // 2) Buscar cliente existente por email
    const queryCustomer = /* GraphQL */ `
      query FindCustomer($q: String!) {
        customers(first: 1, query: $q) {
          edges { node { id email } }
        }
      }
    `;
    const q = `email:"${String(email).replace(/"/g, '\\"')}"`;
    const find = await shopifyAdmin(queryCustomer, { q }, "FindCustomer");
    const edge = find && find.customers && find.customers.edges && find.customers.edges[0];
    const customerId = edge && edge.node && edge.node.id;
    if (!customerId) {
      return new Response(JSON.stringify({ ok: false, error: "No se pudo localizar el cliente existente" }), { status: 404 });
    }

    // 3) Actualizar consentimiento con la mutación dedicada
    const consentMutation = /* GraphQL */ `
      mutation UpdateConsent($input: CustomerEmailMarketingConsentUpdateInput!) {
        customerEmailMarketingConsentUpdate(input: $input) {
          customer { id email emailMarketingConsent { marketingState marketingOptInLevel consentUpdatedAt } }
          userErrors { field message code }
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
    const consentData = await shopifyAdmin(consentMutation, consentVars, "UpdateConsent");
    const consentErrors = (consentData && consentData.customerEmailMarketingConsentUpdate && consentData.customerEmailMarketingConsentUpdate.userErrors) || [];
    if (consentErrors.length) {
      const scopeErr = consentErrors.find((e) => /access denied|required access: write_customers/i.test(String(e && e.message)));
      const msg = scopeErr
        ? "Falta el scope write_customers en tu token de Admin API."
        : consentErrors.map((e) => e.message).join(" / ");
      return new Response(JSON.stringify({ ok: false, error: msg }), { status: 400 });
    }

    // 4) Añadir tags
    const tagsMutation = /* GraphQL */ `
      mutation AddTags($id: ID!, $tags: [String!]!) {
        tagsAdd(id: $id, tags: $tags) {
          userErrors { field message }
        }
      }
    `;
    const tagsVars = { id: customerId, tags: ["newsletter", "pb-newsletter"] };
    const tagsData = await shopifyAdmin(tagsMutation, tagsVars, "AddTags");
    const tagErrors = (tagsData && tagsData.tagsAdd && tagsData.tagsAdd.userErrors) || [];
    if (tagErrors.length) {
      return new Response(JSON.stringify({ ok: false, error: tagErrors.map((e) => e.message).join(" / ") }), { status: 400 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    const raw = String((err && err.message) || "Error desconocido");
    const pretty = raw.length > 400 ? raw.slice(0, 400) + "…" : raw;
    return new Response(JSON.stringify({ ok: false, error: pretty }), { status: 500 });
  }
}

