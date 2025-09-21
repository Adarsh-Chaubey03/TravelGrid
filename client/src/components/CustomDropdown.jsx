import { useState } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({ options, value, onChange, isDarkMode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      {/* Selected value button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full pl-4 pr-5 py-3 rounded-xl text-left font-normal focus:outline-none
          ${isDarkMode 
            ? "bg-white/20 text-white placeholder-gray-300 focus:ring-3 focus:ring-pink-400" 
            : "bg-white/90 text-gray-700 placeholder-gray-400 focus:ring-3 focus:ring-pink-400"} 
          hover:border-pink-400 transition duration-200 relative`}
      >
        {value}
        <ChevronDown
          size={20}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Options dropdown */}
      {open && (
        <div
          className={`absolute mt-2 w-full rounded-xl shadow-lg z-50 overflow-hidden p-2
            ${isDarkMode ? "bg-gray-800 border border-pink-500/30" : "bg-white border border-pink-200"}`}
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer text-sm transition 
                  ${isDarkMode 
                    ? isSelected 
                      ? "bg-pink-500 text-white rounded-lg" 
                      : "text-gray-200 hover:bg-pink-600/70 rounded-lg"
                    : isSelected
                      ? "bg-pink-300 text-black rounded-lg p-2"
                      : "text-gray-700 hover:bg-pink-100 rounded-lg"
                  }`}
              >
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
