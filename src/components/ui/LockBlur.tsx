import React, { ReactNode } from 'react';
import { Lock } from 'lucide-react';

interface LockBlurProps {
    isUnlocked: boolean;
    children: ReactNode;
    blurAmount?: string;
    overlayText?: string;
}

export function LockBlur({
    isUnlocked,
    children,
    blurAmount = 'blur-md',
    overlayText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
}: LockBlurProps) {
    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
        <div className="relative overflow-hidden rounded-xl">
            {/* Blurred Content */}
            <div className={`filter ${blurAmount} select-none pointer-events-none opacity-50`}>
                {children}
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-transparent">
                <div className="bg-neutral-900/40 backdrop-blur-sm p-3 rounded-full border border-white/10 mb-2">
                    <Lock className="w-6 h-6 text-white/90" />
                </div>
                {/* Greek/Obfuscated Text Overlay to mimic hidden calculations */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 overflow-hidden">
                    <p className="text-xs text-justify p-4 font-serif text-white/50 leading-relaxed break-words w-full h-full">
                        {overlayText === 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                            ? Array(20).fill("α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω").join(" ")
                            : overlayText
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
