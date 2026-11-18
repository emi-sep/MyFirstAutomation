import type { Page } from '@playwright/test';
import { BookDetailElements } from '@sites/demoqa/ui/elements/BookDetailElements';

export class BookDetails {
  private readonly elements: BookDetailElements;

  constructor(private readonly page: Page) {
    this.elements = new BookDetailElements(page);
  }

  async title(expectedTitle: string): Promise<string> {
    await this.elements.backToBookStore.waitFor({ state: 'visible' });
    return (await this.elements.titleValue(expectedTitle).innerText()).trim();
  }

  async addToCollection(): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.elements.addToCollection.click();
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.accept();
    return message;
  }
}
