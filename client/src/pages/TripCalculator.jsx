import TripExpenseCalculator from "..//components/TripExpenseCalculator/ExpenseCalculator";
import React from "react";
import { useTheme } from "../context/ThemeContext";

const TripCalculatorPage = () => {
    const { isDarkMode } = useTheme();
    
    return (
        <div className={`mx-auto p-4 min-h-screen w-full overflow-x-hidden transition-all duration-300`}>
            <TripExpenseCalculator/>
        </div>
    )
}

export default TripCalculatorPage;