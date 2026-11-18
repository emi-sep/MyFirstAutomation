import { ApiClient } from '@sites/demoqa/api/client/ApiClient';
import { BookStoreEndpoints } from '@sites/demoqa/api/endpoints/books.endpoints';
import type {
  AddBooksRequest,
  CatalogBook,
  CatalogResponse,
  DeleteBookRequest
} from '@sites/demoqa/api/models/book.model';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export class BookStoreController {
  constructor(private readonly client: ApiClient) {}

  async getCatalog(): Promise<CatalogBook[]> {
    const response = await this.client.get<CatalogResponse>(BookStoreEndpoints.books);
    if (!Array.isArray(response.books) || !response.books.every(book =>
      isRecord(book) && typeof book.isbn === 'string' && typeof book.title === 'string'
    )) {
      throw new Error(`GET ${BookStoreEndpoints.books} returned an invalid catalog.`);
    }
    return response.books;
  }

  async addBooks(userId: string, isbns: string[]): Promise<void> {
    if (isbns.length === 0 || isbns.some(isbn => !isbn.trim())) {
      throw new Error('At least one non-empty ISBN is required to seed a collection.');
    }
    const payload: AddBooksRequest = {
      userId,
      collectionOfIsbns: isbns.map(isbn => ({ isbn }))
    };
    await this.client.post<unknown>(BookStoreEndpoints.books, payload, 201);
  }

  async deleteBook(userId: string, isbn: string): Promise<void> {
    const payload: DeleteBookRequest = { userId, isbn };
    await this.client.delete(BookStoreEndpoints.book, payload);
  }

  async deleteAllBooks(userId: string): Promise<void> {
    await this.client.delete(`${BookStoreEndpoints.books}?UserId=${encodeURIComponent(userId)}`);
  }
}
