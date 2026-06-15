import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-grotesk font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Customize your experience</p>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border-glow">
        <h3 className="text-sm font-grotesk font-semibold mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-[var(--color-text-muted)]">Switch between dark and light mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full bg-[var(--color-surface-3)] transition-colors"
            style={theme === 'dark' ? { background: 'linear-gradient(to right, #C084FC, #A855F7)' } : {}}
          >
            <motion.div
              className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
              animate={{ left: theme === 'dark' ? '30px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 border-glow">
        <h3 className="text-sm font-grotesk font-semibold mb-4">Account</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--color-text-muted)]">Role</span>
            <span className="capitalize font-medium">{user?.role}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--color-text-muted)]">Member since</span>
            <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
      </motion.div>

      {/* Keyboard Shortcuts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6 border-glow">
        <h3 className="text-sm font-grotesk font-semibold mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-2">
          {[
            { keys: 'N', desc: 'New task' },
            { keys: '/', desc: 'Search' },
            { keys: 'D', desc: 'Dashboard' },
            { keys: 'T', desc: 'Tasks' },
            { keys: 'B', desc: 'Board' },
            { keys: 'A', desc: 'Analytics' },
          ].map(({ keys, desc }) => (
            <div key={keys} className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-text-muted)]">{desc}</span>
              <kbd className="px-2 py-0.5 rounded-md bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs font-mono">{keys}</kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
