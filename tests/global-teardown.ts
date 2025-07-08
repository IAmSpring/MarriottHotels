import { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for Playwright tests...');

  try {
    // Generate test report summary
    console.log('📊 Generating test report summary...');
    const testResultsDir = path.join(process.cwd(), 'test-results');
    
    if (existsSync(testResultsDir)) {
      const screenshotsDir = path.join(testResultsDir, 'screenshots');
      const videosDir = path.join(testResultsDir, 'videos');
      
      // Count screenshots
      let screenshotCount = 0;
      if (existsSync(screenshotsDir)) {
        screenshotCount = readdirSync(screenshotsDir).length;
      }
      
      // Count videos
      let videoCount = 0;
      if (existsSync(videosDir)) {
        videoCount = readdirSync(videosDir).length;
      }
      
      console.log(`📸 Screenshots captured: ${screenshotCount}`);
      console.log(`🎥 Videos recorded: ${videoCount}`);
      
      // Create summary report
      const summaryPath = path.join(testResultsDir, 'test-summary.txt');
      const summary = `
Playwright Test Summary
======================
Date: ${new Date().toISOString()}
Screenshots: ${screenshotCount}
Videos: ${videoCount}
Project: Marriott Hotels AI Platform
Environment: ${process.env.NODE_ENV || 'development'}
      `.trim();
      
      writeFileSync(summaryPath, summary);
      console.log('📝 Test summary written to test-results/test-summary.txt');
    }

    // Clean up temporary files (optional)
    console.log('🧹 Cleaning up temporary files...');
    
    // Note: We don't clean up test artifacts as they're useful for debugging
    // but we could add cleanup logic here if needed
    
    console.log('✅ Global teardown completed successfully');

  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown as it might mask test failures
  }
}

export default globalTeardown; 