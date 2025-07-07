# Data Protection Documentation

## Overview
This document outlines the data protection measures implemented for the Marriott Hotels platform, covering data encryption, privacy compliance, data retention, and security best practices.

## Table of Contents
- [Data Classification](#data-classification)
- [Encryption](#encryption)
- [Privacy Compliance](#privacy-compliance)
- [Data Retention](#data-retention)
- [Access Controls](#access-controls)
- [Audit Logging](#audit-logging)

## Data Classification

### Data Categories
```typescript
// Data classification levels
const dataClassification = {
  PUBLIC: {
    level: 1,
    description: 'Public information',
    examples: ['hotel listings', 'amenities', 'pricing'],
    encryption: false,
    retention: 'indefinite'
  },
  
  INTERNAL: {
    level: 2,
    description: 'Internal business data',
    examples: ['analytics', 'performance metrics'],
    encryption: true,
    retention: '7 years'
  },
  
  CONFIDENTIAL: {
    level: 3,
    description: 'Sensitive business data',
    examples: ['financial data', 'business strategies'],
    encryption: true,
    retention: '10 years'
  },
  
  RESTRICTED: {
    level: 4,
    description: 'Highly sensitive data',
    examples: ['PII', 'payment data', 'passwords'],
    encryption: true,
    retention: 'as required by law'
  }
};
```

### PII Identification
```typescript
// PII detection patterns
const piiPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  creditCard: /^\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}$/,
  ssn: /^\d{3}[\-]?\d{2}[\-]?\d{4}$/,
  passport: /^[A-Z]{2}\d{6}$/
};

// PII detection function
const detectPII = (text: string) => {
  const detected = [];
  
  for (const [type, pattern] of Object.entries(piiPatterns)) {
    if (pattern.test(text)) {
      detected.push(type);
    }
  }
  
  return detected;
};
```

## Encryption

### Data Encryption at Rest
```typescript
// Database encryption
const dbEncryption = {
  algorithm: 'AES-256-GCM',
  key: process.env.DB_ENCRYPTION_KEY,
  
  encryptField: (value: string) => {
    const cipher = crypto.createCipher(dbEncryption.algorithm, dbEncryption.key);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },
  
  decryptField: (encryptedValue: string) => {
    const decipher = crypto.createDecipher(dbEncryption.algorithm, dbEncryption.key);
    let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
};
```

### Data Encryption in Transit
```typescript
// TLS configuration
const tlsConfig = {
  minVersion: 'TLSv1.2',
  cipherSuites: [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256'
  ],
  certificate: process.env.SSL_CERT_PATH,
  privateKey: process.env.SSL_KEY_PATH
};

// HTTPS configuration
const httpsConfig = {
  port: 443,
  options: {
    cert: fs.readFileSync(tlsConfig.certificate),
    key: fs.readFileSync(tlsConfig.privateKey),
    minVersion: tlsConfig.minVersion,
    cipherSuites: tlsConfig.cipherSuites
  }
};
```

### Key Management
```typescript
// Key management system
const keyManagement = {
  masterKey: process.env.MASTER_KEY,
  keyRotation: {
    enabled: true,
    interval: '90 days',
    algorithm: 'AES-256'
  },
  
  generateKey: () => {
    return crypto.randomBytes(32).toString('hex');
  },
  
  rotateKeys: async () => {
    const newKey = keyManagement.generateKey();
    await updateEncryptionKey(newKey);
    return newKey;
  }
};
```

## Privacy Compliance

### GDPR Compliance
```typescript
// GDPR compliance utilities
const gdprCompliance = {
  // Right to be forgotten
  deleteUserData: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { bookings: true, preferences: true }
    });
    
    if (user) {
      // Anonymize personal data
      await prisma.user.update({
        where: { id: userId },
        data: {
          email: `deleted_${userId}@deleted.com`,
          name: 'Deleted User',
          phone: null,
          address: null
        }
      });
      
      // Log deletion for audit
      await logDataDeletion(userId, 'user_request');
    }
  },
  
  // Data portability
  exportUserData: async (userId: string) => {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: { bookings: true, preferences: true }
    });
    
    return {
      user: userData,
      format: 'json',
      timestamp: new Date().toISOString()
    };
  },
  
  // Consent management
  updateConsent: async (userId: string, consent: any) => {
    await prisma.userConsent.upsert({
      where: { userId },
      update: { ...consent, updatedAt: new Date() },
      create: { userId, ...consent }
    });
  }
};
```

### CCPA Compliance
```typescript
// CCPA compliance utilities
const ccpaCompliance = {
  // Right to know
  getDataCategories: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { bookings: true, preferences: true }
    });
    
    return {
      personalInformation: {
        identifiers: [user.email, user.phone],
        commercialInformation: user.bookings,
        internetActivity: user.preferences
      },
      sources: ['user_input', 'booking_system'],
      purposes: ['service_provision', 'marketing', 'analytics']
    };
  },
  
  // Right to delete
  deletePersonalInformation: async (userId: string) => {
    await gdprCompliance.deleteUserData(userId);
  },
  
  // Right to opt-out
  optOutOfSale: async (userId: string) => {
    await prisma.user.update({
      where: { id: userId },
      data: { dataSharingOptOut: true }
    });
  }
};
```

## Data Retention

### Retention Policies
```typescript
// Data retention policies
const retentionPolicies = {
  userData: {
    active: 'indefinite',
    inactive: '7 years',
    deleted: '30 days'
  },
  
  bookingData: {
    completed: '7 years',
    cancelled: '2 years',
    pending: '1 year'
  },
  
  paymentData: {
    successful: '7 years',
    failed: '1 year',
    refunded: '7 years'
  },
  
  auditLogs: {
    security: '10 years',
    access: '7 years',
    system: '5 years'
  },
  
  analytics: {
    aggregated: 'indefinite',
    detailed: '2 years',
    raw: '90 days'
  }
};
```

### Data Cleanup
```typescript
// Automated data cleanup
const dataCleanup = {
  schedule: '0 2 * * 0', // Weekly at 2 AM Sunday
  
  cleanupExpiredData: async () => {
    const now = new Date();
    
    // Clean up old audit logs
    await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: new Date(now.getTime() - 7 * 365 * 24 * 60 * 60 * 1000) // 7 years
        }
      }
    });
    
    // Clean up old sessions
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    });
    
    // Anonymize old user data
    await prisma.user.updateMany({
      where: {
        lastLoginAt: {
          lt: new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000) // 2 years
        },
        isActive: false
      },
      data: {
        email: null,
        phone: null,
        address: null
      }
    });
  }
};
```

## Access Controls

### Data Access Controls
```typescript
// Data access control
const dataAccessControl = {
  // Field-level access control
  getFieldAccess: (userRole: string, dataType: string) => {
    const accessMatrix = {
      admin: ['read', 'write', 'delete'],
      manager: ['read', 'write'],
      user: ['read'],
      guest: ['read_limited']
    };
    
    return accessMatrix[userRole] || ['read_limited'];
  },
  
  // Row-level access control
  filterDataByUser: (data: any[], userId: string, userRole: string) => {
    if (userRole === 'admin') {
      return data;
    }
    
    return data.filter(item => {
      if (userRole === 'manager') {
        return item.organizationId === getUserOrganization(userId);
      }
      
      return item.userId === userId;
    });
  },
  
  // Column-level access control
  maskSensitiveFields: (data: any, userRole: string) => {
    const sensitiveFields = ['password', 'creditCard', 'ssn'];
    
    if (userRole !== 'admin') {
      sensitiveFields.forEach(field => {
        if (data[field]) {
          data[field] = '***';
        }
      });
    }
    
    return data;
  }
};
```

### Data Masking
```typescript
// Data masking utilities
const dataMasking = {
  maskEmail: (email: string) => {
    const [local, domain] = email.split('@');
    return `${local.charAt(0)}***@${domain}`;
  },
  
  maskPhone: (phone: string) => {
    return phone.replace(/\d(?=\d{4})/g, '*');
  },
  
  maskCreditCard: (card: string) => {
    return card.replace(/\d(?=\d{4})/g, '*');
  },
  
  maskAddress: (address: string) => {
    const parts = address.split(' ');
    return `${parts[0]} *** ${parts[parts.length - 1]}`;
  }
};
```

## Audit Logging

### Audit Trail
```typescript
// Audit logging system
const auditLogging = {
  logDataAccess: async (userId: string, dataType: string, action: string, details: any) => {
    await prisma.auditLog.create({
      data: {
        userId,
        dataType,
        action,
        details: JSON.stringify(details),
        ipAddress: getClientIP(),
        userAgent: getUserAgent(),
        timestamp: new Date()
      }
    });
  },
  
  logDataModification: async (userId: string, dataType: string, oldValue: any, newValue: any) => {
    await prisma.auditLog.create({
      data: {
        userId,
        dataType,
        action: 'modify',
        details: JSON.stringify({
          oldValue: maskSensitiveData(oldValue),
          newValue: maskSensitiveData(newValue)
        }),
        ipAddress: getClientIP(),
        userAgent: getUserAgent(),
        timestamp: new Date()
      }
    });
  },
  
  logDataDeletion: async (userId: string, dataType: string, reason: string) => {
    await prisma.auditLog.create({
      data: {
        userId,
        dataType,
        action: 'delete',
        details: JSON.stringify({ reason }),
        ipAddress: getClientIP(),
        userAgent: getUserAgent(),
        timestamp: new Date()
      }
    });
  }
};
```

### Compliance Reporting
```typescript
// Compliance reporting
const complianceReporting = {
  generatePrivacyReport: async (startDate: Date, endDate: Date) => {
    const dataAccess = await prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    
    return {
      period: { startDate, endDate },
      totalAccess: dataAccess.length,
      uniqueUsers: new Set(dataAccess.map(d => d.userId)).size,
      dataTypes: groupBy(dataAccess, 'dataType'),
      actions: groupBy(dataAccess, 'action')
    };
  },
  
  generateRetentionReport: async () => {
    const dataRetention = {
      users: await prisma.user.count(),
      bookings: await prisma.booking.count(),
      payments: await prisma.payment.count(),
      auditLogs: await prisma.auditLog.count()
    };
    
    return {
      timestamp: new Date(),
      dataRetention,
      retentionPolicies
    };
  }
};
```

## Best Practices

### 1. Data Classification
- Classify all data appropriately
- Apply appropriate security controls
- Regular classification reviews
- Employee training on data handling

### 2. Encryption
- Encrypt data at rest and in transit
- Use strong encryption algorithms
- Implement proper key management
- Regular encryption audits

### 3. Privacy Compliance
- Implement GDPR and CCPA requirements
- Provide data subject rights
- Maintain consent records
- Regular privacy assessments

### 4. Data Retention
- Implement retention policies
- Automated data cleanup
- Regular retention reviews
- Compliance with legal requirements

## Data Protection Checklist

- [ ] Classify all data types
- [ ] Implement encryption at rest
- [ ] Implement encryption in transit
- [ ] Set up key management
- [ ] Implement GDPR compliance
- [ ] Implement CCPA compliance
- [ ] Set up data retention policies
- [ ] Implement access controls
- [ ] Set up audit logging
- [ ] Implement data masking
- [ ] Set up compliance reporting
- [ ] Train staff on data protection
- [ ] Regular security assessments 