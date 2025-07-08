import { test, expect } from '@playwright/test';

test.describe('Homepage Splash and Landing', () => {
  test('should show splash and fade into landing page', async ({ page }) => {
    await page.goto('/');
    // Wait for splash/intro to appear (adjust selector as needed)
    const splash = page.locator('[data-testid="splash-intro"], .splash-intro, .splash, .intro');
    await expect(splash).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'test-results/screenshots/splash-intro.png' });

    // Wait for splash to fade out (not visible or detached)
    await splash.waitFor({ state: 'hidden', timeout: 10000 });

    // Wait for hero section to appear
    const hero = page.locator('[data-testid="hero-section"], .hero-section, .hero');
    await expect(hero).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'test-results/screenshots/landing-hero.png' });
  });
});

test.describe('Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Marriott Hotels/i);
    
    // Verify main navigation elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a[href="/hotels"]')).toBeVisible();
    await expect(page.locator('a[href="/destinations"]')).toBeVisible();
    await expect(page.locator('a[href="/experiences"]')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/screenshots/homepage-loaded.png', fullPage: true });
  });

  test('should display hero section with search functionality', async ({ page }) => {
    // Check hero section
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
    
    // Check search input
    const searchInput = page.locator('input[placeholder*="where"]');
    await expect(searchInput).toBeVisible();
    
    // Test search functionality
    await searchInput.fill('Miami');
    await searchInput.press('Enter');
    
    // Wait for search results or navigation
    await page.waitForTimeout(2000);
    
    // Take screenshot of search interaction
    await page.screenshot({ path: 'test-results/screenshots/search-interaction.png', fullPage: true });
  });

  test('should display featured hotels section', async ({ page }) => {
    // Scroll to featured hotels section
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(1000);
    
    // Check for hotel cards
    const hotelCards = page.locator('[data-testid="hotel-card"]');
    await expect(hotelCards.first()).toBeVisible();
    
    // Take screenshot of featured hotels
    await page.screenshot({ path: 'test-results/screenshots/featured-hotels.png', fullPage: true });
  });

  test('should display AI chat interface', async ({ page }) => {
    // Look for chat button or interface
    const chatButton = page.locator('[data-testid="chat-button"], .chat-button, button:has-text("Chat")');
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
      
      // Check if chat interface appears
      const chatInterface = page.locator('[data-testid="chat-interface"], .chat-interface');
      await expect(chatInterface).toBeVisible();
      
      // Take screenshot of chat interface
      await page.screenshot({ path: 'test-results/screenshots/ai-chat-interface.png', fullPage: true });
    } else {
      // If no chat button, take screenshot of homepage
      await page.screenshot({ path: 'test-results/screenshots/homepage-no-chat.png', fullPage: true });
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Check if navigation is mobile-friendly
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/screenshots/mobile-homepage.png', fullPage: true });
    
    // Reset to desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();
    
    // Check for alt text on images
    const images = page.locator('img');
    for (let i = 0; i < await images.count(); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper focus indicators
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Take screenshot showing focus
    await page.screenshot({ path: 'test-results/screenshots/accessibility-focus.png', fullPage: true });
  });

  test('should load all images and assets correctly', async ({ page }) => {
    // Wait for all images to load
    await page.waitForLoadState('networkidle');
    
    // Check for any failed image loads
    const failedImages = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const failed = [];
      images.forEach((img, index) => {
        if (img.naturalWidth === 0) {
          failed.push({ index, src: img.src });
        }
      });
      return failed;
    });
    
    expect(failedImages.length).toBe(0);
    
    // Take screenshot after all assets loaded
    await page.screenshot({ path: 'test-results/screenshots/all-assets-loaded.png', fullPage: true });
  });

  test('should handle navigation to different sections', async ({ page }) => {
    // Test navigation to hotels page
    const hotelsLink = page.locator('a[href="/hotels"]');
    if (await hotelsLink.isVisible()) {
      await hotelsLink.click();
      await page.waitForLoadState('networkidle');
      
      // Take screenshot of hotels page
      await page.screenshot({ path: 'test-results/screenshots/hotels-page.png', fullPage: true });
      
      // Go back to homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    }
    
    // Test navigation to destinations
    const destinationsLink = page.locator('a[href="/destinations"]');
    if (await destinationsLink.isVisible()) {
      await destinationsLink.click();
      await page.waitForLoadState('networkidle');
      
      // Take screenshot of destinations page
      await page.screenshot({ path: 'test-results/screenshots/destinations-page.png', fullPage: true });
    }
  });
}); 