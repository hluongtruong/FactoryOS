# ADR-006 — Google Apps Script Convention

| Item | Value |
|------|-------|
| ADR ID | ADR-006 |
| Title | Google Apps Script Convention |
| Status | Accepted |
| Version | 1.0 |
| Date | 2026-07-19 |

---

# 1. Context

FactoryOS is built on Google Apps Script (GAS).

Unlike standard JavaScript environments, GAS has several platform-specific constraints:

- Global function namespace
- Google Workspace APIs
- Single project runtime
- No module import/export
- Service-based APIs

This ADR defines mandatory development conventions for all FactoryOS source code.

---

# 2. Global Namespace Rule

Google Apps Script places all top-level functions into a shared global namespace.

Therefore:

- Avoid duplicate public function names.
- Do not create generic global functions.

Preferred:

```javascript
createProject()

removeProject()

searchProjects()
```

Avoid:

```javascript
delete()

open()

close()

save()

run()
```

---

# 3. Service Naming Convention

Business Services shall use verbs that describe business intent.

Preferred:

```javascript
createProject()

removeProject()

updateProject()

searchProjects()
```

Repository methods may follow CRUD conventions.

Example:

```javascript
insert()

update()

deleteProject()

findById()
```

---

# 4. File Organization

One responsibility per file.

Example:

```
Config.gs

ValidationService.gs

IdService.gs

DriveService.gs

ProjectRepository.gs

ProjectService.gs
```

Do not mix multiple Services in one file.

---

# 5. Access Rule

SpreadsheetApp

Only Repository may access SpreadsheetApp.

DriveApp

Only DriveService may access DriveApp.

HTML Service

Only UI Layer.

PropertiesService

Only SettingsService or infrastructure modules.

LockService

Only IdService or modules requiring synchronization.

---

# 6. Configuration Rule

Configuration values shall be read only from Config.

Forbidden:

```javascript
const SHEET = "PROJECT";
```

Required:

```javascript
CONFIG.SHEETS.PROJECT
```

Column references:

```javascript
CONFIG.PROJECT_COLUMNS
```

Hard-coded configuration values are prohibited.

---

# 7. Error Handling

Infrastructure

Throw technical exceptions.

Repository

Throw persistence exceptions.

Service

Throw business exceptions.

Silent failures are prohibited.

Do not return false instead of throwing unless explicitly defined by specification.

---

# 8. Logging

Logger shall not expose:

- Folder URL
- Customer information
- Sensitive project data
- Internal template structure

Allowed:

- Success
- Failure
- Rollback
- Validation failure

---

# 9. Locking Rule

Shared counters shall always use LockService.

Example:

```javascript
IdService.generateProjectId()
```

Lock acquisition must have timeout.

Lock must always be released.

---

# 10. Spreadsheet Rule

Repository shall:

- Read once
- Write once when possible
- Cache header mapping during runtime

Avoid repeated Spreadsheet API calls inside loops.

---

# 11. Drive Rule

Only DriveService may:

- Create folders
- Delete folders
- Copy template folders
- Rename folders

No other module shall use DriveApp.

---

# 12. Validation Rule

Validation shall be delegated.

Business Layer must never validate fields manually.

ValidationService provides:

```javascript
validateProjectInput()

validateProject()
```

---

# 13. Utility Rule

Private helper functions are encouraged.

Naming:

```javascript
buildProjectObject_()

mapRowToProject_()

getHeaderMap_()
```

Private helpers shall end with "_".

---

# 14. Constants

Magic numbers are prohibited.

Example:

Forbidden:

```javascript
sheet.getRange(2, 7)
```

Preferred:

```javascript
CONFIG.PROJECT_COLUMNS.PROJECT_NAME
```

---

# 15. Coding Style

Use:

- const whenever possible
- let only when reassignment is required

Avoid var.

Functions should be short and focused.

Prefer early return over nested conditions.

---

# 16. Transaction Rule

Business transactions belong only to Service Layer.

Rollback belongs only to Service Layer.

Repository shall never perform rollback.

---

# 17. Performance Rule

Avoid unnecessary calls to:

- SpreadsheetApp
- DriveApp
- PropertiesService

Cache reusable data within one execution.

---

# 18. AI Compatibility

All source code shall be deterministic and AI-friendly.

Requirements:

- Explicit naming
- No hidden side effects
- Minimal coupling
- Small reusable functions
- Clear public APIs

When specification conflicts with implementation:

- Stop implementation.
- Report the conflict.
- Do not guess.

---

# 19. Compliance

Every PR shall comply with ADR-006.

Reviewers shall verify:

- No prohibited APIs used.
- Naming convention followed.
- Layer boundaries respected.
- Configuration not hard-coded.
- Global namespace conflicts avoided.

---

# Consequences

By adopting ADR-006, FactoryOS achieves:

- Consistent Google Apps Script architecture.
- Safer AI-assisted development.
- Fewer runtime conflicts.
- Better maintainability.
- Predictable coding standards.
- Reduced implementation ambiguity.