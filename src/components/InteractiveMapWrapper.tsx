'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Import dinamico per evitare problemi SSR con Leaflet
const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-blue-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Caricamento mappa interattiva...</p>
      </div>
    </div>
  )
});

interface InteractiveMapWrapperProps {
  selectedRegion: string;
  onRegionSelect: (region: string) => void;
  italianRegions: Array<{
    name: string;
    emoji: string;
    population: string;
    petitions: number;
    signatures: number;
    capital: string;
    provinces: string[];
  }>;
}

export default function InteractiveMapWrapper(props: InteractiveMapWrapperProps) {
  const MemoizedMap = useMemo(() => InteractiveMap, []);

  return <MemoizedMap {...props} />;
}