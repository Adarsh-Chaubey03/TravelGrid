import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSync } from '../context/SyncContext';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import ConflictManager from '../components/ConflictManager';
import { RefreshCw, Database, Smartphone, Laptop, Tablet, Server, Shield, History } from 'lucide-react';

const DataSyncDashboard = () => {
  const { 
    deviceId, 
    syncStatus, 
    pendingChanges, 
    lastSyncTime, 
    getSyncStatus,
    syncData
  } = useSync();
  const [devices, setDevices] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeviceStatus();
  }, []);

  const fetchDeviceStatus = async () => {
    setIsRefreshing(true);
    try {
      const status = await getSyncStatus();
      if (status) {
        setDevices(status);
      }
    } catch (error) {
      console.error('Error fetching device status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManualSync = async () => {
    // In a real implementation, you would sync all data types
    // For now, we'll just refresh the status
    await fetchDeviceStatus();
  };

  const getDeviceIcon = (platform) => {
    if (!platform) return <Smartphone className="w-5 h-5" />;
    
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('mac') || platformLower.includes('darwin')) {
      return <Laptop className="w-5 h-5" />;
    } else if (platformLower.includes('win')) {
      return <Laptop className="w-5 h-5" />;
    } else if (platformLower.includes('linux')) {
      return <Server className="w-5 h-5" />;
    } else if (platformLower.includes('android') || platformLower.includes('ios')) {
      return <Smartphone className="w-5 h-5" />;
    } else if (platformLower.includes('tablet') || platformLower.includes('ipad')) {
      return <Tablet className="w-5 h-5" />;
    }
    
    return <Smartphone className="w-5 h-5" />;
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-500" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
                Data Sync Dashboard
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sync Status Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Sync Status
              </h2>
              <SyncStatusIndicator />
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleManualSync}
                disabled={isRefreshing}
                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Sync Now
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device Management */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-blue-500" />
                  Connected Devices
                </h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {devices.length} device{devices.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {devices.length === 0 ? (
                <div className="text-center py-8">
                  <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No Devices</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your devices will appear here once they sync with the server
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div 
                      key={`${device.deviceId}-${device.dataType}`} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-4">
                            {getDeviceIcon(device.deviceInfo?.platform)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-white">
                              {device.deviceInfo?.platform || 'Unknown Device'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ID: {device.deviceId.substring(0, 8)}...
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Data Type: {device.dataType}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            device.syncStatus === 'synced' 
                              ? 'bg-green-100 text-green-800' 
                              : device.syncStatus === 'conflict'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {device.syncStatus === 'synced' ? 'Synced' : 
                             device.syncStatus === 'conflict' ? 'Conflict' : 'Pending'}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Last sync: {formatLastSync(device.lastSyncTimestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Changes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                  <History className="w-5 h-5 mr-2 text-blue-500" />
                  Pending Changes
                </h2>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                  {pendingChanges.length} change{pendingChanges.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {pendingChanges.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No Pending Changes</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All your changes have been synchronized
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingChanges.slice(0, 10).map((change, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {change.dataType} {change.operation}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {change.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(change.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {pendingChanges.length > 10 && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      + {pendingChanges.length - 10} more changes
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Conflict Management */}
          <div>
            <ConflictManager />
            
            {/* Security Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center mb-4">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">End-to-End Encryption</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All synchronized data is encrypted
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">Secure Device ID</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your device ID: {deviceId ? deviceId.substring(0, 8) + '...' : 'Not generated'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">Audit Trail</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All sync activities are logged for security
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSyncDashboard;