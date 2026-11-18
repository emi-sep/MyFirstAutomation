import type { Actor } from '@core/actors/Actor';
import type { Task } from '@core/actors/Task';
import { UseDemoQaUi } from '@sites/demoqa/ui/abilities/UseDemoQaUi';
import { LogInToBookStore } from '@sites/demoqa/tasks/LogInToBookStore';

export interface AddBookToCollectionResult {
  displayedTitle: string;
  alertMessage: string;
}

export class AddBookToCollection implements Task<AddBookToCollectionResult> {
  constructor(private readonly bookTitle: string) {}

  async performAs(actor: Actor): Promise<AddBookToCollectionResult> {
    await actor.attemptsTo(new LogInToBookStore());
    const screen = actor.ability(UseDemoQaUi).screen;
    await screen.catalog.open();
    await screen.catalog.openBook(this.bookTitle);
    const displayedTitle = await screen.details.title(this.bookTitle);
    const alertMessage = await screen.details.addToCollection();
    return { displayedTitle, alertMessage };
  }
}
