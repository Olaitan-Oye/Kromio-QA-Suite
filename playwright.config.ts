import { defineConfig, devices } from '@playwright/test';

/**
 * Kromio.ai QA Suite — Playwright Configuration
 *
 * NOTE: This suite targets a live third-party product (kromio.ai).
 * Tests are written to be resilient to normal UI copy/layout drift,
 * but selectors should be verified against the live site before
 * a full run, since some were mapped manually rather than via
 * automated DOM inspection.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false, // credit-limited free tier — avoid burning trials in parallel
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://www.kromio.ai',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
