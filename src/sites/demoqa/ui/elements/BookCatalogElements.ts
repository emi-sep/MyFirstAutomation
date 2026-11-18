import type { Locator, Page } from '@playwright/test';

export class BookCatalogElements {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByText('Book Store', { exact: true });
  }

  bookLink(title: string): Locator {
    return this.page.getByRole('link', { name: title, exact: true });
  }
}
