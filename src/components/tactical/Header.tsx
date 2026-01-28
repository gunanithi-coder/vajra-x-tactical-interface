import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Radio, Eye, AlertTriangle } from 'lucide-react';
import { useTactical } from '@/contexts/TacticalContext';

export const Header = () => {
  const { viewMode, setViewMode, signalStatus, systemMode, isJammed } = useTactical();
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [pressProgress, setPressProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    setPressProgress(0);
    progressInterval.current = setInterval(() => {
      setPressProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current!);
          return 100;
        }
        return prev + 3.33;
      });
    }, 100);

    const timer = setTimeout(() => {
      setViewMode(viewMode === 'operator' ? 'commander' : 'operator');
      setPressProgress(0);
    }, 3000);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setPressProgress(0);
  };

  const getStatusColor = () => {
    if (systemMode === 'high-stress') return 'text-destructive';
    if (systemMode === 'stealth') return 'text-destructive/70';
    if (isJammed) return 'text-destructive animate-flicker';
    return 'text-primary';
  };

  return (
    <header className="glass-panel border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo with long-press for commander mode */}
        <div 
          className="relative cursor-pointer select-none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          <motion.div 
            className="flex items-center gap-3"
            whileTap={{ scale: 0.98 }}
          >
            <Shield className={`w-8 h-8 ${getStatusColor()} glow-text`} />
            <div>
              <h1 className={`text-xl font-bold tracking-widest ${getStatusColor()} glow-text`}>
                VAJRA-X
              </h1>
              <p className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase">
                Tactical AI Situational Intelligence
              </p>
            </div>
          </motion.div>
          
          {/* Long-press progress indicator */}
          <AnimatePresence>
            {pressProgress > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-muted overflow-hidden"
              >
                <motion.div 
                  className="h-full bg-primary"
                  style={{ width: `${pressProgress}%` }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-6">
          {/* View Mode Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5"
            >
              <Eye className="w-3 h-3 text-primary" />
              <span className="text-[10px] uppercase tracking-wider text-primary">
                {viewMode === 'commander' ? 'CMDR VIEW' : 'OPERATOR'}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Signal Status */}
          <div className={`flex items-center gap-2 ${isJammed ? 'animate-pulse-red' : ''}`}>
            <Radio className={`w-4 h-4 ${isJammed ? 'text-destructive' : signalStatus === 'GPS' ? 'text-success' : 'text-warning'}`} />
            <span className={`text-xs uppercase tracking-wider ${isJammed ? 'text-destructive' : 'text-muted-foreground'}`}>
              {isJammed ? 'JAMMED' : signalStatus}
            </span>
          </div>

          {/* System Mode */}
          {systemMode !== 'normal' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-2 px-3 py-1 ${
                systemMode === 'high-stress' 
                  ? 'border border-destructive bg-destructive/10 text-destructive animate-pulse-red' 
                  : 'border border-destructive/50 bg-destructive/5 text-destructive/80'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span className="text-[10px] uppercase tracking-wider">
                {systemMode === 'high-stress' ? 'HIGH STRESS' : 'STEALTH'}
              </span>
            </motion.div>
          )}

          {/* Time */}
          <div className="text-xs text-muted-foreground tabular-nums">
            <TimeDisplay />
          </div>
        </div>
      </div>
    </header>
  );
};

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());

  useState(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  });

  return (
    <span className="font-mono">
      {time.toLocaleTimeString('en-US', { hour12: false })}Z
    </span>
  );
};
