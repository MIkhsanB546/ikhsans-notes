/**
 * Centralized theme definitions.
 *
 * Add a new accent theme by appending one entry to ACCENT_THEMES.
 * The `id` is also the Catppuccin CSS variable name, so it must
 * match a custom property declared in src/styles/global.css
 * (e.g. `blue` -> `var(--blue)`).
 */

export const STORAGE_KEYS = {
  accent: "ikhsans-notes:accent",
  appearance: "ikhsans-notes:appearance",
};

export const ACCENT_THEMES = [
  { id: "lavender", label: "Lavender" },
  { id: "blue", label: "Blue" },
  { id: "sapphire", label: "Sapphire" },
  { id: "sky", label: "Sky" },
  { id: "teal", label: "Teal" },
  { id: "green", label: "Green" },
  { id: "yellow", label: "Yellow" },
  { id: "peach", label: "Peach" },
  { id: "pink", label: "Pink" },
  { id: "mauve", label: "Mauve" },
];

export const DEFAULT_ACCENT = "lavender";

export const APPEARANCE_MODES = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "system", label: "System" },
];

export const DEFAULT_APPEARANCE = "dark";

export const ACCENT_IDS = ACCENT_THEMES.map((theme) => theme.id);
export const APPEARANCE_IDS = APPEARANCE_MODES.map((mode) => mode.id);

/** CSS value of an accent theme, resolved by the browser to the active palette. */
export function accentColor(id) {
  return `var(--${id})`;
}

/** Resolve "system" to the palette the OS currently asks for. */
export function resolveAppearance(mode) {
  if (mode !== "system") {
    return mode;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
