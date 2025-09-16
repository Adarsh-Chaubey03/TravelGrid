// Chart.jsx
import React, { memo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#f43f5e', '#fb7185', '#EC4899', '#8B5CF6', '#F472B6', '#EF4444'];

const ExpenseChart = ({ chartData, isDarkMode }) => {
  console.log("ExpenseChart re-rendered 🎯");
  return (
     <><h3 className={`text-2xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Expense Breakdown</h3><ResponsiveContainer width="100%" height={450}>
          <PieChart margin={{ top: 30, bottom: 60 }}>
              <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
              >
                  {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
      </ResponsiveContainer></>
  );
};

export default memo(ExpenseChart);
