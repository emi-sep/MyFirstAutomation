---
name: git-standards
description: >
  Enforce and execute Git workflow conventions for Playwright + TypeScript projects.
  Provides two capabilities: Validate (read-only checks of branch names, commit messages,
  substantive commit coverage, and documentation synchronization) and Execute (controlled
  branch creation, commits, pushes, and GitHub Pull Request creation).
  Load independently for Git workflow tasks or invoke through automation-architect.
---

# Git workflow standards

## Ownership and repository fit

This skill owns Git conventions, read-only documentation-drift validation, and controlled Git operations. It does not replace `.agents/skills/pom-architect/SKILL.md`, `.agents/skills/test-standards/SKILL.md`, or `.agents/skills/spec-standards/SKILL.md`; use those for Page Object architecture, test code quality, and specification organization respectively. `$automation-architect` owns selecting and applying documentation updates. Apply `code-conventions` to embedded code examples only when TypeScript quality is in scope; this Skill does not redefine those rules.

Before relying on a base branch, inspect the repository's remote and branch references. The project convention expects `main`, but verify the configured default from remote or repository tracking evidence rather than assuming a branch name. If the verified default differs from `main`, report the discrepancy and ask for clarification before Git operations that depend on that convention. Local `init.defaultBranch` alone does not establish a remote's current default branch.

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

Every feature branch must contain at least one `feat` or `fix` commit before merging. Use the verified repository default as the PR base; the project convention expects `main`, so report a mismatch for clarification. Never push directly to `main` or `master`. Use GitHub CLI (`gh`) for PR creation when available. Stage specific files only; never use `git add .`, `git add -A`, or `--no-verify`. Never rewrite published history without explicit authorization.

## Capability 1: Validate (read-only)

### Triggers

`check git`, `verify commits`, `git conventions`, `pre-PR check`.

Validation only inspects and reports current Git state. Never modify branches, commits, working files, or remote repositories in this capability.

### Establish the base and comparison range

Verify the base branch from the configured remote and repository refs. Prefer the remote's advertised default (`git ls-remote --symref <remote> HEAD`) or a valid remote symbolic ref such as `<remote>/HEAD`. Check the corresponding remote-tracking ref exists. When remote metadata is unavailable, use configured branch tracking only if it establishes the intended base; do not rely on `init.defaultBranch` or assume `origin/main`. If the correct base cannot be established, report dependent checks as `INCOMPLETE`; do not report successful validation. Do not fetch or update refs during read-only validation; report when tracking-ref freshness cannot be confirmed.

### C1 — COMMIT_FORMAT (ERROR)

Inspect commits on the current branch relative to the verified base. Prefer:

```bash
git log <verified-base>..HEAD --format="%s"
```

Check every subject against the project commit pattern. If the base cannot be established, commit format validation is incomplete.

### C2 — BRANCH_NAME (ERROR)

Retrieve the current branch with:

```bash
git branch --show-current
```

The branch must match `^(test|fix)/[a-z0-9][a-z0-9-]*$`. Do not classify the verified protected base branch as a malformed feature branch: report the branch-name check as `PASS` for the base branch and state that a working branch is required before committing or pushing project changes.

### C3 — SUBSTANTIVE_COMMIT (ERROR)

Inspect messages relative to the verified base and require at least one commit whose type is `feat` or `fix`. A branch with only `chore`, `docs`, or `refactor` commits fails this requirement. If the base cannot be verified, report this check as incomplete.

### C4 — DOCS_SYNC (WARNING)

Triggers: `check documentation drift`, `check docs`, `docs sync`, or as part of `pre-PR check`.

This is a read-only check. Never edit documentation as part of Git validation. Inspect the current branch and determine its correct comparison base from repository state: prefer the remote's advertised default branch (`git ls-remote --symref <remote> HEAD`) or a valid remote symbolic ref such as `<remote>/HEAD`. Check that the selected remote-tracking ref exists and note when its tracking state may be stale. If remote default metadata is unavailable, use a branch's configured upstream only when repository evidence establishes that it is the intended default/base. Do not infer the remote default from `init.defaultBranch`, a branch name, or an assumed `origin/main`. If the base cannot be verified, report `INCOMPLETE` and do not claim a clean check.

Compare the current branch with the verified base and include uncommitted changes. Inspect both branch changes (for example, `git diff <base>...HEAD --name-only`) and the worktree/index diff from the base, plus untracked paths from `git status --short`. Do not fetch or otherwise update refs during validation. If the tracking ref's freshness cannot be established, state that limitation.

For changed files, identify whether the public framework interface or a documented convention changed, then check only applicable destinations:

| Source change | Documentation to consider |
|---|---|
| `.agents/skills/**` | Existing README Skill inventory and the affected Skill registry, ownership, or invocation references |
| `docs/**` | README link or overview only when the document is intended for repository users |
| `AGENTS.md` | README when persistent project instructions changed |
| `playwright.config.ts` | README configuration, browser, or command sections |
| `package.json` scripts | README commands |
| `tsconfig.json` aliases | README architecture or developer setup |
| `src/config/Env.ts` or `.env.example` public settings | README environment setup |
| `src/ui/pages/BasePage.ts` | README framework architecture |
| `src/fixtures/**` | README fixture architecture |
| `src/api/**` | API documentation only if it exists or is required by an established project convention |
| New test case files | Test case catalog only if the project maintains one |
| New supported application or test suite | README project overview, repository structure, or test organization as applicable |

Inspect actual files before selecting a destination. Do not assume a docs site, wiki, catalog, ADR collection, or API reference exists; do not create documentation automatically. A missing destination is not a violation when the trigger map marks it conditional. If no maintained destination exists for a public-interface change, report that limitation for maintainers instead of inventing a file. Apply the minimal-update and single-source-of-truth principles: documentation must describe implemented behavior, and detailed rules should stay in their owning Skills.

For each confirmed drift, report:

```text
[git-standards] WARNING — DOCS_SYNC
Source: <changed file>
Documentation: <expected document>
Reason: <why documentation may be stale>
Recommendation: <specific update>
```

If the verified comparison finds no documentation drift, report exactly:

```text
[git-standards] DOCS_SYNC — No documentation drift detected.
```

This check is advisory, not an automatic merge blocker. When documentation should change, recommend explicit invocation of `$automation-architect` with `update docs` or `sync documentation`; do not apply fixes during validation.

### Validate report

Use this format and retain the distinction between `PASS`, `VIOLATION`, `WARNING`, and `INCOMPLETE`:

```text
[git-standards] VALIDATE
--------------------------------------
Branch name:      PASS | VIOLATION
Commit format:    N valid / N invalid
Commit coverage:  PASS | VIOLATION | INCOMPLETE
Documentation sync: IN SYNC | WARNING | INCOMPLETE
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
| Documentation synchronization warning | Review applicable documentation using `$automation-architect` |

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

Use the recognized Codex Skill mention and explicit skill-file invocation conventions supported by the current environment.
