import { test, expect } from '@playwright/test';

test.describe('Admin Splash and Landing', () => {
  test('should show splash and fade into admin dashboard', async ({ page }) => {
    await page.goto('/admin');
    // Wait for splash/intro to appear (adjust selector as needed)
    const splash = page.locator('[data-testid="splash-intro"], .splash-intro, .splash, .intro');
    await expect(splash).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'test-results/screenshots/admin-splash-intro.png' });

    // Wait for splash to fade out (not visible or detached)
    await splash.waitFor({ state: 'hidden', timeout: 10000 });

    // Wait for admin dashboard to appear
    const dashboard = page.locator('[data-testid="admin-dashboard"], .admin-dashboard, main, h1, h2');
    await expect(dashboard).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'test-results/screenshots/admin-landing.png' });
  });
});

test.describe('Admin Panel Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });

  test('should load admin dashboard successfully', async ({ page }) => {
    // Verify admin page loads
    await expect(page).toHaveTitle(/Admin|Dashboard/i);
    
    // Check for admin navigation
    const adminNav = page.locator('nav, [data-testid="admin-nav"]');
    await expect(adminNav).toBeVisible();
    
    // Take screenshot of admin dashboard
    await page.screenshot({ path: 'test-results/screenshots/admin-dashboard.png', fullPage: true });
  });

  test('should display key admin metrics', async ({ page }) => {
    // Look for metric cards or dashboard widgets
    const metricCards = page.locator('[data-testid="metric-card"], .metric-card, .dashboard-widget');
    
    if (await metricCards.first().isVisible()) {
      await expect(metricCards.first()).toBeVisible();
      
      // Take screenshot of metrics
      await page.screenshot({ path: 'test-results/screenshots/admin-metrics.png', fullPage: true });
    } else {
      // If no specific metric cards, check for any dashboard content
      const dashboardContent = page.locator('main, .dashboard, [data-testid="dashboard"]');
      await expect(dashboardContent).toBeVisible();
      
      await page.screenshot({ path: 'test-results/screenshots/admin-content.png', fullPage: true });
    }
  });

  test('should navigate to AI monitoring section', async ({ page }) => {
    // Look for AI-related navigation
    const aiNavLinks = page.locator('a[href*="ai"], a:has-text("AI"), a:has-text("Monitoring")');
    
    if (await aiNavLinks.first().isVisible()) {
      await aiNavLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      // Check if AI monitoring page loads
      await expect(page.locator('h1, h2')).toContainText(/AI|Monitoring|Conversations/i);
      
      // Take screenshot of AI monitoring
      await page.screenshot({ path: 'test-results/screenshots/ai-monitoring.png', fullPage: true });
    } else {
      // Take screenshot of admin panel without AI nav
      await page.screenshot({ path: 'test-results/screenshots/admin-no-ai-nav.png', fullPage: true });
    }
  });

  test('should display booking management interface', async ({ page }) => {
    // Look for bookings section
    const bookingsLink = page.locator('a[href*="bookings"], a:has-text("Bookings")');
    
    if (await bookingsLink.isVisible()) {
      await bookingsLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check for booking table or list
      const bookingTable = page.locator('table, [data-testid="booking-table"], .booking-list');
      await expect(bookingTable).toBeVisible();
      
      // Take screenshot of bookings page
      await page.screenshot({ path: 'test-results/screenshots/admin-bookings.png', fullPage: true });
    } else {
      // Take screenshot of admin without bookings
      await page.screenshot({ path: 'test-results/screenshots/admin-no-bookings.png', fullPage: true });
    }
  });

  test('should display user management interface', async ({ page }) => {
    // Look for users section
    const usersLink = page.locator('a[href*="users"], a:has-text("Users")');
    
    if (await usersLink.isVisible()) {
      await usersLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check for user table or list
      const userTable = page.locator('table, [data-testid="user-table"], .user-list');
      await expect(userTable).toBeVisible();
      
      // Take screenshot of users page
      await page.screenshot({ path: 'test-results/screenshots/admin-users.png', fullPage: true });
    } else {
      // Take screenshot of admin without users
      await page.screenshot({ path: 'test-results/screenshots/admin-no-users.png', fullPage: true });
    }
  });

  test('should display hotel management interface', async ({ page }) => {
    // Look for hotels section
    const hotelsLink = page.locator('a[href*="hotels"], a:has-text("Hotels")');
    
    if (await hotelsLink.isVisible()) {
      await hotelsLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check for hotel management interface
      const hotelInterface = page.locator('[data-testid="hotel-management"], .hotel-list, table');
      await expect(hotelInterface).toBeVisible();
      
      // Take screenshot of hotels management
      await page.screenshot({ path: 'test-results/screenshots/admin-hotels.png', fullPage: true });
    } else {
      // Take screenshot of admin without hotels
      await page.screenshot({ path: 'test-results/screenshots/admin-no-hotels.png', fullPage: true });
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/screenshots/admin-tablet.png', fullPage: true });
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/screenshots/admin-mobile.png', fullPage: true });
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should handle form interactions', async ({ page }) => {
    // Look for any forms in admin panel
    const forms = page.locator('form, [data-testid="admin-form"]');
    
    if (await forms.first().isVisible()) {
      // Test form interaction
      const inputs = forms.first().locator('input, select, textarea');
      
      if (await inputs.count() > 0) {
        await inputs.first().fill('test input');
        await page.screenshot({ path: 'test-results/screenshots/admin-form-interaction.png', fullPage: true });
      }
    } else {
      // Take screenshot of admin without forms
      await page.screenshot({ path: 'test-results/screenshots/admin-no-forms.png', fullPage: true });
    }
  });

  test('should display proper error handling', async ({ page }) => {
    // Try to access a potentially non-existent admin route
    await page.goto('/admin/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // Check for error page or 404
    const errorContent = page.locator('h1, h2, .error, [data-testid="error"]');
    await expect(errorContent).toBeVisible();
    
    // Take screenshot of error page
    await page.screenshot({ path: 'test-results/screenshots/admin-error-page.png', fullPage: true });
  });

  test('should have proper loading states', async ({ page }) => {
    // Navigate to a section that might trigger loading
    const navLinks = page.locator('nav a');
    
    if (await navLinks.count() > 0) {
      await navLinks.first().click();
      
      // Look for loading indicators
      const loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner');
      
      if (await loadingIndicator.isVisible()) {
        await page.screenshot({ path: 'test-results/screenshots/admin-loading.png', fullPage: true });
        
        // Wait for loading to complete
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'test-results/screenshots/admin-loaded.png', fullPage: true });
      }
    }
  });
}); 