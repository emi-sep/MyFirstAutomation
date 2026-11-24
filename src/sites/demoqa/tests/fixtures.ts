import { randomBytes } from 'node:crypto';
import { test as base } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { ActorFactory } from '@core/actors/ActorFactory';
import { BrowseTheWeb } from '@core/actors/abilities/BrowseTheWeb';
import { getEnvironment } from '@core/config/env';
import { ApiClient } from '@sites/demoqa/api/client/ApiClient';
import { AccountController } from '@sites/demoqa/api/controllers/AccountController';
import { BookStoreController } from '@sites/demoqa/api/controllers/BookStoreController';
import type { TestUser, TestUserCredentials } from '@sites/demoqa/api/models/account.model';
import { UseBookStoreApi } from '@sites/demoqa/api/abilities/UseBookStoreApi';
import { UseDemoQaUi } from '@sites/demoqa/ui/abilities/UseDemoQaUi';
import type { Actor } from '@core/actors/Actor';

interface DemoQaFixtures {
  demoQaActor: Actor;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown API lifecycle error';
}

async function cleanOwnedUser(
  user: TestUser,
  api: UseBookStoreApi,
  accounts: AccountController,
  allowDestructiveCleanup: boolean
): Promise<string[]> {
  const errors: string[] = [];
  try {
    const profile = await api.collection();
    if (profile.books.length > 0) {
      if (!allowDestructiveCleanup) {
        throw new Error(
          'Bulk collection cleanup was blocked because ALLOW_DESTRUCTIVE_CLEANUP is not true.'
        );
      }
      await api.deleteAllBooks();
    }
  } catch (error) {
    errors.push(`Book collection cleanup failed: ${errorMessage(error)}`);
  }

  try {
    await api.refreshAuthentication();
    await accounts.deleteUser(user.id);
  } catch (error) {
    errors.push(`Test-owned account cleanup failed: ${errorMessage(error)}`);
  }
  return errors;
}

export const test = base.extend<DemoQaFixtures>({
  demoQaActor: async ({ page, playwright }, use, testInfo): Promise<void> => {
    let apiRequest: APIRequestContext | undefined;
    let user: TestUser | undefined;
    let bookStoreApi: UseBookStoreApi | undefined;
    let accounts: AccountController | undefined;
    let allowDestructiveCleanup = false;
    let setupFailed = false;

    try {
      const environment = getEnvironment();
      allowDestructiveCleanup = environment.allowDestructiveCleanup;
      apiRequest = await playwright.request.newContext({
        baseURL: environment.DEMOQA_BASE_URL
      });
      const client = new ApiClient(apiRequest);
      const accountController = new AccountController(client);
      accounts = accountController;
      const bookStore = new BookStoreController(client);
      const nonce = randomBytes(8).toString('hex');
      const username = `pw_${nonce}`;
      const credentials: TestUserCredentials = {
        username,
        password: `Aa1!${nonce}x`
      };

      user = await accounts.createUser(credentials, (userId) => {
        const ownedUser: TestUser = { id: userId, username, password: credentials.password };
        user = ownedUser;
        bookStoreApi = new UseBookStoreApi(ownedUser, credentials, client, accountController, bookStore);
      });
      if (!bookStoreApi) {
        throw new Error('The API-created DemoQA test user was not registered for cleanup.');
      }
      const token = await accounts.generateToken(credentials);
      client.setToken(token);
      if (!(await accounts.isAuthorized(credentials))) {
        throw new Error('The API-created DemoQA test user was not authorized.');
      }
      const profile = await accounts.getUser(user.id);
      if (profile.userId !== user.id || profile.username !== user.username || profile.books.length !== 0) {
        throw new Error('The API-created DemoQA user identity or empty-collection precondition was invalid.');
      }

      const browserAbility = new BrowseTheWeb(page);
      const actor = ActorFactory.create(`DemoQA user ${user.username}`, [
        browserAbility,
        new UseDemoQaUi(browserAbility),
        bookStoreApi
      ]);
      await use(actor);
    } catch (error) {
      setupFailed = true;
      throw error;
    } finally {
      if (user && bookStoreApi && accounts) {
        const cleanupErrors = await cleanOwnedUser(
          user,
          bookStoreApi,
          accounts,
          allowDestructiveCleanup
        );
        if (cleanupErrors.length > 0) {
          const message = `[DemoQA fixture] ${cleanupErrors.join('; ')}`;
          if (setupFailed || testInfo.status !== testInfo.expectedStatus) {
            console.error(message);
          } else {
            throw new Error(message);
          }
        }
      }
      try {
        await apiRequest?.dispose();
      } catch (error) {
        const message = `[DemoQA fixture] API context disposal failed: ${errorMessage(error)}`;
        if (setupFailed || testInfo.status !== testInfo.expectedStatus) {
          console.error(message);
        } else {
          throw new Error(message);
        }
      }
    }
  }
});

export { expect } from '@playwright/test';
