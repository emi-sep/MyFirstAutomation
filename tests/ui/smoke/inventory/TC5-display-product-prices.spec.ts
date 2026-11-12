import { expect, test } from '@fixtures';
import { InventoryPage } from '@pages/InventoryPage';

test.describe('Inventory', () => {
  test('TC5: Every product has a visible price', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const productPrices = await test.step('Read inventory product prices', async () => {
      return inventoryPage.getProductPrices();
    });

    await test.step('Verify every product price is present and visible', async () => {
      expect(productPrices.length).toBeGreaterThan(0);

      for (const productPrice of productPrices) {
        expect(productPrice.trim()).not.toBe('');
      }

      await expect(inventoryPage.productPriceItems).toHaveCount(productPrices.length);
      for (let index = 0; index < productPrices.length; index++) {
        await expect(inventoryPage.productPriceItems.nth(index)).toBeVisible();
      }
    });
  });
});
