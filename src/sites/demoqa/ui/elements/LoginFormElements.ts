import type { Locator, Page } from '@playwright/test';

export class LoginFormElements {
  constructor(private readonly page: Page) {}

  get username(): Locator {
    // DemoQA's login form exposes stable IDs for these fields.
    return this.page.locator('#userName');
  }

  get password(): Locator {
    return this.page.locator('#password');
  }

  get submit(): Locator {
    return this.page.getByRole('button', { name: 'Login', exact: true });
  }

  get logout(): Locator {
    return this.page.getByRole('button', { name: 'Logout', exact: true });
  }
}
