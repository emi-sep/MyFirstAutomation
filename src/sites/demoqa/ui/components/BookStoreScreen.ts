import type { Page } from '@playwright/test';
import { BookCatalog } from '@sites/demoqa/ui/components/BookCatalog';
import { BookDetails } from '@sites/demoqa/ui/components/BookDetails';
import { LoginForm } from '@sites/demoqa/ui/components/LoginForm';
import { ProfileCollection } from '@sites/demoqa/ui/components/ProfileCollection';

export class BookStoreScreen {
  readonly loginForm: LoginForm;
  readonly catalog: BookCatalog;
  readonly details: BookDetails;
  readonly profile: ProfileCollection;

  constructor(page: Page) {
    this.loginForm = new LoginForm(page);
    this.catalog = new BookCatalog(page);
    this.details = new BookDetails(page);
    this.profile = new ProfileCollection(page);
  }
}
