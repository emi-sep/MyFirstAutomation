import { expect, test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { users } from '@data/users';
import { LoginPage } from '@pages/LoginPage';

interface TestFixtures {
  loginPage: LoginPage;
  authenticatedPage: Page;
}

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use): Promise<void> => {
    await use(new LoginPage(page));
  },
  authenticatedPage: async ({ page }, use): Promise<void> => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.sauceDemo.username, users.sauceDemo.password);

    await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
    await use(page);
  }
});

export { expect };