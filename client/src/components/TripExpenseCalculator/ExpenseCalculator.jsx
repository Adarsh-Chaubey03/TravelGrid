import React, { useCallback, useMemo, useState } from "react";
import ExpenseInputRow from "./ExpenseInputRow";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTheme } from "../../context/ThemeContext";
import ExpenseChart from "./ExpenseChart";

const TripExpenseCalculator = () => {
    console.log("trip expense calculater re-render")
    const { isDarkMode } = useTheme();
    const [expense, setExpense] = useState({
        transport: "",
        accommodation: "",
        food: "",
        activities: "",
        localTransport: "",
        miscellaneous: "",
    });

    const [mode, setMode] = useState("Individual");
    const [numPeople, setNumPeople] = useState(1);
    const [height, setheight] = useState(false);

    const handleChange = useCallback((category, value) => {
        setExpense((prev) => ({
            ...prev,
            [category]: value,
        }));
        setheight(true);
    },[]);

    // memoized with useMemo hook
    const total = useMemo(() => Object.values(expense).reduce(
        (sum, val) => sum + Number(val || 0),
        0
    ),[expense]);

    const displayedTotal = useMemo(() =>
        mode === "Group" ? total / Math.max(numPeople, 1) : total, [mode,total, numPeople]);

    const chartData = useMemo(() =>
        Object.entries(expense)
            .filter(([, value]) => Number(value) > 0)
            .map(([category, value]) => ({
                name: category.charAt(0).toUpperCase() + category.slice(1),
                value: Number(value),
            })),
        [expense]
    );

    const COLORS = ['#f43f5e', '#fb7185', '#EC4899', '#8B5CF6', '#F472B6', '#EF4444'];

    // ----------- PDF Export -------------
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Trip Expense Report", 14, 22);

        const tableColumn = ["Category", "Amount (₹)"];
        const tableRows = [];

        Object.entries(expense).forEach(([key, val]) => {
            if (Number(val) > 0) {
                tableRows.push([
                    key.charAt(0).toUpperCase() + key.slice(1),
                    Number(val).toFixed(2),
                ]);
            }
        });

        tableRows.push([
            mode === "Group" ? "Total (Per Person)" : "Total",
            displayedTotal.toFixed(2),
        ]);

        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
            body: tableRows,
        });

        doc.save("Trip_Expense_Report.pdf");
    };

    // ----------- Excel Export -------------
    const handleDownloadExcel = () => {
        const data = Object.entries(expense)
            .filter(([, val]) => Number(val) > 0)
            .map(([key, val]) => ({
                Category: key.charAt(0).toUpperCase() + key.slice(1),
                Amount: Number(val),
            }));

        data.push({
            Category: mode === "Group" ? "Total (Per Person)" : "Total",
            Amount: displayedTotal,
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(fileData, "Trip_Expense_Report.xlsx");
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-8">
            <div className={`mt-16 backdrop-blur-md rounded-2xl p-8 border max-w-xl w-full mx-4 transition-all duration-300 ${isDarkMode
                    ? 'border-pink-500 bg-gray-200/10 shadow-lg  backdrop-blur-md hover:shadow-pink-500/20 hover:bg-gray-200/15 text-white'
                    : 'bg-white border-gray-300 shadow-pink-500/20 text-gray-900'
                }`}>
                <h2 className={`text-3xl md:text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode
                        ? 'from-pink-400 to-rose-400'
                        : 'from-pink-600 to-rose-600'
                    }`}>
                    Trip Expense Calculator
                </h2>

                <div className="flex justify-center mb-6">
                    <div className={`inline-flex rounded-full p-1 ${isDarkMode ? 'bg-gray-200 border-none' : 'bg-pink-50 border border-pink-500'
                        }`}>
                        {["Individual", "Group"].map((option) => (
                            <button
                                key={option}
                                onClick={() => setMode(option)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${mode === option
                                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                                        : "text-pink-700"
                                    }`}
                            >
                                {option === "Individual" ? "Individual" : "Group"}
                            </button>
                        ))}
                    </div>
                </div>

                {Object.keys(expense).map((category) => (
                    <ExpenseInputRow
                        key={category}
                        label={category}
                        value={expense[category]}
                        onChange={(val) => handleChange(category, val)}
                        isDarkMode={isDarkMode}
                    />
                ))}

                {mode === "Group" && (
                    <div className="flex items-center gap-4 mt-6">
                        <label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'
                            }`}>
                            Number of People:
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={numPeople}
                            onChange={(e) => setNumPeople(Number(e.target.value))}
                            className={`w-28 pl-4 pr-2 py-2 rounded-lg focus:ring-2 outline-none transition-all duration-300 backdrop-blur-lg border ${isDarkMode
                                    ? 'border-white/30 focus:border-pink-400 focus:ring-pink-400 bg-white/10 text-white'
                                    : 'border-black/20  focus:ring-pink-500 bg-black/10  text-gray-900'
                                }`}
                        />
                    </div>
                )}

                <div className="mt-8 text-center">
                    <p className="text-lg font-semibold text-gray-700">
                        Total Cost:
                        <span className="ml-2 text-pink-500">
                            ₹{displayedTotal.toFixed(2)}
                        </span>
                        <span className={`ml-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            ({mode === "Group" ? "Per Person" : "Individual Total"})
                        </span>
                    </p>
                </div>

                {/* Download Buttons */}
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 cursor-pointer transition"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className={`font-semibold px-4 py-2 rounded-lg text-pink-600 transition cursor-pointer ${isDarkMode
                                ? 'bg-pink-100  hover:bg-pink-200'
                                : 'bg-gray-200  hover:bg-pink-100'
                            }`}
                    >
                        Download Excel
                    </button>
                </div>

                <div className={`mt-8 p-8 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'
                    }`}>
                    <ExpenseChart chartData={chartData} isDarkMode={isDarkMode} />

                </div>
            </div>
        </div>
    );
};

export default TripExpenseCalculator;
