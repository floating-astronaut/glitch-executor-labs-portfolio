// Shared OG card templates. Returned as `satori-html` vnodes.
// Kept pure so the endpoint is easy to test in isolation.

import { html } from 'satori-html';

export interface OgParams {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: string; // hex
  bg?: string;    // hex
}

// Inline SVG Nuraveda Lab mark — keeps the OG card self-contained, no network
// fetches. Six rotated "blade" shapes form the hexagonal swirl.
const markBadge = `
  <svg width="72" height="72" viewBox="0 0 256 256" fill="${'#7c3aed'}">
    <g>
      <path d="M128 30 L168 56 L154 116 L128 102 Z" transform="rotate(0   128 128)"/>
      <path d="M128 30 L168 56 L154 116 L128 102 Z" transform="rotate(60  128 128)"/>
      <path d="M128 30 L168 56 L154 116 L128 102 Z" transform="rotate(120 128 128)"/>
      <path d="M128 30 L168 56 L154 116 L128 102 Z" transform="rotate(180 128 128)"/>
      <path d="M128 30 L168 56 L154 116 L128 102 Z" transform="rotate(240 128 128)"/>
      <path d="M128 30 L168 56 L154 116 L128 102 Z" transform="rotate(300 128 128)"/>
    </g>
  </svg>`;

export function ogTemplate({
  eyebrow = 'Nuraveda Lab',
  title,
  subtitle = 'AI that ships. In production.',
  accent = '#7c3aed',
  bg = '#0a0a0f',
}: OgParams) {
  const markup = `
    <div style="
      height: 100%; width: 100%; display: flex; flex-direction: column;
      background: ${bg};
      background-image: radial-gradient(circle at 80% 10%, rgba(124,58,237,0.22), transparent 55%),
                        radial-gradient(circle at 10% 90%, rgba(167,139,250,0.14), transparent 55%);
      color: #F5F7FA;
      padding: 72px 80px;
      font-family: 'Inter Tight', sans-serif;
    ">
      <div style="display: flex; align-items: center; gap: 18px;">
        ${markBadge}
        <div style="display: flex; flex-direction: column;">
          <span style="font-family: 'Geist Mono', monospace; font-size: 20px; letter-spacing: 0.1em;
                        text-transform: uppercase; color: ${accent};">
            ${eyebrow}
          </span>
          <span style="font-size: 20px; color: #9ca3af; margin-top: 4px;">
            nuraveda.com
          </span>
        </div>
      </div>

      <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end;">
        <div style="font-size: 72px; line-height: 1.05; font-weight: 800; letter-spacing: -0.03em; display: flex;">
          ${escapeHtml(title)}
        </div>
        <div style="margin-top: 24px; font-size: 28px; color: #9ca3af; line-height: 1.35; display: flex;">
          ${escapeHtml(subtitle)}
        </div>
      </div>

      <div style="margin-top: 40px; display: flex; align-items: center; justify-content: space-between;
                   font-family: 'Geist Mono', monospace; font-size: 18px; color: #6b7280;">
        <span>© Glitch Executor</span>
        <span style="color: ${accent};">help.nuraveda@gmail.com</span>
      </div>
    </div>
  `;
  return html(markup);
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
