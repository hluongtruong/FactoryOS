# PR-06 — ProjectRepository

| Item | Value |
|------|-------|
| PR ID | PR-06 |
| Title | Implement ProjectRepository |
| Sprint | Sprint-02 |
| Priority | Critical |
| Status | Ready |
| Depends On | PR-02, PR-03, PR-04 |
| Estimated Time | 4~6 hours |

---

# 1. Objective

Implement **ProjectRepository**, the centralized Data Access Layer responsible for all CRUD operations on the **PROJECT** sheet.

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

The Repository layer abstracts all Spreadsheet operations and isolates the application from the underlying database implementation.

Repository must never contain business logic.

---

# 3. Scope

Create:

```
src/

ProjectRepository.gs
```

This PR includes only:

- CRUD operations
- Search
- Spreadsheet access
- Object mapping

This PR does NOT include:

- Validation
- Workflow
- ID generation
- Drive operations
- UI

---

# 4. Responsibilities

ProjectRepository is responsible for:

- Reading Project records
- Creating Project records
- Updating Project records
- Deleting Project records (logical delete preferred)
- Searching Project records
- Returning normalized Project objects

ProjectRepository must NOT:

- Validate business rules
- Generate IDs
- Create Drive folders
- Copy templates
- Access HTML
- Format UI responses
- Execute business workflows

---

# 5. Data Source

Official Sheet

```
PROJECT
```

ProjectRepository shall access only the PROJECT sheet.

No other sheet may be accessed.

---

# 6. Database Contract

ProjectRepository shall comply with:

```
ADR-004_DatabaseSchema.md
```

The PROJECT schema is frozen.

Repository shall obtain:

- Sheet name from `CONFIG.SHEETS.PROJECT`
- Column names from `CONFIG.PROJECT_COLUMNS`

Repository must never:

- Hard-code sheet names
- Hard-code column names
- Rename sheets
- Rename columns
- Create columns
- Delete columns
- Change column order

---

# 7. Required Public API

Minimum required methods

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

Repository methods shall return the Project object defined by ADR-004.

```javascript
{
    projectId,
    projectName,
    purpose,
    priority,
    status,
    owner,
    nextAction,
    deadline,
    projectFolderId,
    projectFolderUrl,
    createdAt,
    updatedAt
}
```

Repository shall NOT introduce additional fields.

Examples NOT allowed:

```
description

startDate

endDate
```

The object structure must remain identical across all Repository methods.

---

# 9. Config Contract

ProjectRepository shall use the following configuration.

```javascript
CONFIG.SHEETS.PROJECT
```

```javascript
CONFIG.PROJECT_COLUMNS
```

Repository must never access Spreadsheet headers using literal strings.

All header resolution shall be performed through Config.

---

# 10. CRUD Responsibilities

## Create

Insert a new Project row.

Repository assumes:

- Project ID already exists.
- Validation already completed.

Repository simply writes data.

---

## Read

Support:

- Find all
- Find by ID
- Find by Name
- Find by Status
- Find by Owner
- Search

---

## Update

Update existing Project rows only.

Repository shall never create missing records.

---

## Delete

Logical delete is preferred.

Example

```
STATUS = DELETED
```

Physical deletion should be avoided unless explicitly required by a future ADR.

---

# 11. Search Rules

Search shall support:

- Partial matching
- Case-insensitive comparison where practical
- Multiple searchable fields

Minimum searchable fields:

- PROJECT_ID
- PROJECT_NAME
- PURPOSE
- OWNER

Business-specific search rules belong to ProjectService.

---

# 12. Spreadsheet Access

Spreadsheet access shall remain private to ProjectRepository.

ProjectRepository shall obtain:

- Sheet via `CONFIG.SHEETS.PROJECT`
- Header mapping via `CONFIG.PROJECT_COLUMNS`

Only ProjectRepository may use:

```javascript
SpreadsheetApp
```

Higher layers must never interact directly with Google Sheets.

---

# 13. Error Handling

Throw descriptive exceptions when:

- PROJECT sheet missing
- Invalid header mapping
- Duplicate Project ID
- Target Project not found
- Invalid Project object

Configuration errors

```
CFG001
```

Database errors

```
DB001
```

Silent failures are prohibited.

---

# 14. Logging

Log significant operations:

- Insert
- Update
- Delete
- Search
- Read failures

Do NOT log:

- Project Name
- Folder URL
- Sensitive business information

---

# 15. Coding Rules

ProjectRepository shall:

- Be stateless
- Contain no business logic
- Contain no validation
- Return deterministic objects
- Hide Spreadsheet implementation details
- Reuse helper methods whenever practical

---

# 16. Performance

Repository should:

- Minimize Spreadsheet API calls
- Cache header mapping during execution
- Avoid unnecessary full-sheet scans
- Keep implementation readable

Performance optimization must not reduce maintainability.

---

# 17. Dependencies

ProjectRepository may depend on:

- Config.gs
- Utility modules

ProjectRepository must NOT depend on:

- SettingsService
- ValidationService
- IdService
- DriveService
- ProjectService
- HTML

---

# 18. Constraints

This PR must NOT:

- Generate Project IDs
- Create Drive folders
- Copy Template folders
- Validate Projects
- Execute workflows
- Access TASK sheet
- Access SETTINGS sheet
- Modify Database schema

---

# 19. Acceptance Criteria

The PR is accepted when:

- ProjectRepository.gs exists.
- CRUD operations are implemented.
- Search operations function correctly.
- Only PROJECT sheet is accessed.
- No business logic exists.
- No validation exists.
- Returned objects follow ADR-004.
- Spreadsheet access is fully encapsulated.
- Error handling is complete.

---

# 20. Out of Scope

This PR does NOT include:

- ProjectService
- HTML
- Drive integration
- ID generation
- Workflow
- Integration tests

---

# 21. Review Checklist

Before approving verify:

- [ ] Repository accesses only PROJECT sheet.
- [ ] Sheet name comes from CONFIG.
- [ ] Header mapping comes from CONFIG.
- [ ] CRUD operations complete.
- [ ] Search implemented.
- [ ] No validation logic.
- [ ] No business logic.
- [ ] No ID generation.
- [ ] No Drive operations.
- [ ] Returned objects follow ADR-004.
- [ ] Spreadsheet access fully encapsulated.
- [ ] Error handling implemented.

---

# Definition of Done

This PR is complete when FactoryOS provides a centralized **ProjectRepository** that:

- encapsulates all PROJECT sheet access,
- fully complies with ADR-004 Database Schema,
- exposes a clean CRUD API,
- returns a consistent Project object,
- contains no business logic,
- and serves as the single data access layer for Project information.