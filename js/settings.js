/**
 * User settings: theme, language, sound — persisted in localStorage.
 */
const SETTINGS_KEY = "unlityper-settings";

const defaultSettings = () => ({
  theme: "dark",
  language: "en",
  sound: true,
});

let settings = defaultSettings();

const AppSettings = {
  init() {
    settings = AppSettings.load();
    AppSettings.applyTheme(settings.theme);
    AppSettings.applyLanguage(settings.language);
    AppSettings.bindForm();
  },

  load() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return defaultSettings();
      return { ...defaultSettings(), ...JSON.parse(raw) };
    } catch {
      return defaultSettings();
    }
  },

  save() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  },

  get() {
    return { ...settings };
  },

  isSoundEnabled() {
    return settings.sound;
  },

  applyTheme(theme) {
    const allowed = ["dark", "light", "neon", "forest"];
    const value = allowed.includes(theme) ? theme : "dark";
    settings.theme = value;
    document.documentElement.setAttribute("data-theme", value);
    const select = document.getElementById("setting-theme");
    if (select) select.value = value;
    AppSettings.save();
  },

  applyLanguage(language) {
    const value = language === "ta" ? "ta" : "en";
    settings.language = value;
    AppI18n.setLanguage(value);
    const select = document.getElementById("setting-language");
    if (select) select.value = value;
    AppSettings.save();
  },

  setSound(enabled) {
    settings.sound = Boolean(enabled);
    const input = document.getElementById("setting-sound");
    if (input) input.checked = settings.sound;
    AppSettings.save();
  },

  bindForm() {
    const themeEl = document.getElementById("setting-theme");
    const langEl = document.getElementById("setting-language");
    const soundEl = document.getElementById("setting-sound");

    if (themeEl) {
      themeEl.value = settings.theme;
      themeEl.addEventListener("change", () => AppSettings.applyTheme(themeEl.value));
    }

    if (langEl) {
      langEl.value = settings.language;
      langEl.addEventListener("change", () => AppSettings.applyLanguage(langEl.value));
    }

    if (soundEl) {
      soundEl.checked = settings.sound;
      soundEl.addEventListener("change", () => AppSettings.setSound(soundEl.checked));
    }
  },
};

window.AppSettings = AppSettings;
