import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDashboardData } from '../context/DashboardDataContext';

// 🔧 PERFORMANCE FIX: Move static data outside component to maintain stable reference
// This array is defined outside the component scope because:
// 1. It prevents recreation of the array on every render (memory optimization)
// 2. The array reference remains constant across all renders (referential equality)
// 3. It's static data that never changes, so it doesn't need to be inside component
// 4. Prevents unnecessary useEffect re-executions that would occur if array was recreated each render
const VISITED_COUNTRIES = [
    "France",
    "Japan",
    "Italy",
    "Germany",
    "Spain",
    "Thailand",
    "India",
];

const CountriesVisited = () => {
    // Hook to programmatically navigate between routes
    const navigate = useNavigate();
    
    // Extract setCountryCount function from context to update the global country count state
    // This will be used to sync the visited countries count with the dashboard
    const { setCountryCount } = useDashboardData();

    // 🎯 OPTIMIZED useEffect: Runs only once on component mount
    // Effect runs when:
    // - Component mounts (initial render) - guaranteed to run once
    // - setCountryCount reference changes (only if context provider re-creates it)
    // 
    // Why VISITED_COUNTRIES is NOT in dependency array:
    // - It's a constant defined outside component (stable reference, never changes)
    // - Including it would be redundant and violate React best practices
    // - React ESLint rule allows omitting stable references from dependencies
    // 
    // Performance benefit:
    // - Before fix: useEffect ran on EVERY render (O(n) renders = O(n) executions)
    // - After fix: useEffect runs only ONCE on mount (O(1) execution)
    useEffect(() => {
        // Update the dashboard context with the total count of visited countries
        // This allows the Dashboard component to display accurate statistics
        setCountryCount(VISITED_COUNTRIES.length);
    }, [setCountryCount]); // Only depends on setCountryCount (which should be memoized in context)

    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-pink-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Visited Countries</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* Scrollable list */}
                {/* 
                    Render list of visited countries with custom scrollbar styling
                    - max-h-[350px]: Limits height to 350px to make content scrollable
                    - overflow-y-auto: Enables vertical scrolling when content exceeds max height
                    - pr-2: Padding right to prevent scrollbar from overlapping content
                    - space-y-4: Adds consistent vertical spacing between country cards
                */}
                <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4 custom-scroll">
                    {/* 
                        Map over VISITED_COUNTRIES array to render each country as a card
                        Using the constant VISITED_COUNTRIES (now uppercase) instead of local variable
                    */}
                    {VISITED_COUNTRIES.map((country, index) => (
                        <div
                            key={index} // Using index as key (safe here as list is static and won't reorder)
                            className="bg-white/5 p-4 rounded-lg flex items-center justify-between hover:bg-white/10 transition"
                        >
                            {/* Display country name */}
                            <h3 className="text-white font-medium text-lg">{country}</h3>
                            
                            {/* Status badge indicating the country has been visited/completed */}
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                Completed
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CountriesVisited;






