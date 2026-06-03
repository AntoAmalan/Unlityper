/**
 * Canvas particle bursts (e.g. new personal-best WPM).
 * Full-screen overlay; pointer-events disabled so typing is unaffected.
 */

const ParticleFX = (() => {
  const canvas = document.createElement("canvas");
  canvas.id = "particle-canvas";
  canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d");

  /** @type {Array<{ x: number, y: number, vx: number, vy: number, life: number, maxLife: number, size: number, color: string }>} */
  let particles = [];
  let rafId = 0;
  let running = false;

  const DEFAULT_COLORS = ["#00f5ff", "#ff2bd6", "#39ff14", "#ffe566", "#ffffff"];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function mount() {
    if (canvas.parentElement) return;
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "25",
    });
    document.body.appendChild(canvas);
    resize();
    window.addEventListener("resize", resize);
  }

  function spawnParticle(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    const maxLife = 45 + Math.random() * 35;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: maxLife,
      maxLife,
      size: 2 + Math.random() * 4,
      color,
    });
  }

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((p) => {
      p.life -= 1;
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;

      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();

      return p.life > 0;
    });

    ctx.globalAlpha = 1;

    if (particles.length > 0) {
      rafId = requestAnimationFrame(step);
    } else {
      running = false;
      cancelAnimationFrame(rafId);
    }
  }

  function ensureLoop() {
    if (!running) {
      running = true;
      rafId = requestAnimationFrame(step);
    }
  }

  /**
   * @param {number} x — viewport X
   * @param {number} y — viewport Y
   * @param {{ count?: number, colors?: string[] }} [options]
   */
  function explode(x, y, options = {}) {
    mount();
    const count = options.count ?? 72;
    const colors = options.colors ?? DEFAULT_COLORS;

    for (let i = 0; i < count; i += 1) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      spawnParticle(x, y, color);
    }

    ensureLoop();
  }

  return { explode, mount };
})();

window.ParticleFX = ParticleFX;
