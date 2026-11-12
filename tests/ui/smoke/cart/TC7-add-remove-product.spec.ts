import { expect, test } from '@fixtures';
import { InventoryPage } from '@pages/InventoryPage';

test.describe('Cart', () => {
  test('TC7: Product can be added to and removed from cart', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const productName = await test.step('Select an inventory product', async () => {
      const [selectedProductName] = await inventoryPage.getProductNames();
      expect(selectedProductName).toBeDefined();
      return selectedProductName;
    });

    await test.step('Add product to cart and verify cart count', async () => {
      await inventoryPage.addProductToCart(productName);
      await expect(inventoryPage.cartBadge).toHaveText('1');
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });

    await test.step('Remove product and verify cart is empty', async () => {
      await inventoryPage.removeProductFromCart(productName);
      expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    });
  });
});
