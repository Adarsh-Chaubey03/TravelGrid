import React from 'react';
import { useSync } from '../context/SyncContext';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const SyncStatusIndicator = () => {
  const { syncStatus, isSyncing, conflicts, lastSyncTime } = useSync();

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'conflict':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      case 'idle':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'conflict':
        return `Conflict${conflicts.length > 1 ? 's' : ''} detected`;
      case 'error':
        return 'Sync error';
      case 'idle':
        return 'Synced';
      default:
        return 'Offline';
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'text-blue-500';
      case 'conflict':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'idle':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatLastSyncTime = () => {
    if (!lastSyncTime) return 'Never';
    
    const now = new Date();
    const syncTime = new Date(lastSyncTime);
    const diffMs = now - syncTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={getStatusColor()}>
        {getStatusIcon()}
      </div>
      <span className={getStatusColor()}>
        {getStatusText()}
      </span>
      {conflicts.length > 0 && (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {conflicts.length}
        </span>
      )}
      <span className="text-gray-500">
        {formatLastSyncTime()}
      </span>
    </div>
  );
};

export default SyncStatusIndicator;