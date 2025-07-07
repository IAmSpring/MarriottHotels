# Security Overview

This document provides a comprehensive overview of the security measures implemented in the Marriott Hotels platform, covering data protection, access control, and security best practices.

## Table of Contents

- [Security Architecture](#security-architecture)
- [Data Protection](#data-protection)
- [Access Control](#access-control)
- [Network Security](#network-security)
- [Application Security](#application-security)
- [Incident Response](#incident-response)

## Security Architecture

The security architecture is built on a defense-in-depth approach, implementing multiple layers of security controls to protect the platform, data, and users.

### Security Layers

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Edge Security │    │   Network       │    │   Application   │
│   (WAF, DDoS)   │    │   Security      │    │   Security      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Security │    │   Access        │    │   Monitoring    │
│   (Encryption)  │    │   Control       │    │   & Detection   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Principles

1. **Defense in Depth**: Multiple security layers
2. **Least Privilege**: Minimal access required
3. **Zero Trust**: Verify everything, trust nothing
4. **Security by Design**: Security built into architecture
5. **Continuous Monitoring**: Real-time security monitoring

## Data Protection

### 1. Data Classification

Implement comprehensive data classification for appropriate protection levels.

#### Data Categories:
- **Public**: Non-sensitive information (hotel descriptions, amenities)
- **Internal**: Internal business information (pricing, availability)
- **Confidential**: Sensitive business information (financial data, strategy)
- **Restricted**: Highly sensitive information (credit cards, PII)
- **Personal**: Personal identifiable information (names, addresses, preferences)

#### Implementation:
```typescript
// Data classification
const dataClassification = {
  categories: {
    public: {
      level: 1,
      examples: ['hotel descriptions', 'amenities', 'public reviews'],
      handling: 'standard',
      encryption: 'optional'
    },
    internal: {
      level: 2,
      examples: ['pricing information', 'availability', 'business metrics'],
      handling: 'internal_only',
      encryption: 'required'
    },
    confidential: {
      level: 3,
      examples: ['financial data', 'business strategy', 'competitive analysis'],
      handling: 'need_to_know',
      encryption: 'required'
    },
    restricted: {
      level: 4,
      examples: ['credit card data', 'passport numbers', 'SSN'],
      handling: 'encrypted_access',
      encryption: 'required'
    },
    personal: {
      level: 5,
      examples: ['PII', 'health information', 'preferences'],
      handling: 'gdpr_compliant',
      encryption: 'required'
    }
  },
  
  classifyData: (data) => {
    // Implement classification logic
    if (data.includes('credit card') || data.includes('cc_number')) {
      return 'restricted';
    }
    if (data.includes('email') || data.includes('phone')) {
      return 'personal';
    }
    if (data.includes('price') || data.includes('cost')) {
      return 'internal';
    }
    return 'public';
  }
};
```

### 2. Data Encryption

Implement comprehensive encryption for data at rest and in transit.

#### Encryption Standards:
- **AES-256**: For data encryption
- **TLS 1.3**: For data in transit
- **RSA-2048**: For key exchange
- **SHA-256**: For data integrity

#### Implementation:
```typescript
// Data encryption
const dataEncryption = {
  encryptData: async (data, key) => {
    const algorithm = 'AES-256-GCM';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex')
    };
  },
  
  decryptData: async (encryptedData, key) => {
    const algorithm = 'AES-256-GCM';
    const decipher = crypto.createDecipher(algorithm, key);
    
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    decipher.setAAD(Buffer.from(encryptedData.iv, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  },
  
  encryptAtRest: {
    database: true,
    files: true,
    backups: true,
    logs: true
  },
  
  encryptInTransit: {
    api: true,
    database: true,
    file_transfer: true,
    backups: true
  }
};
```

### 3. Data Privacy

Ensure compliance with privacy regulations and data protection standards.

#### Privacy Standards:
- **GDPR**: General Data Protection Regulation
- **CCPA**: California Consumer Privacy Act
- **PCI DSS**: Payment Card Industry Data Security Standard
- **HIPAA**: Health Insurance Portability and Accountability Act

#### Implementation:
```typescript
// Data privacy
const dataPrivacy = {
  gdpr: {
    dataRetention: {
      userData: '7y',
      bookingData: '10y',
      paymentData: '7y',
      logs: '2y'
    },
    userRights: {
      access: true,
      rectification: true,
      erasure: true,
      portability: true
    },
    consent: {
      explicit: true,
      granular: true,
      withdrawable: true
    }
  },
  
  dataMinimization: {
    collectOnlyNecessary: true,
    purposeLimitation: true,
    retentionLimitation: true
  },
  
  userConsent: {
    trackConsent: (userId, consentType, granted) => {
      const consent = {
        userId,
        consentType,
        granted,
        timestamp: new Date(),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      };
      
      saveConsent(consent);
    }
  }
};
```

## Access Control

### 1. Authentication

Implement robust authentication mechanisms.

#### Authentication Methods:
- **Multi-Factor Authentication**: Additional authentication factors
- **OAuth 2.0**: Third-party authentication
- **JWT Tokens**: Stateless authentication
- **Session Management**: Secure session handling

#### Implementation:
```typescript
// Authentication
const authentication = {
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }
  },
  
  mfa: {
    enabled: true,
    methods: ['totp', 'sms', 'email'],
    required: ['admin', 'manager']
  },
  
  session: {
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
    refreshExpiresIn: '7d'
  }
};
```

### 2. Authorization

Implement role-based access control and permissions.

#### Authorization Levels:
- **Public**: No authentication required
- **User**: Authenticated user access
- **Manager**: Management-level access
- **Admin**: Administrative access
- **System**: System-level access

#### Implementation:
```typescript
// Authorization
const authorization = {
  roles: {
    public: {
      permissions: ['read_public_hotels', 'search_hotels']
    },
    user: {
      permissions: [
        'read_public_hotels',
        'search_hotels',
        'create_booking',
        'read_own_bookings',
        'update_own_profile'
      ]
    },
    manager: {
      permissions: [
        'read_all_bookings',
        'update_hotel_info',
        'manage_staff',
        'view_reports'
      ]
    },
    admin: {
      permissions: [
        'full_access',
        'manage_users',
        'system_configuration',
        'security_settings'
      ]
    }
  },
  
  checkPermission: (user, resource, action) => {
    const userRoles = user.roles || [];
    const permissions = getPermissionsForRoles(userRoles);
    
    return permissions.some(permission => 
      permission.resource === resource && 
      permission.action === action
    );
  },
  
  requireAuth: (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/signin');
    }
    next();
  },
  
  requireRole: (role) => {
    return (req, res, next) => {
      if (!req.session.user || !req.session.user.roles.includes(role)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    };
  }
};
```

### 3. Privileged Access Management

Implement privileged access management for sensitive operations.

#### PAM Features:
- **Just-in-Time Access**: Temporary elevated access
- **Session Recording**: Record privileged sessions
- **Access Approval**: Require approval for privileged access
- **Time Limits**: Limit privileged access duration

#### Implementation:
```typescript
// Privileged access management
const pam = {
  justInTimeAccess: {
    requestApproval: true,
    timeLimit: '4h',
    reasonRequired: true
  },
  
  sessionRecording: {
    enabled: true,
    storage: 'encrypted',
    retention: '1y'
  },
  
  accessApproval: {
    approvers: ['security_admin', 'system_owner'],
    escalation: '2h',
    notification: true
  },
  
  requestAccess: async (userId, resource, reason, duration) => {
    const request = {
      id: generateRequestId(),
      userId,
      resource,
      reason,
      duration,
      status: 'pending',
      timestamp: new Date()
    };
    
    await saveAccessRequest(request);
    await notifyApprovers(request);
    
    return request.id;
  }
};
```

## Network Security

### 1. Network Architecture

Implement secure network architecture with proper segmentation.

#### Network Segments:
- **DMZ**: Public-facing services
- **Application Tier**: Application servers
- **Database Tier**: Database servers
- **Management Tier**: Administrative access

#### Implementation:
```typescript
// Network security
const networkSecurity = {
  vpc: {
    cidr_block: '10.0.0.0/16',
    subnets: {
      public: ['10.0.1.0/24', '10.0.2.0/24'],
      private: ['10.0.3.0/24', '10.0.4.0/24'],
      database: ['10.0.5.0/24', '10.0.6.0/24']
    }
  },
  
  security_groups: {
    alb: {
      inbound: [
        { port: 80, source: '0.0.0.0/0' },
        { port: 443, source: '0.0.0.0/0' }
      ],
      outbound: [
        { port: 3000, destination: 'sg-web' }
      ]
    },
    web: {
      inbound: [
        { port: 3000, source: 'sg-alb' }
      ],
      outbound: [
        { port: 5432, destination: 'sg-database' }
      ]
    },
    database: {
      inbound: [
        { port: 5432, source: 'sg-web' }
      ],
      outbound: []
    }
  }
};
```

### 2. DDoS Protection

Implement DDoS protection and mitigation.

#### DDoS Protection:
- **Rate Limiting**: Limit requests per IP
- **Traffic Filtering**: Filter malicious traffic
- **Load Balancing**: Distribute traffic
- **Monitoring**: Real-time traffic monitoring

#### Implementation:
```typescript
// DDoS protection
const ddosProtection = {
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests from this IP'
  },
  
  trafficFiltering: {
    blacklist: new Set(),
    whitelist: new Set(),
    suspiciousPatterns: [
      /bot|crawler|spider/i,
      /sqlmap|nikto|nmap/i,
      /admin|wp-admin|phpmyadmin/i
    ]
  },
  
  loadBalancing: {
    algorithm: 'round_robin',
    healthChecks: true,
    failover: true
  },
  
  monitoring: {
    trafficThreshold: 1000, // requests per second
    alertThreshold: 500,
    blockThreshold: 2000
  }
};
```

### 3. SSL/TLS Configuration

Implement secure SSL/TLS configuration.

#### SSL/TLS Features:
- **TLS 1.3**: Latest TLS version
- **Perfect Forward Secrecy**: PFS enabled
- **Strong Ciphers**: AES-256-GCM, ChaCha20-Poly1305
- **Certificate Management**: Automated certificate renewal

#### Implementation:
```typescript
// SSL/TLS configuration
const sslTlsConfig = {
  protocol: 'TLSv1.3',
  ciphers: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256'
  ],
  certificate: {
    provider: 'Let\'s Encrypt',
    autoRenewal: true,
    monitoring: true
  },
  
  securityHeaders: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  }
};
```

## Application Security

### 1. Input Validation

Implement comprehensive input validation and sanitization.

#### Validation Areas:
- **API Inputs**: Validate all API parameters
- **Form Data**: Validate form submissions
- **File Uploads**: Validate uploaded files
- **Database Queries**: Validate query parameters

#### Implementation:
```typescript
// Input validation
const inputValidation = {
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  validatePassword: (password) => {
    const minLength = 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && 
           hasUppercase && 
           hasLowercase && 
           hasNumbers && 
           hasSpecialChars;
  },
  
  sanitizeInput: (input) => {
    return input
      .replace(/[<>]/g, '')
      .trim();
  },
  
  validateFileUpload: (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    return allowedTypes.includes(file.mimetype) && file.size <= maxSize;
  }
};
```

### 2. Output Encoding

Implement output encoding to prevent XSS attacks.

#### Encoding Types:
- **HTML Encoding**: Encode HTML special characters
- **URL Encoding**: Encode URL parameters
- **JavaScript Encoding**: Encode JavaScript content
- **CSS Encoding**: Encode CSS content

#### Implementation:
```typescript
// Output encoding
const outputEncoding = {
  encodeHTML: (input) => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },
  
  encodeURL: (input) => {
    return encodeURIComponent(input);
  },
  
  encodeJavaScript: (input) => {
    return input
      .replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  },
  
  setSecurityHeaders: (res) => {
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' https:; " +
      "connect-src 'self' https:;"
    );
  }
};
```

### 3. SQL Injection Prevention

Implement measures to prevent SQL injection attacks.

#### Prevention Methods:
- **Parameterized Queries**: Use prepared statements
- **Input Validation**: Validate all inputs
- **Escape Functions**: Escape special characters
- **ORM Usage**: Use object-relational mapping

#### Implementation:
```typescript
// SQL injection prevention
const sqlInjectionPrevention = {
  parameterizedQuery: (query, params) => {
    // Use parameterized queries
    return db.query(query, params);
  },
  
  validateQuery: (query) => {
    const dangerousPatterns = [
      /DROP\s+TABLE/i,
      /DELETE\s+FROM/i,
      /UPDATE\s+.*\s+SET/i,
      /INSERT\s+INTO/i
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(query));
  },
  
  escapeInput: (input) => {
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  }
};
```

## Incident Response

### 1. Incident Classification

Classify security incidents by severity and impact.

#### Incident Levels:
- **P0**: Critical - System down, immediate action required
- **P1**: High - Major functionality affected
- **P2**: Medium - Minor functionality affected
- **P3**: Low - Cosmetic or minor issues

#### Implementation:
```typescript
// Incident classification
const incidentClassification = {
  p0: {
    criteria: ['system_down', 'data_loss', 'security_breach'],
    responseTime: '5m',
    escalation: 'immediate'
  },
  
  p1: {
    criteria: ['major_functionality_down', 'performance_degradation'],
    responseTime: '15m',
    escalation: '30m'
  },
  
  p2: {
    criteria: ['minor_functionality_affected', 'ui_issues'],
    responseTime: '2h',
    escalation: '4h'
  },
  
  p3: {
    criteria: ['cosmetic_issues', 'minor_bugs'],
    responseTime: '24h',
    escalation: '48h'
  }
};
```

### 2. Incident Response Process

Define clear incident response procedures.

#### Response Steps:
1. **Detection**: Automated detection and alerting
2. **Assessment**: Initial impact assessment
3. **Response**: Immediate response actions
4. **Resolution**: Problem resolution
5. **Recovery**: Service restoration
6. **Post-mortem**: Analysis and improvement

#### Implementation:
```typescript
// Incident response
const incidentResponse = {
  process: {
    detection: {
      automated: true,
      manual: true,
      escalation: '5m'
    },
    
    assessment: {
      impact_analysis: true,
      customer_impact: true,
      business_impact: true
    },
    
    response: {
      immediate_actions: [
        'isolate_affected_systems',
        'implement_workarounds',
        'notify_stakeholders'
      ],
      communication: {
        internal: 'immediate',
        external: '30m'
      }
    },
    
    resolution: {
      root_cause_analysis: true,
      fix_implementation: true,
      testing: true
    },
    
    recovery: {
      service_restoration: true,
      monitoring: true,
      validation: true
    },
    
    post_mortem: {
      analysis: 'within_24h',
      documentation: 'within_48h',
      action_items: 'within_week'
    }
  }
};
```

### 3. Communication Plan

Define communication procedures for incidents.

#### Communication Channels:
- **Internal**: Team notifications and updates
- **External**: Customer communications
- **Stakeholders**: Management and business updates
- **Public**: Status page updates

#### Implementation:
```typescript
// Communication plan
const communicationPlan = {
  channels: {
    internal: {
      slack: '#incidents',
      email: 'incidents@marriott.com',
      phone: 'emergency_contact'
    },
    
    external: {
      status_page: 'status.marriott.com',
      email: 'support@marriott.com',
      social_media: '@marriott_support'
    }
  },
  
  templates: {
    initial_notification: {
      subject: 'Incident Detected - {service}',
      body: 'We have detected an issue with {service}. We are investigating and will provide updates.'
    },
    
    update_notification: {
      subject: 'Incident Update - {service}',
      body: 'Update on the {service} incident: {status}'
    },
    
    resolution_notification: {
      subject: 'Incident Resolved - {service}',
      body: 'The {service} incident has been resolved. We apologize for any inconvenience.'
    }
  }
};
``` 