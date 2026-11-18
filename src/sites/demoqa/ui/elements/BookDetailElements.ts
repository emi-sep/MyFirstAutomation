import type { Locator, Page } from '@playwright/test';

export class BookDetailElements {
  constructor(private readonly page: Page) {}

  get addToCollection(): Locator {
    return this.page.getByRole('button', { name: 'Add To Your Collection', exact: true });
  }

  get backToBookStore(): Locator {
    return this.page.getByRole('button', { name: 'Back To Book Store', exact: true });
  }

  titleValue(title: string): Locator {
    return this.page.getByText(title, { exact: true });
  }
}
