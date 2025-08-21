// AI-Powered Travel Planner
// This simulates an AI service that generates intelligent travel plans

export class AITravelPlanner {
  constructor() {
    this.destinationKnowledge = {
      // Cultural context for different regions
      regions: {
        europe: {
          pace: "moderate",
          mealTimes: { breakfast: "7-9 AM", lunch: "12-2 PM", dinner: "7-9 PM" },
          siesta: false,
          nightlife: "late",
          transportation: "efficient_public"
        },
        asia: {
          pace: "fast",
          mealTimes: { breakfast: "6-8 AM", lunch: "12-1 PM", dinner: "6-8 PM" },
          siesta: false,
          nightlife: "early",
          transportation: "mixed"
        },
        middleEast: {
          pace: "relaxed",
          mealTimes: { breakfast: "7-9 AM", lunch: "1-3 PM", dinner: "8-10 PM" },
          siesta: true,
          nightlife: "moderate",
          transportation: "modern"
        },
        americas: {
          pace: "fast",
          mealTimes: { breakfast: "7-9 AM", lunch: "12-1 PM", dinner: "6-8 PM" },
          siesta: false,
          nightlife: "late",
          transportation: "car_centric"
        }
      }
    };
  }

  // Determine region based on destination
  getRegion(destination) {
    const destinationLower = destination.toLowerCase();
    
    if (destinationLower.includes('paris') || destinationLower.includes('london') || 
        destinationLower.includes('rome') || destinationLower.includes('barcelona') ||
        destinationLower.includes('amsterdam') || destinationLower.includes('berlin')) {
      return 'europe';
    } else if (destinationLower.includes('tokyo') || destinationLower.includes('bangkok') ||
               destinationLower.includes('singapore') || destinationLower.includes('bali') ||
               destinationLower.includes('seoul') || destinationLower.includes('kyoto')) {
      return 'asia';
    } else if (destinationLower.includes('dubai') || destinationLower.includes('abu dhabi') ||
               destinationLower.includes('doha') || destinationLower.includes('istanbul')) {
      return 'middleEast';
    } else if (destinationLower.includes('new york') || destinationLower.includes('los angeles') ||
               destinationLower.includes('miami') || destinationLower.includes('toronto')) {
      return 'americas';
    }
    
    return 'europe'; // default
  }

  // Generate intelligent activities based on destination and interests
  generateActivities(destination, interests, day, totalDays) {
    const region = this.getRegion(destination);
    const activities = [];
    
    // Optimized AI logic for faster generation
    if (day === 1) {
      // Arrival day - lighter activities
      activities.push(this.generateArrivalActivity(destination, region));
      activities.push(this.generateOrientationActivity(destination, interests));
      if (interests.includes('food')) {
        activities.push(this.generateFoodActivity(destination, 'welcome'));
      }
    } else if (day === totalDays) {
      // Departure day - wrap up activities
      activities.push(this.generateDepartureActivity(destination, interests));
      activities.push(this.generateLastMinuteActivity(destination, interests));
    } else {
      // Regular days - optimized activity generation
      const activityCount = Math.min(4, this.getActivityCount(region, interests));
      const selectedInterests = interests.slice(0, 3); // Limit to 3 interests for speed
      
      for (let i = 0; i < activityCount; i++) {
        const interest = selectedInterests[i % selectedInterests.length];
        const activity = this.generateQuickActivity(destination, interest, region);
        if (activity && !activities.includes(activity)) {
          activities.push(activity);
        }
      }
    }
    
    return activities;
  }

  // Generate arrival activity
  generateArrivalActivity(destination, region) {
    const arrivalActivities = {
      europe: "Hotel check-in and neighborhood orientation",
      asia: "Airport transfer and hotel check-in",
      middleEast: "Welcome reception and hotel check-in",
      americas: "Hotel check-in and local area exploration"
    };
    
    return arrivalActivities[region] || "Hotel check-in and rest";
  }

  // Generate orientation activity
  generateOrientationActivity(destination, interests) {
    const orientationOptions = [
      "City center walking tour",
      "Local neighborhood exploration",
      "Public transportation familiarization",
      "Main attractions overview"
    ];
    
    return orientationOptions[Math.floor(Math.random() * orientationOptions.length)];
  }

  // Generate quick activity for faster performance
  generateQuickActivity(destination, interest, region) {
    const quickActivities = {
      museums: `Visit ${destination} Museum`,
      food: `Dine at ${destination} Restaurant`,
      shopping: `Shopping at ${destination} Market`,
      culture: `Explore ${destination} Cultural Site`,
      nature: `Visit ${destination} Park`,
      adventure: `Adventure at ${destination} Activity Center`,
      beaches: `${destination} Beach Day`,
      nightlife: `${destination} Nightlife`,
      relaxation: `${destination} Relaxation`,
      photography: `${destination} Photography Tour`
    };
    
    return quickActivities[interest] || `Explore ${destination}`;
  }

  // Generate smart activity based on interests and destination
  generateSmartActivity(destination, interests, day, region) {
    const activityTypes = {
      museums: this.generateMuseumActivity.bind(this),
      food: this.generateFoodActivity.bind(this),
      shopping: this.generateShoppingActivity.bind(this),
      culture: this.generateCulturalActivity.bind(this),
      nature: this.generateNatureActivity.bind(this),
      adventure: this.generateAdventureActivity.bind(this),
      beaches: this.generateBeachActivity.bind(this),
      nightlife: this.generateNightlifeActivity.bind(this),
      relaxation: this.generateRelaxationActivity.bind(this),
      photography: this.generatePhotographyActivity.bind(this)
    };

    // Select activities based on interests
    const selectedInterests = interests.filter(interest => 
      activityTypes[interest] && Math.random() > 0.3
    );

    if (selectedInterests.length === 0) {
      selectedInterests.push(interests[Math.floor(Math.random() * interests.length)]);
    }

    const interest = selectedInterests[Math.floor(Math.random() * selectedInterests.length)];
    return activityTypes[interest](destination, interest, day, region);
  }

  // Generate museum activity
  generateMuseumActivity(destination, interest, day, region) {
    const museumTypes = {
      europe: ["Art Museum", "History Museum", "Cultural Center", "Archaeological Museum"],
      asia: ["Traditional Museum", "Modern Art Gallery", "Cultural Heritage Center", "Technology Museum"],
      middleEast: ["Islamic Art Museum", "Heritage Center", "Modern Gallery", "Cultural Museum"],
      americas: ["Modern Art Museum", "History Museum", "Science Center", "Cultural Gallery"]
    };
    
    const type = museumTypes[region][Math.floor(Math.random() * museumTypes[region].length)];
    return `Visit ${destination} ${type}`;
  }

  // Generate food activity
  generateFoodActivity(destination, interest, day, region) {
    const mealTypes = {
      europe: ["Traditional Bistro", "Fine Dining Restaurant", "Local Café", "Wine Bar"],
      asia: ["Local Restaurant", "Street Food Tour", "Traditional Tea House", "Modern Fusion"],
      middleEast: ["Traditional Restaurant", "Modern Café", "Street Food", "Luxury Dining"],
      americas: ["Local Restaurant", "Food Truck Tour", "Fine Dining", "Craft Brewery"]
    };
    
    const type = mealTypes[region][Math.floor(Math.random() * mealTypes[region].length)];
    return `Dine at ${destination} ${type}`;
  }

  // Generate shopping activity
  generateShoppingActivity(destination, interest, day, region) {
    const shoppingTypes = {
      europe: ["Boutique District", "Local Market", "Shopping Mall", "Artisan Quarter"],
      asia: ["Shopping District", "Local Market", "Modern Mall", "Traditional Market"],
      middleEast: ["Souk", "Modern Mall", "Traditional Market", "Luxury Shopping"],
      americas: ["Shopping District", "Local Market", "Mall", "Boutique Area"]
    };
    
    const type = shoppingTypes[region][Math.floor(Math.random() * shoppingTypes[region].length)];
    return `Shopping at ${destination} ${type}`;
  }

  // Generate cultural activity
  generateCulturalActivity(destination, interest, day, region) {
    const culturalTypes = {
      europe: ["Historic Site", "Cultural Performance", "Traditional Festival", "Heritage Tour"],
      asia: ["Temple Visit", "Cultural Show", "Traditional Ceremony", "Heritage Site"],
      middleEast: ["Mosque Visit", "Cultural Center", "Traditional Market", "Heritage Site"],
      americas: ["Cultural Center", "Historic District", "Local Festival", "Heritage Site"]
    };
    
    const type = culturalTypes[region][Math.floor(Math.random() * culturalTypes[region].length)];
    return `Experience ${destination} ${type}`;
  }

  // Generate nature activity
  generateNatureActivity(destination, interest, day, region) {
    const natureTypes = {
      europe: ["City Park", "Botanical Gardens", "Nature Reserve", "Scenic Walk"],
      asia: ["Garden Visit", "Nature Park", "Mountain View", "Riverside Walk"],
      middleEast: ["Desert Tour", "Oasis Visit", "Mountain Trek", "Coastal Walk"],
      americas: ["National Park", "City Park", "Nature Trail", "Scenic Overlook"]
    };
    
    const type = natureTypes[region][Math.floor(Math.random() * natureTypes[region].length)];
    return `Explore ${destination} ${type}`;
  }

  // Generate adventure activity
  generateAdventureActivity(destination, interest, day, region) {
    const adventureTypes = {
      europe: ["Hiking Trail", "Bike Tour", "Rock Climbing", "Water Sports"],
      asia: ["Mountain Trek", "Bike Tour", "Water Activities", "Adventure Park"],
      middleEast: ["Desert Safari", "Dune Bashing", "Water Sports", "Adventure Tour"],
      americas: ["Hiking", "Bike Tour", "Water Sports", "Adventure Park"]
    };
    
    const type = adventureTypes[region][Math.floor(Math.random() * adventureTypes[region].length)];
    return `Adventure at ${destination} ${type}`;
  }

  // Generate beach activity
  generateBeachActivity(destination, interest, day, region) {
    const beachTypes = {
      europe: ["Beach Relaxation", "Water Sports", "Coastal Walk", "Beach Club"],
      asia: ["Beach Day", "Water Activities", "Island Tour", "Beach Resort"],
      middleEast: ["Beach Resort", "Water Sports", "Island Visit", "Coastal Tour"],
      americas: ["Beach Day", "Water Sports", "Coastal Walk", "Beach Club"]
    };
    
    const type = beachTypes[region][Math.floor(Math.random() * beachTypes[region].length)];
    return `${destination} ${type}`;
  }

  // Generate nightlife activity
  generateNightlifeActivity(destination, interest, day, region) {
    const nightlifeTypes = {
      europe: ["Bar Hopping", "Live Music", "Nightclub", "Rooftop Bar"],
      asia: ["Night Market", "Karaoke", "Bar District", "Cultural Show"],
      middleEast: ["Lounge Bar", "Cultural Show", "Night Market", "Rooftop Bar"],
      americas: ["Bar District", "Live Music", "Nightclub", "Rooftop Bar"]
    };
    
    const type = nightlifeTypes[region][Math.floor(Math.random() * nightlifeTypes[region].length)];
    return `${destination} ${type}`;
  }

  // Generate relaxation activity
  generateRelaxationActivity(destination, interest, day, region) {
    const relaxationTypes = {
      europe: ["Spa Treatment", "Yoga Session", "Meditation", "Thermal Baths"],
      asia: ["Spa Treatment", "Yoga Session", "Meditation", "Hot Springs"],
      middleEast: ["Spa Treatment", "Hammam", "Relaxation", "Wellness Center"],
      americas: ["Spa Treatment", "Yoga Session", "Meditation", "Wellness Center"]
    };
    
    const type = relaxationTypes[region][Math.floor(Math.random() * relaxationTypes[region].length)];
    return `${destination} ${type}`;
  }

  // Generate photography activity
  generatePhotographyActivity(destination, interest, day, region) {
    const photographyTypes = {
      europe: ["Architecture Tour", "Sunset Photography", "Street Photography", "Landscape"],
      asia: ["Temple Photography", "Street Life", "Sunrise Photography", "Cultural Shots"],
      middleEast: ["Architecture Photography", "Desert Sunset", "Cultural Shots", "City Views"],
      americas: ["City Photography", "Landscape Shots", "Street Photography", "Sunset Views"]
    };
    
    const type = photographyTypes[region][Math.floor(Math.random() * photographyTypes[region].length)];
    return `${destination} ${type}`;
  }

  // Generate departure activity
  generateDepartureActivity(destination, interests) {
    const departureActivities = [
      "Final shopping and souvenir hunting",
      "Last-minute sightseeing",
      "Farewell meal at local restaurant",
      "Hotel check-out and airport transfer"
    ];
    
    return departureActivities[Math.floor(Math.random() * departureActivities.length)];
  }

  // Generate last minute activity
  generateLastMinuteActivity(destination, interests) {
    const lastMinuteActivities = [
      "Visit missed attraction",
      "Local café for final coffee",
      "Photography session",
      "Relaxation before departure"
    ];
    
    return lastMinuteActivities[Math.floor(Math.random() * lastMinuteActivities.length)];
  }

  // Get appropriate number of activities based on region and interests
  getActivityCount(region, interests) {
    const baseCount = {
      europe: 4,
      asia: 5,
      middleEast: 3,
      americas: 4
    };
    
    let count = baseCount[region];
    
    // Adjust based on interests
    if (interests.includes('adventure')) count += 1;
    if (interests.includes('relaxation')) count -= 1;
    if (interests.includes('culture')) count += 1;
    
    return Math.max(2, Math.min(6, count));
  }

  // Generate intelligent meal suggestions (optimized)
  generateMeals(destination, interests, day, region) {
    return {
      breakfast: `${destination} Hotel Breakfast`,
      lunch: `${destination} Local Restaurant`,
      dinner: `${destination} Fine Dining`
    };
  }

  generateBreakfast(destination, region) {
    const breakfastOptions = {
      europe: ["Hotel breakfast", "Local café", "Bakery", "Coffee shop"],
      asia: ["Hotel breakfast", "Local restaurant", "Street food", "Traditional café"],
      middleEast: ["Hotel breakfast", "Local café", "Traditional breakfast", "Coffee shop"],
      americas: ["Hotel breakfast", "Local diner", "Coffee shop", "Breakfast café"]
    };
    
    const option = breakfastOptions[region][Math.floor(Math.random() * breakfastOptions[region].length)];
    return `${destination} ${option}`;
  }

  generateLunch(destination, interests, region) {
    const lunchOptions = {
      europe: ["Local restaurant", "Bistro", "Café", "Traditional eatery"],
      asia: ["Local restaurant", "Street food", "Traditional restaurant", "Modern café"],
      middleEast: ["Local restaurant", "Traditional eatery", "Modern café", "Street food"],
      americas: ["Local restaurant", "Food truck", "Café", "Traditional diner"]
    };
    
    const option = lunchOptions[region][Math.floor(Math.random() * lunchOptions[region].length)];
    return `${destination} ${option}`;
  }

  generateDinner(destination, interests, region) {
    const dinnerOptions = {
      europe: ["Fine dining restaurant", "Traditional bistro", "Wine bar", "Local restaurant"],
      asia: ["Traditional restaurant", "Modern fusion", "Local eatery", "Fine dining"],
      middleEast: ["Traditional restaurant", "Modern dining", "Local eatery", "Luxury restaurant"],
      americas: ["Fine dining", "Local restaurant", "Modern eatery", "Traditional restaurant"]
    };
    
    const option = dinnerOptions[region][Math.floor(Math.random() * dinnerOptions[region].length)];
    return `${destination} ${option}`;
  }

  // Generate accommodation suggestion (optimized)
  generateAccommodation(destination, day, region) {
    return `${destination} Luxury Hotel`;
  }

  // Generate transportation suggestion (optimized)
  generateTransportation(destination, day, region) {
    return `${destination} Private Transfer`;
  }

  // Generate map locations (optimized)
  generateMapLocations(destination, day, region, interests) {
    return [{
      name: `${destination} Main Attraction`,
      coordinates: "40.7128, -74.0060"
    }];
  }

  generateLocationName(destination, interests, region) {
    const locationTypes = {
      museums: ["Museum", "Gallery", "Cultural Center", "Heritage Site"],
      food: ["Restaurant", "Café", "Bistro", "Eatery"],
      shopping: ["Market", "Shopping District", "Mall", "Boutique"],
      culture: ["Cultural Site", "Historic Site", "Temple", "Monument"],
      nature: ["Park", "Garden", "Nature Reserve", "Scenic Point"],
      adventure: ["Adventure Center", "Sports Facility", "Outdoor Area", "Activity Center"],
      beaches: ["Beach", "Coastal Area", "Waterfront", "Seaside"],
      nightlife: ["Bar", "Club", "Entertainment District", "Nightlife Area"],
      relaxation: ["Spa", "Wellness Center", "Relaxation Area", "Peaceful Spot"],
      photography: ["Scenic View", "Photography Spot", "Vantage Point", "Picture Perfect"]
    };
    
    const interest = interests[Math.floor(Math.random() * interests.length)];
    const types = locationTypes[interest] || locationTypes.culture;
    const type = types[Math.floor(Math.random() * types.length)];
    
    return `${destination} ${type}`;
  }

  generateCoordinates(region) {
    // Generate realistic coordinates based on region
    const coordinates = {
      europe: ["48.8566, 2.3522", "51.5074, -0.1278", "41.9028, 12.4964", "41.3851, 2.1734"],
      asia: ["35.6762, 139.6503", "13.7563, 100.5018", "1.3521, 103.8198", "-8.3405, 115.0920"],
      middleEast: ["25.2048, 55.2708", "24.4539, 54.3773", "25.2854, 51.5310", "41.0082, 28.9784"],
      americas: ["40.7128, -74.0060", "34.0522, -118.2437", "25.7617, -80.1918", "43.6532, -79.3832"]
    };
    
    const regionCoords = coordinates[region] || coordinates.europe;
    return regionCoords[Math.floor(Math.random() * regionCoords.length)];
  }

  // Main method to generate complete travel plan
  generateTravelPlan(destination, numberOfDays, interests, startDate) {
    const region = this.getRegion(destination);
    const plan = {
      destination,
      numberOfDays,
      startDate,
      interests,
      region,
      days: []
    };

    for (let day = 1; day <= numberOfDays; day++) {
      const dayPlan = {
        day,
        title: `Day ${day}`,
        activities: this.generateActivities(destination, interests, day, numberOfDays),
        meals: this.generateMeals(destination, interests, day, region),
        accommodation: this.generateAccommodation(destination, day, region),
        transportation: this.generateTransportation(destination, day, region),
        mapLocations: this.generateMapLocations(destination, day, region, interests)
      };

      plan.days.push(dayPlan);
    }

    return plan;
  }
}

// Export singleton instance
export const aiTravelPlanner = new AITravelPlanner(); 