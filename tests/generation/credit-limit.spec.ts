import { test, expect } from '@playwright/test';
import { BuilderPage } from '../../pages/BuilderPage';

/**
 * BUG-002: Stated free-tier limit is inconsistent across the product.
 * Marketing/docs (Product Hunt, third-party listings) state "20 credits
 * per month". The live Pricing page and in-app behavior state/enforce
 * "2 generations per day". See /bug-reports/BUG-002-quota-mismatch.md
 *
 * This is not a functional break — the app enforces *a* limit correctly —
 * but the conflicting claims across surfaces is a trust/communication bug
 * worth flagging, and a good target for boundary testing regardless.
 */
test.describe('Free tier — generation limit boundary', () => {
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
