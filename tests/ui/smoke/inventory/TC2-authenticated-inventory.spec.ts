import { expect, test } from '@fixtures';
import { InventoryPage } from '@pages/InventoryPage';

test.describe('Inventory', () => {
  test('TC2: Authenticated user reaches inventory', { tag: '@smoke' }, async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    await test.step('Verify authenticated inventory page', async () => {
      await expect(authenticatedPage).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.inventoryHeading).toBeVisible();
    });
  });
});
