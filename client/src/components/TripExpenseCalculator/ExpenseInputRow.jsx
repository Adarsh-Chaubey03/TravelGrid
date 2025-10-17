import React from "react";

const ExpenseInputRow = React.memo(({ label, value, onChange, isDarkMode }) => (
  <div className="mb-4">
    <label className={`block text-sm font-semibold mb-2 capitalize ${
      isDarkMode ? 'text-white' : 'text-gray-700'
    }`}>
      {label}
    </label>
    <input
      type="number"
      min={0}
      step="any"
      inputMode="decimal"
      value={value}
      onKeyDown={(e) => {
        // Block characters that can create negative/invalid numbers
        if (["-", "+", "e", "E"].includes(e.key)) {
          e.preventDefault();
        }
      }}
      onPaste={(e) => {
        const text = (e.clipboardData || window.clipboardData).getData("text");
        if (!/^\d*(\.?\d*)?$/.test(text)) {
          e.preventDefault();
        }
      }}
      onChange={(e) => {
        const val = e.target.value;
        // Allow clearing the field
        if (val === "") {
          onChange("");
          return;
        }
        // Only allow non-negative decimals (intermediate states like "0." are okay)
        if (/^\d*(\.?\d*)?$/.test(val)) {
          onChange(val);
        }
      }}
      placeholder={`Enter ${label} cost`}
      className={`w-full px-4 py-3 border rounded-xl transition-all  outline-none focus:ring-2 focus:ring-pink-400 ${
        isDarkMode 
          ? 'border-white/20 bg-white/10 text-gray-900 focus:border-pink-500  placeholder-gray-400' 
          : 'border-black/10  bg-gray-200 text-gray-900 focus:border-pink-500  placeholder-gray-500'
      }`}
    />
  </div>
))

export default ExpenseInputRow;