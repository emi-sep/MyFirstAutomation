import type { Page } from '@playwright/test';
import { LoginFormElements } from '@sites/demoqa/ui/elements/LoginFormElements';
import type { TestUserCredentials } from '@sites/demoqa/api/models/account.model';

export class LoginForm {
  private readonly elements: LoginFormElements;

  constructor(private readonly page: Page) {
    this.elements = new LoginFormElements(page);
  }

  async signIn(credentials: TestUserCredentials): Promise<void> {
    await this.elements.username.fill(credentials.username);
    await this.elements.password.fill(credentials.password);
    await this.elements.submit.click();
    await this.page.waitForURL('**/profile');
    await this.elements.logout.waitFor({ state: 'visible' });
  }
}
