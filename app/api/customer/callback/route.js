export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookies = req.headers.get("cookie") || "";

  if (!code || !state || !cookies.includes(`ca_state=${state}`)) {
    return new Response("Invalid state", { status: 400 });
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.SHOPIFY_CA_CLIENT_ID, // público/PKCE: sin secret
    redirect_uri: `${process.env.APP_BASE_URL}/api/customer/callback`,
    code,
  });

  const r = await fetch(process.env.SHOPIFY_CA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!r.ok) return new Response("Token exchange failed", { status: 400 });
  const tok = await r.json(); // { access_token, expires_in, ... }

  const maxAge = Math.max(60, (tok.expires_in || 3600) - 60);
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `ca_access=${tok.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  );

  // Vuelve a home, y abre pedidos automáticamente
  headers.append("Location", `${process.env.APP_BASE_URL}/?pb_logged_in=1&show=orders`);
  return new Response(null, { status: 302, headers });
}

