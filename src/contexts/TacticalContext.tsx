import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ViewMode = 'operator' | 'commander';
export type SignalStatus = 'GPS' | 'VBN';
export type SystemMode = 'normal' | 'stealth' | 'high-stress';

interface VitalSigns {
  heartRate: number;
  spO2: number;
  hrvStress: number;
  hapeRisk: number;
}

interface DroneAlert {
  id: string;
  type: string;
  distance: number;
  bearing: number;
  confidence: number;
  timestamp: number;
}

interface GunfireEvent {
  id: string;
  bearing: number;
  distance: number;
  timestamp: number;
}

interface AILogEntry {
  id: string;
  message: string;
  timestamp: number;
  type: 'info' | 'warning' | 'critical';
}

interface Coordinates {
  lat: number;
  lng: number;
  alt: number;
  heading: number;
}

interface SquadMember {
  id: string;
  callsign: string;
  status: 'active' | 'wounded' | 'extracted';
  vitals: VitalSigns;
  position: Coordinates;
}

interface TacticalState {
  viewMode: ViewMode;
  signalStatus: SignalStatus;
  systemMode: SystemMode;
  isJammed: boolean;
  vitals: VitalSigns;
  coordinates: Coordinates;
  droneAlerts: DroneAlert[];
  gunfireEvents: GunfireEvent[];
  aiLog: AILogEntry[];
  squadMembers: SquadMember[];
  deadManCountdown: number | null;
  cameraActive: boolean;
}

interface TacticalContextType extends TacticalState {
  setViewMode: (mode: ViewMode) => void;
  toggleSignalStatus: () => void;
  setSystemMode: (mode: SystemMode) => void;
  simulateJamming: () => void;
  startDeadManSwitch: () => void;
  cancelDeadManSwitch: () => void;
  setCameraActive: (active: boolean) => void;
  addAILog: (message: string, type: AILogEntry['type']) => void;
}

const TacticalContext = createContext<TacticalContextType | undefined>(undefined);

const CALLSIGNS = ['ALPHA-1', 'BRAVO-2', 'CHARLIE-3', 'DELTA-4'];
const DRONE_TYPES = ['Mavic-3 Pro', 'DJI Mini', 'Custom FPV', 'Fixed-Wing ISR'];

export const TacticalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TacticalState>({
    viewMode: 'operator',
    signalStatus: 'GPS',
    systemMode: 'normal',
    isJammed: false,
    vitals: {
      heartRate: 72,
      spO2: 98,
      hrvStress: 35,
      hapeRisk: 12,
    },
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
      alt: 2847,
      heading: 45,
    },
    droneAlerts: [],
    gunfireEvents: [],
    aiLog: [],
    squadMembers: CALLSIGNS.map((callsign, i) => ({
      id: `squad-${i}`,
      callsign,
      status: 'active',
      vitals: { heartRate: 70 + Math.random() * 20, spO2: 96 + Math.random() * 3, hrvStress: 30 + Math.random() * 20, hapeRisk: 10 + Math.random() * 15 },
      position: { lat: 34.0522 + (Math.random() - 0.5) * 0.01, lng: -118.2437 + (Math.random() - 0.5) * 0.01, alt: 2847, heading: Math.random() * 360 },
    })),
    deadManCountdown: null,
    cameraActive: false,
  });

  const addAILog = useCallback((message: string, type: AILogEntry['type']) => {
    setState(prev => ({
      ...prev,
      aiLog: [
        { id: `log-${Date.now()}`, message, timestamp: Date.now(), type },
        ...prev.aiLog.slice(0, 9),
      ],
    }));
  }, []);

  // Simulate dynamic vitals
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const hrVariation = (Math.random() - 0.5) * 8;
        const newHR = Math.max(55, Math.min(180, prev.vitals.heartRate + hrVariation));
        
        const newVitals = {
          heartRate: newHR,
          spO2: Math.max(88, Math.min(100, prev.vitals.spO2 + (Math.random() - 0.5) * 2)),
          hrvStress: Math.max(10, Math.min(100, prev.vitals.hrvStress + (Math.random() - 0.5) * 5)),
          hapeRisk: Math.max(0, Math.min(100, prev.vitals.hapeRisk + (Math.random() - 0.5) * 3)),
        };

        // Auto high-stress mode when HR > 140
        let newMode = prev.systemMode;
        if (newHR > 140 && prev.systemMode === 'normal') {
          newMode = 'high-stress';
        } else if (newHR <= 130 && prev.systemMode === 'high-stress') {
          newMode = 'normal';
        }

        return {
          ...prev,
          vitals: newVitals,
          systemMode: newMode,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate random drone alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const droneType = DRONE_TYPES[Math.floor(Math.random() * DRONE_TYPES.length)];
        const distance = Math.floor(100 + Math.random() * 900);
        const bearing = Math.floor(Math.random() * 360);
        
        const newAlert: DroneAlert = {
          id: `drone-${Date.now()}`,
          type: droneType,
          distance,
          bearing,
          confidence: 70 + Math.floor(Math.random() * 30),
          timestamp: Date.now(),
        };

        setState(prev => ({
          ...prev,
          droneAlerts: [newAlert, ...prev.droneAlerts.slice(0, 4)],
        }));

        addAILog(`Acoustic signature matched to ${droneType} @ ${distance}m`, distance < 300 ? 'critical' : 'warning');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [addAILog]);

  // Simulate random gunfire
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.92) {
        const bearing = Math.floor(Math.random() * 360);
        const distance = Math.floor(50 + Math.random() * 500);
        
        setState(prev => ({
          ...prev,
          gunfireEvents: [
            { id: `shot-${Date.now()}`, bearing, distance, timestamp: Date.now() },
            ...prev.gunfireEvents.slice(0, 2),
          ],
        }));

        addAILog(`Triangulating gunshot via Mesh-Net nodes @ ${bearing}°`, 'critical');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [addAILog]);

  // Update coordinates
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          lat: prev.coordinates.lat + (Math.random() - 0.5) * 0.0001,
          lng: prev.coordinates.lng + (Math.random() - 0.5) * 0.0001,
          heading: (prev.coordinates.heading + (Math.random() - 0.5) * 5 + 360) % 360,
        },
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Dead man's switch countdown
  useEffect(() => {
    if (state.deadManCountdown === null) return;
    
    if (state.deadManCountdown <= 0) {
      addAILog('DEAD-MAN SWITCH ACTIVATED - INITIATING DATA WIPE', 'critical');
      setState(prev => ({ ...prev, deadManCountdown: null }));
      return;
    }

    const timer = setTimeout(() => {
      setState(prev => ({
        ...prev,
        deadManCountdown: prev.deadManCountdown !== null ? prev.deadManCountdown - 1 : null,
      }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.deadManCountdown, addAILog]);

  const value: TacticalContextType = {
    ...state,
    setViewMode: (mode) => setState(prev => ({ ...prev, viewMode: mode })),
    toggleSignalStatus: () => setState(prev => ({ 
      ...prev, 
      signalStatus: prev.signalStatus === 'GPS' ? 'VBN' : 'GPS' 
    })),
    setSystemMode: (mode) => {
      setState(prev => ({ ...prev, systemMode: mode }));
      if (mode === 'stealth') {
        addAILog('STEALTH MODE ENGAGED - Switching to IR spectrum', 'info');
      }
    },
    simulateJamming: () => {
      setState(prev => ({ ...prev, isJammed: true, signalStatus: 'VBN' }));
      addAILog('SIGNAL JAMMING DETECTED - Switching to Vision-Based Navigation', 'critical');
      setTimeout(() => {
        setState(prev => ({ ...prev, isJammed: false }));
        addAILog('Jamming cleared - GPS signal restored', 'info');
      }, 10000);
    },
    startDeadManSwitch: () => {
      setState(prev => ({ ...prev, deadManCountdown: 30 }));
      addAILog('DEAD-MAN SWITCH ARMED - 30 seconds to cancel', 'critical');
    },
    cancelDeadManSwitch: () => {
      setState(prev => ({ ...prev, deadManCountdown: null }));
      addAILog('Dead-man switch cancelled', 'info');
    },
    setCameraActive: (active) => setState(prev => ({ ...prev, cameraActive: active })),
    addAILog,
  };

  return (
    <TacticalContext.Provider value={value}>
      {children}
    </TacticalContext.Provider>
  );
};

export const useTactical = () => {
  const context = useContext(TacticalContext);
  if (!context) {
    throw new Error('useTactical must be used within TacticalProvider');
  }
  return context;
};
