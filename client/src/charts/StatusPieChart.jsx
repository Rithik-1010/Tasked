import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#A1A1AA', '#C084FC', '#34D399'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-strong rounded-xl px-3 py-2 text-xs" style={{ borderColor: 'rgba(192,132,252,0.2)' }}>
        <p className="font-medium">{payload[0].name}: <span className="text-[var(--color-accent)]">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

const StatusPieChart = ({ data = [] }) => {
  const chartData = data.map(d => ({
    ...d,
    name: d.name === 'pending' ? 'Pending' : d.name === 'in-progress' ? 'In Progress' : 'Completed'
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border-glow"
    >
      <h3 className="text-sm font-grotesk font-semibold mb-4 text-[var(--color-text-secondary)]">Tasks by Status</h3>
      <div className="h-52">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {chartData.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
            {d.name}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StatusPieChart;
