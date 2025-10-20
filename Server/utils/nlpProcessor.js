// Advanced NLP Processing Utilities
class NLPProcessor {
  // Enhanced sentiment analysis using a more sophisticated approach
  static analyzeSentiment(text) {
    // Expanded sentiment dictionaries
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'perfect', 'awesome',
      'brilliant', 'outstanding', 'superb', 'magnificent', 'incredible', 'marvelous', 'splendid', 'fabulous',
      'terrific', 'stupendous', 'phenomenal', 'exceptional', 'remarkable', 'extraordinary', 'spectacular',
      'delightful', 'pleasant', 'enjoyable', 'satisfactory', 'fine', 'nice', 'pleasing', 'agreeable',
      'gratifying', 'comforting', 'reassuring', 'encouraging', 'promising', 'hopeful', 'optimistic'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'worst', 'annoying', 'expensive',
      'poor', 'mediocre', 'inferior', 'unsatisfactory', 'disappointing', 'frustrating', 'irritating',
      'aggravating', 'bothersome', 'troublesome', 'problematic', 'difficult', 'challenging', 'complicated',
      'complex', 'confusing', 'misleading', 'deceptive', 'unreliable', 'ineffective', 'useless',
      'worthless', 'pointless', 'futile', 'vain', 'empty', 'hollow', 'superficial', 'shallow'
    ];
    
    // Intensifiers that amplify sentiment
    const intensifiers = [
      'very', 'extremely', 'incredibly', 'absolutely', 'totally', 'completely', 'utterly', 'entirely',
      'fully', 'wholly', 'really', 'quite', 'rather', 'fairly', 'moderately', 'somewhat', 'slightly'
    ];
    
    // Negation words that reverse sentiment
    const negations = ['not', 'no', 'never', 'neither', 'nowhere', 'nobody', 'nothing', 'none'];
    
    let score = 0;
    const words = text.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let wordScore = 0;
      
      // Check for positive words
      if (positiveWords.includes(word)) {
        wordScore = 1;
      }
      // Check for negative words
      else if (negativeWords.includes(word)) {
        wordScore = -1;
      }
      
      // Check for intensifiers in the previous position
      if (i > 0 && intensifiers.includes(words[i - 1])) {
        wordScore *= 2; // Double the sentiment impact
      }
      
      // Check for negations in the previous position
      if (i > 0 && negations.includes(words[i - 1])) {
        wordScore *= -1; // Reverse the sentiment
      }
      
      score += wordScore;
    }
    
    // Normalize score based on text length
    const normalizedScore = score / words.length;
    
    if (normalizedScore > 0.1) return 'positive';
    if (normalizedScore < -0.1) return 'negative';
    return 'neutral';
  }
  
  // Enhanced entity extraction with regex patterns
  static extractEntities(text) {
    const entities = {};
    
    // Extract destinations (cities, countries) - more comprehensive regex
    const destinationRegex = /\b(?:[A-Z][a-z]+(?:\s[A-Z][a-z]+)*,?\s*(?:[A-Z]{2}|[A-Z][a-z]+))\b/g;
    const destinationMatches = text.match(destinationRegex);
    if (destinationMatches) {
      entities.destinations = [...new Set(destinationMatches)]; // Remove duplicates
    }
    
    // Extract dates (multiple formats)
    const dateRegex = /\b(?:(?:\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|(?:\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})|(?:\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}))\b/gi;
    const dateMatches = text.match(dateRegex);
    if (dateMatches) {
      entities.dates = [...new Set(dateMatches)];
    }
    
    // Extract budget figures (various currencies)
    const budgetRegex = /\b(?:\$\d+(?:,\d{3})*(?:\.\d{2})?|(?:\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|EUR|GBP|JPY|CAD|AUD|CHF|CNY|INR))\b/gi;
    const budgetMatches = text.match(budgetRegex);
    if (budgetMatches) {
      entities.budgets = [...new Set(budgetMatches)];
    }
    
    // Extract activities and interests
    const activityKeywords = [
      'beach', 'mountain', 'hiking', 'sightseeing', 'museum', 'shopping', 'food', 'culture', 
      'adventure', 'relaxation', 'nightlife', 'history', 'architecture', 'nature', 'wildlife',
      'sports', 'music', 'art', 'photography', 'spa', 'cruise', 'road trip', 'backpacking'
    ];
    const activities = activityKeywords.filter(activity => 
      new RegExp(`\\b${activity}\\b`, 'i').test(text)
    );
    if (activities.length > 0) {
      entities.activities = activities;
    }
    
    // Extract traveler types
    const travelerTypeKeywords = [
      'solo', 'couple', 'family', 'friends', 'business', 'group', 'luxury', 'budget',
      'backpacker', 'family-friendly', 'romantic', 'adventure', 'cultural', 'eco'
    ];
    const travelerTypes = travelerTypeKeywords.filter(type => 
      new RegExp(`\\b${type}\\b`, 'i').test(text)
    );
    if (travelerTypes.length > 0) {
      entities.travelerTypes = travelerTypes;
    }
    
    return entities;
  }
  
  // Intent classification based on keywords
  static classifyIntent(text) {
    const intents = {
      'destination_inquiry': ['where to go', 'best places', 'recommend', 'suggest', 'destinations', 'places to visit'],
      'booking_inquiry': ['book', 'reserve', 'price', 'cost', 'how much', 'availability', 'vacancy'],
      'itinerary_request': ['plan', 'itinerary', 'schedule', 'agenda', 'trip plan', 'travel plan'],
      'weather_inquiry': ['weather', 'temperature', 'climate', 'season', 'rain', 'sun'],
      'cultural_inquiry': ['culture', 'tradition', 'local', 'custom', 'festival', 'event'],
      'activity_inquiry': ['things to do', 'activities', 'attractions', 'sightseeing', 'tours'],
      'accommodation_inquiry': ['hotel', 'accommodation', 'stay', 'lodging', 'resort', 'airbnb'],
      'transportation_inquiry': ['flight', 'transport', 'bus', 'train', 'car', 'rental', 'airport'],
      'food_inquiry': ['restaurant', 'food', 'cuisine', 'eat', 'dining', 'local dish'],
      'budget_inquiry': ['budget', 'cheap', 'expensive', 'affordable', 'cost', 'price range']
    };
    
    const lowerText = text.toLowerCase();
    const detectedIntents = [];
    
    for (const [intent, keywords] of Object.entries(intents)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          detectedIntents.push(intent);
          break; // One match is enough
        }
      }
    }
    
    return detectedIntents.length > 0 ? detectedIntents : ['general_inquiry'];
  }
  
  // Disambiguation for unclear requests
  static disambiguateRequest(text, context) {
    const clarificationQuestions = {
      destination: "Could you specify which destination you're interested in?",
      date: "When are you planning to travel?",
      budget: "What is your budget range for this trip?",
      activities: "What kind of activities are you interested in?",
      accommodation: "What type of accommodation are you looking for?",
      travelers: "How many people will be traveling?",
      duration: "How long is your trip planned for?"
    };
    
    // Check for ambiguous references
    if (text.includes('it') || text.includes('that') || text.includes('this')) {
      if (!context.lastDestination) {
        return clarificationQuestions.destination;
      }
    }
    
    // Check for missing key information
    const entities = this.extractEntities(text);
    
    if (!entities.destinations && !context.lastDestination) {
      return clarificationQuestions.destination;
    }
    
    if (!entities.dates) {
      return clarificationQuestions.date;
    }
    
    return null; // No clarification needed
  }
}

export default NLPProcessor;