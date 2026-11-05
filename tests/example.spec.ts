import { expect, test } from '@fixtures';
import { users } from '@data/users';

test.describe('Login functionality', () => {
  test('allows a standard user to log in and view the inventory', async ({ loginPage, page }) => {
    // Arrange
    const user = users.sauceDemo;
    await loginPage.navigate();

    // Act
    await loginPage.login(user.username, user.password);

    // Assert
    await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });
});