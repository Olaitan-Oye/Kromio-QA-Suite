import { defineConfig, devices } from '@playwright/test';

/**
 * Separate config used ONLY for refreshing the saved login session.
 * The main playwright.config.ts restricts testDir to ./tests, so this
 * file (living in ./setup, deliberately outside that scope) needs its
 * own minimal config to run.
 *
 * Usage: npx playwright test --config=playwright.setup.config.ts --headed
 */
export default defineConfig({
    testDir: './setup',
    timeout: 120_000,
    use: {
        baseURL: 'https://www.kromio.ai',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});