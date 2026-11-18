import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  private token: string | undefined;

  constructor(private readonly request: APIRequestContext) {}

  setToken(token: string): void {
    this.token = token;
  }

  async get<TResponse>(path: string, expectedStatus = 200): Promise<TResponse> {
    const response = await this.request.get(path, { headers: this.headers() });
    return this.readJson<TResponse>('GET', path, response, expectedStatus);
  }

  async post<TResponse>(path: string, body: unknown, expectedStatus = 200): Promise<TResponse> {
    const response = await this.request.post(path, {
      data: body,
      headers: this.headers()
    });
    return this.readJson<TResponse>('POST', path, response, expectedStatus);
  }

  async delete(path: string, body?: unknown, expectedStatus = 204): Promise<void> {
    const response = await this.request.delete(path, {
      data: body,
      headers: this.headers()
    });
    if (response.status() !== expectedStatus) {
      throw new Error(
        `DELETE ${path} expected HTTP ${expectedStatus}, received HTTP ${response.status()}${await this.errorDetails(response)}`
      );
    }
  }

  private headers(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  private async readJson<TResponse>(
    method: string,
    path: string,
    response: APIResponse,
    expectedStatus: number
  ): Promise<TResponse> {
    if (response.status() !== expectedStatus) {
      throw new Error(
        `${method} ${path} expected HTTP ${expectedStatus}, received HTTP ${response.status()}${await this.errorDetails(response)}`
      );
    }
    return (await response.json()) as TResponse;
  }

  private async errorDetails(response: APIResponse): Promise<string> {
    try {
      const body: unknown = await response.json();
      if (typeof body === 'object' && body !== null && 'message' in body) {
        const message = body.message;
        if (typeof message === 'string' && message.length > 0) {
          return `: ${message.slice(0, 300)}`;
        }
      }
    } catch {
      return '';
    }
    return '';
  }
}
