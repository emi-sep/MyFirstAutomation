import type { Actor } from '@core/actors/Actor';

export interface Question<TAnswer> {
  answeredBy(actor: Actor): Promise<TAnswer>;
}
