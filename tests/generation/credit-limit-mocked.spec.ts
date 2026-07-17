import { test, expect } from '@playwright/test';
import { BuilderPage } from '../../pages/BuilderPage';

/**
 * Mocked version of the quota/rate-limit test — intercepts the real
 * generation API call and returns a simulated 429, so this test can run
 * unlimited times without ever touching the account's real daily credits.
 *
 * Exact response shape (endpoint + error body) confirmed via live manual
 * testing on 2026-07-17. See BUG-002 and BUG-004 for the real findings
 * that justified this design.
 */
test.describe('Free tier — rate limit handling (mocked)', () => {
    test('shows rate-limit error message when API returns 429', async ({ page }) => {
        // Intercept the real endpoint before it reaches Kromio's servers.
        await page.route('**/api/generate-openrouter-free', async (route) => {
            await route.fulfill({
                status: 429,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            });
        });

        const builder = new BuilderPage(page);
        await builder.goto();
        await builder.submitPrompt('Mocked prompt — should be blocked by simulated rate limit');
        await builder.expectPaywallShown();
    });

    test('does not fire more than one request per click (regression guard for BUG-004)', async ({ page }) => {
        let requestCount = 0;
        await page.route('**/api/generate-openrouter-free', async (route) => {
            requestCount++;
            await route.fulfill({
                status: 429,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            });
        });

        const builder = new BuilderPage(page);
        await builder.goto();
        await builder.submitPrompt('Single click retry-count check');

        // Give any client-side retry logic a window to fire before asserting.
        await page.waitForTimeout(5000);

        // BUG-004: live testing observed 17+ requests from a single click.
        // This assertion documents expected correct behavior (1 request) and
        // will fail until Kromio fixes the retry logic — a deliberate
        // regression guard, not a flaky test.
        expect(requestCount).toBeLessThanOrEqual(1);
    });
});