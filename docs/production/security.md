# Production Security

This document outlines the comprehensive security measures and best practices implemented in the Marriott Hotels production environment.

## Table of Contents

- [Security Overview](#security-overview)
- [Infrastructure Security](#infrastructure-security)
- [Application Security](#application-security)
- [Data Protection](#data-protection)
- [Access Control](#access-control)
- [Monitoring and Detection](#monitoring-and-detection)
- [Incident Response](#incident-response)

## Security Overview

The production security strategy is built on a defense-in-depth approach, implementing multiple layers of security controls to protect the platform, data, and users.

### Security Architecture

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

## Infrastructure Security

### 1. Network Security

Implement comprehensive network security controls.

#### Security Controls:
- **VPC Configuration**: Isolated network segments
- **Security Groups**: Firewall rules for traffic control
- **Network ACLs**: Additional network layer protection
- **DDoS Protection**: Protection against distributed attacks
- **SSL/TLS**: Encrypted communication

#### Implementation:
```typescript
// Network security configuration
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

### 2. Server Security

Implement server-level security controls.

#### Security Measures:
- **Hardening**: OS and application hardening
- **Patch Management**: Regular security updates
- **Vulnerability Scanning**: Regular vulnerability assessments
- **Intrusion Detection**: Monitor for suspicious activity
- **Backup Security**: Secure backup storage

#### Implementation:
```typescript
// Server security configuration
const serverSecurity = {
  hardening: {
    ssh: {
      port: 22,
      key_based_auth: true,
      password_auth: false,
      root_login: false
    },
    firewall: {
      default_policy: 'deny',
      allowed_ports: [22, 80, 443, 3000]
    }
  },
  
  patching: {
    schedule: 'weekly',
    automatic: true,
    reboot_required: false
  },
  
  scanning: {
    vulnerability_scan: 'weekly',
    port_scan: 'daily',
    malware_scan: 'daily'
  }
};
```

### 3. Cloud Security

Implement cloud-specific security controls.

#### Security Controls:
- **IAM**: Identity and access management
- **Encryption**: Data encryption at rest and in transit
- **Logging**: Comprehensive audit logging
- **Compliance**: Industry compliance standards
- **Backup**: Secure backup and recovery

#### Implementation:
```typescript
// Cloud security configuration
const cloudSecurity = {
  iam: {
    users: {
      admin: {
        permissions: ['full-access'],
        mfa: true
      },
      developer: {
        permissions: ['read-only', 'deploy'],
        mfa: true
      }
    },
    roles: {
      ec2_role: {
        permissions: ['s3-read', 'cloudwatch-write']
      }
    }
  },
  
  encryption: {
    at_rest: {
      database: true,
      storage: true,
      backups: true
    },
    in_transit: {
      ssl_tls: true,
      certificate_management: true
    }
  },
  
  logging: {
    cloudtrail: true,
    cloudwatch: true,
    vpc_flow_logs: true
  }
};
```

## Application Security

### 1. Authentication and Authorization

Implement robust authentication and authorization.

#### Security Controls:
- **Multi-Factor Authentication**: Additional authentication factors
- **Session Management**: Secure session handling
- **Role-Based Access Control**: Granular access control
- **OAuth Integration**: Third-party authentication
- **Password Policies**: Strong password requirements

#### Implementation:
```typescript
// Authentication configuration
const authConfig = {
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
  
  session: {
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  },
  
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
};

// Authorization middleware
const authorization = {
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

### 2. Input Validation and Sanitization

Implement comprehensive input validation and sanitization.

#### Security Controls:
- **Input Validation**: Validate all user inputs
- **Output Encoding**: Encode output to prevent XSS
- **SQL Injection Prevention**: Parameterized queries
- **CSRF Protection**: Cross-site request forgery protection
- **Content Security Policy**: CSP headers

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
  }
};

// SQL injection prevention
const sqlInjection = {
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
  }
};

// XSS prevention
const xssPrevention = {
  encodeOutput: (input) => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },
  
  setCSPHeaders: (res) => {
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

### 3. API Security

Implement comprehensive API security measures.

#### Security Controls:
- **Rate Limiting**: Prevent API abuse
- **API Authentication**: Secure API access
- **Request Validation**: Validate API requests
- **Response Security**: Secure API responses
- **CORS Configuration**: Cross-origin resource sharing

#### Implementation:
```typescript
// API security configuration
const apiSecurity = {
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests from this IP'
  },
  
  authentication: {
    apiKey: {
      header: 'X-API-Key',
      validate: (key) => {
        return validApiKeys.includes(key);
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h'
    }
  },
  
  validation: {
    validateRequest: (req, schema) => {
      const { error } = schema.validate(req.body);
      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }
    }
  },
  
  cors: {
    origin: ['https://marriott.com', 'https://www.marriott.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};
```

## Data Protection

### 1. Data Encryption

Implement comprehensive data encryption.

#### Encryption Controls:
- **Data at Rest**: Encrypt stored data
- **Data in Transit**: Encrypt data in transit
- **Key Management**: Secure key management
- **Backup Encryption**: Encrypt backup data
- **Database Encryption**: Encrypt database files

#### Implementation:
```typescript
// Data encryption configuration
const dataEncryption = {
  atRest: {
    algorithm: 'AES-256-GCM',
    keyRotation: '90d',
    storage: {
      database: true,
      files: true,
      backups: true
    }
  },
  
  inTransit: {
    protocol: 'TLS 1.3',
    certificateManagement: true,
    perfectForwardSecrecy: true
  },
  
  keyManagement: {
    provider: 'AWS KMS',
    keyRotation: '365d',
    accessControl: true
  }
};

// Encryption utilities
const encryption = {
  encrypt: async (data, key) => {
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
  
  decrypt: async (encryptedData, key) => {
    const algorithm = 'AES-256-GCM';
    const decipher = crypto.createDecipher(algorithm, key);
    
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    decipher.setAAD(Buffer.from(encryptedData.iv, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
};
```

### 2. Data Classification

Implement data classification and handling.

#### Data Categories:
- **Public**: Non-sensitive information
- **Internal**: Internal business information
- **Confidential**: Sensitive business information
- **Restricted**: Highly sensitive information
- **Personal**: Personal identifiable information

#### Implementation:
```typescript
// Data classification
const dataClassification = {
  categories: {
    public: {
      level: 1,
      examples: ['hotel descriptions', 'amenities'],
      handling: 'standard'
    },
    internal: {
      level: 2,
      examples: ['pricing information', 'availability'],
      handling: 'internal_only'
    },
    confidential: {
      level: 3,
      examples: ['financial data', 'business strategy'],
      handling: 'need_to_know'
    },
    restricted: {
      level: 4,
      examples: ['credit card data', 'passport numbers'],
      handling: 'encrypted_access'
    },
    personal: {
      level: 5,
      examples: ['PII', 'health information'],
      handling: 'gdpr_compliant'
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
    return 'internal';
  }
};
```

### 3. Privacy Compliance

Ensure compliance with privacy regulations.

#### Compliance Requirements:
- **GDPR**: General Data Protection Regulation
- **CCPA**: California Consumer Privacy Act
- **PCI DSS**: Payment Card Industry Data Security Standard
- **HIPAA**: Health Insurance Portability and Accountability Act

#### Implementation:
```typescript
// Privacy compliance
const privacyCompliance = {
  gdpr: {
    dataRetention: {
      userData: '7y',
      bookingData: '10y',
      paymentData: '7y'
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

### 1. Identity Management

Implement comprehensive identity management.

#### Identity Controls:
- **User Provisioning**: Automated user creation
- **Role Management**: Role-based access control
- **Access Reviews**: Regular access reviews
- **Privileged Access**: Special access management
- **Single Sign-On**: SSO integration

#### Implementation:
```typescript
// Identity management
const identityManagement = {
  userProvisioning: {
    automated: true,
    approvalWorkflow: true,
    roleAssignment: true
  },
  
  roleManagement: {
    roles: {
      admin: {
        permissions: ['full_access'],
        description: 'System administrator'
      },
      manager: {
        permissions: ['read_all', 'write_limited'],
        description: 'Department manager'
      },
      user: {
        permissions: ['read_own', 'write_own'],
        description: 'Standard user'
      }
    }
  },
  
  accessReviews: {
    frequency: 'quarterly',
    automated: true,
    approvers: ['security_team', 'department_heads']
  }
};
```

### 2. Privileged Access Management

Implement privileged access management.

#### PAM Controls:
- **Just-in-Time Access**: Temporary elevated access
- **Session Recording**: Record privileged sessions
- **Access Approval**: Require approval for privileged access
- **Time Limits**: Limit privileged access duration
- **Monitoring**: Monitor privileged access

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
  }
};
```

## Monitoring and Detection

### 1. Security Monitoring

Implement comprehensive security monitoring.

#### Monitoring Areas:
- **Network Traffic**: Monitor network activity
- **User Activity**: Monitor user behavior
- **System Events**: Monitor system events
- **Application Logs**: Monitor application activity
- **Database Activity**: Monitor database access

#### Implementation:
```typescript
// Security monitoring
const securityMonitoring = {
  networkMonitoring: {
    trafficAnalysis: true,
    anomalyDetection: true,
    threatIntelligence: true
  },
  
  userActivity: {
    loginAttempts: true,
    failedLogins: true,
    unusualActivity: true,
    sessionMonitoring: true
  },
  
  systemEvents: {
    fileAccess: true,
    processCreation: true,
    registryChanges: true,
    serviceChanges: true
  },
  
  alerting: {
    realTime: true,
    correlation: true,
    escalation: true
  }
};
```

### 2. Threat Detection

Implement threat detection and response.

#### Detection Capabilities:
- **Signature Detection**: Known threat patterns
- **Behavioral Analysis**: Anomaly detection
- **Machine Learning**: ML-based threat detection
- **Threat Intelligence**: External threat feeds
- **Incident Response**: Automated response

#### Implementation:
```typescript
// Threat detection
const threatDetection = {
  signatureDetection: {
    malwareSignatures: true,
    attackPatterns: true,
    vulnerabilityExploits: true
  },
  
  behavioralAnalysis: {
    userBehavior: true,
    systemBehavior: true,
    networkBehavior: true
  },
  
  machineLearning: {
    anomalyDetection: true,
    threatClassification: true,
    riskScoring: true
  },
  
  threatIntelligence: {
    feeds: ['abuseipdb', 'virustotal', 'alienvault'],
    integration: true,
    automated: true
  }
};
```

## Incident Response

### 1. Incident Classification

Classify security incidents by severity.

#### Incident Levels:
- **Critical**: Immediate response required
- **High**: Urgent response required
- **Medium**: Standard response required
- **Low**: Routine response required

#### Implementation:
```typescript
// Incident classification
const incidentClassification = {
  critical: {
    criteria: ['data_breach', 'system_compromise', 'ransomware'],
    responseTime: '15m',
    notification: 'immediate'
  },
  
  high: {
    criteria: ['unauthorized_access', 'malware_detection'],
    responseTime: '1h',
    notification: '1h'
  },
  
  medium: {
    criteria: ['failed_login_attempts', 'suspicious_activity'],
    responseTime: '4h',
    notification: '4h'
  },
  
  low: {
    criteria: ['policy_violation', 'minor_security_issue'],
    responseTime: '24h',
    notification: '24h'
  }
};
```

### 2. Response Procedures

Define incident response procedures.

#### Response Steps:
1. **Detection**: Identify security incident
2. **Assessment**: Assess impact and scope
3. **Containment**: Contain the incident
4. **Eradication**: Remove threat
5. **Recovery**: Restore systems
6. **Lessons Learned**: Document and improve

#### Implementation:
```typescript
// Incident response
const incidentResponse = {
  procedures: {
    detection: {
      automated: true,
      manual: true,
      escalation: '5m'
    },
    
    assessment: {
      impactAnalysis: true,
      scopeDetermination: true,
      stakeholderNotification: true
    },
    
    containment: {
      networkIsolation: true,
      accountLockout: true,
      systemQuarantine: true
    },
    
    eradication: {
      malwareRemoval: true,
      patchApplication: true,
      configurationUpdate: true
    },
    
    recovery: {
      systemRestoration: true,
      dataRecovery: true,
      serviceValidation: true
    },
    
    lessonsLearned: {
      documentation: true,
      processImprovement: true,
      trainingUpdate: true
    }
  }
};
``` 