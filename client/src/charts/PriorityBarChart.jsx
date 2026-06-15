import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = { low: '#34D399', medium: '#FBBF24', high: '#F87171' };

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-strong rounded-xl px-3 py-2 text-xs" style={{ borderColor: 'rgba(192,132,252,0.2)' }}>
        <p className="font-medium capitalize">{payload[0].payload.name}: <span style={{ color: COLORS[payload[0].payload.name] }}>{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

const PriorityBarChart = ({ data = [] }) => {
  const chartData = data.map(d => ({
    ...d,
    fill: COLORS[d.name] || '#C084FC',
    label: d.name === 'low' ? 'Low' : d.name === 'medium' ? 'Medium' : 'High'
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6 border-glow"
    >
      <h3 className="text-sm font-grotesk font-semibold mb-4 text-[var(--color-text-secondary)]">Tasks by Priority</h3>
      <div className="h-52">
        <ResponsiveContainer>
          <BarChart data={chartData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="label" tick={{ fill: '#A1A1AA', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#A1A1AA', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, i) => (
                <motion.rect key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PriorityBarChart;
