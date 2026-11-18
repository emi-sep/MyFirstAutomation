import type { Actor } from '@core/actors/Actor';

export interface Task<TResult = void> {
  performAs(actor: Actor): Promise<TResult>;
}
