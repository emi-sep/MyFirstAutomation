import { expect, test } from '@fixtures';
import { InventoryPage } from '@pages/InventoryPage';

test.describe('Inventory', () => {
  test('TC4: Every product has a visible name', { tag: '@smoke' }, async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const productNames = await test.step('Read inventory product names', async () => {
      return inventoryPage.getProductNames();
    });

    await test.step('Verify every product name is present and visible', async () => {
      expect(productNames.length).toBeGreaterThan(0);

      for (const productName of productNames) {
        expect(productName.trim()).not.toBe('');
        await expect(inventoryPage.getProductNameLocator(productName)).toBeVisible();
      }
    });
  });
});
