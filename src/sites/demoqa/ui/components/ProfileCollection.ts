import type { Page } from '@playwright/test';
import { ProfileElements } from '@sites/demoqa/ui/elements/ProfileElements';

export class ProfileCollection {
  private readonly elements: ProfileElements;

  constructor(private readonly page: Page) {
    this.elements = new ProfileElements(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/profile');
    await this.elements.username.waitFor({ state: 'visible' });
  }

  async deleteBook(title: string): Promise<string> {
    const row = this.elements.bookRow(title);
    await this.elements.deleteBook(title).click();
    await this.elements.confirmationModal.waitFor({ state: 'visible' });
    const confirmation = await this.elements.confirmationModal.innerText();
    await this.elements.confirmDelete.click();
    await row.waitFor({ state: 'detached' });
    return confirmation;
  }
}
