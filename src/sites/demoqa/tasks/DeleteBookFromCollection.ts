import type { Actor } from '@core/actors/Actor';
import type { Task } from '@core/actors/Task';
import { UseDemoQaUi } from '@sites/demoqa/ui/abilities/UseDemoQaUi';
import { LogInToBookStore } from '@sites/demoqa/tasks/LogInToBookStore';

export class DeleteBookFromCollection implements Task<string> {
  constructor(private readonly bookTitle: string) {}

  async performAs(actor: Actor): Promise<string> {
    await actor.attemptsTo(new LogInToBookStore());
    const profile = actor.ability(UseDemoQaUi).screen.profile;
    await profile.open();
    return profile.deleteBook(this.bookTitle);
  }
}
