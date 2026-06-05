/**
 * Dashboard: stats cards + WPM history line chart (canvas).
 */
const Dashboard = {
  render() {
    const profile = PlayerProfile.get();
    const rank = PlayerProfile.getRank();
    const accuracy = PlayerProfile.getLifetimeAccuracy();

    const rankTitle = document.getElementById("dashboard-rank-title");
    const rankMeta = document.getElementById("dashboard-rank-meta");
    const bestWpm = document.getElementById("dashboard-best-wpm");
    const accEl = document.getElementById("dashboard-accuracy");
    const wordsEl = document.getElementById("dashboard-words");
    const timeEl = document.getElementById("dashboard-time");

    if (rankTitle) rankTitle.textContent = rank.title;
    if (rankMeta) {
      const next = PlayerProfile.getNextRank();
      rankMeta.textContent = next
        ? `${profile.totalWordsTyped.toLocaleString()} words — ${next.wordsNeeded} to ${next.title}`
        : AppI18n.t("dashboard.maxRank");
    }
    if (bestWpm) bestWpm.textContent = String(profile.highestWpm);
    if (accEl) accEl.textContent = `${accuracy}%`;
    if (wordsEl) wordsEl.textContent = profile.totalWordsTyped.toLocaleString();
    if (timeEl) timeEl.textContent = PlayerProfile.formatPlayTime(profile.totalTimePlayedSec);

    Dashboard.drawWpmChart(profile.wpmHistory || []);
  },

  drawWpmChart(history) {
    const canvas = document.getElementById("wpm-chart");
    const empty = document.getElementById("wpm-chart-empty");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 800;
    const h = rect.height || 220;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    if (!history.length) {
      if (empty) empty.hidden = false;
      canvas.style.opacity = "0.25";
      return;
    }

    if (empty) empty.hidden = true;
    canvas.style.opacity = "1";

    const padding = { top: 20, right: 20, bottom: 32, left: 44 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const values = history.map((p) => p.wpm);
    const max = Math.max(...values, 10);
    const min = 0;

    const toX = (i) => padding.left + (i / Math.max(history.length - 1, 1)) * chartW;
    const toY = (v) => padding.top + chartH - ((v - min) / (max - min)) * chartH;

    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#00f5ff";

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
    }

    ctx.beginPath();
    history.forEach((point, i) => {
      const x = toX(i);
      const y = toY(point.wpm);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.lineTo(toX(history.length - 1), padding.top + chartH);
    ctx.lineTo(toX(0), padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = `${accent}22`;
    ctx.fill();

    history.forEach((point, i) => {
      ctx.beginPath();
      ctx.arc(toX(i), toY(point.wpm), 4, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
    });

    ctx.fillStyle = "rgba(200,212,240,0.65)";
    ctx.font = "11px Segoe UI, system-ui, sans-serif";
    ctx.fillText("0", 8, padding.top + chartH);
    ctx.fillText(String(max), 8, padding.top + 10);
  },
};

window.Dashboard = Dashboard;
