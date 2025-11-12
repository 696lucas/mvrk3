export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !/.+@.+\..+/.test(email)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Email inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const domain = process.env.SHOPIFY_DOMAIN || 'qhzkkr-2d.myshopify.com';
    const sfToken = process.env.SHOPIFY_STOREFRONT_TOKEN || process.env.STOREFRONT_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
    const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-10';

    // 1) Intento principal: emular el formulario de newsletter (/contact)
    try {
      const form = new URLSearchParams();
      form.set('form_type', 'customer');
      form.set('utf8', '✓');
      form.set('contact[email]', email);
      form.set('contact[tags]', 'newsletter,prospect,headless');

      const r = await fetch(`https://${domain}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'mvrk3-newsletter/1.0' },
        body: form,
        redirect: 'manual',
      });
      if (r.status >= 200 && r.status < 400) {
        return new Response(
          JSON.stringify({ ok: true, mode: 'contact' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (_) {
      // seguimos al fallback
    }

    // 2) Fallback: Storefront GraphQL creando cliente con acceptsMarketing
    if (!sfToken) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No se pudo suscribir en /contact y falta SHOPIFY_STOREFRONT_TOKEN para fallback' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    async function sfGql(query, variables) {
      const r = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': sfToken,
        },
        body: JSON.stringify({ query, variables }),
      });
      const j = await r.json().catch(() => ({}));
      return { status: r.status, json: j };
    }

    const MUT_CREATE = `mutation($input: CustomerCreateInput!){
      customerCreate(input:$input){ customer{ id } customerUserErrors{ field message code }
      }
    }`;
    const pwd = `Sb_${Date.now()}_${Math.random().toString(36).slice(2)}!A`;
    const create = await sfGql(MUT_CREATE, { input: { email, acceptsMarketing: true, password: pwd, passwordConfirmation: pwd } });
    const errs = create?.json?.data?.customerCreate?.customerUserErrors || [];
    if (!errs || errs.length === 0) {
      return new Response(JSON.stringify({ ok: true, mode: 'create_with_password' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    const errText = errs.map(e => e?.message || '').join('; ');
    const isTaken = /taken|existe|ya existe|already/i.test(errText);
    if (isTaken) {
      return new Response(JSON.stringify({ ok: true, mode: 'exists' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'No se pudo suscribir', details: { createErrors: errs } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Error del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

