import { test, expect } from '@sites/demoqa/tests/fixtures';
import { getEnvironment } from '@core/config/env';
import { UseBookStoreApi } from '@sites/demoqa/api/abilities/UseBookStoreApi';
import { CollectionContainsBook } from '@sites/demoqa/questions/CollectionContainsBook';
import { UserCollection } from '@sites/demoqa/questions/UserCollection';
import { DeleteBookFromCollection } from '@sites/demoqa/tasks/DeleteBookFromCollection';
import { demoQaBooks } from '@sites/demoqa/data/books';

test.describe('Books', () => {
  test.use({ baseURL: getEnvironment().DEMOQA_BASE_URL });
  test.setTimeout(60_000);

  test('TC08: Delete one book and retain the other @smoke', { tag: '@smoke' }, async ({ demoQaActor }) => {
    const api = demoQaActor.ability(UseBookStoreApi);
    const deletedBook = demoQaBooks.gitPocketGuide;
    const remainingBook = demoQaBooks.learningJavaScriptDesignPatterns;

    await test.step('Prepare and verify two books through the API', async () => {
      await api.addBooks([deletedBook.isbn, remainingBook.isbn]);
      const collection = await demoQaActor.asks(new UserCollection());
      expect(collection.userId).toBe(api.user.id);
      expect(collection.books.map(book => book.isbn).sort()).toEqual(
        [deletedBook.isbn, remainingBook.isbn].sort()
      );
    });

    await test.step('Log in and delete the selected book through the UI', async () => {
      const confirmation = await demoQaActor.attemptsTo(new DeleteBookFromCollection(deletedBook.title));
      expect(confirmation).toContain('Do you want to delete this book?');
    });

    await test.step('Verify the deleted book is absent and the other remains through the API', async () => {
      const deletedBookIsPresent = await demoQaActor.asks(new CollectionContainsBook(deletedBook.isbn));
      const remainingBookIsPresent = await demoQaActor.asks(new CollectionContainsBook(remainingBook.isbn));
      expect(deletedBookIsPresent).toBe(false);
      expect(remainingBookIsPresent).toBe(true);
    });
  });
});
