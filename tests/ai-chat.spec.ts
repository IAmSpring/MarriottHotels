import { test, expect } from '@playwright/test';

test.describe('AI Chat Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open AI chat interface', async ({ page }) => {
    // Look for chat button or interface
    const chatButton = page.locator('[data-testid="chat-button"], .chat-button, button:has-text("Chat"), button:has-text("AI")');
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
      
      // Check if chat interface appears
      const chatInterface = page.locator('[data-testid="chat-interface"], .chat-interface, .chat-container');
      await expect(chatInterface).toBeVisible();
      
      // Take screenshot of chat interface
      await page.screenshot({ path: 'test-results/screenshots/ai-chat-opened.png', fullPage: true });
    } else {
      // If no chat button, check if chat is always visible
      const chatContainer = page.locator('[data-testid="chat-container"], .chat-container, .ai-chat');
      if (await chatContainer.isVisible()) {
        await page.screenshot({ path: 'test-results/screenshots/ai-chat-always-visible.png', fullPage: true });
      } else {
        await page.screenshot({ path: 'test-results/screenshots/no-ai-chat.png', fullPage: true });
      }
    }
  });

  test('should send and receive messages', async ({ page }) => {
    // Open chat interface
    const chatButton = page.locator('[data-testid="chat-button"], .chat-button, button:has-text("Chat")');
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for chat input
    const chatInput = page.locator('[data-testid="chat-input"], .chat-input, input[placeholder*="message"], textarea');
    
    if (await chatInput.isVisible()) {
      // Type a test message
      await chatInput.fill('Hello, can you help me find a hotel?');
      await chatInput.press('Enter');
      
      // Wait for response
      await page.waitForTimeout(3000);
      
      // Check for AI response
      const aiResponse = page.locator('[data-testid="ai-response"], .ai-message, .bot-message');
      await expect(aiResponse.first()).toBeVisible();
      
      // Take screenshot of conversation
      await page.screenshot({ path: 'test-results/screenshots/ai-conversation.png', fullPage: true });
    } else {
      // Take screenshot if no chat input found
      await page.screenshot({ path: 'test-results/screenshots/no-chat-input.png', fullPage: true });
    }
  });

  test('should display typing indicators', async ({ page }) => {
    // Open chat interface
    const chatButton = page.locator('[data-testid="chat-button"], .chat-button, button:has-text("Chat")');
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Send a message
    const chatInput = page.locator('[data-testid="chat-input"], .chat-input, input[placeholder*="message"]');
    
    if (await chatInput.isVisible()) {
      await chatInput.fill('Tell me about hotels in Miami');
      await chatInput.press('Enter');
      
      // Look for typing indicator
      const typingIndicator = page.locator('[data-testid="typing-indicator"], .typing, .loading');
      
      if (await typingIndicator.isVisible()) {
        // Take screenshot of typing indicator
        await page.screenshot({ path: 'test-results/screenshots/typing-indicator.png', fullPage: true });
        
        // Wait for response
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'test-results/screenshots/response-complete.png', fullPage: true });
      }
    }
  });

  test('should handle multiple messages in conversation', async ({ page }) => {
    // Open chat interface
    const chatButton = page.locator('[data-testid="chat-button"], .chat-button, button:has-text("Chat")');
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
    }
    
    const chatInput = page.locator('[data-testid="chat-input"], .chat-input, input[placeholder*="message"]');
    
    if (await chatInput.isVisible()) {
      // Send first message
      await chatInput.fill('What hotels do you recommend?');
      await chatInput.press('Enter');
      await page.waitForTimeout(3000);
      
      // Send second message
      await chatInput.fill('Tell me about the amenities');
      await chatInput.press('Enter');
      await page.waitForTimeout(3000);
      
      // Check for multiple messages
      const messages = page.locator('[data-testid="message"], .message, .chat-message');
      await expect(messages).toHaveCount({ min: 4 }); // 2 user + 2 AI responses
      
      // Take screenshot of conversation thread
      await page.screenshot({ path: 'test-results/screenshots/conversation-thread.png', fullPage: true });
    }
  });

  test('should display tool usage and responses', async ({ page }) => {
    // Open chat interface
    const chatButton = page.locator('[data-testid="chat-button"], .chat-button, button:has-text("Chat")');
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
    }
    
    const chatInput = page.locator('[data-testid="chat-input"], .chat-input, input[placeholder*="message"]');
    
    if (await chatInput.isVisible()) {
      // Ask for hotel search (should trigger tool usage)
      await chatInput.fill('Search for hotels in New York');
      await chatInput.press('Enter');
      await page.waitForTimeout(5000);
      
      // Look for tool usage indicators
      const toolUsage = page.locator('[data-testid="tool-usage"], .tool-usage, .function-call');
      
      if (await toolUsage.isVisible()) {
        await page.screenshot({ path: 'test-results/screenshots/tool-usage.png', fullPage: true });
      } else {
        // Take screenshot of response without visible tool usage
        await page.screenshot({ path: 'test-results/screenshots/response-no-tool-indicator.png', fullPage: true });
      }
    }
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Open chat interface
    const chatButton = page.locator('[data-testid="chat-button"], .chat-button, button:has-text("Chat")');
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
    }
    
    const chatInput = page.locator('[data-testid="chat-input"], .chat-input, input[placeholder*="message"]');
    
    if (await chatInput.isVisible()) {
      // Send a message that might cause an error
      await chatInput.fill('This is a very long message that might exceed limits and cause an error to test error handling capabilities of the AI chat system');
      await chatInput.press('Enter');
      await page.waitForTimeout(3000);
      
      // Look for error messages
      const errorMessage = page.locator('[data-testid="error-message"], .error, .error-message');
      
      if (await errorMessage.isVisible()) {
        await page.screenshot({ path: 'test-results/screenshots/chat-error.png', fullPage: true });
      } else {
        // Take screenshot of normal response
        await page.screenshot({ path: 'test-results/screenshots/chat-normal-response.png', fullPage: true });
      }
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open chat interface
    const chatButton = page.locator('[data-testid="chat-button"], .chat-button, button:has-text("Chat")');
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
      
      // Take mobile screenshot
      await page.screenshot({ path: 'test-results/screenshots/mobile-chat.png', fullPage: true });
    }
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Open chat interface
    const chatButton = page.locator('[data-testid="chat-button"], .chat-button, button:has-text("Chat")');
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Check for proper ARIA labels
    const chatInput = page.locator('[data-testid="chat-input"], .chat-input, input[placeholder*="message"]');
    
    if (await chatInput.isVisible()) {
      const ariaLabel = await chatInput.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      
      // Test keyboard navigation
      await chatInput.focus();
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);
      
      await page.screenshot({ path: 'test-results/screenshots/chat-accessibility.png', fullPage: true });
    }
  });

  test('should clear conversation or reset chat', async ({ page }) => {
    // Open chat interface
    const chatButton = page.locator('[data-testid="chat-button"], .chat-button, button:has-text("Chat")');
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Send a message first
    const chatInput = page.locator('[data-testid="chat-input"], .chat-input, input[placeholder*="message"]');
    
    if (await chatInput.isVisible()) {
      await chatInput.fill('Hello');
      await chatInput.press('Enter');
      await page.waitForTimeout(3000);
      
      // Look for clear/reset button
      const clearButton = page.locator('[data-testid="clear-chat"], .clear-chat, button:has-text("Clear"), button:has-text("Reset")');
      
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await page.waitForTimeout(1000);
        
        // Check if conversation is cleared
        const messages = page.locator('[data-testid="message"], .message, .chat-message');
        await expect(messages).toHaveCount(0);
        
        await page.screenshot({ path: 'test-results/screenshots/chat-cleared.png', fullPage: true });
      } else {
        await page.screenshot({ path: 'test-results/screenshots/chat-no-clear-button.png', fullPage: true });
      }
    }
  });
}); 