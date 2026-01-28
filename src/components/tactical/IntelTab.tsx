import { motion } from 'framer-motion';
import { Radio, AlertTriangle, Crosshair, Volume2 } from 'lucide-react';
import { useTactical } from '@/contexts/TacticalContext';
import { RadarDisplay } from './RadarDisplay';
import { ShotSpotterDial } from './ShotSpotterDial';
import { AIReasoningLog } from './AIReasoningLog';

export const IntelTab = () => {
  const { droneAlerts, gunfireEvents } = useTactical();
  
  const activeAlerts = droneAlerts.filter(a => Date.now() - a.timestamp < 30000);
  const criticalAlerts = activeAlerts.filter(a => a.distance < 300);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-full">
      {/* Main Radar Display */}
      <div className="lg:col-span-2 space-y-4">
        <div className="glass-panel glow-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Radio className="w-3 h-3" />
              Acoustic Neural Detection
            </h3>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] text-muted-foreground">LISTENING</span>
            </div>
          </div>
          
          <RadarDisplay />
        </div>

        {/* Shot Spotter */}
        <div className="glass-panel glow-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Crosshair className="w-3 h-3" />
              Acoustic Shot-Spotter Vector
            </h3>
          </div>
          
          <ShotSpotterDial />
        </div>
      </div>

      {/* Right Panel - Alerts */}
      <div className="space-y-4">
        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <motion.div 
            className="alert-critical p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 animate-flicker" />
              <span className="text-xs uppercase tracking-wider font-bold">
                PROXIMITY ALERT
              </span>
            </div>
            
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="text-sm mb-2">
                <span className="font-bold">{alert.type}</span>
                <br />
                <span className="text-[10px]">
                  {alert.distance}m @ {alert.bearing}° | {alert.confidence}% conf
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Active Threats List */}
        <motion.div 
          className="card-tactical"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Active Drone Contacts ({activeAlerts.length})
          </h3>
          
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {activeAlerts.length === 0 ? (
              <p className="text-[10px] text-muted-foreground">No contacts detected</p>
            ) : (
              activeAlerts.map((alert) => (
                <motion.div 
                  key={alert.id}
                  className={`p-3 border ${
                    alert.distance < 300 
                      ? 'border-destructive bg-destructive/10' 
                      : 'border-border bg-muted/20'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-medium ${
                        alert.distance < 300 ? 'text-destructive' : 'text-primary'
                      }`}>
                        {alert.type}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {alert.distance}m @ {alert.bearing}°
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">
                        {alert.confidence}%
                      </p>
                      <div className="w-12 h-1 bg-muted mt-1">
                        <div 
                          className={`h-full ${
                            alert.distance < 300 ? 'bg-destructive' : 'bg-primary'
                          }`}
                          style={{ width: `${alert.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Gunfire */}
        <motion.div 
          className="card-tactical"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Crosshair className="w-3 h-3" />
            Shot-Spotter Events
          </h3>
          
          <div className="space-y-2">
            {gunfireEvents.length === 0 ? (
              <p className="text-[10px] text-muted-foreground">No recent gunfire detected</p>
            ) : (
              gunfireEvents.slice(0, 3).map((event) => (
                <div 
                  key={event.id}
                  className="flex justify-between items-center p-2 border border-destructive/50 bg-destructive/5"
                >
                  <span className="text-sm text-destructive">
                    {event.bearing}° @ {event.distance}m
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {Math.floor((Date.now() - event.timestamp) / 1000)}s ago
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* AI Reasoning Log */}
        <AIReasoningLog />
      </div>
    </div>
  );
};
