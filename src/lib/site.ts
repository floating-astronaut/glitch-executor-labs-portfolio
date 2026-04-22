// Single source of truth for brand metadata, nav links, and pricing-free copy.
// Keep this file dependency-free — imported from both server and client code.

export const site = {
  name: 'Glitch Executor Labs',
  parent: 'Glitch Executor Labs',
  domain: 'glitchexecutor.com',
  url: 'https://glitchexecutor.com',
  contactEmail: 'support@glitchexecutor.com',
  tagline: 'AI tools for operators who move money, prices, and bets.',
  description:
    'Glitch Executor Labs builds AI tools across trading, sports, and e-commerce — licensed to operators who run their own book. Three product lines: Glitch Trade, Glitch Edge, Glitch Grow.',
  ogImage: '/assets/brand/og-image.png',
  twitter: '@glitchexecutor',
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
  email: 'support@glitchexecutor.com',
  jurisdiction: 'Province of Ontario, Canada',
  arbitrationSeat: 'Toronto, Ontario',
  arbitrationRules: 'ADR Institute of Canada, Inc.',
  dataStorageRegion: 'Iowa, United States',
} as const;

export const nav = [
  { href: '/#portfolio',   label: 'Portfolio' },
  { href: '/#how',         label: 'How we work' },
  { href: '/#milestones',  label: 'Milestones' },
  { href: '/blog',         label: 'Blog' },
  { href: '/#faq',         label: 'FAQ' },
  { href: '/#contact',     label: 'Contact' },
] as const;

export const legalNav = [
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/terms',   label: 'Terms' },
] as const;

// Sister sites — central source so Nav / Portfolio grid / Footer stay in sync.
export const subBrands = [
  {
    slug: 'trade',
    name: 'Glitch Trade',
    href: 'https://trade.glitchexecutor.com',
    tagline: 'AI trading tools for operators.',
    proof: [
      '9-model ensemble — trend, momentum, mean-reversion, ML, volume, session, MTF, sentiment, signal aggregation',
      'Licensed to operators who run their own book — you keep every execution decision',
      'Paper-first workflows, backtest and forward-test harness included',
    ],
    icon: 'chart' as const,
  },
  {
    slug: 'edge',
    name: 'Glitch Edge',
    href: 'https://edge.glitchexecutor.com',
    tagline: 'AI betting tools for quantitative bettors.',
    proof: [
      'Pre-match and in-play models for cricket (IPL, PSL) and NBA',
      'Edge-aware staking helpers and paper-first sim harness',
      'Licensed to bettors who run their own book — you place every bet',
    ],
    icon: 'bolt' as const,
  },
  {
    slug: 'grow',
    name: 'Glitch Grow',
    href: 'https://grow.glitchexecutor.com',
    tagline: 'AI digital marketing tools for e-commerce teams.',
    proof: [
      'Cross-platform attribution tooling — Meta, Amazon, Shopify unified',
      'Voice AI for COD confirmation — training data you own',
      'Shopify automation — theme-as-code, multi-store safe',
    ],
    icon: 'shopping-cart' as const,
  },
] as const;

export type NavItem = (typeof nav)[number];
export type SubBrand = (typeof subBrands)[number];
