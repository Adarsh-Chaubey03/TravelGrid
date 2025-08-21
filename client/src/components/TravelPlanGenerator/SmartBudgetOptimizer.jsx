import React, { useState, useEffect, useCallback } from "react";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Lightbulb,
    Target,
    PieChart,
    BarChart3,
    Calculator,
    Save,
    AlertTriangle,
    CheckCircle,
    Info,
    Zap,
    Calendar,
    MapPin,
    Users,
    Clock,
    Star,
    ArrowRight,
    ArrowLeft
} from "lucide-react";

const SmartBudgetOptimizer = ({
    totalBudget,
    destination,
    duration,
    interests,
    groupSize,
    travelStyle,
    onBudgetChange
}) => {
    const [budgetBreakdown, setBudgetBreakdown] = useState({
        accommodation: 0,
        activities: 0,
        food: 0,
        transportation: 0,
        entertainment: 0,
        miscellaneous: 0
    });
    const [optimizedBudget, setOptimizedBudget] = useState({});
    const [savingsOpportunities, setSavingsOpportunities] = useState([]);
    const [aiRecommendations, setAiRecommendations] = useState([]);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationProgress, setOptimizationProgress] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('overview');
    const [budgetHistory, setBudgetHistory] = useState([]);
    const [comparisonMode, setComparisonMode] = useState(false);

    // Initialize budget breakdown
    useEffect(() => {
        if (totalBudget > 0) {
            const initialBreakdown = calculateInitialBreakdown();
            setBudgetBreakdown(initialBreakdown);
            setBudgetHistory([{ ...initialBreakdown, timestamp: Date.now() }]);
        }
    }, [totalBudget, destination, duration, interests, groupSize, travelStyle]);

    // Calculate initial budget breakdown
    const calculateInitialBreakdown = () => {
        const baseBreakdown = {
            accommodation: totalBudget * 0.4,
            activities: totalBudget * 0.25,
            food: totalBudget * 0.2,
            transportation: totalBudget * 0.1,
            entertainment: totalBudget * 0.03,
            miscellaneous: totalBudget * 0.02
        };

        // Adjust based on destination
        const destinationAdjustments = getDestinationAdjustments();
        Object.keys(baseBreakdown).forEach(category => {
            baseBreakdown[category] *= destinationAdjustments[category] || 1;
        });

        // Adjust based on travel style
        const styleAdjustments = getTravelStyleAdjustments();
        Object.keys(baseBreakdown).forEach(category => {
            baseBreakdown[category] *= styleAdjustments[category] || 1;
        });

        // Adjust based on group size
        const groupAdjustments = getGroupSizeAdjustments();
        Object.keys(baseBreakdown).forEach(category => {
            baseBreakdown[category] *= groupAdjustments[category] || 1;
        });

        // Normalize to total budget
        const totalAllocated = Object.values(baseBreakdown).reduce((sum, val) => sum + val, 0);
        Object.keys(baseBreakdown).forEach(category => {
            baseBreakdown[category] = (baseBreakdown[category] / totalAllocated) * totalBudget;
        });

        return baseBreakdown;
    };

    // Get destination-specific budget adjustments
    const getDestinationAdjustments = () => {
        const destinationLower = destination?.toLowerCase() || '';

        if (destinationLower.includes('paris') || destinationLower.includes('london') || destinationLower.includes('tokyo')) {
            return {
                accommodation: 1.3,
                food: 1.4,
                activities: 1.2,
                transportation: 1.1
            };
        } else if (destinationLower.includes('bali') || destinationLower.includes('thailand') || destinationLower.includes('vietnam')) {
            return {
                accommodation: 0.7,
                food: 0.6,
                activities: 0.8,
                transportation: 0.9
            };
        } else if (destinationLower.includes('dubai') || destinationLower.includes('singapore')) {
            return {
                accommodation: 1.2,
                food: 1.3,
                activities: 1.1,
                transportation: 1.0
            };
        }

        return {
            accommodation: 1.0,
            food: 1.0,
            activities: 1.0,
            transportation: 1.0
        };
    };

    // Get travel style adjustments
    const getTravelStyleAdjustments = () => {
        switch (travelStyle) {
            case 'luxury':
                return {
                    accommodation: 1.5,
                    food: 1.4,
                    activities: 1.3,
                    transportation: 1.2
                };
            case 'budget':
                return {
                    accommodation: 0.7,
                    food: 0.6,
                    activities: 0.8,
                    transportation: 0.9
                };
            case 'adventure':
                return {
                    accommodation: 0.8,
                    food: 0.9,
                    activities: 1.4,
                    transportation: 1.1
                };
            default: // balanced
                return {
                    accommodation: 1.0,
                    food: 1.0,
                    activities: 1.0,
                    transportation: 1.0
                };
        }
    };

    // Get group size adjustments
    const getGroupSizeAdjustments = () => {
        if (groupSize >= 6) {
            return {
                accommodation: 0.9,
                food: 0.8,
                activities: 0.9,
                transportation: 0.7
            };
        } else if (groupSize >= 3) {
            return {
                accommodation: 0.95,
                food: 0.9,
                activities: 0.95,
                transportation: 0.8
            };
        }

        return {
            accommodation: 1.0,
            food: 1.0,
            activities: 1.0,
            transportation: 1.0
        };
    };

    // Optimize budget using AI
    const optimizeBudget = useCallback(async () => {
        setIsOptimizing(true);
        setOptimizationProgress(0);

        // Simulate AI optimization process
        const progressInterval = setInterval(() => {
            setOptimizationProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            // AI optimization logic
            const optimized = await performAIOptimization();

            clearInterval(progressInterval);
            setOptimizationProgress(100);

            setTimeout(() => {
                setOptimizedBudget(optimized);
                setIsOptimizing(false);
                setOptimizationProgress(0);

                // Add to history
                setBudgetHistory(prev => [...prev, { ...optimized, timestamp: Date.now() }]);

                // Generate savings opportunities
                generateSavingsOpportunities(optimized);

                // Generate AI recommendations
                generateAIRecommendations(optimized);

                // Notify parent component
                onBudgetChange?.(optimized);
            }, 500);

        } catch (error) {
            console.error("Budget optimization failed:", error);
            setIsOptimizing(false);
            setOptimizationProgress(0);
        }
    }, [budgetBreakdown, destination, duration, interests, groupSize, travelStyle, onBudgetChange]);

    // Perform AI optimization
    const performAIOptimization = async () => {
        const optimized = { ...budgetBreakdown };

        // Simulate AI analysis time
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Apply AI optimization rules
        const optimizationRules = getOptimizationRules();

        Object.keys(optimized).forEach(category => {
            const rule = optimizationRules[category];
            if (rule) {
                optimized[category] = optimized[category] * rule.multiplier;

                // Apply constraints
                if (optimized[category] < rule.minimum) {
                    optimized[category] = rule.minimum;
                }
                if (optimized[category] > rule.maximum) {
                    optimized[category] = rule.maximum;
                }
            }
        });

        // Normalize to total budget
        const totalAllocated = Object.values(optimized).reduce((sum, val) => sum + val, 0);
        Object.keys(optimized).forEach(category => {
            optimized[category] = Math.round((optimized[category] / totalAllocated) * totalBudget);
        });

        return optimized;
    };

    // Get optimization rules
    const getOptimizationRules = () => {
        return {
            accommodation: {
                multiplier: 0.95, // Reduce by 5%
                minimum: totalBudget * 0.25,
                maximum: totalBudget * 0.45
            },
            activities: {
                multiplier: 1.05, // Increase by 5%
                minimum: totalBudget * 0.2,
                maximum: totalBudget * 0.35
            },
            food: {
                multiplier: 0.9, // Reduce by 10%
                minimum: totalBudget * 0.15,
                maximum: totalBudget * 0.25
            },
            transportation: {
                multiplier: 0.85, // Reduce by 15%
                minimum: totalBudget * 0.05,
                maximum: totalBudget * 0.15
            },
            entertainment: {
                multiplier: 1.1, // Increase by 10%
                minimum: totalBudget * 0.02,
                maximum: totalBudget * 0.08
            },
            miscellaneous: {
                multiplier: 1.0, // Keep same
                minimum: totalBudget * 0.02,
                maximum: totalBudget * 0.05
            }
        };
    };

    // Generate savings opportunities
    const generateSavingsOpportunities = (optimized) => {
        const opportunities = [];

        Object.keys(budgetBreakdown).forEach(category => {
            const original = budgetBreakdown[category];
            const optimized = optimized[category];
            const difference = original - optimized;

            if (difference > 0) {
                opportunities.push({
                    category,
                    original,
                    optimized,
                    savings: difference,
                    percentage: Math.round((difference / original) * 100),
                    recommendations: getCategoryRecommendations(category, difference)
                });
            }
        });

        // Sort by savings amount
        opportunities.sort((a, b) => b.savings - a.savings);
        setSavingsOpportunities(opportunities);
    };

    // Get category-specific recommendations
    const getCategoryRecommendations = (category, savings) => {
        const recommendations = {
            accommodation: [
                'Consider alternative accommodations (hostels, vacation rentals)',
                'Book during off-peak seasons',
                'Look for package deals with activities',
                'Use loyalty programs and discounts'
            ],
            food: [
                'Mix fine dining with local street food',
                'Book restaurants in advance for better rates',
                'Consider self-catering for some meals',
                'Look for lunch specials and happy hours'
            ],
            activities: [
                'Combine multiple attractions with city passes',
                'Book activities in advance for discounts',
                'Look for free walking tours and events',
                'Consider off-peak timing for popular attractions'
            ],
            transportation: [
                'Use public transport instead of taxis',
                'Consider walking or cycling for short distances',
                'Look for transportation passes and cards',
                'Share rides with other travelers when possible'
            ]
        };

        return recommendations[category] || ['Look for deals and discounts', 'Book in advance when possible'];
    };

    // Generate AI recommendations
    const generateAIRecommendations = (optimized) => {
        const recommendations = [
            {
                id: 1,
                type: 'timing',
                message: `Book accommodations ${duration >= 7 ? '3-4 weeks' : '2-3 weeks'} in advance for best rates`,
                impact: 'high',
                potentialSavings: Math.round(totalBudget * 0.08),
                implementation: 'Set booking reminders and monitor prices'
            },
            {
                id: 2,
                type: 'group',
                message: `With ${groupSize} travelers, consider group discounts and shared accommodations`,
                impact: 'medium',
                potentialSavings: Math.round(totalBudget * 0.05),
                implementation: 'Contact providers directly for group rates'
            },
            {
                id: 3,
                type: 'interests',
                message: `Your ${interests.join(', ')} interests align well with budget-friendly local experiences`,
                impact: 'medium',
                potentialSavings: Math.round(totalBudget * 0.03),
                implementation: 'Focus on authentic local activities over tourist traps'
            }
        ];

        setAiRecommendations(recommendations);
    };

    // Update budget category
    const updateBudgetCategory = (category, value) => {
        const newBudget = { ...budgetBreakdown };
        newBudget[category] = Math.max(0, value);

        // Ensure total doesn't exceed budget
        const totalAllocated = Object.values(newBudget).reduce((sum, val) => sum + val, 0);
        if (totalAllocated > totalBudget) {
            // Scale down proportionally
            Object.keys(newBudget).forEach(cat => {
                newBudget[cat] = (newBudget[cat] / totalAllocated) * totalBudget;
            });
        }

        setBudgetBreakdown(newBudget);
        setBudgetHistory(prev => [...prev, { ...newBudget, timestamp: Date.now() }]);
    };

    // Get category icon
    const getCategoryIcon = (category) => {
        const iconMap = {
            accommodation: '🏨',
            activities: '🎯',
            food: '🍽️',
            transportation: '🚗',
            entertainment: '🎭',
            miscellaneous: '📦'
        };
        return iconMap[category] || '💰';
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colorMap = {
            accommodation: 'text-blue-400',
            activities: 'text-purple-400',
            food: 'text-green-400',
            transportation: 'text-yellow-400',
            entertainment: 'text-pink-400',
            miscellaneous: 'text-gray-400'
        };
        return colorMap[category] || 'text-white';
    };

    // Calculate total allocated
    const totalAllocated = Object.values(budgetBreakdown).reduce((sum, val) => sum + val, 0);
    const remainingBudget = totalBudget - totalAllocated;
    const isOverBudget = remainingBudget < 0;

    const categories = [
        'accommodation',
        'activities',
        'food',
        'transportation',
        'entertainment',
        'miscellaneous'
    ];

    return (
        <div className="space-y-6">
            {/* Budget Overview Header */}
            <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-sm rounded-xl p-6 border border-green-700">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-semibold flex items-center text-green-300">
                            <DollarSign className="w-5 h-5 mr-2" />
                            Smart Budget Optimizer
                        </h3>
                        <p className="text-sm text-green-200 mt-1">
                            AI-powered budget allocation and cost optimization for your trip
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">${totalBudget.toLocaleString()}</div>
                        <div className="text-sm text-green-300">Total Budget</div>
                    </div>
                </div>

                {/* Budget Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-800/30 border border-green-600/30 rounded-lg">
                        <div className="text-lg font-bold text-green-400">${totalAllocated.toLocaleString()}</div>
                        <div className="text-sm text-green-300">Allocated</div>
                    </div>
                    <div className="text-center p-3 bg-blue-800/30 border border-blue-600/30 rounded-lg">
                        <div className={`text-lg font-bold ${remainingBudget >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                            ${Math.abs(remainingBudget).toLocaleString()}
                        </div>
                        <div className="text-sm text-blue-300">
                            {remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}
                        </div>
                    </div>
                    <div className="text-center p-3 bg-purple-800/30 border border-purple-600/30 rounded-lg">
                        <div className="text-lg font-bold text-purple-400">
                            {Math.round((totalAllocated / totalBudget) * 100)}%
                        </div>
                        <div className="text-sm text-purple-300">Utilized</div>
                    </div>
                </div>
            </div>

            {/* Optimization Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                        AI Budget Optimization
                    </h4>
                    <button
                        onClick={optimizeBudget}
                        disabled={isOptimizing}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors flex items-center"
                    >
                        {isOptimizing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Optimizing...
                            </>
                        ) : (
                            <>
                                <Target className="w-4 h-4 mr-2" />
                                Optimize Budget
                            </>
                        )}
                    </button>
                </div>

                {/* Optimization Progress */}
                {isOptimizing && (
                    <div className="space-y-3">
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${optimizationProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-center text-gray-300">
                            {optimizationProgress < 30 && "Analyzing destination costs and patterns..."}
                            {optimizationProgress >= 30 && optimizationProgress < 60 && "Calculating optimal allocations..."}
                            {optimizationProgress >= 60 && optimizationProgress < 90 && "Generating savings recommendations..."}
                            {optimizationProgress >= 90 && "Finalizing optimized budget..."}
                        </p>
                    </div>
                )}
            </div>

            {/* Budget Breakdown */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-blue-400" />
                    Budget Breakdown
                </h4>

                <div className="space-y-4">
                    {categories.map((category) => (
                        <div key={category} className="border border-gray-600 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                                    <div>
                                        <h5 className="font-medium text-white capitalize">{category}</h5>
                                        <div className="text-sm text-gray-400">
                                            {Math.round((budgetBreakdown[category] / totalBudget) * 100)}% of total budget
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-lg font-bold text-white">
                                        ${Math.round(budgetBreakdown[category]).toLocaleString()}
                                    </div>
                                    {optimizedBudget[category] && (
                                        <div className={`text-sm ${optimizedBudget[category] < budgetBreakdown[category] ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {optimizedBudget[category] < budgetBreakdown[category] ? '↓' : '↑'}
                                            ${Math.abs(Math.round(optimizedBudget[category] - budgetBreakdown[category])).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Budget Slider */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Adjust Budget:</span>
                                    <span className="text-gray-300">
                                        ${Math.round(budgetBreakdown[category]).toLocaleString()}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={totalBudget}
                                    value={budgetBreakdown[category]}
                                    onChange={(e) => updateBudgetCategory(category, parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                    style={{
                                        background: `linear-gradient(to right, ${getCategoryColor(category).replace('text-', '')} 0%, ${getCategoryColor(category).replace('text-', '')} ${(budgetBreakdown[category] / totalBudget) * 100}%, #374151 ${(budgetBreakdown[category] / totalBudget) * 100}%, #374151 100%)`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Recommendations */}
            {aiRecommendations.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                        AI Budget Recommendations
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiRecommendations.map((rec) => (
                            <div key={rec.id} className="border border-gray-600 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <h5 className="font-semibold text-white">{rec.message}</h5>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-green-400">
                                            ${rec.potentialSavings.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">Potential Savings</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-400">Impact:</span>
                                            <span className={`ml-2 font-medium ${rec.impact === 'high' ? 'text-red-400' :
                                                    rec.impact === 'medium' ? 'text-yellow-400' :
                                                        'text-green-400'
                                                }`}>
                                                {rec.impact}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Type:</span>
                                            <span className="ml-2 font-medium text-blue-400 capitalize">{rec.type}</span>
                                        </div>
                                    </div>

                                    <div className="text-xs">
                                        <div className="text-gray-400 font-medium mb-1">Implementation:</div>
                                        <div className="text-gray-300">{rec.implementation}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Savings Opportunities */}
            {savingsOpportunities.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Save className="w-5 h-5 mr-2 text-green-400" />
                        Savings Opportunities
                    </h4>

                    <div className="space-y-4">
                        {savingsOpportunities.map((opportunity, index) => (
                            <div key={index} className="border border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{getCategoryIcon(opportunity.category)}</span>
                                        <div>
                                            <h5 className="font-medium text-white capitalize">{opportunity.category}</h5>
                                            <div className="text-sm text-gray-400">
                                                {opportunity.percentage}% potential savings
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-lg font-bold text-green-400">
                                            ${Math.round(opportunity.savings).toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-400">Savings</div>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-400">
                                    <div className="font-medium mb-2">Recommendations:</div>
                                    <ul className="space-y-1">
                                        {opportunity.recommendations.map((rec, recIndex) => (
                                            <li key={recIndex} className="flex items-start">
                                                <CheckCircle className="w-3 h-3 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Budget History */}
            {budgetHistory.length > 1 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                        Budget Evolution
                    </h4>

                    <div className="space-y-3">
                        {budgetHistory.slice(-5).map((budget, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                    <span className="text-sm text-gray-300">
                                        Version {budgetHistory.length - index}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(budget.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-medium text-white">
                                        ${Math.round(Object.values(budget).reduce((sum, val) => sum + val, 0)).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-400">Total Allocated</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartBudgetOptimizer;

