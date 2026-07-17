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
    // CONFIRMED: the placeholder text ROTATES on a timer (cycles through
    // example prompts) — do not anchor on placeholder content, it caused
    // intermittent timeouts. There is exactly one <textarea> on this page,
    // so anchoring on the tag itself is more reliable.
    this.promptInput = page.locator('textarea');
    this.imageAttachButton = page.getByRole('button', { name: /^image$/i });
    this.visibilityToggle = page.getByRole('button', { name: /^public$|^private$/i });
    this.modelSelector = page.getByRole('button', { name: /openrouter free/i });
    this.tipsButton = page.getByRole('button', { name: /^tips$/i });
    this.templatesButton = page.getByRole('button', { name: /^templates$/i });
    this.creditCounter = page.getByText(/uses left today/i);
    // CONFIRMED: .last() previously matched the wrong element ("Go
    // unlimited" link, also a <button> later in DOM order). Anchoring on
    // this button's distinctive classes (rounded-full + bg-white +
    // text-black is unique to this button within the prompt panel).
    this.generateButton = page
      .locator('div.bg-gray-800.rounded-2xl')
      .locator('button.rounded-full.bg-white.text-black');
    this.paywallModal = page.getByRole('dialog').filter({ hasText: /upgrade|pro|pay/i });
  }

  async goto() {
    await this.page.goto('/');
    // Cold navigations on this JS-heavy app can take longer than the
    // default timeout to render — wait explicitly for the prompt input
    // to exist before returning control to the test.
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
    // CONFIRMED via live testing: Kromio has TWO distinct failure paths
    // for the same underlying quota-exhausted state:
    //  1. Client already knows credits are 0 -> preemptive "Go Unlimited"
    //     upgrade modal, before any network request fires.
    //  2. Client didn't know yet, request goes out, server returns 429 ->
    //     inline "Rate limit exceeded" banner within the prompt panel.
    // Either is a valid "user correctly blocked" outcome.
    const upgradeModal = this.page.getByText(/used your \d+ free generations/i);
    const inlineError = this.page.getByText(/rate limit exceeded/i);
    await expect(upgradeModal.or(inlineError)).toBeVisible();
  }
}