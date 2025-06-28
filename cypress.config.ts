import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/MarriottHotels',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    pageLoadTimeout: 120000,
    defaultCommandTimeout: 10000,
    screenshotOnRunFailure: true,
    video: false,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  screenshotsFolder: 'cypress/screenshots',
  trashAssetsBeforeRuns: true,
}); 