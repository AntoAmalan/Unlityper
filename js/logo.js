/**
 * Generates a unique space-themed SVG logo on each page load.
 */
const BrandLogo = {
  /** @param {string} mountId */
  render(mountId = "brand-logo") {
    const mount = document.getElementById(mountId);
    if (!mount) return;

    const seed = Date.now() ^ (Math.random() * 0xffffffff);
    const rng = BrandLogo._rng(seed);
    const variant = Math.floor(rng() * 4);
    const hue = Math.floor(rng() * 360);
    const accent = `hsl(${hue}, 88%, 58%)`;
    const accent2 = `hsl(${(hue + 140) % 360}, 90%, 62%)`;
    const glow = `hsl(${hue}, 100%, 75%)`;

    mount.innerHTML = BrandLogo._svg(variant, accent, accent2, glow, rng);
    mount.style.setProperty("--logo-accent", accent);
  },

  _rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },

  _svg(variant, accent, accent2, glow, rng) {
    const stars = Array.from({ length: 5 }, () => ({
      cx: 4 + rng() * 28,
      cy: 4 + rng() * 28,
      r: 0.6 + rng() * 1.2,
      o: 0.35 + rng() * 0.65,
    }))
      .map(
        (s) =>
          `<circle cx="${s.cx.toFixed(1)}" cy="${s.cy.toFixed(1)}" r="${s.r.toFixed(1)}" fill="${glow}" opacity="${s.o.toFixed(2)}"/>`
      )
      .join("");

    const shapes = [
      /* Planet with ring */
      `<circle cx="18" cy="18" r="9" fill="url(#lg)"/>
       <ellipse cx="18" cy="20" rx="14" ry="4" fill="none" stroke="${accent2}" stroke-width="1.5" opacity="0.85" transform="rotate(-18 18 20)"/>
       <circle cx="14" cy="14" r="2" fill="${glow}" opacity="0.5"/>`,
      /* Rocket */
      `<path d="M18 6 L22 22 L18 19 L14 22 Z" fill="url(#lg)"/>
       <circle cx="18" cy="10" r="2.5" fill="${glow}" opacity="0.7"/>
       <path d="M14 22 Q18 26 22 22" fill="none" stroke="${accent2}" stroke-width="1.2" opacity="0.8"/>`,
      /* Hex badge */
      `<polygon points="18,5 26,10 26,20 18,25 10,20 10,10" fill="url(#lg)" stroke="${accent2}" stroke-width="1"/>
       <text x="18" y="20" text-anchor="middle" font-size="9" font-weight="800" fill="${glow}" font-family="system-ui,sans-serif">U</text>`,
      /* Orbit dot */
      `<circle cx="18" cy="18" r="7" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
       <circle cx="18" cy="18" r="4" fill="url(#lg)"/>
       <circle cx="26" cy="12" r="2.5" fill="${accent2}"/>`,
    ];

    return `<svg class="brand-logo__svg" viewBox="0 0 36 36" width="36" height="36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}"/>
          <stop offset="100%" stop-color="${accent2}"/>
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="10" fill="rgba(0,0,0,0.25)"/>
      ${stars}
      ${shapes[variant]}
    </svg>`;
  },
};

window.BrandLogo = BrandLogo;
