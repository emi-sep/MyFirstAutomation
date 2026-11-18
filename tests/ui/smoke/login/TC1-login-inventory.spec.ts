import { expect, test } from '@fixtures';
import { users } from '@data/users';

test.describe('Login', () => {
  test('TC1: Standard user logs in and views inventory', { tag: '@smoke' }, async ({ loginPage, page }) => {
    const user = users.sauceDemo;

    await test.step('Open the login page', async () => {
      await loginPage.navigate();
    });

    await test.step('Sign in with the standard user', async () => {
      await loginPage.login(user.username, user.password);
    });

    await test.step('Verify inventory is available', async () => {
      await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
      await expect(page.getByText('Products', { exact: true })).toBeVisible();
    });
  });
});
