# PR-06 — ProjectRepository

| Item | Value |
|------|-------|
| PR ID | PR-06 |
| Title | Implement ProjectRepository |
| Sprint | Sprint-02 |
| Priority | Critical |
| Status | Ready |
| Depends On | PR-02, PR-03 |
| Estimated Time | 4~6 hours |

---

# 1. Objective

Implement **ProjectRepository**, the data access layer responsible for all CRUD operations on the **PROJECT** sheet.

ProjectRepository is the **only module** allowed to access the PROJECT sheet directly.

---

# 2. Background

FactoryOS adopts a layered architecture.

```
HTML

↓

ProjectService

↓

ProjectRepository

↓

Google Sheets
```

The Repository layer abstracts all Spreadsheet operations and isolates the application from the database implementation.

---

# 3. Scope

Create:

```
src/

ProjectRepository.gs
```

No UI implementation.

No business logic.

No validation.

---

# 4. Responsibilities

ProjectRepository is responsible for:

- Reading project records
- Writing project records
- Updating project records
- Deleting project records (logical delete preferred)
- Searching project records
- Returning project objects

ProjectRepository must NOT:

- Validate business rules
- Generate IDs
- Create Drive folders
- Access HTML
- Format UI responses

---

# 5. Data Source

Official Sheet

```
PROJECT
```

No other sheet shall be accessed.

---

# 6. Database Contract

The repository must assume the PROJECT sheet follows the frozen schema defined in:

```
ADR-003_Database_Frozen.md
```

The repository must never:

- Rename columns
- Create columns
- Delete columns
- Change column order

---

# 7. Required Public API

Minimum required methods:

```javascript
findAll()

findById(projectId)

findByName(projectName)

findByStatus(status)

findByOwner(owner)

search(keyword)

insert(project)

update(project)

delete(projectId)

exists(projectId)

count()
```

Additional helper methods may be implemented.

---

# 8. Data Model

Repository methods shall return a normalized Project object.

Example:

```javascript
{
    projectId,
    projectName,
    status,
    owner,
    description,
    startDate,
    endDate,
    createdAt,
    updatedAt
}
```

The object structure shall remain consistent across all methods.

---

# 9. CRUD Responsibilities

## Create

Insert a new row into PROJECT.

Repository assumes:

- Project ID already exists.
- Validation already completed.

---

## Read

Support:

- Find all
- Find by ID
- Find by status
- Find by owner
- Search

---

## Update

Update existing rows only.

Repository shall not create missing records.

---

## Delete

Preferred implementation:

Logical delete.

Example:

```
STATUS = DELETED
```

Physical deletion should be avoided unless explicitly required.

---

# 10. Search Rules

Search should support:

- Partial match
- Case-insensitive comparison where practical
- Multiple searchable fields

Typical searchable fields:

- Project ID
- Project Name
- Owner
- Description

---

# 11. Spreadsheet Access

Spreadsheet access shall remain private to the repository.

Only ProjectRepository may use:

```javascript
SpreadsheetApp
```

Higher layers must never interact with Sheets directly.

---

# 12. Error Handling

Throw descriptive exceptions when:

- PROJECT sheet missing
- Invalid column mapping
- Duplicate Project ID
- Update target not found
- Invalid data structure

Silent failures are prohibited.

---

# 13. Logging

Log significant operations:

- Insert
- Update
- Delete
- Search
- Read failures

Sensitive project information must not be logged.

---

# 14. Coding Rules

ProjectRepository shall:

- Be stateless
- Avoid business logic
- Avoid validation
- Return predictable objects
- Hide Spreadsheet implementation details

---

# 15. Performance

Repository should:

- Minimize Spreadsheet calls
- Avoid unnecessary full-sheet scans
- Reuse header mappings during execution
- Keep operations efficient for future scaling

Performance optimization must not compromise readability.

---

# 16. Constraints

This PR must NOT:

- Generate Project IDs
- Create Drive folders
- Validate projects
- Call HTML
- Access TASK sheet
- Access SETTINGS directly
- Implement business workflows

---

# 17. Dependencies

ProjectRepository may depend on:

- Config.gs
- SettingsService (if required for sheet configuration)
- Utility modules

ProjectRepository must not depend on:

- ProjectService
- ValidationService
- DriveService
- HTML

---

# 18. Acceptance Criteria

The PR is accepted when:

- ProjectRepository.gs exists.
- CRUD operations are implemented.
- Search operations function correctly.
- Only the PROJECT sheet is accessed.
- Repository contains no business logic.
- Returned objects follow the standard model.
- Error handling is complete.

---

# 19. Out of Scope

This PR does not include:

- ProjectService
- HTML pages
- Drive integration
- ID generation
- Workflow management
- Integration testing

---

# 20. Review Checklist

Before approving verify:

- [ ] Repository accesses only the PROJECT sheet.
- [ ] CRUD operations are complete.
- [ ] No validation logic exists.
- [ ] No business rules exist.
- [ ] No ID generation exists.
- [ ] Returned object format is consistent.
- [ ] Spreadsheet access is encapsulated.
- [ ] Error handling is implemented.
- [ ] Logging is appropriate.

---

# Definition of Done

This PR is complete when FactoryOS provides a centralized `ProjectRepository` that fully encapsulates all PROJECT sheet data access, exposes a clean CRUD API, returns consistent domain objects, and contains no business logic or user interface code.