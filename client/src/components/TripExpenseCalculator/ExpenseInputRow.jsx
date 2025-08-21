import React from "react";

const ExpenseInputRow = ({ label, value, onChange, isDarkMode }) => (
  <div className="mb-4">
    <label className={`block text-sm font-semibold mb-2 capitalize ${
      isDarkMode ? 'text-white' : 'text-gray-700'
    }`}>
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${label} cost`}
      className={`w-full px-4 py-3 border-b-2 rounded-xl transition-all outline-none focus:ring-2 focus:ring-pink-100 ${
        isDarkMode 
          ? 'border-b-[#7e3b5c] bg-gray-700 text-white focus:border-b-white placeholder-gray-400' 
          : 'border-b-pink-300 bg-white text-gray-900 focus:border-b-pink-500 placeholder-gray-500'
      }`}
    />
  </div>
);

export default ExpenseInputRow;