function toBase64Url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function GET() {
  const state = crypto.randomUUID();

  // PKCE code_verifier (43-128 chars)
  const codeVerifier = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
  // code_challenge = BASE64URL( SHA256(code_verifier) )
  const challengeBytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier)
  );
  const codeChallenge = toBase64Url(new Uint8Array(challengeBytes));

  const redirectUri = `${process.env.APP_BASE_URL}/api/customer/callback`;
  const url = new URL(process.env.SHOPIFY_CA_AUTH_URL);
  url.searchParams.set("client_id", process.env.SHOPIFY_CA_CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "openid email customer.read_orders");
  url.searchParams.set("state", state);
  // PKCE
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  const headers = new Headers();
  // guarda state y code_verifier en cookies httpOnly
  headers.append(
    "Set-Cookie",
    `ca_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );
  headers.append(
    "Set-Cookie",
    `ca_pkce=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );
  headers.append("Location", url.toString());

  return new Response(null, { status: 302, headers });
}
