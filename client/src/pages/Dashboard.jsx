import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import { StatsCardSkeleton } from '../components/Skeleton';
import StatusPieChart from '../charts/StatusPieChart';
import ProductivityLineChart from '../charts/ProductivityLineChart';

const Dashboard = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ov, prod, stat, tasks] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/productivity'),
          api.get('/analytics/status'),
          api.get('/tasks', { params: { limit: 5, sort: 'newest' } })
        ]);
        setOverview(ov.data);
        setProductivity(prod.data);
        setStatusData(stat.data);
        setRecentTasks(tasks.data.tasks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-grotesk font-bold tracking-tight">
            {greeting()}, <span className="text-[var(--color-accent)]">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        {overview && (
          <div className="glass rounded-xl px-4 py-2 text-xs text-[var(--color-text-muted)]">
            <span className="text-[var(--color-accent)] font-bold text-lg">{overview.completionRate}%</span> completion rate
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatsCardSkeleton /><StatsCardSkeleton /><StatsCardSkeleton /><StatsCardSkeleton />
          </>
        ) : overview && (
          <>
            <StatsCard
              title="Total Tasks"
              value={String(overview.total)}
              color="#C084FC"
              delay={0}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            />
            <StatsCard
              title="Completed"
              value={String(overview.completed)}
              color="#34D399"
              delay={100}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatsCard
              title="Pending"
              value={String(overview.pending)}
              color="#FBBF24"
              delay={200}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatsCard
              title="Overdue"
              value={String(overview.overdue)}
              color="#F87171"
              delay={300}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {!loading && statusData && <StatusPieChart data={statusData.byStatus} />}
        {!loading && productivity && <ProductivityLineChart data={productivity.productivityTrend} />}
      </div>

      {/* Insights + Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Insights */}
        {!loading && productivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 border-glow"
          >
            <h3 className="text-sm font-grotesk font-semibold mb-4 text-[var(--color-text-secondary)]">Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-muted)]">Most productive day</span>
                <span className="text-sm font-medium text-[var(--color-accent)]">{productivity.mostProductiveDay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-muted)]">Avg completion time</span>
                <span className="text-sm font-medium">{productivity.avgCompletionHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-muted)]">Completed (30d)</span>
                <span className="text-sm font-medium text-green-400">{productivity.totalCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-muted)]">Pending tasks</span>
                <span className="text-sm font-medium text-yellow-400">{overview?.pending || 0}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass rounded-2xl p-6 border-glow"
        >
          <h3 className="text-sm font-grotesk font-semibold mb-4 text-[var(--color-text-secondary)]">Recent Tasks</h3>
          <div className="space-y-2">
            {recentTasks.length === 0 && !loading ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-[var(--color-text-muted)] opacity-30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <p className="text-sm text-[var(--color-text-muted)]">No tasks yet. Create your first task!</p>
              </div>
            ) : (
              recentTasks.map(task => (
                <TaskCard key={task._id} task={task} />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
