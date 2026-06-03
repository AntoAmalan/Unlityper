/**
 * Local-only leaderboard with seeded mock pilots + your scores.
 */
const LEADERBOARD_KEY = "unlityper-leaderboard";

const MOCK_PILOTS = [
  { name: "Nova-7", wpm: 112, accuracy: 99, mode: "timeAttack", isMock: true },
  { name: "Cipher", wpm: 98, accuracy: 97, mode: "survival", isMock: true },
  { name: "Orion Flux", wpm: 87, accuracy: 96, mode: "zen", isMock: true },
  { name: "Lyra", wpm: 79, accuracy: 94, mode: "timeAttack", isMock: true },
  { name: "Vega Strike", wpm: 71, accuracy: 92, mode: "survival", isMock: true },
];

let entries = [];

function loadEntries() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveEntries() {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

const Leaderboard = {
  init() {
    entries = loadEntries();
    if (entries.length === 0) {
      entries = MOCK_PILOTS.map((row, i) => ({
        ...row,
        id: `mock-${i}`,
        at: Date.now() - i * 86400000,
      }));
      saveEntries();
    }
  },

  addScore({ name = "You", wpm, accuracy, mode }) {
    entries.push({
      id: `run-${Date.now()}`,
      name,
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      mode,
      isMock: false,
      at: Date.now(),
    });

    entries.sort((a, b) => b.wpm - a.wpm);
    entries = entries.slice(0, 25);
    saveEntries();
    Leaderboard.render();
  },

  getTop(limit = 15) {
    return [...entries].sort((a, b) => b.wpm - a.wpm).slice(0, limit);
  },

  formatMode(mode) {
    const labels = {
      zen: "Zen",
      timeAttack: "Time Attack",
      survival: "Survival",
    };
    return labels[mode] || mode;
  },

  render() {
    const body = document.getElementById("leaderboard-body");
    if (!body) return;

    const rows = Leaderboard.getTop(15);
    body.innerHTML = rows
      .map(
        (row, i) => `
      <tr class="${row.isMock ? "leaderboard-row--mock" : "leaderboard-row--you"}">
        <td>${i + 1}</td>
        <td>${row.name}${row.isMock ? "" : " ★"}</td>
        <td>${row.wpm}</td>
        <td>${row.accuracy}%</td>
        <td>${Leaderboard.formatMode(row.mode)}</td>
      </tr>`
      )
      .join("");
  },
};

window.Leaderboard = Leaderboard;
