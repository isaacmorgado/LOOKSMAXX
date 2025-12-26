'use client';

import { useState, useEffect, useCallback } from 'react';

interface StreakData {
    count: number;
    lastDate: string; // ISO date string (YYYY-MM-DD or full)
    maxStreak: number;
}

export function useStreak() {
    const [streak, setStreak] = useState<StreakData>({ count: 0, lastDate: '', maxStreak: 0 });

    useEffect(() => {
        const saved = localStorage.getItem('glow_up_streak');
        if (saved) {
            try {
                setStreak(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse streak data', e);
            }
        }
    }, []);

    const updateStreak = useCallback(() => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        setStreak(prev => {
            let newCount = prev.count;
            let newMax = prev.maxStreak;

            if (prev.lastDate === today) {
                // Already scanned today, no change
                return prev;
            }

            const lastDate = new Date(prev.lastDate);
            const diffTime = Math.abs(now.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1 || prev.lastDate === '') {
                // Consecutive day or first time
                newCount += 1;
            } else {
                // Streak broken
                newCount = 1;
            }

            if (newCount > newMax) {
                newMax = newCount;
            }

            const newData = { count: newCount, lastDate: today, maxStreak: newMax };
            localStorage.setItem('glow_up_streak', JSON.stringify(newData));
            return newData;
        });
    }, []);

    const isStreakAtRisk = useCallback(() => {
        if (!streak.lastDate) return false;
        const now = new Date();
        const lastDate = new Date(streak.lastDate);
        const diffTime = Math.abs(now.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If last scan was yesterday and we haven't scanned today yet
        const today = now.toISOString().split('T')[0];
        return diffDays === 1 && streak.lastDate !== today;
    }, [streak.lastDate]);

    return {
        streakCount: streak.count,
        maxStreak: streak.maxStreak,
        isStreakAtRisk: isStreakAtRisk(),
        updateStreak,
        lastScanDate: streak.lastDate
    };
}
