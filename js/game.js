/**
 * UnliTyper — Space typing practice game
 *
 * GAME LOOP OVERVIEW
 * ------------------
 * 1. IDLE     — Waiting for first keystroke; HUD shows zeros.
 * 2. PLAYING  — Timer ticks each frame; each key updates char states, stats, combo.
 *              Completing a phrase then pressing SPACE loads the next (until session timer ends).
 * 3. FINISHED — Overlay shows final WPM / accuracy; restart returns to IDLE.
 *
 * The loop is driven by:
 *   - requestAnimationFrame → smooth timer + WPM updates while playing
 *   - input "input" event   → character-by-character matching vs target text
 */

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

/** Large phrase library to keep runs varied and less monotonous. */
const SENTENCES = [
  "The starship drifted silently through the asteroid belt at half impulse.",
  "Captain Vega ordered the crew to reroute power to the forward shields.",
  "A faint distress signal echoed from the dark side of the frozen moon.",
  "Navigation computers plotted a slingshot course around the binary star.",
  "The away team discovered ancient ruins glowing beneath the violet sand.",
  "Meteor dust sparkled across the viewport like silver rain in deep space.",
  "The engineer calibrated the warp coils while alarms pulsed in the bridge.",
  "An encrypted beacon blinked from the edge of the forbidden sector.",
  "The pilot stabilized the shuttle during violent atmospheric turbulence.",
  "Quantum relays synchronized and opened a corridor through hyperspace.",
  "The vast universe continues to expand with countless stars and galaxies waiting to be explored by humanity.",
  "Astronauts train for many months before they can travel to the International Space Station in outer space.",
  "A rogue satellite drifted near the colony's solar mirror array.",
  "The crew logged every anomaly before entering the uncharted nebula.",
  "An ion storm rattled the hull with electric blue lightning.",
  "The captain whispered a countdown before initiating jump sequence.",
  "Gravity wells bent starlight into ribbons around the black void.",
  "The medic secured the lab samples in cryogenic containment.",
  "Mars appears as a beautiful red planet that may one day become a second home for humans.",
  "The spectacular rings of Saturn are made of ice and rock particles orbiting around the giant planet.",
  "Neil Armstrong took one small step that became a giant leap for all mankind on the Moon.",
  "Scanners detected movement beneath the ice crust of Europa Nine.",
  "Black holes possess such strong gravity that even light cannot escape from their mysterious dark center.",
  "The defense grid reactivated after decades of silent orbit.",
  "The James Webb Space Telescope captures breathtaking images of distant galaxies formed billions of years ago.",
  "A cosmic ray burst disrupted communication for exactly twelve seconds.",
  "SpaceX builds powerful rockets that can land safely and be reused for future missions into space.",
  "In the silent vacuum of space no one can hear you scream or even speak normally.",
  "The Milky Way galaxy contains billions of stars including our own sun and solar system.",
  "Exploring the final frontier requires courage, intelligence and advanced technology from brilliant scientists and engineers.",
  "Zero gravity makes everyday tasks like eating, drinking and sleeping completely different for astronauts in space.",
  "Voyager spacecraft continues its incredible journey beyond our solar system carrying messages from planet Earth.",
  "The cargo hold hummed as antimatter capsules locked in place.",
  "A drone mapped the canyon city hidden under crimson clouds.",
  "Signal latency dropped when the relay dish aligned with Polaris.",
  "The crew celebrated quietly after repairing the fractured reactor line.",
  "A mysterious artifact projected constellations across the command deck.",
  "The navigation AI proposed three routes, each riskier than the last.",
  "The station lights flickered as backup generators kicked online.",
  "A spiral galaxy rotated slowly on the holographic briefing table.",
  "The commander marked a safe corridor through debris and plasma.",
  "One day humans will establish permanent colonies on the surface of the Moon and Mars.",
  "Cosmic dust and gas clouds slowly collapse under gravity to create beautiful new shining stars.",
  "The International Space Station orbits our planet every ninety minutes giving astronauts amazing views of Earth.",
  "Docking clamps released with a metallic thud and soft vibration.",
  "The mission timer began as the first thruster ignited.",
  "A forgotten transmission repeated one phrase in an unknown language.",
  "The antenna array tracked a fast object crossing the moonlit ring.",
  "Clouds of charged particles painted auroras over the northern dome.",
  "Crewmates exchanged nods before entering the zero gravity chamber.",
  "The probe descended into methane fog and vanished from radar.",
  "A silent freighter drifted with no heat signature or crew.",
  "The bridge windows dimmed to protect eyes from stellar flare.",
  "An old map revealed hidden jump gates between abandoned worlds.",
  "The miner convoy requested escort through pirate controlled territory.",
  "Sensor ghosts appeared and vanished near the asteroid fortress.",
  "The launch bay doors opened like petals under moonlight.",
  "A gentle hum filled the cabin as life support normalized.",
  "The quantum core resonated with a low and steady pulse.",
  "A tiny rover crossed dunes searching for signs of water.",
  "The communications officer decoded fragments of a distress chant.",
  "An emergency pod detached and spun into the darkness below.",
  "The science team measured time dilation near the gravity rift.",
  "The crew adjusted to night cycle under artificial starlight.",
  "The orbital elevator rose through clouds into brilliant sunlight.",
  "A stealth frigate emerged briefly from behind the comet tail.",
  "The docking queue stretched around the arc shaped megastation.",
  "A maintenance bot painted hazard stripes near the reactor vent.",
  "The cadet memorized every protocol before her first solo flight.",
  "A coral reef glowed beneath the transparent ocean dome.",
  "The archive vault unlocked after a successful retina scan.",
  "A scanner ping confirmed oxygen pockets in the lava caves.",
  "The team crossed a bridge of frozen gas over magma.",
  "A sandstorm swallowed the horizon and muted every sensor.",
  "The patrol ship shadowed a smuggler through fractured canyons.",
  "A photon sail unfurled and caught sunlight like glass.",
  "The observer noted unusual magnetic turbulence near the poles.",
  "A beacon tower rose above the dunes like a needle.",
  "The reactor coolant reached optimal levels before departure.",
  "The pilot used star charts older than the current calendar.",
  "Dark matter and dark energy remain two of the biggest unsolved mysteries in modern space science.",
  "Future astronauts may travel to Europa to search for possible signs of alien life beneath the ice.",
  "A hologram replayed the final moments of a lost expedition.",
  "The colony council approved a mission to restore old habitats.",
  "A supply shuttle arrived carrying seeds, medicine, and spare parts.",
  "The watch officer tracked micro meteors on the tactical display.",
  "A hidden valley opened between cliffs of black crystal.",
  "The command drone hovered silently over the landing pad.",
  "The ship computer predicted solar wind changes every minute.",
  "A deep rumble echoed through tunnels beneath the station.",
  "The rescue team followed footprints across frozen methane lakes.",
  "An ancient satellite transmitted maps of vanished settlements.",
  "The captain assigned shifts before entering hostile airspace.",
  "A plasma torch carved an emergency path through wreckage.",
  "The botanist planted algae in nutrient tanks for oxygen.",
  "A mechanical owl patrolled the observatory at midnight.",
  "The night sky shimmered with green arcs and distant storms.",
  "A repair crew floated past windows tethered by silver cables.",
  "The prototype engine spun up with barely audible vibration.",
  "A warning rune blinked red above the auxiliary controls.",
  "The convoy accelerated after clearing the minefield perimeter.",
  "A narrow passage led to chambers lined with old scripts.",
  "The weather array forecasted acid rain over the eastern ridge.",
  "A courier delivered sealed orders moments before launch.",
  "The defense turrets tracked shadows moving in formation.",
  "A distant moon cast pale light on the crater city.",
  "The scavenger ship traded rare alloys for clean water.",
  "A fractured ring world glimmered beyond the horizon.",
  "The pulse cannon charged while the crew secured stations.",
  "A frozen waterfall hid the entrance to a research lab.",
  "The tactical officer plotted intercept vectors in real time.",
  "An energy shield rippled as debris struck the perimeter.",
  "The apprentice coded a fix while the timer counted down.",
  "A swarm of drones assembled a bridge across the ravine.",
  "The command room smelled faintly of ozone and warm metal.",
  "A navigation buoy flashed amber against the black sky.",
  "The survey team documented fossils in sedimentary stone.",
  "An eclipse dimmed the outpost and silenced the solar grid.",
  "The chief engineer smiled as the old drive finally responded.",
  "A data crystal contained memories from a previous generation.",
  "The stealth field failed for a split second near the gate.",
  "A roaming trader sold maps to hidden fuel depots.",
  "The habitat dome reflected constellations on its curved surface.",
  "A coded message instructed the crew to avoid sector nine.",
  "The sonar ping returned from caverns beneath the ocean floor.",
  "A training simulation recreated asteroid evasion at high speed.",
  "The guardian statue awakened when moonlight touched its core.",
  "A relay drone delivered a final warning before signal loss.",
  "The launch team synchronized watches and opened the blast doors.",
  "A maintenance hatch led to winding tunnels under the bridge.",
  "The rescue beacon pulsed steadily through heavy ion interference.",
  "A floating marketplace drifted between moons and trade routes.",
  "The cadet practiced precision typing during long transit shifts.",
  "A nebula bloom painted the sky in violet and cyan.",
  "The expedition ended with a calm sunrise over glass dunes.",
];

/**
 * Audio file paths — drop your .mp3 / .wav files here later, then uncomment
 * the playSound() body below.
 */
const SOUNDS = {
  keyCorrect: "assets/sounds/key-correct.mp3",
  keyError: "assets/sounds/key-error.mp3",
  combo: "assets/sounds/combo.mp3",
  gameComplete: "assets/sounds/game-complete.mp3",
};

/** Words in a row without a mistake before showing the combo badge. */
const COMBO_THRESHOLD = 10;

/** Standard typing measure: average word length in characters. */
const CHARS_PER_WORD = 5;

// -----------------------------------------------------------------------------
// DOM references
// -----------------------------------------------------------------------------

const gameShell = document.getElementById("game-shell");
const targetTextEl = document.getElementById("target-text");
const hiddenInput = document.getElementById("hidden-input");
const startHint = document.getElementById("start-hint");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const liveAccuracyEl = document.getElementById("live-accuracy");
const comboBadge = document.getElementById("combo-badge");
const comboCountEl = document.getElementById("combo-count");
const gameOverPanel = document.getElementById("game-over");
const finalWpmEl = document.getElementById("final-wpm");
const finalAccuracyEl = document.getElementById("final-accuracy");
const finalTimeEl = document.getElementById("final-time");
const btnRestart = document.getElementById("btn-restart");
const gameModeSelect = document.getElementById("game-mode");
const modeExtraEl = document.getElementById("mode-extra");
const survivalLivesEl = document.getElementById("survival-lives");
const timerLabelEl = document.getElementById("timer-label");
const gameOverTitleEl = document.getElementById("game-over-title");
const phraseNextHint = document.getElementById("phrase-next-hint");
const sessionDurationSelect = document.getElementById("session-duration");

// -----------------------------------------------------------------------------
// Game state
// -----------------------------------------------------------------------------

/** @type {'idle' | 'playing' | 'finished'} */
let phase = "idle";

/** Full target string for the current round. */
let target = "";

/** Index of the next character the player must type (0 … target.length). */
let cursorIndex = 0;

/** Timestamp (ms) when the round started — used for elapsed time & WPM. */
let startTime = 0;

/** requestAnimationFrame handle for the stats tick loop. */
let rafId = 0;

/** Total key presses counted toward accuracy (including mistakes). */
let totalKeystrokes = 0;

/** Correct key presses (matching the expected character). */
let correctKeystrokes = 0;

/** Consecutive words completed with zero mistakes in that word. */
let wordStreak = 0;

/** True if the current word has had at least one wrong character. */
let currentWordHasError = false;

/** Cached <span> elements — one per character in `target`. */
let charSpans = [];

/** Index of the last sentence shown (avoids immediate repeats). */
let lastSentenceIndex = -1;

/** Last time (ms) we flushed play-time into the player profile. */
let profileLastFlushAt = 0;

/** Minimum live WPM before a personal-best burst can fire (avoids spam at start). */
const MIN_WPM_FOR_PB_CELEBRATION = 8;

/** Survival starting lives. */
const SURVIVAL_LIVES_START = 5;

/** Session length in seconds (set when a round begins). */
let sessionDurationSec = 180;

/** Prevents double-advance when phrase completes in the same tick. */
let phraseAdvanceScheduled = false;

/** True if any wrong keystroke was entered on the current phrase. */
let hasErrorsOnCurrentPhrase = false;

/** Phrase is visible but the starter key must not count; clock starts on first real keystroke. */
let awaitingFirstTypedKey = false;

/** Swallow the input event that leaks through after preventDefault on the start key. */
let swallowNextInput = false;

/** @type {'zen' | 'timeAttack' | 'survival'} */
let gameMode = "zen";

/** Countdown end timestamp (ms) for Time Attack. */
let countdownEndTime = 0;

/** Remaining lives in Survival mode. */
let survivalLives = SURVIVAL_LIVES_START;

// -----------------------------------------------------------------------------
// Sound placeholders
// -----------------------------------------------------------------------------

/**
 * Play a sound effect by key.
 * Uncomment the Audio lines once you add files under assets/sounds/.
 *
 * @param {keyof typeof SOUNDS} name
 */
function playSound(name) {
  if (window.AppSettings && !AppSettings.isSoundEnabled()) return;
  // const src = SOUNDS[name];
  // if (!src) return;
  // const audio = new Audio(src);
  // audio.volume = 0.5;
  // audio.play().catch(() => {});
}

function getGameMode() {
  return gameModeSelect?.value || gameMode || "zen";
}

function updateSurvivalHud() {
  if (!modeExtraEl || !survivalLivesEl) return;
  const survival = getGameMode() === "survival";
  modeExtraEl.hidden = !survival;
  survivalLivesEl.textContent = String(survivalLives);
}

function getSessionMinutes() {
  const mins = parseInt(sessionDurationSelect?.value || "3", 10);
  return Number.isFinite(mins) ? Math.min(5, Math.max(1, mins)) : 3;
}

function getSessionSeconds() {
  return getSessionMinutes() * 60;
}

function updateTimerLabel() {
  if (!timerLabelEl) return;
  const key = phase === "playing" && countdownEndTime ? "hud.countdown" : "hud.time";
  timerLabelEl.textContent = AppI18n.t(key);
}

function isPhraseComplete() {
  if (phase !== "playing" || !target.length) return false;
  return cursorIndex >= target.length && hiddenInput.value.length >= target.length;
}

function showFixErrorsHint() {
  // Kept as a harmless no-op for compatibility with existing calls.
  if (!phraseNextHint) return;
}

function flashPhraseComplete() {
  targetTextEl.classList.add("phrase-complete");
  if (phraseNextHint) {
    phraseNextHint.hidden = false;
    phraseNextHint.textContent = AppI18n.t("play.nextPhrase");
  }
  window.setTimeout(() => {
    if (phraseNextHint && !phraseAdvanceScheduled) phraseNextHint.hidden = true;
    targetTextEl.classList.remove("phrase-complete");
  }, 400);
}

/** Load next phrase immediately when the current one is fully correct. */
function completeCurrentPhrase() {
  if (phraseAdvanceScheduled || phase !== "playing" || !isPhraseComplete()) return;

  phraseAdvanceScheduled = true;

  if (countdownEndTime > 0 && performance.now() >= countdownEndTime) {
    phraseAdvanceScheduled = false;
    endRound();
    return;
  }

  flashPhraseComplete();
  advanceToNextPhrase();
  phraseAdvanceScheduled = false;
}

function isIgnorableStartKey(e) {
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return true;
  return ["Tab", "Escape", "Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key);
}

/**
 * Reveal the phrase and enter playing state. The key used to start is NOT typed.
 * Session timer begins on the first keystroke after the phrase is shown.
 */
function startMission() {
  if (phase !== "idle" || GameApp?.currentView !== "play") return;

  beginRound(true);
  awaitingFirstTypedKey = true;
  startTime = 0;
  countdownEndTime = 0;
  stopProfilePlayClock();

  hiddenInput.value = "";
  cursorIndex = 0;
  hasErrorsOnCurrentPhrase = false;
  refreshCharHighlights();
  hiddenInput.focus();
}

function armSessionClock() {
  if (!awaitingFirstTypedKey) return;
  awaitingFirstTypedKey = false;
  startTime = performance.now();
  // Only set countdown for time attack and survival modes, not zen
  if (getGameMode() !== "zen") {
    countdownEndTime = performance.now() + sessionDurationSec * 1000;
  } else {
    countdownEndTime = 0;
  }
  startProfilePlayClock();
  updateTimerLabel();
}

function loseSurvivalLife() {
  if (getGameMode() !== "survival" || phase !== "playing") return;
  survivalLives -= 1;
  updateSurvivalHud();
  triggerShake();
  if (survivalLives <= 0) {
    endRound({ gameOver: true });
  }
}

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

/**
 * Pick a new sentence, avoiding the same line twice in a row when possible.
 */
function pickNextSentence() {
  if (SENTENCES.length === 1) {
    lastSentenceIndex = 0;
    return SENTENCES[0];
  }

  let index = lastSentenceIndex;
  while (index === lastSentenceIndex) {
    index = Math.floor(Math.random() * SENTENCES.length);
  }
  lastSentenceIndex = index;
  return SENTENCES[index];
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getElapsedSeconds() {
  if (!startTime) return 0;
  return (performance.now() - startTime) / 1000;
}

/**
 * Standard WPM: (correct characters / 5) / minutes elapsed.
 */
function calculateWpm(correctChars, elapsedSec) {
  if (elapsedSec <= 0) return 0;
  // Require at least 1 second of elapsed time to avoid inflated WPM at start
  if (elapsedSec < 1) return 0;
  const minutes = elapsedSec / 60;
  const words = correctChars / CHARS_PER_WORD;
  return Math.round(words / minutes);
}

function calculateAccuracy() {
  if (totalKeystrokes === 0) return 100;
  return Math.round((correctKeystrokes / totalKeystrokes) * 100);
}

function isWordBoundary(index) {
  if (index <= 0) return false;
  const prev = target[index - 1];
  return prev === " " || prev === "\n";
}

function isEndOfWord(index) {
  if (index >= target.length) return true;
  return target[index] === " " || target[index] === "\n";
}

// -----------------------------------------------------------------------------
// Rendering
// -----------------------------------------------------------------------------

/**
 * Build the target display: one <span class="char"> per character.
 */
function renderTarget() {
  targetTextEl.textContent = "";
  charSpans = [];

  for (let i = 0; i < target.length; i++) {
    const span = document.createElement("span");
    span.className = "char char--pending";
    span.textContent = target[i];
    if (i === 0) span.classList.add("char--current");
    targetTextEl.appendChild(span);
    charSpans.push(span);
  }
}

/**
 * Update span classes after the cursor moves.
 */
function refreshCharHighlights() {
  charSpans.forEach((span, i) => {
    span.classList.remove("char--pending", "char--current", "char--correct", "char--incorrect");

    if (i < cursorIndex) {
      const typed = hiddenInput.value[i];
      const expected = target[i];
      span.classList.add(typed === expected ? "char--correct" : "char--incorrect");
    } else if (i === cursorIndex) {
      span.classList.add("char--current");
    } else {
      span.classList.add("char--pending");
    }
  });
}

function updateHud() {
  if (phase === "playing" && awaitingFirstTypedKey) {
    timerEl.textContent = formatTime(sessionDurationSec);
    wpmEl.textContent = "0";
    liveAccuracyEl.textContent = "100%";
    return;
  }

  const elapsed = getElapsedSeconds();

  if (phase === "playing" && countdownEndTime) {
    const remaining = Math.max(0, (countdownEndTime - performance.now()) / 1000);
    timerEl.textContent = formatTime(remaining);
    if (remaining <= 0) {
      endRound();
      return;
    }
  } else {
    timerEl.textContent = formatTime(elapsed);
  }

  const wpm = calculateWpm(correctKeystrokes, elapsed);
  wpmEl.textContent = String(wpm);
  liveAccuracyEl.textContent = `${calculateAccuracy()}%`;

  if (phase === "playing" && wpm >= MIN_WPM_FOR_PB_CELEBRATION) {
    if (PlayerProfile.updateHighestWpm(wpm)) {
      celebratePersonalBestWpm();
    }
  }
}

/** Canvas particle burst + HUD pulse when the player sets a new best WPM. */
function celebratePersonalBestWpm() {
  const rect = wpmEl.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  if (window.ParticleFX) {
    ParticleFX.explode(x, y, { count: 90 });
    ParticleFX.explode(window.innerWidth / 2, window.innerHeight / 2, {
      count: 48,
      colors: ["#00f5ff", "#ffffff", "#7bfff5"],
    });
  }

  wpmEl.classList.remove("wpm-record");
  void wpmEl.offsetWidth;
  wpmEl.classList.add("wpm-record");
}

// -----------------------------------------------------------------------------
// Player profile persistence (localStorage via profile.js)
// -----------------------------------------------------------------------------

/** Write elapsed active play time since the last flush into localStorage. */
function flushProfilePlayTime() {
  if (phase !== "playing" || !profileLastFlushAt) return;

  const now = performance.now();
  const deltaSec = (now - profileLastFlushAt) / 1000;
  profileLastFlushAt = now;

  if (deltaSec > 0) {
    PlayerProfile.addPlayTime(deltaSec);
  }
}

function startProfilePlayClock() {
  profileLastFlushAt = performance.now();
}

function stopProfilePlayClock() {
  flushProfilePlayTime();
  profileLastFlushAt = 0;
  PlayerProfile.updateRankDisplay();
}

function triggerShake() {
  gameShell.classList.remove("shake");
  // Force reflow so the animation can replay on consecutive errors
  void gameShell.offsetWidth;
  gameShell.classList.add("shake");
}

function updateComboBadge() {
  if (wordStreak >= COMBO_THRESHOLD) {
    comboCountEl.textContent = `x${wordStreak}`;
    comboBadge.hidden = false;
    playSound("combo");
  } else {
    comboBadge.hidden = true;
  }
}

// -----------------------------------------------------------------------------
// Word streak / combo logic
// -----------------------------------------------------------------------------

/**
 * Called when the cursor crosses a word boundary (after typing a space
 * or finishing the last character of a word).
 */
function onWordCompleted() {
  if (!currentWordHasError) {
    const previousRankId = PlayerProfile.getRank().id;
    wordStreak += 1;
    PlayerProfile.recordWords(1);

    const rankBadge = document.getElementById("player-rank");
    if (rankBadge && PlayerProfile.getRank().id !== previousRankId) {
      rankBadge.classList.remove("rank-up");
      void rankBadge.offsetWidth;
      rankBadge.classList.add("rank-up");
    }

    updateComboBadge();
  } else {
    wordStreak = 0;
    comboBadge.hidden = true;
  }
  currentWordHasError = false;
}

// -----------------------------------------------------------------------------
// Game loop (animation frame tick)
// -----------------------------------------------------------------------------

let profileFlushAccumulator = 0;

function tick() {
  if (phase !== "playing") return;

  // Flush play time about once per second while the session runs
  profileFlushAccumulator += 1;
  if (profileFlushAccumulator >= 60) {
    profileFlushAccumulator = 0;
    flushProfilePlayTime();
  }

  updateHud();
  rafId = requestAnimationFrame(tick);
}

function startTickLoop() {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);
}

function stopTickLoop() {
  cancelAnimationFrame(rafId);
}

// -----------------------------------------------------------------------------
// Phase transitions
// -----------------------------------------------------------------------------

function beginRound(clearInput = true) {
  phase = "playing";
  gameMode = getGameMode();
  lastSentenceIndex = -1;
  target = pickNextSentence();
  cursorIndex = 0;
  startTime = performance.now();
  totalKeystrokes = 0;
  correctKeystrokes = 0;
  wordStreak = 0;
  currentWordHasError = false;
  comboBadge.hidden = true;

  sessionDurationSec = getSessionSeconds();
  // Only set countdown for time attack and survival modes, not zen
  if (gameMode !== "zen") {
    countdownEndTime = performance.now() + sessionDurationSec * 1000;
  } else {
    countdownEndTime = 0;
  }
  phraseAdvanceScheduled = false;
  hasErrorsOnCurrentPhrase = false;
  if (phraseNextHint) phraseNextHint.hidden = true;
  targetTextEl.classList.remove("phrase-complete");

  if (gameMode === "survival") {
    survivalLives = SURVIVAL_LIVES_START;
  }

  updateSurvivalHud();
  updateTimerLabel();

  if (clearInput) hiddenInput.value = "";
  hiddenInput.disabled = false;
  startHint.hidden = true;
  gameOverPanel.hidden = true;

  renderTarget();
  refreshCharHighlights();
  updateHud();
  startProfilePlayClock();
  startTickLoop();
  hiddenInput.focus();
}

/**
 * Load the next phrase after the current one is typed correctly.
 * Session stats (timer, WPM, accuracy, combo) continue across phrases.
 */
function advanceToNextPhrase() {
  if (countdownEndTime && performance.now() >= countdownEndTime) {
    endRound();
    return;
  }

  flushProfilePlayTime();

  target = pickNextSentence();
  cursorIndex = 0;
  currentWordHasError = false;
  hiddenInput.value = "";
  phraseAdvanceScheduled = false;
  hasErrorsOnCurrentPhrase = false;
  if (phraseNextHint) phraseNextHint.hidden = true;
  targetTextEl.classList.remove("phrase-complete");

  renderTarget();
  refreshCharHighlights();
  hiddenInput.focus();

  targetTextEl.classList.remove("phrase-advance");
  void targetTextEl.offsetWidth;
  targetTextEl.classList.add("phrase-advance");
  playSound("gameComplete");
}

/**
 * @param {{ gameOver?: boolean }} [options]
 */
function endRound(options = {}) {
  if (phase === "finished") return;

  phase = "finished";
  stopProfilePlayClock();
  stopTickLoop();
  hiddenInput.disabled = true;

  const elapsed = getElapsedSeconds();
  const wpm = calculateWpm(correctKeystrokes, elapsed);
  const accuracy = calculateAccuracy();

  finalWpmEl.textContent = String(wpm);
  finalAccuracyEl.textContent = `${accuracy}%`;
  finalTimeEl.textContent = formatTime(sessionDurationSec || elapsed);

  if (gameOverTitleEl) {
    gameOverTitleEl.textContent = options.gameOver
      ? AppI18n.t("gameover.gameOver")
      : AppI18n.t("gameover.title");
  }

  PlayerProfile.recordSessionResult(wpm, accuracy);
  Leaderboard.addScore({
    name: "You",
    wpm,
    accuracy,
    mode: getGameMode(),
  });

  gameOverPanel.hidden = false;
  playSound("gameComplete");
}

function resetToIdle() {
  phase = "idle";
  stopProfilePlayClock();
  stopTickLoop();
  target = "";
  cursorIndex = 0;
  startTime = 0;
  hiddenInput.value = "";
  hiddenInput.disabled = false;
  targetTextEl.textContent = "";
  startHint.hidden = false;
  gameOverPanel.hidden = true;
  comboBadge.hidden = true;
  timerEl.textContent = "0:00";
  wpmEl.textContent = "0";
  liveAccuracyEl.textContent = "100%";
  countdownEndTime = 0;
  phraseAdvanceScheduled = false;
  hasErrorsOnCurrentPhrase = false;
  awaitingFirstTypedKey = false;
  swallowNextInput = false;
  if (phraseNextHint) phraseNextHint.hidden = true;
  targetTextEl.classList.remove("phrase-complete");
  updateSurvivalHud();
  updateTimerLabel();
}

// -----------------------------------------------------------------------------
// Input handling — core typing logic
// -----------------------------------------------------------------------------

function processTypingInput() {
  const typed = hiddenInput.value;

  if (phase !== "playing") return;

  if (awaitingFirstTypedKey) {
    if (!typed.length) return;
    armSessionClock();
  }

  // Player deleted characters — move cursor back and refresh UI
  if (typed.length < cursorIndex) {
    cursorIndex = typed.length;
    hasErrorsOnCurrentPhrase = false;
    for (let i = 0; i < cursorIndex; i += 1) {
      if (typed[i] !== target[i]) hasErrorsOnCurrentPhrase = true;
    }
    refreshCharHighlights();
    showFixErrorsHint();
    return;
  }

  // Only process newly added characters (one at a time in normal typing)
  while (cursorIndex < typed.length && cursorIndex < target.length) {
    const char = typed[cursorIndex];
    const expected = target[cursorIndex];
    const wasAtWordStart = isWordBoundary(cursorIndex);

    if (wasAtWordStart) {
      currentWordHasError = false;
    }

    totalKeystrokes += 1;

    if (char === expected) {
      correctKeystrokes += 1;
      PlayerProfile.recordKeystrokes(1, 1);
      playSound("keyCorrect");
    } else {
      currentWordHasError = true;
      hasErrorsOnCurrentPhrase = true;
      wordStreak = 0;
      comboBadge.hidden = true;
      PlayerProfile.recordKeystrokes(0, 1);
      playSound("keyError");
      if (getGameMode() === "survival") {
        loseSurvivalLife();
      } else {
        triggerShake();
      }
    }

    cursorIndex += 1;

    // Completed a word when we just typed a space or reached end of string
    if (isEndOfWord(cursorIndex)) {
      onWordCompleted();
    }

    if (isPhraseComplete()) {
      completeCurrentPhrase();
      return;
    }
  }

  // Prevent input from growing past target (extra keys ignored)
  if (hiddenInput.value.length > target.length) {
    hiddenInput.value = hiddenInput.value.slice(0, target.length);
  }

  cursorIndex = Math.min(cursorIndex, hiddenInput.value.length);

  refreshCharHighlights();
  showFixErrorsHint();

  if (isPhraseComplete()) {
    completeCurrentPhrase();
  }
}

function handleInput() {
  if (phase === "idle") {
    hiddenInput.value = "";
    startMission();
    return;
  }

  if (swallowNextInput) {
    swallowNextInput = false;
    hiddenInput.value = "";
    return;
  }

  processTypingInput();
}

// -----------------------------------------------------------------------------
// Event wiring
// -----------------------------------------------------------------------------

hiddenInput.addEventListener("input", handleInput);

document.addEventListener("keydown", (e) => {
  if (GameApp?.currentView !== "play") return;

  if (phase === "idle") {
    if (isIgnorableStartKey(e)) return;
    e.preventDefault();
    swallowNextInput = true;
    startMission();
    return;
  }

  if (phase === "playing" && isPhraseComplete() && e.code === "Space") {
    e.preventDefault();
    completeCurrentPhrase();
  }
});

document.getElementById("playfield")?.addEventListener("click", () => {
  if (GameApp?.currentView !== "play" || phase === "finished") return;
  hiddenInput.focus();
});

document.addEventListener("click", (e) => {
  if (phase === "finished" || GameApp?.currentView !== "play") return;
  if (
    e.target.closest(
      ".topnav, .play-toolbar, .game-over, select, option, button, label, a, input[type='checkbox']"
    )
  ) {
    return;
  }
  hiddenInput.focus();
});

btnRestart.addEventListener("click", () => {
  resetToIdle();
  hiddenInput.focus();
});

gameShell.addEventListener("animationend", (e) => {
  if (e.animationName === "screen-shake") {
    gameShell.classList.remove("shake");
  }
});

targetTextEl.addEventListener("animationend", (e) => {
  if (e.animationName === "phrase-advance") {
    targetTextEl.classList.remove("phrase-advance");
  }
});

document.getElementById("player-rank")?.addEventListener("animationend", (e) => {
  if (e.animationName === "rank-up") {
    e.currentTarget.classList.remove("rank-up");
  }
});

wpmEl.addEventListener("animationend", (e) => {
  if (e.animationName === "wpm-record-pulse") {
    wpmEl.classList.remove("wpm-record");
  }
});

window.addEventListener("beforeunload", () => {
  stopProfilePlayClock();
});

const TypingGame = {
  boot() {
    resetToIdle();
    updateSurvivalHud();
    updateTimerLabel();
  },

  focusInput() {
    if (GameApp?.currentView === "play" && phase !== "finished") {
      hiddenInput.focus();
    }
  },

  onModeChange() {
    gameMode = getGameMode();
    if (phase === "playing") resetToIdle();
    updateSurvivalHud();
    updateTimerLabel();
    GameApp?.updateModeDescription?.();
  },

  onDurationChange() {
    if (phase === "playing") resetToIdle();
    updateTimerLabel();
  },
};

window.TypingGame = TypingGame;
