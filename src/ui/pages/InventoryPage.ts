import type { Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export type InventorySortOption =
  | 'Name (A to Z)'
  | 'Name (Z to A)'
  | 'Price (low to high)'
  | 'Price (high to low)';

export class InventoryPage extends BasePage {
  get inventoryHeading(): Locator {
    return this.page.getByText('Products', { exact: true });
  }

  get productCards(): Locator {
    return this.inventoryContainer.locator('.inventory_item');
  }

  get productNameItems(): Locator {
    return this.inventoryContainer.locator('.inventory_item_name');
  }

  get productPriceItems(): Locator {
    return this.inventoryContainer.locator('.inventory_item_price');
  }

  get inventoryContainer(): Locator {
    return this.page.locator('[data-test="inventory-container"]');
  }

  get productSortSelect(): Locator {
    return this.page.getByRole('combobox', { name: 'Sort products' });
  }

  get cartBadge(): Locator {
    return this.page.locator('.shopping_cart_badge');
  }

  async navigate(): Promise<void> {
    await super.navigate('/inventory.html');
  }

  async getProductNames(): Promise<string[]> {
    return this.productNameItems.allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return this.productPriceItems.allTextContents();
  }

  getProductNameLocator(productName: string): Locator {
    return this.getProduct(productName).locator('.inventory_item_name');
  }

  async sortBy(option: InventorySortOption): Promise<void> {
    await this.productSortSelect.selectOption({ label: option });
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.getProduct(productName)
      .getByRole('button', { name: 'Add to cart', exact: true })
      .click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    await this.getProduct(productName)
      .getByRole('button', { name: 'Remove', exact: true })
      .click();
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.count() === 0) {
      return 0;
    }

    const badgeText = await this.cartBadge.innerText();
    return Number.parseInt(badgeText, 10);
  }

  getProduct(productName: string): Locator {
    return this.productCards.filter({
      has: this.page.getByRole('button', {
        name: `View details for ${productName}`,
        exact: true
      })
    });
  }
}
