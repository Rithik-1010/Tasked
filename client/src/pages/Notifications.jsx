import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { formatRelativeDate } from '../utils/helpers';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'task_created': return <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>;
      case 'task_completed': return <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'task_overdue': return <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
      default: return <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-grotesk font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-2)] transition-all">
            Mark all read
          </button>
        )}
      </motion.div>

      <div className="space-y-2">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-4 animate-shimmer">
              <div className="h-4 w-3/4 rounded bg-[var(--color-surface-2)]" />
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-[var(--color-text-muted)] opacity-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <h3 className="text-lg font-grotesk font-semibold mb-1">No notifications</h3>
            <p className="text-sm text-[var(--color-text-muted)]">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass rounded-xl p-4 flex items-start gap-3 transition-all ${!n.read ? 'border-l-2 border-l-[var(--color-accent)]' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!n.read ? 'font-medium' : 'text-[var(--color-text-muted)]'}`}>{n.message}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{formatRelativeDate(n.createdAt)}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
