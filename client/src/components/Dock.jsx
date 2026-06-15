import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const dockItems = [
  { path: '/dashboard', label: 'Home', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { path: '/tasks', label: 'Tasks', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
  { path: '/kanban', label: 'Board', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg> },
  { path: '/analytics', label: 'Stats', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { path: '/profile', label: 'Profile', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
];

const Dock = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden">
      <div className="glass-strong rounded-2xl px-2 py-2 flex items-end gap-1" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(192,132,252,0.1)' }}>
        {dockItems.map((item, index) => {
          const distance = hoveredIndex !== null ? Math.abs(index - hoveredIndex) : -1;
          const scale = hoveredIndex === index ? 1.4 : distance === 1 ? 1.15 : 1;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onTouchStart={() => setHoveredIndex(index)}
              onTouchEnd={() => setTimeout(() => setHoveredIndex(null), 300)}
              className={({ isActive }) => `relative flex flex-col items-center`}
            >
              {({ isActive }) => (
                <motion.div
                  animate={{ scale, y: hoveredIndex === index ? -8 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] glow-violet' : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {item.icon}
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
