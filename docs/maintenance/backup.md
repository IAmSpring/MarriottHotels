# Backup Strategy

## Overview
This document describes the backup strategy for the Marriott Hotels platform, including database, file, and configuration backups, as well as restoration procedures and best practices.

## Table of Contents
- [Backup Types](#backup-types)
- [Backup Schedule](#backup-schedule)
- [Backup Storage](#backup-storage)
- [Restoration Procedures](#restoration-procedures)
- [Testing Backups](#testing-backups)
- [Best Practices](#best-practices)

## Backup Types
- **Database Backups**: Full and incremental backups of PostgreSQL and Redis.
- **File Backups**: Static assets, user uploads, and configuration files.
- **Configuration Backups**: Environment files, deployment scripts, and infrastructure as code.

## Backup Schedule
- **Database**: Full backup daily at 2 AM, incremental every 4 hours.
- **Files**: Daily at 3 AM.
- **Configurations**: Weekly on Sundays at 4 AM.

## Backup Storage
- **Primary**: AWS S3 with versioning enabled.
- **Secondary**: Encrypted offsite storage (e.g., Google Cloud Storage).
- **Retention**: 30 days for daily, 12 months for weekly, 7 years for monthly compliance backups.

## Restoration Procedures
1. Identify the required backup from S3 or secondary storage.
2. Download and decrypt the backup file.
3. For databases, use `pg_restore` or Redis `restore` command.
4. For files, extract and copy to the appropriate directory.
5. Validate integrity and application functionality.

## Testing Backups
- Perform monthly restoration drills in a staging environment.
- Validate data integrity and application startup.
- Document and review results.

## Best Practices
- Automate backup and monitoring.
- Encrypt all backups at rest and in transit.
- Regularly test restoration procedures.
- Document backup and recovery processes.
- Monitor backup job success and alert on failures. 