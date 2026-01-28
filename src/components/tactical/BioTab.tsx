import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Wind, Mountain, Camera, X, Scan } from 'lucide-react';
import { useTactical } from '@/contexts/TacticalContext';

export const BioTab = () => {
  const { vitals, viewMode, squadMembers, cameraActive, setCameraActive } = useTactical();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-full">
      {/* Main Vitals Display */}
      <div className="lg:col-span-2 space-y-4">
        {/* Personal Vitals */}
        <div className="glass-panel glow-border p-4">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Operator Vitals
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <VitalCard 
              label="Heart Rate"
              value={vitals.heartRate}
              unit="BPM"
              icon={Heart}
              status={vitals.heartRate > 140 ? 'critical' : vitals.heartRate > 100 ? 'warning' : 'normal'}
            />
            <VitalCard 
              label="SpO2"
              value={vitals.spO2}
              unit="%"
              icon={Wind}
              status={vitals.spO2 < 90 ? 'critical' : vitals.spO2 < 94 ? 'warning' : 'normal'}
            />
            <VitalCard 
              label="HRV Stress"
              value={vitals.hrvStress}
              unit=""
              icon={Activity}
              status={vitals.hrvStress > 70 ? 'critical' : vitals.hrvStress > 50 ? 'warning' : 'normal'}
            />
            <VitalCard 
              label="HAPE Risk"
              value={vitals.hapeRisk}
              unit="%"
              icon={Mountain}
              status={vitals.hapeRisk > 60 ? 'critical' : vitals.hapeRisk > 30 ? 'warning' : 'normal'}
            />
          </div>
        </div>

        {/* Heart Rate Graph */}
        <div className="glass-panel glow-border p-4">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Heart Rate Trend
          </h3>
          <HeartRateGraph heartRate={vitals.heartRate} />
        </div>

        {/* Squad Vitals (Commander View) */}
        {viewMode === 'commander' && (
          <motion.div 
            className="glass-panel glow-border p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
              Squad Vitals Overview
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {squadMembers.map((member) => (
                <div 
                  key={member.id}
                  className={`p-3 border ${
                    member.status === 'wounded' 
                      ? 'border-destructive bg-destructive/10' 
                      : 'border-border bg-muted/20'
                  }`}
                >
                  <p className="text-xs font-medium text-primary">{member.callsign}</p>
                  <p className={`text-sm font-bold ${
                    member.vitals.heartRate > 140 ? 'text-destructive' : 'text-primary'
                  }`}>
                    {Math.round(member.vitals.heartRate)} BPM
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    SpO2: {member.vitals.spO2.toFixed(0)}%
                  </p>
                  <div className={`text-[10px] uppercase mt-1 ${
                    member.status === 'active' ? 'text-success' : 'text-destructive'
                  }`}>
                    {member.status}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Panel */}
      <div className="space-y-4">
        {/* HAPE Probability Card */}
        <motion.div 
          className={`card-tactical ${vitals.hapeRisk > 50 ? 'border-warning' : ''}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Mountain className="w-3 h-3" />
            HAPE Probability
          </h3>
          
          <div className="text-center py-4">
            <p className={`text-4xl font-bold tabular-nums ${
              vitals.hapeRisk > 60 ? 'text-destructive glow-text-red' : 
              vitals.hapeRisk > 30 ? 'text-warning' : 'text-primary glow-text'
            }`}>
              {vitals.hapeRisk.toFixed(0)}%
            </p>
            <p className="text-[10px] text-muted-foreground mt-2">
              High Altitude Pulmonary Edema Risk
            </p>
          </div>
          
          <div className="tactical-progress mt-4">
            <div 
              className="tactical-progress-bar"
              style={{ 
                width: `${vitals.hapeRisk}%`,
                backgroundColor: vitals.hapeRisk > 60 ? 'hsl(0 100% 45%)' : 
                                vitals.hapeRisk > 30 ? 'hsl(30 100% 50%)' : 'hsl(43 100% 50%)'
              }}
            />
          </div>
        </motion.div>

        {/* rPPG Camera Scan */}
        <motion.div 
          className="card-tactical"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Camera className="w-3 h-3" />
            rPPG Camera Scan
          </h3>
          
          <p className="text-[10px] text-muted-foreground mb-4">
            Non-contact vital signs via camera analysis
          </p>
          
          <button
            onClick={() => setCameraActive(true)}
            className="btn-tactical w-full flex items-center justify-center gap-2"
          >
            <Scan className="w-4 h-4" />
            <span>Start Scan</span>
          </button>
        </motion.div>

        {/* Stress Level Gauge */}
        <motion.div 
          className="card-tactical"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Stress Index
          </h3>
          
          <StressGauge value={vitals.hrvStress} />
        </motion.div>
      </div>

      {/* Camera Overlay */}
      <AnimatePresence>
        {cameraActive && <CameraOverlay onClose={() => setCameraActive(false)} />}
      </AnimatePresence>
    </div>
  );
};

interface VitalCardProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  status: 'normal' | 'warning' | 'critical';
}

const VitalCard = ({ label, value, unit, icon: Icon, status }: VitalCardProps) => {
  const colors = {
    normal: 'text-primary',
    warning: 'text-warning',
    critical: 'text-destructive',
  };

  return (
    <div className={`p-4 border ${
      status === 'critical' ? 'border-destructive bg-destructive/5 animate-pulse-red' :
      status === 'warning' ? 'border-warning bg-warning/5' :
      'border-border bg-muted/20'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colors[status]}`} />
        <span className="stat-label">{label}</span>
      </div>
      <p className={`stat-value ${colors[status]} ${status !== 'normal' ? 'glow-text-red' : 'glow-text'}`}>
        {value.toFixed(0)}
        <span className="text-sm ml-1">{unit}</span>
      </p>
    </div>
  );
};

const HeartRateGraph = ({ heartRate }: { heartRate: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<number[]>([]);

  useEffect(() => {
    dataRef.current.push(heartRate);
    if (dataRef.current.length > 100) {
      dataRef.current.shift();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 176, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw data
    if (dataRef.current.length > 1) {
      ctx.strokeStyle = heartRate > 140 ? '#ff3333' : '#ffb000';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const minHR = 40;
      const maxHR = 180;

      dataRef.current.forEach((val, i) => {
        const x = (i / 100) * width;
        const normalizedVal = (val - minHR) / (maxHR - minHR);
        const y = height - normalizedVal * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Glow effect
      ctx.shadowColor = heartRate > 140 ? '#ff3333' : '#ffb000';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [heartRate]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={150}
      className="w-full h-32"
    />
  );
};

const StressGauge = ({ value }: { value: number }) => {
  return (
    <div className="relative h-4 bg-muted overflow-hidden">
      <motion.div
        className="h-full"
        style={{
          background: value > 70 
            ? 'linear-gradient(90deg, hsl(0 100% 45%), hsl(0 100% 55%))' 
            : value > 50 
            ? 'linear-gradient(90deg, hsl(30 100% 50%), hsl(40 100% 50%))' 
            : 'linear-gradient(90deg, hsl(43 100% 50%), hsl(50 100% 50%))',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-primary-foreground drop-shadow">
          {value.toFixed(0)}
        </span>
      </div>
    </div>
  );
};

const CameraOverlay = ({ onClose }: { onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<{hr: number; spo2: number} | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setResults({
        hr: Math.floor(65 + Math.random() * 30),
        spo2: Math.floor(95 + Math.random() * 4),
      });
      setScanning(false);
    }, 3000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-lg w-full mx-4">
        <div className="glass-panel glow-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm uppercase tracking-wider text-primary flex items-center gap-2">
              <Camera className="w-4 h-4" />
              rPPG Camera Scan
            </h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative aspect-video bg-black overflow-hidden border border-border">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Scanning overlay */}
            {scanning && (
              <motion.div
                className="absolute inset-0 border-2 border-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/20" />
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-primary"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                />
              </motion.div>
            )}

            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 border border-primary/50">
                <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-primary/50 -translate-x-1/2" />
                <div className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-primary/50 -translate-x-1/2" />
                <div className="absolute left-0 top-1/2 w-4 h-0.5 bg-primary/50 -translate-y-1/2" />
                <div className="absolute right-0 top-1/2 w-4 h-0.5 bg-primary/50 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {results && (
            <motion.div
              className="mt-4 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-3 border border-primary bg-primary/10 text-center">
                <p className="stat-label">Heart Rate</p>
                <p className="stat-value">{results.hr} <span className="text-sm">BPM</span></p>
              </div>
              <div className="p-3 border border-primary bg-primary/10 text-center">
                <p className="stat-label">SpO2</p>
                <p className="stat-value">{results.spo2}%</p>
              </div>
            </motion.div>
          )}

          <button
            onClick={handleScan}
            disabled={scanning}
            className="btn-tactical w-full mt-4 disabled:opacity-50"
          >
            {scanning ? 'ANALYZING...' : 'START SCAN'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
