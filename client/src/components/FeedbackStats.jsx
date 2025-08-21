import React from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp } from 'lucide-react';

const FeedbackStats = () => {
  // Mock data - in a real app, this would come from an API
  const stats = {
    totalFeedback: 1247,
    averageRating: 4.6,
    positiveFeedback: 892,
    negativeFeedback: 156,
    suggestions: 199,
    recentFeedback: 23
  };

  const ratingBreakdown = [
    { stars: 5, count: 567, percentage: 45.5 },
    { stars: 4, count: 423, percentage: 33.9 },
    { stars: 3, count: 156, percentage: 12.5 },
    { stars: 2, count: 67, percentage: 5.4 },
    { stars: 1, count: 34, percentage: 2.7 }
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Feedback Analytics</h2>
        <p className="text-pink-100">Track user satisfaction and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Feedback"
          value={stats.totalFeedback.toLocaleString()}
          icon={MessageSquare}
          color="from-blue-500 to-blue-600"
          subtitle="All time submissions"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          icon={Star}
          color="from-yellow-500 to-yellow-600"
          subtitle="Out of 5 stars"
        />
        <StatCard
          title="Positive Feedback"
          value={stats.positiveFeedback}
          icon={ThumbsUp}
          color="from-green-500 to-green-600"
          subtitle="Happy customers"
        />
        <StatCard
          title="Recent Feedback"
          value={stats.recentFeedback}
          icon={TrendingUp}
          color="from-purple-500 to-purple-600"
          subtitle="Last 7 days"
        />
      </div>

      {/* Rating Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {ratingBreakdown.map((rating) => (
            <div key={rating.stars} className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 w-16">
                <span className="text-sm font-medium text-gray-600">{rating.stars}</span>
                <Star size={16} className="text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${rating.percentage}%` }}
                ></div>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-medium text-gray-600">{rating.count}</span>
                <span className="text-xs text-gray-500 ml-1">({rating.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-3">
            <ThumbsUp size={24} className="text-green-600" />
            <h4 className="text-lg font-semibold text-green-800">Positive</h4>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.positiveFeedback}</p>
          <p className="text-sm text-green-700 mt-1">
            {((stats.positiveFeedback / stats.totalFeedback) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center space-x-3 mb-3">
            <ThumbsDown size={24} className="text-red-600" />
            <h4 className="text-lg font-semibold text-red-800">Negative</h4>
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.negativeFeedback}</p>
          <p className="text-sm text-red-700 mt-1">
            {((stats.negativeFeedback / stats.totalFeedback) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <MessageSquare size={24} className="text-blue-600" />
            <h4 className="text-lg font-semibold text-blue-800">Suggestions</h4>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.suggestions}</p>
          <p className="text-sm text-blue-700 mt-1">
            {((stats.suggestions / stats.totalFeedback) * 100).toFixed(1)}% of total
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackStats; 