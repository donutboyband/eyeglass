/**
 * Health Calculator for Eyeglass v2.0
 * Calculates the "pulse" level for an element based on its snapshot data
 */

import type { SemanticSnapshot, PulseLevel } from '@eyeglass/types';

export interface HealthIssue {
  level: 'warning' | 'critical';
  category: 'accessibility' | 'performance' | 'usability' | 'events';
  message: string;
  details?: string;
}

/**
 * Analyze a snapshot and return health issues
 */
export function analyzeHealth(snapshot: SemanticSnapshot): HealthIssue[] {
  const issues: HealthIssue[] = [];

  // Check accessibility issues
  if (snapshot.perception?.legibility?.wcagStatus === 'fail') {
    issues.push({
      level: 'critical',
      category: 'accessibility',
      message: 'Low contrast ratio',
      details: `Contrast ratio: ${snapshot.perception.legibility.contrastRatio}:1 (WCAG requires 4.5:1)`,
    });
  }

  if (snapshot.a11y?.hidden && snapshot.perception?.affordance?.isInteractable) {
    issues.push({
      level: 'critical',
      category: 'accessibility',
      message: 'Hidden but interactive',
      details: 'Element is marked as hidden but has event listeners',
    });
  }

  // Check performance issues
  // NOTE: We can only detect if a component has re-rendered, not the exact count.
  // The lastRenderReason is more useful for identifying performance issues.
  const renderReason = snapshot.metal?.performance?.lastRenderReason;
  if (renderReason?.includes("'style' changed identity")) {
    issues.push({
      level: 'warning',
      category: 'performance',
      message: 'Inline style causing re-renders',
      details: renderReason,
    });
  }

  if (snapshot.metal?.pipeline?.layoutThrashingRisk === 'high') {
    issues.push({
      level: 'warning',
      category: 'performance',
      message: 'Layout thrashing risk',
      details: 'Element has listeners that may cause frequent layout recalculations',
    });
  }

  // Check usability issues
  if (snapshot.perception?.usability?.isTouchTargetValid === false) {
    const size = snapshot.perception.usability.touchTargetSize;
    if (snapshot.perception?.affordance?.isInteractable) {
      issues.push({
        level: 'warning',
        category: 'usability',
        message: 'Touch target too small',
        details: `Size: ${size} (should be at least 44x44)`,
      });
    }
  }

  if (snapshot.perception?.affordance?.dissonanceScore && snapshot.perception.affordance.dissonanceScore > 0.5) {
    issues.push({
      level: 'warning',
      category: 'usability',
      message: 'Affordance mismatch',
      details: snapshot.perception.affordance.looksInteractable
        ? 'Element looks clickable but has no interaction'
        : 'Element is interactive but does not look clickable',
    });
  }

  if (snapshot.perception?.visibility?.isOccluded) {
    issues.push({
      level: 'warning',
      category: 'usability',
      message: 'Element is occluded',
      details: `Covered by: ${snapshot.perception.visibility.occludedBy}`,
    });
  }

  // Check event blocking issues
  const blockingHandlers = snapshot.causality?.events?.blockingHandlers || [];
  if (blockingHandlers.length > 0) {
    const pointerBlocked = blockingHandlers.find(h => h.reason === 'pointer-events:none');
    const captureBlocked = blockingHandlers.filter(h => h.reason === 'captured');

    if (pointerBlocked) {
      issues.push({
        level: 'critical',
        category: 'events',
        message: 'Events blocked',
        details: `pointer-events: none on ${pointerBlocked.element}`,
      });
    }

    if (captureBlocked.length > 0) {
      issues.push({
        level: 'warning',
        category: 'events',
        message: 'Events may be captured',
        details: `${captureBlocked.length} ancestor(s) using capture phase`,
      });
    }
  }

  return issues;
}

/**
 * Calculate the pulse level based on health issues
 */
export function calculatePulseLevel(snapshot: SemanticSnapshot): PulseLevel {
  const issues = analyzeHealth(snapshot);

  if (issues.some(i => i.level === 'critical')) {
    return 'critical';
  }

  if (issues.some(i => i.level === 'warning')) {
    return 'warning';
  }

  return 'healthy';
}

/**
 * Get the color for a pulse level
 */
export function getPulseColor(level: PulseLevel): string {
  switch (level) {
    case 'critical':
      return '#ef4444'; // Red
    case 'warning':
      return '#f59e0b'; // Amber
    case 'healthy':
      return '#10b981'; // Green
  }
}

/**
 * Get indicator character for a pulse level (minimalist, no emoji)
 */
export function getPulseIndicator(level: PulseLevel): string {
  switch (level) {
    case 'critical':
      return '●';
    case 'warning':
      return '●';
    case 'healthy':
      return '●';
  }
}
