'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PricingContextType {
    isPricingModalOpen: boolean;
    openPricingModal: (source?: string) => void;
    closePricingModal: () => void;
    modalSource: string | null;
}

const PricingContext = createContext<PricingContextType | null>(null);

export function usePricing() {
    const context = useContext(PricingContext);
    if (!context) {
        throw new Error('usePricing must be used within a PricingProvider');
    }
    return context;
}

export function PricingProvider({ children }: { children: ReactNode }) {
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [modalSource, setModalSource] = useState<string | null>(null);

    const openPricingModal = useCallback((source?: string) => {
        setModalSource(source || null);
        setIsPricingModalOpen(true);
    }, []);

    const closePricingModal = useCallback(() => {
        setIsPricingModalOpen(false);
        setModalSource(null);
    }, []);

    return (
        <PricingContext.Provider
            value={{
                isPricingModalOpen,
                openPricingModal,
                closePricingModal,
                modalSource,
            }}
        >
            {children}
        </PricingContext.Provider>
    );
}
