import type { Actor } from '@core/actors/Actor';
import type { Question } from '@core/actors/Question';
import { UseBookStoreApi } from '@sites/demoqa/api/abilities/UseBookStoreApi';

export class CollectionContainsBook implements Question<boolean> {
  constructor(private readonly isbn: string) {}

  async answeredBy(actor: Actor): Promise<boolean> {
    const profile = await actor.ability(UseBookStoreApi).collection();
    return profile.books.some(book => book.isbn === this.isbn);
  }
}
