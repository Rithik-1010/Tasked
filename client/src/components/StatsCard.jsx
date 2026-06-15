import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const StatsCard = ({ title, value, icon, trend, color = '#C084FC', delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const num = parseInt(value) || 0;
    if (num === 0) { setDisplayValue(0); return; }

    let start = 0;
    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * num);
      setDisplayValue(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => requestAnimationFrame(animate), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const isPercentage = typeof value === 'string' && value.includes('%');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="glass rounded-2xl p-5 border-glow group hover:bg-[var(--color-surface-2)] transition-all duration-300 cursor-default"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ borderColor: `${color}20` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="font-grotesk text-3xl font-bold tracking-tight mb-1" style={{ color }}>
        {displayValue}{isPercentage ? '%' : ''}
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">{title}</p>
    </motion.div>
  );
};

export default StatsCard;
