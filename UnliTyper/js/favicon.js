/**
 * Generate a random, beautiful space-themed favicon on each page load.
 */
(function generateRandomFavicon() {
  const link =
    document.getElementById("dynamic-favicon") ||
    document.querySelector("link[rel='icon']") ||
    (() => {
      const el = document.createElement("link");
      el.rel = "icon";
      el.type = "image/png";
      document.head.appendChild(el);
      return el;
    })();

  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const hue = Math.floor(Math.random() * 360);
  const hue2 = (hue + 140 + Math.floor(Math.random() * 40)) % 360;
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, `hsl(${hue}, 80%, 22%)`);
  bg.addColorStop(1, `hsl(${hue2}, 75%, 15%)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Subtle stars
  for (let i = 0; i < 18; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.4 + 0.3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue2}, 100%, 92%, ${Math.random() * 0.7 + 0.3})`;
    ctx.fill();
  }

  // Planet core
  const px = size * (0.35 + Math.random() * 0.3);
  const py = size * (0.35 + Math.random() * 0.3);
  const pr = size * (0.18 + Math.random() * 0.08);
  const planet = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, pr * 0.1, px, py, pr);
  planet.addColorStop(0, `hsl(${hue2}, 98%, 72%)`);
  planet.addColorStop(1, `hsl(${hue}, 95%, 48%)`);
  ctx.beginPath();
  ctx.arc(px, py, pr, 0, Math.PI * 2);
  ctx.fillStyle = planet;
  ctx.fill();

  // Ring
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate((Math.random() * 40 - 20) * (Math.PI / 180));
  ctx.beginPath();
  ctx.ellipse(0, pr * 0.1, pr * 1.7, pr * 0.45, 0, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(${hue2}, 100%, 85%, 0.85)`;
  ctx.lineWidth = Math.max(2, size * 0.05);
  ctx.stroke();
  ctx.restore();

  // Glass sheen
  const shine = ctx.createLinearGradient(0, 0, size, size);
  shine.addColorStop(0, "rgba(255,255,255,0.20)");
  shine.addColorStop(0.45, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, size, size);

  link.href = canvas.toDataURL("image/png");
})();
