import type { Page } from '@playwright/test';
import type { Ability } from '@core/actors/Ability';

export class BrowseTheWeb implements Ability {
  constructor(readonly page: Page) {}
}
