import { expect, test } from '@fixtures';
import { InventoryPage } from '@pages/InventoryPage';

test.describe('Inventory', () => {
  test('TC3: Inventory products are displayed', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    const productNames = await test.step('Read displayed inventory products', async () => {
      return inventoryPage.getProductNames();
    });

    await test.step('Verify inventory products are displayed', async () => {
      expect(productNames.length).toBeGreaterThan(0);
      await expect(inventoryPage.productCards).toHaveCount(productNames.length);
    });
  });
});
