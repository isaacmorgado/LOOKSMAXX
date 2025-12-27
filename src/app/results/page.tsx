'use client';

import { useEffect, useState, Component, ReactNode } from 'react';
import { ResultsProvider } from '@/contexts/ResultsContext';
import { Results } from '@/components/results/Results';
import { LandmarkPoint, FRONT_PROFILE_LANDMARKS, SIDE_PROFILE_LANDMARKS } from '@/lib/landmarks';
import { Ethnicity, Gender } from '@/lib/harmony-scoring';
import {
  generateSampleData,
  isSampleMode,
  getSampleConfigFromURL,
} from '@/lib/sample-data';

// Error Boundary for catching render errors
class ResultsErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Results] Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Analysis Error</h2>
            <p className="text-neutral-400 mb-4">
              {this.state.error?.message || 'Something went wrong while loading your results.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cyan-500 text-black font-medium rounded-lg hover:bg-cyan-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Note: Metadata cannot be exported from client components
// The page title is set in the root layout

// Demo data for testing - in production this would come from the analysis flow
const generateDemoLandmarks = (baseLandmarks: LandmarkPoint[]): LandmarkPoint[] => {
  return baseLandmarks.map(landmark => ({
    ...landmark,
    // Add slight randomization to simulate real placement
    x: landmark.x + (Math.random() - 0.5) * 0.02,
    y: landmark.y + (Math.random() - 0.5) * 0.02,
  }));
};

// Placeholder image as data URI (1x1 transparent pixel - actual images come from analysis)
const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Generate demo data outside component to avoid closure issues
const createDemoData = () => ({
  frontLandmarks: generateDemoLandmarks(FRONT_PROFILE_LANDMARKS),
  sideLandmarks: generateDemoLandmarks(SIDE_PROFILE_LANDMARKS),
  frontPhoto: PLACEHOLDER_IMAGE,
  sidePhoto: PLACEHOLDER_IMAGE,
  gender: 'male' as Gender,
  ethnicity: 'white' as Ethnicity,
});

export default function ResultsPage() {
  const [mounted, setMounted] = useState(false);
  const [isSample, setIsSample] = useState(false);
  const [initialData, setInitialData] = useState<{
    frontLandmarks: LandmarkPoint[];
    sideLandmarks: LandmarkPoint[];
    frontPhoto: string;
    sidePhoto?: string;
    gender: Gender;
    ethnicity?: Ethnicity;
    isUnlocked?: boolean;
  } | null>(null);

  useEffect(() => {
    console.log('[ResultsPage] useEffect running, setting mounted=true');
    // Mark as mounted (client-side only)
    setMounted(true);

    // Check for sample mode first
    const sampleMode = isSampleMode();
    setIsSample(sampleMode);

    if (sampleMode) {
      console.log('[ResultsPage] SAMPLE MODE ENABLED - Loading demo data');
      const sampleConfig = getSampleConfigFromURL();
      console.log('[ResultsPage] Sample config:', sampleConfig);
      const sampleData = generateSampleData(sampleConfig);
      console.log('[ResultsPage] Sample data generated with', sampleData.frontLandmarks.length, 'front landmarks');
      setInitialData(sampleData);
      return;
    }

    try {
      // Try to get data from sessionStorage (set by analysis page)
      const storedData = typeof window !== 'undefined'
        ? sessionStorage.getItem('analysisResults')
        : null;

      console.log('[ResultsPage] sessionStorage data exists:', !!storedData);

      if (storedData) {
        const parsed = JSON.parse(storedData);
        console.log('[ResultsPage] Using stored data with', parsed.frontLandmarks?.length, 'front landmarks');
        setInitialData(parsed);
      } else {
        // No stored data - use demo data
        console.log('[ResultsPage] No stored data, creating demo data');
        const demoData = createDemoData();
        console.log('[ResultsPage] Demo data created with', demoData.frontLandmarks.length, 'front landmarks');
        setInitialData(demoData);
      }
    } catch (e) {
      console.error('[ResultsPage] Failed to load analysis results:', e);
      // Use demo data as fallback
      setInitialData(createDemoData());
    }
  }, []);

  // Show loading state until mounted and data is ready
  if (!mounted || !initialData) {
    console.log('[ResultsPage] Rendering loading state - mounted:', mounted, 'initialData:', !!initialData);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Loading your analysis...</p>
          <p className="text-neutral-600 text-xs mt-2">
            mounted: {String(mounted)} | data: {initialData ? 'ready' : 'loading'}
          </p>
        </div>
      </div>
    );
  }

  console.log('[ResultsPage] Rendering Results component with data');

  return (
    <ResultsErrorBoundary>
      {/* Sample Mode Banner */}
      {isSample && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm py-2 px-4 text-center">
          <p className="text-sm font-medium text-black">
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              DEMO MODE - Viewing sample results with simulated face data
              <a
                href="/results"
                className="ml-2 underline hover:no-underline"
              >
                Exit Demo
              </a>
            </span>
          </p>
        </div>
      )}
      <ResultsProvider initialData={initialData}>
        <div className={isSample ? 'pt-10' : ''}>
          <Results />
        </div>
      </ResultsProvider>
    </ResultsErrorBoundary>
  );
}
