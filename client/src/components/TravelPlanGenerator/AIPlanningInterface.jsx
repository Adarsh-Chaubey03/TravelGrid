import React, { useState, useCallback } from "react";
import {
    Mic,
    MicOff,
    MessageSquare,
    Send,
    Bot,
    User,
    Zap,
    Lightbulb,
    Clock,
    CheckCircle,
    AlertCircle,
    Volume2,
    Settings,
    Target,
    Brain
} from "lucide-react";

const AIPlanningInterface = ({
    onCommandProcessed,
    destination,
    interests
}) => {
    const [isListening, setIsListening] = useState(false);
    const [voiceCommands, setVoiceCommands] = useState([]);
    const [textCommands, setTextCommands] = useState([]);
    const [currentCommand, setCurrentCommand] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [aiResponses, setAiResponses] = useState([]);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [processingQueue, setProcessingQueue] = useState([]);

    // Start voice recognition
    const startVoiceRecognition = useCallback(() => {
        if (!voiceEnabled) return;

        setIsListening(true);

        // Simulate voice recognition
        setTimeout(() => {
            const mockCommands = [
                "Add museum visit to day 2",
                "Change budget to $2000",
                "Show me restaurants near the hotel",
                "Optimize my itinerary",
                "What's the weather like?",
                "Find cheaper accommodation options"
            ];

            const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
            processVoiceCommand(randomCommand);
            setIsListening(false);
        }, 2000);
    }, [voiceEnabled]);

    // Stop voice recognition
    const stopVoiceRecognition = useCallback(() => {
        setIsListening(false);
    }, []);

    // Process voice command
    const processVoiceCommand = useCallback((command) => {
        const newCommand = {
            id: Date.now(),
            type: 'voice',
            command,
            timestamp: new Date().toISOString(),
            status: 'processing'
        };

        setVoiceCommands(prev => [newCommand, ...prev]);
        addToProcessingQueue(newCommand);
    }, []);

    // Process text command
    const processTextCommand = useCallback(async () => {
        if (!currentCommand.trim()) return;

        const newCommand = {
            id: Date.now(),
            type: 'text',
            command: currentCommand,
            timestamp: new Date().toISOString(),
            status: 'processing'
        };

        setTextCommands(prev => [newCommand, ...prev]);
        setCurrentCommand("");
        addToProcessingQueue(newCommand);
    }, [currentCommand]);

    // Add command to processing queue
    const addToProcessingQueue = useCallback((command) => {
        setProcessingQueue(prev => [...prev, command]);

        // Simulate AI processing
        setTimeout(() => {
            processCommandWithAI(command);
        }, 1000 + Math.random() * 2000);
    }, []);

    // Process command with AI
    const processCommandWithAI = useCallback(async (command) => {
        setIsProcessing(true);

        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        const aiResponse = generateAIResponse(command.command);

        // Update command status
        if (command.type === 'voice') {
            setVoiceCommands(prev =>
                prev.map(cmd =>
                    cmd.id === command.id ? { ...cmd, status: 'completed', response: aiResponse } : cmd
                )
            );
        } else {
            setTextCommands(prev =>
                prev.map(cmd =>
                    cmd.id === command.id ? { ...cmd, status: 'completed', response: aiResponse } : cmd
                )
            );
        }

        // Add AI response
        setAiResponses(prev => [aiResponse, ...prev]);

        // Remove from processing queue
        setProcessingQueue(prev => prev.filter(cmd => cmd.id !== command.id));
        setIsProcessing(false);

        // Notify parent component
        onCommandProcessed?.(command, aiResponse);
    }, [onCommandProcessed]);

    // Generate AI response
    const generateAIResponse = (command) => {
        const commandLower = command.toLowerCase();

        if (commandLower.includes('museum') || commandLower.includes('day')) {
            return {
                id: Date.now(),
                type: 'itinerary',
                message: "I've added a museum visit to day 2 of your itinerary. The Louvre Museum is perfect for your cultural interests and fits well with your schedule.",
                actions: [
                    { label: "View Updated Itinerary", action: "view_itinerary" },
                    { label: "Add More Activities", action: "add_activities" }
                ],
                confidence: 95,
                category: "itinerary_modification"
            };
        } else if (commandLower.includes('budget')) {
            return {
                id: Date.now(),
                type: 'budget',
                message: "I've updated your budget to $2000. This gives you more flexibility for premium experiences while maintaining good value.",
                actions: [
                    { label: "View Budget Breakdown", action: "view_budget" },
                    { label: "Optimize Further", action: "optimize_budget" }
                ],
                confidence: 92,
                category: "budget_adjustment"
            };
        } else if (commandLower.includes('restaurant') || commandLower.includes('hotel')) {
            return {
                id: Date.now(),
                type: 'recommendations',
                message: "I found 5 excellent restaurants within walking distance of your hotel. They all match your food preferences and budget range.",
                actions: [
                    { label: "View Restaurants", action: "view_restaurants" },
                    { label: "Make Reservations", action: "make_reservations" }
                ],
                confidence: 88,
                category: "dining_recommendations"
            };
        } else if (commandLower.includes('optimize') || commandLower.includes('itinerary')) {
            return {
                id: Date.now(),
                type: 'optimization',
                message: "I've optimized your itinerary to reduce travel time by 2.5 hours and save $150 while maintaining all your must-see attractions.",
                actions: [
                    { label: "View Optimized Plan", action: "view_optimized" },
                    { label: "Apply Changes", action: "apply_optimization" }
                ],
                confidence: 94,
                category: "itinerary_optimization"
            };
        } else if (commandLower.includes('weather')) {
            return {
                id: Date.now(),
                type: 'weather',
                message: "The weather forecast shows sunny days with temperatures around 22°C during your visit. Perfect conditions for outdoor activities!",
                actions: [
                    { label: "View Weather Details", action: "view_weather" },
                    { label: "Adjust Activities", action: "adjust_activities" }
                ],
                confidence: 97,
                category: "weather_information"
            };
        } else if (commandLower.includes('cheaper') || commandLower.includes('accommodation')) {
            return {
                id: Date.now(),
                type: 'accommodation',
                message: "I found 3 alternative accommodation options that can save you $200-300 while maintaining good quality and location.",
                actions: [
                    { label: "View Alternatives", action: "view_alternatives" },
                    { label: "Compare Options", action: "compare_accommodations" }
                ],
                confidence: 89,
                category: "accommodation_search"
            };
        } else {
            return {
                id: Date.now(),
                type: 'general',
                message: "I understand you're looking for assistance. Let me help you with that. Could you please provide more specific details?",
                actions: [
                    { label: "Get Help", action: "get_help" },
                    { label: "Browse Options", action: "browse_options" }
                ],
                confidence: 75,
                category: "general_assistance"
            };
        }
    };

    // Handle action click
    const handleActionClick = (action, response) => {
        console.log("Action clicked:", action, response);
        // Implementation would integrate with the main AI planner
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'processing':
                return <Clock className="w-4 h-4 text-yellow-400" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-400" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    // Get response type icon
    const getResponseTypeIcon = (type) => {
        const iconMap = {
            itinerary: '🗓️',
            budget: '💰',
            recommendations: '🍽️',
            optimization: '⚡',
            weather: '🌤️',
            accommodation: '🏨',
            general: '💡'
        };
        return iconMap[type] || '💬';
    };

    return (
        <div className="space-y-6">
            {/* Voice Interface Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-700">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-semibold flex items-center text-purple-300">
                            <Brain className="w-5 h-5 mr-2" />
                            AI Planning Interface
                        </h3>
                        <p className="text-sm text-purple-200 mt-1">
                            Use voice commands or natural language to interact with your AI travel planner
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">
                            {voiceCommands.length + textCommands.length}
                        </div>
                        <div className="text-sm text-purple-300">Commands Processed</div>
                    </div>
                </div>

                {/* Voice Controls */}
                <div className="flex items-center justify-center space-x-4">
                    <button
                        onClick={startVoiceRecognition}
                        disabled={!voiceEnabled || isListening}
                        className={`p-4 rounded-full transition-all ${isListening
                                ? 'bg-red-600 text-white animate-pulse'
                                : voiceEnabled
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    {isListening && (
                        <button
                            onClick={stopVoiceRecognition}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Stop Listening
                        </button>
                    )}

                    <button
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className={`p-2 rounded-lg transition-colors ${voiceEnabled
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                            }`}
                    >
                        <Volume2 className="w-5 h-5" />
                    </button>
                </div>

                {isListening && (
                    <div className="text-center mt-4">
                        <div className="animate-pulse text-purple-300">
                            Listening... Speak your command now
                        </div>
                    </div>
                )}
            </div>

            {/* Text Command Interface */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                    Text Commands
                </h4>

                <div className="flex space-x-3">
                    <input
                        type="text"
                        value={currentCommand}
                        onChange={(e) => setCurrentCommand(e.target.value)}
                        placeholder="Type your command here (e.g., 'Add museum visit to day 2')"
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && processTextCommand()}
                    />
                    <button
                        onClick={processTextCommand}
                        disabled={!currentCommand.trim() || isProcessing}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                    </button>
                </div>

                {/* Quick Commands */}
                <div className="mt-4">
                    <div className="text-sm text-gray-400 mb-2">Quick Commands:</div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "Add museum visit",
                            "Change budget",
                            "Show restaurants",
                            "Optimize itinerary",
                            "Check weather",
                            "Find accommodation"
                        ].map((cmd, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentCommand(cmd)}
                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
                            >
                                {cmd}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Processing Queue */}
            {processingQueue.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                        Processing Commands
                    </h4>

                    <div className="space-y-3">
                        {processingQueue.map((command) => (
                            <div key={command.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                                    <span className="text-gray-300">{command.command}</span>
                                    <span className="text-xs text-gray-500">
                                        {command.type === 'voice' ? '🎤' : '⌨️'}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400">Processing...</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Responses */}
            {aiResponses.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Bot className="w-5 h-5 mr-2 text-green-400" />
                        AI Responses
                    </h4>

                    <div className="space-y-4">
                        {aiResponses.map((response) => (
                            <div key={response.id} className="border border-gray-600 rounded-lg p-4">
                                <div className="flex items-start space-x-3 mb-3">
                                    <span className="text-2xl">{getResponseTypeIcon(response.type)}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-medium text-white capitalize">{response.type}</h5>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-400">{response.confidence}%</span>
                                                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                                                    {response.category.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm">{response.message}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                {response.actions && (
                                    <div className="flex space-x-2">
                                        {response.actions.map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleActionClick(action.action, response)}
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Command History */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-400" />
                    Command History
                </h4>

                <div className="space-y-3">
                    {/* Voice Commands */}
                    {voiceCommands.slice(0, 5).map((command) => (
                        <div key={command.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg">🎤</span>
                                <span className="text-gray-300">{command.command}</span>
                                {getStatusIcon(command.status)}
                            </div>
                            <span className="text-xs text-gray-500">
                                {new Date(command.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    ))}

                    {/* Text Commands */}
                    {textCommands.slice(0, 5).map((command) => (
                        <div key={command.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg">⌨️</span>
                                <span className="text-gray-300">{command.command}</span>
                                {getStatusIcon(command.status)}
                            </div>
                            <span className="text-xs text-gray-500">
                                {new Date(command.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    ))}

                    {voiceCommands.length === 0 && textCommands.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>No commands yet. Start by using voice or text commands!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIPlanningInterface;

