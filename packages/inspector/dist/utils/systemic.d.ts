/**
 * Systemic Layer Analysis for Eyeglass v2.0
 * Analyzes architectural impact and design system compliance
 */
import type { SystemicInfo, TokenMatch, TokenDeviation } from '@eyeglass/types';
/**
 * Analyze an element's styles for design system compliance
 */
export declare function analyzeDesignSystem(styles: {
    color: string;
    backgroundColor: string;
    padding: string;
    margin: string;
    fontFamily: string;
}): {
    tokenMatches: TokenMatch[];
    deviations: TokenDeviation[];
};
/**
 * Determine the risk level based on where the component is used
 * This is a placeholder - actual import count analysis requires bridge support
 */
export declare function determineRiskLevel(filePath?: string): 'Local' | 'Moderate' | 'Critical';
/**
 * Get systemic information for an element
 */
export declare function getSystemicInfo(filePath: string | undefined, styles: {
    color: string;
    backgroundColor: string;
    padding: string;
    margin: string;
    fontFamily: string;
}): SystemicInfo;
