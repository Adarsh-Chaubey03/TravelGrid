import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
// Assuming lucide-react is available for icons
import { Search, Clock, MapPin, Download, Trash2, Plus, Loader2, Sun, Moon } from 'lucide-react';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTheme } from '../context/ThemeContext';
import { jsPDF } from 'jspdf';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Debug: Check if API key is loaded
console.log('Gemini API Key loaded:', import.meta.env.VITE_GEMINI_API_KEY ? 'Yes' : 'No');

// Function to get the list of available models
const getAvailableModels = async () => {
  try {
    const response = await genAI.listModels(); // returns an object with "models"
    
    console.log("Full response:", response);

    if (!response || !response.models) {
      console.warn("No models found in response");
      return ['gemini-1.0-pro']; // fallback
    }

    // Extract the array of models
    const models = response.models;

    // Print all models with details
    console.log("Available Models:", models);

    // Just print model names
    const modelNames = models.map(model => model.name);
    console.log("Model Names:", modelNames);

    return modelNames;

  } catch (error) {
    console.error('Error fetching available models:', error);
    return ['gemini-1.0-pro']; // fallback
  }
};

getAvailableModels();




// Utility function to generate a unique ID for itinerary items
const generateItineraryId = () => `i-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Using the real ThemeContext instead of mock implementation

// --- BANNER COMPONENT (Replaces Header) ---
const Banner = ({ isDarkMode, toggleTheme }) => (
	<div className={`relative w-full overflow-hidden mb-8 shadow-xl ${isDarkMode ? 'dark' : 'light'}`}>
		{/* Background Image */}
		<div
			className="absolute inset-0 bg-cover bg-center"
			style={{
				backgroundImage:
					"url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop')",
			}}
		/>
		{/* Overlay Gradient */}
		<div
			className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ease-in-out ${
				isDarkMode
					? 'from-black/80 via-black/60 to-pink-900/70'
					: 'from-white/20 via-white/10 to-blue-200/40'
			}`}
		/>

		<div className="relative max-w-7xl mx-auto py-14 sm:py-24 px-4">
			{/* Theme Toggle Button positioned top right */}
			<button
				onClick={toggleTheme}
				className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${
					isDarkMode
						? 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
						: 'bg-white hover:bg-gray-100 text-indigo-600 shadow-md'
				}`}
				aria-label={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
			>
				{isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
			</button>

			{/* Content centered in the banner */}
			<div className="w-full text-center">
				<h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
					<span className="text-gray-900 dark:text-gray-100">Build Your </span>
					<span className="text-pink-600 dark:text-pink-400">Custom Itinerary</span>
				</h1>
				<p className="text-base sm:text-xl max-w-3xl mx-auto mb-6 text-white drop-shadow-lg">
					Plan multi-day trips with AI-powered destination search. Drag and drop places, set times, and export to PDF.
				</p>
				<a
					href="#custom-itinerary-builder"
					className="inline-flex items-center px-6 py-3 rounded-full font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-shadow shadow-lg"
				>
					Start Planning
				</a>
			</div>
		</div>
	</div>
);


// Main Application Component
const App = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [daysItinerary, setDaysItinerary] = useState({
    day1: [],
  });
  const [currentDay, setCurrentDay] = useState('day1'); 

  // New states for AI search results and status
  const [aiPlaces, setAiPlaces] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  
  const [message, setMessage] = useState(''); // Status message for PDF export

  // Function to fetch places from the Gemini API using direct generation
  const fetchPlacesFromAI = useCallback(async (query) => {
    if (!query.trim()) {
        setAiPlaces([]);
        setSearchError('');
        return;
    }

    setIsSearching(true);
    setSearchError('');

    const systemPrompt = `You are a world-class travel planning engine. Based on your knowledge, generate 5 to 8 popular tourist attractions, landmarks, or activities related to the query. Return the results STRICTLY as a JSON array. DO NOT include any explanatory text, markdown formatting, or anything outside the JSON block.`;

    const userQuery = `Generate 5 to 8 popular tourist places related to: "${query}". For each place, estimate a typical visit duration in minutes. And find out the start time for visiting that place and end time when the entry closed`;

    const prompt = systemPrompt + "\n\n" + userQuery;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `You are a world-class travel planning engine. Based on your knowledge, generate 5 to 8 popular tourist attractions, landmarks, or activities related to the query. Return the results STRICTLY as a JSON array. DO NOT include any explanatory text, markdown formatting, or anything outside the JSON block.`
        });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            "name": { "type": "string", "description": "The name of the place or attraction." },
                            "city": { "type": "string", "description": "The city or region where the place is located. Use 'N/A' if city cannot be determined." },
                            "duration": { "type": "integer", "description": "Estimated average visit duration in minutes (e.g., 90, 180, 60). Ensure this is a number." },
                            "openingHours": { "type": "string", "description": "Typical opening hours, e.g., '9:00 AM - 6:00 PM'." },
                            "tags": {
                                "type": "array",
                                "description": "2-3 descriptive tags (e.g., historic, museum, nature).",
                                "items": { "type": "string" }
                            }
                        },
                        required: ["name", "city", "duration", "openingHours", "tags"]
                    }
                }
            }
        });

        const response = await result.response;
        const text = response.text();

        let jsonText = text;

        // Defensive JSON parsing: remove ```json and ``` wrappers that the model sometimes includes
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```json\s*|```\s*$/g, '').trim();
        }

        const parsedJson = JSON.parse(jsonText);

        // Validate and assign unique dummy IDs for React rendering
        const structuredPlaces = parsedJson.map((p, index) => ({
            id: `ai-${p.name.replace(/\s/g, '-').toLowerCase()}-${index}`,
            ...p
        })).filter(p => typeof p.duration === 'number' && p.duration > 0); // Basic validation

        setAiPlaces(structuredPlaces);
        if (structuredPlaces.length === 0) {
          setSearchError("AI search returned no relevant places for this query.");
        }

    } catch (error) {
        console.error('Gemini API search failed:', error);
        setSearchError('Error fetching results from AI. Please try a different query.');
        setAiPlaces([]);
    } finally {
        setIsSearching(false);
    }
  }, []); // No dependencies needed

  // Debounce effect for search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
        if (searchTerm.trim()) {
            fetchPlacesFromAI(searchTerm);
        } else {
            setAiPlaces([]); // Clear results if search term is empty
        }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchPlacesFromAI]);

  // 1. Day Management Logic
  const dayIds = useMemo(() => Object.keys(daysItinerary).sort((a, b) => {
    // Custom sort to handle day IDs like day1, day2, etc. numerically
    const numA = parseInt(a.replace('day', ''), 10);
    const numB = parseInt(b.replace('day', ''), 10);
    return numA - numB;
  }), [daysItinerary]);

  const addDay = useCallback(() => {
    // Find the next available day number based on the current keys
    const nextDayNumber = dayIds.length > 0 ? (parseInt(dayIds[dayIds.length - 1].replace('day', ''), 10) + 1) : 1;
    const newDayId = `day${nextDayNumber}`;
    setDaysItinerary(prev => ({ ...prev, [newDayId]: [] }));
    setCurrentDay(newDayId);
  }, [dayIds]);

  const switchDay = useCallback((dayId) => {
    setCurrentDay(dayId);
  }, []);

  // 3. Drag and Drop Handlers (Left Panel)
  const handleDragStart = useCallback((e, place) => {
    e.dataTransfer.setData('application/json', JSON.stringify(place));
    e.dataTransfer.setData('text/plain', place.name);
  }, []);

  // 4. Drag and Drop Handlers (Right Canvas)
  const handleDragOver = (e) => {
    e.preventDefault(); // Essential to allow dropping
    e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-900/20');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-900/20');
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-900/20');

    const placeDataString = e.dataTransfer.getData('application/json');

    if (placeDataString) {
      try {
        const draggedPlace = JSON.parse(placeDataString);
        
        const newItineraryItem = {
          ...draggedPlace,
          itineraryId: generateItineraryId(),
          startTime: '09:00', // Default start time
          endTime: '11:00', // Default end time
        };

        // Add item to the currently active day
        setDaysItinerary(prev => ({
            ...prev,
            [currentDay]: [...prev[currentDay], newItineraryItem],
        }));

      } catch (error) {
        console.error("Error parsing dropped data:", error);
      }
    }
  }, [currentDay]);

  // 5. Itinerary Item Management
  const handleTimeChange = useCallback((itineraryId, field, value) => {
    setDaysItinerary(prevDays => ({
      ...prevDays,
      [currentDay]: prevDays[currentDay].map(item =>
        item.itineraryId === itineraryId ? { ...item, [field]: value } : item
      )
    }));
  }, [currentDay]);

  const handleDeleteItem = useCallback((itineraryId) => {
    setDaysItinerary(prevDays => ({
      ...prevDays,
      [currentDay]: prevDays[currentDay].filter(item => item.itineraryId !== itineraryId)
    }));
  }, [currentDay]);

  // Component for a dropped itinerary item
  const ItineraryItem = ({ item, isDarkMode }) => (
    <div className={`p-4 rounded-xl shadow-lg border-t-4 border-emerald-500 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
        isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
    }`}>
      <div className="flex-grow">
        <h4 className="font-bold text-lg">{item.name}</h4>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.city} &bull; Estimated {Math.ceil(item.duration / 60)}h visit</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Start Time Input */}
        <div className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
          <Clock className="w-4 h-4 text-emerald-600 mr-2" />
          <input
            type="time"
            value={item.startTime}
            onChange={(e) => handleTimeChange(item.itineraryId, 'startTime', e.target.value)}
            className={`bg-transparent font-medium w-24 focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
          />
        </div>

        {/* End Time Input */}
        <div className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
          <Clock className="w-4 h-4 text-red-500 mr-2" />
          <input
            type="time"
            value={item.endTime}
            onChange={(e) => handleTimeChange(item.itineraryId, 'endTime', e.target.value)}
            className={`bg-transparent font-medium w-24 focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
          />
        </div>

        <button
          onClick={() => handleDeleteItem(item.itineraryId)}
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
          aria-label={`Remove ${item.name} from itinerary`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
  
  // Component for a draggable place item
  const PlaceItem = ({ place, isDarkMode }) => (
    <div
      className={`p-3 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-grab border-l-4 border-indigo-400 ${
        isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
      }`}
      draggable
      onDragStart={(e) => handleDragStart(e, place)}
    >
      <h3 className="font-semibold flex items-center">
        <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
        {place.name}
      </h3>
      <p className={`text-sm ml-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{place.city}</p>
      {place.openingHours && (
        <p className={`text-sm ml-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hours: {place.openingHours}</p>
      )}
      <div className="flex flex-wrap gap-1 mt-2 ml-6">
        {place.duration > 0 && (
          <span className="text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded-full">{Math.ceil(place.duration / 60)}h</span>
        )}
        {place.tags && place.tags.map(tag => (
          <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{tag}</span>
        ))}
      </div>
    </div>
  );

  // 6. PDF Export Function (NEW LOGIC - Direct PDF Generation using jspdf)
  const exportToPdf = async () => {
    setMessage('Generating PDF...');

    try {
      // 1. Setup PDF
      const doc = new jsPDF('p', 'mm', 'a4');
      const margin = 14;
      let y = 20;

      // 2. Header
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("Custom Travel Itinerary", margin, y);
      y += 10;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, y);
      y += 10;
      doc.setDrawColor(200);
      doc.line(margin, y, 210 - margin, y); // Draw a line
      y += 5;

      // 3. Day-wise plans
      dayIds.forEach((dayId, dayIndex) => {
        const activities = daysItinerary[dayId];
        
        // Add a new page if remaining space is too small for a full day section
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        // Day Title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(25, 25, 112); // Midnight Blue
        doc.text(`${dayId.charAt(0).toUpperCase() + dayId.slice(1).replace(/(\d+)/, ' $1')}`, margin, y);
        y += 8;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0); // Black

        if (activities.length === 0) {
          doc.text("No activities planned for this day.", margin + 4, y);
          y += 10;
        } else {
          // List activities
          activities.forEach(item => {
            const timeRange = `${item.startTime} - ${item.endTime}`;
            const placeDetails = `${item.name} (${item.city || 'N/A'})`;
            
            doc.text(`${timeRange}: ${placeDetails}`, margin + 4, y);
            y += 6;
          });
          y += 5; // Extra space after activities
        }
        
        // Draw a separator line for the next day, if not the last day
        if (dayIndex < dayIds.length - 1) {
             doc.setDrawColor(220); // Light gray
             doc.line(margin, y, 210 - margin, y); 
             y += 5;
        }

      });

      // 4. Save the PDF
      const firstCity = daysItinerary[dayIds[0]]?.[0]?.city || 'Trip';
      const fileName = `${firstCity}_Itinerary.pdf`;
      doc.save(fileName);

      setMessage('PDF exported successfully! Check your downloads.');
      
      // Clear message after a short delay
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setMessage('Failed to generate PDF. See console for details.');
      setTimeout(() => setMessage(''), 5000);
    }
  };


  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-black to-pink-900 text-white' : 'bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300 text-gray-900'} font-sans`}>
        
        <Banner isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> {/* Use the new Banner */}

        <main id="custom-itinerary-builder" className="flex-grow p-4 sm:p-8 max-w-7xl w-full mx-auto">
          
          {/* PDF Status Message */}
          {message && (
            <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl ${message.includes('Failed') ? 'bg-red-500' : 'bg-green-500'} text-white z-50 transition-opacity duration-300`}>
              {message}
            </div>
          )}

          {/* Main Layout: Sidebar and Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT SIDEBAR: Available Places (AI-Powered) */}
            <div className={`lg:col-span-1 p-6 rounded-2xl shadow-xl h-[80vh] overflow-hidden flex flex-col ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-4 border-b pb-2 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>Search Destinations</h2>
              
              {/* Search Bar */}
              <div className="mb-4 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="e.g., Best museums in London or Tokyo landmarks"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  disabled={isSearching}
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500 animate-spin" />
                )}
              </div>

              {/* Places List (AI Results) */}
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {isSearching && (
                  <p className="text-indigo-400 text-center py-10 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Searching the world for places...
                  </p>
                )}
                
                {searchError && (
                  <div className="bg-red-900/20 text-red-400 p-3 rounded-lg border border-red-700 text-sm">
                    {searchError}
                  </div>
                )}

                {!isSearching && searchTerm.trim() && aiPlaces.length === 0 && !searchError && (
                    <p className={`text-center py-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Type a city or activity above to find places.
                    </p>
                )}

                {!isSearching && aiPlaces.length > 0 && (
                  aiPlaces.map(place => (
                    <PlaceItem key={place.id} place={place} isDarkMode={isDarkMode} />
                  ))
                )}
              </div>
            </div>

            {/* RIGHT CANVAS: Itinerary Builder */}
            <div className="lg:col-span-2 flex flex-col h-full">
              
              {/* Day Tabs and Controls */}
              <div className={`flex justify-between items-end mb-4 border-b pb-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {dayIds.map(dayId => (
                    <button
                      key={dayId}
                      onClick={() => switchDay(dayId)}
                      className={`px-4 py-2 rounded-t-lg font-semibold transition-all text-nowrap
                        ${currentDay === dayId
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      {dayId.charAt(0).toUpperCase() + dayId.slice(1).replace(/(\d+)/, ' $1')}
                    </button>
                  ))}
                  <button
                    onClick={addDay}
                    className="flex items-center px-4 py-2 rounded-lg font-semibold text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-all ml-2 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
                    title="Add New Day"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Day
                  </button>
                </div>

                <button
                  onClick={exportToPdf}
                  disabled={dayIds.every(dayId => daysItinerary[dayId].length === 0)}
                  className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-emerald-700 transition-all"
                  title="Export Full Multi-Day Itinerary to PDF"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export Itinerary
                </button>
              </div>

              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {currentDay.charAt(0).toUpperCase() + currentDay.slice(1).replace(/(\d+)/, ' $1')} Itinerary ({daysItinerary[currentDay]?.length || 0} Stops)
              </h2>


              {/* Drop Zone / Itinerary List for the current day */}
              <div
                className={`flex-grow p-6 rounded-2xl shadow-xl border-4 border-dashed transition-colors duration-200 
                  ${daysItinerary[currentDay]?.length === 0 
                      ? isDarkMode 
                        ? 'border-gray-700 bg-gray-800/50 flex items-center justify-center' 
                        : 'border-gray-300 bg-gray-100 flex items-center justify-center' 
                      : isDarkMode
                        ? 'bg-gray-800 border-transparent'
                        : 'bg-gray-50 border-transparent'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ minHeight: '60vh' }}
              >
                {daysItinerary[currentDay]?.length === 0 ? (
                  <div className={`text-center p-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <MapPin className={`w-10 h-10 mx-auto mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className="text-xl font-medium">Drag places here to plan {currentDay.charAt(0).toUpperCase() + currentDay.slice(1).replace(/(\d+)/, ' $1')}!</p>
                    <p className="mt-1 text-sm">Use the search bar on the left to find destinations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {daysItinerary[currentDay].map(item => (
                      <ItineraryItem key={item.itineraryId} item={item} isDarkMode={isDarkMode} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        
        {/* Removed Footer component call */}

      </div>
  );
};

export default App;
