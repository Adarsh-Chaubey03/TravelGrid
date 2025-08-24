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
      className={`w-full px-4 py-3 border rounded-xl transition-all  outline-none focus:ring-2 focus:ring-pink-400 ${
        isDarkMode 
          ? 'border-white/20 bg-white/10 text-gray-900 focus:border-pink-500  placeholder-gray-400' 
          : 'border-black/10  bg-gray-200 text-gray-900 focus:border-pink-500  placeholder-gray-500'
      }`}
    />
  </div>
);

export default ExpenseInputRow;