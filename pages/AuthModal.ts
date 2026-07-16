import { Page, Locator, expect } from '@playwright/test';

/**
 * CONFIRMED via DOM inspection: this site uses no semantic ARIA roles
 * (no role="dialog", no guaranteed heading tags). Locators anchor on
 * stable placeholder text instead.
 */
export class AuthModal {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly continueWithGoogleButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder(/enter your email/i);
    this.passwordInput = page.getByPlaceholder(/enter your password/i);
    this.continueWithGoogleButton = page.getByRole('button', { name: /continue with google/i });
    this.submitButton = page.getByRole('button', { name: /^sign in$|^sign up$/i });
  }

  async openFromNav() {
    const loginButton = this.page.locator('text="Log in"').first();
    await loginButton.click();
    await expect(this.emailInput).toBeVisible();
  }

  async signUpWithEmail(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}