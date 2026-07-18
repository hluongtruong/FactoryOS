# ADR-005 — Service Architecture

| Item | Value |
|------|-------|
| ADR ID | ADR-005 |
| Title | Service Architecture |
| Status | Accepted |
| Version | 1.0 |
| Date | 2026-07-19 |

---

# 1. Context

FactoryOS adopts a layered architecture to ensure:

- Separation of responsibilities
- High maintainability
- Testability
- Reusability
- Low coupling

This ADR defines the architectural rules governing Services, Repositories, and infrastructure modules.

---

# 2. Architecture

```
UI

↓

Service Layer

↓

Repository Layer

↓

Google Workspace APIs
```

Detailed structure

```
HTML

↓

ProjectService

↓

ValidationService
IdService
DriveService
ProjectRepository

↓

SpreadsheetApp
DriveApp
PropertiesService
```

Only Repository and Infrastructure Services may access Google APIs.

---

# 3. Layer Responsibilities

## UI Layer

Responsibilities

- Display data
- Receive user input
- Call Service Layer

Must NOT

- Business Logic
- SpreadsheetApp
- DriveApp

---

## Service Layer

Responsibilities

- Business Logic
- Workflow
- Transaction
- Orchestration
- Rollback

Must NOT

- SpreadsheetApp
- DriveApp
- HTML

---

## Repository Layer

Responsibilities

- CRUD
- Row ⇄ Object Mapping

Must NOT

- Validation
- Business Logic
- Workflow
- Drive
- UI

---

## Infrastructure Services

Infrastructure Services include

- ValidationService
- IdService
- DriveService

Responsibilities

Provide reusable infrastructure capabilities.

Must remain independent.

---

# 4. Dependency Rules

Allowed

```
UI

↓

Service

↓

Repository
```

Service may call

- ValidationService
- IdService
- DriveService
- Repository

Repository shall not call any Service.

Infrastructure Services shall not call Repository.

---

# 5. Spreadsheet Rule

SpreadsheetApp may only appear inside Repository.

Forbidden elsewhere.

```
ProjectRepository

✔ SpreadsheetApp
```

```
ProjectService

✘ SpreadsheetApp
```

---

# 6. Drive Rule

DriveApp may only appear inside DriveService.

Forbidden elsewhere.

```
DriveService

✔ DriveApp
```

```
ProjectService

✘ DriveApp
```

---

# 7. Validation Rule

Validation must occur before business processing.

Input Validation

```
projectInput

↓

ValidationService.validateProjectInput()
```

Entity Validation

```
Project Object

↓

ValidationService.validateProject()
```

Business Layer must never validate fields manually.

---

# 8. ID Generation Rule

Project IDs are generated only by:

```
IdService.generateProjectId()
```

No other module may generate IDs.

---

# 9. Folder Creation Rule

Project folders are created only by

```
DriveService.createProjectFolder()
```

The method includes

- Folder creation
- Template copy
- Folder rename

No other module may copy templates directly.

---

# 10. Rollback Rule

If Folder creation succeeds but Repository insertion fails:

```
DriveService.deleteProjectFolder()

↓

Throw Exception
```

Project ID is never rolled back.

---

# 11. Repository Rule

Repository performs only

- CRUD
- Search
- Mapping

Repository never

- Validates
- Generates IDs
- Creates folders
- Executes workflow

---

# 12. Naming Convention

Because Google Apps Script uses a global namespace:

Public Service APIs shall avoid ambiguous names.

Preferred

```
removeProject()
```

Avoid

```
deleteProject()
```

Repository APIs may keep CRUD-oriented names because they are data-access operations.

---

# 13. Logging Rule

Infrastructure

Log technical events.

Service

Log business events.

Repository

Log persistence events only.

Sensitive information must never be logged.

---

# 14. Error Handling

Infrastructure

Throw technical exceptions.

Repository

Throw persistence exceptions.

Service

Convert lower-level failures into business failures when appropriate.

Silent failures are prohibited.

---

# 15. Transaction Rule

Business transactions shall be coordinated only by Service Layer.

Repositories never implement transactions.

---

# 16. Coding Principles

All modules shall follow:

- Single Responsibility Principle
- Dependency Inversion
- Separation of Concerns
- Stateless Design
- Deterministic Behavior
- Reusable Components

---

# 17. Compliance

Every new PR shall comply with ADR-005.

If implementation conflicts with this ADR:

- Stop implementation.
- Report the conflict.
- Do not guess.

---

# Consequences

FactoryOS gains:

- Clear architecture boundaries
- Predictable module responsibilities
- Easier testing
- Easier maintenance
- Lower coupling
- Better compatibility with AI-assisted development