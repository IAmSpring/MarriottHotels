import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

// First, inject the required styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes lineGrow {
    to {
      height: 100%;
    }
  }

  @keyframes fadeScale {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

// Create loading overlay
const overlay = document.createElement('div');
overlay.id = 'loading-overlay';
overlay.style.cssText = `
  position: fixed;
  inset: 0;
  background: #FFFFFF;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
`;

// Create key card container
const keyCard = document.createElement('div');
keyCard.style.cssText = `
  position: relative;
  width: 320px;
  height: 180px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(40px);
  opacity: 0;
  overflow: hidden;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;

  @keyframes slideIn {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Add magnetic strip
const magneticStrip = document.createElement('div');
magneticStrip.style.cssText = `
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  height: 40px;
  background: #1A1A1A;
  opacity: 0.1;
`;
keyCard.appendChild(magneticStrip);

// Add golden accent line
const accentLine = document.createElement('div');
accentLine.style.cssText = `
  position: absolute;
  top: 0;
  right: 20px;
  width: 2px;
  height: 0;
  background: linear-gradient(180deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%);
  animation: lineGrow 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.6s;

  @keyframes lineGrow {
    to {
      height: 100%;
    }
  }
`;
keyCard.appendChild(accentLine);

// Add Marriott logo
const logo = document.createElement('div');
logo.innerHTML = `
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 8.5V10H22V8.5L12 2Z" fill="#D4AF37"/>
    <path d="M4 11V20H20V11H4ZM12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15C15 16.6569 13.6569 18 12 18Z" fill="#D4AF37"/>
  </svg>
`;
logo.style.cssText = `
  margin-bottom: 16px;
  opacity: 0;
  transform: scale(0.9);
  animation: fadeScale 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.8s;

  @keyframes fadeScale {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
keyCard.appendChild(logo);

// Add text content
const textContent = document.createElement('div');
textContent.style.cssText = `
  text-align: center;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards 1s;

  @keyframes fadeUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const title = document.createElement('div');
title.textContent = 'MARRIOTT BONVOY';
title.style.cssText = `
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #1C1C1C;
  margin-bottom: 8px;
`;
textContent.appendChild(title);

const subtitle = document.createElement('div');
subtitle.textContent = 'Welcome';
subtitle.style.cssText = `
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  color: #666666;
  letter-spacing: 1px;
`;
textContent.appendChild(subtitle);
keyCard.appendChild(textContent);

// Add loading dots
const loadingDots = document.createElement('div');
loadingDots.style.cssText = `
  display: flex;
  gap: 6px;
  margin-top: 24px;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards 1.4s;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

for (let i = 0; i < 3; i++) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #D4AF37;
    animation: pulse 1.5s ease-in-out infinite;
    animation-delay: ${i * 0.2}s;

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.2); opacity: 1; }
    }
  `;
  loadingDots.appendChild(dot);
}
keyCard.appendChild(loadingDots);

// Add decorative chip
const chip = document.createElement('div');
chip.style.cssText = `
  position: absolute;
  top: 20px;
  left: 20px;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
  border-radius: 4px;
  opacity: 0.2;
`;
keyCard.appendChild(chip);

// Add everything to the page
overlay.appendChild(keyCard);
document.body.appendChild(overlay);

// Initialize React app with delayed render
const root = document.getElementById('root')!;
root.style.opacity = '0';
root.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)';

// Create React root before the timeout
const reactRoot = createRoot(root);

// Delay the app render to ensure loading screen is visible
setTimeout(() => {
  reactRoot.render(
    <StrictMode>
      <BrowserRouter basename="/MarriottHotels">
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
  // Add extra delay before starting exit sequence
  setTimeout(() => {
    // Prepare card for exit
    keyCard.style.transform = 'translateY(-20px) scale(0.95)';
    keyCard.style.opacity = '0';
    overlay.style.background = '#1C1C1C';
    
    // After card exits, fade in the app
    setTimeout(() => {
      overlay.style.opacity = '0';
      root.style.opacity = '1';
      
      // Clean up
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 1000);
    }, 800);
  }, 2500);
}, 1000); // Increased initial delay to 1000ms

