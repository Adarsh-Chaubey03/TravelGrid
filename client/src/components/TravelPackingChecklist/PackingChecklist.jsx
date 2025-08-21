import React, { useState, useEffect } from "react";
import { Check, Plus, Trash2, Download, FileText, X, FolderPlus, Edit3 } from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTheme } from "../../context/ThemeContext";

const PackingChecklist = () => {
  const { isDarkMode } = useTheme();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [newSection, setNewSection] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editItemName, setEditItemName] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);

  // Enhanced default packing items organized by category with emojis
  const defaultItems = [
    // Travel Essentials
    { id: 1, name: "Passport / ID", category: "🧳 Travel Essentials", packed: false, essential: true },
    { id: 2, name: "Travel tickets (flight, train, etc.)", category: "🧳 Travel Essentials", packed: false, essential: true },
    { id: 3, name: "Wallet with cash and cards", category: "🧳 Travel Essentials", packed: false, essential: true },
    { id: 4, name: "Travel insurance", category: "🧳 Travel Essentials", packed: false, essential: true },
    { id: 5, name: "Copies of important documents", category: "🧳 Travel Essentials", packed: false, essential: true },
    { id: 6, name: "Itinerary / booking confirmations", category: "🧳 Travel Essentials", packed: false, essential: true },
    
    // Clothing
    { id: 7, name: "T-shirts / tops", category: "👕 Clothing", packed: false, essential: true },
    { id: 8, name: "Pants / shorts / skirts", category: "👕 Clothing", packed: false, essential: true },
    { id: 9, name: "Undergarments", category: "👕 Clothing", packed: false, essential: true },
    { id: 10, name: "Socks", category: "👕 Clothing", packed: false, essential: true },
    { id: 11, name: "Sleepwear", category: "👕 Clothing", packed: false, essential: true },
    { id: 12, name: "Light jacket / sweater", category: "👕 Clothing", packed: false, essential: true },
    { id: 13, name: "Comfortable shoes", category: "👕 Clothing", packed: false, essential: true },
    { id: 14, name: "Flip-flops / sandals", category: "👕 Clothing", packed: false, essential: false },
    { id: 15, name: "Swimsuit", category: "👕 Clothing", packed: false, essential: false },
    
    // Toiletries
    { id: 16, name: "Toothbrush & toothpaste", category: "🧼 Toiletries", packed: false, essential: true },
    { id: 17, name: "Hairbrush / comb", category: "🧼 Toiletries", packed: false, essential: true },
    { id: 18, name: "Shampoo & conditioner (travel size)", category: "🧼 Toiletries", packed: false, essential: true },
    { id: 19, name: "Soap / body wash", category: "🧼 Toiletries", packed: false, essential: true },
    { id: 20, name: "Deodorant", category: "🧼 Toiletries", packed: false, essential: true },
    { id: 21, name: "Razor", category: "🧼 Toiletries", packed: false, essential: false },
    { id: 22, name: "Sunscreen", category: "🧼 Toiletries", packed: false, essential: true },
    { id: 23, name: "Moisturizer / lip balm", category: "🧼 Toiletries", packed: false, essential: false },
    { id: 24, name: "Feminine hygiene products", category: "🧼 Toiletries", packed: false, essential: false },
    
    // Health & Safety
    { id: 25, name: "Prescription medications", category: "💊 Health & Safety", packed: false, essential: true },
    { id: 26, name: "Painkillers / allergy meds", category: "💊 Health & Safety", packed: false, essential: false },
    { id: 27, name: "Band-aids / first aid kit", category: "💊 Health & Safety", packed: false, essential: false },
    { id: 28, name: "Hand sanitizer", category: "💊 Health & Safety", packed: false, essential: true },
    { id: 29, name: "Face masks", category: "💊 Health & Safety", packed: false, essential: false },
    { id: 30, name: "Insect repellent", category: "💊 Health & Safety", packed: false, essential: false },
    
    // Electronics
    { id: 31, name: "Mobile phone + charger", category: "📱 Electronics", packed: false, essential: true },
    { id: 32, name: "Power bank", category: "📱 Electronics", packed: false, essential: false },
    { id: 33, name: "Headphones / earbuds", category: "📱 Electronics", packed: false, essential: false },
    { id: 34, name: "Travel adapter (if going abroad)", category: "📱 Electronics", packed: false, essential: false },
    { id: 35, name: "Camera", category: "📱 Electronics", packed: false, essential: false },
    { id: 36, name: "E-reader / book", category: "📱 Electronics", packed: false, essential: false },
    
    // Other Useful Items
    { id: 37, name: "Sunglasses", category: "🎒 Other Useful Items", packed: false, essential: false },
    { id: 38, name: "Hat / cap", category: "🎒 Other Useful Items", packed: false, essential: false },
    { id: 39, name: "Reusable water bottle", category: "🎒 Other Useful Items", packed: false, essential: false },
    { id: 40, name: "Travel pillow", category: "🎒 Other Useful Items", packed: false, essential: false },
    { id: 41, name: "Snacks", category: "🎒 Other Useful Items", packed: false, essential: false },
    { id: 42, name: "Tote bag / foldable shopping bag", category: "🎒 Other Useful Items", packed: false, essential: false },
    { id: 43, name: "Small backpack / day bag", category: "🎒 Other Useful Items", packed: false, essential: false },
    { id: 44, name: "Ziplock bags / packing cubes", category: "🎒 Other Useful Items", packed: false, essential: false },
    { id: 45, name: "Notepad & pen", category: "🎒 Other Useful Items", packed: false, essential: false },
  ];

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('travelPackingList');
    if (savedItems && savedItems !== '[]') {
      // Check if saved items contain default items structure
      const parsedItems = JSON.parse(savedItems);
      const hasDefaultStructure = parsedItems.some(item => 
        item.category.includes('🧳') || item.category.includes('👕') || item.category.includes('🧼')
      );
      
      if (hasDefaultStructure) {
        setItems(parsedItems);
      } else {
        // If no default structure found, always show default items
        setItems(defaultItems);
        localStorage.setItem('travelPackingList', JSON.stringify(defaultItems));
      }
    } else {
      // Always show default items on first visit or empty list
      setItems(defaultItems);
      localStorage.setItem('travelPackingList', JSON.stringify(defaultItems));
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('travelPackingList', JSON.stringify(items));
  }, [items]);

  const toggleItem = (id) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const addItem = () => {
    if (newItem.trim()) {
      const newItemObj = {
        id: Date.now(),
        name: newItem.trim(),
        category: "Custom",
        packed: false,
        essential: false
      };
      setItems(prevItems => [...prevItems, newItemObj]);
      setNewItem("");
      setShowAddForm(false);
    }
  };

  const addSection = () => {
    if (newSection.trim()) {
      const newItemObj = {
        id: Date.now(),
        name: "New item in " + newSection.trim(),
        category: newSection.trim(),
        packed: false,
        essential: false
      };
      setItems(prevItems => [...prevItems, newItemObj]);
      setNewSection("");
      setShowAddSectionForm(false);
    }
  };

  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const startEditingItem = (item) => {
    setEditingItem(item.id);
    setEditItemName(item.name);
  };

  const saveEditItem = () => {
    if (editItemName.trim()) {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === editingItem ? { ...item, name: editItemName.trim() } : item
        )
      );
      setEditingItem(null);
      setEditItemName("");
    }
  };

  const cancelEditItem = () => {
    setEditingItem(null);
    setEditItemName("");
  };

  const resetList = () => {
    setItems(defaultItems);
  };

  const clearAll = () => {
    setItems([]);
  };

  const markAllAsPacked = () => {
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, packed: true }))
    );
  };

  const markAllAsUnpacked = () => {
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, packed: false }))
    );
  };

  // Export functions
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Travel Packing Checklist", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    
    const packedCount = items.filter(item => item.packed).length;
    const totalCount = items.length;
    doc.text(`Progress: ${packedCount}/${totalCount} items packed`, 14, 42);
    
    const tableColumn = ["Category", "Item", "Status", "Essential"];
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
          item.packed ? "✓ Packed" : "○ Not Packed",
          item.essential ? "Yes" : "No"
        ]);
      });
    });
    
    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [244, 63, 94], // Pink color
        textColor: 255,
      },
    });
    
    doc.save("Travel_Packing_Checklist.pdf");
  };

  const exportToExcel = () => {
    const data = items.map(item => ({
      Category: item.category,
      Item: item.name,
      Status: item.packed ? "Packed" : "Not Packed",
      Essential: item.essential ? "Yes" : "No"
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Packing Checklist");
    
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    
    saveAs(blob, "Travel_Packing_Checklist.xlsx");
  };

  const exportToText = () => {
    const packedCount = items.filter(item => item.packed).length;
    const totalCount = items.length;
    
    let textContent = `Travel Packing Checklist\n`;
    textContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
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
      textContent += `${category.toUpperCase()}:\n`;
      categoryItems.forEach(item => {
        const status = item.packed ? "✓" : "○";
        const essential = item.essential ? " (Essential)" : "";
        textContent += `  ${status} ${item.name}${essential}\n`;
      });
      textContent += "\n";
    });
    
    const blob = new Blob([textContent], { type: "text/plain" });
    saveAs(blob, "Travel_Packing_Checklist.txt");
  };

  // Group items by category for display
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const packedCount = items.filter(item => item.packed).length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  // Set default selected section to first category if none selected
  useEffect(() => {
    if (!selectedSection && Object.keys(groupedItems).length > 0) {
      setSelectedSection(Object.keys(groupedItems)[0]);
    }
  }, [groupedItems, selectedSection]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Travel Packing Checklist
        </h1>
        <p className={`text-lg mb-6 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Stay organized and never forget essential items for your trip
        </p>
        
        {/* Overall Progress Bar */}
        <div className={`rounded-full h-4 mb-4 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div 
            className="bg-gradient-to-r from-pink-500 to-pink-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          {packedCount} of {totalCount} items packed ({Math.round(progressPercentage)}%)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Item
        </button>
        
        <button
          onClick={() => setShowAddSectionForm(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FolderPlus size={20} />
          Add Section
        </button>
        
        <button
          onClick={markAllAsPacked}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Check size={20} />
          Mark All Packed
        </button>
        
        <button
          onClick={markAllAsUnpacked}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <X size={20} />
          Mark All Unpacked
        </button>
        
        <button
          onClick={resetList}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reset to Default
        </button>
        
        <button
          onClick={clearAll}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Trash2 size={20} />
          Clear All
        </button>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={20} />
          Export PDF
        </button>
        
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={20} />
          Export Excel
        </button>
        
        <button
          onClick={exportToText}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FileText size={20} />
          Export Text
        </button>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className={`rounded-lg p-6 mb-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Add New Item</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter item name..."
              className={`flex-1 px-4 py-2 rounded-lg border focus:border-pink-500 focus:outline-none ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
            />
            <button
              onClick={addItem}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className={`px-6 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Section Form */}
      {showAddSectionForm && (
        <div className={`rounded-lg p-6 mb-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Add New Section</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="Enter section name (e.g., 🎵 Music Gear)"
              className={`flex-1 px-4 py-2 rounded-lg border focus:border-indigo-500 focus:outline-none ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && addSection()}
            />
            <button
              onClick={addSection}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Section
            </button>
            <button
              onClick={() => setShowAddSectionForm(false)}
              className={`px-6 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex gap-6">
        {/* Left Sidebar - Sections */}
        <div className="w-80 flex-shrink-0">
          <div className={`rounded-lg p-4 border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Sections</h3>
            <div className="space-y-2">
              {Object.entries(groupedItems).map(([category, categoryItems]) => {
                const categoryPackedCount = categoryItems.filter(item => item.packed).length;
                const categoryProgressPercentage = categoryItems.length > 0 ? (categoryPackedCount / categoryItems.length) * 100 : 0;
                const isSelected = selectedSection === category;
                
                return (
                  <div
                    key={category}
                    onClick={() => setSelectedSection(category)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-pink-600 text-white' 
                        : isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{category}</span>
                      <span className="text-sm">
                        {categoryPackedCount}/{categoryItems.length}
                      </span>
                    </div>
                    <div className={`rounded-full h-2 ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isSelected ? 'bg-white' : 'bg-blue-500'
                        }`}
                        style={{ width: `${categoryProgressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content - Checklist Items */}
        <div className="flex-1">
          {selectedSection && groupedItems[selectedSection] ? (
            <div className={`rounded-lg p-6 border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold flex items-center gap-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedSection}
                  <span className={`text-lg ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    ({groupedItems[selectedSection].filter(item => item.packed).length}/{groupedItems[selectedSection].length})
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {Math.round((groupedItems[selectedSection].filter(item => item.packed).length / groupedItems[selectedSection].length) * 100)}%
                  </span>
                </div>
              </div>
              
              {/* Section Progress Bar */}
              <div className={`rounded-full h-4 mb-6 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(groupedItems[selectedSection].filter(item => item.packed).length / groupedItems[selectedSection].length) * 100}%` }}
                ></div>
              </div>
              
              <div className="grid gap-3">
                {groupedItems[selectedSection].map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                      item.packed 
                        ? isDarkMode 
                          ? 'bg-green-900/30 border border-green-500/30'
                          : 'bg-green-50 border border-green-200'
                        : isDarkMode 
                          ? 'bg-gray-700/50 border border-gray-600/30'
                          : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        item.packed
                          ? 'bg-green-500 border-green-500 text-white'
                          : isDarkMode 
                            ? 'border-gray-400 hover:border-pink-500'
                            : 'border-gray-300 hover:border-pink-500'
                      }`}
                    >
                      {item.packed && <Check size={16} />}
                    </button>
                    
                    {editingItem === item.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editItemName}
                          onChange={(e) => setEditItemName(e.target.value)}
                          className={`flex-1 px-3 py-2 rounded border focus:border-pink-500 focus:outline-none ${
                            isDarkMode 
                              ? 'bg-gray-600 text-white border-gray-500' 
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}
                          onKeyPress={(e) => e.key === 'Enter' && saveEditItem()}
                          autoFocus
                        />
                        <button
                          onClick={saveEditItem}
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEditItem}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className={`flex-1 text-lg ${
                        item.packed 
                          ? 'line-through text-gray-400' 
                          : isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </span>
                    )}
                    
                    {item.essential && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                        Essential
                      </span>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditingItem(item)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit item"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`rounded-lg p-6 border text-center ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`text-6xl mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-300'
              }`}>📦</div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>No section selected</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Select a section from the sidebar to view items</p>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className={`text-6xl mb-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-300'
          }`}>📦</div>
          <h3 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>No items in your checklist</h3>
          <p className={`mb-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Add some items to get started with your packing!</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Add Your First Item
            </button>
            <button
              onClick={() => setShowAddSectionForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Create Custom Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackingChecklist; 