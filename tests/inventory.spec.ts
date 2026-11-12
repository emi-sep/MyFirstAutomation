import { expect, test } from '@fixtures';
import { InventoryPage } from '@pages/InventoryPage';

test.describe('Inventory page', () => {
  test('allows an authenticated user to access the inventory page', async ({ authenticatedPage }) => {
    // Arrange
    const inventoryPage = new InventoryPage(authenticatedPage);

    // Assert: authenticatedPage logs in and verifies inventory before yielding.
    await expect(authenticatedPage).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.inventoryHeading).toBeVisible();
  });

  test('displays inventory products', async ({ authenticatedPage }) => {
    // Arrange
    const inventoryPage = new InventoryPage(authenticatedPage);

    // Act
    const productNames = await inventoryPage.getProductNames();

    // Assert
    expect(productNames.length).toBeGreaterThan(0);
    await expect(inventoryPage.productCards).toHaveCount(productNames.length);
  });

  test('displays a name for each inventory product', async ({ authenticatedPage }) => {
    // Arrange
    const inventoryPage = new InventoryPage(authenticatedPage);

    // Act
    const productNames = await inventoryPage.getProductNames();

    // Assert
    expect(productNames.length).toBeGreaterThan(0);
    for (const productName of productNames) {
      expect(productName.trim()).not.toBe('');
      await expect(inventoryPage.getProductNameLocator(productName)).toBeVisible();
    }
  });

  test('displays a price for each inventory product', async ({ authenticatedPage }) => {
    // Arrange
    const inventoryPage = new InventoryPage(authenticatedPage);

    // Act
    const productPrices = await inventoryPage.getProductPrices();

    // Assert
    expect(productPrices.length).toBeGreaterThan(0);
    for (const productPrice of productPrices) {
      expect(productPrice.trim()).not.toBe('');
    }
    await expect(inventoryPage.productPriceItems).toHaveCount(productPrices.length);
    for (let index = 0; index < productPrices.length; index++) {
      await expect(inventoryPage.productPriceItems.nth(index)).toBeVisible();
    }
  });

  test('sorts inventory products by ascending price', async ({ authenticatedPage }) => {
    // Arrange
    const inventoryPage = new InventoryPage(authenticatedPage);

    // Act
    await inventoryPage.sortBy('Price (low to high)');
    const prices = await inventoryPage.getProductPrices();
    const numericPrices = prices.map(price => Number(price.replace('$', '')));

    // Assert
    expect(numericPrices.length).toBeGreaterThan(0);
    expect(numericPrices).toEqual([...numericPrices].sort((first, second) => first - second));
  });

  test('adds and removes an inventory product from the cart', async ({ authenticatedPage }) => {
    // Arrange
    const inventoryPage = new InventoryPage(authenticatedPage);
    const [productName] = await inventoryPage.getProductNames();
    expect(productName).toBeDefined();

    // Act
    await inventoryPage.addProductToCart(productName);

    // Assert
    await expect(inventoryPage.cartBadge).toHaveText('1');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    // Act
    await inventoryPage.removeProductFromCart(productName);

    // Assert
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });
});
