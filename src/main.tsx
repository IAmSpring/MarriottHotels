import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Create loading overlay
const overlay = document.createElement('div');
overlay.id = 'loading-overlay';
overlay.style.cssText = `
  position: fixed;
  inset: 0;
  background: white;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease-in-out;
`;

const iconContainer = document.createElement('div');
iconContainer.style.cssText = `
  position: relative;
  margin-bottom: 1rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Marriott Icon
iconContainer.innerHTML = `
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    style="color: #8B1538; position: absolute; z-index: 2;"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 8.5V10H22V8.5L12 2Z"
      fill="currentColor"
    />
    <path
      d="M4 11V20H20V11H4ZM12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15C15 16.6569 13.6569 18 12 18Z"
      fill="currentColor"
    />
  </svg>
`;

// Spinner
const spinner = document.createElement('div');
spinner.style.cssText = `
  position: absolute;
  inset: -10px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const spinnerRing = document.createElement('div');
spinnerRing.style.cssText = `
  height: 100%;
  width: 100%;
  border-radius: 9999px;
  border: 6px solid rgba(139, 21, 56, 0.2);
  border-top-color: #8B1538;
`;

spinner.appendChild(spinnerRing);
iconContainer.appendChild(spinner);

const text = document.createElement('p');
text.textContent = 'Loading your experience...';
text.style.cssText = `
  color: #8B1538;
  font-weight: 500;
  font-size: 1.1rem;
  margin-top: 1rem;
`;

overlay.appendChild(iconContainer);
overlay.appendChild(text);
document.body.appendChild(overlay);

// Initialize React app with loading state
const root = document.getElementById('root')!;
root.style.opacity = '0';
root.style.transition = 'opacity 0.5s ease-in-out';

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Handle loading state
window.addEventListener('load', () => {
  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    root.style.opacity = '1';
  }, 2000);
});
