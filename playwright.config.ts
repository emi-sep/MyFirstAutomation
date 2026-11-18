import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

import { getEnvironment } from './src/core/config/env';

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '.env')
});

// Validate environment configuration
const env = getEnvironment();

export default defineConfig({
  // Test location
  testDir: './tests',

  // Test execution
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Timeouts
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },

  // Reporters
  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }]
  ],

  // Global configuration
  use: {
    baseURL: env.BASE_URL,
    headless: true,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  // Browser configurations
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
      }
    // },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox']
    //   }
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari']
    //   }
    // }
  ]
});
