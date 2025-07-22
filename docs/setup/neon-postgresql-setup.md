# Neon PostgreSQL Setup Guide

## Overview
This guide will help you set up Neon PostgreSQL as the database for the Marriott Hotels application. Neon provides a serverless PostgreSQL database that's perfect for development and production environments.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A Neon account (free tier available)

## Step 1: Create Neon Database

### 1.1 Sign up for Neon
1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" and create an account
3. Verify your email address

### 1.2 Create a New Project
1. Log in to your Neon dashboard
2. Click "Create New Project"
3. Choose a project name (e.g., "marriott-hotels")
4. Select a region closest to your users
5. Click "Create Project"

### 1.3 Get Connection Details
1. In your project dashboard, click on "Connection Details"
2. Copy the connection string
3. Note down your database name, username, and password

## Step 2: Configure Environment Variables

### 2.1 Create Environment File
Create a `.env` file in your project root:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database_name?sslmode=require"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# OpenAI Configuration (if using AI features)
OPENAI_API_KEY="your-openai-api-key"

# Stripe Configuration (if using payments)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Server Configuration
PORT=4000
NODE_ENV=development
```

### 2.2 Update Prisma Configuration
The Prisma schema is already configured for PostgreSQL. Make sure your `prisma/schema.prisma` file has:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 3: Install Dependencies

### 3.1 Install Required Packages
```bash
npm install @prisma/client pg
npm install -D prisma
```

### 3.2 Install bcryptjs for password hashing
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

## Step 4: Database Setup

### 4.1 Generate Prisma Client
```bash
npx prisma generate
```

### 4.2 Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 4.3 Seed the Database
```bash
npm run prisma:seed
```

## Step 5: Verify Setup

### 5.1 Test Database Connection
```bash
npx prisma studio
```

This will open Prisma Studio in your browser where you can view and manage your data.

### 5.2 Test API Endpoints
Start your development server:
```bash
npm run dev
```

Visit `http://localhost:4000/graphql` to test the GraphQL playground.

## Step 6: Production Considerations

### 6.1 Environment Variables
For production, make sure to:
- Use strong, unique passwords
- Set `NODE_ENV=production`
- Use environment-specific database URLs
- Secure your JWT secret

### 6.2 Database Optimization
- Enable connection pooling for better performance
- Set up automated backups
- Monitor database performance
- Configure proper indexes

### 6.3 Security
- Use SSL connections (already configured in connection string)
- Implement proper authentication
- Set up row-level security (RLS) if needed
- Regular security updates

## Troubleshooting

### Common Issues

#### 1. Connection Timeout
```
Error: connect ETIMEDOUT
```
**Solution**: Check your internet connection and Neon service status.

#### 2. Authentication Failed
```
Error: password authentication failed
```
**Solution**: Verify your database credentials in the `.env` file.

#### 3. SSL Connection Issues
```
Error: no pg_hba.conf entry for host
```
**Solution**: Make sure your connection string includes `?sslmode=require`.

#### 4. Migration Failures
```
Error: relation already exists
```
**Solution**: Reset your database and run migrations fresh:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Performance Tips

1. **Connection Pooling**: Use connection pooling for better performance
2. **Indexes**: Add indexes for frequently queried fields
3. **Query Optimization**: Use Prisma's query optimization features
4. **Monitoring**: Set up database monitoring and alerts

## Neon-Specific Features

### 1. Branching
Neon supports database branching for development:
```bash
# Create a development branch
neon branch create dev-branch

# Switch to the branch
neon branch switch dev-branch
```

### 2. Auto-scaling
Neon automatically scales based on your usage, so you don't need to worry about capacity planning.

### 3. Point-in-time Recovery
Neon provides automatic backups with point-in-time recovery capabilities.

## Next Steps

1. **Set up monitoring**: Configure database monitoring and alerts
2. **Implement caching**: Add Redis or similar for caching
3. **Backup strategy**: Set up automated backups
4. **Security audit**: Review and implement security best practices
5. **Performance testing**: Load test your application

## Support

- **Neon Documentation**: [docs.neon.tech](https://docs.neon.tech)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)
- **Community Support**: [Neon Discord](https://discord.gg/neondatabase)

---

*This setup guide provides everything you need to get started with Neon PostgreSQL for the Marriott Hotels application. For additional help, refer to the official documentation or reach out to the development team.* 