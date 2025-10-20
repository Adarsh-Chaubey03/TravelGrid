import React, { useState } from 'react';
import { useSync } from '../context/SyncContext';
import { X, AlertTriangle, Clock, Database, User } from 'lucide-react';

const ConflictResolutionModal = ({ conflict, onClose }) => {
  const { resolveConflict } = useSync();
  const [selectedResolution, setSelectedResolution] = useState('merge');
  const [customData, setCustomData] = useState(null);

  const handleResolve = async () => {
    const resolution = {
      strategy: selectedResolution,
      resolvedBy: 'user',
      resolutionData: customData
    };
    
    const success = await resolveConflict(conflict._id, resolution);
    if (success) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
              Conflict Resolution
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              A conflict has been detected for your {conflict.dataType} with ID {conflict.dataId}.
              Please choose how to resolve this conflict.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Database className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-medium text-gray-800 dark:text-white">Server Version</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Last updated: {formatDate(conflict.remoteVersion.timestamp)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Device: {conflict.remoteVersion.deviceId}
              </p>
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                <pre className="overflow-x-auto">
                  {JSON.stringify(conflict.remoteVersion.data, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="font-medium text-gray-800 dark:text-white">Local Version</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Last updated: {formatDate(conflict.localVersion.timestamp)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Device: {conflict.localVersion.deviceId}
              </p>
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                <pre className="overflow-x-auto">
                  {JSON.stringify(conflict.localVersion.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-3">Resolution Options</h3>
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="radio"
                  name="resolution"
                  value="accept_remote"
                  checked={selectedResolution === 'accept_remote'}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  className="mt-1 mr-3"
                />
                <div>
                  <span className="font-medium">Accept Server Version</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use the server version and discard local changes
                  </p>
                </div>
              </label>
              
              <label className="flex items-start">
                <input
                  type="radio"
                  name="resolution"
                  value="accept_local"
                  checked={selectedResolution === 'accept_local'}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  className="mt-1 mr-3"
                />
                <div>
                  <span className="font-medium">Accept Local Version</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use the local version and overwrite server changes
                  </p>
                </div>
              </label>
              
              <label className="flex items-start">
                <input
                  type="radio"
                  name="resolution"
                  value="merge"
                  checked={selectedResolution === 'merge'}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  className="mt-1 mr-3"
                />
                <div>
                  <span className="font-medium">Merge Changes</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically merge non-conflicting changes from both versions
                  </p>
                </div>
              </label>
              
              <label className="flex items-start">
                <input
                  type="radio"
                  name="resolution"
                  value="manual"
                  checked={selectedResolution === 'manual'}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  className="mt-1 mr-3"
                />
                <div>
                  <span className="font-medium">Manual Resolution</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manually edit the data to resolve conflicts
                  </p>
                </div>
              </label>
            </div>
          </div>
          
          {selectedResolution === 'manual' && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-3">Manual Resolution</h3>
              <textarea
                value={JSON.stringify(customData || conflict.localVersion.data, null, 2)}
                onChange={(e) => setCustomData(JSON.parse(e.target.value))}
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Enter resolved data"
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Resolve Conflict
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionModal;