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
    this.promptInput = page.getByRole('textbox', { name: /prompt|describe/i });
    this.imageAttachButton = page.getByRole('button', { name: /image|attach|upload/i });
    this.visibilityToggle = page.getByRole('button', { name: /public|private/i });
    this.modelSelector = page.getByRole('combobox', { name: /model/i });
    this.tipsButton = page.getByRole('button', { name: /tips/i });
    this.templatesButton = page.getByRole('button', { name: /templates/i });
    // TODO: confirm exact DOM location/testid for credit counter — currently
    // scoped loosely by text pattern like "2 of 2" / "X credits left"
    this.creditCounter = page.getByText(/\d+\s*(credits?|generations?|trials?)/i);
    this.generateButton = page.getByRole('button', { name: /generate/i });
    this.paywallModal = page.getByRole('dialog').filter({ hasText: /upgrade|pro|pay/i });
  }

  async goto() {
    await this.page.goto('/');
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
