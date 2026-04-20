/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Responsibilities:
 *   1. Verify Turnstile token server-side (required — server trusts nothing from the client).
 *   2. Validate + sanitize form fields.
 *   3. Drop honeypot submissions silently.
 *   4. Deliver the message to any configured sink (Resend email, Slack, generic
 *      webhook). Multiple sinks can be active at once; each fires in parallel.
 *
 * Env (wire in Cloudflare Pages dashboard):
 *   TURNSTILE_SECRET      — Turnstile secret key (required in prod).
 *   RESEND_API_KEY        — Resend API key. When set, sends the message to RESEND_TO.
 *   RESEND_FROM           — optional; default 'Glitch Executor Labs <support@glitchexecutor.com>'.
 *                           Must be an address on a domain verified in your Resend account.
 *   RESEND_TO             — optional; default 'support@glitchexecutor.com'.
 *   SLACK_WEBHOOK_URL     — optional; POSTs a formatted Block Kit message.
 *   CONTACT_FORWARD_URL   — optional; POSTs raw JSON to any endpoint.
 *
 * No third-party SDKs — just `fetch` — so the worker stays under the Cloudflare
 * free-tier CPU budget on a cold start.
 */

export interface Env {
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_TO?: string;
  SLACK_WEBHOOK_URL?: string;
  CONTACT_FORWARD_URL?: string;
}

interface Payload {
  name: string;
  email: string;
  company: string;
  message: string;
  token: string;
}

const MAX_LEN = { name: 200, email: 200, company: 200, message: 4000 } as const;
const DEFAULT_FROM = 'Glitch Executor Labs <support@glitchexecutor.com>';
const DEFAULT_TO   = 'support@glitchexecutor.com';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const contentType = request.headers.get('content-type') ?? '';
  let form: FormData;
  try {
    form = contentType.includes('application/json')
      ? jsonToForm(await request.json())
      : await request.formData();
  } catch {
    return json({ ok: false, error: 'bad-request' }, 400);
  }

  // Honeypot: drop silently.
  if (form.get('company_url')) {
    return json({ ok: true }, 200);
  }

  const payload: Payload = {
    name:    clean(form.get('name'),    MAX_LEN.name),
    email:   clean(form.get('email'),   MAX_LEN.email),
    company: clean(form.get('company'), MAX_LEN.company),
    message: clean(form.get('message'), MAX_LEN.message),
    token:   clean(form.get('cf-turnstile-response'), 4096),
  };

  if (!payload.name || !payload.email || !payload.message) {
    return json({ ok: false, error: 'missing-fields' }, 400);
  }
  if (!isEmail(payload.email)) {
    return json({ ok: false, error: 'bad-email' }, 400);
  }

  // Verify Turnstile — skipped only when TURNSTILE_SECRET is absent (dev).
  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(payload.token, env.TURNSTILE_SECRET, clientIp(request));
    if (!ok) return json({ ok: false, error: 'turnstile-failed' }, 403);
  }

  await forward(payload, env, request);
  return json({ ok: true });
};

function jsonToForm(obj: unknown): FormData {
  const fd = new FormData();
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      fd.set(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  }
  return fd;
}

function clean(v: FormDataEntryValue | null, max: number): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', body,
  });
  if (!r.ok) return false;
  const data = (await r.json()) as { success: boolean };
  return data.success === true;
}

async function forward(p: Payload, env: Env, req: Request): Promise<void> {
  const ref = req.headers.get('referer') ?? '';
  const ua  = req.headers.get('user-agent') ?? '';
  const ip  = clientIp(req);
  const ts  = new Date().toISOString();

  // Derive a site label for subject lines: prefer the hostname from the
  // Referer header (the origin the form was submitted from), fall back to
  // the request's Host header.
  let site = 'glitchexecutor.com';
  try {
    if (ref) site = new URL(ref).hostname;
    else site = (req.headers.get('host') || '').replace(/^www\./, '') || site;
  } catch { /* ignore bad referer */ }

  const tasks: Promise<unknown>[] = [];

  // ── Resend: send the message as an email to RESEND_TO ──────────────────
  if (env.RESEND_API_KEY) {
    const from = env.RESEND_FROM || DEFAULT_FROM;
    const to   = env.RESEND_TO   || DEFAULT_TO;

    const subject = `[${site}] New contact from ${p.name}`;
    const plain =
`New contact from ${site}

Name:     ${p.name}
Email:    ${p.email}
Company:  ${p.company || '—'}
IP:       ${ip || '—'}
UA:       ${ua || '—'}
Referer:  ${ref || '—'}
Received: ${ts}

Message:
${p.message}
`;
    const html =
`<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a0a0f;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <h2 style="margin:0 0 8px 0;font-size:18px;border-bottom:2px solid #00ff88;padding-bottom:8px;">New contact from ${esc(site)}</h2>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;width:110px;color:#6b7280;">Name</td><td style="padding:6px 0;">${esc(p.name)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(p.email)}" style="color:#0088ff;">${esc(p.email)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Company</td><td style="padding:6px 0;">${esc(p.company || '—')}</td></tr>
    </table>
    <h3 style="margin:24px 0 8px 0;font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:.04em;">Message</h3>
    <div style="padding:12px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;white-space:pre-wrap;font-size:14px;line-height:1.55;">${esc(p.message)}</div>
    <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">
    <p style="color:#9ca3af;font-size:11px;line-height:1.5;margin:0;">
      IP: ${esc(ip || '—')}<br>
      UA: ${esc(ua || '—')}<br>
      Referer: ${esc(ref || '—')}<br>
      Received: ${esc(ts)}
    </p>
  </div>
</body></html>`;

    tasks.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: p.email,
        subject,
        text: plain,
        html,
      }),
    }));
  }

  // ── Slack webhook (optional) ───────────────────────────────────────────
  if (env.SLACK_WEBHOOK_URL) {
    tasks.push(fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: `:cobra: New contact on ${site}: *${p.name}* (${p.email})`,
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: `New contact on ${site}` } },
          { type: 'section', fields: [
            { type: 'mrkdwn', text: `*Name*\n${p.name}` },
            { type: 'mrkdwn', text: `*Email*\n${p.email}` },
            { type: 'mrkdwn', text: `*Company*\n${p.company || '—'}` },
            { type: 'mrkdwn', text: `*IP*\n${ip || '—'}` },
          ]},
          { type: 'section', text: { type: 'mrkdwn', text: `*Message*\n${p.message}` } },
          { type: 'context', elements: [{ type: 'mrkdwn', text: `ref: ${ref} · ua: ${ua}` }] },
        ],
      }),
    }));
  }

  // ── Generic JSON forward (optional) ────────────────────────────────────
  if (env.CONTACT_FORWARD_URL) {
    tasks.push(fetch(env.CONTACT_FORWARD_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...p, token: undefined, site, ref, ua, ip, ts }),
    }));
  }

  await Promise.allSettled(tasks);
}

function clientIp(req: Request): string {
  return req.headers.get('cf-connecting-ip')
      ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? '';
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function esc(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => (
    c === '&' ? '&amp;' :
    c === '<' ? '&lt;'  :
    c === '>' ? '&gt;'  :
    c === '"' ? '&quot;' :
                '&#39;'
  ));
}
