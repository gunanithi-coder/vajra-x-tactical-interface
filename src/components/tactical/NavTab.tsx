import { motion } from 'framer-motion';
import { Navigation, Crosshair, Compass, Radio, AlertTriangle } from 'lucide-react';
import { useTactical } from '@/contexts/TacticalContext';
import { WireframeMap } from './WireframeMap';

export const NavTab = () => {
  const { coordinates, signalStatus, isJammed, toggleSignalStatus, simulateJamming } = useTactical();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-full">
      {/* Main Map Area */}
      <div className="lg:col-span-2 glass-panel glow-border relative overflow-hidden">
        {isJammed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(255, 0, 0, 0.1) 100%)',
            }}
          />
        )}
        
        {/* VBN Mode Overlay */}
        {isJammed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-destructive/20 border border-destructive"
          >
            <AlertTriangle className="w-4 h-4 text-destructive animate-flicker" />
            <span className="text-xs text-destructive font-medium tracking-wider">VBN MODE ACTIVE</span>
          </motion.div>
        )}
        
        <WireframeMap />
      </div>

      {/* Right Panel - Controls & Info */}
      <div className="space-y-4">
        {/* Signal Status */}
        <motion.div 
          className="card-tactical"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Radio className="w-3 h-3" />
              Signal Status
            </h3>
            <div className={`w-2 h-2 rounded-full ${
              isJammed ? 'bg-destructive animate-pulse-red' : 
              signalStatus === 'GPS' ? 'bg-success' : 'bg-warning'
            }`} />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={toggleSignalStatus}
              className={`py-3 text-center transition-all ${
                signalStatus === 'GPS' && !isJammed
                  ? 'bg-primary/20 border border-primary text-primary'
                  : 'bg-muted/50 border border-border text-muted-foreground'
              }`}
            >
              <span className="text-xs uppercase tracking-wider">GPS</span>
            </button>
            <button
              onClick={toggleSignalStatus}
              className={`py-3 text-center transition-all ${
                signalStatus === 'VBN' || isJammed
                  ? 'bg-warning/20 border border-warning text-warning'
                  : 'bg-muted/50 border border-border text-muted-foreground'
              }`}
            >
              <span className="text-xs uppercase tracking-wider">VBN</span>
            </button>
          </div>
        </motion.div>

        {/* Coordinates Display */}
        <motion.div 
          className="card-tactical"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
            <Crosshair className="w-3 h-3" />
            Current Position
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="stat-label">Latitude</span>
              <span className="text-sm font-mono text-primary tabular-nums">
                {coordinates.lat.toFixed(6)}°
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="stat-label">Longitude</span>
              <span className="text-sm font-mono text-primary tabular-nums">
                {coordinates.lng.toFixed(6)}°
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="stat-label">Altitude</span>
              <span className="text-sm font-mono text-primary tabular-nums">
                {coordinates.alt.toFixed(0)}m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="stat-label">Heading</span>
              <span className="text-sm font-mono text-primary tabular-nums flex items-center gap-1">
                <Compass className="w-3 h-3" />
                {coordinates.heading.toFixed(0)}°
              </span>
            </div>
          </div>
        </motion.div>

        {/* Simulate Jamming Button */}
        <motion.button
          onClick={simulateJamming}
          disabled={isJammed}
          className={`w-full py-4 text-center transition-all ${
            isJammed 
              ? 'bg-destructive/20 border border-destructive text-destructive cursor-not-allowed' 
              : 'btn-danger hover:bg-destructive/30'
          }`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={!isJammed ? { scale: 1.02 } : {}}
          whileTap={!isJammed ? { scale: 0.98 } : {}}
        >
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">
              {isJammed ? 'JAMMING ACTIVE' : 'SIMULATE SIGNAL JAMMING'}
            </span>
          </div>
        </motion.button>

        {/* Navigation Mode Indicator */}
        <motion.div 
          className={`card-tactical ${isJammed ? 'border-destructive bg-destructive/5' : ''}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <Navigation className={`w-6 h-6 ${isJammed ? 'text-destructive' : 'text-primary'}`} />
            <div>
              <p className={`text-sm font-medium ${isJammed ? 'text-destructive' : 'text-primary'}`}>
                {isJammed ? 'Vision-Based Navigation' : 'GPS Navigation'}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isJammed ? 'Using terrain recognition + INS' : 'Satellite lock: 12 sats'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
