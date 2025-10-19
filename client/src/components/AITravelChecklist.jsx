import React, { useState, useEffect } from "react";
import { 
  Check, 
  Plus, 
  Trash2, 
  Download, 
  FileText, 
  X, 
  Sparkles,
  MapPin,
  Calendar,
  Sun,
  Wind,
  Umbrella,
  Loader2
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const AITravelChecklist = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  
  // Form state
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activities, setActivities] = useState([]);
  const [customActivity, setCustomActivity] = useState("");
  const [weatherInfo, setWeatherInfo] = useState("");
  const [specialConsiderations, setSpecialConsiderations] = useState([]);
  const [customConsideration, setCustomConsideration] = useState("");
  
  // Checklist state
  const [checklist, setChecklist] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // UI state
  const [showForm, setShowForm] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Predefined activities
  const predefinedActivities = [
    "Sightseeing", "Hiking", "Beach", "Shopping", "Business Meetings", 
    "Adventure Sports", "Cultural Experiences", "Food Exploration", 
    "Relaxation", "Nightlife"
  ];
  
  // Predefined considerations
  const predefinedConsiderations = [
    "Family Travel", "Senior Travel", "Medical Needs", "Pet Travel", 
    "Photography", "Business Travel", "Budget Travel", "Luxury Travel"
  ];

  // Toggle activity selection
  const toggleActivity = (activity) => {
    if (activities.includes(activity)) {
      setActivities(activities.filter(a => a !== activity));
    } else {
      setActivities([...activities, activity]);
    }
  };

  // Add custom activity
  const addCustomActivity = () => {
    if (customActivity.trim() && !activities.includes(customActivity.trim())) {
      setActivities([...activities, customActivity.trim()]);
      setCustomActivity("");
    }
  };

  // Remove activity
  const removeActivity = (activity) => {
    setActivities(activities.filter(a => a !== activity));
  };

  // Toggle consideration selection
  const toggleConsideration = (consideration) => {
    if (specialConsiderations.includes(consideration)) {
      setSpecialConsiderations(specialConsiderations.filter(c => c !== consideration));
    } else {
      setSpecialConsiderations([...specialConsiderations, consideration]);
    }
  };

  // Add custom consideration
  const addCustomConsideration = () => {
    if (customConsideration.trim() && !specialConsiderations.includes(customConsideration.trim())) {
      setSpecialConsiderations([...specialConsiderations, customConsideration.trim()]);
      setCustomConsideration("");
    }
  };

  // Remove consideration
  const removeConsideration = (consideration) => {
    setSpecialConsiderations(specialConsiderations.filter(c => c !== consideration));
  };

  // Parse checklist text into structured items
  const parseChecklist = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const parsedItems = [];
    let currentCategory = '';
    
    lines.forEach(line => {
      // Check if line is a category header (starts with number followed by period)
      if (/^\d+\.\s/.test(line)) {
        currentCategory = line.replace(/^\d+\.\s/, '').trim();
      } 
      // Check if line is a checklist item (starts with - or •)
      else if (/^[\-\••]\s/.test(line)) {
        const itemName = line.replace(/^[\-\••]\s/, '').trim();
        parsedItems.push({
          id: Date.now() + Math.random(),
          name: itemName,
          category: currentCategory,
          packed: false
        });
      }
      // Check if line contains checkbox pattern
      else if (/\[.\]/.test(line) || /✓|○/.test(line)) {
        const itemName = line.replace(/\[.\]/, '').replace(/✓|○/, '').trim();
        parsedItems.push({
          id: Date.now() + Math.random(),
          name: itemName,
          category: currentCategory,
          packed: false
        });
      }
    });
    
    return parsedItems;
  };

  // Generate AI-powered checklist
  const generateChecklist = async () => {
    if (!destination) {
      setError("Please enter a destination");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/checklist/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          activities,
          userId: isAuthenticated ? user._id : null,
          weatherInfo,
          specialConsiderations
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setChecklist(data.checklist);
        setItems(parseChecklist(data.checklist));
        setShowForm(false);
        setSuccess("Checklist generated successfully!");
      } else {
        setError(data.message || "Failed to generate checklist");
      }
    } catch (err) {
      console.error("Error generating checklist:", err);
      setError("Failed to generate checklist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle item packed status
  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  // Remove item
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Add custom item
  const addCustomItem = () => {
    const customItem = prompt("Enter custom item:");
    if (customItem) {
      setItems([...items, {
        id: Date.now() + Math.random(),
        name: customItem,
        category: "Custom",
        packed: false
      }]);
    }
  };

  // Export functions
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text("AI-Powered Travel Checklist", 14, 22);
    
    // Trip details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Destination: ${destination}`, 14, 35);
    if (startDate && endDate) {
      doc.text(`Dates: ${startDate} to ${endDate}`, 14, 42);
    }
    
    // Progress
    const packedCount = items.filter(item => item.packed).length;
    const totalCount = items.length;
    doc.text(`Progress: ${packedCount}/${totalCount} items packed`, 14, 49);
    
    // Checklist items
    const tableColumn = ["Category", "Item", "Status"];
    const tableRows = [];
    
    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    
    Object.entries(groupedItems).forEach(([category, categoryItems]) => {
      categoryItems.forEach((item, index) => {
        tableRows.push([
          index === 0 ? category : "",
          item.name,
          item.packed ? "✓ Packed" : "○ Not Packed"
        ]);
      });
    });
    
    autoTable(doc, {
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [220, 38, 38], // Red-600
        textColor: 255
      }
    });
    
    doc.save(`Travel_Checklist_${destination.replace(/\s+/g, '_')}.pdf`);
    setShowExportMenu(false);
  };

  const exportToExcel = () => {
    const data = items.map(item => ({
      Category: item.category,
      Item: item.name,
      Status: item.packed ? "Packed" : "Not Packed"
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Travel Checklist");
    
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
    
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    
    saveAs(blob, `Travel_Checklist_${destination.replace(/\s+/g, '_')}.xlsx`);
    setShowExportMenu(false);
  };

  const exportToText = () => {
    const packedCount = items.filter(item => item.packed).length;
    const totalCount = items.length;
    
    let textContent = `AI-Powered Travel Checklist\n`;
    textContent += `Destination: ${destination}\n`;
    if (startDate && endDate) {
      textContent += `Dates: ${startDate} to ${endDate}\n`;
    }
    textContent += `Progress: ${packedCount}/${totalCount} items packed\n\n`;
    
    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    
    Object.entries(groupedItems).forEach(([category, categoryItems]) => {
      textContent += `${category}:\n`;
      categoryItems.forEach(item => {
        const status = item.packed ? "✓" : "○";
        textContent += `  ${status} ${item.name}\n`;
      });
      textContent += "\n";
    });
    
    const blob = new Blob([textContent], { type: "text/plain" });
    saveAs(blob, `Travel_Checklist_${destination.replace(/\s+/g, '_')}.txt`);
    setShowExportMenu(false);
  };

  // Reset form
  const resetForm = () => {
    setDestination("");
    setStartDate("");
    setEndDate("");
    setActivities([]);
    setCustomActivity("");
    setWeatherInfo("");
    setSpecialConsiderations([]);
    setCustomConsideration("");
    setChecklist("");
    setItems([]);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Calculate progress
  const packedCount = items.filter(item => item.packed).length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  // Group items by category for display
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            AI-Powered Travel Checklist
          </h1>
        </div>
        <p className={`text-base md:text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Get a personalized packing list generated by AI based on your travel details
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-100 border border-green-200 text-green-800">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-200 text-red-800">
          {error}
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className={`rounded-xl p-6 mb-8 shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"}`}>
          <h2 className={`text-xl md:text-2xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Travel Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Destination */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <MapPin className="inline w-4 h-4 mr-1" />
                Destination *
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where are you traveling to?"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>
            
            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${
                    isDarkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <Calendar className="inline w-4 h-4 mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${
                    isDarkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>
          </div>
          
          {/* Weather Info */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              <Sun className="inline w-4 h-4 mr-1" />
              Weather Information
            </label>
            <input
              type="text"
              value={weatherInfo}
              onChange={(e) => setWeatherInfo(e.target.value)}
              placeholder="e.g., Warm and sunny, Cold with snow, etc."
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${
                isDarkMode 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
          
          {/* Activities */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              <Umbrella className="inline w-4 h-4 mr-1" />
              Planned Activities
            </label>
            
            {/* Predefined activities */}
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedActivities.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => toggleActivity(activity)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                    activities.includes(activity)
                      ? "bg-pink-500 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
            
            {/* Custom activity input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                placeholder="Add custom activity"
                className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                onKeyPress={(e) => e.key === 'Enter' && addCustomActivity()}
              />
              <button
                type="button"
                onClick={addCustomActivity}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Selected activities */}
            {activities.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activities.map((activity) => (
                  <div
                    key={activity}
                    className="flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                  >
                    {activity}
                    <button
                      type="button"
                      onClick={() => removeActivity(activity)}
                      className="ml-1 hover:text-pink-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Special Considerations */}
          <div className="mb-8">
            <label className={`block text-sm font-medium mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              <Wind className="inline w-4 h-4 mr-1" />
              Special Considerations
            </label>
            
            {/* Predefined considerations */}
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedConsiderations.map((consideration) => (
                <button
                  key={consideration}
                  type="button"
                  onClick={() => toggleConsideration(consideration)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                    specialConsiderations.includes(consideration)
                      ? "bg-indigo-500 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {consideration}
                </button>
              ))}
            </div>
            
            {/* Custom consideration input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customConsideration}
                onChange={(e) => setCustomConsideration(e.target.value)}
                placeholder="Add special consideration"
                className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                onKeyPress={(e) => e.key === 'Enter' && addCustomConsideration()}
              />
              <button
                type="button"
                onClick={addCustomConsideration}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Selected considerations */}
            {specialConsiderations.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {specialConsiderations.map((consideration) => (
                  <div
                    key={consideration}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {consideration}
                    <button
                      type="button"
                      onClick={() => removeConsideration(consideration)}
                      className="ml-1 hover:text-indigo-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateChecklist}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-700 transition disabled:opacity-70 flex items-center justify-center mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Checklist...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Checklist
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Checklist Display */}
      {!showForm && (
        <>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                Packing Progress
              </span>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                {packedCount} of {totalCount} items ({Math.round(progressPercentage)}%)
              </span>
            </div>
            <div className={`rounded-full h-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <button
              onClick={addCustomItem}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add Custom Item
            </button>
            
            <button
              onClick={() => {
                setItems(items.map(item => ({ ...item, packed: true })));
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Check className="w-4 h-4" />
              Mark All Packed
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              
              {showExportMenu && (
                <div className={`absolute top-full mt-2 right-0 rounded-lg border shadow-lg z-10 min-w-[180px] ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}>
                  <button
                    onClick={exportToPDF}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-opacity-50 transition ${
                      isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Export as PDF
                  </button>
                  
                  <button
                    onClick={exportToExcel}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-opacity-50 transition ${
                      isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Export as Excel
                  </button>
                  
                  <button
                    onClick={exportToText}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-opacity-50 transition ${
                      isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Export as Text
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
            >
              <X className="w-4 h-4" />
              New Checklist
            </button>
          </div>
          
          {/* Checklist Items */}
          <div className={`rounded-xl p-6 shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"}`}>
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b ${isDarkMode ? "text-white border-gray-700" : "text-gray-900 border-gray-200"}`}>
                  {category}
                </h3>
                
                <div className="space-y-3">
                  {categoryItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg transition ${
                        isDarkMode 
                          ? item.packed 
                            ? "bg-green-900/20 border border-green-800/30" 
                            : "bg-gray-700/50 border border-gray-600"
                          : item.packed 
                            ? "bg-green-50 border border-green-200" 
                            : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                          item.packed
                            ? "bg-green-500 border-green-500"
                            : isDarkMode
                            ? "border-gray-500"
                            : "border-gray-300"
                        }`}
                      >
                        {item.packed && <Check className="w-4 h-4 text-white" />}
                      </button>
                      
                      <span 
                        className={`flex-1 ${item.packed ? (isDarkMode ? "text-gray-400 line-through" : "text-gray-500 line-through") : (isDarkMode ? "text-gray-200" : "text-gray-800")}`}
                      >
                        {item.name}
                      </span>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className={`p-1 rounded-full hover:bg-opacity-20 transition ${
                          isDarkMode 
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-600" 
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AITravelChecklist;