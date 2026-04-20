# Glitch Executor Labs Portfolio

Master portfolio site for **Glitch Executor Labs** — the root brand behind
Glitch Trade (AI trading), Glitch Edge (betting), and Glitch Grow
(AI digital marketing).

## What it is

- Public website for the parent brand `glitchexecutor.com`.
- Navigation hub that links out to the three sub-brand marketing sites.
- Holds portfolio-level copy: hero, portfolio grid, how-we-work, milestones, FAQ, contact.
- Not a product pitch page — product-specific copy lives on the sub-brand sites.

## Live site

- https://glitchexecutor.com

## Product lines

- **Glitch Trade** — AI trading systems and strategy architecture
- **Glitch Edge** — sports intelligence engines
- **Glitch Grow** — AI growth, ads, and voice automation

## Sister sites

- https://trade.glitchexecutor.com — Glitch Trade
- https://edge.glitchexecutor.com — Glitch Edge
- https://grow.glitchexecutor.com — Glitch Grow

## Related repos

- [glitch-trading-core](https://github.com/glitch-exec-labs/glitch-trading-core)
- [glitch-grow-site](https://github.com/glitch-exec-labs/glitch-grow-site) — Astro template this was built from
- [glitch-edge-site](https://github.com/glitch-exec-labs/glitch-edge-site)
- [glitch-exec-labs-profile](https://github.com/glitch-exec-labs/.github) — GitHub org profile
- [glitch-brand-assets](https://github.com/glitch-exec-labs/glitch-brand-assets)

## Brand note

All four sites (portfolio + Trade / Edge / Grow) share the same cyber-cobra
mascot, the same Astro scaffolding, and the same design-token pipeline — by
design. Improvements to any one of them are meant to flow back to the others.

---

Production-grade Astro site. Dark-first, token-driven, compiled Tailwind,
self-hosted fonts, zero paid dependencies.

Deploy target: **Cloudflare Pages** — `output: 'static'` build, with runtime
endpoints served by Pages Functions out of `/functions/` (no Astro adapter).

## Stack

- **Astro** static output; runtime endpoints via CF Pages Functions
- **Tailwind CSS** compiled (no CDN) with semantic tokens via CSS variables
- **TypeScript** strict
- **Motion One** entrance animations + **Lenis** smooth scroll (both respect `prefers-reduced-motion`)
- **Astro `<Image>`** (sharp → AVIF/WebP) for brand assets
- **Satori + resvg** for per-page dynamic OG cards (prerendered at build)
- **Cloudflare Turnstile** on the contact form → Cloudflare Pages Function (`functions/api/contact.ts`)
- **Plausible / Umami** analytics hook (opt-in via env, renders nothing if unset)
- **Playwright** smoke tests + **Lighthouse CI** performance budget

## Scripts

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # produces ./dist (static) + CF Pages Functions
npm run preview      # preview built site
npm run test         # Playwright smoke (builds + serves automatically)
npm run check        # astro check (type + template)
```

## Project layout

```
public/
  assets/brand/...     # favicons, mascot, OG image (shared across Glitch Executor sites)
  robots.txt
  site.webmanifest
src/
  assets/mascot-512.png     # sharp-piped through <Image>
  components/
    Icon.astro              # SVG icon set (replaces emoji)
    ImageSlot.astro         # placeholders for imagery
    Nav.astro Footer.astro
    ContactForm.astro       # Turnstile-wired
    JsonLd.astro Analytics.astro Mascot.astro
    sections/               # Hero, Portfolio, How, Milestones, FAQ, Contact
  content/
    config.ts               # empty collection shim (future-proofing)
  layouts/Base.astro        # head, JSON-LD, ViewTransitions, skip-link
  lib/
    site.ts                 # brand metadata + nav + subBrands array
    motion.ts               # Lenis + Motion One bootstrap
    og.ts                   # Satori OG template
  pages/
    index.astro
    legal/{privacy,terms}.astro
    thanks.astro
    api/og/[slug].png.ts    # prerendered Satori OG for home, faq, portfolio-<slug>
  styles/
    tokens.css global.css
functions/
  api/contact.ts            # CF Pages Function: Turnstile verify + forward
tests/smoke.spec.ts         # Playwright
.github/workflows/ci.yml    # build · typecheck · smoke · Lighthouse
lighthouserc.json
```

## Design tokens

Colors declared as RGB triplets in `src/styles/tokens.css`, exposed to Tailwind
via the `<alpha-value>` mechanism. To retheme, edit one file. WCAG-AA bumped
muted and subtle tokens are shared with the sister sites.

## Environment

Copy `.env.example` → `.env`. Public vars prefixed `PUBLIC_*` are inlined at
build; server-only secrets must be set in the Cloudflare Pages dashboard.

| Var                           | Scope       | Required       | Purpose                                                                                  |
| ----------------------------- | ----------- | -------------- | ---------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`             | build       | yes            | Canonical origin. CI sets it to `https://glitchexecutor.com`.                            |
| `PUBLIC_TURNSTILE_SITE_KEY`   | build       | prod           | Turnstile site key. When unset, the widget is omitted; the handler skips verification.   |
| `TURNSTILE_SECRET`            | CF Pages    | prod           | Turnstile secret. Without it, the handler accepts unverified submissions (dev-only).     |
| `SLACK_WEBHOOK_URL`           | CF Pages    | at least one sink | Incoming-webhook URL. Handler posts a formatted Block Kit message.                    |
| `CONTACT_FORWARD_URL`         | CF Pages    | at least one sink | Generic JSON sink (Resend / Zapier Catch / n8n). Handler POSTs the raw payload.       |
| `PUBLIC_ANALYTICS_PROVIDER`   | build       | optional       | `plausible` or `umami`. Unset → Analytics component renders nothing.                     |

### Provisioning Turnstile (first time)

1. Cloudflare dashboard → **Turnstile** → **Add site**.
2. Domain: `glitchexecutor.com`. Widget mode: **Managed**.
3. Copy the **site key** → `PUBLIC_TURNSTILE_SITE_KEY` in CF Pages → Settings → Environment variables (Production + Preview).
4. Copy the **secret** → `TURNSTILE_SECRET` in the same panel, marked **Encrypted**.
5. For local dev, put the same two values in `.env` (gitignored).

## Deployment

Cloudflare Pages — one-time setup:

1. Pages → **Create application** → **Connect to Git** → pick this repo.
2. Framework preset: **Astro**. Overrides:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: *(leave empty)*
3. Environment variables — Production:
   - `PUBLIC_SITE_URL=https://glitchexecutor.com`
   - `PUBLIC_TURNSTILE_SITE_KEY=<site key>`
   - `TURNSTILE_SECRET=<secret>` (Encrypted)
   - One of `SLACK_WEBHOOK_URL` / `CONTACT_FORWARD_URL` (Encrypted)
4. Settings → **Functions**:
   - Compatibility date: current or newer.
   - `nodejs_compat` flag is **not required** — the handler uses only web-standard `fetch` / `FormData`.
5. Settings → **Build & deployments** → Node.js version: `20`.
6. Custom domain: `glitchexecutor.com` → Pages will auto-provision a cert via CF DNS.
7. Trigger the first deploy by pushing to `main` (or hit **Retry deployment**).

The `/functions/api/contact.ts` handler is auto-detected; no adapter, no
`wrangler.toml` needed.

### Verification

After first deploy:

- `curl -I https://glitchexecutor.com/` → `200`, long-cache headers on `/_astro/*` + `/assets/*`.
- Visit `/#contact`, submit the form with a real email → check the Slack channel or forward URL.
- Submitting with an empty Turnstile token hits the handler and returns `403 {"ok":false,"error":"turnstile-failed"}`.

## Licensing

All code in this repository is BSL 1.1 → Apache 2.0 on Change Date 2030-04-18.
See glitchexecutor.com/legal for details.
