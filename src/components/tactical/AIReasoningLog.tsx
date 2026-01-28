import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useTactical } from '@/contexts/TacticalContext';

export const AIReasoningLog = () => {
  const { aiLog } = useTactical();

  const getIcon = (type: 'info' | 'warning' | 'critical') => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-3 h-3 text-destructive" />;
      case 'warning':
        return <AlertCircle className="w-3 h-3 text-warning" />;
      default:
        return <Info className="w-3 h-3 text-primary" />;
    }
  };

  const getTextColor = (type: 'info' | 'warning' | 'critical') => {
    switch (type) {
      case 'critical':
        return 'text-destructive';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-primary';
    }
  };

  return (
    <motion.div 
      className="card-tactical"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
        <Brain className="w-3 h-3" />
        AI Reasoning Log
      </h3>
      
      <div className="space-y-2 max-h-[180px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {aiLog.length === 0 ? (
            <p className="text-[10px] text-muted-foreground">Awaiting neural analysis...</p>
          ) : (
            aiLog.map((entry) => (
              <motion.div 
                key={entry.id}
                className="flex items-start gap-2 text-[10px] border-l-2 pl-2 py-1"
                style={{ 
                  borderColor: entry.type === 'critical' 
                    ? 'hsl(0 100% 45%)' 
                    : entry.type === 'warning' 
                    ? 'hsl(30 100% 50%)' 
                    : 'hsl(43 100% 50%)' 
                }}
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="mt-0.5">{getIcon(entry.type)}</span>
                <div className="flex-1">
                  <p className={getTextColor(entry.type)}>
                    {entry.message}
                  </p>
                  <p className="text-muted-foreground/60">
                    {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                      hour12: false, 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit' 
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
