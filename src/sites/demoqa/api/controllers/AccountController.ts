import { AccountEndpoints } from '@sites/demoqa/api/endpoints/account.endpoints';
import type {
  TestUser,
  TestUserCredentials,
  UserProfile
} from '@sites/demoqa/api/models/account.model';
import { ApiClient } from '@sites/demoqa/api/client/ApiClient';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseUserProfile(value: unknown): UserProfile {
  if (!isRecord(value) || typeof value.userId !== 'string' || typeof value.username !== 'string') {
    throw new Error('GET /Account/v1/User returned an invalid user profile.');
  }
  if (!Array.isArray(value.books)) {
    throw new Error('GET /Account/v1/User returned an invalid books collection.');
  }
  const books = value.books.map(book => {
    if (!isRecord(book) || typeof book.isbn !== 'string') {
      throw new Error('GET /Account/v1/User returned an invalid book entry.');
    }
    return { isbn: book.isbn };
  });
  return {
    userId: value.userId,
    username: value.username,
    books
  };
}

function parseTokenResponse(value: unknown): string {
  if (
    !isRecord(value) ||
    typeof value.token !== 'string' ||
    value.token.length === 0 ||
    value.status !== 'Success' ||
    typeof value.result !== 'string'
  ) {
    throw new Error(`POST ${AccountEndpoints.generateToken} returned an invalid token response.`);
  }
  return value.token;
}

export class AccountController {
  constructor(private readonly client: ApiClient) {}

  async createUser(
    credentials: TestUserCredentials,
    onCreated: (userId: string) => void
  ): Promise<TestUser> {
    const response = await this.client.post<unknown>(
      AccountEndpoints.users,
      { userName: credentials.username, password: credentials.password },
      201
    );
    if (!isRecord(response)) {
      throw new Error('POST /Account/v1/User returned an invalid user response.');
    }
    const userId = response.userID ?? response.userId;
    if (typeof userId !== 'string' || userId.length === 0) {
      throw new Error('POST /Account/v1/User returned an invalid user identity.');
    }
    onCreated(userId);
    if (response.username !== credentials.username) {
      throw new Error('POST /Account/v1/User returned an invalid username.');
    }
    if (!Array.isArray(response.books) || response.books.length !== 0) {
      throw new Error('POST /Account/v1/User did not create an empty book collection.');
    }
    return { id: userId, username: credentials.username, password: credentials.password };
  }

  async generateToken(credentials: TestUserCredentials): Promise<string> {
    return parseTokenResponse(await this.client.post<unknown>(AccountEndpoints.generateToken, {
      userName: credentials.username,
      password: credentials.password
    }));
  }

  async isAuthorized(credentials: TestUserCredentials): Promise<boolean> {
    const response = await this.client.post<unknown>(AccountEndpoints.authorized, {
      userName: credentials.username,
      password: credentials.password
    });
    if (typeof response !== 'boolean') {
      throw new Error(`POST ${AccountEndpoints.authorized} returned an invalid authorization result.`);
    }
    return response;
  }

  async getUser(userId: string): Promise<UserProfile> {
    const response = await this.client.get<unknown>(AccountEndpoints.user(userId));
    return parseUserProfile(response);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.client.delete(AccountEndpoints.user(userId));
  }
}
