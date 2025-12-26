'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Dumbbell, Sparkles, Clock, ChevronRight, Search } from 'lucide-react';
import { TabContent } from '../ResultsLayout';
import {
  GUIDE_CATEGORIES,
  getGuidesByCategory,
  getTotalGuideCount,
  getTotalReadTime,
  searchGuides,
} from '@/data/guides';
import { Guide, GuideCategory } from '@/types/guides';

// ============================================
// GUIDE STATS CARD
// ============================================

function GuideStatsCard() {
  const totalGuides = getTotalGuideCount();
  const totalMinutes = getTotalReadTime();

  return (
    <motion.div
      className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
          <BookOpen size={20} className="text-cyan-400" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Product Guides</h2>
          <p className="text-sm text-neutral-400">Evidence-based looksmaxxing resources</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white mb-1">{totalGuides}</div>
          <div className="text-xs text-neutral-500">Total Guides</div>
        </div>
        <div className="bg-neutral-900/50 rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={16} className="text-cyan-400" />
            <div className="text-2xl font-bold text-white">{totalMinutes}</div>
          </div>
          <div className="text-xs text-neutral-500">Minutes of Content</div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// GUIDE CARD
// ============================================

interface GuideCardProps {
  guide: Guide;
  index: number;
}

function GuideCard({ guide, index }: GuideCardProps) {
  const getCategoryColor = (guideId: string) => {
    const category = GUIDE_CATEGORIES.find(c => c.guideIds.includes(guideId));
    if (!category) return 'cyan';
    const colorMap: Record<string, string> = {
      blue: 'cyan',
      purple: 'purple',
      amber: 'amber',
    };
    return colorMap[category.color] || 'cyan';
  };

  const color = getCategoryColor(guide.id);

  const colorClasses = {
    cyan: 'from-cyan-500/10 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-400',
    amber: 'from-amber-500/10 to-amber-600/10 border-amber-500/20 text-amber-400',
  };

  const iconColorClasses = {
    cyan: 'bg-cyan-500/10 text-cyan-400',
    purple: 'bg-purple-500/10 text-purple-400',
    amber: 'bg-amber-500/10 text-amber-400',
  };

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border rounded-xl p-5 hover:border-opacity-50 transition-all cursor-pointer group`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${iconColorClasses[color as keyof typeof iconColorClasses]} rounded-xl flex items-center justify-center text-xl`}>
          {guide.icon}
        </div>
        <div className="flex items-center gap-1 text-neutral-500 text-xs">
          <Clock size={12} />
          <span>{guide.estimatedReadTime} min</span>
        </div>
      </div>

      <h3 className="font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">
        {guide.title}
      </h3>

      {guide.subtitle && (
        <p className="text-xs text-neutral-400 mb-2 italic">{guide.subtitle}</p>
      )}

      <p className="text-sm text-neutral-400 mb-3 line-clamp-2">{guide.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          <span>{guide.sections.length} sections</span>
          {guide.productIds && guide.productIds.length > 0 && (
            <>
              <span>•</span>
              <span>{guide.productIds.length} products</span>
            </>
          )}
        </div>
        <ChevronRight size={16} className="text-neutral-600 group-hover:text-cyan-400 transition-colors" />
      </div>
    </motion.div>
  );
}

// ============================================
// CATEGORY SECTION
// ============================================

interface CategorySectionProps {
  category: GuideCategory;
}

function CategorySection({ category }: CategorySectionProps) {
  const guides = getGuidesByCategory(category.id);

  if (guides.length === 0) return null;

  const iconMap: Record<string, React.ReactNode> = {
    BookOpen: <BookOpen size={20} />,
    Dumbbell: <Dumbbell size={20} />,
    Sparkles: <Sparkles size={20} />,
  };

  const colorClasses = {
    blue: 'text-cyan-400 bg-cyan-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 ${colorClasses[category.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
          {iconMap[category.icon] || <BookOpen size={20} />}
        </div>
        <div>
          <h3 className="font-semibold text-white">{category.name}</h3>
          <p className="text-xs text-neutral-500">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((guide, idx) => (
          <GuideCard key={guide.id} guide={guide} index={idx} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// SEARCH BAR
// ============================================

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
      <input
        type="text"
        placeholder="Search guides..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
      />
    </div>
  );
}

// ============================================
// MAIN TAB COMPONENT
// ============================================

export function GuidesTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = searchQuery.trim()
    ? searchGuides(searchQuery)
    : null;

  return (
    <TabContent
      title="Product Guides"
      subtitle="Evidence-based guides for optimal results"
    >
      <div className="max-w-5xl mx-auto">
        <GuideStatsCard />

        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />

        {filteredGuides ? (
          // Search Results
          <div>
            <p className="text-sm text-neutral-400 mb-4">
              Found {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} matching &ldquo;{searchQuery}&rdquo;
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGuides.map((guide, idx) => (
                <GuideCard key={guide.id} guide={guide} index={idx} />
              ))}
            </div>
            {filteredGuides.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-neutral-600" />
                </div>
                <p className="text-neutral-500">No guides found matching your search</p>
              </div>
            )}
          </div>
        ) : (
          // Category View
          <div>
            {GUIDE_CATEGORIES.map(category => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </TabContent>
  );
}
