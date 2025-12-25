/**
 * Results Transformation Utilities
 * Pure helper functions for transforming scoring results into UI-ready formats
 * Extracted from ResultsContext.tsx for better modularity
 */

import { LandmarkPoint } from '@/lib/landmarks';
import { MetricScoreResult } from '@/lib/scoring/types';
import { METRIC_CONFIGS } from '@/lib/harmony-scoring';
import { classifyMetric } from '@/lib/taxonomy';
import { Ratio } from '@/types/results';

// ============================================
// UNIT CONVERSION
// ============================================

/**
 * Converts internal measurement unit strings to display-friendly format
 */
export function convertUnitToRatioUnit(unit: string): 'x' | 'mm' | '%' | '°' {
  switch (unit) {
    case 'ratio': return 'x';
    case 'percent': return '%';
    case 'degrees': return '°';
    case 'mm': return 'mm';
    default: return 'x';
  }
}

// ============================================
// ILLUSTRATION TYPES
// ============================================

/**
 * Configuration for metric visualization overlays
 */
export interface IllustrationConfig {
  points: string[];
  lines: Array<{
    from: string;
    to: string;
    label?: string;
    color?: string;
    labelPosition?: 'start' | 'middle' | 'end';
  }>;
}

// ============================================
// ILLUSTRATION CONFIGURATIONS
// ============================================

/**
 * Comprehensive illustration configurations for all metrics
 * Maps metric IDs to their visualization parameters
 */
export const ILLUSTRATION_CONFIGS: Record<string, IllustrationConfig> = {
  // ==========================================
  // FACE SHAPE / PROPORTIONS
  // ==========================================
  faceWidthToHeight: {
    points: ['left_zygion', 'right_zygion', 'trichion', 'menton'],
    lines: [
      { from: 'left_zygion', to: 'right_zygion', label: 'Width', color: '#67e8f9', labelPosition: 'middle' },
      { from: 'trichion', to: 'menton', label: 'Height', color: '#a78bfa', labelPosition: 'end' },
    ],
  },
  totalFacialWidthToHeight: {
    points: ['left_zygion', 'right_zygion', 'trichion', 'menton'],
    lines: [
      { from: 'left_zygion', to: 'right_zygion', label: 'Cheek Width', color: '#67e8f9' },
      { from: 'trichion', to: 'menton', label: 'Total Height', color: '#a78bfa' },
    ],
  },
  lowerThirdProportion: {
    points: ['subnasale', 'menton', 'trichion'],
    lines: [
      { from: 'subnasale', to: 'menton', label: 'Lower Third', color: '#f97316', labelPosition: 'end' },
      { from: 'trichion', to: 'menton', label: 'Full Height', color: '#67e8f9', labelPosition: 'start' },
    ],
  },
  middleThirdProportion: {
    points: ['nasal_base', 'subnasale', 'trichion', 'menton'],
    lines: [
      { from: 'nasal_base', to: 'subnasale', label: 'Middle Third', color: '#22c55e', labelPosition: 'end' },
      { from: 'trichion', to: 'menton', label: 'Full Height', color: '#67e8f9', labelPosition: 'start' },
    ],
  },
  upperThirdProportion: {
    points: ['trichion', 'nasal_base', 'menton'],
    lines: [
      { from: 'trichion', to: 'nasal_base', label: 'Upper Third', color: '#fbbf24', labelPosition: 'end' },
      { from: 'trichion', to: 'menton', label: 'Full Height', color: '#67e8f9', labelPosition: 'start' },
    ],
  },
  bitemporalWidth: {
    points: ['left_temporal', 'right_temporal', 'left_zygion', 'right_zygion'],
    lines: [
      { from: 'left_temporal', to: 'right_temporal', label: 'Temple', color: '#fbbf24' },
      { from: 'left_zygion', to: 'right_zygion', label: 'Cheek', color: '#67e8f9' },
    ],
  },
  cheekboneHeight: {
    points: ['left_zygion', 'right_zygion', 'left_canthus_lateralis', 'right_canthus_lateralis', 'menton'],
    lines: [
      { from: 'left_zygion', to: 'right_zygion', label: 'Cheekbone', color: '#ec4899' },
      { from: 'left_canthus_lateralis', to: 'left_zygion', color: '#67e8f9' },
    ],
  },
  midfaceRatio: {
    points: ['left_zygion', 'right_zygion', 'left_canthus_medialis', 'right_canthus_medialis', 'subnasale'],
    lines: [
      { from: 'left_canthus_medialis', to: 'right_canthus_medialis', label: 'Midface Width', color: '#67e8f9' },
      { from: 'left_canthus_medialis', to: 'subnasale', label: 'Midface Height', color: '#a78bfa' },
    ],
  },

  // ==========================================
  // JAW MEASUREMENTS
  // ==========================================
  jawSlope: {
    points: ['left_gonion_inferior', 'left_mentum_lateralis', 'menton', 'right_mentum_lateralis', 'right_gonion_inferior'],
    lines: [
      { from: 'left_gonion_inferior', to: 'left_mentum_lateralis', label: 'Jaw Slope', color: '#f97316' },
      { from: 'right_gonion_inferior', to: 'right_mentum_lateralis', color: '#f97316' },
    ],
  },
  jawFrontalAngle: {
    points: ['left_gonion_inferior', 'menton', 'right_gonion_inferior'],
    lines: [
      { from: 'left_gonion_inferior', to: 'menton', label: 'Jaw Angle', color: '#f97316' },
      { from: 'menton', to: 'right_gonion_inferior', color: '#f97316' },
    ],
  },
  bigonialWidth: {
    points: ['left_gonion_inferior', 'right_gonion_inferior', 'left_zygion', 'right_zygion'],
    lines: [
      { from: 'left_gonion_inferior', to: 'right_gonion_inferior', label: 'Jaw Width', color: '#f97316' },
      { from: 'left_zygion', to: 'right_zygion', label: 'Cheek Width', color: '#67e8f9' },
    ],
  },
  jawWidthRatio: {
    points: ['left_gonion_inferior', 'right_gonion_inferior', 'left_zygion', 'right_zygion'],
    lines: [
      { from: 'left_gonion_inferior', to: 'right_gonion_inferior', label: 'Jaw', color: '#f97316' },
      { from: 'left_zygion', to: 'right_zygion', label: 'Face', color: '#67e8f9' },
    ],
  },

  // ==========================================
  // EYE MEASUREMENTS
  // ==========================================
  lateralCanthalTilt: {
    points: ['left_canthus_medialis', 'left_canthus_lateralis', 'right_canthus_medialis', 'right_canthus_lateralis'],
    lines: [
      { from: 'left_canthus_medialis', to: 'left_canthus_lateralis', label: 'Tilt', color: '#06b6d4', labelPosition: 'end' },
      { from: 'right_canthus_medialis', to: 'right_canthus_lateralis', color: '#06b6d4' },
    ],
  },
  eyeAspectRatio: {
    points: ['left_canthus_medialis', 'left_canthus_lateralis', 'left_palpebra_superior', 'left_palpebra_inferior'],
    lines: [
      { from: 'left_canthus_medialis', to: 'left_canthus_lateralis', label: 'Width', color: '#06b6d4' },
      { from: 'left_palpebra_superior', to: 'left_palpebra_inferior', label: 'Height', color: '#a78bfa' },
    ],
  },
  eyeSeparationRatio: {
    points: ['left_canthus_medialis', 'right_canthus_medialis', 'left_zygion', 'right_zygion'],
    lines: [
      { from: 'left_canthus_medialis', to: 'right_canthus_medialis', label: 'Intercanthal', color: '#06b6d4' },
      { from: 'left_zygion', to: 'right_zygion', label: 'Face Width', color: '#67e8f9' },
    ],
  },
  interpupillaryRatio: {
    points: ['left_pupila', 'right_pupila', 'left_zygion', 'right_zygion'],
    lines: [
      { from: 'left_pupila', to: 'right_pupila', label: 'IPD', color: '#06b6d4' },
      { from: 'left_zygion', to: 'right_zygion', label: 'Face Width', color: '#67e8f9' },
    ],
  },
  interpupillaryMouthWidthRatio: {
    points: ['left_pupila', 'right_pupila', 'left_cheilion', 'right_cheilion'],
    lines: [
      { from: 'left_pupila', to: 'right_pupila', label: 'IPD', color: '#06b6d4' },
      { from: 'left_cheilion', to: 'right_cheilion', label: 'Mouth', color: '#ec4899' },
    ],
  },
  oneEyeApartTest: {
    points: ['left_canthus_medialis', 'right_canthus_medialis', 'left_canthus_lateralis'],
    lines: [
      { from: 'left_canthus_medialis', to: 'right_canthus_medialis', label: 'Between Eyes', color: '#06b6d4' },
      { from: 'left_canthus_medialis', to: 'left_canthus_lateralis', label: 'Eye Width', color: '#a78bfa' },
    ],
  },

  // ==========================================
  // EYEBROW MEASUREMENTS
  // ==========================================
  browLengthRatio: {
    points: ['left_supercilium_medialis', 'left_supercilium_lateralis', 'left_zygion', 'right_zygion'],
    lines: [
      { from: 'left_supercilium_medialis', to: 'left_supercilium_lateralis', label: 'Brow', color: '#84cc16' },
      { from: 'left_zygion', to: 'right_zygion', label: 'Face Width', color: '#67e8f9' },
    ],
  },
  eyebrowTilt: {
    points: ['left_supercilium_medialis', 'left_supercilium_apex', 'left_supercilium_lateralis'],
    lines: [
      { from: 'left_supercilium_medialis', to: 'left_supercilium_apex', label: 'Tilt', color: '#84cc16' },
      { from: 'left_supercilium_apex', to: 'left_supercilium_lateralis', color: '#84cc16' },
    ],
  },
  eyebrowLowSetedness: {
    points: ['left_supercilium_medialis', 'left_palpebra_superior', 'left_canthus_medialis'],
    lines: [
      { from: 'left_supercilium_medialis', to: 'left_palpebra_superior', label: 'Brow-Eye Gap', color: '#84cc16' },
    ],
  },

  // ==========================================
  // NOSE MEASUREMENTS (FRONT)
  // ==========================================
  nasalIndex: {
    points: ['left_ala_nasi', 'right_ala_nasi', 'nasal_base', 'subnasale'],
    lines: [
      { from: 'left_ala_nasi', to: 'right_ala_nasi', label: 'Width', color: '#fbbf24' },
      { from: 'nasal_base', to: 'subnasale', label: 'Height', color: '#a78bfa' },
    ],
  },
  intercanthalNasalRatio: {
    points: ['left_ala_nasi', 'right_ala_nasi', 'left_canthus_medialis', 'right_canthus_medialis'],
    lines: [
      { from: 'left_ala_nasi', to: 'right_ala_nasi', label: 'Nose Width', color: '#fbbf24' },
      { from: 'left_canthus_medialis', to: 'right_canthus_medialis', label: 'Intercanthal', color: '#06b6d4' },
    ],
  },
  noseBridgeWidth: {
    points: ['left_dorsum_nasi', 'right_dorsum_nasi', 'left_ala_nasi', 'right_ala_nasi'],
    lines: [
      { from: 'left_dorsum_nasi', to: 'right_dorsum_nasi', label: 'Bridge', color: '#fbbf24' },
      { from: 'left_ala_nasi', to: 'right_ala_nasi', label: 'Base', color: '#f97316' },
    ],
  },
  noseTipPosition: {
    points: ['subnasale', 'left_ala_nasi', 'right_ala_nasi'],
    lines: [
      { from: 'left_ala_nasi', to: 'right_ala_nasi', label: 'Tip Position', color: '#fbbf24' },
    ],
  },

  // ==========================================
  // MOUTH/LIP MEASUREMENTS
  // ==========================================
  mouthNoseWidthRatio: {
    points: ['left_cheilion', 'right_cheilion', 'left_ala_nasi', 'right_ala_nasi'],
    lines: [
      { from: 'left_cheilion', to: 'right_cheilion', label: 'Mouth', color: '#ec4899' },
      { from: 'left_ala_nasi', to: 'right_ala_nasi', label: 'Nose', color: '#fbbf24' },
    ],
  },
  lowerUpperLipRatio: {
    points: ['labrale_superius', 'mouth_middle', 'labrale_inferius'],
    lines: [
      { from: 'labrale_superius', to: 'mouth_middle', label: 'Upper', color: '#ec4899' },
      { from: 'mouth_middle', to: 'labrale_inferius', label: 'Lower', color: '#f97316' },
    ],
  },
  chinPhiltrumRatio: {
    points: ['subnasale', 'labrale_superius', 'labrale_inferius', 'menton'],
    lines: [
      { from: 'subnasale', to: 'labrale_superius', label: 'Philtrum', color: '#ec4899' },
      { from: 'labrale_inferius', to: 'menton', label: 'Chin', color: '#ef4444' },
    ],
  },
  mouthWidth: {
    points: ['left_cheilion', 'right_cheilion'],
    lines: [{ from: 'left_cheilion', to: 'right_cheilion', label: 'Mouth Width', color: '#ec4899' }],
  },

  // ==========================================
  // CHIN MEASUREMENTS
  // ==========================================
  chinHeight: {
    points: ['labrale_inferius', 'menton'],
    lines: [{ from: 'labrale_inferius', to: 'menton', label: 'Chin Height', color: '#ef4444' }],
  },

  // ==========================================
  // NECK MEASUREMENTS
  // ==========================================
  neckWidthRatio: {
    points: ['left_cervical_lateralis', 'right_cervical_lateralis', 'left_gonion_inferior', 'right_gonion_inferior'],
    lines: [
      { from: 'left_cervical_lateralis', to: 'right_cervical_lateralis', label: 'Neck', color: '#14b8a6' },
      { from: 'left_gonion_inferior', to: 'right_gonion_inferior', label: 'Jaw', color: '#f97316' },
    ],
  },

  // ==========================================
  // SIDE PROFILE MEASUREMENTS
  // ==========================================
  gonialAngle: {
    points: ['tragus', 'gonionBottom', 'menton'],
    lines: [
      { from: 'tragus', to: 'gonionBottom', label: 'Ramus', color: '#f97316' },
      { from: 'gonionBottom', to: 'menton', label: 'Mandible', color: '#ef4444' },
    ],
  },
  nasofrontalAngle: {
    points: ['glabella', 'nasion', 'pronasale'],
    lines: [
      { from: 'glabella', to: 'nasion', label: 'Forehead', color: '#84cc16' },
      { from: 'nasion', to: 'pronasale', label: 'Nose', color: '#fbbf24' },
    ],
  },
  nasofacialAngle: {
    points: ['nasion', 'pronasale', 'pogonion'],
    lines: [
      { from: 'nasion', to: 'pronasale', color: '#fbbf24' },
      { from: 'pronasale', to: 'pogonion', color: '#67e8f9' },
    ],
  },
  nasomentaAngle: {
    points: ['nasion', 'pronasale', 'pogonion'],
    lines: [
      { from: 'nasion', to: 'pronasale', label: 'Nose', color: '#fbbf24' },
      { from: 'pronasale', to: 'pogonion', label: 'To Chin', color: '#ef4444' },
    ],
  },
  submentalCervicalAngle: {
    points: ['menton', 'cervicalPoint', 'neckPoint'],
    lines: [
      { from: 'menton', to: 'cervicalPoint', label: 'Submental', color: '#14b8a6' },
      { from: 'cervicalPoint', to: 'neckPoint', label: 'Cervical', color: '#06b6d4' },
    ],
  },
  facialDepthToHeight: {
    points: ['pronasale', 'tragus', 'nasion', 'menton'],
    lines: [
      { from: 'pronasale', to: 'tragus', label: 'Depth', color: '#67e8f9' },
      { from: 'nasion', to: 'menton', label: 'Height', color: '#a78bfa' },
    ],
  },
  anteriorFacialDepth: {
    points: ['glabella', 'pronasale', 'pogonion'],
    lines: [
      { from: 'glabella', to: 'pronasale', color: '#67e8f9' },
      { from: 'pronasale', to: 'pogonion', color: '#a78bfa' },
    ],
  },
  mandibularPlaneAngle: {
    points: ['gonionBottom', 'menton', 'orbitale', 'porion'],
    lines: [
      { from: 'gonionBottom', to: 'menton', label: 'Mandibular', color: '#f97316' },
      { from: 'orbitale', to: 'porion', label: 'Frankfort', color: '#67e8f9' },
    ],
  },
  ramusToMandibleRatio: {
    points: ['gonionTop', 'gonionBottom', 'menton'],
    lines: [
      { from: 'gonionTop', to: 'gonionBottom', label: 'Ramus', color: '#f97316' },
      { from: 'gonionBottom', to: 'menton', label: 'Mandible', color: '#ef4444' },
    ],
  },
  orbitalVector: {
    points: ['cornealApex', 'orbitale', 'cheekbone'],
    lines: [
      { from: 'cornealApex', to: 'cheekbone', label: 'Orbital Vector', color: '#06b6d4' },
    ],
  },
  eLineLowerLip: {
    points: ['pronasale', 'pogonion', 'labraleInferius'],
    lines: [
      { from: 'pronasale', to: 'pogonion', label: 'E-Line', color: '#67e8f9' },
    ],
  },
  sLineLowerLip: {
    points: ['pronasale', 'pogonion', 'labraleInferius'],
    lines: [
      { from: 'pronasale', to: 'pogonion', label: 'S-Line', color: '#a78bfa' },
    ],
  },
  holdawayHLine: {
    points: ['pronasale', 'pogonion', 'labraleSuperius', 'labraleInferius'],
    lines: [
      { from: 'pronasale', to: 'pogonion', label: 'H-Line', color: '#ec4899' },
    ],
  },
  burstoneLowerLip: {
    points: ['subnasale', 'pogonion', 'labraleInferius'],
    lines: [
      { from: 'subnasale', to: 'pogonion', label: 'Burstone', color: '#fbbf24' },
    ],
  },

  // ==========================================
  // ADDITIONAL FRONT PROFILE METRICS
  // ==========================================
  cupidsBowDepth: {
    points: ['labrale_superius', 'cupids_bow_left', 'cupids_bow_right', 'cupids_bow_center'],
    lines: [
      { from: 'cupids_bow_left', to: 'cupids_bow_center', label: 'Bow', color: '#ec4899' },
      { from: 'cupids_bow_center', to: 'cupids_bow_right', color: '#ec4899' },
    ],
  },
  mouthCornerPosition: {
    points: ['left_cheilion', 'right_cheilion', 'left_pupila', 'right_pupila'],
    lines: [
      { from: 'left_cheilion', to: 'right_cheilion', label: 'Mouth Width', color: '#ec4899' },
      { from: 'left_pupila', to: 'right_pupila', label: 'IPD', color: '#06b6d4', labelPosition: 'start' },
    ],
  },
  iaaJfaDeviation: {
    points: ['left_ala_nasi', 'right_ala_nasi', 'left_gonion_inferior', 'menton', 'right_gonion_inferior'],
    lines: [
      { from: 'left_ala_nasi', to: 'right_ala_nasi', label: 'IAA', color: '#fbbf24' },
      { from: 'left_gonion_inferior', to: 'menton', label: 'JFA', color: '#f97316' },
      { from: 'menton', to: 'right_gonion_inferior', color: '#f97316' },
    ],
  },
  ipsilateralAlarAngle: {
    points: ['left_ala_nasi', 'subnasale', 'right_ala_nasi'],
    lines: [
      { from: 'left_ala_nasi', to: 'subnasale', label: 'Alar Angle', color: '#fbbf24' },
      { from: 'subnasale', to: 'right_ala_nasi', color: '#fbbf24' },
    ],
  },
  earProtrusionAngle: {
    points: ['left_ear_helix', 'left_ear_attachment', 'left_tragus'],
    lines: [
      { from: 'left_ear_helix', to: 'left_ear_attachment', label: 'Protrusion', color: '#a78bfa' },
    ],
  },
  earProtrusionRatio: {
    points: ['left_ear_helix', 'left_ear_attachment', 'left_ear_lobule'],
    lines: [
      { from: 'left_ear_helix', to: 'left_ear_attachment', label: 'Distance', color: '#a78bfa' },
      { from: 'left_ear_attachment', to: 'left_ear_lobule', label: 'Length', color: '#67e8f9' },
    ],
  },
  mouthWidthToNoseRatio: {
    points: ['left_cheilion', 'right_cheilion', 'left_ala_nasi', 'right_ala_nasi'],
    lines: [
      { from: 'left_cheilion', to: 'right_cheilion', label: 'Mouth', color: '#ec4899' },
      { from: 'left_ala_nasi', to: 'right_ala_nasi', label: 'Nose', color: '#fbbf24' },
    ],
  },
  lowerToUpperLipRatio: {
    points: ['labrale_superius', 'mouth_middle', 'labrale_inferius'],
    lines: [
      { from: 'labrale_superius', to: 'mouth_middle', label: 'Upper', color: '#ec4899' },
      { from: 'mouth_middle', to: 'labrale_inferius', label: 'Lower', color: '#f97316' },
    ],
  },
  chinToPhiltrumRatio: {
    points: ['subnasale', 'labrale_superius', 'labrale_inferius', 'menton'],
    lines: [
      { from: 'subnasale', to: 'labrale_superius', label: 'Philtrum', color: '#ec4899' },
      { from: 'labrale_inferius', to: 'menton', label: 'Chin', color: '#ef4444' },
    ],
  },

  // ==========================================
  // ADDITIONAL SIDE PROFILE METRICS
  // ==========================================
  nasolabialAngle: {
    points: ['columella', 'subnasale', 'labraleSuperius'],
    lines: [
      { from: 'columella', to: 'subnasale', label: 'Columella', color: '#fbbf24' },
      { from: 'subnasale', to: 'labraleSuperius', label: 'Upper Lip', color: '#ec4899' },
    ],
  },
  nasalTipAngle: {
    points: ['nasion', 'pronasale', 'columella'],
    lines: [
      { from: 'nasion', to: 'pronasale', label: 'Dorsum', color: '#fbbf24' },
      { from: 'pronasale', to: 'columella', label: 'Tip', color: '#f97316' },
    ],
  },
  nasalProjection: {
    points: ['alar_crease', 'pronasale', 'subnasale'],
    lines: [
      { from: 'alar_crease', to: 'pronasale', label: 'Projection', color: '#fbbf24' },
    ],
  },
  nasalWToHRatio: {
    points: ['alar_crease', 'pronasale', 'nasion', 'subnasale'],
    lines: [
      { from: 'alar_crease', to: 'pronasale', label: 'Width', color: '#fbbf24' },
      { from: 'nasion', to: 'subnasale', label: 'Height', color: '#a78bfa' },
    ],
  },
  noseTipRotationAngle: {
    points: ['columella', 'subnasale', 'labraleSuperius'],
    lines: [
      { from: 'columella', to: 'subnasale', label: 'Rotation', color: '#fbbf24' },
    ],
  },
  frankfortTipAngle: {
    points: ['porion', 'orbitale', 'pronasale'],
    lines: [
      { from: 'porion', to: 'orbitale', label: 'Frankfort', color: '#67e8f9' },
      { from: 'orbitale', to: 'pronasale', label: 'To Tip', color: '#fbbf24' },
    ],
  },
  mentolabialAngle: {
    points: ['labraleInferius', 'mentolabialSulcus', 'pogonion'],
    lines: [
      { from: 'labraleInferius', to: 'mentolabialSulcus', label: 'Lip', color: '#ec4899' },
      { from: 'mentolabialSulcus', to: 'pogonion', label: 'Chin', color: '#ef4444' },
    ],
  },
  zAngle: {
    points: ['pogonion', 'labraleSuperius', 'frankfortHorizontal'],
    lines: [
      { from: 'pogonion', to: 'labraleSuperius', label: 'Z-Line', color: '#a78bfa' },
    ],
  },
  facialConvexityGlabella: {
    points: ['glabella', 'subnasale', 'pogonion'],
    lines: [
      { from: 'glabella', to: 'subnasale', label: 'Upper', color: '#84cc16' },
      { from: 'subnasale', to: 'pogonion', label: 'Lower', color: '#ef4444' },
    ],
  },
  facialConvexityNasion: {
    points: ['nasion', 'subnasale', 'pogonion'],
    lines: [
      { from: 'nasion', to: 'subnasale', label: 'Midface', color: '#22c55e' },
      { from: 'subnasale', to: 'pogonion', label: 'Lower', color: '#ef4444' },
    ],
  },
  totalFacialConvexity: {
    points: ['glabella', 'pronasale', 'pogonion'],
    lines: [
      { from: 'glabella', to: 'pronasale', label: 'Upper', color: '#84cc16' },
      { from: 'pronasale', to: 'pogonion', label: 'Lower', color: '#ef4444' },
    ],
  },
  interiorMidfaceProjectionAngle: {
    points: ['orbitale', 'subnasale', 'pronasale'],
    lines: [
      { from: 'orbitale', to: 'subnasale', label: 'Orbital', color: '#06b6d4' },
      { from: 'subnasale', to: 'pronasale', label: 'Midface', color: '#67e8f9' },
    ],
  },
  recessionFromFrankfort: {
    points: ['porion', 'orbitale', 'pogonion'],
    lines: [
      { from: 'porion', to: 'orbitale', label: 'Frankfort', color: '#67e8f9' },
      { from: 'orbitale', to: 'pogonion', label: 'Recession', color: '#ef4444' },
    ],
  },
  gonionToMouthLine: {
    points: ['gonionBottom', 'cheilion', 'tragus'],
    lines: [
      { from: 'gonionBottom', to: 'cheilion', label: 'Gonion-Mouth', color: '#f97316' },
    ],
  },
  eLineUpperLip: {
    points: ['pronasale', 'pogonion', 'labraleSuperius'],
    lines: [
      { from: 'pronasale', to: 'pogonion', label: 'E-Line', color: '#67e8f9' },
    ],
  },
  sLineUpperLip: {
    points: ['pronasale', 'pogonion', 'labraleSuperius'],
    lines: [
      { from: 'pronasale', to: 'pogonion', label: 'S-Line', color: '#a78bfa' },
    ],
  },
  burstoneUpperLip: {
    points: ['subnasale', 'pogonion', 'labraleSuperius'],
    lines: [
      { from: 'subnasale', to: 'pogonion', label: 'Burstone', color: '#fbbf24' },
    ],
  },
  chinProjection: {
    points: ['subnasale', 'pogonion', 'menton', 'frankfortHorizontal'],
    lines: [
      { from: 'subnasale', to: 'pogonion', label: 'Chin Proj', color: '#ef4444' },
    ],
  },
  recessionRelativeToFrankfort: {
    points: ['porion', 'orbitale', 'pogonion', 'menton'],
    lines: [
      { from: 'porion', to: 'orbitale', label: 'Frankfort', color: '#67e8f9' },
      { from: 'pogonion', to: 'menton', label: 'Recession', color: '#ef4444' },
    ],
  },
  browridgeInclinationAngle: {
    points: ['glabella', 'trichion', 'nasion'],
    lines: [
      { from: 'glabella', to: 'trichion', label: 'Brow Ridge', color: '#84cc16' },
      { from: 'glabella', to: 'nasion', color: '#67e8f9' },
    ],
  },
  upperForeheadSlope: {
    points: ['trichion', 'glabella', 'frankfortHorizontal'],
    lines: [
      { from: 'trichion', to: 'glabella', label: 'Forehead', color: '#84cc16' },
    ],
  },
  midfaceProjectionAngle: {
    points: ['orbitale', 'subnasale', 'pronasale'],
    lines: [
      { from: 'orbitale', to: 'subnasale', color: '#67e8f9' },
      { from: 'subnasale', to: 'pronasale', label: 'Projection', color: '#22c55e' },
    ],
  },
};

// ============================================
// ILLUSTRATION GENERATION
// ============================================

/**
 * Generates illustration data for a metric based on available landmarks
 */
export function generateIllustration(metricId: string, landmarks: LandmarkPoint[]): Ratio['illustration'] {
  const landmarkMap: Record<string, LandmarkPoint> = {};
  landmarks.forEach(l => { landmarkMap[l.id] = l; });

  const config = ILLUSTRATION_CONFIGS[metricId];
  const points: Record<string, { type: 'landmark'; landmarkId: string }> = {};
  const lines: Record<string, { from: string; to: string; color: string; label?: string; labelPosition?: 'start' | 'middle' | 'end' }> = {};

  if (config) {
    config.points.forEach((pointId, i) => {
      if (landmarkMap[pointId]) {
        points[`point_${i}`] = { type: 'landmark', landmarkId: pointId };
      }
    });
    config.lines.forEach((line, i) => {
      lines[`line_${i}`] = {
        from: line.from,
        to: line.to,
        color: line.color || '#67e8f9',
        label: line.label,
        labelPosition: line.labelPosition,
      };
    });
  }

  return { points, lines };
}

// ============================================
// LANDMARK MAPPING
// ============================================

/**
 * Returns the landmark IDs used by a specific metric
 */
export function getUsedLandmarks(metricId: string): string[] {
  const landmarkMappings: Record<string, string[]> = {
    faceWidthToHeight: ['left_zygion', 'right_zygion', 'trichion', 'menton'],
    lateralCanthalTilt: ['left_canthus_medialis', 'left_canthus_lateralis'],
    nasalIndex: ['left_ala_nasi', 'right_ala_nasi', 'nasal_base', 'subnasale'],
    ipd: ['left_pupila', 'right_pupila'],
    mouthWidth: ['left_cheilion', 'right_cheilion'],
    jawWidth: ['left_gonion_inferior', 'right_gonion_inferior'],
    chinHeight: ['labrale_inferius', 'menton'],
    gonialAngle: ['tragus', 'gonionBottom', 'menton'],
  };
  return landmarkMappings[metricId] || [];
}

// ============================================
// FLAW/STRENGTH MAPPINGS
// ============================================

/**
 * Determines potential flaws or strengths based on metric score result
 */
export function getFlawStrengthMappings(result: MetricScoreResult): { mayIndicateFlaws: string[]; mayIndicateStrengths: string[] } {
  const flawMappings: Record<string, { low: string[]; high: string[] }> = {
    faceWidthToHeight: {
      low: ['Narrow face', 'Vertically elongated face'],
      high: ['Wide face', 'Horizontally expanded face'],
    },
    lowerThirdProportion: {
      low: ['Short lower third', 'Deficient mandible'],
      high: ['Long lower third', 'Mandibular excess'],
    },
    lateralCanthalTilt: {
      low: ['Negative canthal tilt', 'Drooping eyes'],
      high: ['Excessive positive canthal tilt'],
    },
    nasalIndex: {
      low: ['Narrow nose', 'Leptorrhine nose'],
      high: ['Wide nose', 'Platyrrhine nose'],
    },
    gonialAngle: {
      low: ['Steep mandibular plane'],
      high: ['Flat mandibular plane', 'Weak jaw definition'],
    },
  };

  const strengthMappings: Record<string, { ideal: string[] }> = {
    faceWidthToHeight: { ideal: ['Balanced facial proportions', 'Harmonious face shape'] },
    lateralCanthalTilt: { ideal: ['Attractive eye shape', 'Positive canthal tilt'] },
    nasalIndex: { ideal: ['Well-proportioned nose', 'Balanced nasal width'] },
    gonialAngle: { ideal: ['Well-defined jawline', 'Strong jaw structure'] },
  };

  const mapping = flawMappings[result.metricId];
  const strengthMapping = strengthMappings[result.metricId];

  let mayIndicateFlaws: string[] = [];
  let mayIndicateStrengths: string[] = [];

  if (result.qualityTier === 'ideal' || result.qualityTier === 'excellent') {
    mayIndicateStrengths = strengthMapping?.ideal || [];
  } else if (mapping) {
    mayIndicateFlaws = result.deviationDirection === 'below' ? mapping.low : mapping.high;
  }

  return { mayIndicateFlaws, mayIndicateStrengths };
}

// ============================================
// RATIO TRANSFORMATION
// ============================================

/**
 * Transforms a MetricScoreResult into a UI-ready Ratio object
 */
export function transformToRatio(result: MetricScoreResult, landmarks: LandmarkPoint[]): Ratio {
  const metricConfig = METRIC_CONFIGS[result.metricId];

  // Generate illustration based on metric
  const illustration = generateIllustration(result.metricId, landmarks);

  // Get flaw/strength mappings
  const { mayIndicateFlaws, mayIndicateStrengths } = getFlawStrengthMappings(result);

  // Classify metric using Harmony taxonomy
  const taxonomyClassification = classifyMetric(result.name, result.category);

  return {
    id: result.metricId,
    name: result.name,
    value: result.value,
    score: result.standardizedScore,  // Use standardized 0-10 score for UI display
    standardizedScore: result.standardizedScore,
    unit: convertUnitToRatioUnit(result.unit),
    idealMin: result.idealMin,
    idealMax: result.idealMax,
    rangeMin: metricConfig?.rangeMin || result.idealMin - 0.5,
    rangeMax: metricConfig?.rangeMax || result.idealMax + 0.5,
    description: metricConfig?.description || '',
    category: result.category,
    qualityLevel: result.qualityTier,
    severity: result.severity,
    illustration,
    mayIndicateFlaws,
    mayIndicateStrengths,
    usedLandmarks: getUsedLandmarks(result.metricId),
    scoringCurveConfig: metricConfig ? {
      decayRate: metricConfig.decayRate,
      maxScore: metricConfig.maxScore,
    } : undefined,
    taxonomyPrimary: taxonomyClassification?.primary,
    taxonomySecondary: taxonomyClassification?.secondary,
  };
}
