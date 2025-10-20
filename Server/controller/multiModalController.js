const multiModalPlanner = require('../services/multiModalPlanner');
const TransportOption = require('../models/TransportOption');

/**
 * Multi-Modal Controller
 * Handles API requests for multi-modal trip planning
 */

// Get transport options between two locations
exports.getTransportOptions = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    
    if (!origin || !destination || !date) {
      return res.status(400).json({
        success: false,
        message: 'Origin, destination, and date are required'
      });
    }
    
    const options = await multiModalPlanner.findTransportOptions(
      origin, 
      destination, 
      new Date(date)
    );
    
    res.status(200).json({
      success: true,
      data: options
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get optimized itinerary
exports.getOptimizedItinerary = async (req, res) => {
  try {
    const { routeSegments, preferences } = req.body;
    
    if (!routeSegments || !Array.isArray(routeSegments)) {
      return res.status(400).json({
        success: false,
        message: 'Route segments are required'
      });
    }
    
    const itinerary = await multiModalPlanner.createMultiModalItinerary(
      routeSegments, 
      preferences
    );
    
    res.status(200).json({
      success: true,
      data: itinerary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a new transport option (for testing/admin purposes)
exports.createTransportOption = async (req, res) => {
  try {
    const transportOption = new TransportOption(req.body);
    
    // Calculate dynamic price and carbon footprint
    const currentDate = new Date();
    multiModalPlanner.calculateDynamicPrice(transportOption, currentDate);
    multiModalPlanner.calculateCarbonFootprint(transportOption);
    
    await transportOption.save();
    
    res.status(201).json({
      success: true,
      data: transportOption
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all transport options (for admin/testing)
exports.getAllTransportOptions = async (req, res) => {
  try {
    const options = await TransportOption.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: options
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a transport option
exports.updateTransportOption = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const transportOption = await TransportOption.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!transportOption) {
      return res.status(404).json({
        success: false,
        message: 'Transport option not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transportOption
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a transport option
exports.deleteTransportOption = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transportOption = await TransportOption.findByIdAndDelete(id);
    
    if (!transportOption) {
      return res.status(404).json({
        success: false,
        message: 'Transport option not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Transport option deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};