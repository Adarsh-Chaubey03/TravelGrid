import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const SyncContext = createContext();

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};

export const SyncProvider = ({ children }) => {
  const { user } = useAuth();
  const [deviceId, setDeviceId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, conflict, error
  const [conflicts, setConflicts] = useState([]);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [pendingChanges, setPendingChanges] = useState([]);

  // Generate device ID on first load
  useEffect(() => {
    const storedDeviceId = localStorage.getItem('travelgrid_device_id');
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      generateDeviceId();
    }
  }, []);

  // Generate a new device ID
  const generateDeviceId = async () => {
    try {
      const response = await fetch('/api/sync/generate-device-id');
      if (response.ok) {
        const data = await response.json();
        setDeviceId(data.deviceId);
        localStorage.setItem('travelgrid_device_id', data.deviceId);
      }
    } catch (error) {
      console.error('Error generating device ID:', error);
    }
  };

  // Register device for sync
  const registerDevice = useCallback(async (dataType) => {
    if (!user || !deviceId) return;
    
    try {
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        appVersion: '1.0.0'
      };
      
      const response = await fetch('/api/sync/register-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          deviceId,
          deviceInfo,
          dataType
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to register device');
      }
    } catch (error) {
      console.error('Error registering device:', error);
    }
  }, [user, deviceId]);

  // Add a change to pending changes
  const addPendingChange = useCallback((dataType, id, operation, data) => {
    const change = {
      id,
      dataType,
      operation,
      data,
      timestamp: new Date().toISOString()
    };
    
    setPendingChanges(prev => [...prev, change]);
  }, []);

  // Sync data with server
  const syncData = useCallback(async (dataType, changes = null) => {
    if (!user || !deviceId) return;
    
    setIsSyncing(true);
    setSyncStatus('syncing');
    
    try {
      const changesToSync = changes || pendingChanges.filter(c => c.dataType === dataType);
      
      if (changesToSync.length === 0) {
        setSyncStatus('idle');
        setIsSyncing(false);
        return;
      }
      
      const response = await fetch('/api/sync/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          deviceId,
          dataType,
          changes: changesToSync,
          lastSyncTimestamp: lastSyncTime
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update sync status
        setLastSyncTime(new Date().toISOString());
        
        // Handle conflicts if any
        if (data.conflicts && data.conflicts.length > 0) {
          setSyncStatus('conflict');
          fetchConflicts();
        } else {
          setSyncStatus('idle');
          
          // Clear synced changes
          if (!changes) {
            setPendingChanges(prev => 
              prev.filter(c => 
                !changesToSync.some(synced => 
                  synced.id === c.id && synced.dataType === c.dataType
                )
              )
            );
          }
        }
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  }, [user, deviceId, pendingChanges, lastSyncTime]);

  // Fetch conflicts
  const fetchConflicts = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/sync/conflicts?userId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setConflicts(data.conflicts);
      }
    } catch (error) {
      console.error('Error fetching conflicts:', error);
    }
  }, [user]);

  // Resolve conflict
  const resolveConflict = useCallback(async (conflictId, resolution) => {
    try {
      const response = await fetch('/api/sync/resolve-conflict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          conflictId,
          resolution
        }),
      });
      
      if (response.ok) {
        // Remove resolved conflict from state
        setConflicts(prev => prev.filter(c => c._id !== conflictId));
        return true;
      } else {
        throw new Error('Failed to resolve conflict');
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
      return false;
    }
  }, []);

  // Get sync status
  const getSyncStatus = useCallback(async () => {
    if (!user || !deviceId) return;
    
    try {
      const response = await fetch(`/api/sync/status?userId=${user._id}&deviceId=${deviceId}`);
      if (response.ok) {
        const data = await response.json();
        return data.syncMetadata;
      }
    } catch (error) {
      console.error('Error getting sync status:', error);
    }
  }, [user, deviceId]);

  // Clear pending changes
  const clearPendingChanges = useCallback((dataType = null) => {
    if (dataType) {
      setPendingChanges(prev => prev.filter(c => c.dataType !== dataType));
    } else {
      setPendingChanges([]);
    }
  }, []);

  const value = {
    deviceId,
    isSyncing,
    syncStatus,
    conflicts,
    lastSyncTime,
    pendingChanges,
    registerDevice,
    addPendingChange,
    syncData,
    fetchConflicts,
    resolveConflict,
    getSyncStatus,
    clearPendingChanges
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};