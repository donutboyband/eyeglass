/**
 * Systemic Layer Analysis for Eyeglass v2.0
 * Analyzes architectural impact and design system compliance
 */

import type {
  SystemicInfo,
  TokenMatch,
  TokenDeviation,
} from '@eyeglass/types';

// Common design token color palettes
const COMMON_TOKEN_COLORS: Record<string, string[]> = {
  // Tailwind palette
  'gray-50': ['rgb(249, 250, 251)', '#f9fafb'],
  'gray-100': ['rgb(243, 244, 246)', '#f3f4f6'],
  'gray-200': ['rgb(229, 231, 235)', '#e5e7eb'],
  'gray-300': ['rgb(209, 213, 219)', '#d1d5db'],
  'gray-400': ['rgb(156, 163, 175)', '#9ca3af'],
  'gray-500': ['rgb(107, 114, 128)', '#6b7280'],
  'gray-600': ['rgb(75, 85, 99)', '#4b5563'],
  'gray-700': ['rgb(55, 65, 81)', '#374151'],
  'gray-800': ['rgb(31, 41, 55)', '#1f2937'],
  'gray-900': ['rgb(17, 24, 39)', '#111827'],

  'red-500': ['rgb(239, 68, 68)', '#ef4444'],
  'red-600': ['rgb(220, 38, 38)', '#dc2626'],

  'orange-500': ['rgb(249, 115, 22)', '#f97316'],

  'amber-500': ['rgb(245, 158, 11)', '#f59e0b'],

  'yellow-500': ['rgb(234, 179, 8)', '#eab308'],

  'green-500': ['rgb(34, 197, 94)', '#22c55e'],
  'green-600': ['rgb(22, 163, 74)', '#16a34a'],

  'emerald-500': ['rgb(16, 185, 129)', '#10b981'],

  'teal-500': ['rgb(20, 184, 166)', '#14b8a6'],

  'cyan-500': ['rgb(6, 182, 212)', '#06b6d4'],

  'sky-500': ['rgb(14, 165, 233)', '#0ea5e9'],

  'blue-500': ['rgb(59, 130, 246)', '#3b82f6'],
  'blue-600': ['rgb(37, 99, 235)', '#2563eb'],

  'indigo-500': ['rgb(99, 102, 241)', '#6366f1'],
  'indigo-600': ['rgb(79, 70, 229)', '#4f46e5'],

  'violet-500': ['rgb(139, 92, 246)', '#8b5cf6'],

  'purple-500': ['rgb(168, 85, 247)', '#a855f7'],

  'fuchsia-500': ['rgb(217, 70, 239)', '#d946ef'],

  'pink-500': ['rgb(236, 72, 153)', '#ec4899'],

  'rose-500': ['rgb(244, 63, 94)', '#f43f5e'],

  // Common semantic colors
  'white': ['rgb(255, 255, 255)', '#ffffff', '#fff'],
  'black': ['rgb(0, 0, 0)', '#000000', '#000'],
  'transparent': ['rgba(0, 0, 0, 0)', 'transparent'],
};

// Common spacing tokens (in pixels)
const COMMON_SPACING_TOKENS: Record<string, number[]> = {
  '0': [0],
  '1': [4],
  '2': [8],
  '3': [12],
  '4': [16],
  '5': [20],
  '6': [24],
  '8': [32],
  '10': [40],
  '12': [48],
  '16': [64],
  '20': [80],
  '24': [96],
};

/**
 * Parse a color string to a normalized format
 */
function normalizeColor(color: string): string {
  return color.toLowerCase().replace(/\s+/g, '');
}

/**
 * Match a color value against known design tokens
 */
function matchColorToken(value: string): string | null {
  const normalized = normalizeColor(value);

  for (const [token, values] of Object.entries(COMMON_TOKEN_COLORS)) {
    if (values.some(v => normalizeColor(v) === normalized)) {
      return token;
    }
  }

  return null;
}

/**
 * Extract numeric value from a CSS length (e.g., "16px" -> 16)
 */
function extractPixelValue(value: string): number | null {
  const match = value.match(/^(\d+(?:\.\d+)?)(px)?$/);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

/**
 * Match a spacing value against known design tokens
 */
function matchSpacingToken(value: string): string | null {
  const pixels = extractPixelValue(value);
  if (pixels === null) return null;

  for (const [token, values] of Object.entries(COMMON_SPACING_TOKENS)) {
    if (values.includes(pixels)) {
      return `spacing-${token}`;
    }
  }

  return null;
}

/**
 * Suggest a design token for a color that doesn't match
 */
function suggestColorToken(value: string): string | null {
  // Parse RGB values
  const rgbMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!rgbMatch) return null;

  const r = parseInt(rgbMatch[1]);
  const g = parseInt(rgbMatch[2]);
  const b = parseInt(rgbMatch[3]);

  // Find closest matching token by color distance
  let closestToken: string | null = null;
  let closestDistance = Infinity;

  for (const [token, values] of Object.entries(COMMON_TOKEN_COLORS)) {
    for (const tokenValue of values) {
      const tokenMatch = tokenValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (tokenMatch) {
        const tr = parseInt(tokenMatch[1]);
        const tg = parseInt(tokenMatch[2]);
        const tb = parseInt(tokenMatch[3]);

        const distance = Math.sqrt(
          Math.pow(r - tr, 2) + Math.pow(g - tg, 2) + Math.pow(b - tb, 2)
        );

        if (distance < closestDistance && distance < 50) {
          closestDistance = distance;
          closestToken = token;
        }
      }
    }
  }

  return closestToken;
}

/**
 * Analyze an element's styles for design system compliance
 */
export function analyzeDesignSystem(styles: {
  color: string;
  backgroundColor: string;
  padding: string;
  margin: string;
  fontFamily: string;
}): {
  tokenMatches: TokenMatch[];
  deviations: TokenDeviation[];
} {
  const tokenMatches: TokenMatch[] = [];
  const deviations: TokenDeviation[] = [];

  // Check color
  const colorToken = matchColorToken(styles.color);
  if (colorToken) {
    tokenMatches.push({ property: 'color', token: colorToken });
  } else if (styles.color && styles.color !== 'transparent') {
    const suggestion = suggestColorToken(styles.color);
    if (suggestion) {
      deviations.push({
        property: 'color',
        value: styles.color,
        suggestion: `Consider using ${suggestion}`,
      });
    }
  }

  // Check background color
  const bgToken = matchColorToken(styles.backgroundColor);
  if (bgToken) {
    tokenMatches.push({ property: 'backgroundColor', token: bgToken });
  } else if (
    styles.backgroundColor &&
    styles.backgroundColor !== 'transparent' &&
    styles.backgroundColor !== 'rgba(0, 0, 0, 0)'
  ) {
    const suggestion = suggestColorToken(styles.backgroundColor);
    if (suggestion) {
      deviations.push({
        property: 'backgroundColor',
        value: styles.backgroundColor,
        suggestion: `Consider using ${suggestion}`,
      });
    }
  }

  // Check padding (simplified - just checks if it's a standard value)
  const paddingValues = styles.padding.split(' ');
  for (const pv of paddingValues) {
    const spacingToken = matchSpacingToken(pv);
    if (spacingToken) {
      tokenMatches.push({ property: 'padding', token: spacingToken });
      break;
    }
  }

  return { tokenMatches, deviations };
}

/**
 * Determine the risk level based on where the component is used
 * This is a placeholder - actual import count analysis requires bridge support
 */
export function determineRiskLevel(filePath?: string): 'Local' | 'Moderate' | 'Critical' {
  if (!filePath) return 'Local';

  // Heuristics based on file path
  const lowerPath = filePath.toLowerCase();

  // Core/shared components are typically high risk
  if (
    lowerPath.includes('/shared/') ||
    lowerPath.includes('/common/') ||
    lowerPath.includes('/core/') ||
    lowerPath.includes('/ui/') ||
    lowerPath.includes('/components/ui/')
  ) {
    return 'Critical';
  }

  // Components in lib or primitives are moderate risk
  if (
    lowerPath.includes('/lib/') ||
    lowerPath.includes('/primitives/') ||
    lowerPath.includes('/atoms/')
  ) {
    return 'Moderate';
  }

  return 'Local';
}

/**
 * Get systemic information for an element
 */
export function getSystemicInfo(
  filePath: string | undefined,
  styles: {
    color: string;
    backgroundColor: string;
    padding: string;
    margin: string;
    fontFamily: string;
  }
): SystemicInfo {
  const { tokenMatches, deviations } = analyzeDesignSystem(styles);

  return {
    impact: {
      // importCount will be filled in by bridge if available
      riskLevel: determineRiskLevel(filePath),
    },
    designSystem: {
      tokenMatches,
      deviations,
    },
  };
}
