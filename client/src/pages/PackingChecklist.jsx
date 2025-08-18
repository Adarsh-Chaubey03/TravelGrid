import PackingChecklist from "../components/TravelPackingChecklist/PackingChecklist";
import React from "react";
import { useTheme } from "../context/ThemeContext";

const PackingChecklistPage = () => {
    const { isDarkMode } = useTheme();
    
    return (
        <div className={`mx-auto p-10 min-h-screen w-full overflow-x-hidden pt-20 transition-all duration-300 ${
            isDarkMode 
                ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900' 
                : 'bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300'
        }`}>
            <PackingChecklist/>
        </div>
    )
}

export default PackingChecklistPage;