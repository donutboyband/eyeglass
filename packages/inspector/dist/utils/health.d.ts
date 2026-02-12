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
export declare function analyzeHealth(snapshot: SemanticSnapshot): HealthIssue[];
/**
 * Calculate the pulse level based on health issues
 */
export declare function calculatePulseLevel(snapshot: SemanticSnapshot): PulseLevel;
/**
 * Get the color for a pulse level
 */
export declare function getPulseColor(level: PulseLevel): string;
/**
 * Get indicator character for a pulse level (minimalist, no emoji)
 */
export declare function getPulseIndicator(level: PulseLevel): string;
