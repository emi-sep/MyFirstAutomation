import { Actor } from '@core/actors/Actor';
import type { Ability } from '@core/actors/Ability';

export class ActorFactory {
  static create(name: string, abilities: Ability[]): Actor {
    if (!name.trim()) {
      throw new Error('Actor name must not be empty.');
    }
    return new Actor(name, abilities);
  }
}
