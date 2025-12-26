'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight,
  XCircle,
} from 'lucide-react';
import type { TreatmentConflict } from '@/lib/recommendations/engine';
import type { ExclusiveCategory } from '@/lib/recommendations/types';

// ============================================
// CATEGORY DISPLAY INFO
// ============================================

const CATEGORY_DISPLAY: Record<ExclusiveCategory, { label: string; color: string; icon: string }> = {
  'jaw_augmentation': {
    label: 'Jaw Augmentation',
    color: 'from-blue-500 to-blue-600',
    icon: 'A',
  },
  'jaw_reduction': {
    label: 'Jaw Reduction',
    color: 'from-purple-500 to-purple-600',
    icon: 'R',
  },
  'chin_augmentation': {
    label: 'Chin Enhancement',
    color: 'from-cyan-500 to-cyan-600',
    icon: 'C',
  },
  'cheekbone_augmentation': {
    label: 'Cheekbone Enhancement',
    color: 'from-pink-500 to-pink-600',
    icon: 'Z',
  },
  'lip_augmentation': {
    label: 'Lip Augmentation',
    color: 'from-red-500 to-red-600',
    icon: 'L+',
  },
  'lip_reduction': {
    label: 'Lip Reduction',
    color: 'from-orange-500 to-orange-600',
    icon: 'L-',
  },
  'submental_fat_removal': {
    label: 'Double Chin Treatment',
    color: 'from-yellow-500 to-yellow-600',
    icon: 'S',
  },
  'neck_procedures': {
    label: 'Neck Procedures',
    color: 'from-teal-500 to-teal-600',
    icon: 'N',
  },
  'eye_lateral_canthus': {
    label: 'Eye Corner Surgery',
    color: 'from-indigo-500 to-indigo-600',
    icon: 'E',
  },
  'maxillary_surgery': {
    label: 'Jaw Repositioning',
    color: 'from-rose-500 to-rose-600',
    icon: 'M',
  },
};

// ============================================
// SINGLE CONFLICT CARD
// ============================================

interface ConflictCardProps {
  conflict: TreatmentConflict;
  onDismiss?: () => void;
}

function ConflictCard({ conflict, onDismiss }: ConflictCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryInfo = conflict.category ? CATEGORY_DISPLAY[conflict.category] : null;

  return (
    <motion.div
      className="bg-gradient-to-br from-red-950/50 to-orange-950/50 border border-red-500/30 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={20} className="text-red-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-white">Treatment Conflict Detected</h4>
            {categoryInfo && (
              <span className={`px-2 py-0.5 bg-gradient-to-r ${categoryInfo.color} text-white text-[10px] font-medium rounded-full`}>
                {categoryInfo.label}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400">
            These treatments are mutually exclusive
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp size={16} className="text-neutral-400" />
            ) : (
              <ChevronDown size={16} className="text-neutral-400" />
            )}
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} className="text-neutral-500" />
            </button>
          )}
        </div>
      </div>

      {/* Conflict Details */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
          <div className="flex-1 text-center">
            <p className="text-xs text-red-400/70 mb-0.5">Treatment 1</p>
            <p className="text-sm font-medium text-white truncate">{conflict.treatment1Name}</p>
          </div>
          <div className="flex-shrink-0 p-1.5 bg-red-500/20 rounded-full">
            <XCircle size={14} className="text-red-400" />
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-red-400/70 mb-0.5">Treatment 2</p>
            <p className="text-sm font-medium text-white truncate">{conflict.treatment2Name}</p>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 pt-1 border-t border-red-500/20">
              <div className="flex items-start gap-2 p-3 bg-black/20 rounded-lg">
                <Info size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {conflict.reason}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    Choose one treatment from this category and remove the other from your plan.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// CONFLICT LIST
// ============================================

interface TreatmentConflictListProps {
  conflicts: TreatmentConflict[];
  onDismiss?: (conflict: TreatmentConflict) => void;
  onDismissAll?: () => void;
}

export function TreatmentConflictList({
  conflicts,
  onDismiss,
  onDismissAll,
}: TreatmentConflictListProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" />
          <span className="text-sm font-medium text-white">
            {conflicts.length} Treatment Conflict{conflicts.length !== 1 ? 's' : ''}
          </span>
        </div>
        {onDismissAll && conflicts.length > 1 && (
          <button
            onClick={onDismissAll}
            className="text-xs text-neutral-500 hover:text-white transition-colors"
          >
            Dismiss All
          </button>
        )}
      </div>

      {/* Conflicts */}
      <AnimatePresence>
        {conflicts.map((conflict) => (
          <ConflictCard
            key={`${conflict.treatment1Id}-${conflict.treatment2Id}`}
            conflict={conflict}
            onDismiss={onDismiss ? () => onDismiss(conflict) : undefined}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// INLINE WARNING BADGE
// ============================================

interface TreatmentConflictBadgeProps {
  conflictsWith: string;
  onClick?: () => void;
}

export function TreatmentConflictBadge({ conflictsWith, onClick }: TreatmentConflictBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium rounded-full hover:bg-red-500/30 transition-colors"
    >
      <AlertTriangle size={10} />
      <span>Conflicts with {conflictsWith}</span>
    </button>
  );
}

// ============================================
// SELECTION WARNING MODAL
// ============================================

interface SelectionWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: TreatmentConflict;
  onProceed: () => void;
  onCancel: () => void;
}

export function SelectionWarningModal({
  isOpen,
  onClose,
  conflict,
  onProceed,
  onCancel,
}: SelectionWarningModalProps) {
  const categoryInfo = conflict.category ? CATEGORY_DISPLAY[conflict.category] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-5 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Treatment Conflict</h3>
                    {categoryInfo && (
                      <span className={`inline-block px-2 py-0.5 bg-gradient-to-r ${categoryInfo.color} text-white text-xs font-medium rounded-full mt-1`}>
                        {categoryInfo.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Visual Conflict */}
                <div className="flex items-center gap-3 p-4 bg-neutral-800/50 rounded-xl">
                  <div className="flex-1 text-center">
                    <div className="w-full p-3 bg-neutral-700/50 rounded-lg mb-2">
                      <p className="text-sm font-medium text-white">{conflict.treatment1Name}</p>
                    </div>
                    <p className="text-xs text-green-400">Already Selected</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <XCircle size={16} className="text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="w-full p-3 bg-neutral-700/50 rounded-lg mb-2">
                      <p className="text-sm font-medium text-white">{conflict.treatment2Name}</p>
                    </div>
                    <p className="text-xs text-yellow-400">New Selection</p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {conflict.reason}
                  </p>
                </div>

                {/* Options */}
                <p className="text-xs text-neutral-500 text-center">
                  You can proceed (the lower priority treatment will be removed) or cancel to keep your current selection.
                </p>
              </div>

              {/* Actions */}
              <div className="p-5 border-t border-neutral-800 flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onProceed}
                  className="flex-1 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  Replace Treatment
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// EXPORTS
// ============================================

export { ConflictCard };
export default TreatmentConflictList;
