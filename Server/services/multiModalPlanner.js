const TransportOption = require('../models/TransportOption');

/**
 * Multi-Modal Trip Planning Service
 * Integrates various transportation modes into optimized itineraries
 */

class MultiModalPlanner {
  /**
   * Find all transport options between origin and destination
   * @param {string} origin - Starting location
   * @param {string} destination - Ending location
   * @param {Date} date - Travel date
   * @returns {Array} Array of transport options
   */
  async findTransportOptions(origin, destination, date) {
    try {
      // In a real implementation, this would call external APIs
      // For now, we'll simulate with database queries
      const options = await TransportOption.find({
        origin: origin,
        destination: destination,
        departureTime: {
          $gte: date,
          $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) // Within 24 hours
        }
      }).sort({ departureTime: 1 });
      
      return options;
    } catch (error) {
      throw new Error(`Failed to fetch transport options: ${error.message}`);
    }
  }

  /**
   * Calculate dynamic pricing based on various factors
   * @param {Object} transportOption - The transport option
   * @param {Date} bookingDate - When the booking is made
   * @returns {number} Dynamic price
   */
  calculateDynamicPrice(transportOption, bookingDate) {
    const { basePrice, priceFactors } = transportOption;
    
    // Calculate time factor (booking closer to departure is more expensive)
    const timeToDeparture = (transportOption.departureTime - bookingDate) / (1000 * 60 * 60 * 24);
    let timeFactor = 1;
    if (timeToDeparture < 7) {
      timeFactor = 1.5; // Last week, 50% more expensive
    } else if (timeToDeparture < 30) {
      timeFactor = 1.2; // Last month, 20% more expensive
    }
    
    // Calculate demand factor (based on seats available)
    const demandFactor = 1 + (1 - (transportOption.seatsAvailable / 100)) * 0.5;
    
    // Calculate season factor (simplified)
    const month = transportOption.departureTime.getMonth();
    let seasonFactor = 1;
    if (month >= 5 && month <= 7) { // Summer months
      seasonFactor = 1.3; // 30% more expensive
    } else if (month >= 11 || month <= 1) { // Winter months
      seasonFactor = 1.1; // 10% more expensive
    }
    
    // Update price factors
    transportOption.priceFactors = {
      demand: demandFactor,
      timeFactor: timeFactor,
      seasonFactor: seasonFactor
    };
    
    // Calculate final dynamic price
    const dynamicPrice = basePrice * demandFactor * timeFactor * seasonFactor;
    transportOption.dynamicPrice = Math.round(dynamicPrice * 100) / 100;
    
    return transportOption.dynamicPrice;
  }

  /**
   * Calculate carbon footprint for a transport option
   * @param {Object} transportOption - The transport option
   * @returns {number} Carbon footprint in kg CO2
   */
  calculateCarbonFootprint(transportOption) {
    // Simplified calculation based on distance and transport type
    const distance = this.estimateDistance(transportOption.origin, transportOption.destination);
    
    let carbonPerKm = 0;
    switch (transportOption.type) {
      case 'flight':
        carbonPerKm = 0.25; // kg CO2 per km
        break;
      case 'train':
        carbonPerKm = 0.03; // kg CO2 per km
        break;
      case 'bus':
        carbonPerKm = 0.08; // kg CO2 per km
        break;
      case 'car-rental':
        carbonPerKm = 0.15; // kg CO2 per km
        break;
      case 'ride-share':
        carbonPerKm = 0.12; // kg CO2 per km
        break;
      default:
        carbonPerKm = 0.1; // default
    }
    
    // Adjust for efficiency (newer vehicles, etc.)
    const efficiencyFactor = 0.9; // 10% more efficient on average
    
    transportOption.carbonFootprint = Math.round(distance * carbonPerKm * efficiencyFactor * 100) / 100;
    transportOption.ecoFriendly = transportOption.carbonFootprint < 50; // Simple eco-friendly flag
    
    return transportOption.carbonFootprint;
  }

  /**
   * Estimate distance between two locations (simplified)
   * @param {string} origin - Starting location
   * @param {string} destination - Ending location
   * @returns {number} Distance in km
   */
  estimateDistance(origin, destination) {
    // In a real implementation, this would use a geolocation service
    // For now, we'll return a random distance between 100 and 2000 km
    return Math.floor(Math.random() * 1900) + 100;
  }

  /**
   * Optimize itinerary based on constraints
   * @param {Array} options - Array of transport options
   * @param {Object} preferences - User preferences
   * @returns {Array} Optimized itinerary
   */
  async optimizeItinerary(options, preferences) {
    // Apply dynamic pricing
    const currentDate = new Date();
    options.forEach(option => {
      this.calculateDynamicPrice(option, currentDate);
      this.calculateCarbonFootprint(option);
    });
    
    // Sort based on user preferences
    if (preferences.priority === 'cost') {
      options.sort((a, b) => a.dynamicPrice - b.dynamicPrice);
    } else if (preferences.priority === 'time') {
      options.sort((a, b) => a.duration - b.duration);
    } else if (preferences.priority === 'eco') {
      options.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
    } else {
      // Default: balance of cost and time
      options.sort((a, b) => {
        const aScore = (a.dynamicPrice / 100) + (a.duration / 60);
        const bScore = (b.dynamicPrice / 100) + (b.duration / 60);
        return aScore - bScore;
      });
    }
    
    return options;
  }

  /**
   * Create a multi-modal itinerary combining different transport modes
   * @param {Array} routeSegments - Array of route segments
   * @returns {Array} Complete itinerary
   */
  async createMultiModalItinerary(routeSegments) {
    const itinerary = [];
    
    for (const segment of routeSegments) {
      const options = await this.findTransportOptions(
        segment.origin, 
        segment.destination, 
        segment.date
      );
      
      // Optimize for this segment
      const optimizedOptions = await this.optimizeItinerary(options, segment.preferences || {});
      
      // Select best option for this segment
      if (optimizedOptions.length > 0) {
        itinerary.push({
          segment: segment,
          selectedOption: optimizedOptions[0],
          alternatives: optimizedOptions.slice(1, 4) // Top 3 alternatives
        });
      }
    }
    
    return itinerary;
  }
}

module.exports = new MultiModalPlanner();