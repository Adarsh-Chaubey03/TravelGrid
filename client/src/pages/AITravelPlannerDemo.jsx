import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  Brain,
  Route,
  BarChart3,
  MessageSquare,
  Lightbulb,
  ArrowLeft,
  Home,
  Settings,
} from "lucide-react";
import AITravelPlannerComponent from "../components/TravelPlanGenerator/AITravelPlanner";
import AIIteraryBuilder from "../components/TravelPlanGenerator/AIIteraryBuilder";
import AIRecommendationEngine from "../components/TravelPlanGenerator/AIRecommendationEngine";
import PredictiveAnalytics from "../components/TravelPlanGenerator/PredictiveAnalytics";
import AIPlanningInterface from "../components/TravelPlanGenerator/AIPlanningInterface";

const AITravelPlannerDemo = () => {
  const [activeTab, setActiveTab] = useState("main");
  const { isDarkMode } = useTheme();

  const [demoData] = useState({
    destination: "Paris",
    duration: 5,
    budget: 2500,
    interests: ["culture", "food", "art"],
    travelStyle: "balanced",
    groupSize: 2,
  });

  const tabs = [
    { id: "main", label: "Main Planner", icon: Brain },
    { id: "itinerary", label: "AI Itinerary Builder", icon: Route },
    { id: "recommendations", label: "AI Recommendations", icon: Lightbulb },
    { id: "analytics", label: "Predictive Analytics", icon: BarChart3 },
    { id: "interface", label: "AI Interface", icon: MessageSquare },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "main":
        return <AITravelPlannerComponent />;
      case "itinerary":
        return (
          <AIIteraryBuilder
            itinerary={[
              {
                day: 1,
                activities: [
                  {
                    id: 1,
                    name: "Eiffel Tower Visit",
                    duration: "2 hours",
                    location: "Champ de Mars",
                    type: "culture",
                  },
                  {
                    id: 2,
                    name: "Louvre Museum",
                    duration: "3 hours",
                    location: "Rue de Rivoli",
                    type: "culture",
                  },
                  {
                    id: 3,
                    name: "Seine River Cruise",
                    duration: "1 hour",
                    location: "Port de la Bourdonnais",
                    type: "nature",
                  },
                ],
                timing: "9:00 AM - 6:00 PM",
                energyLevel: "High",
                flexibility: "Medium",
              },
              {
                day: 2,
                activities: [
                  {
                    id: 4,
                    name: "Notre-Dame Cathedral",
                    duration: "1.5 hours",
                    location: "Île de la Cité",
                    type: "culture",
                  },
                  {
                    id: 5,
                    name: "Latin Quarter Walk",
                    duration: "2 hours",
                    location: "5th Arrondissement",
                    type: "culture",
                  },
                  {
                    id: 6,
                    name: "Local Food Market",
                    duration: "1 hour",
                    location: "Rue Mouffetard",
                    type: "food",
                  },
                ],
                timing: "10:00 AM - 5:00 PM",
                energyLevel: "Medium",
                flexibility: "High",
              },
            ]}
            onItineraryChange={(newItinerary) =>
              console.log("Itinerary updated:", newItinerary)
            }
            destination={demoData.destination}
            interests={demoData.interests}
            travelStyle={demoData.travelStyle}
          />
        );
      case "recommendations":
        return (
          <AIRecommendationEngine
            destination={demoData.destination}
            interests={demoData.interests}
            travelStyle={demoData.travelStyle}
            budget={demoData.budget}
            groupSize={demoData.groupSize}
            onRecommendationSelect={(item, category) =>
              console.log("Selected:", item, category)
            }
          />
        );
      case "analytics":
        return (
          <PredictiveAnalytics
            destination={demoData.destination}
            travelDates={["2024-06-15", "2024-06-20"]}
            interests={demoData.interests}
            budget={demoData.budget}
          />
        );
      case "interface":
        return (
          <AIPlanningInterface
            destination={demoData.destination}
            interests={demoData.interests}
            onCommandProcessed={(command, response) =>
              console.log("Command processed:", command, response)
            }
          />
        );
      default:
        return <AITravelPlannerComponent />;
    }
  };

  return (
    <div className="min-h-screen transition-all duration-300">
      {/* Header / Navbar */}

      {/* Push content down (so it's not hidden behind navbar) */}
      <div className="pt-24">
        
        

        {/* Navigation Tabs */}

        <div className="w-full border-b border-transparent mt-10">
          {" "}
          {/* no common bg */}
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-4 space-x-3 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md cursor-pointer
            ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg"
                : isDarkMode
                ? "text-white bg-white/15 hover:bg-white/20"
                : "text-gray-900 bg-white/25 hover:bg-white/40"
            }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">{renderActiveTab()}</div>
      </div>

      {/* Footer */}
      <div
        className={`backdrop-blur-sm border-t mt-16 ${
          isDarkMode
            ? "bg-gray-900/50 border-gray-700"
            : "bg-gradient-to-r from-pink-100/70 via-white/60 to-blue-100/70 border-pink-200"
        }`}
      >
        
      </div>
    </div>
  );
};

export default AITravelPlannerDemo;
