import type { Ability } from '@core/actors/Ability';
import { BrowseTheWeb } from '@core/actors/abilities/BrowseTheWeb';
import { BookStoreScreen } from '@sites/demoqa/ui/components/BookStoreScreen';

export class UseDemoQaUi implements Ability {
  readonly screen: BookStoreScreen;

  constructor(readonly browser: BrowseTheWeb) {
    this.screen = new BookStoreScreen(browser.page);
  }
}
