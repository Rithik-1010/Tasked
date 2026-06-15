import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-strong rounded-xl px-3 py-2 text-xs" style={{ borderColor: 'rgba(192,132,252,0.2)' }}>
        <p className="text-[var(--color-text-muted)] mb-0.5">{label}</p>
        <p className="font-medium text-[var(--color-accent)]">{payload[0].value} completed</p>
      </div>
    );
  }
  return null;
};

const ProductivityLineChart = ({ data = [] }) => {
  const formatted = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6 border-glow"
    >
      <h3 className="text-sm font-grotesk font-semibold mb-4 text-[var(--color-text-secondary)]">Productivity Trend</h3>
      <div className="h-52">
        <ResponsiveContainer>
          <LineChart data={formatted}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#A1A1AA', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis tick={{ fill: '#A1A1AA', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="url(#lineGradient)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#C084FC', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProductivityLineChart;
