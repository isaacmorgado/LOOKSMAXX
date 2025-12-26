/**
 * Scoring System Type Definitions
 * Extracted from harmony-scoring.ts for better modularity
 */

// Re-export LandmarkPoint from landmarks module
export type { LandmarkPoint } from '@/lib/landmarks';

// ============================================
// CORE TYPES
// ============================================

export interface Point {
  x: number;
  y: number;
}

export type QualityTier = 'ideal' | 'excellent' | 'good' | 'below_average';
export type SeverityLevel = 'extremely_severe' | 'severe' | 'major' | 'moderate' | 'minor' | 'optimal';
export type MeasurementUnit = 'ratio' | 'percent' | 'degrees' | 'mm' | 'none';

/**
 * Confidence level for flaw/strength detection based on Z-score magnitude
 * - confirmed: |z| >= 2 (high statistical certainty, 2+ standard deviations from mean)
 * - likely: 1 <= |z| < 2 (moderate certainty, 1-2 standard deviations)
 * - possible: 0.5 <= |z| < 1 (low certainty, 0.5-1 standard deviation)
 */
export type ConfidenceLevel = 'confirmed' | 'likely' | 'possible';

/**
 * Polarity defines how deviation from the ideal range is interpreted:
 * - 'balanced': Default. Deviation in either direction is equally bad.
 * - 'higher_is_better': Values above the ideal are still good. Only values below
 *   the 'safeFloor' are true weaknesses. E.g., Canthal Tilt (positive tilt is good)
 * - 'lower_is_better': Values below the ideal are still good. Only values above
 *   the 'safeCeiling' are true weaknesses. E.g., Philtrum length (shorter is better)
 */
export type MetricPolarity = 'balanced' | 'higher_is_better' | 'lower_is_better';

export interface MetricConfig {
  id: string;
  name: string;
  category: string;
  unit: MeasurementUnit;
  idealMin: number;
  idealMax: number;
  rangeMin: number;
  rangeMax: number;
  decayRate: number;
  maxScore: number;
  weight: number;
  description: string;
  profileType: 'front' | 'side';
  customCurve?: BezierCurveConfig;
  /**
   * Polarity for directional/dimorphic scoring.
   * Defaults to 'balanced' if not specified.
   */
  polarity?: MetricPolarity;
  /**
   * For 'higher_is_better': minimum value that's still acceptable.
   * Values above this but below idealMin get a passing score (softFloorScore).
   * Values below this are true weaknesses.
   */
  safeFloor?: number;
  /**
   * For 'lower_is_better': maximum value that's still acceptable.
   * Values below this but above idealMax get a passing score (softCeilingScore).
   * Values above this are true weaknesses.
   */
  safeCeiling?: number;
  /**
   * Score given to values in the "acceptable but not ideal" zone.
   * Defaults to 8.0 (Good). Range: 6.0-9.0
   */
  softZoneScore?: number;
  /**
   * Facial landmarks used to calculate this metric.
   * For documentation/debugging purposes - references landmark IDs from landmarks.ts
   * Front profile landmarks: trichion, left_zygion, right_zygion, menton, etc.
   * Side profile landmarks: gonionTop, gonionBottom, nasion, pronasale, etc.
   */
  usedLandmarks?: string[];
}

/**
 * Dual Curve System Configuration
 *
 * The dual curve system allows for separate curves for scoring vs display:
 * - `points` (required): The scoring curve used for actual score calculation
 * - `displayPoints` (optional): A separate curve for UI visualization
 *
 * Use cases for separate display curves:
 * 1. Smoother visualization: Scoring may use sharp cutoffs, but display shows gradual transitions
 * 2. Marketing/UX: Show more forgiving curves to users while maintaining strict internal scoring
 * 3. A/B testing: Test different visual representations without affecting actual scores
 * 4. Simplified UI: Complex multi-segment scoring curves may need simpler display versions
 *
 * If `displayPoints` is not provided, the `points` curve is used for both scoring and display.
 */
export interface BezierCurveConfig {
  mode: 'custom' | 'exponential';
  /** Scoring curve points - used for actual score calculation */
  points: CurvePoint[];
  /** Optional display curve points - used for UI visualization only */
  displayPoints?: CurvePoint[];
}

export interface CurvePoint {
  x: number;
  y: number;
  leftHandleX?: number;
  leftHandleY?: number;
  rightHandleX?: number;
  rightHandleY?: number;
  fixed?: boolean;
}

export interface MetricScoreResult {
  metricId: string;
  name: string;
  value: number;
  score: number;  // 0-10 scale
  standardizedScore: number;
  qualityTier: QualityTier;
  severity: SeverityLevel;
  idealMin: number;
  idealMax: number;
  deviation: number;
  deviationDirection: 'above' | 'below' | 'within';
  unit: MeasurementUnit;
  category: string;
  percentile?: number;
}

export interface HarmonyAnalysis {
  overallScore: number;  // 0-10 scale
  standardizedScore: number;
  qualityTier: QualityTier;
  percentile: number;
  frontScore: number;
  sideScore: number;
  categoryScores: Record<string, number>;
  measurements: MetricScoreResult[];
  flaws: FlawAssessment[];
  strengths: StrengthAssessment[];
}

export interface FlawAssessment {
  category: string;
  metricId: string;
  metricName: string;
  severity: SeverityLevel;
  deviation: string;
  reasoning: string;
  confidence: ConfidenceLevel;
}

export interface StrengthAssessment {
  category: string;
  metricId: string;
  metricName: string;
  qualityTier: QualityTier;
  value: number;
  reasoning: string;
}

// ============================================
// DEMOGRAPHIC TYPES
// ============================================

export type Ethnicity =
  | 'east_asian'
  | 'south_asian'
  | 'black'
  | 'hispanic'
  | 'middle_eastern'
  | 'native_american'
  | 'pacific_islander'
  | 'white'
  | 'other';

export type Gender = 'male' | 'female';

export type DemographicKey = `${Ethnicity}_${Gender}` | Gender | Ethnicity;

export interface DemographicOverride {
  idealMin: number;
  idealMax: number;
}

export interface DemographicOptions {
  gender?: Gender;
  ethnicity?: Ethnicity;
}

// ============================================
// FLAW MAPPING TYPES
// ============================================

export interface FlawMapping {
  category: string;
  flawName: string;
  confidence: ConfidenceLevel;
  reasoning: string;
}

// ============================================
// PROFILE RESULT TYPES
// ============================================

export interface FrontProfileResults {
  measurements: MetricScoreResult[];
  overallScore: number;
  standardizedScore: number;
  qualityTier: QualityTier;
  categoryScores: Record<string, number>;
}

export interface SideProfileResults {
  measurements: MetricScoreResult[];
  overallScore: number;
  standardizedScore: number;
  qualityTier: QualityTier;
  categoryScores: Record<string, number>;
}

// ============================================
// PSL RATING TYPES
// ============================================

export interface PSLRating {
  score: number;
  tier: string;
  percentile: number;
  description: string;
}
