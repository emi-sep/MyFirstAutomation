import type { Actor } from '@core/actors/Actor';
import type { Task } from '@core/actors/Task';
import { UseBookStoreApi } from '@sites/demoqa/api/abilities/UseBookStoreApi';
import { UseDemoQaUi } from '@sites/demoqa/ui/abilities/UseDemoQaUi';

export class LogInToBookStore implements Task {
  async performAs(actor: Actor): Promise<void> {
    const api = actor.ability(UseBookStoreApi);
    const ui = actor.ability(UseDemoQaUi);
    await ui.browser.page.goto('/login');
    await ui.screen.loginForm.signIn(api.user);
  }
}
