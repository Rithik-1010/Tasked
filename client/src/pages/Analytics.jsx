import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import StatusPieChart from '../charts/StatusPieChart';
import PriorityBarChart from '../charts/PriorityBarChart';
import ProductivityLineChart from '../charts/ProductivityLineChart';
import WeeklyActivityChart from '../charts/WeeklyActivityChart';
import { StatsCardSkeleton, ChartSkeleton } from '../components/Skeleton';

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ov, prod, stat] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/productivity'),
          api.get('/analytics/status')
        ]);
        setOverview(ov.data);
        setProductivity(prod.data);
        setStatusData(stat.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-grotesk font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Track your productivity and task insights</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          [...Array(5)].map((_, i) => <StatsCardSkeleton key={i} />)
        ) : overview && (
          <>
            <StatsCard title="Total Tasks" value={String(overview.total)} color="#C084FC" delay={0}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
            <StatsCard title="Completed" value={String(overview.completed)} color="#34D399" delay={100}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatsCard title="In Progress" value={String(overview.inProgress)} color="#C084FC" delay={200}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
            <StatsCard title="Overdue" value={String(overview.overdue)} color="#F87171" delay={300}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
            <StatsCard title="Completion" value={`${overview.completionRate}%`} color="#FBBF24" delay={400}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>} />
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <><ChartSkeleton /><ChartSkeleton /><ChartSkeleton /><ChartSkeleton /></>
        ) : (
          <>
            {statusData && <StatusPieChart data={statusData.byStatus} />}
            {statusData && <PriorityBarChart data={statusData.byPriority} />}
            {productivity && <ProductivityLineChart data={productivity.productivityTrend} />}
            {productivity && <WeeklyActivityChart data={productivity.weeklyActivity} />}
          </>
        )}
      </div>

      {/* Insights */}
      {!loading && productivity && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-6 border-glow">
          <h3 className="text-sm font-grotesk font-semibold mb-4 text-[var(--color-text-secondary)]">Productivity Insights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-grotesk font-bold text-[var(--color-accent)]">{productivity.mostProductiveDay}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Most Productive Day</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-grotesk font-bold">{productivity.avgCompletionHours}h</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Avg Completion Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-grotesk font-bold text-green-400">{overview?.completionRate || 0}%</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-grotesk font-bold text-yellow-400">{overview?.pending || 0}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Pending Tasks</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;
