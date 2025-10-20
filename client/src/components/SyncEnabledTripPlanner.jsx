import React, { useState, useEffect } from 'react';
import { useDataSync } from '../hooks/useSync';
import { useAuth } from '../context/AuthContext';
import SyncStatusIndicator from './SyncStatusIndicator';
import { Plus, Save, RefreshCw, Trash2 } from 'lucide-react';

/**
 * Example of how to integrate sync functionality with existing components
 * This component demonstrates the use of the useDataSync hook
 */
const SyncEnabledTripPlanner = () => {
  const { user } = useAuth();
  const { useTripSync } = useDataSync();
  const { 
    register, 
    addTripChange, 
    syncTrips, 
    status, 
    isSyncing, 
    conflicts 
  } = useTripSync();
  
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({ name: '', destination: '', startDate: '', endDate: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Register device for trip sync on component mount
  useEffect(() => {
    if (user) {
      register();
    }
  }, [user, register]);

  // Example function to create a new trip
  const handleCreateTrip = async () => {
    if (!newTrip.name || !newTrip.destination) return;
    
    setIsSaving(true);
    
    try {
      // In a real implementation, this would call your API to create the trip
      const tripId = `trip_${Date.now()}`; // Simulated ID
      const tripData = {
        ...newTrip,
        id: tripId,
        userId: user._id,
        createdAt: new Date().toISOString()
      };
      
      // Add to local state
      setTrips(prev => [...prev, tripData]);
      
      // Register the change for sync
      addTripChange(tripId, 'create', tripData);
      
      // Clear form
      setNewTrip({ name: '', destination: '', startDate: '', endDate: '' });
      
      // Sync immediately (in a real app, you might batch these)
      await syncTrips();
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Example function to update a trip
  const handleUpdateTrip = async (tripId, updates) => {
    try {
      // In a real implementation, this would call your API to update the trip
      setTrips(prev => 
        prev.map(trip => 
          trip.id === tripId ? { ...trip, ...updates } : trip
        )
      );
      
      // Register the change for sync
      addTripChange(tripId, 'update', updates);
      
      // Sync immediately (in a real app, you might debounce these)
      await syncTrips();
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  };

  // Example function to delete a trip
  const handleDeleteTrip = async (tripId) => {
    try {
      // In a real implementation, this would call your API to delete the trip
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      
      // Register the change for sync
      addTripChange(tripId, 'delete', {});
      
      // Sync immediately
      await syncTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Sync-Enabled Trip Planner
        </h2>
        <div className="flex items-center space-x-4">
          <SyncStatusIndicator />
          <button
            onClick={() => syncTrips()}
            disabled={isSyncing || isSaving}
            className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync
          </button>
        </div>
      </div>

      {conflicts.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200">
            {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''} detected. 
            Please resolve {conflicts.length > 1 ? 'them' : 'it'} in the{' '}
            <a href="/data-sync" className="underline">Sync Dashboard</a>.
          </p>
        </div>
      )}

      {/* Trip Creation Form */}
      <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="font-medium text-gray-800 dark:text-white mb-4 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create New Trip
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Trip Name
            </label>
            <input
              type="text"
              value={newTrip.name}
              onChange={(e) => setNewTrip({...newTrip, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Summer Vacation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Destination
            </label>
            <input
              type="text"
              value={newTrip.destination}
              onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Paris, France"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={newTrip.startDate}
              onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={newTrip.endDate}
              onChange={(e) => setNewTrip({...newTrip, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <button
          onClick={handleCreateTrip}
          disabled={isSaving || !newTrip.name || !newTrip.destination}
          className="mt-4 flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Trip'}
        </button>
      </div>

      {/* Trip List */}
      <div>
        <h3 className="font-medium text-gray-800 dark:text-white mb-4">
          Your Trips
        </h3>
        
        {trips.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No trips yet. Create your first trip above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <div 
                key={trip.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {trip.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {trip.destination}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {trip.startDate} to {trip.endDate}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleUpdateTrip(trip.id, { 
                      name: prompt('Enter new trip name:', trip.name) || trip.name 
                    })}
                    className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleUpdateTrip(trip.id, { 
                      destination: prompt('Enter new destination:', trip.destination) || trip.destination 
                    })}
                    className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded transition-colors"
                  >
                    Change Destination
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncEnabledTripPlanner;