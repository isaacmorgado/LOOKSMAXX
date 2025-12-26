'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { GenderProvider } from '@/contexts/GenderContext';
import { EthnicityProvider } from '@/contexts/EthnicityContext';
import { HeightProvider } from '@/contexts/HeightContext';
import { WeightProvider } from '@/contexts/WeightContext';
import { UploadProvider } from '@/contexts/UploadContext';
import { PhysiqueProvider } from '@/contexts/PhysiqueContext';
import { LeaderboardProvider } from '@/contexts/LeaderboardContext';
import { ForumProvider } from '@/contexts/ForumContext';
import { RegionProvider } from '@/contexts/RegionContext';

import { PricingProvider, usePricing } from '@/contexts/PricingContext';
import PricingModal from '@/components/results/modals/PricingModal';

function PricingModalWrapper() {
  const { isPricingModalOpen, closePricingModal } = usePricing();
  return <PricingModal isOpen={isPricingModalOpen} onClose={closePricingModal} />;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RegionProvider>
        <PricingProvider>
          <GenderProvider>
            <EthnicityProvider>
              <HeightProvider>
                <WeightProvider>
                  <UploadProvider>
                    <PhysiqueProvider>
                      <LeaderboardProvider>
                        <ForumProvider>
                          {children}
                          <PricingModalWrapper />
                        </ForumProvider>
                      </LeaderboardProvider>
                    </PhysiqueProvider>
                  </UploadProvider>
                </WeightProvider>
              </HeightProvider>
            </EthnicityProvider>
          </GenderProvider>
        </PricingProvider>
      </RegionProvider>
    </AuthProvider>
  );
}
