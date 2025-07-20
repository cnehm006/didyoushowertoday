import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ShowerDataPoint, getVibeDescription } from '../../data/showerData';

interface BarChartProps {
  data: ShowerDataPoint[];
  language: (key: string) => string;
}

const BarChart: React.FC<BarChartProps> = ({ data, language }) => {
  const chartData = data.map(item => ({
    ...item,
    day: language(item.day.toLowerCase()),
    vibe: Number(item.vibe.toFixed(1)),
    vibeDescription: language(getVibeDescription(item.vibe))
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const vibeValue = payload[0].value;
      const vibeDescription = payload[0].payload.vibeDescription;
      
      return (
        <motion.div
          className="custom-tooltip glass"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 600 }}>
            {label}
          </p>
          <p style={{ margin: '4px 0 0 0', color: 'var(--accent-color)', fontSize: '14px' }}>
            Vibe: {vibeValue}/10
          </p>
          <p style={{ margin: '2px 0 0 0', color: 'var(--text-secondary)', fontSize: '12px', fontStyle: 'italic' }}>
            "{vibeDescription}"
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const getBarColor = (vibe: number) => {
    if (vibe >= 8) return '#10b981'; // Green for high vibes
    if (vibe >= 6) return '#3b82f6'; // Blue for good vibes
    if (vibe >= 4) return '#f59e0b'; // Orange for medium vibes
    return '#ef4444'; // Red for low vibes
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ height: '400px', width: '100%' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-color)"
            opacity={0.3}
          />
          <XAxis
            dataKey="day"
            stroke="var(--text-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--text-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 10]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="vibe"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationBegin={300}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.vibe)}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BarChart; 