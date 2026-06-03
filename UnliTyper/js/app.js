/**
 * App shell: sticky nav, view routing, Animate.css menu bounce, mobile toggle.
 */
const GameApp = {
  currentView: "play",

  init() {
    AppSettings.init();
    PlayerProfile.init();
    Leaderboard.init();

    BrandLogo.render();
    GameApp.bindNav();
    GameApp.bindMobileNav();
    GameApp.navigate("play");

    document.getElementById("btn-dashboard")?.addEventListener("click", () => {
      document.getElementById("game-over").hidden = true;
      GameApp.navigate("dashboard");
    });

    const gameModeEl = document.getElementById("game-mode");
    const sessionDurationEl = document.getElementById("session-duration");

    gameModeEl?.addEventListener("change", (e) => {
      e.stopPropagation();
      GameApp.updateModeDescription();
      TypingGame?.onModeChange?.();
    });

    gameModeEl?.addEventListener("mousedown", (e) => e.stopPropagation());
    gameModeEl?.addEventListener("click", (e) => e.stopPropagation());

    sessionDurationEl?.addEventListener("change", (e) => {
      e.stopPropagation();
      TypingGame?.onDurationChange?.();
    });

    sessionDurationEl?.addEventListener("mousedown", (e) => e.stopPropagation());
    sessionDurationEl?.addEventListener("click", (e) => e.stopPropagation());

    GameApp.updateModeDescription();
    ParticleFX?.mount();
  },

  bindNav() {
    document.querySelectorAll("[data-nav]").forEach((el) => {
      const view = el.getAttribute("data-nav");
      if (!view) return;

      if (el.classList.contains("topnav__link")) {
        el.addEventListener("mouseenter", () => el.classList.add("animate__bounce"));
        el.addEventListener("animationend", (e) => {
          if (e.animationName === "bounce") el.classList.remove("animate__bounce");
        });
      }

      el.addEventListener("click", (e) => {
        e.preventDefault();
        GameApp.navigate(view);
        GameApp.closeMobileNav();
      });
    });
  },

  bindMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("topnav-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("topnav__menu--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  },

  closeMobileNav() {
    document.getElementById("topnav-menu")?.classList.remove("topnav__menu--open");
    document.getElementById("nav-toggle")?.setAttribute("aria-expanded", "false");
  },

  navigate(view) {
    GameApp.currentView = view;

    document.querySelectorAll(".view").forEach((section) => {
      const active = section.id === `view-${view}`;
      section.hidden = !active;
      section.classList.toggle("view--active", active);
    });

    document.querySelectorAll(".topnav__link").forEach((link) => {
      link.classList.toggle("topnav__link--active", link.dataset.nav === view);
    });

    if (view === "dashboard") Dashboard.render();
    if (view === "leaderboard") Leaderboard.render();
    if (view === "play") {
      window.TypingGame?.focusInput?.();
    }
  },

  updateModeDescription() {
    const select = document.getElementById("game-mode");
    const desc = document.getElementById("mode-description");
    if (!select || !desc) return;

    const map = {
      zen: "play.zenDesc",
      timeAttack: "play.timeDesc",
      survival: "play.survivalDesc",
    };
    desc.textContent = AppI18n.t(map[select.value] || "play.zenDesc");
  },
};

window.GameApp = GameApp;

document.addEventListener("DOMContentLoaded", () => {
  GameApp.init();
  if (window.TypingGame?.boot) TypingGame.boot();
});
