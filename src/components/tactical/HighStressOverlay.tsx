import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, ArrowUp } from 'lucide-react';
import { useTactical } from '@/contexts/TacticalContext';

export const HighStressOverlay = () => {
  const { systemMode, coordinates, vitals } = useTactical();

  if (systemMode !== 'high-stress') return null;

  const extractionBearing = 225; // SW direction to extraction point

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-black/90 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* CRT Scanlines for this overlay */}
        <div className="crt-overlay" />
        
        <div className="text-center">
          {/* High Stress Alert */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <p className="text-2xl font-bold text-destructive glow-text-red uppercase tracking-widest">
              HIGH STRESS DETECTED
            </p>
            <p className="text-sm text-destructive/80 mt-2">
              HR: {vitals.heartRate.toFixed(0)} BPM
            </p>
          </motion.div>

          {/* Extraction Compass */}
          <motion.div 
            className="relative w-64 h-64 mx-auto border-2 border-destructive"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            {/* Compass Circle */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Outer ring */}
              <circle cx="100" cy="100" r="95" fill="none" stroke="#ff3333" strokeWidth="1" opacity="0.5" />
              <circle cx="100" cy="100" r="85" fill="none" stroke="#ff3333" strokeWidth="1" opacity="0.3" />
              
              {/* Cardinal markers */}
              {['N', 'E', 'S', 'W'].map((dir, i) => {
                const angle = (i * 90 - 90) * (Math.PI / 180);
                const x = 100 + Math.cos(angle) * 75;
                const y = 100 + Math.sin(angle) * 75;
                return (
                  <text
                    key={dir}
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fill="#ff3333"
                    fontSize="14"
                    fontFamily="JetBrains Mono"
                  >
                    {dir}
                  </text>
                );
              })}
              
              {/* Tick marks */}
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 10 - 90) * (Math.PI / 180);
                const innerR = i % 3 === 0 ? 60 : 65;
                const outerR = 70;
                return (
                  <line
                    key={i}
                    x1={100 + Math.cos(angle) * innerR}
                    y1={100 + Math.sin(angle) * innerR}
                    x2={100 + Math.cos(angle) * outerR}
                    y2={100 + Math.sin(angle) * outerR}
                    stroke="#ff3333"
                    strokeWidth={i % 3 === 0 ? 2 : 1}
                    opacity={i % 3 === 0 ? 1 : 0.5}
                  />
                );
              })}
            </svg>

            {/* Extraction Arrow */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${extractionBearing}deg)` }}
            >
              <div className="relative w-full h-full">
                <ArrowUp 
                  className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 text-destructive drop-shadow-lg" 
                  strokeWidth={3}
                />
              </div>
            </motion.div>

            {/* Center point */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-destructive rounded-full animate-pulse" />
            </div>
          </motion.div>

          {/* Extraction Info */}
          <motion.div 
            className="mt-8 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 text-destructive">
              <MapPin className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider">Extraction Point</span>
            </div>
            <p className="text-2xl font-bold text-destructive glow-text-red tabular-nums">
              {extractionBearing}° SW | 2.4 KM
            </p>
            <p className="text-[10px] text-destructive/60">
              ETA: 18 MIN @ CURRENT PACE
            </p>
          </motion.div>

          {/* Current Heading */}
          <div className="mt-6 flex items-center justify-center gap-2 text-destructive/60">
            <Compass className="w-4 h-4" />
            <span className="text-[10px]">
              Current Heading: {coordinates.heading.toFixed(0)}°
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
