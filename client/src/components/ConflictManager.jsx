import React, { useState, useEffect } from 'react';
import { useSync } from '../context/SyncContext';
import ConflictResolutionModal from './ConflictResolutionModal';
import { AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';

const ConflictManager = () => {
  const { conflicts, fetchConflicts, syncStatus } = useSync();
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (syncStatus === 'conflict') {
      fetchConflicts();
    }
  }, [syncStatus, fetchConflicts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchConflicts();
    setIsRefreshing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
          Conflict Management
        </h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center text-sm text-blue-500 hover:text-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {conflicts.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No Conflicts</h3>
          <p className="text-gray-600 dark:text-gray-400">
            All your data is synchronized across devices
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''} need{conflicts.length === 1 ? 's' : ''} resolution
          </div>
          
          {conflicts.map((conflict) => (
            <div 
              key={conflict._id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {conflict.dataType} Conflict
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ID: {conflict.dataId}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Detected: {new Date(conflict.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedConflict(conflict)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors"
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedConflict && (
        <ConflictResolutionModal
          conflict={selectedConflict}
          onClose={() => setSelectedConflict(null)}
        />
      )}
    </div>
  );
};

export default ConflictManager;