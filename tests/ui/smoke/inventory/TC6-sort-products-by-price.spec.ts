import { expect, test } from '@fixtures';
import { InventoryPage } from '@pages/InventoryPage';

test.describe('Inventory', () => {
  test('TC6: Products sort by ascending price', { tag: '@smoke' }, async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    const numericPrices = await test.step('Sort products by ascending price', async () => {
      await inventoryPage.sortBy('Price (low to high)');
      const prices = await inventoryPage.getProductPrices();
      return prices.map(price => Number(price.replace('$', '')));
    });

    await test.step('Verify prices are in ascending order', async () => {
      expect(numericPrices.length).toBeGreaterThan(0);
      expect(numericPrices).toEqual([...numericPrices].sort((first, second) => first - second));
    });
  });
});
