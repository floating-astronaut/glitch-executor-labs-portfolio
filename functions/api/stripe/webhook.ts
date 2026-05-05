/**
 * Cloudflare Pages Function — POST /api/stripe/webhook
 *
 * Stripe is configured to deliver webhooks to https://glitchexecutor.com/api/stripe/webhook
 * (apex). The apex is fronted by Cloudflare Pages serving the portfolio site,
 * which has no native handler — it returned 405 for every Stripe POST and the
 * dashboard accumulated 152 retries since 2026-05-02.
 *
 * The actual webhook handler lives on the Flask `payment` service running on
 * the legacy VPS (port 5002). DNS-only subdomain `mcp.glitchexecutor.com`
 * (gray-clouded → 136.115.184.123) bypasses Cloudflare and hits the host
 * nginx, which proxies /api/stripe/webhook → 127.0.0.1:5002.
 *
 * This Function is a thin edge proxy: it forwards the raw POST body and the
 * `stripe-signature` header to the origin and returns the origin response
 * unchanged. Stripe's HMAC verification compares the signature against the
 * exact bytes Stripe signed, so we MUST not parse, transform, or
 * re-serialize the body anywhere along the path.
 *
 * Why a Function and not a redirect: Stripe does not follow redirects on
 * webhook deliveries — a 301/302 reply is treated as a delivery failure.
 * The Function fetches the origin server-side and bridges the response back.
 *
 * Long term this should be replaced by either:
 *   (a) updating the Stripe webhook URL to a host-direct subdomain, or
 *   (b) re-implementing the webhook handler natively on the edge.
 * Both are noted in the COMMUNITY_SERVER follow-ups; until then this proxy
 * keeps subscriptions, checkouts, and customer.* events flowing correctly.
 */

interface Env {
  // Optional override — defaults to the production mcp.glitchexecutor.com host.
  // Useful if the host migrates and DNS for mcp.* gets repointed.
  STRIPE_ORIGIN_URL?: string;
}

const DEFAULT_ORIGIN = 'https://mcp.glitchexecutor.com/api/stripe/webhook';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = env.STRIPE_ORIGIN_URL || DEFAULT_ORIGIN;

  // Forward only the headers Stripe (and the upstream Flask handler) actually
  // care about. Strip CF-internal headers that confuse origin servers, but
  // critically preserve `stripe-signature` and `content-type` byte-for-byte.
  const fwdHeaders = new Headers();
  const passthrough = ['stripe-signature', 'content-type', 'user-agent', 'accept'];
  for (const name of passthrough) {
    const value = request.headers.get(name);
    if (value) fwdHeaders.set(name, value);
  }

  let originResponse: Response;
  try {
    originResponse = await fetch(origin, {
      method: 'POST',
      headers: fwdHeaders,
      // Pass the body as a stream — do NOT call .text()/.json() first.
      // Stream forwarding keeps the bytes Stripe signed identical at origin.
      body: request.body,
      // Cloudflare Workers fetch needs duplex: 'half' when streaming a body.
      // @ts-expect-error — duplex is part of the Workers fetch RequestInit
      duplex: 'half',
      // Webhook deliveries should be quick; fail fast rather than holding
      // the connection if the origin is slow or down.
      cf: { cacheTtl: 0 },
    });
  } catch (err) {
    // If the origin is unreachable, return 502 so Stripe will retry. Returning
    // 500 here would also retry, but 502 is the more accurate gateway error.
    return new Response(
      JSON.stringify({ ok: false, error: 'origin-unreachable', detail: String(err) }),
      { status: 502, headers: { 'content-type': 'application/json' } },
    );
  }

  // Mirror status + body. Don't pass through arbitrary origin headers (CORS,
  // server identification, etc.) — Stripe only inspects status code.
  const body = await originResponse.text();
  return new Response(body, {
    status: originResponse.status,
    headers: { 'content-type': originResponse.headers.get('content-type') || 'application/json' },
  });
};

// Stripe never sends GET, but a friendly response on accidental browser hits
// helps when debugging. Returns 405 the way Stripe expects unsupported verbs.
export const onRequest: PagesFunction = ({ request }) => {
  if (request.method === 'POST') return onRequestPost({ request } as never);
  return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
};
