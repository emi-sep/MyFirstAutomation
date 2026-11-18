import type { Actor } from '@core/actors/Actor';
import type { Question } from '@core/actors/Question';
import { UseBookStoreApi } from '@sites/demoqa/api/abilities/UseBookStoreApi';
import type { UserProfile } from '@sites/demoqa/api/models/account.model';

export class UserCollection implements Question<UserProfile> {
  async answeredBy(actor: Actor): Promise<UserProfile> {
    return actor.ability(UseBookStoreApi).collection();
  }
}
