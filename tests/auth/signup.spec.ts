import { test, expect } from '@playwright/test';
import { AuthModal } from '../../pages/AuthModal';

test.describe('Auth — Sign up flow', () => {
  test('login modal opens from nav and shows the email field', async ({ page }) => {
    await page.goto('/');
    const auth = new AuthModal(page);
    await auth.openFromNav();
    await expect(auth.emailInput).toBeVisible();
  });

  test('Google sign-in option is present', async ({ page }) => {
    await page.goto('/');
    const auth = new AuthModal(page);
    await auth.openFromNav();
    await expect(auth.continueWithGoogleButton).toBeVisible();
  });
});