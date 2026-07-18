# PR-01 — Project Structure

| Item | Value |
|------|-------|
| PR ID | PR-01 |
| Title | Create Initial Project Structure |
| Sprint | Sprint-02 |
| Priority | High |
| Status | Ready |
| Depends On | None |
| Estimated Time | 1 hour |

---

# 1. Objective

Create the standard directory structure for FactoryOS.

This PR establishes the foundation of the project before implementing any business logic.

No functional code is required in this PR.

---

# 2. Background

FactoryOS follows a layered architecture.

Every source file must be placed in a predefined directory so that future development remains consistent and maintainable.

This PR creates only the project skeleton.

---

# 3. Scope

Create the following folders if they do not already exist.

```
FactoryOS/
│
├── docs/
│   ├── architecture/
│   └── sprint-02/
│
├── src/
│
├── html/
│
└── test/
```

Do not remove any existing files.

Do not rename existing folders.

---

# 4. Source Structure

The `src` directory contains all Google Apps Script source files.

Example target structure:

```
src/

Config.gs

SettingsService.gs

IdService.gs

ValidationService.gs

DriveService.gs

ProjectRepository.gs

ProjectService.gs

Logger.gs

Utils.gs
```

Only create placeholder files if required by the development environment.

Business logic will be implemented in later PRs.

---

# 5. HTML Structure

The `html` directory contains user interface files.

Example:

```
html/

Index.html

ProjectForm.html

ProjectList.html

Common.html

Style.html

Script.html
```

Only create placeholders if necessary.

No UI implementation in this PR.

---

# 6. Documentation Structure

The documentation directory shall contain:

```
docs/

architecture/

sprint-02/
```

Documentation files are maintained separately.

No documentation generation is required by this PR.

---

# 7. Coding Rules

This PR shall not contain:

- Business logic
- Database access
- Validation
- UI behavior
- Repository implementation
- Service implementation

Only structural work is allowed.

---

# 8. Constraints

Must not:

- Rename folders
- Delete files
- Move existing files
- Modify database schema
- Introduce third-party libraries

---

# 9. Acceptance Criteria

The PR is accepted when:

- Required folders exist.
- Existing files remain unchanged.
- Project builds successfully.
- No runtime errors are introduced.
- Repository remains clean and organized.

---

# 10. Deliverables

Expected directory structure:

```
FactoryOS/
│
├── docs/
│   ├── architecture/
│   └── sprint-02/
│
├── src/
│
├── html/
│
└── test/
```

---

# 11. Out of Scope

This PR does not include:

- Configuration
- SettingsService
- ValidationService
- ID generation
- Drive integration
- Repository implementation
- UI implementation
- Tests

These items are covered by later PRs.

---

# 12. Review Checklist

Before approving this PR, verify:

- [ ] Folder structure matches specification.
- [ ] No unnecessary files were added.
- [ ] No existing files were modified unintentionally.
- [ ] No business logic is present.
- [ ] Project remains organized.

---

# Definition of Done

This PR is complete when the FactoryOS project has the standardized directory structure required for all subsequent development, with no functional changes introduced.