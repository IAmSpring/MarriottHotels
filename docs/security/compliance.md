# Compliance

## Overview
This document outlines the compliance measures implemented for the Marriott Hotels platform, covering GDPR, CCPA, PCI DSS, SOC 2, and other regulatory requirements.

## Table of Contents
- [GDPR Compliance](#gdpr-compliance)
- [CCPA Compliance](#ccpa-compliance)
- [PCI DSS Compliance](#pci-dss-compliance)
- [SOC 2 Compliance](#soc-2-compliance)
- [Data Privacy](#data-privacy)
- [Audit Procedures](#audit-procedures)

## GDPR Compliance

### Data Processing Principles
```typescript
// GDPR compliance configuration
const GDPR_CONFIG = {
  legalBasis: {
    consent: 'CONSENT',
    contract: 'CONTRACT',
    legitimateInterest: 'LEGITIMATE_INTEREST',
    legalObligation: 'LEGAL_OBLIGATION',
    vitalInterest: 'VITAL_INTEREST',
    publicTask: 'PUBLIC_TASK'
  },
  
  dataSubjectRights: {
    access: 'RIGHT_TO_ACCESS',
    rectification: 'RIGHT_TO_RECTIFICATION',
    erasure: 'RIGHT_TO_ERASURE',
    portability: 'RIGHT_TO_PORTABILITY',
    restriction: 'RIGHT_TO_RESTRICTION',
    objection: 'RIGHT_TO_OBJECT',
    automatedDecision: 'RIGHT_TO_AUTOMATED_DECISION'
  }
};

// GDPR compliance service
export const gdprCompliance = {
  // Data processing register
  processingRegister: {
    hotelBookings: {
      purpose: 'Hotel reservation and management',
      legalBasis: GDPR_CONFIG.legalBasis.contract,
      dataCategories: ['personal_data', 'contact_info', 'payment_data'],
      retentionPeriod: '7 years',
      dataSubjects: ['customers', 'guests'],
      recipients: ['hotel_staff', 'payment_processors'],
      transfers: ['EU_to_US'],
      safeguards: ['standard_contractual_clauses']
    },
    
    marketing: {
      purpose: 'Marketing and promotional communications',
      legalBasis: GDPR_CONFIG.legalBasis.consent,
      dataCategories: ['contact_info', 'preferences'],
      retentionPeriod: '3 years',
      dataSubjects: ['customers', 'prospects'],
      recipients: ['marketing_team'],
      transfers: ['none'],
      safeguards: ['none']
    },
    
    analytics: {
      purpose: 'Website analytics and performance monitoring',
      legalBasis: GDPR_CONFIG.legalBasis.legitimateInterest,
      dataCategories: ['usage_data', 'technical_data'],
      retentionPeriod: '2 years',
      dataSubjects: ['website_visitors'],
      recipients: ['analytics_team'],
      transfers: ['EU_to_US'],
      safeguards: ['data_processing_agreement']
    }
  },
  
  // Consent management
  consentManagement: {
    recordConsent: async (userId: string, purpose: string, consent: boolean) => {
      return await prisma.consent.create({
        data: {
          userId,
          purpose,
          consent,
          timestamp: new Date(),
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        }
      });
    },
    
    getConsentHistory: async (userId: string) => {
      return await prisma.consent.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' }
      });
    },
    
    withdrawConsent: async (userId: string, purpose: string) => {
      await prisma.consent.updateMany({
        where: { userId, purpose },
        data: { consent: false, withdrawnAt: new Date() }
      });
      
      // Stop processing for this purpose
      await stopDataProcessing(userId, purpose);
    }
  },
  
  // Data subject rights
  dataSubjectRights: {
    // Right to access
    processAccessRequest: async (userId: string) => {
      const userData = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          bookings: true,
          preferences: true,
          consent: true,
          activityLog: true
        }
      });
      
      return {
        personalData: userData,
        processingPurposes: ['booking', 'marketing', 'analytics'],
        dataSources: ['user_input', 'cookies', 'third_party'],
        retentionPeriods: ['7 years', '3 years', '2 years'],
        thirdParties: ['payment_processors', 'analytics_providers'],
        internationalTransfers: ['EU to US'],
        safeguards: ['Standard Contractual Clauses']
      };
    },
    
    // Right to rectification
    processRectificationRequest: async (userId: string, updates: any) => {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updates
      });
      
      // Log the rectification
      await prisma.dataSubjectRequest.create({
        data: {
          userId,
          requestType: 'RECTIFICATION',
          details: updates,
          timestamp: new Date()
        }
      });
      
      return updatedUser;
    },
    
    // Right to erasure
    processErasureRequest: async (userId: string) => {
      // Soft delete - mark as deleted but retain for legal requirements
      await prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
          email: `deleted_${userId}@deleted.com`,
          name: 'Deleted User'
        }
      });
      
      // Anonymize related data
      await prisma.booking.updateMany({
        where: { userId },
        data: { guestInfo: null }
      });
      
      // Log the erasure request
      await prisma.dataSubjectRequest.create({
        data: {
          userId,
          requestType: 'ERASURE',
          timestamp: new Date()
        }
      });
    },
    
    // Right to data portability
    processPortabilityRequest: async (userId: string) => {
      const userData = await gdprCompliance.dataSubjectRights.processAccessRequest(userId);
      
      return {
        format: 'json',
        data: userData,
        timestamp: new Date().toISOString(),
        checksum: generateChecksum(userData)
      };
    }
  }
};
```

## CCPA Compliance

### California Consumer Privacy Act
```typescript
// CCPA compliance service
export const ccpaCompliance = {
  // Data categories mapping
  dataCategories: {
    identifiers: ['email', 'phone', 'user_id', 'device_id'],
    personal: ['name', 'address', 'preferences'],
    commercial: ['booking_history', 'purchase_history'],
    biometric: [],
    internet: ['ip_address', 'browser_info', 'cookies'],
    geolocation: ['location_data'],
    professional: [],
    education: [],
    inferences: ['user_preferences', 'behavioral_data']
  },
  
  // Right to know
  processKnowRequest: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookings: true,
        preferences: true,
        activityLog: true
      }
    });
    
    return {
      categories: {
        identifiers: [user?.email, user?.id],
        personal: [user?.name, user?.address],
        commercial: [user?.bookings],
        biometric: [],
        internet: [user?.lastLoginIp, user?.userAgent],
        geolocation: [user?.lastLocation],
        professional: [],
        education: [],
        inferences: [user?.preferences]
      },
      sources: ['user_input', 'cookies', 'analytics', 'third_party'],
      purposes: ['booking', 'marketing', 'analytics', 'security'],
      thirdParties: ['payment_processors', 'analytics_providers', 'marketing_partners'],
      sales: {
        sold: false,
        categories: [],
        thirdParties: []
      }
    };
  },
  
  // Right to delete
  processDeleteRequest: async (userId: string) => {
    await gdprCompliance.dataSubjectRights.processErasureRequest(userId);
  },
  
  // Right to opt-out
  processOptOutRequest: async (userId: string) => {
    await prisma.user.update({
      where: { id: userId },
      data: {
        dataSharingOptOut: true,
        optOutTimestamp: new Date()
      }
    });
    
    // Stop data sharing with third parties
    await stopDataSharing(userId);
  },
  
  // Right to non-discrimination
  ensureNonDiscrimination: async (userId: string) => {
    // Ensure user receives same service quality regardless of privacy choices
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    // Service quality should not be affected by privacy choices
    return {
      serviceQuality: 'maintained',
      pricing: 'unchanged',
      features: 'available'
    };
  }
};
```

## PCI DSS Compliance

### Payment Card Industry Data Security Standard
```typescript
// PCI DSS compliance configuration
const PCI_DSS_CONFIG = {
  requirements: {
    buildAndMaintainSecureNetwork: {
      firewalls: true,
      defaultPasswords: false,
      networkSegmentation: true
    },
    
    protectCardholderData: {
      encryption: true,
      keyManagement: true,
      dataMasking: true,
      truncation: true
    },
    
    maintainVulnerabilityManagement: {
      antivirus: true,
      securityPatches: true,
      vulnerabilityScans: true
    },
    
    implementStrongAccessControls: {
      uniqueIds: true,
      roleBasedAccess: true,
      physicalAccess: true,
      networkAccess: true
    },
    
    monitorAndTestNetworks: {
      logging: true,
      monitoring: true,
      testing: true,
      incidentResponse: true
    },
    
    maintainInformationSecurityPolicy: {
      policy: true,
      training: true,
      reviews: true
    }
  }
};

// PCI DSS compliance service
export const pciDssCompliance = {
  // Card data handling
  cardDataHandling: {
    // Never store sensitive card data
    processPayment: async (paymentData: any) => {
      const { cardNumber, cvv, expiry } = paymentData;
      
      // Validate card data
      if (!isValidCardNumber(cardNumber)) {
        throw new Error('Invalid card number');
      }
      
      // Process payment through secure gateway
      const paymentResult = await processPaymentSecurely({
        cardNumber: maskCardNumber(cardNumber),
        cvv: '***', // Never store CVV
        expiry: maskExpiry(expiry)
      });
      
      // Store only masked data
      await prisma.payment.create({
        data: {
          maskedCardNumber: maskCardNumber(cardNumber),
          maskedExpiry: maskExpiry(expiry),
          transactionId: paymentResult.transactionId,
          amount: paymentData.amount,
          status: paymentResult.status
        }
      });
      
      return paymentResult;
    },
    
    // Tokenization for recurring payments
    createPaymentToken: async (cardData: any) => {
      const token = await paymentGateway.createToken({
        cardNumber: cardData.cardNumber,
        expiry: cardData.expiry
      });
      
      return {
        token: token.id,
        maskedCardNumber: maskCardNumber(cardData.cardNumber),
        maskedExpiry: maskExpiry(cardData.expiry)
      };
    }
  },
  
  // Security monitoring
  securityMonitoring: {
    // Monitor for suspicious payment activity
    monitorPaymentActivity: async () => {
      const suspiciousPatterns = [
        // Multiple failed payments
        'multiple_failed_payments',
        // Unusual payment amounts
        'unusual_payment_amounts',
        // Payments from unusual locations
        'unusual_payment_locations',
        // Rapid payment attempts
        'rapid_payment_attempts'
      ];
      
      for (const pattern of suspiciousPatterns) {
        await detectSuspiciousActivity(pattern);
      }
    },
    
    // Log all payment activities
    logPaymentActivity: async (paymentData: any) => {
      await prisma.paymentLog.create({
        data: {
          transactionId: paymentData.transactionId,
          amount: paymentData.amount,
          status: paymentData.status,
          timestamp: new Date(),
          ipAddress: paymentData.ipAddress,
          userAgent: paymentData.userAgent
        }
      });
    }
  },
  
  // Encryption and key management
  encryptionManagement: {
    // Encrypt sensitive data
    encryptSensitiveData: (data: string): string => {
      const algorithm = 'aes-256-gcm';
      const key = Buffer.from(process.env.PCI_ENCRYPTION_KEY!, 'hex');
      const iv = crypto.randomBytes(16);
      
      const cipher = crypto.createCipher(algorithm, key);
      cipher.setAAD(Buffer.from('pci-data', 'utf8'));
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
    },
    
    // Decrypt sensitive data
    decryptSensitiveData: (encryptedData: string): string => {
      const [ivHex, tagHex, encrypted] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const tag = Buffer.from(tagHex, 'hex');
      const key = Buffer.from(process.env.PCI_ENCRYPTION_KEY!, 'hex');
      
      const decipher = crypto.createDecipher('aes-256-gcm', key);
      decipher.setAAD(Buffer.from('pci-data', 'utf8'));
      decipher.setAuthTag(tag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    }
  }
};
```

## SOC 2 Compliance

### System and Organization Controls
```typescript
// SOC 2 compliance configuration
const SOC2_CONFIG = {
  trustServiceCriteria: {
    security: {
      accessControl: true,
      changeManagement: true,
      riskAssessment: true,
      securityMonitoring: true
    },
    
    availability: {
      backupRecovery: true,
      capacityPlanning: true,
      environmentalControls: true,
      systemMonitoring: true
    },
    
    processingIntegrity: {
      dataValidation: true,
      errorHandling: true,
      processingMonitoring: true,
      systemAvailability: true
    },
    
    confidentiality: {
      dataClassification: true,
      encryption: true,
      accessControls: true,
      dataDisposal: true
    },
    
    privacy: {
      consentManagement: true,
      dataSubjectRights: true,
      dataRetention: true,
      breachNotification: true
    }
  }
};

// SOC 2 compliance service
export const soc2Compliance = {
  // Security controls
  securityControls: {
    // Access control
    accessControl: {
      userProvisioning: async (userData: any) => {
        // Implement user provisioning process
        const user = await prisma.user.create({
          data: {
            ...userData,
            status: 'active',
            createdBy: 'system',
            createdAt: new Date()
          }
        });
        
        // Assign default permissions
        await assignDefaultPermissions(user.id);
        
        // Log the provisioning
        await logSecurityEvent('USER_PROVISIONED', { userId: user.id });
        
        return user;
      },
      
      userDeprovisioning: async (userId: string) => {
        // Implement user deprovisioning process
        await prisma.user.update({
          where: { id: userId },
          data: {
            status: 'inactive',
            deactivatedAt: new Date(),
            deactivatedBy: 'system'
          }
        });
        
        // Remove all permissions
        await removeAllPermissions(userId);
        
        // Log the deprovisioning
        await logSecurityEvent('USER_DEPROVISIONED', { userId });
      },
      
      accessReviews: async () => {
        // Implement periodic access reviews
        const users = await prisma.user.findMany({
          include: { permissions: true }
        });
        
        for (const user of users) {
          await reviewUserAccess(user);
        }
      }
    },
    
    // Change management
    changeManagement: {
      requestChange: async (changeRequest: any) => {
        // Implement change request process
        const change = await prisma.changeRequest.create({
          data: {
            ...changeRequest,
            status: 'pending',
            requestedBy: changeRequest.requestedBy,
            requestedAt: new Date()
          }
        });
        
        // Notify approvers
        await notifyChangeApprovers(change);
        
        return change;
      },
      
      approveChange: async (changeId: string, approverId: string) => {
        // Implement change approval process
        await prisma.changeRequest.update({
          where: { id: changeId },
          data: {
            status: 'approved',
            approvedBy: approverId,
            approvedAt: new Date()
          }
        });
        
        // Log the approval
        await logSecurityEvent('CHANGE_APPROVED', { changeId, approverId });
      },
      
      implementChange: async (changeId: string) => {
        // Implement change implementation process
        const change = await prisma.changeRequest.findUnique({
          where: { id: changeId }
        });
        
        // Implement the change
        await implementSystemChange(change);
        
        // Update change status
        await prisma.changeRequest.update({
          where: { id: changeId },
          data: {
            status: 'implemented',
            implementedAt: new Date()
          }
        });
        
        // Log the implementation
        await logSecurityEvent('CHANGE_IMPLEMENTED', { changeId });
      }
    }
  },
  
  // Availability controls
  availabilityControls: {
    // Backup and recovery
    backupRecovery: {
      performBackup: async () => {
        // Implement backup process
        const backup = await performDatabaseBackup();
        
        // Store backup securely
        await storeBackupSecurely(backup);
        
        // Log the backup
        await logSecurityEvent('BACKUP_PERFORMED', { backupId: backup.id });
        
        return backup;
      },
      
      testRecovery: async () => {
        // Implement recovery testing
        const testRecovery = await testRecoveryProcedures();
        
        // Log the test
        await logSecurityEvent('RECOVERY_TESTED', { testId: testRecovery.id });
        
        return testRecovery;
      }
    },
    
    // Capacity planning
    capacityPlanning: {
      monitorCapacity: async () => {
        // Monitor system capacity
        const capacityMetrics = await getCapacityMetrics();
        
        // Alert if capacity thresholds exceeded
        if (capacityMetrics.usage > capacityMetrics.threshold) {
          await alertCapacityThreshold(capacityMetrics);
        }
        
        return capacityMetrics;
      },
      
      planCapacity: async () => {
        // Plan capacity based on usage trends
        const capacityPlan = await generateCapacityPlan();
        
        // Implement capacity improvements
        await implementCapacityImprovements(capacityPlan);
        
        return capacityPlan;
      }
    }
  }
};
```

## Data Privacy

### Privacy by Design
```typescript
// Privacy by design implementation
export const privacyByDesign = {
  // Data minimization
  dataMinimization: {
    collectOnlyNecessary: (dataRequest: any) => {
      const necessaryFields = [
        'email', 'name', 'phone', 'checkIn', 'checkOut'
      ];
      
      return Object.keys(dataRequest).filter(key => 
        necessaryFields.includes(key)
      );
    },
    
    anonymizeWhenPossible: (data: any) => {
      const anonymized = { ...data };
      
      // Anonymize non-essential fields
      if (anonymized.ipAddress) {
        anonymized.ipAddress = anonymizeIP(anonymized.ipAddress);
      }
      
      if (anonymized.userAgent) {
        anonymized.userAgent = anonymizeUserAgent(anonymized.userAgent);
      }
      
      return anonymized;
    }
  },
  
  // Purpose limitation
  purposeLimitation: {
    restrictDataUse: (data: any, purpose: string) => {
      const allowedPurposes = {
        booking: ['email', 'name', 'phone', 'checkIn', 'checkOut'],
        marketing: ['email', 'preferences'],
        analytics: ['usage_data', 'performance_metrics']
      };
      
      const allowedFields = allowedPurposes[purpose] || [];
      
      return Object.keys(data).filter(key => 
        allowedFields.includes(key)
      ).reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    }
  },
  
  // Storage limitation
  storageLimitation: {
    implementRetention: async (dataType: string) => {
      const retentionPolicies = {
        user_data: '3 years',
        booking_data: '7 years',
        payment_data: '6 months',
        analytics_data: '2 years'
      };
      
      const retentionPeriod = retentionPolicies[dataType];
      
      // Delete expired data
      await deleteExpiredData(dataType, retentionPeriod);
    }
  }
};
```

## Audit Procedures

### Compliance Auditing
```typescript
// Compliance audit procedures
export const complianceAuditing = {
  // GDPR audit
  gdprAudit: async () => {
    const auditResults = {
      dataProcessingRegister: await auditDataProcessingRegister(),
      consentManagement: await auditConsentManagement(),
      dataSubjectRights: await auditDataSubjectRights(),
      dataBreachProcedures: await auditDataBreachProcedures(),
      dataProtectionOfficer: await auditDataProtectionOfficer()
    };
    
    return {
      compliance: auditResults,
      recommendations: generateRecommendations(auditResults),
      nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    };
  },
  
  // PCI DSS audit
  pciDssAudit: async () => {
    const auditResults = {
      networkSecurity: await auditNetworkSecurity(),
      cardDataProtection: await auditCardDataProtection(),
      vulnerabilityManagement: await auditVulnerabilityManagement(),
      accessControls: await auditAccessControls(),
      monitoring: await auditMonitoring(),
      securityPolicy: await auditSecurityPolicy()
    };
    
    return {
      compliance: auditResults,
      recommendations: generateRecommendations(auditResults),
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
    };
  },
  
  // SOC 2 audit
  soc2Audit: async () => {
    const auditResults = {
      security: await auditSecurityControls(),
      availability: await auditAvailabilityControls(),
      processingIntegrity: await auditProcessingIntegrity(),
      confidentiality: await auditConfidentiality(),
      privacy: await auditPrivacy()
    };
    
    return {
      compliance: auditResults,
      recommendations: generateRecommendations(auditResults),
      nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    };
  }
};
```

## Best Practices

### 1. Regular Audits
- Conduct annual compliance audits
- Review privacy policies regularly
- Update security measures
- Train staff on compliance

### 2. Documentation
- Maintain detailed compliance records
- Document all data processing activities
- Keep audit trails
- Update procedures regularly

### 3. Training
- Regular staff training on compliance
- Update training materials
- Test compliance knowledge
- Certify staff on procedures

### 4. Monitoring
- Monitor compliance continuously
- Alert on compliance violations
- Track compliance metrics
- Report on compliance status 