# Local Development Setup

This document provides a comprehensive guide for setting up the Marriott Hotels platform for local development.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [AI Services Setup](#ai-services-setup)
- [Testing Setup](#testing-setup)
- [Development Workflow](#development-workflow)

## Prerequisites

Before setting up the local development environment, ensure you have the following installed:

### Required Software

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Docker** (optional, for containerized development)
- **PostgreSQL** (v13 or higher)

### System Requirements

- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: At least 10GB free space
- **OS**: macOS, Windows, or Linux

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/IAmSpring/MarriottHotels.git
cd MarriottHotels
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd src
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/marriott_hotels"
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=marriott_hotels
DATABASE_USER=username
DATABASE_PASSWORD=password

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_ORGANIZATION=your-organization-id

# LangSmith Configuration
LANGSMITH_API_KEY=your-langsmith-api-key
LANGSMITH_PROJECT=marriott-hotels-dev
LANGSMITH_ENDPOINT=https://api.smith.langchain.com

# Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## Database Setup

### 1. PostgreSQL Installation

#### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Download and install from the official PostgreSQL website.

### 2. Database Creation

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE marriott_hotels;
CREATE USER marriott_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE marriott_hotels TO marriott_user;
\q
```

### 3. Database Migration

```bash
# Run Prisma migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

## Frontend Setup

### 1. Development Server

```bash
# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 2. Build Process

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Backend Setup

### 1. API Development

The backend API is integrated with the Next.js frontend. API routes are located in `src/pages/api/`.

### 2. Authentication Setup

```bash
# Generate NextAuth secret
openssl rand -base64 32
```

Add the generated secret to your `.env` file.

## AI Services Setup

### 1. OpenAI Configuration

1. Create an OpenAI account at https://openai.com
2. Generate an API key
3. Add the key to your `.env` file

### 2. LangSmith Setup

1. Create a LangSmith account at https://smith.langchain.com
2. Generate an API key
3. Create a project for development
4. Add the configuration to your `.env` file

### 3. Voice Processing

For voice processing features, ensure you have:

- Microphone access enabled in your browser
- HTTPS setup for production (required for voice features)

## Testing Setup

### 1. Unit Tests

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch
```

### 2. Integration Tests

```bash
# Run integration tests
npm run test:integration
```

### 3. E2E Tests

```bash
# Install Cypress
npm install cypress --save-dev

# Run E2E tests
npm run test:e2e
```

## Development Workflow

### 1. Code Quality

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Format code
npm run format
```

### 2. Git Workflow

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name
```

### 3. Database Changes

When making database schema changes:

```bash
# Create a new migration
npx prisma migrate dev --name your-migration-name

# Reset database (development only)
npx prisma migrate reset
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill the process
   kill -9 <PID>
   ```

2. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

3. **Node Modules Issues**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Environment Variables**
   - Ensure all required variables are set in `.env`
   - Restart the development server after changing `.env`

### Getting Help

- Check the project's GitHub Issues
- Review the documentation in the `/docs` folder
- Contact the development team

## Next Steps

After completing the setup:

1. Explore the application at `http://localhost:3000`
2. Review the admin interface at `http://localhost:3000/admin`
3. Test the AI chatbot features
4. Familiarize yourself with the codebase structure

## Maintenance

### Regular Tasks

- Update dependencies: `npm update`
- Check for security vulnerabilities: `npm audit`
- Update database schema as needed
- Monitor application logs

### Performance Monitoring

- Use browser developer tools for frontend performance
- Monitor API response times
- Check database query performance
- Review AI service usage and costs 