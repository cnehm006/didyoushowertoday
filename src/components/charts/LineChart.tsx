import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ShowerDataPoint } from '../../data/showerData';

interface LineChartProps {
  data: ShowerDataPoint[];
  language: (key: string) => string;
}

const LineChart: React.FC<LineChartProps> = ({ data, language }) => {
  const chartData = data.map(item => ({
    ...item,
    day: language(item.day.toLowerCase()),
    showers: Number(item.showers.toFixed(1)),
    vibe: Number(item.vibe.toFixed(1))
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              style={{
                margin: '4px 0 0 0',
                color: entry.color,
                fontSize: '14px'
              }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ height: '400px', width: '100%' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
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
          <Legend
            wrapperStyle={{
              color: 'var(--text-primary)',
              fontSize: '12px'
            }}
          />
          <Line
            type="monotone"
            dataKey="showers"
            stroke="var(--accent-color)"
            strokeWidth={3}
            dot={{
              fill: 'var(--accent-color)',
              strokeWidth: 2,
              r: 4
            }}
            activeDot={{
              r: 6,
              stroke: 'var(--accent-color)',
              strokeWidth: 2,
              fill: 'var(--bg-primary)'
            }}
            name={language('weeklyShowers')}
            animationDuration={1000}
            animationBegin={200}
          />
          <Line
            type="monotone"
            dataKey="vibe"
            stroke="var(--success-color)"
            strokeWidth={3}
            dot={{
              fill: 'var(--success-color)',
              strokeWidth: 2,
              r: 4
            }}
            activeDot={{
              r: 6,
              stroke: 'var(--success-color)',
              strokeWidth: 2,
              fill: 'var(--bg-primary)'
            }}
            name={language('mentalState')}
            animationDuration={1000}
            animationBegin={400}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default LineChart; 