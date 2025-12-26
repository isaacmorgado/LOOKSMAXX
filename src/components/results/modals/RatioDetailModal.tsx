'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ChevronDown, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { MetricScoreResult, Gender, Ethnicity } from '@/lib/harmony-scoring';
import { generateAIDescription, getSeverityFromScore } from '@/lib/aiDescriptions';
import { getScoreColor, Ratio } from '@/types/results';
import { GradientRangeBar } from '../visualization/GradientRangeBar';
import { FaceOverlay } from '../visualization/FaceOverlay';
import { LandmarkPoint } from '@/lib/landmarks';

// ============================================
// TYPES
// ============================================

interface RatioDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ratio: MetricScoreResult | null;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  facePhoto?: string;
  landmarks?: LandmarkPoint[];
  allRatios?: Ratio[];
  profileType?: 'front' | 'side';
  gender?: Gender;
  ethnicity?: Ethnicity;
}

// ============================================
// COMPACT SCORE DISPLAY
// ============================================

function ScoreDisplay({ score, label }: { score: number; label: string }) {
  const color = getScoreColor(score);
  return (
    <div className="text-center">
      <div className="text-3xl font-bold" style={{ color }}>{score.toFixed(1)}</div>
      <div className="text-[10px] text-neutral-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// ============================================
// EXPANDABLE SECTION
// ============================================

function ExpandableSection({
  title,
  children,
  defaultOpen = false
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-neutral-800/50 transition-colors"
      >
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{title}</span>
        <ChevronDown
          size={16}
          className={`text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 pb-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN MODAL COMPONENT (Simplified)
// ============================================

import { useResults } from '@/contexts/ResultsContext';

export function RatioDetailModal({
  isOpen,
  onClose,
  ratio,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  facePhoto,
  landmarks = [],
  allRatios = [],
  profileType = 'front',
  gender,
  ethnicity,
}: RatioDetailModalProps) {
  const { showLandmarkOverlay } = useResults();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate AI description from ratio data
  const flawDetail = useMemo(() => {
    if (!ratio) return null;
    return generateAIDescription(
      ratio.metricId.toLowerCase().replace(/\s+/g, ''),
      ratio.name,
      ratio.value,
      ratio.idealMin,
      ratio.idealMax,
      ratio.score,
      ratio.unit,
      ratio.category
    );
  }, [ratio]);

  // Find the full Ratio object for FaceOverlay
  const selectedRatioForOverlay = useMemo((): Ratio | null => {
    if (!ratio) return null;
    const found = allRatios.find(r => r.id === ratio.metricId || r.name === ratio.name);
    if (found) return found;
    return {
      id: ratio.metricId,
      name: ratio.name,
      value: ratio.value,
      score: ratio.score,
      standardizedScore: ratio.standardizedScore || ratio.score,
      idealMin: ratio.idealMin,
      idealMax: ratio.idealMax,
      category: ratio.category,
      unit: ratio.unit === 'ratio' ? 'x' : ratio.unit === 'percent' ? '%' : ratio.unit === 'degrees' ? '°' : '',
      qualityLevel: ratio.qualityTier || 'good',
      severity: ratio.severity || 'moderate',
    } as Ratio;
  }, [ratio, allRatios]);

  if (!mounted) return null;
  if (!ratio || !flawDetail) return null;

  const scoreColor = getScoreColor(ratio.score);
  const isWithinIdeal = ratio.value >= ratio.idealMin && ratio.value <= ratio.idealMax;
  const severity = getSeverityFromScore(ratio.score);
  const deviation = ratio.value < ratio.idealMin
    ? ratio.idealMin - ratio.value
    : ratio.value > ratio.idealMax
      ? ratio.value - ratio.idealMax
      : 0;

  // Format value with unit
  const formatUnit = (v: number) => {
    const formatted = v.toFixed(ratio.unit === 'percent' ? 1 : 2);
    const suffix = ratio.unit === 'percent' ? '%' : ratio.unit === 'degrees' ? '°' : ratio.unit === 'mm' ? 'mm' : '';
    return `${formatted}${suffix}`;
  };

  // Calculate range for visualization
  const idealRange = ratio.idealMax - ratio.idealMin;
  const rangeMin = ratio.idealMin - idealRange * 1.5;
  const rangeMax = ratio.idealMax + idealRange * 1.5;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Desktop Nav Arrows */}
          {hasPrevious && onPrevious && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={onPrevious}
              className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-[10001] w-10 h-10 rounded-full bg-neutral-800/90 border border-neutral-700 hover:bg-neutral-700 transition-all items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-300" />
            </motion.button>
          )}
          {hasNext && onNext && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={onNext}
              className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-[10001] w-10 h-10 rounded-full bg-neutral-800/90 border border-neutral-700 hover:bg-neutral-700 transition-all items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-neutral-300" />
            </motion.button>
          )}

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl pointer-events-auto"
            >
              {/* Compact Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  {hasPrevious && onPrevious && (
                    <button onClick={onPrevious} className="lg:hidden p-1 hover:bg-neutral-800 rounded text-neutral-400">
                      <ChevronLeft size={18} />
                    </button>
                  )}
                  <div>
                    <h2 className="text-base font-semibold text-white">{ratio.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">{ratio.category}</span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded capitalize"
                        style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}
                      >
                        {severity.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  {hasNext && onNext && (
                    <button onClick={onNext} className="lg:hidden p-1 hover:bg-neutral-800 rounded text-neutral-400">
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(85vh-56px)] space-y-4">
                {/* Hero Stats Row */}
                <div className="flex items-center justify-between bg-neutral-800/50 rounded-xl p-4">
                  <div className="flex-1">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Your Value</div>
                    <div className="text-2xl font-bold text-white">{formatUnit(ratio.value)}</div>
                    {!isWithinIdeal && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-neutral-400">
                        {ratio.value < ratio.idealMin ? (
                          <><TrendingDown size={12} className="text-amber-400" /> {formatUnit(deviation)} below ideal</>
                        ) : (
                          <><TrendingUp size={12} className="text-amber-400" /> {formatUnit(deviation)} above ideal</>
                        )}
                      </div>
                    )}
                    {isWithinIdeal && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
                        <Target size={12} /> Within ideal range
                      </div>
                    )}
                  </div>
                  <div className="w-px h-12 bg-neutral-700 mx-4" />
                  <div className="text-center">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Ideal</div>
                    <div className="text-sm text-cyan-400 font-medium">
                      {formatUnit(ratio.idealMin)} - {formatUnit(ratio.idealMax)}
                    </div>
                  </div>
                  <div className="w-px h-12 bg-neutral-700 mx-4" />
                  <ScoreDisplay score={ratio.score} label="Score" />
                </div>

                {/* Range Bar */}
                <GradientRangeBar
                  value={ratio.value}
                  idealMin={ratio.idealMin}
                  idealMax={ratio.idealMax}
                  rangeMin={rangeMin}
                  rangeMax={rangeMax}
                  unit={ratio.unit}
                />

                {/* Two Column: Photo + Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Face Photo */}
                  {facePhoto && (
                    <div className="rounded-xl overflow-hidden border border-neutral-800">
                      <FaceOverlay
                        photo={facePhoto}
                        landmarks={landmarks}
                        selectedRatio={selectedRatioForOverlay}
                        profileType={profileType}
                        showAllLandmarks={showLandmarkOverlay}
                      />
                    </div>
                  )}

                  {/* Info Panel */}
                  <div className={`space-y-3 ${!facePhoto ? 'md:col-span-2' : ''}`}>
                    {/* Insight Card */}
                    <div
                      className="rounded-xl p-3 border"
                      style={{
                        backgroundColor: ratio.score >= 7 ? 'rgba(34, 211, 238, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                        borderColor: ratio.score >= 7 ? 'rgba(34, 211, 238, 0.3)' : 'rgba(251, 191, 36, 0.3)',
                      }}
                    >
                      <div className="text-sm font-medium text-white mb-1">
                        {ratio.score >= 7 ? `Good ${ratio.name.toLowerCase()}` : flawDetail.flawName}
                      </div>
                      <div className="text-xs text-neutral-300 leading-relaxed">
                        {ratio.score >= 7 ? (
                          `Your ${ratio.name.toLowerCase()} is ${isWithinIdeal ? 'within' : 'close to'} the ideal range, contributing to facial harmony.`
                        ) : (
                          flawDetail.reasoning
                        )}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <ExpandableSection title="About this measurement">
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        This measurement evaluates your {ratio.category.toLowerCase()} proportions.
                        {gender === 'male' && ' Ideal ranges for males favor more angular, defined features.'}
                        {gender === 'female' && ' Ideal ranges for females favor softer, balanced proportions.'}
                        {ethnicity && ethnicity !== 'other' && ` Adjusted for ${ethnicity.replace('_', ' ')} demographics.`}
                      </p>
                    </ExpandableSection>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {gender && (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-neutral-800 text-neutral-400 capitalize">{gender}</span>
                      )}
                      {ethnicity && ethnicity !== 'other' && (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-neutral-800 text-neutral-400 capitalize">{ethnicity.replace('_', ' ')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

export default RatioDetailModal;
