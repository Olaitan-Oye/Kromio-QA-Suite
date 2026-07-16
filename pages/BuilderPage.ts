import { Page, Locator, expect } from '@playwright/test';

/**
 * The prompt/builder text box present on landing + home page.
 * Confirmed elements: prompt textbox, image attach option,
 * public/private toggle, model type selector, Tips button,
 * Templates button, credit counter (bottom right of the box).
 */
export class BuilderPage {
  readonly page: Page;
  readonly promptInput: Locator;
  readonly imageAttachButton: Locator;
  readonly visibilityToggle: Locator; // public/private
  readonly modelSelector: Locator;
  readonly tipsButton: Locator;
  readonly templatesButton: Locator;
  readonly creditCounter: Locator;
  readonly generateButton: Locator;
  readonly paywallModal: Locator;

  constructor(page: Page) {
    this.page = page;
    // CONFIRMED via live DOM inspection (2026-07-16):
    this.promptInput = page.locator('textarea');
    this.imageAttachButton = page.getByRole('button', { name: /^image$/i });
    this.visibilityToggle = page.getByRole('button', { name: /^public$|^private$/i });
    this.modelSelector = page.getByRole('button', { name: /openrouter free/i });
    this.tipsButton = page.getByRole('button', { name: /^tips$/i });
    this.templatesButton = page.getByRole('button', { name: /^templates$/i });
    this.creditCounter = page.getByText(/uses left today/i);
    // CONFIRMED: this button has NO accessible name (no aria-label, only
    // an icon + credit-cost digit) — flagged separately as an a11y finding
    // Anchoring on this button's distinctive class
    // (rounded-full + bg-white +text-black is unique to this button within the prompt panel.
    this.generateButton = page
      .locator('div.bg-gray-800.rounded-2xl')
      .getByRole('button.rounded-fill.bg-white.text-black');
    this.paywallModal = page.getByRole('dialog').filter({ hasText: /upgrade|pro|pay/i });
  }

  async goto() {
    await this.page.goto('/');
    // Cold navigation on this JS heavy app takes longer than the default timeout, so we wait for the prompt input
    //to exist before returning control to the test.
    await this.promptInput.waitFor({ state: 'visible', timeout: 45_000 });
  }

  async submitPrompt(promptText: string) {
    await this.promptInput.fill(promptText);
    await this.generateButton.click();
  }

  async setVisibility(state: 'public' | 'private') {
    // NOTE: current toggle gives no persistent visual confirmation in list
    // views (confirmed manually) — this is itself a documented finding,
    // not just a test detail. See bug-reports/privacy-indicator-missing.md
    await this.visibilityToggle.click();
  }

  async expectPaywallShown() {
    await expect(this.paywallModal).toBeVisible();
  }
}