import type { Page } from '@playwright/test';
import { BookCatalogElements } from '@sites/demoqa/ui/elements/BookCatalogElements';

export class BookCatalog {
  private readonly elements: BookCatalogElements;

  constructor(private readonly page: Page) {
    this.elements = new BookCatalogElements(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/books');
    await this.elements.heading.waitFor({ state: 'visible' });
  }

  async openBook(title: string): Promise<void> {
    await this.elements.bookLink(title).click();
  }
}
