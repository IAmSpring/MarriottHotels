# Maintenance Monitoring

## Overview
This document outlines the monitoring and maintenance procedures for the Marriott Hotels platform, covering system health, performance monitoring, alerting, and incident response.

## Table of Contents
- [System Monitoring](#system-monitoring)
- [Performance Monitoring](#performance-monitoring)
- [Alert Management](#alert-management)
- [Incident Response](#incident-response)
- [Maintenance Procedures](#maintenance-procedures)

## System Monitoring

### Infrastructure Monitoring
```typescript
// Infrastructure monitoring configuration
const INFRASTRUCTURE_MONITORING = {
  servers: {
    cpu: {
      threshold: 80, // Alert if CPU > 80%
      collection: '5s',
      retention: '30d'
    },
    memory: {
      threshold: 85, // Alert if memory > 85%
      collection: '10s',
      retention: '30d'
    },
    disk: {
      threshold: 90, // Alert if disk > 90%
      collection: '30s',
      retention: '30d'
    },
    network: {
      bandwidth: {
        threshold: 80, // Alert if bandwidth > 80%
        collection: '1m',
        retention: '30d'
      },
      latency: {
        threshold: 100, // Alert if latency > 100ms
        collection: '30s',
        retention: '30d'
      }
    }
  },
  
  databases: {
    postgres: {
      connections: {
        threshold: 80, // Alert if connections > 80%
        collection: '1m',
        retention: '30d'
      },
      queryPerformance: {
        slowQueryThreshold: 1000, // Alert if query > 1s
        collection: '1m',
        retention: '30d'
      },
      replication: {
        lagThreshold: 10, // Alert if replication lag > 10s
        collection: '30s',
        retention: '30d'
      }
    },
    
    redis: {
      memory: {
        threshold: 85, // Alert if memory > 85%
        collection: '1m',
        retention: '30d'
      },
      connections: {
        threshold: 80, // Alert if connections > 80%
        collection: '1m',
        retention: '30d'
      },
      hitRate: {
        threshold: 90, // Alert if hit rate < 90%
        collection: '5m',
        retention: '30d'
      }
    }
  },
  
  applications: {
    api: {
      responseTime: {
        threshold: 500, // Alert if response time > 500ms
        collection: '1m',
        retention: '30d'
      },
      errorRate: {
        threshold: 5, // Alert if error rate > 5%
        collection: '1m',
        retention: '30d'
      },
      throughput: {
        threshold: 1000, // Alert if throughput < 1000 req/s
        collection: '1m',
        retention: '30d'
      }
    },
    
    frontend: {
      loadTime: {
        threshold: 3000, // Alert if load time > 3s
        collection: '1m',
        retention: '30d'
      },
      errorRate: {
        threshold: 2, // Alert if error rate > 2%
        collection: '1m',
        retention: '30d'
      }
    }
  }
};

// Monitoring service
export const monitoringService = {
  // Collect system metrics
  collectSystemMetrics: async () => {
    const metrics = {
      cpu: await getCPUUsage(),
      memory: await getMemoryUsage(),
      disk: await getDiskUsage(),
      network: await getNetworkMetrics()
    };
    
    // Store metrics
    await storeMetrics('system', metrics);
    
    // Check thresholds
    await checkThresholds('system', metrics);
    
    return metrics;
  },
  
  // Collect database metrics
  collectDatabaseMetrics: async () => {
    const metrics = {
      postgres: await getPostgresMetrics(),
      redis: await getRedisMetrics()
    };
    
    // Store metrics
    await storeMetrics('database', metrics);
    
    // Check thresholds
    await checkThresholds('database', metrics);
    
    return metrics;
  },
  
  // Collect application metrics
  collectApplicationMetrics: async () => {
    const metrics = {
      api: await getAPIMetrics(),
      frontend: await getFrontendMetrics()
    };
    
    // Store metrics
    await storeMetrics('application', metrics);
    
    // Check thresholds
    await checkThresholds('application', metrics);
    
    return metrics;
  }
};
```

## Performance Monitoring

### Application Performance Monitoring (APM)
```typescript
// APM configuration
const APM_CONFIG = {
  service: 'marriott-hotels',
  environment: process.env.NODE_ENV,
  serverUrl: process.env.APM_SERVER_URL,
  logLevel: 'info',
  captureBody: 'errors',
  captureHeaders: true,
  metrics: {
    transactionSampleRate: 1.0,
    errorSampleRate: 1.0
  }
};

// APM service
export const apmService = {
  // Track transactions
  trackTransaction: (name: string, type: string) => {
    const transaction = apm.startTransaction(name, type);
    return transaction;
  },
  
  // Track spans
  trackSpan: (name: string, type: string, parent?: any) => {
    const span = apm.startSpan(name, type, { childOf: parent });
    return span;
  },
  
  // Track errors
  trackError: (error: Error, context?: any) => {
    apm.captureError(error, {
      custom: context,
      tags: { component: 'application' }
    });
  },
  
  // Track metrics
  trackMetric: (name: string, value: number, tags?: any) => {
    apm.metric(name, value, tags);
  }
};

// Performance monitoring middleware
export const performanceMiddleware = {
  // Track API performance
  trackAPIPerformance: (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const transaction = apmService.trackTransaction(
      `${req.method} ${req.path}`,
      'request'
    );
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      // Track response time
      apmService.trackMetric('http.response_time', duration, {
        method: req.method,
        path: req.path,
        status: res.statusCode
      });
      
      // Track throughput
      apmService.trackMetric('http.requests_total', 1, {
        method: req.method,
        path: req.path,
        status: res.statusCode
      });
      
      transaction.result = res.statusCode < 400 ? 'success' : 'error';
      transaction.end();
    });
    
    next();
  },
  
  // Track database performance
  trackDatabasePerformance: (query: string, duration: number) => {
    apmService.trackMetric('db.query_duration', duration, {
      query: query.substring(0, 50) // Truncate for privacy
    });
  },
  
  // Track external API performance
  trackExternalAPIPerformance: (service: string, duration: number) => {
    apmService.trackMetric('external_api.duration', duration, {
      service
    });
  }
};
```

## Alert Management

### Alert Configuration
```typescript
// Alert configuration
const ALERT_CONFIG = {
  channels: {
    email: {
      recipients: ['ops@marriott.com', 'oncall@marriott.com'],
      template: 'alert-email-template'
    },
    slack: {
      webhook: process.env.SLACK_WEBHOOK_URL,
      channel: '#alerts'
    },
    pagerduty: {
      serviceKey: process.env.PAGERDUTY_SERVICE_KEY,
      escalationPolicy: 'ops-escalation'
    }
  },
  
  rules: {
    critical: {
      responseTime: '> 5s',
      errorRate: '> 10%',
      cpuUsage: '> 95%',
      memoryUsage: '> 95%',
      diskUsage: '> 95%'
    },
    
    warning: {
      responseTime: '> 2s',
      errorRate: '> 5%',
      cpuUsage: '> 80%',
      memoryUsage: '> 85%',
      diskUsage: '> 90%'
    },
    
    info: {
      deployment: 'success',
      backup: 'completed',
      certificate: 'expiring_soon'
    }
  }
};

// Alert service
export const alertService = {
  // Send alert
  sendAlert: async (alert: any) => {
    const { severity, message, context } = alert;
    
    // Determine channels based on severity
    const channels = severity === 'critical' 
      ? ['email', 'slack', 'pagerduty']
      : severity === 'warning'
      ? ['email', 'slack']
      : ['slack'];
    
    // Send to all channels
    for (const channel of channels) {
      await sendAlertToChannel(channel, alert);
    }
    
    // Log alert
    await logAlert(alert);
  },
  
  // Check alert conditions
  checkAlertConditions: async (metrics: any) => {
    const alerts = [];
    
    // Check critical conditions
    if (metrics.responseTime > 5000) {
      alerts.push({
        severity: 'critical',
        message: 'Response time exceeded 5 seconds',
        context: { responseTime: metrics.responseTime }
      });
    }
    
    if (metrics.errorRate > 10) {
      alerts.push({
        severity: 'critical',
        message: 'Error rate exceeded 10%',
        context: { errorRate: metrics.errorRate }
      });
    }
    
    if (metrics.cpuUsage > 95) {
      alerts.push({
        severity: 'critical',
        message: 'CPU usage exceeded 95%',
        context: { cpuUsage: metrics.cpuUsage }
      });
    }
    
    // Check warning conditions
    if (metrics.responseTime > 2000) {
      alerts.push({
        severity: 'warning',
        message: 'Response time exceeded 2 seconds',
        context: { responseTime: metrics.responseTime }
      });
    }
    
    if (metrics.errorRate > 5) {
      alerts.push({
        severity: 'warning',
        message: 'Error rate exceeded 5%',
        context: { errorRate: metrics.errorRate }
      });
    }
    
    return alerts;
  }
};
```

## Incident Response

### Incident Management
```typescript
// Incident management service
export const incidentService = {
  // Create incident
  createIncident: async (incident: any) => {
    const newIncident = await prisma.incident.create({
      data: {
        title: incident.title,
        description: incident.description,
        severity: incident.severity,
        status: 'open',
        reportedBy: incident.reportedBy,
        reportedAt: new Date()
      }
    });
    
    // Notify stakeholders
    await notifyStakeholders(newIncident);
    
    // Create response team
    await createResponseTeam(newIncident);
    
    return newIncident;
  },
  
  // Update incident
  updateIncident: async (incidentId: string, updates: any) => {
    const updatedIncident = await prisma.incident.update({
      where: { id: incidentId },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    });
    
    // Log update
    await logIncidentUpdate(incidentId, updates);
    
    // Notify if status changed
    if (updates.status) {
      await notifyStatusChange(updatedIncident);
    }
    
    return updatedIncident;
  },
  
  // Resolve incident
  resolveIncident: async (incidentId: string, resolution: any) => {
    const resolvedIncident = await prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: 'resolved',
        resolvedAt: new Date(),
        resolution: resolution.description,
        resolvedBy: resolution.resolvedBy
      }
    });
    
    // Create post-incident review
    await createPostIncidentReview(resolvedIncident);
    
    // Notify resolution
    await notifyResolution(resolvedIncident);
    
    return resolvedIncident;
  },
  
  // Escalate incident
  escalateIncident: async (incidentId: string, escalation: any) => {
    const escalatedIncident = await prisma.incident.update({
      where: { id: incidentId },
      data: {
        severity: escalation.newSeverity,
        escalatedAt: new Date(),
        escalatedBy: escalation.escalatedBy,
        escalationReason: escalation.reason
      }
    });
    
    // Notify escalation
    await notifyEscalation(escalatedIncident);
    
    return escalatedIncident;
  }
};
```

## Maintenance Procedures

### Scheduled Maintenance
```typescript
// Maintenance procedures
export const maintenanceProcedures = {
  // Database maintenance
  databaseMaintenance: {
    // Vacuum database
    vacuumDatabase: async () => {
      logger.info('Starting database vacuum');
      
      try {
        await prisma.$executeRaw`VACUUM ANALYZE`;
        logger.info('Database vacuum completed');
        
        // Log maintenance
        await logMaintenance('database_vacuum', 'success');
      } catch (error) {
        logger.error('Database vacuum failed:', error);
        await logMaintenance('database_vacuum', 'failed', error);
        throw error;
      }
    },
    
    // Update statistics
    updateStatistics: async () => {
      logger.info('Starting statistics update');
      
      try {
        await prisma.$executeRaw`ANALYZE`;
        logger.info('Statistics update completed');
        
        // Log maintenance
        await logMaintenance('statistics_update', 'success');
      } catch (error) {
        logger.error('Statistics update failed:', error);
        await logMaintenance('statistics_update', 'failed', error);
        throw error;
      }
    },
    
    // Backup database
    backupDatabase: async () => {
      logger.info('Starting database backup');
      
      try {
        const backup = await performDatabaseBackup();
        logger.info('Database backup completed');
        
        // Log maintenance
        await logMaintenance('database_backup', 'success', { backupId: backup.id });
        
        return backup;
      } catch (error) {
        logger.error('Database backup failed:', error);
        await logMaintenance('database_backup', 'failed', error);
        throw error;
      }
    }
  },
  
  // Application maintenance
  applicationMaintenance: {
    // Clear old logs
    clearOldLogs: async () => {
      logger.info('Starting log cleanup');
      
      try {
        const deletedCount = await clearExpiredLogs();
        logger.info(`Log cleanup completed: ${deletedCount} records deleted`);
        
        // Log maintenance
        await logMaintenance('log_cleanup', 'success', { deletedCount });
      } catch (error) {
        logger.error('Log cleanup failed:', error);
        await logMaintenance('log_cleanup', 'failed', error);
        throw error;
      }
    },
    
    // Clear old cache
    clearOldCache: async () => {
      logger.info('Starting cache cleanup');
      
      try {
        const clearedCount = await clearExpiredCache();
        logger.info(`Cache cleanup completed: ${clearedCount} entries cleared`);
        
        // Log maintenance
        await logMaintenance('cache_cleanup', 'success', { clearedCount });
      } catch (error) {
        logger.error('Cache cleanup failed:', error);
        await logMaintenance('cache_cleanup', 'failed', error);
        throw error;
      }
    },
    
    // Update dependencies
    updateDependencies: async () => {
      logger.info('Starting dependency update');
      
      try {
        const updates = await updateApplicationDependencies();
        logger.info('Dependency update completed');
        
        // Log maintenance
        await logMaintenance('dependency_update', 'success', { updates });
      } catch (error) {
        logger.error('Dependency update failed:', error);
        await logMaintenance('dependency_update', 'failed', error);
        throw error;
      }
    }
  },
  
  // System maintenance
  systemMaintenance: {
    // Update system packages
    updateSystemPackages: async () => {
      logger.info('Starting system package update');
      
      try {
        await updateSystemPackages();
        logger.info('System package update completed');
        
        // Log maintenance
        await logMaintenance('system_update', 'success');
      } catch (error) {
        logger.error('System package update failed:', error);
        await logMaintenance('system_update', 'failed', error);
        throw error;
      }
    },
    
    // Restart services
    restartServices: async (services: string[]) => {
      logger.info('Starting service restart');
      
      try {
        for (const service of services) {
          await restartService(service);
          logger.info(`Service ${service} restarted`);
        }
        
        // Log maintenance
        await logMaintenance('service_restart', 'success', { services });
      } catch (error) {
        logger.error('Service restart failed:', error);
        await logMaintenance('service_restart', 'failed', error);
        throw error;
      }
    }
  }
};
```

## Best Practices

### 1. Monitoring
- Monitor all critical systems
- Set appropriate thresholds
- Use multiple monitoring tools
- Regular metric analysis

### 2. Alerting
- Configure meaningful alerts
- Avoid alert fatigue
- Escalate appropriately
- Regular alert review

### 3. Maintenance
- Schedule maintenance windows
- Test procedures in staging
- Document all procedures
- Regular maintenance reviews

### 4. Incident Response
- Follow incident procedures
- Communicate clearly
- Document lessons learned
- Regular incident reviews 