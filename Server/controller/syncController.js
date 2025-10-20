import { SyncMetadata } from '../models/syncMetadata.js';
import { DataConflict } from '../models/dataConflict.js';
import { Trip } from '../models/trips.js';
import { Checklist } from '../models/trips.js'; // Assuming checklist is part of trips
import { Budget } from '../models/trips.js'; // Assuming budget is part of trips
import crypto from 'crypto';

// Generate a unique device ID for clients
export const generateDeviceId = (req, res) => {
  try {
    const deviceId = crypto.randomUUID();
    res.status(200).json({ deviceId });
  } catch (error) {
    console.error('Error generating device ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Register device for sync
export const registerDevice = async (req, res) => {
  try {
    const { userId, deviceId, deviceInfo, dataType } = req.body;
    
    if (!userId || !deviceId || !dataType) {
      return res.status(400).json({ message: 'userId, deviceId, and dataType are required' });
    }
    
    // Create or update sync metadata
    const syncMetadata = await SyncMetadata.findOneAndUpdate(
      { userId, deviceId, dataType },
      { 
        userId, 
        deviceId, 
        dataType,
        deviceInfo: deviceInfo || {},
        lastSyncTimestamp: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.status(200).json({ 
      message: 'Device registered successfully',
      syncMetadata
    });
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get sync status
export const getSyncStatus = async (req, res) => {
  try {
    const { userId, deviceId, dataType } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const query = { userId };
    if (deviceId) query.deviceId = deviceId;
    if (dataType) query.dataType = dataType;
    
    const syncMetadata = await SyncMetadata.find(query);
    
    res.status(200).json({ syncMetadata });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Sync data with conflict detection
export const syncData = async (req, res) => {
  try {
    const { userId, deviceId, dataType, changes, lastSyncTimestamp } = req.body;
    
    if (!userId || !deviceId || !dataType || !changes) {
      return res.status(400).json({ message: 'userId, deviceId, dataType, and changes are required' });
    }
    
    // Validate device registration
    const deviceMetadata = await SyncMetadata.findOne({ userId, deviceId, dataType });
    if (!deviceMetadata) {
      return res.status(400).json({ message: 'Device not registered for sync' });
    }
    
    // Process changes and detect conflicts
    const processedChanges = [];
    const conflicts = [];
    
    for (const change of changes) {
      const { id, operation, data, timestamp } = change;
      
      // For update operations, check for conflicts
      if (operation === 'update') {
        const conflict = await detectConflict(userId, dataType, id, timestamp);
        if (conflict) {
          conflicts.push({
            dataType,
            dataId: id,
            localVersion: conflict.localVersion,
            remoteVersion: { timestamp, data, deviceId },
            conflictType: 'edit_conflict'
          });
          continue; // Skip processing this change as it has a conflict
        }
      }
      
      // Apply the change
      const result = await applyChange(userId, dataType, change);
      processedChanges.push(result);
    }
    
    // Record conflicts if any
    if (conflicts.length > 0) {
      await Promise.all(conflicts.map(conflict => 
        DataConflict.create({
          userId,
          dataType: conflict.dataType,
          dataId: conflict.dataId,
          localVersion: conflict.localVersion,
          remoteVersion: conflict.remoteVersion,
          conflictType: conflict.conflictType,
          status: 'pending'
        })
      ));
    }
    
    // Update sync metadata
    deviceMetadata.lastSyncTimestamp = new Date();
    deviceMetadata.syncStatus = conflicts.length > 0 ? 'conflict' : 'synced';
    await deviceMetadata.save();
    
    res.status(200).json({ 
      message: 'Sync completed',
      processedChanges,
      conflicts: conflicts.length > 0 ? conflicts.map(c => c.dataId) : []
    });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Detect conflicts for a specific data item
const detectConflict = async (userId, dataType, dataId, remoteTimestamp) => {
  // This is a simplified conflict detection
  // In a real implementation, you would check the actual data versions
  return null;
};

// Apply a single change to the database
const applyChange = async (userId, dataType, change) => {
  const { id, operation, data, timestamp } = change;
  
  switch (dataType) {
    case 'trip':
      return await applyTripChange(userId, id, operation, data, timestamp);
    case 'checklist':
      return await applyChecklistChange(userId, id, operation, data, timestamp);
    case 'budget':
      return await applyBudgetChange(userId, id, operation, data, timestamp);
    default:
      throw new Error(`Unsupported data type: ${dataType}`);
  }
};

// Apply trip change
const applyTripChange = async (userId, id, operation, data, timestamp) => {
  switch (operation) {
    case 'create':
      const newTrip = new Trip({ ...data, userId });
      await newTrip.save();
      return { id: newTrip._id, operation, timestamp };
    case 'update':
      await Trip.findByIdAndUpdate(id, { ...data, updatedAt: timestamp });
      return { id, operation, timestamp };
    case 'delete':
      await Trip.findByIdAndDelete(id);
      return { id, operation, timestamp };
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
};

// Apply checklist change
const applyChecklistChange = async (userId, id, operation, data, timestamp) => {
  // Implementation would depend on how checklists are structured
  return { id, operation, timestamp };
};

// Apply budget change
const applyBudgetChange = async (userId, id, operation, data, timestamp) => {
  // Implementation would depend on how budgets are structured
  return { id, operation, timestamp };
};

// Get pending conflicts
export const getConflicts = async (req, res) => {
  try {
    const { userId, status = 'pending' } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const conflicts = await DataConflict.find({ userId, status });
    
    res.status(200).json({ conflicts });
  } catch (error) {
    console.error('Error fetching conflicts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Resolve conflict
export const resolveConflict = async (req, res) => {
  try {
    const { conflictId, resolution } = req.body;
    
    if (!conflictId || !resolution) {
      return res.status(400).json({ message: 'conflictId and resolution are required' });
    }
    
    const conflict = await DataConflict.findById(conflictId);
    if (!conflict) {
      return res.status(404).json({ message: 'Conflict not found' });
    }
    
    // Apply resolution
    const { strategy, resolvedBy, resolutionData } = resolution;
    
    // Update conflict record
    conflict.resolution = {
      strategy,
      resolvedBy,
      resolvedAt: new Date(),
      resolutionData
    };
    conflict.status = 'resolved';
    await conflict.save();
    
    // Apply the resolution to the actual data
    await applyConflictResolution(conflict, resolution);
    
    res.status(200).json({ 
      message: 'Conflict resolved successfully',
      conflict
    });
  } catch (error) {
    console.error('Error resolving conflict:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Apply conflict resolution to actual data
const applyConflictResolution = async (conflict, resolution) => {
  // Implementation would depend on the resolution strategy
  // This is a simplified example
  switch (resolution.strategy) {
    case 'accept_local':
      // Accept local version
      break;
    case 'accept_remote':
      // Accept remote version
      break;
    case 'merge':
      // Merge versions
      break;
    case 'manual':
      // Manual resolution - data is in resolutionData
      break;
  }
};

// Get sync audit trail
export const getAuditTrail = async (req, res) => {
  try {
    const { userId, limit = 50 } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    // In a real implementation, you would have an audit trail collection
    // For now, we'll return an empty array
    const auditTrail = [];
    
    res.status(200).json({ auditTrail });
  } catch (error) {
    console.error('Error fetching audit trail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};