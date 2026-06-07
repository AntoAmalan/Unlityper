/**
 * English / Tamil UI strings (data-i18n keys).
 */
const I18N_STRINGS = {
  en: {
    brand: "UnliTyper",
    "nav.dashboard": "Dashboard",
    "nav.play": "Play",
    "nav.leaderboard": "Leaderboard",
    "nav.settings": "Settings",
    "dashboard.title": "Command Dashboard",
    "dashboard.lead": "Your lifetime flight records across all missions.",
    "dashboard.rank": "Current Rank",
    "dashboard.bestWpm": "Best WPM",
    "dashboard.accuracy": "Lifetime Accuracy",
    "dashboard.words": "Words Typed",
    "dashboard.time": "Time Played",
    "dashboard.wpmGraph": "WPM History",
    "dashboard.noData": "Complete a mission to see your WPM trend.",
    "dashboard.maxRank": "Maximum rank achieved — keep flying!",
    "play.mode": "Game Mode",
    "play.zen": "Zen",
    "play.timeAttack": "Time Attack",
    "play.survival": "Survival",
    "play.hint": "Press any key to reveal the phrase (that key won't count)",
    "play.nextPhrase": "Next phrase loading…",
    "play.fixErrors": "Fix red letters (Backspace), then keep typing",
    "play.rank": "Rank",
    "play.combo": "Combo",
    "play.lives": "Lives",
    "play.zenDesc": "No pressure—practice at your own pace with endless phrases.",
    "play.timeDesc": "Race against time. Type as much as you can before the timer runs out.",
    "play.survivalDesc": "Five lives. Every mistake costs one—survive as long as you can.",
    "play.duration": "Session",
    "play.duration1": "1 minute",
    "play.duration2": "2 minutes",
    "play.duration3": "3 minutes",
    "play.duration4": "4 minutes",
    "play.duration5": "5 minutes",
    "hud.time": "Time",
    "hud.wpm": "WPM",
    "hud.accuracy": "Accuracy",
    "hud.countdown": "Countdown",
    "leaderboard.title": "Galactic Leaderboard",
    "leaderboard.lead": "Top scores stored on this device (mock pilots included).",
    "leaderboard.pilot": "Pilot",
    "settings.title": "Settings",
    "settings.theme": "Theme",
    "settings.themeDark": "Dark",
    "settings.themeLight": "Light",
    "settings.themeNeon": "Neon",
    "settings.themeForest": "Forest",
    "settings.language": "Language",
    "settings.sound": "Sound Effects",
    "settings.about": "About UnliTyper",
    "settings.aboutText":
      "UnliTyper is a space-themed typing trainer built to sharpen speed, accuracy, and focus—one phrase at a time.",
    "settings.contact": "Questions or collaboration? Reach out anytime.",
    "gameover.title": "Mission Complete",
    "gameover.subtitle": "Transmission logged. Here are your stats:",
    "gameover.restart": "Play Again",
    "gameover.gameOver": "Game Over",
    "gameover.dashboard": "View Dashboard",
    "footer.credit": "Built by LogicMaster",
  },
};

const AppI18n = {
  lang: "en",

  t(key) {
    return I18N_STRINGS[this.lang]?.[key] ?? I18N_STRINGS.en[key] ?? key;
  },

  setLanguage(lang) {
    this.lang = I18N_STRINGS[lang] ? lang : "en";
    document.documentElement.lang = this.lang;
    this.apply();
  },

  apply() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = this.t(key);
      if (text) el.textContent = text;
    });

    document.querySelectorAll("#game-mode option[data-i18n]").forEach((opt) => {
      const key = opt.getAttribute("data-i18n");
      opt.textContent = this.t(key);
    });

    document.querySelectorAll("#setting-theme option[data-i18n]").forEach((opt) => {
      const key = opt.getAttribute("data-i18n");
      opt.textContent = this.t(key);
    });

    document.querySelectorAll("#session-duration option[data-i18n]").forEach((opt) => {
      const key = opt.getAttribute("data-i18n");
      opt.textContent = this.t(key);
    });

    if (window.GameApp?.updateModeDescription) {
      GameApp.updateModeDescription();
    }
  },
};

window.AppI18n = AppI18n;
