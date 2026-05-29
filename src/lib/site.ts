// Single source of truth for brand metadata, nav links, and pricing-free copy.
// Keep this file dependency-free — imported from both server and client code.

export const site = {
  name: 'Nuraveda Lab',
  parent: 'Nuraveda Lab',
  domain: 'nuraveda.com',
  url: 'https://nuraveda.com',
  contactEmail: 'help.nuraveda@gmail.com',
  tagline: 'AI that ships. In production.',
  description:
    'Nuraveda Lab is an independent AI lab shipping two flagships — Glitch Executor (trading, betting, and growth automation) and Mesh Pilot (open agent mesh + proprietary orchestration brain) — plus a small set of MIT-licensed open-source projects.',
  ogImage: '/assets/brand/og-image.png',
  locale: 'en-US',
} as const;

// Legal entity (contracts, notices, disputes bind here — not the product brand).
// Nuraveda is a sole proprietorship; no corporate veil. Update if/when the
// entity type or address changes.
export const legalEntity = {
  name: 'Nuraveda',
  type: 'Sole proprietorship',
  owner: 'Tejas Karan Agrawal',
  address: '77 Huntley St, Toronto, ON M4Y 2P3, Canada',
  phone: '+1 437 539 7958',
  email: 'help.nuraveda@gmail.com',
  jurisdiction: 'Province of Ontario, Canada',
  arbitrationSeat: 'Toronto, Ontario',
  arbitrationRules: 'ADR Institute of Canada, Inc.',
  dataStorageRegion: 'Iowa, United States',
} as const;

export const nav = [
  { href: '/#flagships',    label: 'Flagships' },
  { href: '/#open-source',  label: 'Open source' },
  { href: '/#how',          label: 'How we work' },
  { href: '/#milestones',   label: 'Milestones' },
  { href: '/blog',          label: 'Blog' },
  { href: '/#faq',          label: 'FAQ' },
  { href: '/#contact',      label: 'Contact' },
] as const;

export const legalNav = [
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/terms',   label: 'Terms' },
] as const;

// Flagship products — Nuraveda Lab ships two end-to-end products.
// Central source so Nav / Portfolio grid / Footer / JSON-LD stay in sync.
export const flagships = [
  {
    slug: 'glitch-executor',
    name: 'Glitch Executor',
    href: 'https://glitchexecutor.com',
    domainCaption: 'glitchexecutor.com',
    tagline: 'End-to-end execution platform for trading, sports-betting intelligence, and growth automation.',
    proof: [
      'Live multi-bot trading ensembles with Oracle-coordinated risk',
      'Sports-intelligence engines (cricket IPL/PSL, NBA pregame) deployable via programmatic betting APIs',
      'Growth-side voice agents, attribution bridges, and ad-ops automation',
    ],
    icon: 'chart' as const,
  },
  {
    slug: 'mesh-pilot',
    name: 'Mesh Pilot',
    href: 'https://meshpilot.app',
    domainCaption: 'meshpilot.app',
    tagline: 'An open agent mesh + a proprietary orchestration brain.',
    proof: [
      'OSS agents — voice, SEO, ads, sales, social, UGC. Public on github.com/Nuraveda-Labs',
      'Proprietary brain — routing, scheduling, shared memory, cross-agent policy. Not open.',
      'Partially open by design — the moat is the coordination plane, not the individual agents.',
    ],
    icon: 'bolt' as const,
  },
] as const;

// Open-source projects — MIT-licensed work shipped under the lab.
// Tri-mirrored across GitHub / GitLab / Codeberg (account-suspension safe).
export const openSource = [
  {
    slug: 'hydrogen-d2c-starter',
    name: 'Hydrogen D2C Starter',
    href: 'https://github.com/Nuraveda-Labs/hydrogen-d2c-starter',
    demo: 'https://hydrogen.nuraveda.com',
    tagline: 'Production-grade Shopify Hydrogen + React Router 7 starter for D2C brands.',
    proof: [
      'CRO-tested PDP / collection / home layouts',
      'GA4 dataLayer wiring + Pack-style component library',
      'Hydrogen latest + Vite 6 + TypeScript strict',
    ],
    license: 'MIT',
    stack: 'Shopify Hydrogen · React Router 7 · TypeScript',
    icon: 'shopping-cart' as const,
  },
  {
    slug: 'ouroboros-cbot',
    name: 'Ouroboros cBot',
    href: 'https://github.com/floating-astronaut/ouroboros-cbot',
    tagline: 'Multi-timeframe cTrader cBot — six ML bots (M1..H4) merged into one .algo.',
    proof: [
      'Data-driven whitelist over 3,253 closed demo trades',
      'Agreement-as-sizer rule (not agreement-as-gate)',
      'Customer-side execution — single .algo, runs offline in cTrader Desktop',
    ],
    license: 'MIT',
    stack: 'C# · .NET 8 · cTrader Automate',
    icon: 'chart' as const,
  },
  {
    slug: 'mesh-pilot-agents',
    name: 'Mesh Pilot agents',
    href: 'https://github.com/Nuraveda-Labs',
    tagline: 'Six open-source AI agents — the publicly forkable half of Mesh Pilot.',
    proof: [
      'ai-voice-agent (LiveKit), ai-seo-agent, ai-ads-agent',
      'ai-social-agent, ai-sales-agent, ai-ugc-agent',
      'Mirrored on github.com/Nuraveda-Labs and gitlab.com/nuraveda-lab',
    ],
    license: 'MIT',
    stack: 'TypeScript · Node · LiveKit · LangGraph',
    icon: 'layers' as const,
  },
  {
    slug: 'linkedin-ads-mcp',
    name: 'LinkedIn Ads MCP',
    href: 'https://github.com/Nuraveda-Labs/linkedin-ads-mcp',
    demo: 'https://pypi.org/project/linkedin-ads-mcp/',
    tagline: 'MCP server for the LinkedIn Marketing API — read + write campaigns, analytics, creatives from any MCP client.',
    proof: [
      'No official LinkedIn MCP exists — this handles the restli encoding quirks',
      'Read + write: campaigns, groups, analytics; write tools default to DRAFT',
      'pip install linkedin-ads-mcp · or connect instantly via Mesh Pilot',
    ],
    license: 'MIT',
    stack: 'Python · FastMCP · LinkedIn Marketing API',
    icon: 'link' as const,
  },
] as const;

// Keep `subBrands` as an alias for backward compatibility with any
// components that still import it (Portfolio / Footer). Maps to flagships.
export const subBrands = flagships;

export type NavItem = (typeof nav)[number];
export type Flagship = (typeof flagships)[number];
export type OpenSourceProject = (typeof openSource)[number];
export type SubBrand = Flagship;
