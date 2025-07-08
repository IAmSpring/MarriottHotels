import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for Playwright tests...');

  // Create test results directory
  const testResultsDir = path.join(process.cwd(), 'test-results');
  if (!existsSync(testResultsDir)) {
    mkdirSync(testResultsDir, { recursive: true });
  }

  // Create screenshots directory
  const screenshotsDir = path.join(testResultsDir, 'screenshots');
  if (!existsSync(screenshotsDir)) {
    mkdirSync(screenshotsDir, { recursive: true });
  }

  // Create videos directory
  const videosDir = path.join(testResultsDir, 'videos');
  if (!existsSync(videosDir)) {
    mkdirSync(videosDir, { recursive: true });
  }

  try {
    // Run database migrations
    console.log('📊 Running database migrations...');
    execSync('npx prisma migrate dev', { stdio: 'inherit' });

    // Seed the database with test data
    console.log('🌱 Seeding database with test data...');
    execSync('npm run prisma:seed', { stdio: 'inherit' });

    // Start the development server if not already running
    console.log('🌐 Starting development server...');
    const serverUrl = 'http://localhost:5173';
    
    // Check if server is already running
    try {
      const response = await fetch(serverUrl);
      if (response.ok) {
        console.log('✅ Development server is already running');
      }
    } catch (error) {
      console.log('⚠️ Development server not running, will be started by webServer config');
    }

    // Wait for dev server to be ready
    const maxWait = 30000; // 30 seconds
    const interval = 1000;
    let waited = 0;
    let serverReady = false;
    while (waited < maxWait) {
      try {
        const res = await fetch(serverUrl);
        if (res.ok) {
          serverReady = true;
          break;
        }
      } catch (e) {
        // Not ready yet
      }
      await new Promise(r => setTimeout(r, interval));
      waited += interval;
    }
    if (!serverReady) {
      throw new Error('Dev server not ready after 30 seconds');
    }

    // Take initial screenshots of key pages
    console.log('📸 Taking initial screenshots...');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Screenshot of homepage
    await page.goto(serverUrl);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-homepage.png'),
      fullPage: true 
    });

    // Screenshot of admin panel
    await page.goto(`${serverUrl}/admin`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '02-admin-panel.png'),
      fullPage: true 
    });

    // Screenshot of AI chat interface
    await page.goto(serverUrl);
    await page.waitForLoadState('networkidle');
    const chatButton = page.locator('[data-testid="chat-button"]');
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '03-ai-chat.png'),
        fullPage: true 
      });
    }

    await browser.close();
    console.log('✅ Global setup completed successfully');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

export default globalSetup; 