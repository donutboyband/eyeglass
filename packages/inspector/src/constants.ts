/**
 * Constants for Eyeglass Inspector
 */

export const BRIDGE_URL = "http://localhost:3300";
export const STORAGE_KEY = "eyeglass_session";
export const HISTORY_KEY = "eyeglass_history";
export const ENABLED_KEY = "eyeglass_enabled";
export const AUTOCOMMIT_KEY = "eyeglass_autocommit";
export const THEME_KEY = "eyeglass_theme";
export const SESSION_TTL = 10000; // 10 seconds

// Fun rotating phrases for the "fixing" status
export const WORKING_PHRASES = [
  "Ruminating...",
  "Percolating...",
  "Divining...",
  "Grokking...",
  "Communing...",
  "Concocting...",
  "Synthesizing...",
  "Distilling...",
  "Incubating...",
  "Forging...",
  "Scrutinizing...",
  "Triangulating...",
  "Unraveling...",
  "Traversing...",
  "Sifting...",
  "Marshaling...",
  "Hydrating...",
  "Harmonizing...",
  "Indexing...",
  "Entangling...",
];

// Inspector cursor - simple crosshair
export const EYE_CURSOR = `crosshair`;
