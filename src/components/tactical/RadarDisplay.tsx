import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTactical } from '@/contexts/TacticalContext';

export const RadarDisplay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { droneAlerts, gunfireEvents } = useTactical();
  const sweepAngleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const maxRadius = center - 20;

    const draw = () => {
      // Clear
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);

      // Draw grid circles
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(center, center, (maxRadius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(center, 10);
      ctx.lineTo(center, size - 10);
      ctx.moveTo(10, center);
      ctx.lineTo(size - 10, center);
      ctx.stroke();

      // Draw distance labels
      ctx.fillStyle = 'rgba(255, 176, 0, 0.5)';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('250m', center + 5, center - maxRadius / 4 + 12);
      ctx.fillText('500m', center + 5, center - maxRadius / 2 + 12);
      ctx.fillText('750m', center + 5, center - (maxRadius * 3) / 4 + 12);
      ctx.fillText('1km', center + 5, center - maxRadius + 12);

      // Draw sweep line
      sweepAngleRef.current = (sweepAngleRef.current + 0.02) % (Math.PI * 2);
      const gradient = ctx.createLinearGradient(
        center,
        center,
        center + Math.cos(sweepAngleRef.current) * maxRadius,
        center + Math.sin(sweepAngleRef.current) * maxRadius
      );
      gradient.addColorStop(0, 'rgba(255, 176, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 176, 0, 0)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + Math.cos(sweepAngleRef.current) * maxRadius,
        center + Math.sin(sweepAngleRef.current) * maxRadius
      );
      ctx.stroke();

      // Draw sweep trail
      const trailGradient = ctx.createConicGradient(sweepAngleRef.current, center, center);
      trailGradient.addColorStop(0, 'rgba(255, 176, 0, 0.3)');
      trailGradient.addColorStop(0.1, 'rgba(255, 176, 0, 0.1)');
      trailGradient.addColorStop(0.2, 'rgba(255, 176, 0, 0)');
      trailGradient.addColorStop(1, 'rgba(255, 176, 0, 0)');

      ctx.fillStyle = trailGradient;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, maxRadius, sweepAngleRef.current - 0.5, sweepAngleRef.current);
      ctx.closePath();
      ctx.fill();

      // Draw drone alerts
      droneAlerts.forEach((alert, index) => {
        const age = Date.now() - alert.timestamp;
        if (age > 30000) return; // Fade out after 30 seconds

        const opacity = Math.max(0, 1 - age / 30000);
        const angle = (alert.bearing * Math.PI) / 180 - Math.PI / 2;
        const distance = Math.min(alert.distance / 1000, 1) * maxRadius;
        const x = center + Math.cos(angle) * distance;
        const y = center + Math.sin(angle) * distance;

        // Pulsing effect for close threats
        const pulseSize = alert.distance < 300 ? 
          8 + Math.sin(Date.now() / 100) * 3 : 6;

        ctx.fillStyle = alert.distance < 300 
          ? `rgba(255, 50, 50, ${opacity})`
          : `rgba(255, 176, 0, ${opacity})`;
        
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, pulseSize * 2);
        glowGradient.addColorStop(0, alert.distance < 300 
          ? `rgba(255, 50, 50, ${opacity * 0.5})`
          : `rgba(255, 176, 0, ${opacity * 0.5})`);
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw gunfire events
      gunfireEvents.forEach((event) => {
        const age = Date.now() - event.timestamp;
        if (age > 10000) return;

        const opacity = Math.max(0, 1 - age / 10000);
        const angle = (event.bearing * Math.PI) / 180 - Math.PI / 2;
        const distance = Math.min(event.distance / 1000, 1) * maxRadius;
        const x = center + Math.cos(angle) * distance;
        const y = center + Math.sin(angle) * distance;

        // Draw X marker for gunfire
        ctx.strokeStyle = `rgba(255, 50, 50, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.moveTo(x + 5, y - 5);
        ctx.lineTo(x - 5, y + 5);
        ctx.stroke();
      });

      // Draw center marker (you)
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(center, center, 4, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [droneAlerts, gunfireEvents]);

  return (
    <motion.div 
      className="relative aspect-square"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-full glow-border"
      />
      
      {/* Compass labels */}
      <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-primary">N</span>
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-primary">S</span>
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-primary">W</span>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-primary">E</span>
    </motion.div>
  );
};
