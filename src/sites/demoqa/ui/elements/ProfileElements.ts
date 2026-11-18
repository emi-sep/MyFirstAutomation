import type { Locator, Page } from '@playwright/test';

export class ProfileElements {
  constructor(private readonly page: Page) {}

  get username(): Locator {
    return this.page.locator('#userName-value');
  }

  bookRow(title: string): Locator {
    const titleLink = this.page.getByRole('link', { name: title, exact: true });
    return this.page.getByRole('row').filter({ has: titleLink });
  }

  deleteBook(title: string): Locator {
    // Verified DemoQA profile rows expose the action as a span with title="Delete".
    return this.bookRow(title).getByTitle('Delete');
  }

  get confirmationModal(): Locator {
    return this.page.getByRole('dialog');
  }

  get confirmDelete(): Locator {
    return this.page.getByRole('button', { name: 'OK', exact: true });
  }
}
