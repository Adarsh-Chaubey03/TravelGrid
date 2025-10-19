import { useCallback } from 'react';
import { useSync } from '../context/SyncContext';

/**
 * Custom hook for data synchronization
 * Provides easy integration of sync functionality into components
 */
export const useDataSync = () => {
  const {
    registerDevice,
    addPendingChange,
    syncData,
    syncStatus,
    isSyncing,
    conflicts
  } = useSync();

  /**
   * Hook for synchronizing trip data
   */
  const useTripSync = () => {
    const register = useCallback(() => registerDevice('trip'), [registerDevice]);
    
    const addTripChange = useCallback((id, operation, data) => {
      addPendingChange('trip', id, operation, data);
    }, [addPendingChange]);
    
    const syncTrips = useCallback((changes = null) => {
      return syncData('trip', changes);
    }, [syncData]);
    
    return {
      register,
      addTripChange,
      syncTrips,
      status: syncStatus,
      isSyncing,
      conflicts: conflicts.filter(c => c.dataType === 'trip')
    };
  };

  /**
   * Hook for synchronizing checklist data
   */
  const useChecklistSync = () => {
    const register = useCallback(() => registerDevice('checklist'), [registerDevice]);
    
    const addChecklistChange = useCallback((id, operation, data) => {
      addPendingChange('checklist', id, operation, data);
    }, [addPendingChange]);
    
    const syncChecklists = useCallback((changes = null) => {
      return syncData('checklist', changes);
    }, [syncData]);
    
    return {
      register,
      addChecklistChange,
      syncChecklists,
      status: syncStatus,
      isSyncing,
      conflicts: conflicts.filter(c => c.dataType === 'checklist')
    };
  };

  /**
   * Hook for synchronizing budget data
   */
  const useBudgetSync = () => {
    const register = useCallback(() => registerDevice('budget'), [registerDevice]);
    
    const addBudgetChange = useCallback((id, operation, data) => {
      addPendingChange('budget', id, operation, data);
    }, [addPendingChange]);
    
    const syncBudgets = useCallback((changes = null) => {
      return syncData('budget', changes);
    }, [syncData]);
    
    return {
      register,
      addBudgetChange,
      syncBudgets,
      status: syncStatus,
      isSyncing,
      conflicts: conflicts.filter(c => c.dataType === 'budget')
    };
  };

  /**
   * Hook for synchronizing all data types
   */
  const useGlobalSync = () => {
    const registerAll = useCallback(() => {
      registerDevice('trip');
      registerDevice('checklist');
      registerDevice('budget');
    }, [registerDevice]);
    
    const syncAll = useCallback(async () => {
      await syncData('trip');
      await syncData('checklist');
      await syncData('budget');
    }, [syncData]);
    
    return {
      registerAll,
      syncAll,
      status: syncStatus,
      isSyncing,
      conflicts
    };
  };

  return {
    useTripSync,
    useChecklistSync,
    useBudgetSync,
    useGlobalSync
  };
};