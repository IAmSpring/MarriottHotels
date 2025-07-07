# API Security Documentation

## Overview
This document outlines the security measures implemented for the Marriott Hotels API, covering authentication, authorization, input validation, rate limiting, and security best practices.

## Table of Contents
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Input Validation](#input-validation)
- [Rate Limiting](#rate-limiting)
- [Data Protection](#data-protection)
- [Security Headers](#security-headers)
- [Monitoring and Logging](#monitoring-and-logging)

## Authentication

### JWT Token Implementation
```typescript
// JWT configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',
  refreshExpiresIn: '7d',
  algorithm: 'HS256'
};

// Token generation
const generateToken = (payload: any) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
    algorithm: jwtConfig.algorithm
  });
};

// Token verification
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

### OAuth2 Integration
```typescript
// OAuth2 configuration
const oauthConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    callbackUrl: process.env.FACEBOOK_CALLBACK_URL
  }
};

// OAuth2 implementation
const oauthStrategy = {
  google: new GoogleStrategy(
    {
      clientID: oauthConfig.google.clientId,
      clientSecret: oauthConfig.google.clientSecret,
      callbackURL: oauthConfig.google.callbackUrl
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
};
```

## Authorization

### Role-Based Access Control (RBAC)
```typescript
// Role definitions
const roles = {
  GUEST: 'guest',
  USER: 'user',
  MANAGER: 'manager',
  ADMIN: 'admin',
  SYSTEM: 'system'
};

// Permission definitions
const permissions = {
  READ_HOTELS: 'read:hotels',
  WRITE_HOTELS: 'write:hotels',
  READ_BOOKINGS: 'read:bookings',
  WRITE_BOOKINGS: 'write:bookings',
  ADMIN_ACCESS: 'admin:access'
};

// Authorization middleware
const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};
```

### API Key Management
```typescript
// API key validation
const validateApiKey = async (apiKey: string) => {
  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { permissions: true }
  });
  
  if (!key || key.expiresAt < new Date()) {
    throw new Error('Invalid or expired API key');
  }
  
  return key;
};

// API key middleware
const requireApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  try {
    const key = await validateApiKey(apiKey);
    req.apiKey = key;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
};
```

## Input Validation

### Request Validation
```typescript
// Input validation schemas
const validationSchemas = {
  createBooking: z.object({
    hotelId: z.string().uuid(),
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    guests: z.number().min(1).max(10),
    roomType: z.enum(['standard', 'deluxe', 'suite'])
  }),
  
  updateUser: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().optional()
  })
};

// Validation middleware
const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedBody = validated;
      next();
    } catch (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
  };
};
```

### SQL Injection Prevention
```typescript
// Parameterized queries
const getHotelById = async (hotelId: string) => {
  return await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { rooms: true, amenities: true }
  });
};

// Input sanitization
const sanitizeInput = (input: string) => {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .toLowerCase();
};
```

## Rate Limiting

### Rate Limiting Configuration
```typescript
// Rate limiting setup
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
};

// Different limits for different endpoints
const rateLimits = {
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 5 // 5 login attempts per 15 minutes
  },
  api: {
    windowMs: 60 * 1000,
    max: 100 // 100 requests per minute
  },
  ai: {
    windowMs: 60 * 1000,
    max: 10 // 10 AI requests per minute
  }
};

// Rate limiting middleware
const createRateLimiter = (config: any) => {
  return rateLimit(config);
};
```

### Distributed Rate Limiting
```typescript
// Redis-based rate limiting
const redisRateLimit = {
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate_limit:'
  }),
  
  keyGenerator: (req: Request) => {
    return req.ip + ':' + req.path;
  },
  
  skip: (req: Request) => {
    return req.user?.role === 'admin';
  }
};
```

## Data Protection

### Data Encryption
```typescript
// Encryption utilities
const encryption = {
  algorithm: 'aes-256-gcm',
  key: process.env.ENCRYPTION_KEY,
  
  encrypt: (data: string) => {
    const cipher = crypto.createCipher(encryption.algorithm, encryption.key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },
  
  decrypt: (encryptedData: string) => {
    const decipher = crypto.createDecipher(encryption.algorithm, encryption.key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
};
```

### PII Protection
```typescript
// PII masking
const maskPII = {
  email: (email: string) => {
    const [local, domain] = email.split('@');
    return `${local.charAt(0)}***@${domain}`;
  },
  
  phone: (phone: string) => {
    return phone.replace(/\d(?=\d{4})/g, '*');
  },
  
  creditCard: (card: string) => {
    return card.replace(/\d(?=\d{4})/g, '*');
  }
};
```

## Security Headers

### Security Headers Configuration
```typescript
// Security headers middleware
const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};
```

### CORS Configuration
```typescript
// CORS configuration
const corsConfig = {
  origin: [
    'https://marriott.com',
    'https://www.marriott.com',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-API-Key'
  ],
  exposedHeaders: ['X-Total-Count']
};
```

## Monitoring and Logging

### Security Event Logging
```typescript
// Security logging
const securityLogger = {
  logAuthAttempt: (userId: string, success: boolean, ip: string) => {
    logger.info('Authentication attempt', {
      userId,
      success,
      ip,
      timestamp: new Date().toISOString()
    });
  },
  
  logSecurityEvent: (event: string, details: any) => {
    logger.warn('Security event', {
      event,
      details,
      timestamp: new Date().toISOString()
    });
  },
  
  logApiAccess: (endpoint: string, userId: string, ip: string) => {
    logger.info('API access', {
      endpoint,
      userId,
      ip,
      timestamp: new Date().toISOString()
    });
  }
};
```

### Security Monitoring
```typescript
// Security monitoring
const securityMonitoring = {
  failedLoginThreshold: 5,
  suspiciousActivityThreshold: 10,
  
  detectSuspiciousActivity: (ip: string, events: any[]) => {
    const recentEvents = events.filter(e => 
      Date.now() - e.timestamp < 15 * 60 * 1000
    );
    
    if (recentEvents.length > securityMonitoring.suspiciousActivityThreshold) {
      securityLogger.logSecurityEvent('suspicious_activity', {
        ip,
        eventCount: recentEvents.length
      });
    }
  }
};
```

## Best Practices

### 1. Authentication
- Use strong password policies
- Implement multi-factor authentication
- Use secure session management
- Implement proper logout procedures

### 2. Authorization
- Follow principle of least privilege
- Implement role-based access control
- Use API keys for service-to-service communication
- Regular permission audits

### 3. Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper data retention policies
- Regular security audits

### 4. Monitoring
- Log all security events
- Monitor for suspicious activity
- Implement alerting for security incidents
- Regular security assessments

## Security Checklist

- [ ] Implement JWT authentication
- [ ] Set up OAuth2 providers
- [ ] Configure role-based access control
- [ ] Implement input validation
- [ ] Set up rate limiting
- [ ] Configure security headers
- [ ] Implement data encryption
- [ ] Set up security monitoring
- [ ] Configure CORS properly
- [ ] Implement API key management
- [ ] Set up audit logging
- [ ] Perform security testing 