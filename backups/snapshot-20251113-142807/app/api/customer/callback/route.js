export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookies = req.headers.get("cookie") || "";

  const stateOk = cookies.includes(`ca_state=${state}`);
  const m = cookies.match(/ca_pkce=([^;]+)/);
  const codeVerifier = m && m[1];

  if (!code || !stateOk || !codeVerifier) {
    return new Response("Invalid OAuth state/PKCE", { status: 400 });
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.SHOPIFY_CA_CLIENT_ID, // público (PKCE), sin secret
    redirect_uri: `${process.env.APP_BASE_URL}/api/customer/callback`,
    code,
    code_verifier: codeVerifier, // <-- PKCE
  });

  const r = await fetch(process.env.SHOPIFY_CA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    return new Response("Token exchange failed: " + txt, { status: 400 });
  }

  const tok = await r.json(); // { access_token, expires_in, ... }
  const maxAge = Math.max(60, (tok.expires_in || 3600) - 60);

  const headers = new Headers();
  // limpia cookies temporales
  headers.append(
    "Set-Cookie",
    `ca_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
  headers.append(
    "Set-Cookie",
    `ca_pkce=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
  // guarda access token del cliente
  headers.append(
    "Set-Cookie",
    `ca_access=${tok.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  );
  // vuelve abriendo la vista de pedidos
  headers.append(
    "Location",
    `${process.env.APP_BASE_URL}/?pb_logged_in=1&show=orders`
  );

  return new Response(null, { status: 302, headers });
}
