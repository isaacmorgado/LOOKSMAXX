'use client';

import React from 'react';
import { useStreak } from '@/hooks/useStreak';
import { Flame, AlertCircle, Info, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const StreakCard: React.FC = () => {
    const { streakCount, maxStreak, isStreakAtRisk } = useStreak();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${isStreakAtRisk
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-neutral-900 border-neutral-800'
                }`}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${streakCount > 0 ? 'bg-orange-500/20 text-orange-500' : 'bg-neutral-800 text-neutral-500'
                        }`}>
                        <Flame size={32} className={streakCount > 0 ? 'animate-pulse' : ''} />
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-white leading-none">
                            {streakCount} DAY <span className="text-orange-500">STREAK</span>
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar size={12} className="text-neutral-500" />
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                Personal Best: {maxStreak} Days
                            </p>
                        </div>
                    </div>
                </div>

                {isStreakAtRisk && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-500">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-black uppercase">Streak At Risk!</span>
                    </div>
                )}
            </div>

            {streakCount === 0 ? (
                <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                    <Info size={16} className="text-blue-400 mt-0.5" />
                    <p className="text-xs text-white/60 leading-tight">
                        Perform your first <span className="text-white font-bold">Glow Up Scan</span> today to start your streak and track your progress!
                    </p>
                </div>
            ) : (
                <div className="mt-4 flex gap-1.5">
                    {[...Array(7)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${i < (streakCount % 7 || 7) ? 'bg-orange-500' : 'bg-neutral-800'
                                }`}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default StreakCard;
