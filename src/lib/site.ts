// Single source of truth for brand metadata, nav links, and pricing-free copy.
// Keep this file dependency-free — imported from both server and client code.

export const site = {
  name: 'Glitch Executor Labs',
  parent: 'Glitch Executor Labs',
  domain: 'glitchexecutor.com',
  url: 'https://glitchexecutor.com',
  contactEmail: 'support@glitchexecutor.com',
  tagline: 'AI automation platforms for trading, betting, and e-commerce operators.',
  description:
    'Glitch Executor Labs builds AI automation platforms across three verticals — Glitch Trade automates prop-firm trading, Glitch Edge automates sports betting, and Glitch Grow automates Shopify e-commerce.',
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
    tagline: 'Trading automation for prop-firm challenges.',
    proof: [
      'cBots engineered to pass FundingPips Zero and similar one-step challenges',
      'Runs on your own cTrader Desktop — execution stays customer-side, prop-firm TOS-safe',
      '9-strategy library — trend, momentum, mean-reversion, ML, volume, session, MTF, sentiment, signal aggregation',
    ],
    icon: 'chart' as const,
  },
  {
    slug: 'edge',
    name: 'Glitch Edge',
    href: 'https://edge.glitchexecutor.com',
    tagline: 'Betting automation for quantitative sports bettors.',
    proof: [
      'Pre-match and in-play models for cricket (IPL, PSL) and NBA',
      'Edge-aware staking automation with paper-first sim harness',
      'Encrypted broker-key vault — your bookmaker credentials never leave your control',
    ],
    icon: 'bolt' as const,
  },
  {
    slug: 'grow',
    name: 'Glitch Grow',
    href: 'https://grow.glitchexecutor.com',
    tagline: 'Marketing automation for Shopify D2C operators.',
    proof: [
      'Ads agent — Meta ads automation tuned for Shopify D2C brands',
      'Cross-platform attribution across Meta, Amazon, and Shopify',
      'COD-confirmation voice AI and theme-as-code multi-store Shopify automation',
    ],
    icon: 'shopping-cart' as const,
  },
] as const;

export type NavItem = (typeof nav)[number];
export type SubBrand = (typeof subBrands)[number];
