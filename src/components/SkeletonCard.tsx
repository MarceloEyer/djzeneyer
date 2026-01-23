import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-surface rounded-xl overflow-hidden border border-white/10 animate-pulse">
    <div className="aspect-video bg-white/10" />
    <div className="p-6 space-y-3">
      <div className="h-6 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
      <div className="h-4 bg-white/10 rounded w-2/3" />
    </div>
  </div>
);
