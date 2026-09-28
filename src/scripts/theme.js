import {
  ACCENT_IDS,
  APPEARANCE_IDS,
  DEFAULT_ACCENT,
  DEFAULT_APPEARANCE,
  STORAGE_KEYS,
  accentColor,
  resolveAppearance,
} from "./themes.js";

/**
 * Runtime part of the theme system.
 *
 * The accent and the appearance are already applied by the
 * inline script in Layout.astro before the first paint, this
 * module keeps them in sync with the controls, persists the
 * selection and follows the OS preference while in "system".
 */
(function initializeThemeControls() {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function readStored(key, allowed, fallback) {
    try {
      const stored = window.localStorage.getItem(key);

      return allowed.includes(stored) ? stored : fallback;
    } catch {
      return fallback;
    }
  }

  function store(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* Storage unavailable (private mode), the theme still applies. */
    }
  }

  let accent = readStored(STORAGE_KEYS.accent, ACCENT_IDS, DEFAULT_ACCENT);
  let appearance = readStored(
    STORAGE_KEYS.appearance,
    APPEARANCE_IDS,
    DEFAULT_APPEARANCE,
  );

  function applyAccent() {
    root.dataset.accent = accent;
    root.style.setProperty("--theme-accent", accentColor(accent));
  }

  function applyAppearance() {
    /*
     * `appearance` keeps the user choice (dark/light/system) while
     * `data-appearance` holds the palette actually in use.
     */
    root.dataset.appearanceMode = appearance;
    root.dataset.appearance = resolveAppearance(appearance);
  }

  function bindControl(name, onChange) {
    const select = document.querySelector(`[data-theme-control="${name}"]`);

    if (!select) {
      return;
    }

    select.value = name === "accent" ? accent : appearance;
    select.addEventListener("change", () => {
      onChange(select.value);
    });
  }

  function onSystemChange() {
    /*
     * An explicit dark/light choice must never be
     * overridden by the operating system.
     */
    if (appearance === "system") {
      applyAppearance();
    }
  }

  applyAccent();
  applyAppearance();

  bindControl("accent", (value) => {
    accent = ACCENT_IDS.includes(value) ? value : DEFAULT_ACCENT;
    store(STORAGE_KEYS.accent, accent);
    applyAccent();
  });

  bindControl("appearance", (value) => {
    appearance = APPEARANCE_IDS.includes(value) ? value : DEFAULT_APPEARANCE;
    store(STORAGE_KEYS.appearance, appearance);
    applyAppearance();
  });

  if (typeof systemDark.addEventListener === "function") {
    systemDark.addEventListener("change", onSystemChange);
  } else if (typeof systemDark.addListener === "function") {
    systemDark.addListener(onSystemChange);
  }
})();
