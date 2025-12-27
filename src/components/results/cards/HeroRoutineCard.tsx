'use client';

import { motion } from 'framer-motion';
import { Package, ShoppingCart, Star, Check, Zap } from 'lucide-react';
import { ProductRecommendation } from '@/types/results';
import { SUPPLEMENTS } from '@/lib/recommendations/supplements';

interface HeroRoutineCardProps {
    products: ProductRecommendation[];
    userName?: string;
    onAddToCart: () => void;
}

export function HeroRoutineCard({ products, userName = 'You', onAddToCart }: HeroRoutineCardProps) {
    // Use top 3-5 products for the bundle
    const bundleItems = products.slice(0, 5);

    // Calculate pricing
    const monthlyTotal = bundleItems.reduce((sum, item) => {
        const supp = SUPPLEMENTS.find(s => s.id === item.product.supplementId);
        return sum + (supp?.costPerMonth.min || 0);
    }, 0);

    const discount = 0.15; // 15% bundle discount
    const discountedPrice = Math.round(monthlyTotal * (1 - discount));
    const savings = Math.round(monthlyTotal - discountedPrice);

    if (bundleItems.length === 0) return null;

    return (
        <motion.div
            className="relative overflow-hidden rounded-[2rem] bg-neutral-900 border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Background Gradient / Mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-black" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full opacity-50" />

            <div className="relative p-6 md:p-10">
                {/* Header Badge */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-widest mb-3">
                            <Zap size={12} fill="currentColor" />
                            Personalized for {userName}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                            The {userName === 'You' ? 'Custom' : userName + "'s"} Routine
                        </h2>
                        <p className="text-neutral-400 text-sm md:text-base max-w-md leading-relaxed">
                            A complete, science-backed regimen targeting your specific weak points. All in one box.
                        </p>
                    </div>

                    {/* Trust Badge */}
                    <div className="hidden md:flex flex-col items-end">
                        <div className="flex items-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />
                            ))}
                        </div>
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Vet-Verified Formula</p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Visual Bundle Representation */}
                    <div className="relative aspect-square md:aspect-[4/3] rounded-2xl bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 border border-white/5 flex items-center justify-center p-6 group">
                        {/* Simple stack visualization since we don't have 3D assets yet */}
                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                            {bundleItems.slice(0, 4).map((item, i) => (
                                <div key={item.product.id} className="aspect-square rounded-xl bg-black/40 border border-white/10 flex flex-col items-center justify-center p-4 relative overflow-hidden backdrop-blur-sm">
                                    <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
                                    <Package className="text-neutral-600 mb-3 w-8 h-8" strokeWidth={1.5} />
                                    <p className="text-xs font-bold text-white text-center leading-tight">{item.product.name}</p>
                                    <p className="text-[9px] text-purple-300 uppercase tracking-wider mt-1 font-bold">Step {i + 1}</p>
                                </div>
                            ))}
                        </div>

                        {/* "Included" Tag */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 whitespace-nowrap z-10">
                            <Check size={14} className="text-green-400" />
                            <span className="text-xs font-bold text-white">{bundleItems.length} Products Included</span>
                        </div>
                    </div>

                    {/* Action Column */}
                    <div className="space-y-8">
                        {/* The List of Benefits (Why this?) */}
                        <div className="space-y-3">
                            <p className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-2">Targets</p>
                            {bundleItems.slice(0, 3).map(item => (
                                <div key={item.product.id} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Check size={12} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-white block">{item.product.name}</span>
                                        <span className="text-xs text-neutral-500 block">Corrects {item.targetMetric}</span>
                                    </div>
                                </div>
                            ))}
                            {bundleItems.length > 3 && (
                                <p className="text-xs font-bold text-neutral-500 pl-9">+ {bundleItems.length - 3} more essentials</p>
                            )}
                        </div>

                        {/* Price & CTA */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl md:text-5xl font-black text-white tracking-tight">${discountedPrice}</span>
                                <div className="flex flex-col mb-1.5">
                                    <span className="text-sm font-bold text-neutral-500 line-through decoration-red-500/50">${monthlyTotal}</span>
                                    <span className="text-[10px] font-black text-green-400 uppercase tracking-wider">Save ${savings}/mo</span>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-400 mb-6">Billed monthly • Cancel anytime • Free shipping</p>

                            <button
                                onClick={onAddToCart}
                                className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3 shadow-lg shadow-white/5"
                            >
                                <ShoppingCart size={18} />
                                Get My Routine
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
