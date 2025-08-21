import React, { useState } from "react";
import ExpenseInputRow from "./ExpenseInputRow";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTheme } from "../../context/ThemeContext";

const TripExpenseCalculator = () => {
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

    const handleChange = (category, value) => {
        setExpense((prev) => ({
            ...prev,
            [category]: value,
        }));
        setheight(true);
    };

    const total = Object.values(expense).reduce(
        (sum, val) => sum + Number(val || 0),
        0
    );

    const displayedTotal =
        mode === "group" ? total / Math.max(numPeople, 1) : total;

    const chartData = Object.entries(expense)
        .filter(([ , value]) => Number(value) > 0)
        .map(([category, value]) => ({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            value: Number(value),
        }));

    const COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#fecdd4', '#fbcfe8', '#f9a8d4'];

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
    mode === "group" ? "Total (Per Person)" : "Total",
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
            Category: mode === "group" ? "Total (Per Person)" : "Total",
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
            <div className={`backdrop-blur-md rounded-2xl p-8 border max-w-xl w-full mx-4 shadow-[0_0_15px_5px] transition-all duration-300 ${
                isDarkMode 
                    ? 'bg-gradient-to-b from-black to-[#621639] border-white/20 shadow-[#621639] text-white' 
                    : 'bg-white border-pink-200 shadow-pink-500/20 text-gray-900'
            }`}>
                <h2 className={`text-3xl md:text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r ${
                    isDarkMode 
                        ? 'from-[#501834] to-[#945072]' 
                        : 'from-pink-600 to-rose-600'
                }`}>
                    Trip Expense Calculator
                </h2>

                <div className="flex justify-center mb-6">
                    <div className={`inline-flex rounded-full p-1 ${
                        isDarkMode ? 'bg-pink-100' : 'bg-pink-50'
                    }`}>
                        {["Individual", "group"].map((option) => (
                            <button
                                key={option}
                                onClick={() => setMode(option)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    mode === option
                                        ? "bg-gradient-to-r from-[#501834] to-rose-500 text-white shadow-md"
                                        : isDarkMode ? "text-pink-600" : "text-pink-700"
                                }`}
                            >
                                {option === "Individual" ? "Individual" : "group"}
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

                {mode === "group" && (
                    <div className="flex items-center gap-4 mt-6">
                        <label className={`text-sm font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-700'
                        }`}>
                            Number of People:
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={numPeople}
                            onChange={(e) => setNumPeople(Number(e.target.value))}
                            className={`w-24 px-4 py-2 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-300 ${
                                isDarkMode 
                                    ? 'border-pink-200 focus:border-pink-400 focus:ring-pink-100 bg-gray-700 text-white' 
                                    : 'border-pink-200 focus:border-pink-400 focus:ring-pink-100 bg-white text-gray-900'
                            }`}
                        />
                    </div>
                )}

                <div className="mt-8 text-center">
                    <p className="text-lg font-semibold">
                        Total Cost:
                        <span className="ml-2 text-pink-600">
                            ₹{displayedTotal.toFixed(2)}
                        </span>
                        <span className={`ml-1 text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            ({mode === "group" ? "Per Person" : "Individual Total"})
                        </span>
                    </p>
                </div>

                {/* Download Buttons */}
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className={`font-semibold px-4 py-2 rounded-xl transition ${
                            isDarkMode 
                                ? 'bg-pink-100 text-pink-700 hover:bg-pink-200' 
                                : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                        }`}
                    >
                        Download Excel
                    </button>
                </div>

                <div className={`mt-8 p-8 rounded-xl ${
                    isDarkMode ? 'bg-gray-800/50' : 'bg-pink-50/50'
                }`}>
                    <h3 className={`text-2xl font-bold text-center mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Expense Breakdown</h3>
                    <ResponsiveContainer width="100%" height={height ? 450 : 0}>
                        <PieChart margin={{ top: 30, bottom: 60 }}>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"  
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                                className="mt-10"
                            >  
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip/>
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" />             
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TripExpenseCalculator;
