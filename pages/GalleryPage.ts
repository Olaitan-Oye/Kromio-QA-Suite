import { Page, Locator } from '@playwright/test';

/**
 * Shared page for both "Gallery" and "My Extensions" views —
 * confirmed they render the same component, filtered by the
 * "View" control (My extensions / All).
 */
export class GalleryPage {
  readonly page: Page;
  readonly viewFilter: Locator; // My extensions / All
  readonly showFilter: Locator; // All / My favourite
  readonly searchInput: Locator;
  readonly sortDropdown: Locator; // favourite / revision / title / date
  readonly extensionCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.viewFilter = page.getByRole('combobox', { name: /view/i });
    this.showFilter = page.getByRole('combobox', { name: /show/i });
    this.searchInput = page.getByRole('textbox', { name: /search/i });
    this.sortDropdown = page.getByRole('combobox', { name: /sort/i });
    this.extensionCards = page.getByRole('article'); // TODO: confirm actual card role/testid
  }

  async goto() {
    await this.page.goto('/gallery');
  }

  async filterToMyExtensions() {
    await this.viewFilter.selectOption({ label: /my extensions/i });
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
  }
}
