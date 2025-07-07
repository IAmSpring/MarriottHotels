# Recommendation System

This document outlines the comprehensive recommendation system for the Marriott Hotels platform, covering personalized hotel suggestions, content recommendations, and intelligent matching algorithms.

## Table of Contents

- [Recommendation Overview](#recommendation-overview)
- [Recommendation Algorithms](#recommendation-algorithms)
- [User Profiling](#user-profiling)
- [Content Analysis](#content-analysis)
- [Personalization Engine](#personalization-engine)
- [Performance Optimization](#performance-optimization)

## Recommendation Overview

The recommendation system provides personalized hotel suggestions, amenity recommendations, and travel insights based on user preferences, behavior patterns, and contextual information.

### Key Features

- **Personalized Hotel Recommendations**: Suggest hotels based on user preferences
- **Amenity Recommendations**: Recommend relevant amenities and services
- **Travel Insights**: Provide travel tips and local recommendations
- **Seasonal Suggestions**: Adapt recommendations based on seasons and events
- **Collaborative Filtering**: Use community preferences for recommendations
- **Real-time Adaptation**: Update recommendations in real-time

## Recommendation Algorithms

### 1. Collaborative Filtering

Implement collaborative filtering to recommend hotels based on similar user preferences.

#### Algorithm Types:
- **User-based CF**: Find similar users and recommend their preferred hotels
- **Item-based CF**: Find similar hotels and recommend based on user history
- **Matrix Factorization**: Decompose user-item matrix for latent factor discovery

#### Implementation:
```typescript
// Collaborative filtering
const collaborativeFiltering = {
  userSimilarity: (user1, user2) => {
    // Calculate cosine similarity between users
    const user1Preferences = new Set(user1.preferences);
    const user2Preferences = new Set(user2.preferences);
    
    const intersection = new Set([...user1Preferences].filter(x => user2Preferences.has(x)));
    const union = new Set([...user1Preferences, ...user2Preferences]);
    
    return intersection.size / union.size;
  },
  
  findSimilarUsers: (targetUser, allUsers, threshold = 0.3) => {
    const similarUsers = [];
    
    for (const user of allUsers) {
      if (user.id === targetUser.id) continue;
      
      const similarity = collaborativeFiltering.userSimilarity(targetUser, user);
      if (similarity > threshold) {
        similarUsers.push({ user, similarity });
      }
    }
    
    return similarUsers.sort((a, b) => b.similarity - a.similarity);
  },
  
  recommendFromSimilarUsers: (targetUser, similarUsers) => {
    const recommendations = new Map();
    
    for (const { user, similarity } of similarUsers) {
      for (const booking of user.bookingHistory) {
        const hotelId = booking.hotelId;
        const score = similarity * booking.rating;
        
        if (recommendations.has(hotelId)) {
          recommendations.set(hotelId, recommendations.get(hotelId) + score);
        } else {
          recommendations.set(hotelId, score);
        }
      }
    }
    
    return Array.from(recommendations.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([hotelId, score]) => ({ hotelId, score }));
  }
};
```

### 2. Content-Based Filtering

Recommend hotels based on their features and user preferences.

#### Content Features:
- **Location**: Geographic proximity and accessibility
- **Amenities**: Pool, gym, restaurant, spa, etc.
- **Price Range**: Budget, mid-range, luxury
- **Hotel Type**: Business, resort, boutique, etc.
- **Rating**: User ratings and reviews

#### Implementation:
```typescript
// Content-based filtering
const contentBasedFiltering = {
  hotelFeatures: {
    location: {
      city: 'string',
      country: 'string',
      coordinates: 'object',
      accessibility: 'number'
    },
    amenities: {
      pool: 'boolean',
      gym: 'boolean',
      restaurant: 'boolean',
      spa: 'boolean',
      wifi: 'boolean',
      parking: 'boolean'
    },
    pricing: {
      priceRange: 'string', // budget, mid-range, luxury
      averagePrice: 'number',
      seasonalPricing: 'object'
    },
    type: {
      category: 'string', // business, resort, boutique, etc.
      size: 'string', // small, medium, large
      style: 'string' // modern, classic, contemporary
    },
    rating: {
      averageRating: 'number',
      reviewCount: 'number',
      ratingBreakdown: 'object'
    }
  },
  
  calculateSimilarity: (hotel1, hotel2) => {
    let similarity = 0;
    let totalWeight = 0;
    
    // Location similarity
    const locationSimilarity = contentBasedFiltering.calculateLocationSimilarity(hotel1.location, hotel2.location);
    similarity += locationSimilarity * 0.3;
    totalWeight += 0.3;
    
    // Amenities similarity
    const amenitiesSimilarity = contentBasedFiltering.calculateAmenitiesSimilarity(hotel1.amenities, hotel2.amenities);
    similarity += amenitiesSimilarity * 0.25;
    totalWeight += 0.25;
    
    // Price similarity
    const priceSimilarity = contentBasedFiltering.calculatePriceSimilarity(hotel1.pricing, hotel2.pricing);
    similarity += priceSimilarity * 0.2;
    totalWeight += 0.2;
    
    // Type similarity
    const typeSimilarity = contentBasedFiltering.calculateTypeSimilarity(hotel1.type, hotel2.type);
    similarity += typeSimilarity * 0.15;
    totalWeight += 0.15;
    
    // Rating similarity
    const ratingSimilarity = contentBasedFiltering.calculateRatingSimilarity(hotel1.rating, hotel2.rating);
    similarity += ratingSimilarity * 0.1;
    totalWeight += 0.1;
    
    return similarity / totalWeight;
  },
  
  calculateLocationSimilarity: (location1, location2) => {
    // Calculate geographic distance
    const distance = calculateDistance(location1.coordinates, location2.coordinates);
    const maxDistance = 100; // km
    
    return Math.max(0, 1 - (distance / maxDistance));
  },
  
  calculateAmenitiesSimilarity: (amenities1, amenities2) => {
    const amenities1Set = new Set(Object.keys(amenities1).filter(key => amenities1[key]));
    const amenities2Set = new Set(Object.keys(amenities2).filter(key => amenities2[key]));
    
    const intersection = new Set([...amenities1Set].filter(x => amenities2Set.has(x)));
    const union = new Set([...amenities1Set, ...amenities2Set]);
    
    return intersection.size / union.size;
  },
  
  calculatePriceSimilarity: (pricing1, pricing2) => {
    const priceDiff = Math.abs(pricing1.averagePrice - pricing2.averagePrice);
    const maxPriceDiff = 500; // dollars
    
    return Math.max(0, 1 - (priceDiff / maxPriceDiff));
  }
};
```

### 3. Hybrid Recommendation System

Combine multiple recommendation approaches for better results.

#### Hybrid Approaches:
- **Weighted Hybrid**: Combine scores from different algorithms
- **Switching Hybrid**: Use different algorithms for different scenarios
- **Cascade Hybrid**: Apply algorithms in sequence
- **Feature Combination**: Combine features from different algorithms

#### Implementation:
```typescript
// Hybrid recommendation system
const hybridRecommendation = {
  algorithms: {
    collaborative: collaborativeFiltering,
    contentBased: contentBasedFiltering,
    popularity: popularityBasedFiltering
  },
  
  weights: {
    collaborative: 0.4,
    contentBased: 0.4,
    popularity: 0.2
  },
  
  generateHybridRecommendations: async (userId, context) => {
    const user = await getUserProfile(userId);
    const recommendations = {};
    
    // Generate recommendations from each algorithm
    const collaborativeRecs = await hybridRecommendation.algorithms.collaborative.recommendFromSimilarUsers(user, await getSimilarUsers(user));
    const contentBasedRecs = await hybridRecommendation.algorithms.contentBased.recommendBasedOnPreferences(user.preferences);
    const popularityRecs = await hybridRecommendation.algorithms.popularity.getPopularHotels(context);
    
    // Combine recommendations with weights
    for (const rec of collaborativeRecs) {
      recommendations[rec.hotelId] = (recommendations[rec.hotelId] || 0) + rec.score * hybridRecommendation.weights.collaborative;
    }
    
    for (const rec of contentBasedRecs) {
      recommendations[rec.hotelId] = (recommendations[rec.hotelId] || 0) + rec.score * hybridRecommendation.weights.contentBased;
    }
    
    for (const rec of popularityRecs) {
      recommendations[rec.hotelId] = (recommendations[rec.hotelId] || 0) + rec.score * hybridRecommendation.weights.popularity;
    }
    
    // Sort and return top recommendations
    return Object.entries(recommendations)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([hotelId, score]) => ({ hotelId, score }));
  },
  
  adaptWeights: (userBehavior) => {
    // Adapt algorithm weights based on user behavior
    if (userBehavior.prefersPersonalized) {
      hybridRecommendation.weights.collaborative = 0.5;
      hybridRecommendation.weights.contentBased = 0.4;
      hybridRecommendation.weights.popularity = 0.1;
    } else if (userBehavior.prefersPopular) {
      hybridRecommendation.weights.collaborative = 0.2;
      hybridRecommendation.weights.contentBased = 0.3;
      hybridRecommendation.weights.popularity = 0.5;
    }
  }
};
```

## User Profiling

### 1. Preference Learning

Learn user preferences from their behavior and interactions.

#### Preference Categories:
- **Location Preferences**: Preferred cities, regions, countries
- **Amenity Preferences**: Preferred amenities and services
- **Price Preferences**: Budget ranges and spending patterns
- **Style Preferences**: Hotel types and architectural styles
- **Temporal Preferences**: Preferred travel seasons and durations

#### Implementation:
```typescript
// User preference learning
const preferenceLearner = {
  learnFromBookings: (userBookings) => {
    const preferences = {
      locations: new Map(),
      amenities: new Map(),
      priceRanges: new Map(),
      hotelTypes: new Map(),
      travelSeasons: new Map()
    };
    
    for (const booking of userBookings) {
      // Learn location preferences
      const location = booking.hotel.location;
      preferences.locations.set(location, (preferences.locations.get(location) || 0) + 1);
      
      // Learn amenity preferences
      for (const amenity of booking.hotel.amenities) {
        preferences.amenities.set(amenity, (preferences.amenities.get(amenity) || 0) + 1);
      }
      
      // Learn price preferences
      const priceRange = categorizePrice(booking.totalPrice);
      preferences.priceRanges.set(priceRange, (preferences.priceRanges.get(priceRange) || 0) + 1);
      
      // Learn hotel type preferences
      const hotelType = booking.hotel.type;
      preferences.hotelTypes.set(hotelType, (preferences.hotelTypes.get(hotelType) || 0) + 1);
      
      // Learn temporal preferences
      const season = getSeason(booking.checkInDate);
      preferences.travelSeasons.set(season, (preferences.travelSeasons.get(season) || 0) + 1);
    }
    
    return preferences;
  },
  
  learnFromInteractions: (userInteractions) => {
    const preferences = {
      searchPatterns: new Map(),
      clickPatterns: new Map(),
      timeSpent: new Map()
    };
    
    for (const interaction of userInteractions) {
      // Learn search patterns
      if (interaction.type === 'search') {
        const searchTerm = interaction.query;
        preferences.searchPatterns.set(searchTerm, (preferences.searchPatterns.get(searchTerm) || 0) + 1);
      }
      
      // Learn click patterns
      if (interaction.type === 'click') {
        const clickedItem = interaction.item;
        preferences.clickPatterns.set(clickedItem, (preferences.clickPatterns.get(clickedItem) || 0) + 1);
      }
      
      // Learn time spent patterns
      if (interaction.type === 'view') {
        const viewedItem = interaction.item;
        const timeSpent = interaction.duration;
        preferences.timeSpent.set(viewedItem, (preferences.timeSpent.get(viewedItem) || 0) + timeSpent);
      }
    }
    
    return preferences;
  }
};
```

### 2. Behavior Analysis

Analyze user behavior patterns for better recommendations.

#### Behavior Patterns:
- **Search Patterns**: What users search for
- **Click Patterns**: What users click on
- **Time Patterns**: When users are active
- **Session Patterns**: How users navigate
- **Conversion Patterns**: What leads to bookings

#### Implementation:
```typescript
// Behavior analysis
const behaviorAnalyzer = {
  analyzeSearchBehavior: (searchHistory) => {
    const patterns = {
      commonQueries: new Map(),
      searchFrequency: new Map(),
      searchTiming: new Map(),
      searchRefinement: new Map()
    };
    
    for (const search of searchHistory) {
      // Analyze common queries
      patterns.commonQueries.set(search.query, (patterns.commonQueries.get(search.query) || 0) + 1);
      
      // Analyze search frequency
      const date = new Date(search.timestamp).toDateString();
      patterns.searchFrequency.set(date, (patterns.searchFrequency.get(date) || 0) + 1);
      
      // Analyze search timing
      const hour = new Date(search.timestamp).getHours();
      patterns.searchTiming.set(hour, (patterns.searchTiming.get(hour) || 0) + 1);
      
      // Analyze search refinement
      if (search.refinedFrom) {
        patterns.searchRefinement.set(search.refinedFrom, (patterns.searchRefinement.get(search.refinedFrom) || 0) + 1);
      }
    }
    
    return patterns;
  },
  
  analyzeClickBehavior: (clickHistory) => {
    const patterns = {
      clickTargets: new Map(),
      clickSequences: [],
      clickTiming: new Map(),
      conversionPaths: []
    };
    
    for (const click of clickHistory) {
      // Analyze click targets
      patterns.clickTargets.set(click.target, (patterns.clickTargets.get(click.target) || 0) + 1);
      
      // Analyze click timing
      const timeSincePageLoad = click.timestamp - click.pageLoadTime;
      patterns.clickTiming.set(Math.floor(timeSincePageLoad / 1000), (patterns.clickTiming.get(Math.floor(timeSincePageLoad / 1000)) || 0) + 1);
    }
    
    return patterns;
  },
  
  analyzeSessionBehavior: (sessionData) => {
    const patterns = {
      sessionDuration: [],
      pagesPerSession: [],
      bounceRate: 0,
      returnRate: 0,
      conversionRate: 0
    };
    
    for (const session of sessionData) {
      patterns.sessionDuration.push(session.duration);
      patterns.pagesPerSession.push(session.pageCount);
      
      if (session.pageCount === 1) {
        patterns.bounceRate++;
      }
      
      if (session.returning) {
        patterns.returnRate++;
      }
      
      if (session.converted) {
        patterns.conversionRate++;
      }
    }
    
    // Calculate averages
    patterns.bounceRate /= sessionData.length;
    patterns.returnRate /= sessionData.length;
    patterns.conversionRate /= sessionData.length;
    
    return patterns;
  }
};
```

## Content Analysis

### 1. Hotel Content Analysis

Analyze hotel content for better matching and recommendations.

#### Content Analysis Features:
- **Amenity Analysis**: Extract and categorize amenities
- **Review Analysis**: Analyze sentiment and key themes
- **Image Analysis**: Analyze hotel images for style and quality
- **Location Analysis**: Analyze location features and accessibility
- **Pricing Analysis**: Analyze pricing patterns and value

#### Implementation:
```typescript
// Hotel content analysis
const hotelContentAnalyzer = {
  analyzeAmenities: (hotelData) => {
    const amenityCategories = {
      wellness: ['pool', 'gym', 'spa', 'sauna', 'fitness'],
      dining: ['restaurant', 'bar', 'room_service', 'breakfast'],
      business: ['business_center', 'meeting_rooms', 'wifi', 'concierge'],
      family: ['kids_club', 'playground', 'family_rooms', 'babysitting'],
      luxury: ['concierge', 'valet', 'butler', 'private_dining']
    };
    
    const analyzedAmenities = {};
    
    for (const [category, amenities] of Object.entries(amenityCategories)) {
      analyzedAmenities[category] = hotelData.amenities.filter(amenity => 
        amenities.includes(amenity.toLowerCase())
      );
    }
    
    return analyzedAmenities;
  },
  
  analyzeReviews: (reviews) => {
    const analysis = {
      averageRating: 0,
      sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
      commonThemes: new Map(),
      keywordFrequency: new Map()
    };
    
    let totalRating = 0;
    
    for (const review of reviews) {
      totalRating += review.rating;
      
      // Analyze sentiment
      const sentiment = sentimentAnalyzer.analyzeSentiment(review.text);
      analysis.sentimentBreakdown[sentiment.sentiment]++;
      
      // Extract themes and keywords
      const themes = hotelContentAnalyzer.extractThemes(review.text);
      for (const theme of themes) {
        analysis.commonThemes.set(theme, (analysis.commonThemes.get(theme) || 0) + 1);
      }
      
      const keywords = hotelContentAnalyzer.extractKeywords(review.text);
      for (const keyword of keywords) {
        analysis.keywordFrequency.set(keyword, (analysis.keywordFrequency.get(keyword) || 0) + 1);
      }
    }
    
    analysis.averageRating = totalRating / reviews.length;
    
    return analysis;
  },
  
  extractThemes: (text) => {
    const themes = [
      'cleanliness', 'service', 'location', 'comfort', 'value',
      'amenities', 'staff', 'food', 'noise', 'maintenance'
    ];
    
    const foundThemes = [];
    const lowerText = text.toLowerCase();
    
    for (const theme of themes) {
      if (lowerText.includes(theme)) {
        foundThemes.push(theme);
      }
    }
    
    return foundThemes;
  },
  
  extractKeywords: (text) => {
    // Simple keyword extraction
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    
    return words.filter(word => 
      word.length > 3 && !stopWords.has(word)
    );
  }
};
```

### 2. Seasonal Content Analysis

Analyze content for seasonal patterns and recommendations.

#### Seasonal Analysis:
- **Seasonal Pricing**: Price variations by season
- **Seasonal Amenities**: Amenities that vary by season
- **Seasonal Events**: Local events and festivals
- **Weather Patterns**: Weather-based recommendations
- **Holiday Patterns**: Holiday-specific recommendations

#### Implementation:
```typescript
// Seasonal content analysis
const seasonalAnalyzer = {
  analyzeSeasonalPricing: (hotelData) => {
    const seasonalPricing = {
      spring: { average: 0, count: 0 },
      summer: { average: 0, count: 0 },
      fall: { average: 0, count: 0 },
      winter: { average: 0, count: 0 }
    };
    
    for (const price of hotelData.pricing) {
      const season = seasonalAnalyzer.getSeason(price.date);
      seasonalPricing[season].average += price.amount;
      seasonalPricing[season].count++;
    }
    
    // Calculate averages
    for (const season of Object.keys(seasonalPricing)) {
      if (seasonalPricing[season].count > 0) {
        seasonalPricing[season].average /= seasonalPricing[season].count;
      }
    }
    
    return seasonalPricing;
  },
  
  analyzeSeasonalAmenities: (hotelData) => {
    const seasonalAmenities = {
      spring: ['outdoor_dining', 'garden_access', 'spring_activities'],
      summer: ['pool', 'beach_access', 'summer_activities', 'outdoor_events'],
      fall: ['indoor_activities', 'fall_events', 'seasonal_dining'],
      winter: ['indoor_pool', 'spa', 'winter_activities', 'fireplace']
    };
    
    const availableAmenities = new Set(hotelData.amenities);
    const seasonalAvailability = {};
    
    for (const [season, amenities] of Object.entries(seasonalAmenities)) {
      seasonalAvailability[season] = amenities.filter(amenity => 
        availableAmenities.has(amenity)
      );
    }
    
    return seasonalAvailability;
  },
  
  getSeason: (date) => {
    const month = new Date(date).getMonth();
    
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }
};
```

## Personalization Engine

### 1. Dynamic Personalization

Provide real-time personalization based on current context.

#### Personalization Factors:
- **Current Location**: User's current location
- **Time of Day**: Current time and day of week
- **Weather**: Current weather conditions
- **Events**: Local events and happenings
- **User State**: User's current session and behavior

#### Implementation:
```typescript
// Dynamic personalization
const dynamicPersonalizer = {
  personalizeRecommendations: async (userId, context) => {
    const userProfile = await getUserProfile(userId);
    const personalizedRecs = [];
    
    // Get base recommendations
    const baseRecommendations = await hybridRecommendation.generateHybridRecommendations(userId, context);
    
    for (const rec of baseRecommendations) {
      let personalizedScore = rec.score;
      
      // Adjust for current location
      if (context.currentLocation) {
        const locationAdjustment = dynamicPersonalizer.calculateLocationAdjustment(
          rec.hotelId, context.currentLocation
        );
        personalizedScore *= locationAdjustment;
      }
      
      // Adjust for time of day
      const timeAdjustment = dynamicPersonalizer.calculateTimeAdjustment(
        rec.hotelId, context.currentTime
      );
      personalizedScore *= timeAdjustment;
      
      // Adjust for weather
      if (context.weather) {
        const weatherAdjustment = dynamicPersonalizer.calculateWeatherAdjustment(
          rec.hotelId, context.weather
        );
        personalizedScore *= weatherAdjustment;
      }
      
      // Adjust for events
      if (context.localEvents) {
        const eventAdjustment = dynamicPersonalizer.calculateEventAdjustment(
          rec.hotelId, context.localEvents
        );
        personalizedScore *= eventAdjustment;
      }
      
      personalizedRecs.push({
        ...rec,
        score: personalizedScore
      });
    }
    
    return personalizedRecs.sort((a, b) => b.score - a.score);
  },
  
  calculateLocationAdjustment: (hotelId, userLocation) => {
    const hotelLocation = getHotelLocation(hotelId);
    const distance = calculateDistance(userLocation, hotelLocation);
    
    // Prefer hotels closer to user's current location
    const maxDistance = 50; // km
    return Math.max(0.5, 1 - (distance / maxDistance));
  },
  
  calculateTimeAdjustment: (hotelId, currentTime) => {
    const hour = currentTime.getHours();
    
    // Adjust based on time of day
    if (hour >= 6 && hour <= 9) {
      // Morning - prefer hotels with good breakfast
      return hasAmenity(hotelId, 'breakfast') ? 1.2 : 0.8;
    } else if (hour >= 18 && hour <= 21) {
      // Evening - prefer hotels with restaurants
      return hasAmenity(hotelId, 'restaurant') ? 1.2 : 0.8;
    }
    
    return 1.0;
  },
  
  calculateWeatherAdjustment: (hotelId, weather) => {
    const { condition, temperature } = weather;
    
    if (condition === 'rain' || condition === 'snow') {
      // Prefer hotels with indoor amenities
      const indoorAmenities = ['indoor_pool', 'spa', 'gym', 'business_center'];
      const hasIndoorAmenities = indoorAmenities.some(amenity => hasAmenity(hotelId, amenity));
      return hasIndoorAmenities ? 1.3 : 0.7;
    }
    
    if (temperature > 25) {
      // Hot weather - prefer hotels with pool
      return hasAmenity(hotelId, 'pool') ? 1.2 : 0.9;
    }
    
    return 1.0;
  }
};
```

### 2. Contextual Recommendations

Provide recommendations based on specific contexts and scenarios.

#### Context Types:
- **Business Travel**: Business-focused recommendations
- **Leisure Travel**: Leisure-focused recommendations
- **Family Travel**: Family-friendly recommendations
- **Romantic Travel**: Romantic getaway recommendations
- **Budget Travel**: Budget-conscious recommendations

#### Implementation:
```typescript
// Contextual recommendations
const contextualRecommender = {
  contexts: {
    business: {
      priorityAmenities: ['wifi', 'business_center', 'concierge', 'meeting_rooms'],
      priorityLocation: 'city_center',
      priorityFeatures: ['quiet_rooms', 'work_spaces', 'quick_checkin']
    },
    
    leisure: {
      priorityAmenities: ['pool', 'spa', 'restaurant', 'activities'],
      priorityLocation: 'scenic_areas',
      priorityFeatures: ['relaxation', 'entertainment', 'local_experiences']
    },
    
    family: {
      priorityAmenities: ['kids_club', 'family_rooms', 'pool', 'restaurant'],
      priorityLocation: 'family_friendly',
      priorityFeatures: ['safety', 'entertainment', 'convenience']
    },
    
    romantic: {
      priorityAmenities: ['spa', 'restaurant', 'room_service', 'romantic_amenities'],
      priorityLocation: 'romantic_settings',
      priorityFeatures: ['privacy', 'luxury', 'romantic_experiences']
    },
    
    budget: {
      priorityAmenities: ['essential_amenities'],
      priorityLocation: 'value_locations',
      priorityFeatures: ['affordability', 'value', 'essential_services']
    }
  },
  
  getContextualRecommendations: (context, userPreferences) => {
    const contextualRecs = [];
    const contextConfig = contextualRecommender.contexts[context.type];
    
    if (!contextConfig) return [];
    
    // Get hotels matching context
    const matchingHotels = getHotelsByContext(contextConfig, context.location);
    
    for (const hotel of matchingHotels) {
      let score = 1.0;
      
      // Score based on priority amenities
      for (const amenity of contextConfig.priorityAmenities) {
        if (hasAmenity(hotel.id, amenity)) {
          score += 0.2;
        }
      }
      
      // Score based on priority features
      for (const feature of contextConfig.priorityFeatures) {
        if (hasFeature(hotel.id, feature)) {
          score += 0.15;
        }
      }
      
      // Adjust for user preferences
      score *= contextualRecommender.adjustForUserPreferences(hotel, userPreferences);
      
      contextualRecs.push({
        hotelId: hotel.id,
        score,
        context: context.type,
        reasoning: contextualRecommender.generateReasoning(hotel, context.type)
      });
    }
    
    return contextualRecs.sort((a, b) => b.score - a.score);
  },
  
  adjustForUserPreferences: (hotel, userPreferences) => {
    let adjustment = 1.0;
    
    // Adjust for price preferences
    if (userPreferences.priceRange) {
      const priceMatch = hotel.priceRange === userPreferences.priceRange;
      adjustment *= priceMatch ? 1.2 : 0.8;
    }
    
    // Adjust for amenity preferences
    for (const preferredAmenity of userPreferences.amenities || []) {
      if (hasAmenity(hotel.id, preferredAmenity)) {
        adjustment *= 1.1;
      }
    }
    
    return adjustment;
  },
  
  generateReasoning: (hotel, contextType) => {
    const reasoning = {
      business: `Perfect for business travelers with ${hotel.amenities.filter(a => ['wifi', 'business_center'].includes(a)).join(', ')}`,
      leisure: `Great for leisure with ${hotel.amenities.filter(a => ['pool', 'spa'].includes(a)).join(', ')}`,
      family: `Family-friendly with ${hotel.amenities.filter(a => ['kids_club', 'family_rooms'].includes(a)).join(', ')}`,
      romantic: `Romantic getaway with ${hotel.amenities.filter(a => ['spa', 'romantic_amenities'].includes(a)).join(', ')}`,
      budget: `Great value with essential amenities`
    };
    
    return reasoning[contextType] || 'Recommended based on your preferences';
  }
};
```

## Performance Optimization

### 1. Caching Strategy

Implement comprehensive caching for recommendation performance.

#### Caching Levels:
- **User Profile Cache**: Cache user preferences and behavior
- **Recommendation Cache**: Cache generated recommendations
- **Content Cache**: Cache hotel content and analysis
- **Context Cache**: Cache contextual information

#### Implementation:
```typescript
// Recommendation caching
const recommendationCache = {
  caches: {
    userProfiles: new Map(),
    recommendations: new Map(),
    content: new Map(),
    context: new Map()
  },
  
  cacheUserProfile: (userId, profile) => {
    recommendationCache.caches.userProfiles.set(userId, {
      profile,
      timestamp: Date.now(),
      ttl: 3600000 // 1 hour
    });
  },
  
  getCachedUserProfile: (userId) => {
    const cached = recommendationCache.caches.userProfiles.get(userId);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.profile;
    }
    return null;
  },
  
  cacheRecommendations: (key, recommendations) => {
    recommendationCache.caches.recommendations.set(key, {
      recommendations,
      timestamp: Date.now(),
      ttl: 1800000 // 30 minutes
    });
  },
  
  getCachedRecommendations: (key) => {
    const cached = recommendationCache.caches.recommendations.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.recommendations;
    }
    return null;
  },
  
  invalidateCache: (cacheType, key) => {
    if (recommendationCache.caches[cacheType]) {
      recommendationCache.caches[cacheType].delete(key);
    }
  }
};
```

### 2. Real-time Updates

Implement real-time updates for recommendation freshness.

#### Update Triggers:
- **User Behavior**: Update on user interactions
- **Content Changes**: Update on hotel content changes
- **Market Changes**: Update on pricing or availability changes
- **Seasonal Changes**: Update on seasonal factors

#### Implementation:
```typescript
// Real-time updates
const realTimeUpdater = {
  updateTriggers: {
    userInteraction: (userId, interaction) => {
      // Update user profile based on interaction
      const userProfile = getUserProfile(userId);
      updateUserProfile(userId, interaction);
      
      // Invalidate related caches
      recommendationCache.invalidateCache('recommendations', userId);
      recommendationCache.invalidateCache('userProfiles', userId);
    },
    
    contentChange: (hotelId, changes) => {
      // Update hotel content
      updateHotelContent(hotelId, changes);
      
      // Invalidate related caches
      recommendationCache.invalidateCache('content', hotelId);
      
      // Update affected recommendations
      updateAffectedRecommendations(hotelId);
    },
    
    marketChange: (marketData) => {
      // Update market information
      updateMarketData(marketData);
      
      // Update pricing-based recommendations
      updatePricingRecommendations();
    }
  },
  
  updateAffectedRecommendations: (hotelId) => {
    // Find users who have this hotel in their recommendations
    const affectedUsers = findUsersWithHotelInRecommendations(hotelId);
    
    for (const userId of affectedUsers) {
      // Regenerate recommendations for affected users
      const newRecommendations = generateRecommendations(userId);
      recommendationCache.cacheRecommendations(userId, newRecommendations);
    }
  }
};
``` 