import { test, expect } from '@sites/demoqa/tests/fixtures';
import { getEnvironment } from '@core/config/env';
import { UseBookStoreApi } from '@sites/demoqa/api/abilities/UseBookStoreApi';
import { CollectionContainsBook } from '@sites/demoqa/questions/CollectionContainsBook';
import { UserCollection } from '@sites/demoqa/questions/UserCollection';
import { AddBookToCollection } from '@sites/demoqa/tasks/AddBookToCollection';
import { demoQaBooks } from '@sites/demoqa/data/books';

test.describe('Books', () => {
  test.use({ baseURL: getEnvironment().DEMOQA_BASE_URL });
  test.setTimeout(60_000);

  test('TC02: Add a book to the user collection @smoke', { tag: '@smoke' }, async ({ demoQaActor }) => {
    const api = demoQaActor.ability(UseBookStoreApi);
    const selectedBook = demoQaBooks.gitPocketGuide;

    await test.step('Verify the API-created user starts with an empty collection', async () => {
      const collection = await demoQaActor.asks(new UserCollection());
      expect(collection.userId).toBe(api.user.id);
      expect(collection.username).toBe(api.user.username);
      expect(collection.books).toHaveLength(0);
    });

    await test.step('Log in and add the selected book through the UI', async () => {
      const result = await demoQaActor.attemptsTo(new AddBookToCollection(selectedBook.title));
      expect(result.displayedTitle).toBe(selectedBook.title);
      expect(result.alertMessage).toBe('Book added to your collection.');
    });

    await test.step('Verify the selected ISBN appears through the API', async () => {
      const selectedBookIsPresent = await demoQaActor.asks(new CollectionContainsBook(selectedBook.isbn));
      expect(selectedBookIsPresent).toBe(true);
    });
  });
});
