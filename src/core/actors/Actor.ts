import type { Ability, AbilityConstructor } from '@core/actors/Ability';
import type { Question } from '@core/actors/Question';
import type { Task } from '@core/actors/Task';

export class Actor {
  private readonly abilities = new Map<Function, Ability>();

  constructor(readonly name: string, abilities: Ability[]) {
    for (const ability of abilities) {
      this.abilities.set(ability.constructor, ability);
    }
  }

  ability<TAbility extends Ability>(abilityType: AbilityConstructor<TAbility>): TAbility {
    const ability = this.abilities.get(abilityType);
    if (!ability) {
      throw new Error(`Actor "${this.name}" does not have the requested ability.`);
    }
    return ability as TAbility;
  }

  async attemptsTo<TResult>(task: Task<TResult>): Promise<TResult> {
    return task.performAs(this);
  }

  async asks<TAnswer>(question: Question<TAnswer>): Promise<TAnswer> {
    return question.answeredBy(this);
  }
}
