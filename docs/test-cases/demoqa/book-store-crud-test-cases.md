# DemoQA Book Store test cases

## TC02 — Add a book to the user's collection

**Preconditions:** The test fixture creates a unique DemoQA account through the API, authenticates it, verifies its profile identity, and confirms that its collection is empty.

**Steps:**

1. Log in through the Book Store UI with the fixture-owned account.
2. Open the deterministic Git Pocket Guide book and add it to the collection.

**Expected results:** The UI confirms the add action, and an API profile query finds the selected ISBN in this user's collection.

**Cleanup:** The fixture removes books owned by this test account and deletes that account.

## TC08 — Delete one book and retain the other

**Preconditions:** The test fixture creates and authenticates a unique DemoQA account. The test seeds Git Pocket Guide and Learning JavaScript Design Patterns through the API and confirms both ISBNs are present.

**Steps:**

1. Log in through the Book Store UI and open the profile collection.
2. Delete Git Pocket Guide through its row action and confirm the dialog.

**Expected results:** API verification confirms Git Pocket Guide is absent and Learning JavaScript Design Patterns remains in the account's collection.

**Cleanup:** The fixture removes books owned by this test account and deletes that account.

Each case owns an isolated account and does not depend on another test's execution or data.
