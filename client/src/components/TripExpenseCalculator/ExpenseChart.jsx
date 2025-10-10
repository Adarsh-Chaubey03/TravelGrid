// Chart.jsx
import React, { memo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// High-contrast categorical palettes (inspired by Tableau/Observable palettes)
const COLORS_LIGHT = [
  '#1f77b4', // blue
  '#ff7f0e', // orange
  '#2ca02c', // green
  '#d62728', // red
  '#9467bd', // purple
  '#17becf', // cyan
];

const COLORS_DARK = [
  '#4c78a8', // blue
  '#f58518', // orange
  '#54a24b', // green
  '#e45756', // red
  '#b279a2', // purple
  '#72b7b2', // teal
];

const ExpenseChart = ({ chartData, isDarkMode }) => {
  console.log("ExpenseChart re-rendered 🎯");
  return (
     <>
       <h3 className={`text-2xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Expense Breakdown</h3>
       <ResponsiveContainer width="100%" height={450}>
         <PieChart margin={{ top: 30, bottom: 60 }}>
           <Pie
             data={chartData}
             dataKey="value"
             nameKey="name"
             cx="50%"
             cy="50%"
             outerRadius={110}
             label
           >
             {chartData.map((_, index) => (
               <Cell
                 key={`cell-${index}`}
                 fill={(isDarkMode ? COLORS_DARK : COLORS_LIGHT)[index % (isDarkMode ? COLORS_DARK.length : COLORS_LIGHT.length)]}
                 stroke={isDarkMode ? '#0f172a' : '#ffffff'}
                 strokeWidth={2}
               />
             ))}
           </Pie>
           <Tooltip
             contentStyle={{
               background: isDarkMode ? '#0f172a' : '#ffffff',
               color: isDarkMode ? '#f8fafc' : '#1f2937',
               border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
             }}
           />
           <Legend layout="horizontal" verticalAlign="bottom" align="center" />
         </PieChart>
       </ResponsiveContainer>
     </>
  );
};

export default memo(ExpenseChart);
