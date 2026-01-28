import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTactical } from '@/contexts/TacticalContext';

export const ShotSpotterDial = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gunfireEvents } = useTactical();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height - 20;
    const radius = height - 40;

    const draw = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw arc background
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI, 0);
      ctx.stroke();

      // Draw tick marks
      for (let angle = 0; angle <= 180; angle += 15) {
        const rad = (angle * Math.PI) / 180 + Math.PI;
        const innerRadius = radius - 10;
        const outerRadius = angle % 45 === 0 ? radius + 5 : radius;

        ctx.strokeStyle = 'rgba(255, 176, 0, 0.4)';
        ctx.lineWidth = angle % 45 === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(rad) * innerRadius,
          centerY + Math.sin(rad) * innerRadius
        );
        ctx.lineTo(
          centerX + Math.cos(rad) * outerRadius,
          centerY + Math.sin(rad) * outerRadius
        );
        ctx.stroke();

        // Draw degree labels for major ticks
        if (angle % 45 === 0) {
          ctx.fillStyle = 'rgba(255, 176, 0, 0.6)';
          ctx.font = '10px JetBrains Mono';
          ctx.textAlign = 'center';
          const labelRadius = radius - 25;
          ctx.fillText(
            `${angle}°`,
            centerX + Math.cos(rad) * labelRadius,
            centerY + Math.sin(rad) * labelRadius
          );
        }
      }

      // Draw direction labels
      ctx.fillStyle = 'rgba(255, 176, 0, 0.8)';
      ctx.font = '12px JetBrains Mono';
      ctx.fillText('W', 20, centerY);
      ctx.fillText('N', centerX, 15);
      ctx.fillText('E', width - 20, centerY);

      // Draw gunfire vectors
      gunfireEvents.forEach((event) => {
        const age = Date.now() - event.timestamp;
        if (age > 15000) return;

        const opacity = Math.max(0, 1 - age / 15000);
        const bearing = event.bearing;
        // Map bearing (0-360) to dial (0-180 visible on top half)
        let dialAngle = bearing;
        if (bearing > 180) dialAngle = 360 - bearing;
        
        const rad = (dialAngle * Math.PI) / 180 + Math.PI;

        // Draw vector line
        const pulseIntensity = Math.sin(Date.now() / 100) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(255, 50, 50, ${opacity * pulseIntensity})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(rad) * radius,
          centerY + Math.sin(rad) * radius
        );
        ctx.stroke();

        // Draw arrow head
        const arrowSize = 10;
        const arrowX = centerX + Math.cos(rad) * (radius - 5);
        const arrowY = centerY + Math.sin(rad) * (radius - 5);

        ctx.fillStyle = `rgba(255, 50, 50, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX + Math.cos(rad - 2.8) * arrowSize,
          arrowY + Math.sin(rad - 2.8) * arrowSize
        );
        ctx.lineTo(
          arrowX + Math.cos(rad + 2.8) * arrowSize,
          arrowY + Math.sin(rad + 2.8) * arrowSize
        );
        ctx.closePath();
        ctx.fill();

        // Draw distance label
        ctx.fillStyle = `rgba(255, 50, 50, ${opacity})`;
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${event.distance}m`,
          centerX + Math.cos(rad) * (radius * 0.6),
          centerY + Math.sin(rad) * (radius * 0.6)
        );
      });

      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [gunfireEvents]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={180}
        className="w-full"
      />
    </motion.div>
  );
};
