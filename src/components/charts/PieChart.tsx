import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ProductUsage } from '../../data/showerData';

interface PieChartProps {
  data: ProductUsage[];
  language: (key: string) => string;
}

const PieChart: React.FC<PieChartProps> = ({ data, language }) => {
  const chartData = data.map(item => ({
    ...item,
    name: language(item.name.toLowerCase().replace(' ', ''))
  }));

  const CustomTooltip = ({ active, payload }: any) => {
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
            {payload[0].name}
          </p>
          <p style={{ margin: '4px 0 0 0', color: payload[0].color, fontSize: '14px' }}>
            {payload[0].value}%
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {payload?.map((entry: any, index: number) => (
          <motion.div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: entry.color,
                borderRadius: '2px'
              }}
            />
            <span>{entry.value}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{ height: '400px', width: '100%' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="var(--accent-color)"
            dataKey="value"
            animationDuration={1000}
            animationBegin={400}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PieChart; 