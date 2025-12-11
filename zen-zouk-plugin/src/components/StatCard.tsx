import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  color = 'primary'
}) => {
  return (
    <motion.div
      className="card card-hover text-center"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${color}/10 mb-3`}>
        <Icon className={`text-${color}`} size={24} />
      </div>
      <div className="text-3xl font-bold font-display mb-1">{value}</div>
      <div className="text-sm text-white/60">{label}</div>
    </motion.div>
  );
};
