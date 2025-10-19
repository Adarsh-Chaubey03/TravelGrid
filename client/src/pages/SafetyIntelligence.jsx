import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SafetyDashboard from '../components/SafetyDashboard';
import SafetyRoute from '../components/SafetyRoute';
import TrustedContacts from '../components/TrustedContacts';
import { Shield, Navigation, User, AlertTriangle } from 'lucide-react';

const SafetyIntelligence = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SafetyDashboard />;
      case 'routes':
        return <SafetyRoute />;
      case 'contacts':
        return <TrustedContacts />;
      default:
        return <SafetyDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-500" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
                Safety Intelligence
              </h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Shield className="mr-2" size={18} />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('routes')}
              className={`${
                activeTab === 'routes'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Navigation className="mr-2" size={18} />
              Safe Routes
            </button>
            
            <button
              onClick={() => setActiveTab('contacts')}
              className={`${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <User className="mr-2" size={18} />
              Trusted Contacts
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {renderContent()}
      </div>

      {/* Safety Tips Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 mr-4" />
            <div>
              <h3 className="text-lg font-bold">Travel Safety Tip</h3>
              <p className="mt-1">
                Always share your itinerary with trusted contacts and check in regularly during your travels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyIntelligence;