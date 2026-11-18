import type { Ability } from '@core/actors/Ability';
import { AccountController } from '@sites/demoqa/api/controllers/AccountController';
import { BookStoreController } from '@sites/demoqa/api/controllers/BookStoreController';
import type { TestUser, TestUserCredentials, UserProfile } from '@sites/demoqa/api/models/account.model';
import type { CatalogBook } from '@sites/demoqa/api/models/book.model';
import { ApiClient } from '@sites/demoqa/api/client/ApiClient';

export class UseBookStoreApi implements Ability {
  constructor(
    readonly user: TestUser,
    private readonly credentials: TestUserCredentials,
    private readonly client: ApiClient,
    readonly accounts: AccountController,
    readonly books: BookStoreController
  ) {}

  async refreshAuthentication(): Promise<void> {
    const token = await this.accounts.generateToken(this.credentials);
    this.client.setToken(token);
  }

  async collection(): Promise<UserProfile> {
    await this.refreshAuthentication();
    return this.accounts.getUser(this.user.id);
  }

  async catalog(): Promise<CatalogBook[]> {
    return this.books.getCatalog();
  }

  async addBooks(isbns: string[]): Promise<void> {
    await this.refreshAuthentication();
    await this.books.addBooks(this.user.id, isbns);
  }

  async deleteBook(isbn: string): Promise<void> {
    await this.refreshAuthentication();
    await this.books.deleteBook(this.user.id, isbn);
  }

  async deleteAllBooks(): Promise<void> {
    await this.refreshAuthentication();
    await this.books.deleteAllBooks(this.user.id);
  }
}
