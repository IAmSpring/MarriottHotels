# Natural Language Processing

This document outlines the comprehensive natural language processing (NLP) implementation for the Marriott Hotels platform, covering text analysis, language understanding, and intelligent response generation.

## Table of Contents

- [NLP Overview](#nlp-overview)
- [Text Processing](#text-processing)
- [Language Understanding](#language-understanding)
- [Sentiment Analysis](#sentiment-analysis)
- [Entity Recognition](#entity-recognition)
- [Response Generation](#response-generation)

## NLP Overview

The NLP system provides intelligent text analysis and understanding capabilities, enabling the platform to process user queries, extract meaning, and generate appropriate responses.

### Key Features

- **Text Analysis**: Analyze and understand user input
- **Intent Recognition**: Identify user intentions from text
- **Entity Extraction**: Extract relevant information from text
- **Sentiment Analysis**: Understand user sentiment and emotions
- **Context Understanding**: Maintain conversation context
- **Multi-language Support**: Process multiple languages

## Text Processing

### 1. Text Preprocessing

Implement comprehensive text preprocessing for optimal NLP performance.

#### Preprocessing Steps:
- **Tokenization**: Split text into tokens
- **Normalization**: Standardize text format
- **Stop Word Removal**: Remove common words
- **Stemming/Lemmatization**: Reduce words to root form
- **Case Normalization**: Standardize text case

#### Implementation:
```typescript
// Text preprocessing
const textPreprocessor = {
  tokenize: (text) => {
    // Split text into tokens
    return text.toLowerCase()
      .split(/\s+/)
      .filter(token => token.length > 0);
  },
  
  normalize: (text) => {
    // Normalize text format
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },
  
  removeStopWords: (tokens) => {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);
    
    return tokens.filter(token => !stopWords.has(token));
  },
  
  stem: (tokens) => {
    // Simple stemming algorithm
    return tokens.map(token => {
      // Remove common suffixes
      if (token.endsWith('ing')) {
        return token.slice(0, -3);
      }
      if (token.endsWith('ed')) {
        return token.slice(0, -2);
      }
      if (token.endsWith('s')) {
        return token.slice(0, -1);
      }
      return token;
    });
  },
  
  preprocess: (text) => {
    const normalized = textPreprocessor.normalize(text);
    const tokens = textPreprocessor.tokenize(normalized);
    const filteredTokens = textPreprocessor.removeStopWords(tokens);
    const stemmedTokens = textPreprocessor.stem(filteredTokens);
    
    return {
      original: text,
      normalized,
      tokens: stemmedTokens,
      processed: stemmedTokens.join(' ')
    };
  }
};
```

### 2. Language Detection

Detect the language of user input for appropriate processing.

#### Supported Languages:
- **English**: Primary language
- **Spanish**: Secondary language
- **French**: Secondary language
- **German**: Secondary language
- **Chinese**: Secondary language

#### Implementation:
```typescript
// Language detection
const languageDetector = {
  languagePatterns: {
    english: {
      patterns: [
        /the|and|or|but|in|on|at|to|for|of|with|by/gi,
        /is|are|was|were|be|been|being/gi,
        /have|has|had|do|does|did/gi
      ],
      weight: 1.0
    },
    spanish: {
      patterns: [
        /el|la|los|las|y|o|pero|en|con|por|para|de/gi,
        /es|son|era|eran|ser|sido|siendo/gi,
        /tener|tiene|tenido|hacer|hace/hecho/gi
      ],
      weight: 0.8
    },
    french: {
      patterns: [
        /le|la|les|et|ou|mais|dans|avec|pour|de/gi,
        /est|sont|était|étaient|être|été/gi,
        /avoir|a|eu|faire|fait/gi
      ],
      weight: 0.8
    }
  },
  
  detectLanguage: (text) => {
    const scores = {};
    
    for (const [language, config] of Object.entries(languageDetector.languagePatterns)) {
      let score = 0;
      
      for (const pattern of config.patterns) {
        const matches = text.match(pattern);
        if (matches) {
          score += matches.length * config.weight;
        }
      }
      
      scores[language] = score;
    }
    
    // Return language with highest score
    const detectedLanguage = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return {
      language: detectedLanguage,
      confidence: scores[detectedLanguage] / text.length,
      scores
    };
  }
};
```

## Language Understanding

### 1. Intent Recognition

Identify user intentions from natural language input.

#### Intent Categories:
- **Hotel Search**: Find hotels by location, amenities, dates
- **Booking Management**: Make, modify, or cancel bookings
- **Information Requests**: Get hotel details, policies, services
- **Support Requests**: Customer service and troubleshooting
- **Recommendations**: Personalized suggestions
- **Navigation**: Navigate to different sections

#### Implementation:
```typescript
// Intent recognition
const intentRecognizer = {
  intents: {
    hotel_search: {
      patterns: [
        'find hotels in {location}',
        'search for hotels',
        'show me hotels',
        'hotels near {location}',
        'looking for hotels',
        'need a hotel'
      ],
      confidence: 0.8,
      entities: ['location', 'dates', 'amenities', 'price_range']
    },
    
    booking: {
      patterns: [
        'book a room',
        'make a reservation',
        'reserve a hotel',
        'book for {dates}',
        'need a reservation',
        'want to book'
      ],
      confidence: 0.9,
      entities: ['dates', 'guests', 'room_type', 'hotel_id']
    },
    
    information: {
      patterns: [
        'hotel information',
        'what amenities',
        'check-in time',
        'parking available',
        'tell me about',
        'what does this hotel have'
      ],
      confidence: 0.7,
      entities: ['hotel_id', 'amenity_type', 'information_type']
    },
    
    support: {
      patterns: [
        'need help',
        'customer service',
        'having trouble',
        'problem with',
        'can\'t book',
        'error occurred'
      ],
      confidence: 0.8,
      entities: ['issue_type', 'error_message']
    },
    
    recommendations: {
      patterns: [
        'recommend',
        'suggest',
        'best hotels',
        'top rated',
        'popular',
        'trending'
      ],
      confidence: 0.7,
      entities: ['preference_type', 'location', 'budget']
    }
  },
  
  recognizeIntent: (text) => {
    const preprocessed = textPreprocessor.preprocess(text);
    const results = [];
    
    for (const [intentName, intent] of Object.entries(intentRecognizer.intents)) {
      let maxScore = 0;
      let bestMatch = null;
      
      for (const pattern of intent.patterns) {
        const score = intentRecognizer.calculateSimilarity(preprocessed.processed, pattern);
        if (score > maxScore) {
          maxScore = score;
          bestMatch = pattern;
        }
      }
      
      if (maxScore > intent.confidence) {
        results.push({
          intent: intentName,
          confidence: maxScore,
          pattern: bestMatch,
          entities: intent.entities
        });
      }
    }
    
    // Sort by confidence and return top result
    results.sort((a, b) => b.confidence - a.confidence);
    return results[0] || { intent: 'unknown', confidence: 0 };
  },
  
  calculateSimilarity: (text, pattern) => {
    // Simple similarity calculation using word overlap
    const textWords = new Set(text.split(' '));
    const patternWords = new Set(pattern.replace(/\{[^}]+\}/g, '').split(' '));
    
    const intersection = new Set([...textWords].filter(x => patternWords.has(x)));
    const union = new Set([...textWords, ...patternWords]);
    
    return intersection.size / union.size;
  }
};
```

### 2. Context Understanding

Maintain and understand conversation context for better responses.

#### Context Elements:
- **Conversation History**: Previous messages and responses
- **User Preferences**: Stored user preferences and settings
- **Session State**: Current session information
- **Temporal Context**: Time-based context (dates, seasons)
- **Geographic Context**: Location-based context

#### Implementation:
```typescript
// Context understanding
const contextManager = {
  context: {
    conversationHistory: [],
    userPreferences: {},
    sessionState: {},
    temporalContext: {},
    geographicContext: {}
  },
  
  updateContext: (message, response) => {
    // Update conversation history
    contextManager.context.conversationHistory.push({
      message,
      response,
      timestamp: Date.now()
    });
    
    // Keep only last 10 messages
    if (contextManager.context.conversationHistory.length > 10) {
      contextManager.context.conversationHistory.shift();
    }
  },
  
  extractContext: (text) => {
    const context = {
      temporal: contextManager.extractTemporalContext(text),
      geographic: contextManager.extractGeographicContext(text),
      preferences: contextManager.extractPreferences(text)
    };
    
    return context;
  },
  
  extractTemporalContext: (text) => {
    const temporalPatterns = {
      today: /today|now/i,
      tomorrow: /tomorrow/i,
      next_week: /next week/i,
      next_month: /next month/i,
      weekend: /weekend/i,
      specific_date: /(\d{1,2}\/\d{1,2}\/\d{4})/g
    };
    
    const temporalContext = {};
    
    for (const [key, pattern] of Object.entries(temporalPatterns)) {
      if (pattern.test(text)) {
        temporalContext[key] = true;
      }
    }
    
    return temporalContext;
  },
  
  extractGeographicContext: (text) => {
    const locationPatterns = [
      /in\s+([A-Za-z\s]+)/i,
      /near\s+([A-Za-z\s]+)/i,
      /at\s+([A-Za-z\s]+)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        return { location: match[1].trim() };
      }
    }
    
    return {};
  },
  
  extractPreferences: (text) => {
    const preferencePatterns = {
      budget: /budget|cheap|expensive|affordable/i,
      luxury: /luxury|premium|high-end|upscale/i,
      family: /family|kids|children/i,
      business: /business|corporate|work/i,
      romantic: /romantic|couple|honeymoon/i
    };
    
    const preferences = {};
    
    for (const [key, pattern] of Object.entries(preferencePatterns)) {
      if (pattern.test(text)) {
        preferences[key] = true;
      }
    }
    
    return preferences;
  }
};
```

## Sentiment Analysis

### 1. Sentiment Detection

Analyze user sentiment to provide appropriate responses.

#### Sentiment Categories:
- **Positive**: Happy, satisfied, excited
- **Negative**: Frustrated, angry, disappointed
- **Neutral**: Indifferent, factual, informational
- **Mixed**: Combination of positive and negative

#### Implementation:
```typescript
// Sentiment analysis
const sentimentAnalyzer = {
  positiveWords: new Set([
    'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect',
    'good', 'nice', 'beautiful', 'love', 'like', 'enjoy', 'happy',
    'satisfied', 'pleased', 'impressed', 'outstanding', 'superb'
  ]),
  
  negativeWords: new Set([
    'bad', 'terrible', 'awful', 'horrible', 'disappointing', 'frustrated',
    'angry', 'upset', 'annoyed', 'hate', 'dislike', 'poor', 'worst',
    'unhappy', 'dissatisfied', 'displeased', 'furious', 'livid'
  ]),
  
  intensityWords: new Set([
    'very', 'extremely', 'really', 'so', 'quite', 'rather',
    'slightly', 'somewhat', 'barely', 'hardly'
  ]),
  
  analyzeSentiment: (text) => {
    const tokens = textPreprocessor.tokenize(text.toLowerCase());
    let positiveScore = 0;
    let negativeScore = 0;
    let intensity = 1;
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      // Check for intensity modifiers
      if (sentimentAnalyzer.intensityWords.has(token)) {
        intensity = 1.5;
        continue;
      }
      
      // Check for positive words
      if (sentimentAnalyzer.positiveWords.has(token)) {
        positiveScore += intensity;
        intensity = 1;
      }
      
      // Check for negative words
      if (sentimentAnalyzer.negativeWords.has(token)) {
        negativeScore += intensity;
        intensity = 1;
      }
    }
    
    // Calculate overall sentiment
    const totalScore = positiveScore - negativeScore;
    
    if (totalScore > 1) {
      return { sentiment: 'positive', score: totalScore };
    } else if (totalScore < -1) {
      return { sentiment: 'negative', score: totalScore };
    } else {
      return { sentiment: 'neutral', score: totalScore };
    }
  },
  
  getSentimentResponse: (sentiment) => {
    switch (sentiment.sentiment) {
      case 'positive':
        return {
          empathetic: true,
          tone: 'enthusiastic',
          response: 'I\'m glad you\'re having a great experience!'
        };
      case 'negative':
        return {
          empathetic: true,
          tone: 'supportive',
          response: 'I understand your frustration. Let me help you resolve this.'
        };
      default:
        return {
          empathetic: false,
          tone: 'neutral',
          response: null
        };
    }
  }
};
```

### 2. Emotion Detection

Detect specific emotions in user input for better understanding.

#### Emotion Categories:
- **Joy**: Happiness, excitement, satisfaction
- **Anger**: Frustration, irritation, rage
- **Sadness**: Disappointment, grief, melancholy
- **Fear**: Anxiety, worry, concern
- **Surprise**: Astonishment, amazement, shock
- **Disgust**: Aversion, repulsion, dislike

#### Implementation:
```typescript
// Emotion detection
const emotionDetector = {
  emotionWords: {
    joy: new Set([
      'happy', 'excited', 'thrilled', 'delighted', 'joyful', 'cheerful',
      'pleased', 'satisfied', 'content', 'elated', 'ecstatic'
    ]),
    anger: new Set([
      'angry', 'furious', 'mad', 'irritated', 'annoyed', 'frustrated',
      'enraged', 'livid', 'outraged', 'infuriated'
    ]),
    sadness: new Set([
      'sad', 'disappointed', 'upset', 'depressed', 'melancholy',
      'grief', 'sorrow', 'unhappy', 'miserable'
    ]),
    fear: new Set([
      'afraid', 'scared', 'worried', 'anxious', 'nervous', 'terrified',
      'frightened', 'concerned', 'apprehensive'
    ]),
    surprise: new Set([
      'surprised', 'shocked', 'amazed', 'astonished', 'stunned',
      'bewildered', 'perplexed', 'confused'
    ]),
    disgust: new Set([
      'disgusted', 'repulsed', 'revolted', 'appalled', 'horrified',
      'sickened', 'nauseated'
    ])
  },
  
  detectEmotion: (text) => {
    const tokens = textPreprocessor.tokenize(text.toLowerCase());
    const emotionScores = {};
    
    // Initialize scores
    for (const emotion of Object.keys(emotionDetector.emotionWords)) {
      emotionScores[emotion] = 0;
    }
    
    // Calculate emotion scores
    for (const token of tokens) {
      for (const [emotion, words] of Object.entries(emotionDetector.emotionWords)) {
        if (words.has(token)) {
          emotionScores[emotion]++;
        }
      }
    }
    
    // Find dominant emotion
    const dominantEmotion = Object.entries(emotionScores)
      .sort(([,a], [,b]) => b - a)[0];
    
    return {
      emotion: dominantEmotion[0],
      confidence: dominantEmotion[1] / tokens.length,
      scores: emotionScores
    };
  }
};
```

## Entity Recognition

### 1. Named Entity Recognition

Extract named entities from user input.

#### Entity Types:
- **Location**: Cities, countries, landmarks
- **Date**: Dates, times, periods
- **Person**: Names, titles
- **Organization**: Companies, brands
- **Money**: Prices, amounts
- **Number**: Quantities, counts

#### Implementation:
```typescript
// Named entity recognition
const entityRecognizer = {
  entityPatterns: {
    location: [
      /(?:in|near|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:hotel|resort|inn)/gi
    ],
    date: [
      /(\d{1,2}\/\d{1,2}\/\d{4})/g,
      /(\d{4}-\d{2}-\d{2})/g,
      /(today|tomorrow|next week|next month)/gi
    ],
    money: [
      /\$(\d+(?:\.\d{2})?)/g,
      /(\d+)\s+dollars?/gi,
      /(\d+)\s+bucks?/gi
    ],
    number: [
      /(\d+)\s+(?:guests?|people|persons?)/gi,
      /(\d+)\s+(?:rooms?|nights?|days?)/gi
    ]
  },
  
  extractEntities: (text) => {
    const entities = {};
    
    for (const [entityType, patterns] of Object.entries(entityRecognizer.entityPatterns)) {
      entities[entityType] = [];
      
      for (const pattern of patterns) {
        const matches = text.match(pattern);
        if (matches) {
          entities[entityType].push(...matches.slice(1));
        }
      }
    }
    
    return entities;
  }
};
```

### 2. Custom Entity Recognition

Recognize domain-specific entities for hotel booking.

#### Custom Entities:
- **Hotel Names**: Specific hotel names and brands
- **Room Types**: Single, double, suite, etc.
- **Amenities**: Pool, gym, restaurant, etc.
- **Booking Status**: Confirmed, pending, cancelled
- **Payment Methods**: Credit card, PayPal, etc.

#### Implementation:
```typescript
// Custom entity recognition
const customEntityRecognizer = {
  hotelNames: new Set([
    'marriott', 'courtyard', 'residence inn', 'springhill suites',
    'fairfield inn', 'towneplace suites', 'protea hotels'
  ]),
  
  roomTypes: new Set([
    'single', 'double', 'twin', 'queen', 'king', 'suite',
    'deluxe', 'standard', 'premium', 'executive'
  ]),
  
  amenities: new Set([
    'pool', 'gym', 'restaurant', 'spa', 'wifi', 'parking',
    'breakfast', 'concierge', 'room service', 'business center'
  ]),
  
  extractCustomEntities: (text) => {
    const tokens = textPreprocessor.tokenize(text.toLowerCase());
    const entities = {
      hotelNames: [],
      roomTypes: [],
      amenities: []
    };
    
    for (const token of tokens) {
      if (customEntityRecognizer.hotelNames.has(token)) {
        entities.hotelNames.push(token);
      }
      if (customEntityRecognizer.roomTypes.has(token)) {
        entities.roomTypes.push(token);
      }
      if (customEntityRecognizer.amenities.has(token)) {
        entities.amenities.push(token);
      }
    }
    
    return entities;
  }
};
```

## Response Generation

### 1. Contextual Response Generation

Generate responses based on context and user intent.

#### Response Types:
- **Informational**: Provide requested information
- **Confirmatory**: Confirm user actions
- **Clarifying**: Ask for additional information
- **Suggestive**: Offer recommendations
- **Error Handling**: Handle errors gracefully

#### Implementation:
```typescript
// Response generation
const responseGenerator = {
  generateResponse: (intent, entities, context, sentiment) => {
    const response = {
      text: '',
      suggestions: [],
      actions: [],
      tone: 'neutral'
    };
    
    // Adjust tone based on sentiment
    if (sentiment.sentiment === 'negative') {
      response.tone = 'empathetic';
    } else if (sentiment.sentiment === 'positive') {
      response.tone = 'enthusiastic';
    }
    
    // Generate response based on intent
    switch (intent.intent) {
      case 'hotel_search':
        response.text = responseGenerator.generateHotelSearchResponse(entities, context);
        response.suggestions = ['Show me the hotels', 'Tell me more about the area'];
        response.actions = ['search_hotels'];
        break;
        
      case 'booking':
        response.text = responseGenerator.generateBookingResponse(entities, context);
        response.suggestions = ['Continue booking', 'Modify dates'];
        response.actions = ['start_booking'];
        break;
        
      case 'information':
        response.text = responseGenerator.generateInformationResponse(entities, context);
        response.suggestions = ['More details', 'Book now'];
        break;
        
      case 'support':
        response.text = responseGenerator.generateSupportResponse(entities, context);
        response.suggestions = ['Contact support', 'Try again'];
        break;
        
      default:
        response.text = responseGenerator.generateDefaultResponse(context);
        response.suggestions = ['Help', 'Start over'];
    }
    
    return response;
  },
  
  generateHotelSearchResponse: (entities, context) => {
    const { location } = entities;
    
    if (!location) {
      return 'Where would you like to search for hotels?';
    }
    
    return `I found several great hotels in ${location}. Would you like me to show you the options?`;
  },
  
  generateBookingResponse: (entities, context) => {
    const { dates, guests } = entities;
    
    if (!dates) {
      return 'When would you like to book your stay?';
    }
    
    if (!guests) {
      return `I can help you book for ${dates}. How many guests will be staying?`;
    }
    
    return `Perfect! I'll help you book for ${guests} guests on ${dates}. What type of room would you prefer?`;
  },
  
  generateDefaultResponse: (context) => {
    return 'I\'m here to help you find and book hotels. What would you like to do?';
  }
};
```

### 2. Personalization

Personalize responses based on user preferences and history.

#### Personalization Features:
- **User Preferences**: Adapt to user preferences
- **Booking History**: Use past bookings for recommendations
- **Loyalty Status**: Provide special offers for loyal customers
- **Geographic Preferences**: Adapt to location preferences
- **Temporal Preferences**: Consider time-based preferences

#### Implementation:
```typescript
// Response personalization
const responsePersonalizer = {
  personalizeResponse: (response, userProfile, context) => {
    const personalizedResponse = { ...response };
    
    // Add personalization based on user profile
    if (userProfile.preferences) {
      personalizedResponse.text = responsePersonalizer.addPersonalization(
        response.text,
        userProfile.preferences
      );
    }
    
    // Add recommendations based on history
    if (userProfile.bookingHistory && userProfile.bookingHistory.length > 0) {
      const recommendations = responsePersonalizer.generateRecommendations(
        userProfile.bookingHistory
      );
      personalizedResponse.suggestions.push(...recommendations);
    }
    
    // Add loyalty benefits
    if (userProfile.loyaltyStatus) {
      const loyaltyBenefits = responsePersonalizer.getLoyaltyBenefits(
        userProfile.loyaltyStatus
      );
      personalizedResponse.text += ` ${loyaltyBenefits}`;
    }
    
    return personalizedResponse;
  },
  
  addPersonalization: (text, preferences) => {
    let personalizedText = text;
    
    if (preferences.amenities && preferences.amenities.includes('pool')) {
      personalizedText += ' I noticed you prefer hotels with pools.';
    }
    
    if (preferences.budget === 'luxury') {
      personalizedText += ' I\'ll focus on our premium options for you.';
    }
    
    return personalizedText;
  },
  
  generateRecommendations: (bookingHistory) => {
    const recommendations = [];
    
    // Analyze booking patterns
    const commonLocations = bookingHistory
      .map(booking => booking.location)
      .filter((location, index, arr) => arr.indexOf(location) === index);
    
    if (commonLocations.length > 0) {
      recommendations.push(`Hotels in ${commonLocations[0]}`);
    }
    
    return recommendations;
  },
  
  getLoyaltyBenefits: (loyaltyStatus) => {
    switch (loyaltyStatus.level) {
      case 'platinum':
        return 'As a Platinum member, you\'ll receive exclusive benefits and upgrades.';
      case 'gold':
        return 'As a Gold member, you\'ll enjoy priority booking and special rates.';
      default:
        return '';
    }
  }
};
``` 