# Frequently Asked Questions (FAQ)

## General Questions

### What is the Marriott Hotels AI Platform?
The Marriott Hotels AI Platform is a comprehensive hotel management system that integrates artificial intelligence to provide personalized guest experiences, automated booking assistance, and intelligent concierge services.

### What technologies does the platform use?
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **AI**: OpenAI GPT models, LangSmith tracing
- **Database**: PostgreSQL
- **Monitoring**: Datadog APM, Prometheus metrics, PostHog analytics
- **Deployment**: Vercel, GitHub Actions

### Is this a real Marriott Hotels product?
No, this is a demonstration project showcasing AI integration in hotel management systems. It's not affiliated with Marriott International.

## Technical Questions

### How do I set up the project locally?
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run database migrations: `npx prisma migrate dev`
5. Start the development server: `npm run dev`

### What environment variables are required?
- `OPENAI_API_KEY`: Your OpenAI API key
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Authentication secret
- `POSTHOG_API_KEY`: Analytics key (optional)
- `LANGCHAIN_API_KEY`: LangSmith tracing key (optional)

### How do I deploy to production?
See the [Production Deployment Guide](../deployment/production-pipeline.md) for detailed instructions.

### Can I use a different AI provider?
Yes, the platform is designed to be provider-agnostic. You can modify the AI integration in `src/lib/openai.ts` to use other providers like Anthropic Claude or Google Gemini.

## AI Features

### How does the AI assistant work?
The AI assistant uses OpenAI's GPT models to understand natural language queries and provide hotel recommendations, booking assistance, and concierge services. It integrates with LangSmith for tracing and monitoring.

### What tools does the AI assistant have?
- Hotel search and recommendations
- Availability checking
- Local attractions and dining
- Bonvoy rewards information
- Transportation options
- Booking assistance

### How accurate are the AI recommendations?
The AI provides realistic mock data for demonstration purposes. In a production environment, it would integrate with real hotel inventory and booking systems.

### Can the AI handle voice interactions?
Yes, the platform includes voice processing capabilities for speech-to-text and text-to-speech conversion, enabling voice-based interactions.

## Admin Features

### How do I access the admin panel?
Navigate to `/admin` in your browser. The admin panel provides:
- Hotel management
- Booking oversight
- AI conversation monitoring
- Performance analytics
- User management

### What can I monitor in the admin panel?
- Real-time booking data
- AI conversation logs
- System performance metrics
- User activity analytics
- Error logs and alerts

### How do I view AI conversations?
Go to `/admin/ai/conversations` to see all AI interactions, including:
- Conversation history
- Tool usage
- Response times
- Error tracking

## Troubleshooting

### The AI assistant isn't responding
1. Check your OpenAI API key is valid
2. Verify your internet connection
3. Check the browser console for errors
4. Review the server logs for API issues

### Database connection errors
1. Ensure PostgreSQL is running
2. Verify your `DATABASE_URL` is correct
3. Run `npx prisma migrate dev` to update schema
4. Check database permissions

### Build errors
1. Clear node_modules: `rm -rf node_modules package-lock.json`
2. Reinstall dependencies: `npm install`
3. Check TypeScript errors: `npm run type-check`
4. Verify all environment variables are set

### Performance issues
1. Check browser developer tools for slow requests
2. Review server logs for bottlenecks
3. Monitor memory usage
4. Consider scaling your deployment

## Security

### Is my data secure?
The platform implements industry-standard security measures:
- HTTPS encryption
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting

### How is authentication handled?
The platform uses NextAuth.js for secure authentication with multiple providers and session management.

### Are API keys exposed?
No, API keys are stored securely as environment variables and never exposed to the client-side code.

## Support

### Where can I get help?
- Check this FAQ first
- Review the [Troubleshooting Guide](../maintenance/troubleshooting.md)
- Look at [Known Issues](./known-issues.md)
- Contact support (see [Contact Information](./contact.md))

### How do I report bugs?
Please report bugs through the project's GitHub issues page with:
- Detailed description of the problem
- Steps to reproduce
- Browser/OS information
- Error messages or logs

### Can I contribute to the project?
Yes! See the [Contributing Guidelines](../contributing/guidelines.md) for how to get involved.

## Performance

### What's the expected response time?
- AI responses: 2-5 seconds
- Page loads: < 2 seconds
- API calls: < 1 second

### How many concurrent users can it handle?
The platform is designed to scale horizontally. Performance depends on your deployment configuration and resources.

### How do I optimize performance?
- Enable caching
- Use CDN for static assets
- Optimize database queries
- Implement proper indexing
- Monitor and scale based on usage

## Development

### How do I add new features?
1. Create a feature branch
2. Follow the [Code Standards](../contributing/code-standards.md)
3. Write tests for new functionality
4. Update documentation
5. Submit a pull request

### What's the testing strategy?
- Unit tests for components
- Integration tests for APIs
- E2E tests for user flows
- AI component testing
- Performance testing

### How do I run tests?
```bash
npm run test          # Run all tests
npm run test:unit     # Unit tests only
npm run test:e2e      # End-to-end tests
npm run test:ai       # AI component tests
```

## Deployment

### What hosting options are supported?
- Vercel (recommended)
- Netlify
- AWS
- Google Cloud
- Any Node.js hosting platform

### How do I set up monitoring?
The platform includes built-in monitoring with:
- Datadog APM for application performance
- Prometheus for metrics
- PostHog for analytics
- LangSmith for AI tracing

### What's the deployment process?
1. Set up environment variables
2. Configure database
3. Run migrations
4. Deploy to your hosting platform
5. Verify deployment
6. Set up monitoring

## Updates

### How often is the platform updated?
Updates are released regularly with:
- Bug fixes
- Security patches
- New features
- Performance improvements

### How do I update the platform?
1. Pull the latest changes
2. Update dependencies: `npm install`
3. Run migrations: `npx prisma migrate dev`
4. Test thoroughly
5. Deploy to production

### Is backward compatibility maintained?
Yes, the platform follows semantic versioning and maintains backward compatibility within major versions. 