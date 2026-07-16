import { Page, Locator, expect } from '@playwright/test';

/**
 * Clicking an individual extension navigates to a NEW page/URL
 * (confirmed manually) e.g. kromio.ai/extension/{id} — exact path
 * pattern to be confirmed on first live run.
 */
export class ExtensionDetailPage {
  readonly page: Page;
  readonly reviseButton: Locator;
  readonly reviseInput: Locator;
  readonly downloadZipButton: Locator;
  readonly fileList: Locator;
  readonly favoriteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reviseButton = page.getByRole('button', { name: /revise/i });
    this.reviseInput = page.getByRole('textbox', { name: /revise|additional|change/i });
    this.downloadZipButton = page.getByRole('button', { name: /download zip/i });
    this.fileList = page.getByRole('list', { name: /files/i });
    this.favoriteButton = page.getByRole('button', { name: /favorite/i });
  }

  async reviseWith(instruction: string) {
    await this.reviseButton.click();
    await this.reviseInput.fill(instruction);
    await this.page.getByRole('button', { name: /generate|submit|revise/i }).last().click();
  }

  async toggleFavorite() {
    await this.favoriteButton.click();
  }
}
