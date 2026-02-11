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

// Eye cursor as base64-encoded SVG (16x16 eye icon, indigo color)
export const EYE_CURSOR = `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xIDEyczQtOCAxMS04IDExIDggMTEgOC00IDgtMTEgOC0xMS04LTExLTh6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgZmlsbD0iIzYzNjZmMSIvPjwvc3ZnPg==") 8 8, crosshair`;
