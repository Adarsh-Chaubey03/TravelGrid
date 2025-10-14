import React, { useState } from "react";
import { Calendar, MapPin, Clock, Download, Map, Star } from "lucide-react";
import Navbar from "../components/Custom/Navbar";
import { useNavigate } from "react-router-dom";
import { generateTravelPlanPDF } from "../utils/pdfGenerator";
import { fastTravelPlanner } from "../utils/fastTravelPlanner";
import { useTheme } from "../context/ThemeContext";
import { config } from "../config";
import WeatherSection from "../Weather/WeatherSection";

const TravelPlanGenerator = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: "",
    destination: "",
    numberOfDays: 3,
    startDate: "",
    interests: [],
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateError, setDateError] = useState("");

  const travelInterests = [
    { id: "nature", label: "Nature", icon: "🌲" },
    { id: "adventure", label: "Adventure", icon: "🏔️" },
    { id: "museums", label: "Museums", icon: "🏛️" },
    { id: "beaches", label: "Beaches", icon: "🏖️" },
    { id: "shopping", label: "Shopping", icon: "🛍️" },
    { id: "food", label: "Food", icon: "🍽️" },
    { id: "culture", label: "Culture", icon: "🎭" },
    { id: "nightlife", label: "Nightlife", icon: "🌃" },
    { id: "relaxation", label: "Relaxation", icon: "🧘" },
    { id: "photography", label: "Photography", icon: "📸" },
  ];

  // Country-based destination structure
  const destinationsByCountry = {
    France: ["Paris", "Lyon", "Nice", "Marseille", "Bordeaux"],
    "United Kingdom": [
      "London",
      "Edinburgh",
      "Manchester",
      "Liverpool",
      "Birmingham",
    ],
    Indonesia: ["Bali", "Jakarta", "Yogyakarta", "Surabaya", "Bandung"],
    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon"],
    "United Arab Emirates": [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Ajman",
      "Ras Al Khaimah",
    ],
    Qatar: ["Doha"],
    Turkey: ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa"],
    "United States": [
      "New York",
      "Los Angeles",
      "Chicago",
      "Miami",
      "San Francisco",
    ],
    Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    India: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"],
    Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  };

  const countries = Object.keys(destinationsByCountry);

  // Get today's date in YYYY-MM-DD format for the min attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInterestChange = (interestId) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleCountryChange = (country) => {
    setFormData((prev) => ({
      ...prev,
      country: country,
      destination: "", // Reset destination when country changes
    }));
  };

  const handleDestinationChange = (destination) => {
    setFormData((prev) => ({
      ...prev,
      destination: destination,
    }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date(getTodayDate());
    const inputDate = new Date(selectedDate);

    if (selectedDate && inputDate < today) {
      setDateError("Please select today's date or a future date");
      setFormData((prev) => ({ ...prev, startDate: "" }));
    } else {
      setDateError("");
      setFormData((prev) => ({ ...prev, startDate: selectedDate }));
    }
  };

  const generateTravelPlan = () => {
    if (
      !formData.country ||
      !formData.destination ||
      formData.interests.length === 0
    ) {
      alert("Please select a country, destination, and at least one interest");
      return;
    }

    if (formData.startDate && dateError) {
      alert("Please fix the date error before generating the plan");
      return;
    }

    setIsGenerating(true);

    // Performance test for demonstration
    fastTravelPlanner.performanceTest();

    const plan = createTravelPlan(formData);
    setGeneratedPlan(plan);

    // Save to DB
    const tripData = {
      country: formData.country,
      destination: formData.destination,
      numberOfDays: formData.numberOfDays,
      startDate: formData.startDate,
      interests: formData.interests,
      plan,
    };

    saveTripToDatabase(tripData); // POST trip to backend
    setIsGenerating(false);
  };

  const createTravelPlan = (data) => {
    const { destination, numberOfDays, startDate, interests } = data;

    // Use AI-powered travel planner to generate intelligent plan
    return fastTravelPlanner.generateTravelPlan(
      destination,
      numberOfDays,
      interests,
      startDate
    );
  };

  const saveTripToDatabase = async (tripData) => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔐 Send cookies
        body: JSON.stringify(tripData),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ Trip saved:", data);
      } else {
        console.error("❌ Save failed:", data.message);
      }
    } catch (error) {
      console.error("🚨 Error saving trip:", error);
    }
  };

  const downloadPDF = () => {
    generateTravelPlanPDF(generatedPlan);
  };

  return (
    <div className={`flex flex-col min-h-screen w-full overflow-x-hidden`}>
      <Navbar />
      <main className="flex flex-col flex-1 w-full items-center pt-24">
        <section className="w-full py-12 text-center px-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 mt-6 ${isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
            Create Your <span className="text-pink-400">Travel Plan</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-4 ${isDarkMode ? 'text-pink-200' : 'text-gray-700'
            }`}>
            Generate personalized day-by-day travel itineraries based on your
            preferences.
          </p>
          <p className={`text-sm max-w-2xl mx-auto ${isDarkMode ? 'text-pink-300' : 'text-gray-600'
            }`}>
            ⚡ Select your country and city for ultra-fast instant travel
            planning!
          </p>
        </section>

        <div className="max-w-6xl w-full px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className={`backdrop-blur-sm border rounded-2xl p-8 ${isDarkMode
                ? 'bg-white/5 border-pink-400/20'
                : 'bg-white/80 border-pink-200 shadow-lg'
              }`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Plan Details
              </h2>

              <div className="space-y-6">
                {/* Country Selection */}
                <div>
                  <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-pink-300' : 'text-gray-700'
                    }`}>
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-pink-400 ${isDarkMode
                        ? 'bg-black/30 border-pink-400/30 text-white'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-pink-400'
                      }`}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option
                        key={country}
                        value={country}
                        className={isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}
                      >
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination/City Selection */}
                <div>
                  <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-pink-300' : 'text-gray-700'
                    }`}>
                    <MapPin className="inline w-4 h-4 mr-2" />
                    City/Destination
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    disabled={!formData.country}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-pink-400 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode
                        ? 'bg-black/30 border-pink-400/30 text-white'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-pink-400'
                      }`}
                  >
                    <option value="">
                      {formData.country
                        ? "Select a city"
                        : "Select a country first"}
                    </option>
                    {formData.country &&
                      destinationsByCountry[formData.country]?.map((dest) => (
                        <option
                          key={dest}
                          value={dest}
                          className={isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}
                        >
                          {dest}
                        </option>
                      ))}
                  </select>
                  {formData.country && !formData.destination && (
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-pink-300' : 'text-gray-600'
                      }`}>
                      Available cities in {formData.country}
                    </p>
                  )}

                  {/* Selected Location Display */}
                  {formData.country && formData.destination && (
                    <div className={`mt-3 p-3 border rounded-lg ${isDarkMode
                        ? 'bg-pink-600/20 border-pink-400/30'
                        : 'bg-pink-50 border-pink-200'
                      }`}>
                      <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                        <span className={isDarkMode ? 'text-pink-300' : 'text-pink-600'}>Selected:</span>{" "}
                        {formData.destination}, {formData.country}
                      </p>
                    </div>
                  )}
                </div>

                {/* Number of Days */}
                <div>
                  <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-pink-300' : 'text-gray-700'
                    }`}>
                    <Clock className="inline w-4 h-4 mr-2" />
                    Number of Travel Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.numberOfDays}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        numberOfDays: parseInt(e.target.value),
                      }))
                    }
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-pink-400 ${isDarkMode
                        ? 'bg-black/30 border-pink-400/30 text-white'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-pink-400'
                      }`}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className={`block font-semibold mb-2 ${isDarkMode ? 'text-pink-300' : 'text-gray-700'
                    }`}>
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={handleDateChange}
                    min={getTodayDate()}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-pink-400 ${isDarkMode
                        ? 'bg-black/30 border-pink-400/30 text-white [color-scheme:dark]'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-pink-400 [color-scheme:light]'
                      }`}
                  />
                  {dateError && (
                    <p className="text-red-400 text-sm mt-1">{dateError}</p>
                  )}
                </div>

                {/* Travel Interests */}
                <div>
                  <label className={`block font-semibold mb-3 ${isDarkMode ? 'text-pink-300' : 'text-gray-700'
                    }`}>
                    <Star className="inline w-4 h-4 mr-2" />
                    Travel Interests
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {travelInterests.map((interest) => (
                      <label
                        key={interest.id}
                        className={`flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-pink-400/10 transition-colors ${isDarkMode
                            ? 'bg-black/20 border-pink-400/20'
                            : 'bg-white border-gray-200 hover:bg-pink-50'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest.id)}
                          onChange={() => handleInterestChange(interest.id)}
                          className="w-4 h-4 text-pink-400 bg-black/30 border-pink-400/30 rounded focus:ring-pink-400"
                        />
                        <span className="text-lg">{interest.icon}</span>
                        <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                          {interest.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateTravelPlan}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating your itinerary...
                    </span>
                  ) : (
                    "⚡ Generate Instant Travel Plan"
                  )}
                </button>
              </div>
            </div>

            {/* Generated Plan Section */}
            <div className={`backdrop-blur-sm border rounded-2xl p-8 ${isDarkMode
                ? 'bg-white/5 border-pink-400/20'
                : 'bg-white/80 border-pink-200 shadow-lg'
              }`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Your Travel Plan
              </h2>

              {formData.destination && (
                <WeatherSection city={formData.destination} />
              )}

              {generatedPlan ? (
                <div className="space-y-6">
                  {/* Plan Header */}
                  <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-black/20' : 'bg-gray-50'
                    }`}>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">
                      {generatedPlan.destination}, {formData.country}
                    </h3>
                    <div className="flex items-center space-x-4 text-pink-200 text-sm">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {generatedPlan.numberOfDays} Days
                      </span>
                      {generatedPlan.startDate && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(
                            generatedPlan.startDate
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Daily Plans */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {generatedPlan.days.map((day) => (
                      <div key={day.day} className={`rounded-lg p-4 ${isDarkMode ? 'bg-black/20' : 'bg-gray-50'
                        }`}>
                        <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-pink-300' : 'text-gray-800'
                          }`}>
                          {day.title}
                        </h4>

                        <div className="space-y-3">
                          <div>
                            <h5 className="text-pink-400 font-medium text-sm">
                              Activities:
                            </h5>
                            <ul className={`text-sm space-y-1 mt-1 ${isDarkMode ? 'text-white' : 'text-gray-700'
                              }`}>
                              {day.activities.map((activity, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div>
                              <span className="text-pink-400 font-medium">
                                Breakfast:
                              </span>
                              <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-700'
                                }`}>
                                {day.meals.breakfast}
                              </span>
                            </div>
                            <div>
                              <span className="text-pink-400 font-medium">
                                Lunch:
                              </span>
                              <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-700'
                                }`}>
                                {day.meals.lunch}
                              </span>
                            </div>
                            <div>
                              <span className="text-pink-400 font-medium">
                                Dinner:
                              </span>
                              <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-700'
                                }`}>
                                {day.meals.dinner}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={downloadPDF}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download as PDF
                  </button>
                </div>
              ) : (
                <div className={`text-center py-12 ${isDarkMode ? 'text-pink-300' : 'text-gray-600'
                  }`}>
                  <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>
                    Fill in the form and generate your personalized travel plan
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TravelPlanGenerator;
