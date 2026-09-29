'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const WaterfallInner = dynamic(() => import('./ScoreWaterfallInner'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-surface-2 rounded h-64 w-full" />,
});

export default function ScoreWaterfall() {
  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-13 font-600 text-text">SAI Score Waterfall</h2>
        <p className="text-11 text-text-dimmer mt-0.5">
          Contribution of each finding to the overall SAI of 87
        </p>
      </div>
      <div className="p-4" style={{ height: 280 }}>
        <WaterfallInner />
      </div>
    </div>
  );
}
