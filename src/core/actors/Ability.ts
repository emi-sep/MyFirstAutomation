export interface Ability {}

export type AbilityConstructor<TAbility extends Ability> = new (...args: never[]) => TAbility;
