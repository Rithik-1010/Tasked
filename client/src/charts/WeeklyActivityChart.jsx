import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-strong rounded-xl px-3 py-2 text-xs" style={{ borderColor: 'rgba(192,132,252,0.2)' }}>
        <p className="text-[var(--color-text-muted)] mb-0.5">{payload[0].payload.day}</p>
        <p className="font-medium text-[var(--color-accent)]">{payload[0].value} tasks</p>
      </div>
    );
  }
  return null;
};

const WeeklyActivityChart = ({ data = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6 border-glow"
    >
      <h3 className="text-sm font-grotesk font-semibold mb-4 text-[var(--color-text-secondary)]">Weekly Activity</h3>
      <div className="h-52">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C084FC" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#C084FC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: '#A1A1AA', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#A1A1AA', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="tasks"
              stroke="#C084FC"
              strokeWidth={2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default WeeklyActivityChart;
