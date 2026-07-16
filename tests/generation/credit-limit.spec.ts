import { test, expect } from '@playwright/test';
import { BuilderPage } from '../../pages/BuilderPage';

/**
 * BUG-002: Free-tier quota is inconsistent across product surfaces.
 * See /bug-reports/BUG-002-quota-mismatch.md
 *
 * PAUSED (2026-07-17): this test burns real daily credits on a live
 * account every run (2 generations per execution). Running it
 * repeatedly during locator debugging already consumed most of a
 * day's quota. Plan: rewrite using page.route() to intercept and
 * mock the generation API response, so this can run unlimited times
 * without touching the real account limit. Do not un-skip until
 * that rewrite is done.
 */
test.describe.configure({ timeout: 90_000 });

test.describe.skip('Free tier — generation limit boundary', () => {
  test('paywall appears exactly at the stated daily limit, not before or after', async ({ page }) => {
    const builder = new BuilderPage(page);
    await builder.goto();

    // TODO: requires an authenticated session with a fresh daily quota.
    // Strategy: seed a test account via API/fixture rather than burning
    // the manual 2/day limit on a real signed-in browser session.
    for (let i = 0; i < 2; i++) {
      await builder.submitPrompt(`Test extension generation attempt ${i + 1}`);
      await expect(builder.paywallModal).not.toBeVisible();
    }

    // 3rd attempt should be blocked
    await builder.submitPrompt('Test extension generation attempt 3');
    await builder.expectPaywallShown();
  });

  test('pricing page and in-app limit messaging agree on the free tier quota', async ({ page }) => {
    await page.goto('/pricing');
    const pricingText = await page.getByText(/free/i).first().textContent();

    await page.goto('/');
    const builder = new BuilderPage(page);
    const inAppText = await builder.creditCounter.textContent();

    // This assertion documents the mismatch found manually — it should
    // fail today, confirming BUG-002 is real, not a one-off misread.
    expect(pricingText).toContain(inAppText?.match(/\d+/)?.[0] ?? '');
  });
});
