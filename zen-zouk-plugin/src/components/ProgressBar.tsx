import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showPercentage = true
}) => {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-white/70">{label}</span>}
          {showPercentage && (
            <span className="font-semibold text-primary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-white/50 text-right">
          {current} / {total}
        </div>
      )}
    </div>
  );
};
