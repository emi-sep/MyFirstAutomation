---
name: git-standards
description: >
  Enforce and execute Git workflow conventions for Playwright + TypeScript projects.
  Provides two capabilities: Validate (read-only checks of branch names, commit messages,
  substantive commit coverage, and README synchronization) and Execute (controlled
  branch creation, commits, pushes, and GitHub Pull Request creation).
  Load independently for Git workflow tasks or invoke through automation-architect.
---

# Git workflow standards

## Ownership and repository fit

This skill owns Git conventions and workflow operations. It does not replace `.agents/skills/pom-architect/SKILL.md`, `.agents/skills/test-standards/SKILL.md`, or `.agents/skills/spec-standards/SKILL.md`; use those for Page Object architecture, test code quality, and specification organization respectively. A pull request may refer to their validation, but this skill does not redefine their rules.

Before relying on a base branch, inspect the repository's remote and branch references. The expected base is `main`, but verify it from the remote's advertised HEAD or equivalent repository evidence. If the verified base differs from `main`, report the discrepancy and ask for clarification. Do not silently change the convention. Local `init.defaultBranch` alone does not establish a remote's current default branch.

## Project conventions

### Branch names

Use `(test|fix)/<kebab-case-scope>`.

- `test/` is for new test case additions.
- `fix/` is for defect corrections.
- Scope must be non-empty lowercase kebab-case.

Valid: `test/tc8-verify-products`, `test/tc9-search-product`, `fix/login-redirect`, `fix/tc3-incorrect-credentials`.

Invalid: `feature/products`, `test/TC8_VerifyProducts`, `main`, `fix/`.

### Commit messages

Use Conventional Commits in the form `type(scope): description`; scope is optional. Allowed types are `feat`, `fix`, `refactor`, `chore`, and `docs`. A present scope uses lowercase kebab-case. Description starts lowercase, does not end with a period, and should be clear, concise, and imperative.

The required validation pattern is:

```regex
^(feat|fix|refactor|chore|docs)(\([a-z0-9][a-z0-9-]*\))?: [a-z].+[^.]$
```

Valid: `feat(tc8): add products page verification`, `fix(login): correct redirect after logout`, `chore: update playwright version`, `docs(readme): add setup instructions`, `refactor(products): extract search method to page object`.

Invalid: `Added products test`, `feat: Added products test`, `fix: correct redirect after logout.`, `Feature(tc8): add products page`.

Every feature branch must contain at least one `feat` or `fix` commit before merging. The PR base must be the verified main development branch, expected to be `main`. Never push directly to `main` or `master`. Use GitHub CLI (`gh`) for PR creation when available. Stage specific files only; never use `git add .`, `git add -A`, or `--no-verify`. Never rewrite published history without explicit authorization.

## Capability 1: Validate (read-only)

### Triggers

`check git`, `verify commits`, `git conventions`, `pre-PR check`.

Validation only inspects and reports current Git state. Never modify branches, commits, working files, or remote repositories in this capability.

### Establish the base and comparison range

Verify the base branch using remote configuration and refs (prefer the remote's symbolic HEAD, such as `origin/HEAD`). Use the verified remote-tracking base when available, such as `origin/main`. A local base branch may be used only after verifying it is the appropriate base. If the base cannot be established, report dependent checks as `INCOMPLETE`; do not report successful validation.

### C1 — COMMIT_FORMAT (ERROR)

Inspect commits on the current branch relative to the verified base. Prefer:

```bash
git log origin/main..HEAD --format="%s"
```

Use `git log main..HEAD --format="%s"` only when the local `main` has been verified as the appropriate base and the remote-tracking base is unavailable. Check every subject against the project commit pattern. If the base cannot be established, commit format validation is incomplete.

### C2 — BRANCH_NAME (ERROR)

Retrieve the current branch with:

```bash
git branch --show-current
```

The branch must match `^(test|fix)/[a-z0-9][a-z0-9-]*$`. Do not classify the verified protected base branch as a malformed feature branch: report the branch-name check as `PASS` for the base branch and state that a working branch is required before committing or pushing project changes.

### C3 — SUBSTANTIVE_COMMIT (ERROR)

Inspect messages relative to the verified base and require at least one commit whose type is `feat` or `fix`. A branch with only `chore`, `docs`, or `refactor` commits fails this requirement. If the base cannot be verified, report this check as incomplete.

### C4 — README_SYNC (WARNING)

Compare changed files relative to the verified base, for example:

```bash
git diff origin/main...HEAD --name-only
```

Architectural files are `.agents/skills/**`, `playwright.config.ts`, `package.json`, `tsconfig.json`, `src/ui/pages/BasePage.ts`, and `src/fixtures/**`. If any architectural file changed without `README.md`, emit a warning that architecture documentation may need updating before merge. This check is a warning, not a blocker. README synchronization is not automatic. When appropriate, recommend the repository README maintenance procedure with `$automation-architect`.

If the base cannot be verified, report README synchronization as `INCOMPLETE`. If `README.md` is absent, report that the check cannot establish synchronization rather than treating another file as its substitute without repository evidence.

### Validate report

Use this format and retain the distinction between `PASS`, `VIOLATION`, `WARNING`, and `INCOMPLETE`:

```text
[git-standards] VALIDATE
--------------------------------------
Branch name:      PASS | VIOLATION
Commit format:    N valid / N invalid
Commit coverage:  PASS | VIOLATION | INCOMPLETE
README sync:      IN SYNC | WARNING | INCOMPLETE
Base branch:      <verified branch>
--------------------------------------
Issues:
- <details, if any>

[git-standards] Conventions valid.
OR
[git-standards] N issue(s) found.
```

Do not report conventions as valid if required information could not be inspected. Explain any incomplete checks in `Issues`.

### Fix guidance

For violations, recommend commands but do not execute them during validation:

| Violation | Recommended action |
|-----------|--------------------|
| Invalid branch name | `git branch -m <new-name>` |
| Incorrect last commit message | `git commit --amend -m "type(scope): description"` |
| Incorrect older commit message | Review `git rebase -i <base-branch>` |
| Missing `feat` or `fix` commit | Add a substantive commit before merging |
| README synchronization warning | Review README using `$automation-architect` |

Do not recommend amending commits already pushed without explaining the implications and obtaining required authorization.

## Capability 2: Execute (write operations)

Execute applies the controlled workflows below. It must run Validate before every write operation, including branch creation. Stop on validation failures that the relevant workflow treats as blocking, and stop whenever an explicit user confirmation is required.

### Mandatory safety policy

1. Never push directly to `main` or `master`.
2. Never use `git push --force` or `git push --force-with-lease` without explicit user confirmation.
3. Never use `--no-verify`.
4. Never amend a commit already pushed to a remote without explicit user authorization and an explanation of the impact.
5. Stage specific files only; never use `git add .` or `git add -A`.
6. Run Validate before write operations.
7. Never commit secrets, `.env` files, credentials, tokens, or generated reports unless explicitly required and safe.
8. Inspect `git status` before staging or committing.
9. Never discard, overwrite, reset, or revert user changes without explicit authorization.
10. Do not assume local success means the remote operation succeeded.

### Confirmation requirements

- Before branch creation, confirm the intended name if it cannot be inferred unambiguously. Show the proposed name and obtain confirmation before creation.
- Before committing, show the exact files to stage, exact message, and relevant change summary; obtain explicit confirmation before the commit.
- Before pushing, show branch and remote destination; obtain explicit confirmation before the push.
- Before creating a PR, show title, base branch, and full body; obtain explicit confirmation before creation.
- A general request such as `git workflow` authorizes preparation and validation, not every external write.

Never claim an operation succeeded until its command reports success.

### E1 — Create branch

Triggers: `create branch`, `new branch`, `start branch`.

1. Run Validate and inspect current branch and working tree.
2. Ask for or infer the type (`test` or `fix`) and kebab-case scope (such as a TC ID or feature name).
3. Construct `{type}/{scope}`; validate it and check local and remote refs for a collision.
4. Show the proposed branch name and obtain confirmation.
5. Create it with `git checkout -b <branch-name>`.

Creating a working branch from the verified protected base is an allowed remediation when Validate reports that the current branch is the base. Do not treat that C2 notice alone as a reason to block E1.

Do not automatically stash, discard, or overwrite uncommitted changes.

```text
[git-standards] BRANCH CREATED
Branch: test/tc8-verify-products
```

### E2 — Commit

Triggers: `commit`, `git commit`, `create commit`.

1. Run Validate; stop if the branch name is invalid.
2. Inspect `git status` and `git diff`.
3. Identify exact files, check for secrets and generated artifacts, and construct a valid commit message.
4. Show files, message, and change summary; obtain explicit confirmation.
5. Immediately before staging, run Validate again; stage only named paths with `git add <file1> <file2>`.
6. Inspect staged content with `git diff --cached`; if it differs from what was confirmed, stop and re-present it for approval.
7. Immediately before committing, run Validate again. If the staged content still matches what was confirmed and no blocking issue applies, commit with `git commit -m "type(scope): description"` and verify the resulting commit.

```text
[git-standards] COMMIT CREATED
Message: feat(tc8): add products page verification
Files staged:
- tests/ui/smoke/products/TC8-verify-all-products-and-detail.spec.ts
- src/ui/pages/InventoryPage.ts
```

### E3 — Push

Triggers: `push`, `git push`, `push branch`.

1. Run full Validate; stop if blocking violations exist.
2. Confirm current branch is not `main` or `master`.
3. Inspect `git remote -v` and upstream with `git rev-parse --abbrev-ref --symbolic-full-name @{u}`.
4. Determine the push destination. Show local branch, remote, destination branch, and whether upstream will be configured; obtain explicit confirmation.
5. For a new branch, use `git push -u origin <branch-name>`. For an existing upstream, use `git push`.
6. Verify the command's result and report only what succeeded.

```text
[git-standards] PUSHED
Branch: test/tc8-verify-products
Remote: origin/test/tc8-verify-products
```

### E4 — Create Pull Request

Triggers: `create PR`, `open PR`, `pull request`, `new PR`.

1. Run full Validate; stop if blocking violations exist.
2. Check `gh --version` and `gh auth status`.
3. Verify remote repository and base branch; the verified base is expected to be `main`.
4. Prepare a title from the relevant `feat`/`fix` commit and derive TC IDs, changed files, and summary from the actual branch diff and specification files.
5. Prepare the body, then show title, base, and complete body. Obtain explicit confirmation.
6. Create using GitHub CLI when available:

```bash
gh pr create --title "<title>" --body "<body>" --base main
```

PR body template:

```markdown
## Summary
<description derived from feat/fix commits>

## Test Cases
<TC IDs and test names from changed specification files>

## Changes
<new or modified files>

## Validation
- [ ] TypeScript validation passed
- [ ] Relevant Playwright tests passed
- [ ] No hardcoded credentials
- [ ] Spec files follow TC organization conventions
- [ ] Page Objects follow POM conventions

## Checklist
- [ ] No secrets committed
- [ ] README reviewed when architectural changes were introduced
- [ ] Changes are ready for review
```

Report the returned PR URL only after successful creation. If `gh` is unavailable or unauthenticated, state the limitation and provide the appropriate manual next step; do not claim PR creation.

### E5 — Full workflow

Triggers: `git workflow`, `commit push PR`, `full git`, `submit work`.

1. Validate.
2. Prepare the commit and obtain confirmation.
3. Commit.
4. Prepare the push and obtain confirmation.
5. Push.
6. Prepare the PR and obtain confirmation.
7. Create the PR and report completed operations.

Stop when validation fails or confirmation is required. Never skip confirmation because the user requested the full workflow.

```text
[git-standards] WORKFLOW STATUS
--------------------------------------
Validation: PASS
Commit:     COMPLETED | PENDING
Push:       COMPLETED | PENDING
PR:         CREATED | PENDING
--------------------------------------
Next action: <specific next action>
```

## Codex compatibility

Use this Codex Skill and explicit skill-file invocation conventions. Do not depend on Kiro paths, IDE features, Modes, commands, or activation behavior.
