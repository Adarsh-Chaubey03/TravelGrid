import PackingChecklist from "../components/TravelPackingChecklist/PackingChecklist";
import React from "react";
import { useTheme } from "../context/ThemeContext";

const PackingChecklistPage = () => {
    const { isDarkMode } = useTheme();
    
    return (
        <div className={`mx-auto p-10 min-h-screen w-full overflow-x-hidden pt-20 transition-all duration-300`}>
            <PackingChecklist/>
        </div>
    )
}

export default PackingChecklistPage;