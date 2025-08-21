import React, { useState, useCallback } from "react";
import { 
  DragDropContext, 
  Droppable, 
  Draggable 
} from "@hello-pangea/dnd";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Lightbulb, 
  Zap,
  Edit3,
  Trash2,
  Plus,
  Route,
  Target,
  TrendingUp
} from "lucide-react";

const AIIteraryBuilder = ({ 
  itinerary, 
  onItineraryChange, 
  destination, 
  interests, 
  travelStyle 
}) => {
  const [editingDay, setEditingDay] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate AI suggestions for itinerary improvement
  const generateAISuggestions = useCallback(async () => {
    setShowSuggestions(true);
    
    // Simulate AI analysis
    const suggestions = [
      {
        id: 1,
        type: "timing",
        message: "Consider visiting museums in the morning when crowds are smaller",
        impact: "high",
        category: "crowd_optimization"
      },
      {
        id: 2,
        type: "route",
        message: "Optimize route to reduce walking distance by 2.3km",
        impact: "medium",
        category: "efficiency"
      },
      {
        id: 3,
        type: "activity",
        message: "Add local food market visit based on your food interest",
        impact: "high",
        category: "personalization"
      },
      {
        id: 4,
        type: "budget",
        message: "Switch to public transport for day 2 to save $15",
        impact: "medium",
        category: "cost_savings"
      }
    ];
    
    setAiSuggestions(suggestions);
  }, []);

  // Handle drag and drop reordering
  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same day
      const dayIndex = parseInt(source.droppableId);
      const newItinerary = [...itinerary];
      const day = { ...newItinerary[dayIndex] };
      
      const [removed] = day.activities.splice(source.index, 1);
      day.activities.splice(destination.index, 0, removed);
      
      newItinerary[dayIndex] = day;
      onItineraryChange(newItinerary);
    } else {
      // Moving between days
      const sourceDayIndex = parseInt(source.droppableId);
      const destDayIndex = parseInt(destination.droppableId);
      const newItinerary = [...itinerary];
      
      const sourceDay = { ...newItinerary[sourceDayIndex] };
      const destDay = { ...newItinerary[destDayIndex] };
      
      const [moved] = sourceDay.activities.splice(source.index, 1);
      destDay.activities.splice(destination.index, 0, moved);
      
      newItinerary[sourceDayIndex] = sourceDay;
      newItinerary[destDayIndex] = destDay;
      
      onItineraryChange(newItinerary);
    }
  }, [itinerary, onItineraryChange]);

  // Add new activity to a specific day
  const addActivity = useCallback((dayIndex) => {
    const newItinerary = [...itinerary];
    const day = { ...newItinerary[dayIndex] };
    
    const newActivity = {
      id: Date.now(),
      name: "New Activity",
      duration: "2 hours",
      location: "TBD",
      type: "custom",
      isEditing: true
    };
    
    day.activities.push(newActivity);
    newItinerary[dayIndex] = day;
    onItineraryChange(newItinerary);
    setEditingDay({ dayIndex, activityIndex: day.activities.length - 1 });
  }, [itinerary, onItineraryChange]);

  // Remove activity from a day
  const removeActivity = useCallback((dayIndex, activityIndex) => {
    const newItinerary = [...itinerary];
    const day = { ...newItinerary[dayIndex] };
    
    day.activities.splice(activityIndex, 1);
    newItinerary[dayIndex] = day;
    onItineraryChange(newItinerary);
  }, [itinerary, onItineraryChange]);

  // Update activity details
  const updateActivity = useCallback((dayIndex, activityIndex, updates) => {
    const newItinerary = [...itinerary];
    const day = { ...newItinerary[dayIndex] };
    const activity = { ...day.activities[activityIndex], ...updates };
    
    day.activities[activityIndex] = activity;
    newItinerary[dayIndex] = day;
    onItineraryChange(newItinerary);
  }, [itinerary, onItineraryChange]);

  // Apply AI suggestion
  const applySuggestion = useCallback((suggestion) => {
    // Implementation would integrate with the main AI planner
    console.log("Applying suggestion:", suggestion);
    
    // Remove the applied suggestion
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  }, []);

  // Calculate day statistics
  const calculateDayStats = useCallback((day) => {
    const totalActivities = day.activities.length;
    const estimatedDuration = day.activities.reduce((total, activity) => {
      const duration = parseInt(activity.duration) || 0;
      return total + duration;
    }, 0);
    
    const energyLevel = estimatedDuration > 8 ? "High" : estimatedDuration > 5 ? "Medium" : "Low";
    
    return { totalActivities, estimatedDuration, energyLevel };
  }, []);

  // Get activity icon based on type
  const getActivityIcon = useCallback((activity) => {
    const iconMap = {
      culture: "🏛️",
      food: "🍽️",
      nature: "🌿",
      adventure: "🏔️",
      shopping: "🛍️",
      relaxation: "🧘",
      custom: "⭐"
    };
    
    return iconMap[activity.type] || "📍";
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Suggestions Panel */}
      <div className="backdrop-blur-sm rounded-xl p-6 border border-blue-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            AI Itinerary Suggestions
          </h3>
          <button
            onClick={generateAISuggestions}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
          >
            <Zap className="w-4 h-4 mr-2" />
            Get AI Suggestions
          </button>
        </div>
        
        {showSuggestions && aiSuggestions.length > 0 && (
          <div className="space-y-3">
            {aiSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-center justify-between p-3 bg-blue-800/30 border border-blue-600/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                      suggestion.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {suggestion.impact} impact
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                      {suggestion.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-blue-200 text-sm">{suggestion.message}</p>
                </div>
                <button
                  onClick={() => applySuggestion(suggestion)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Itinerary Builder */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Route className="w-5 h-5 mr-2 text-purple-400" />
            Interactive Itinerary Builder
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Target className="w-4 h-4" />
            <span>Drag & Drop to Reorder</span>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-6">
            {itinerary.map((day, dayIndex) => {
              const dayStats = calculateDayStats(day);
              
              return (
                <div key={dayIndex} className="border border-gray-600 rounded-lg p-4">
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h4 className="text-lg font-semibold text-purple-400">
                        Day {day.day}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{day.timing}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Activities</div>
                        <div className="text-lg font-bold text-blue-400">{dayStats.totalActivities}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Duration</div>
                        <div className="text-lg font-bold text-green-400">{dayStats.estimatedDuration}h</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Energy</div>
                        <div className={`text-lg font-bold ${
                          dayStats.energyLevel === 'High' ? 'text-red-400' :
                          dayStats.energyLevel === 'Medium' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {dayStats.energyLevel}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activities Droppable Area */}
                  <Droppable droppableId={dayIndex.toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[100px] p-3 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-purple-500/20 border-2 border-dashed border-purple-500' : 'bg-gray-700/30'
                        }`}
                      >
                        {day.activities.map((activity, activityIndex) => (
                          <Draggable
                            key={activity.id}
                            draggableId={activity.id.toString()}
                            index={activityIndex}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 mb-3 rounded-lg border transition-all ${
                                  snapshot.isDragging
                                    ? 'bg-purple-600/50 border-purple-500 shadow-lg'
                                    : 'bg-gray-700/50 border-gray-600 hover:border-purple-500/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 flex-1">
                                    <span className="text-lg">{getActivityIcon(activity)}</span>
                                    
                                    {editingDay?.dayIndex === dayIndex && 
                                     editingDay?.activityIndex === activityIndex ? (
                                      <div className="flex-1 space-y-2">
                                        <input
                                          type="text"
                                          value={activity.name}
                                          onChange={(e) => updateActivity(dayIndex, activityIndex, { name: e.target.value })}
                                          className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm"
                                        />
                                        <input
                                          type="text"
                                          value={activity.duration}
                                          onChange={(e) => updateActivity(dayIndex, activityIndex, { duration: e.target.value })}
                                          placeholder="Duration (e.g., 2 hours)"
                                          className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm"
                                        />
                                        <input
                                          type="text"
                                          value={activity.location}
                                          onChange={(e) => updateActivity(dayIndex, activityIndex, { location: e.target.value })}
                                          placeholder="Location"
                                          className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm"
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex-1">
                                        <div className="font-medium text-white">{activity.name}</div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                                          <span className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {activity.duration}
                                          </span>
                                          <span className="flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {activity.location}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 ml-4">
                                    <button
                                      onClick={() => {
                                        if (editingDay?.dayIndex === dayIndex && editingDay?.activityIndex === activityIndex) {
                                          setEditingDay(null);
                                          updateActivity(dayIndex, activityIndex, { isEditing: false });
                                        } else {
                                          setEditingDay({ dayIndex, activityIndex });
                                        }
                                      }}
                                      className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => removeActivity(dayIndex, activityIndex)}
                                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {/* Add Activity Button */}
                        <button
                          onClick={() => addActivity(dayIndex)}
                          className="w-full p-3 border-2 border-dashed border-gray-500 hover:border-purple-500 rounded-lg text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Activity
                        </button>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Itinerary Statistics */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
          Itinerary Statistics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {itinerary.reduce((total, day) => total + day.activities.length, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Activities</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {itinerary.length}
            </div>
            <div className="text-sm text-gray-400">Days Planned</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {itinerary.reduce((total, day) => {
                const dayDuration = day.activities.reduce((sum, activity) => {
                  const duration = parseInt(activity.duration) || 0;
                  return sum + duration;
                }, 0);
                return total + dayDuration;
              }, 0)}h
            </div>
            <div className="text-sm text-gray-400">Total Duration</div>
          </div>
          
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(itinerary.reduce((total, day) => total + day.activities.length, 0) / itinerary.length * 10) / 10}
            </div>
            <div className="text-sm text-gray-400">Avg Activities/Day</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIteraryBuilder;


