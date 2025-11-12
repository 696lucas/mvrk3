export async function GET() {
  const state = crypto.randomUUID();
  const redirectUri = `${process.env.APP_BASE_URL}/api/customer/callback`;

  const url = new URL(process.env.SHOPIFY_CA_AUTH_URL);
  url.searchParams.set("client_id", process.env.SHOPIFY_CA_CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "openid email customer.read_orders");
  url.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": `ca_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax`,
      Location: url.toString(),
    },
  });
}

