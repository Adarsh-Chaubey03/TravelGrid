import React, { useState } from "react";
import { Calendar, MapPin, Clock, Download, Map, Star, Hotel, Utensils, Car } from "lucide-react";
import MapLocation from "./MapLocation";
import { generatePackagePlanPDF } from "../../utils/pdfGenerator";
import { fastTravelPlanner } from "../../utils/fastTravelPlanner";

const PackagePlanGenerator = ({ packageData }) => {
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePackagePlan = () => {
    setIsGenerating(true);
    
    // Performance test for demonstration
    fastTravelPlanner.performanceTest();
    
    // Instant generation - no delay needed
    const plan = createDetailedPackagePlan(packageData);
    setGeneratedPlan(plan);
    setIsGenerating(false);
  };

  const createDetailedPackagePlan = (pkg) => {
    const plan = {
      packageInfo: {
        title: pkg.title,
        location: pkg.location,
        duration: pkg.duration,
        price: pkg.price,
        rating: pkg.rating
      },
      days: []
    };

    // Determine interests based on package location and type
    const interests = getPackageInterests(pkg);
    
    // Use existing itinerary if available, otherwise use AI planner
    if (pkg.itinerary && pkg.itinerary.length > 0) {
      plan.days = pkg.itinerary.map(day => ({
        ...day,
        meals: fastTravelPlanner.generateMeals(pkg.location),
        accommodation: fastTravelPlanner.generateAccommodation(pkg.location),
        transportation: fastTravelPlanner.generateTransportation(pkg.location),
        mapLocations: fastTravelPlanner.generateMapLocations(pkg.location)
      }));
    } else {
      // Use AI planner to generate intelligent itinerary
      const numberOfDays = parseInt(pkg.duration.split(' ')[0]);
      const aiPlan = fastTravelPlanner.generateTravelPlan(pkg.location, numberOfDays, interests, null);
      plan.days = aiPlan.days;
    }

    return plan;
  };

  // Get specific interests based on package location and type
  const getPackageInterests = (pkg) => {
    const location = pkg.location.toLowerCase();
    const title = pkg.title.toLowerCase();
    
    // Default interests
    let interests = ['culture', 'food'];
    
    // Add location-specific interests
    if (location.includes('maldives') || location.includes('bali')) {
      interests.push('beaches', 'relaxation', 'nature');
    } else if (location.includes('dubai')) {
      interests.push('shopping', 'adventure', 'nightlife');
    } else if (location.includes('manali')) {
      interests.push('nature', 'adventure', 'photography');
    } else if (location.includes('italy') || location.includes('france')) {
      interests.push('museums', 'culture', 'shopping');
    }
    
    // Add title-specific interests
    if (title.includes('adventure') || title.includes('trek')) {
      interests.push('adventure', 'nature');
    } else if (title.includes('luxury') || title.includes('premium')) {
      interests.push('relaxation', 'shopping');
    } else if (title.includes('cultural') || title.includes('heritage')) {
      interests.push('culture', 'museums');
    }
    
    // Remove duplicates and limit to 4 interests
    return [...new Set(interests)].slice(0, 4);
  };


  const downloadPDF = () => {
    generatePackagePlanPDF(packageData, generatedPlan);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Generate Specific Travel Plan
        </h2>
        <p className="text-pink-200">
          Create a personalized day-by-day itinerary tailored to your selected package
        </p>
        <p className="text-sm text-pink-300 mt-2">
          ⚡ AI analyzes your package location and type to generate the perfect plan!
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={generatePackagePlan}
          disabled={isGenerating}
          className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isGenerating ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating your itinerary...
            </span>
          ) : (
            "⚡ Generate Specific Package Plan"
          )}
        </button>
      </div>

      {/* Package Analysis */}
      {!generatedPlan && !isGenerating && (
        <div className="backdrop-blur-sm bg-white/5 border border-pink-400/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-pink-400 mb-4">Package Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-pink-300 font-semibold mb-2">Detected Interests:</h4>
              <div className="flex flex-wrap gap-2">
                {getPackageInterests(packageData).map((interest, idx) => (
                  <span key={idx} className="bg-pink-600/20 text-pink-300 px-3 py-1 rounded-full text-sm">
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-pink-300 font-semibold mb-2">Package Details:</h4>
              <div className="text-white text-sm space-y-1">
                <p><span className="text-pink-300">Location:</span> {packageData.location}</p>
                <p><span className="text-pink-300">Duration:</span> {packageData.duration}</p>
                <p><span className="text-pink-300">Type:</span> {packageData.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {generatedPlan && (
        <div className="space-y-8">
          {/* Package Info Header */}
          <div className="backdrop-blur-sm bg-white/5 border border-pink-400/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-pink-400">
                {generatedPlan.packageInfo.title}
              </h3>
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, idx) => (
                  <svg
                    key={idx}
                    className={`w-5 h-5 ${
                      idx < generatedPlan.packageInfo.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927a1 1 0 011.902 0l1.517 4.674a1 1 0 00.95.69h4.911c.969 0 1.371 1.24.588 1.81l-3.978 2.89a1 1 0 00-.364 1.118l1.517 4.674c.3.921-.755 1.688-1.538 1.118l-3.978-2.89a1 1 0 00-1.176 0l-3.978 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.978-2.89c-.784-.57-.38-1.81.588-1.81h4.912a1 1 0 00.95-.69l1.517-4.674z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-pink-200">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{generatedPlan.packageInfo.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{generatedPlan.packageInfo.duration}</span>
              </div>
              <div className="flex items-center">
                <span className="text-pink-400 font-semibold">₹{generatedPlan.packageInfo.price}</span>
              </div>
            </div>
          </div>

          {/* Daily Plans */}
          <div className="space-y-6">
            {generatedPlan.days.map((day) => (
              <div key={day.day} className="backdrop-blur-sm bg-white/5 border border-pink-400/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-pink-300">
                    {day.title}
                  </h4>
                  <span className="text-pink-400 font-medium">{day.description}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Activities */}
                  <div>
                    <h5 className="text-pink-400 font-semibold mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Activities
                    </h5>
                    <ul className="space-y-2">
                      {day.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-center text-white">
                          <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Meals & Accommodation */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-pink-400 font-semibold mb-2 flex items-center">
                        <Utensils className="w-4 h-4 mr-2" />
                        Meals
                      </h5>
                      <div className="space-y-1 text-sm text-white">
                        <div><span className="text-pink-300">Breakfast:</span> {day.meals.breakfast}</div>
                        <div><span className="text-pink-300">Lunch:</span> {day.meals.lunch}</div>
                        <div><span className="text-pink-300">Dinner:</span> {day.meals.dinner}</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-pink-400 font-semibold mb-2 flex items-center">
                        <Hotel className="w-4 h-4 mr-2" />
                        Accommodation
                      </h5>
                      <p className="text-sm text-white">{day.accommodation}</p>
                    </div>

                    <div>
                      <h5 className="text-pink-400 font-semibold mb-2 flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        Transportation
                      </h5>
                      <p className="text-sm text-white">{day.transportation}</p>
                    </div>
                  </div>
                </div>

                {/* Map Location */}
                {day.mapLocations && (
                  <div className="mt-4">
                    <MapLocation location={day.mapLocations} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={downloadPDF}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Complete Itinerary as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagePlanGenerator; 