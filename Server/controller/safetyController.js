import { SafetyAlert } from '../models/safetyAlert.js';
import { RiskAssessment } from '../models/riskAssessment.js';
import { TravelerSafetyProfile } from '../models/travelerSafetyProfile.js';
import { User } from '../models/user.js';
import axios from 'axios';

// Mock function to simulate fetching real-time data from external sources
// In a real implementation, this would connect to government APIs, weather services, etc.
const fetchRealTimeSafetyData = async (destination) => {
  // This is a mock implementation - in production, you would connect to real APIs
  // For demonstration, we'll return some sample data
  return {
    weatherAlerts: [
      {
        alertType: 'weather',
        severity: 'medium',
        title: 'Severe Weather Warning',
        description: 'Thunderstorms expected in the area. Avoid outdoor activities.',
        source: 'National Weather Service',
        startTime: new Date(),
        isActive: true
      }
    ],
    politicalAlerts: [],
    healthAdvisories: [
      {
        alertType: 'health',
        severity: 'low',
        title: 'Health Advisory',
        description: 'Drink bottled water and avoid street food.',
        source: 'CDC',
        startTime: new Date(),
        isActive: true
      }
    ],
    securityNotices: []
  };
};

// Calculate risk score based on various factors
const calculateRiskScore = (factors) => {
  if (!factors || factors.length === 0) return 0;
  
  const totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return Math.round(totalScore / factors.length);
};

// Mock function to send notifications to trusted contacts
const notifyTrustedContacts = async (userId, message, location = null) => {
  // In a real implementation, this would send emails, SMS, or push notifications
  console.log(`Sending notification to trusted contacts of user ${userId}: ${message}`);
  if (location) {
    console.log(`Location: ${JSON.stringify(location)}`);
  }
  return { success: true, message: 'Notifications sent successfully' };
};

// Get safety alerts for a destination
export const getSafetyAlerts = async (req, res) => {
  try {
    const { destination, userId } = req.query;
    
    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }
    
    // Fetch real-time safety data
    const realTimeData = await fetchRealTimeSafetyData(destination);
    
    // Get stored alerts from database
    const storedAlerts = await SafetyAlert.find({
      destination: { $regex: new RegExp(destination, 'i') },
      isActive: true
    }).sort({ createdAt: -1 });
    
    // Combine real-time and stored alerts
    const allAlerts = [...storedAlerts, ...realTimeData.weatherAlerts, ...realTimeData.healthAdvisories];
    
    res.status(200).json({
      alerts: allAlerts,
      destination
    });
  } catch (error) {
    console.error('Error fetching safety alerts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get risk assessment for a destination
export const getRiskAssessment = async (req, res) => {
  try {
    const { destination, userId } = req.query;
    
    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }
    
    // Check if we have a recent assessment
    let assessment = await RiskAssessment.findOne({
      destination: { $regex: new RegExp(destination, 'i') }
    }).sort({ lastAssessment: -1 });
    
    // If no recent assessment or older than 24 hours, create a new one
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (!assessment || assessment.lastAssessment < oneDayAgo) {
      // Fetch real-time data for risk factors
      const realTimeData = await fetchRealTimeSafetyData(destination);
      
      // Calculate risk factors (mock implementation)
      const riskFactors = [
        { 
          factorType: 'weather', 
          score: Math.floor(Math.random() * 30), 
          description: 'Weather conditions assessment' 
        },
        { 
          factorType: 'political', 
          score: Math.floor(Math.random() * 20), 
          description: 'Political stability assessment' 
        },
        { 
          factorType: 'health', 
          score: Math.floor(Math.random() * 25), 
          description: 'Health risks assessment' 
        },
        { 
          factorType: 'security', 
          score: Math.floor(Math.random() * 25), 
          description: 'Security situation assessment' 
        }
      ];
      
      const overallRiskScore = calculateRiskScore(riskFactors);
      
      // Create safety recommendations based on risk factors
      const safetyRecommendations = [];
      riskFactors.forEach(factor => {
        if (factor.score > 70) {
          safetyRecommendations.push(`High ${factor.factorType} risk detected. Exercise increased caution.`);
        } else if (factor.score > 40) {
          safetyRecommendations.push(`Moderate ${factor.factorType} risk. Stay informed of local conditions.`);
        }
      });
      
      // Create or update assessment
      assessment = new RiskAssessment({
        userId: userId || null,
        destination,
        overallRiskScore,
        riskFactors,
        safetyRecommendations,
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      
      await assessment.save();
    }
    
    res.status(200).json({
      assessment
    });
  } catch (error) {
    console.error('Error fetching risk assessment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get traveler safety profile
export const getSafetyProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    let profile = await TravelerSafetyProfile.findOne({ userId });
    
    // Create default profile if none exists
    if (!profile) {
      profile = new TravelerSafetyProfile({
        userId,
        safetyPreferences: [
          { preferenceType: 'avoid_high_risk', enabled: true }
        ],
        trustedContacts: [],
        emergencyContacts: [],
        notificationPreferences: {
          email: true,
          sms: false,
          push: true
        }
      });
      
      await profile.save();
    }
    
    res.status(200).json({
      profile
    });
  } catch (error) {
    console.error('Error fetching safety profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update traveler safety profile
export const updateSafetyProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    let profile = await TravelerSafetyProfile.findOne({ userId });
    
    if (!profile) {
      profile = new TravelerSafetyProfile({
        userId,
        ...updates
      });
    } else {
      // Update existing profile
      Object.keys(updates).forEach(key => {
        if (key !== 'userId') {
          profile[key] = updates[key];
        }
      });
    }
    
    await profile.save();
    
    res.status(200).json({
      profile,
      message: 'Safety profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating safety profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add trusted contact
export const addTrustedContact = async (req, res) => {
  try {
    const { userId } = req.params;
    const contactData = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    let profile = await TravelerSafetyProfile.findOne({ userId });
    
    if (!profile) {
      profile = new TravelerSafetyProfile({
        userId,
        trustedContacts: [contactData],
        emergencyContacts: []
      });
    } else {
      profile.trustedContacts.push(contactData);
    }
    
    await profile.save();
    
    res.status(200).json({
      profile,
      message: 'Trusted contact added successfully'
    });
  } catch (error) {
    console.error('Error adding trusted contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create safety alert
export const createSafetyAlert = async (req, res) => {
  try {
    const alertData = req.body;
    
    const alert = new SafetyAlert(alertData);
    await alert.save();
    
    res.status(201).json({
      alert,
      message: 'Safety alert created successfully'
    });
  } catch (error) {
    console.error('Error creating safety alert:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check-in safety status
export const checkInSafety = async (req, res) => {
  try {
    const { userId, destination, location } = req.body;
    
    if (!userId || !destination) {
      return res.status(400).json({ message: 'User ID and destination are required' });
    }
    
    let profile = await TravelerSafetyProfile.findOne({ userId });
    
    if (!profile) {
      profile = new TravelerSafetyProfile({
        userId,
        lastCheckIn: {
          destination,
          checkInTime: new Date(),
          location,
          status: 'checked_in'
        }
      });
    } else {
      profile.lastCheckIn = {
        destination,
        checkInTime: new Date(),
        location,
        status: 'checked_in'
      };
    }
    
    await profile.save();
    
    // Notify trusted contacts
    // In a real implementation, this would send actual notifications
    await notifyTrustedContacts(userId, 'User has checked in safely.', location);
    
    res.status(200).json({
      profile,
      message: 'Safety check-in successful'
    });
  } catch (error) {
    console.error('Error checking in safety status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Trigger SOS alert
export const triggerSOS = async (req, res) => {
  try {
    const { userId, location, message } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Get user and safety profile
    const user = await User.findById(userId);
    const profile = await TravelerSafetyProfile.findOne({ userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prepare emergency message
    const emergencyMessage = message || 'SOS ALERT: Emergency assistance requested';
    
    // In a real implementation, this would:
    // 1. Send immediate alerts to emergency contacts
    // 2. Notify local authorities if possible
    // 3. Share location with emergency services
    // 4. Provide user details and medical information
    
    // For now, we'll simulate sending notifications to trusted contacts
    if (profile && profile.trustedContacts && profile.trustedContacts.length > 0) {
      const notificationResult = await notifyTrustedContacts(
        userId, 
        emergencyMessage, 
        location
      );
      
      console.log(`SOS ALERT: User ${user.name} (${user.email}) triggered SOS at location ${JSON.stringify(location)}`);
      
      res.status(200).json({
        message: 'SOS alert sent successfully',
        notificationResult,
        user: {
          name: user.name,
          email: user.email
        }
      });
    } else {
      // If no trusted contacts, send a generic alert
      console.log(`SOS ALERT: User ${user.name} (${user.email}) triggered SOS at location ${JSON.stringify(location)} (no trusted contacts)`);
      
      res.status(200).json({
        message: 'SOS alert sent to emergency services',
        user: {
          name: user.name,
          email: user.email
        }
      });
    }
  } catch (error) {
    console.error('Error triggering SOS:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get safety route optimization
export const getSafetyRoute = async (req, res) => {
  try {
    const { start, end, waypoints } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end locations are required' });
    }
    
    // Parse start and end coordinates
    const startCoords = start.split(',').map(coord => parseFloat(coord.trim()));
    const endCoords = end.split(',').map(coord => parseFloat(coord.trim()));
    
    if (startCoords.length !== 2 || endCoords.length !== 2) {
      return res.status(400).json({ message: 'Invalid coordinate format. Use "lat,lng"' });
    }
    
    // Parse waypoints if provided
    let parsedWaypoints = [];
    if (waypoints) {
      try {
        parsedWaypoints = JSON.parse(waypoints).map(wp => {
          const coords = wp.split(',').map(coord => parseFloat(coord.trim()));
          return coords;
        });
      } catch (e) {
        console.log('Error parsing waypoints:', e);
      }
    }
    
    // In a real implementation, this would:
    // 1. Fetch current safety alerts along potential routes
    // 2. Calculate safety-weighted paths avoiding high-risk areas
    // 3. Provide alternative routes with safety scores
    
    // For demonstration, we'll create a mock response with safety-weighted routing
    const safetyFactors = [
      { name: 'Weather Conditions', weight: 0.2, score: Math.floor(Math.random() * 30) + 70 },
      { name: 'Crime Rate', weight: 0.3, score: Math.floor(Math.random() * 40) + 60 },
      { name: 'Political Stability', weight: 0.25, score: Math.floor(Math.random() * 35) + 65 },
      { name: 'Infrastructure', weight: 0.15, score: Math.floor(Math.random() * 25) + 75 },
      { name: 'Health Risks', weight: 0.1, score: Math.floor(Math.random() * 20) + 80 }
    ];
    
    // Calculate weighted safety score
    const weightedScore = safetyFactors.reduce((total, factor) => {
      return total + (factor.score * factor.weight);
    }, 0);
    
    const safetyScore = Math.round(weightedScore);
    
    // Generate safety recommendations based on factors
    const safetyRecommendations = [];
    safetyFactors.forEach(factor => {
      if (factor.score < 70) {
        safetyRecommendations.push(`Low ${factor.name.toLowerCase()} detected. Exercise normal precautions.`);
      } else if (factor.score < 85) {
        safetyRecommendations.push(`Moderate ${factor.name.toLowerCase()} risk. Stay informed of local conditions.`);
      }
    });
    
    // Add general safety recommendations
    safetyRecommendations.push('Stay on main roads and avoid shortcuts through alleys');
    safetyRecommendations.push('Avoid traveling alone at night in unfamiliar areas');
    safetyRecommendations.push('Keep emergency contacts informed of your location');
    
    // Calculate estimated travel time (mock)
    const distance = Math.sqrt(
      Math.pow(endCoords[0] - startCoords[0], 2) + 
      Math.pow(endCoords[1] - startCoords[1], 2)
    );
    
    // Rough estimate: 100km/h average speed
    const estimatedHours = Math.max(1, Math.round(distance * 100));
    const estimatedTravelTime = estimatedHours > 24 
      ? `${Math.floor(estimatedHours / 24)} days ${estimatedHours % 24} hours` 
      : `${estimatedHours} hours`;
    
    const mockRoute = {
      route: {
        start: `${startCoords[0]},${startCoords[1]}`,
        end: `${endCoords[0]},${endCoords[1]}`,
        waypoints: parsedWaypoints.map(wp => `${wp[0]},${wp[1]}`),
        safetyScore,
        safetyFactors,
        estimatedTravelTime,
        safetyRecommendations,
        // In a real implementation, this would include actual route coordinates
        routeCoordinates: [
          { lat: startCoords[0], lng: startCoords[1] },
          ...parsedWaypoints.map(wp => ({ lat: wp[0], lng: wp[1] })),
          { lat: endCoords[0], lng: endCoords[1] }
        ]
      }
    };
    
    res.status(200).json(mockRoute);
  } catch (error) {
    console.error('Error calculating safety route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};