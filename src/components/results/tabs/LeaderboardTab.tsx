'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  User as UserIcon,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Target,
} from 'lucide-react';
import { TabContent } from '../ResultsLayout';
import { useLeaderboard } from '@/contexts/LeaderboardContext';
import { useResults } from '@/contexts/ResultsContext';
import { ScoreCircle } from '../shared';
import { getScoreColor } from '@/types/results';
import { UserProfileModal } from '../modals/UserProfileModal';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

// ============================================
// LEADERBOARD SKELETON
// ============================================

function LeaderboardSkeleton() {
  return (
    <div className="divide-y divide-white/5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-5">
          <div className="flex items-start gap-5">
            {/* Rank */}
            <div className="w-12 flex items-center justify-center">
              <Skeleton className="h-8 w-10 rounded-xl" />
            </div>
            {/* Photo */}
            <Skeleton className="w-16 h-16 rounded-2xl" />
            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-6 w-14 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// RANK DISPLAY HELPERS
// ============================================

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown size={22} className="text-yellow-400" />;
  if (rank === 2) return <Medal size={22} className="text-gray-300" />;
  if (rank === 3) return <Medal size={22} className="text-amber-600" />;
  return null;
}

function getRankBgClass(rank: number, isCurrentUser: boolean) {
  if (isCurrentUser) return 'bg-cyan-500/10 border-l-cyan-400';
  if (rank === 1) return 'bg-yellow-500/5 border-l-yellow-400';
  if (rank === 2) return 'bg-neutral-400/5 border-l-neutral-400';
  if (rank === 3) return 'bg-amber-500/5 border-l-amber-500';
  return 'bg-transparent border-l-transparent';
}

// ============================================
// LEADERBOARD TAB
// ============================================

export function LeaderboardTab() {
  const {
    userRank,
    leaderboard,
    totalCount,
    isLoading,
    error,
    setGenderFilter,
    fetchLeaderboard,
    hasMore,
    loadMore,
    setSelectedUserId,
  } = useLeaderboard();

  const { gender } = useResults();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = !!api.getToken();

  // Auto-set gender filter to user's gender (males see male leaderboard, females see female)
  useEffect(() => {
    setGenderFilter(gender);
  }, [gender, setGenderFilter]);

  // Fetch leaderboard if empty (first visit or after gender filter is set)
  // Only fetch if user is authenticated (API requires auth)
  useEffect(() => {
    const token = api.getToken();
    if (leaderboard.length === 0 && !isLoading && !error && token) {
      fetchLeaderboard(0);
    }
  }, [leaderboard.length, isLoading, error, fetchLeaderboard]);

  const handleUserClick = (entry: { userId: string }) => {
    setSelectedUserId(entry.userId);
    setIsModalOpen(true);
  };

  const genderLabel = gender === 'male' ? 'MALES' : 'FEMALES';

  return (
    <>
      <TabContent
        title={
          <span>
            {genderLabel.slice(0, -1)} <span className="text-cyan-400">RANKINGS</span>
          </span>
        }
        subtitle={`COMPETITIVE MORPHOMETRIC ANALYSIS ACROSS ${genderLabel}`}
      >
        <div className="space-y-8">
          {/* Your Rank Card */}
          {userRank && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] bg-gradient-to-br from-cyan-500/10 via-neutral-900/40 to-neutral-900/40 border border-cyan-500/20 p-8 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Trophy size={140} />
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-4">
                  YOUR CURRENT STANDING
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl font-black italic text-white">
                        #{userRank.genderRank}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-wider text-cyan-400">
                          TOP {userRank.percentile.toFixed(1)}%
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          OF {userRank.genderTotal.toLocaleString()} {genderLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ScoreCircle score={userRank.score} size="lg" animate={false} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Leaderboard List */}
          <div className="rounded-[2rem] bg-neutral-900/40 border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center">
                  <Trophy size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black italic uppercase text-white">
                    TOP {genderLabel}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    RANKED BY PSL SCORE
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-neutral-900/50 border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  {totalCount.toLocaleString()} {genderLabel}
                </span>
              </div>
            </div>

            {isLoading && leaderboard.length === 0 ? (
              <LeaderboardSkeleton />
            ) : error ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Target size={24} className="text-red-400" />
                </div>
                <p className="text-red-400 font-black uppercase tracking-wider text-sm">{error}</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto mb-6">
                  <Trophy size={32} className="text-neutral-600" />
                </div>
                {isAuthenticated ? (
                  <p className="text-neutral-500 font-black uppercase tracking-wider text-xs">
                    NO ENTRIES YET. BE THE FIRST.
                  </p>
                ) : (
                  <>
                    <p className="text-neutral-500 font-black uppercase tracking-wider text-xs mb-6">
                      AUTHENTICATE TO VIEW RANKINGS
                    </p>
                    <a
                      href="/login"
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs transition-all"
                    >
                      SIGN IN
                    </a>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={`${entry.rank}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border-l-2 ${getRankBgClass(entry.rank, entry.isCurrentUser)}`}
                  >
                    <button
                      onClick={() => !entry.isCurrentUser && handleUserClick(entry)}
                      className="w-full p-5 hover:bg-white/[0.02] transition-colors text-left group"
                      disabled={entry.isCurrentUser}
                    >
                      <div className="flex items-start gap-5">
                        {/* Rank */}
                        <div className="w-12 flex items-center justify-center pt-1">
                          {getRankIcon(entry.rank) || (
                            <span className="text-lg font-black italic text-neutral-500">
                              #{entry.rank}
                            </span>
                          )}
                        </div>

                        {/* Photo */}
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-900 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-white/20 transition-colors">
                          {entry.facePhotoUrl ? (
                            <img
                              src={entry.facePhotoUrl}
                              alt={entry.anonymousName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon size={28} className="text-neutral-600" />
                          )}
                        </div>

                        {/* User info + Strengths/Improvements */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <p className={`font-black italic uppercase tracking-tight ${entry.isCurrentUser ? 'text-cyan-400' : 'text-white group-hover:text-cyan-400 transition-colors'}`}>
                              {entry.isCurrentUser ? 'YOU' : entry.anonymousName}
                            </p>
                            <span
                              className="text-lg font-black px-2 py-0.5 rounded-lg"
                              style={{
                                color: getScoreColor(entry.score),
                                backgroundColor: `${getScoreColor(entry.score)}15`
                              }}
                            >
                              {entry.score.toFixed(2)}
                            </span>
                          </div>

                          {/* Strengths */}
                          {entry.topStrengths && entry.topStrengths.length > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp size={12} className="text-green-400 flex-shrink-0" />
                              <div className="flex flex-wrap gap-1.5">
                                {entry.topStrengths.slice(0, 3).map((strength, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20"
                                  >
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Improvements */}
                          {entry.topImprovements && entry.topImprovements.length > 0 && (
                            <div className="flex items-center gap-2">
                              <TrendingDown size={12} className="text-amber-400 flex-shrink-0" />
                              <div className="flex flex-wrap gap-1.5">
                                {entry.topImprovements.slice(0, 3).map((improvement, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20"
                                  >
                                    {improvement}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Show placeholder if no data */}
                          {(!entry.topStrengths || entry.topStrengths.length === 0) &&
                           (!entry.topImprovements || entry.topImprovements.length === 0) && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 px-2 py-1 bg-neutral-900/50 rounded-lg border border-white/5">
                              {entry.gender.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && leaderboard.length > 0 && (
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="w-full p-5 text-center flex items-center justify-center gap-2 text-cyan-400 hover:bg-white/[0.02] transition-colors disabled:opacity-50 border-t border-white/5 group"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {isLoading ? 'LOADING...' : 'LOAD MORE'}
                </span>
                {!isLoading && (
                  <ChevronDown size={14} className="text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>
            )}
          </div>
        </div>
      </TabContent>

      {/* User Profile Modal */}
      <UserProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
