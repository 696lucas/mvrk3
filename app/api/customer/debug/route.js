export async function GET(req) {
  const cookie = req.headers.get("cookie") || "";
  const hasState = /(?:^|;\s*)ca_state=/.test(cookie);
  const hasPkce = /(?:^|;\s*)ca_pkce=/.test(cookie);
  const hasAccess = /(?:^|;\s*)ca_access=/.test(cookie);
  const host = req.headers.get("host") || null;
  return new Response(
    JSON.stringify({ hasState, hasPkce, hasAccess, host }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

