import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, Skull, AlertTriangle, Power, Lock, Unlock } from 'lucide-react';
import { useTactical } from '@/contexts/TacticalContext';

export const SecureTab = () => {
  const { 
    systemMode, 
    setSystemMode, 
    deadManCountdown, 
    startDeadManSwitch, 
    cancelDeadManSwitch 
  } = useTactical();
  
  const [confirmWipe, setConfirmWipe] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 h-full">
      {/* Stealth Mode Panel */}
      <motion.div 
        className="glass-panel glow-border p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Eye className={`w-6 h-6 ${systemMode === 'stealth' ? 'text-destructive' : 'text-primary'}`} />
          <div>
            <h3 className="text-sm uppercase tracking-wider text-primary">Stealth Mode</h3>
            <p className="text-[10px] text-muted-foreground">
              Shifts UI to deep red IR-safe spectrum
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border bg-muted/20">
            <div>
              <p className="text-xs text-primary">IR Compatibility</p>
              <p className="text-[10px] text-muted-foreground">Night vision friendly display</p>
            </div>
            <button
              onClick={() => setSystemMode(systemMode === 'stealth' ? 'normal' : 'stealth')}
              className={`relative w-14 h-7 rounded-none transition-colors ${
                systemMode === 'stealth' 
                  ? 'bg-destructive/30 border border-destructive' 
                  : 'bg-muted border border-border'
              }`}
            >
              <motion.div
                className={`absolute top-1 w-5 h-5 ${
                  systemMode === 'stealth' ? 'bg-destructive' : 'bg-primary'
                }`}
                animate={{ left: systemMode === 'stealth' ? 'calc(100% - 24px)' : '4px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="p-4 border border-border bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-primary">Display Brightness</p>
              <p className="text-[10px] text-muted-foreground">
                {systemMode === 'stealth' ? '5%' : '80%'}
              </p>
            </div>
            <div className="h-2 bg-muted">
              <div 
                className={`h-full transition-all duration-500 ${
                  systemMode === 'stealth' ? 'bg-destructive w-[5%]' : 'bg-primary w-[80%]'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-border bg-muted/20 text-center">
              <Power className={`w-5 h-5 mx-auto mb-2 ${
                systemMode === 'stealth' ? 'text-destructive' : 'text-muted-foreground'
              }`} />
              <p className="text-[10px] text-muted-foreground">
                {systemMode === 'stealth' ? 'ACTIVE' : 'STANDBY'}
              </p>
            </div>
            <div className="p-4 border border-border bg-muted/20 text-center">
              <Shield className={`w-5 h-5 mx-auto mb-2 ${
                systemMode === 'stealth' ? 'text-success' : 'text-muted-foreground'
              }`} />
              <p className="text-[10px] text-muted-foreground">
                {systemMode === 'stealth' ? 'SECURED' : 'VISIBLE'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dead Man's Switch Panel */}
      <motion.div 
        className={`glass-panel p-6 ${
          deadManCountdown !== null 
            ? 'border-2 border-destructive animate-pulse-red' 
            : 'glow-border'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Skull className={`w-6 h-6 ${
            deadManCountdown !== null ? 'text-destructive animate-flicker' : 'text-primary'
          }`} />
          <div>
            <h3 className="text-sm uppercase tracking-wider text-primary">Dead-Man's Switch</h3>
            <p className="text-[10px] text-muted-foreground">
              Emergency data wipe protocol
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {deadManCountdown !== null ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p className="text-6xl font-bold text-destructive glow-text-red tabular-nums">
                {deadManCountdown}
              </p>
              <p className="text-xs text-destructive mt-4 uppercase tracking-wider">
                Seconds until data wipe
              </p>
              
              <motion.button
                onClick={cancelDeadManSwitch}
                className="mt-8 px-8 py-4 border-2 border-success bg-success/10 text-success uppercase tracking-wider text-sm font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Lock className="w-4 h-4 inline mr-2" />
                CANCEL WIPE
              </motion.button>
            </motion.div>
          ) : confirmWipe ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-sm text-destructive mb-2">CONFIRM DATA WIPE</p>
              <p className="text-[10px] text-muted-foreground mb-6">
                This will permanently destroy all mission data
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setConfirmWipe(false)}
                  className="px-6 py-3 border border-border text-muted-foreground uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    startDeadManSwitch();
                    setConfirmWipe(false);
                  }}
                  className="px-6 py-3 border border-destructive bg-destructive/10 text-destructive uppercase tracking-wider text-xs"
                >
                  CONFIRM
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="p-4 border border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <Unlock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-primary">Switch Status</p>
                    <p className="text-[10px] text-muted-foreground">Disarmed</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-destructive/30 bg-destructive/5">
                <p className="text-[10px] text-muted-foreground mb-3">
                  Activating Dead-Man's Switch will begin a 30-second countdown.
                  All mission data will be cryptographically wiped if not cancelled.
                </p>
                
                <ul className="text-[10px] text-muted-foreground space-y-1">
                  <li>• GPS waypoints & routes</li>
                  <li>• Squad communications</li>
                  <li>• Intel & threat data</li>
                  <li>• Biometric records</li>
                </ul>
              </div>

              <button
                onClick={() => setConfirmWipe(true)}
                className="btn-danger w-full py-4 flex items-center justify-center gap-2"
              >
                <Skull className="w-4 h-4" />
                <span>ARM DEAD-MAN'S SWITCH</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Ghost Mesh Network Status */}
      <motion.div 
        className="glass-panel glow-border p-6 lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-sm uppercase tracking-wider text-primary">Ghost Mesh Network</h3>
            <p className="text-[10px] text-muted-foreground">
              Decentralized peer-to-peer tactical mesh
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border border-border bg-muted/20 text-center">
            <p className="text-2xl font-bold text-primary glow-text">4</p>
            <p className="text-[10px] text-muted-foreground">Active Nodes</p>
          </div>
          <div className="p-4 border border-border bg-muted/20 text-center">
            <p className="text-2xl font-bold text-success glow-text">256</p>
            <p className="text-[10px] text-muted-foreground">Bit Encryption</p>
          </div>
          <div className="p-4 border border-border bg-muted/20 text-center">
            <p className="text-2xl font-bold text-primary glow-text">12ms</p>
            <p className="text-[10px] text-muted-foreground">Avg Latency</p>
          </div>
          <div className="p-4 border border-border bg-muted/20 text-center">
            <p className="text-2xl font-bold text-primary glow-text">98%</p>
            <p className="text-[10px] text-muted-foreground">Uptime</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
