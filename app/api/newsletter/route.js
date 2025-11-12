export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !/.+@.+\..+/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'Email inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const domain = process.env.SHOPIFY_DOMAIN || 'qhzkkr-2d.myshopify.com';
    const sfToken = process.env.SHOPIFY_STOREFRONT_TOKEN || process.env.STOREFRONT_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
    const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-10';
    if (!sfToken) {
      return new Response(JSON.stringify({ ok: false, error: 'Falta SHOPIFY_STOREFRONT_TOKEN en el servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    async function sfGql(query, variables) {
      const r = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': sfToken
        },
        body: JSON.stringify({ query, variables })
      });
      const j = await r.json();
      return { status: r.status, json: j };
    }

    // 1) Try to create the customer with acceptsMarketing only (no password)
    const MUT_CREATE = `mutation($input: CustomerCreateInput!){
      customerCreate(input:$input){ customer{ id } customerUserErrors{ field message code }
      }
    }`;
    let create = await sfGql(MUT_CREATE, { input: { email, acceptsMarketing: true } });
    let errs = create?.json?.data?.customerCreate?.customerUserErrors || [];
    if (!errs || errs.length === 0) {
      return new Response(JSON.stringify({ ok: true, mode: 'create' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const errText = errs.map(e=>e?.message||'').join('; ');
    const isTaken = /taken|existe|ya existe/i.test(errText);
    const needPassword = /password/i.test(errText);

    // 2) If Shopify requires password to create, generate a strong one and create the account (still with acceptsMarketing)
    if (needPassword) {
      const pwd = `Sb_${Date.now()}_${Math.random().toString(36).slice(2)}!A`; // random strong-ish
      create = await sfGql(MUT_CREATE, { input: { email, acceptsMarketing: true, password: pwd, passwordConfirmation: pwd } });
      errs = create?.json?.data?.customerCreate?.customerUserErrors || [];
      if (!errs || errs.length === 0) {
        return new Response(JSON.stringify({ ok: true, mode: 'create_with_password' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 3) If email already exists, attempt to update marketing consent via Storefront (best-effort)
    // Some stores expose a mutation to update email marketing consent by email in Storefront.
    const MUT_CONSENT = `mutation customerEmailMarketingConsentUpdate($email: String!, $consent: CustomerEmailMarketingConsentInput!){
      customerEmailMarketingConsentUpdate(email:$email, consent:$consent){ userErrors{ field message code } }
    }`;
    const consentVars = {
      email,
      consent: {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
        consentUpdatedAt: new Date().toISOString()
      }
    };
    const upd = await sfGql(MUT_CONSENT, consentVars);
    const updErrs = upd?.json?.data?.customerEmailMarketingConsentUpdate?.userErrors || [];
    if (!updErrs || updErrs.length === 0) {
      return new Response(JSON.stringify({ ok: true, mode: 'update' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'No se pudo crear/actualizar via Storefront', details: { createErrors: errs, updateErrors: updErrs } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Error del servidor' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

