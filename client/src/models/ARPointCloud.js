/**
 * AR Point Cloud Model for Spatial Mapping
 * Represents 3D spatial data for augmented reality applications
 */

class ARPointCloud {
  constructor() {
    this.points = [];
    this.maxPoints = 1000;
    this.spatialMap = new Map();
    this.lastUpdate = Date.now();
  }

  /**
   * Update the point cloud with new spatial data
   * @param {HTMLVideoElement} video - Video element for visual analysis
   * @param {Object} userPosition - Current user geolocation {lat, lng, accuracy}
   */
  update(video, userPosition) {
    // In a real implementation, this would process visual data to extract 3D points
    // For this demo, we'll simulate point cloud generation
    
    const now = Date.now();
    
    // Limit updates to 5 times per second
    if (now - this.lastUpdate < 200) {
      return;
    }
    
    this.lastUpdate = now;
    
    // Generate simulated 3D points based on:
    // 1. User position (geolocation)
    // 2. Device orientation
    // 3. Visual features from camera
    
    // Add new points around the user's position
    if (userPosition) {
      // Generate 5-10 new points per update
      const newPointsCount = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 0; i < newPointsCount; i++) {
        // Create a point with:
        // - Geographic coordinates (slightly offset from user position)
        // - Elevation data
        // - Visual feature descriptor
        const point = {
          id: `point-${now}-${i}`,
          // Slightly offset geographic coordinates
          latitude: userPosition.lat + (Math.random() - 0.5) * 0.001,
          longitude: userPosition.lng + (Math.random() - 0.5) * 0.001,
          // Elevation in meters (relative to user)
          elevation: (Math.random() - 0.5) * 10,
          // Confidence in point accuracy (0-1)
          confidence: Math.random(),
          // Visual descriptor (in a real implementation, this would be a feature vector)
          descriptor: this._generateDescriptor(),
          // Timestamp
          timestamp: now,
          // Screen position (where this point would appear in the current view)
          screenX: Math.random() * (video.videoWidth || 640),
          screenY: Math.random() * (video.videoHeight || 480)
        };
        
        this.points.push(point);
        
        // Store in spatial map for quick lookup
        const key = this._getSpatialKey(point.latitude, point.longitude);
        if (!this.spatialMap.has(key)) {
          this.spatialMap.set(key, []);
        }
        this.spatialMap.get(key).push(point);
      }
    }
    
    // Remove old points to maintain maxPoints limit
    if (this.points.length > this.maxPoints) {
      // Remove oldest points
      this.points = this.points.slice(-this.maxPoints);
      
      // Rebuild spatial map
      this._rebuildSpatialMap();
    }
  }

  /**
   * Render the point cloud on a canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
   */
  render(ctx) {
    if (!ctx) return;
    
    // Draw each point as a small circle
    this.points.forEach(point => {
      // Only draw points with high confidence
      if (point.confidence > 0.3) {
        // Calculate size based on confidence and elevation
        const size = Math.max(2, point.confidence * 6);
        
        // Color based on elevation
        const hue = 120 + (point.elevation * 12); // Green to red based on elevation
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${point.confidence * 0.8})`;
        
        // Draw point
        ctx.beginPath();
        ctx.arc(point.screenX, point.screenY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw a subtle glow effect
        ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
  }

  /**
   * Find nearby points to a given location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} radius - Search radius in meters
   * @returns {Array} Array of nearby points
   */
  findNearbyPoints(lat, lng, radius = 100) {
    // Convert radius from meters to approximate degrees
    const radiusInDegrees = radius / 111000; // Rough approximation
    
    // Get points from nearby spatial cells
    const nearbyPoints = [];
    
    // Check surrounding grid cells
    for (let latOffset = -1; latOffset <= 1; latOffset++) {
      for (let lngOffset = -1; lngOffset <= 1; lngOffset++) {
        const key = this._getSpatialKey(lat + latOffset * radiusInDegrees, lng + lngOffset * radiusInDegrees);
        if (this.spatialMap.has(key)) {
          const points = this.spatialMap.get(key);
          nearbyPoints.push(...points);
        }
      }
    }
    
    // Filter by actual distance
    return nearbyPoints.filter(point => {
      const distance = this._calculateDistance(lat, lng, point.latitude, point.longitude);
      return distance <= radius;
    });
  }

  /**
   * Get statistics about the point cloud
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      totalPoints: this.points.length,
      spatialCells: this.spatialMap.size,
      averageConfidence: this.points.reduce((sum, point) => sum + point.confidence, 0) / this.points.length || 0,
      elevationRange: this._getElevationRange(),
      lastUpdate: this.lastUpdate
    };
  }

  /**
   * Clear all points from the point cloud
   */
  clear() {
    this.points = [];
    this.spatialMap.clear();
  }

  /**
   * Generate a simulated visual descriptor
   * @private
   * @returns {Array} Feature descriptor array
   */
  _generateDescriptor() {
    // In a real implementation, this would be a feature vector from computer vision
    // For this demo, we'll generate a random array of numbers
    return Array.from({ length: 128 }, () => Math.random());
  }

  /**
   * Get a spatial key for grid-based lookup
   * @private
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {string} Spatial key
   */
  _getSpatialKey(lat, lng) {
    // Quantize coordinates to form grid cells
    const precision = 10000; // 4 decimal places
    const latKey = Math.round(lat * precision) / precision;
    const lngKey = Math.round(lng * precision) / precision;
    return `${latKey},${lngKey}`;
  }

  /**
   * Rebuild the spatial map from current points
   * @private
   */
  _rebuildSpatialMap() {
    this.spatialMap.clear();
    
    this.points.forEach(point => {
      const key = this._getSpatialKey(point.latitude, point.longitude);
      if (!this.spatialMap.has(key)) {
        this.spatialMap.set(key, []);
      }
      this.spatialMap.get(key).push(point);
    });
  }

  /**
   * Calculate distance between two geographic points
   * @private
   * @param {number} lat1 - Latitude of point 1
   * @param {number} lng1 - Longitude of point 1
   * @param {number} lat2 - Latitude of point 2
   * @param {number} lng2 - Longitude of point 2
   * @returns {number} Distance in meters
   */
  _calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth radius in meters
    const toRad = deg => deg * Math.PI / 180;
    
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }

  /**
   * Get elevation range of current points
   * @private
   * @returns {Object} Min and max elevation
   */
  _getElevationRange() {
    if (this.points.length === 0) return { min: 0, max: 0 };
    
    const elevations = this.points.map(p => p.elevation);
    return {
      min: Math.min(...elevations),
      max: Math.max(...elevations)
    };
  }
}

export default ARPointCloud;