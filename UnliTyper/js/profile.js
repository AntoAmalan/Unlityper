/**
 * Player Profile — persisted in localStorage
 */

const PROFILE_STORAGE_KEY = "unlityper-player-profile";
const PROFILE_VERSION = 2;

const RANKS = [
  { id: "novice", title: "Novice", minWords: 0 },
  { id: "apprentice", title: "Apprentice", minWords: 100 },
  { id: "cadet", title: "Star Cadet", minWords: 500 },
  { id: "pilot", title: "Ace Pilot", minWords: 1500 },
  { id: "commander", title: "Fleet Commander", minWords: 4000 },
  { id: "wizard", title: "Typing Wizard", minWords: 10000 },
];

let profile = createDefaultProfile();

function createDefaultProfile() {
  return {
    version: PROFILE_VERSION,
    totalWordsTyped: 0,
    totalTimePlayedSec: 0,
    highestWpm: 0,
    lifetimeCorrectKeystrokes: 0,
    lifetimeTotalKeystrokes: 0,
    wpmHistory: [],
  };
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return createDefaultProfile();

    const parsed = JSON.parse(raw);
    return {
      version: PROFILE_VERSION,
      totalWordsTyped: Math.max(0, Number(parsed.totalWordsTyped) || 0),
      totalTimePlayedSec: Math.max(0, Number(parsed.totalTimePlayedSec) || 0),
      highestWpm: Math.max(0, Number(parsed.highestWpm) || 0),
      lifetimeCorrectKeystrokes: Math.max(0, Number(parsed.lifetimeCorrectKeystrokes) || 0),
      lifetimeTotalKeystrokes: Math.max(0, Number(parsed.lifetimeTotalKeystrokes) || 0),
      wpmHistory: Array.isArray(parsed.wpmHistory) ? parsed.wpmHistory.slice(-30) : [],
    };
  } catch {
    return createDefaultProfile();
  }
}

function saveProfile() {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

function getRankForWords(totalWords) {
  let rank = RANKS[0];
  for (const tier of RANKS) {
    if (totalWords >= tier.minWords) rank = tier;
  }
  return rank;
}

const PlayerProfile = {
  init() {
    profile = loadProfile();
    PlayerProfile.updateRankDisplay();
  },

  get() {
    return { ...profile, wpmHistory: [...profile.wpmHistory] };
  },

  getRank() {
    return getRankForWords(profile.totalWordsTyped);
  },

  getNextRank() {
    const current = PlayerProfile.getRank();
    const next = RANKS.find((t) => t.minWords > profile.totalWordsTyped);
    if (!next) return null;
    return {
      ...next,
      wordsNeeded: next.minWords - profile.totalWordsTyped,
    };
  },

  getLifetimeAccuracy() {
    if (profile.lifetimeTotalKeystrokes === 0) return 100;
    return Math.round(
      (profile.lifetimeCorrectKeystrokes / profile.lifetimeTotalKeystrokes) * 100
    );
  },

  formatPlayTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${Math.floor(seconds)}s`;
  },

  recordWords(count = 1) {
    if (count <= 0) return;
    profile.totalWordsTyped += count;
    saveProfile();
    PlayerProfile.updateRankDisplay();
  },

  recordKeystrokes(correct, total) {
    if (total <= 0) return;
    profile.lifetimeCorrectKeystrokes += correct;
    profile.lifetimeTotalKeystrokes += total;
    saveProfile();
  },

  addPlayTime(seconds) {
    if (seconds <= 0) return;
    profile.totalTimePlayedSec += seconds;
    saveProfile();
  },

  updateHighestWpm(wpm) {
    const rounded = Math.round(wpm);
    if (rounded <= profile.highestWpm) return false;
    profile.highestWpm = rounded;
    saveProfile();
    PlayerProfile.updateRankDisplay();
    return true;
  },

  recordSessionResult(wpm, accuracy) {
    profile.wpmHistory.push({
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      at: new Date().toISOString(),
    });
    if (profile.wpmHistory.length > 30) {
      profile.wpmHistory = profile.wpmHistory.slice(-30);
    }
    saveProfile();
  },

  updateRankDisplay() {
    const titleEl = document.getElementById("player-rank-title");
    const badgeEl = document.getElementById("player-rank");
    if (!titleEl || !badgeEl) return;

    const rank = PlayerProfile.getRank();
    titleEl.textContent = rank.title;
    badgeEl.dataset.rank = rank.id;

    const nextTier = RANKS.find((t) => t.minWords > profile.totalWordsTyped);
    badgeEl.title = [
      `Rank: ${rank.title}`,
      `Words: ${profile.totalWordsTyped.toLocaleString()}`,
      `Time: ${PlayerProfile.formatPlayTime(profile.totalTimePlayedSec)}`,
      `Best WPM: ${profile.highestWpm}`,
      `Accuracy: ${PlayerProfile.getLifetimeAccuracy()}%`,
      nextTier
        ? `Next: ${nextTier.title} at ${nextTier.minWords.toLocaleString()} words`
        : "Max rank",
    ].join("\n");
  },
};

window.PlayerProfile = PlayerProfile;
