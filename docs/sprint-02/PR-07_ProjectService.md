# PR-07 — ProjectService

| Item | Value |
|------|-------|
| PR ID | PR-07 |
| Title | Implement ProjectService |
| Sprint | Sprint-02 |
| Priority | Critical |
| Status | Ready |
| Depends On | PR-02, PR-03, PR-04, PR-05, PR-06 |
| Estimated Time | 6~8 hours |

---

# 1. Objective

Implement **ProjectService**, the Business Layer responsible for all Project-related workflows.

ProjectService orchestrates all lower-level services while ensuring business rules are applied consistently.

ProjectService is the **only module** that coordinates the complete Project creation process.

---

# 2. Background

FactoryOS adopts a layered architecture.

```
HTML

↓

ProjectService

├── ValidationService
├── IdService
├── DriveService
├── ProjectRepository
└── SettingsService
```

ProjectService contains business logic only.

---

# 3. Scope

Create

```
src/

ProjectService.gs
```

No HTML implementation.

No Spreadsheet implementation.

No Google Drive implementation.

---

# 4. Responsibilities

ProjectService is responsible for:

- Creating projects
- Updating projects
- Closing projects
- Deleting projects
- Searching projects
- Retrieving project details
- Coordinating services
- Managing project workflow

ProjectService must NOT:

- Access Spreadsheet directly
- Access DriveApp directly
- Generate IDs manually
- Validate fields directly

---

# 5. Dependencies

ProjectService shall use:

- ValidationService
- IdService
- DriveService
- ProjectRepository
- SettingsService

ProjectService must never bypass these services.

---

# 6. Project Creation Workflow

Standard workflow:

```
Receive Request

↓

Validate Input

↓

Generate Project ID

↓

Create Project Folder

↓

Prepare Project Object

↓

Save to Repository

↓

Return Result
```

The workflow order shall remain unchanged.

---

# 7. Required Public API

Minimum public methods:

```javascript
createProject(projectData)

updateProject(projectId, projectData)

deleteProject(projectId)

closeProject(projectId)

reopenProject(projectId)

getProject(projectId)

getProjects()

searchProjects(keyword)

getProjectsByStatus(status)

getProjectsByOwner(owner)
```

Additional helper methods are permitted.

---

# 8. Business Rules

Project creation shall:

- Validate required fields.
- Generate a unique Project ID.
- Create a dedicated Drive folder.
- Persist project data.
- Return the created Project.

If any step fails, the operation must terminate with an error.

---

# 9. Transaction Flow

The sequence shall be:

```
Validation

↓

ID Generation

↓

Drive Folder Creation

↓

Repository Insert

↓

Success
```

Repository insertion must occur only after successful validation and folder creation.

---

# 10. Update Workflow

Updating a project shall:

- Validate incoming data.
- Confirm project exists.
- Update allowed fields only.
- Preserve Project ID.
- Preserve creation timestamp.

---

# 11. Delete Workflow

Preferred behavior:

Logical deletion.

Example:

```
STATUS = DELETED
```

Physical deletion is outside the scope of this PR.

---

# 12. Close Workflow

Closing a project shall:

- Verify project exists.
- Verify current status allows closing.
- Update project status.
- Record updated timestamp.

No Drive folders are deleted.

---

# 13. Search Workflow

ProjectService delegates searching to ProjectRepository.

Supported searches:

- Project ID
- Project Name
- Owner
- Status
- Keyword

Business filtering may be applied after repository retrieval if required.

---

# 14. Return Object

Every public method shall return a consistent result.

Example:

```javascript
{
    success: true,
    message: "Project created successfully.",
    data: {
        projectId: "...",
        projectName: "...",
        ...
    }
}
```

Failure example:

```javascript
{
    success: false,
    message: "Validation failed.",
    errors: [...]
}
```

---

# 15. Error Handling

ProjectService shall throw descriptive business exceptions for:

- Validation failure
- Duplicate project
- Project not found
- Drive creation failure
- Repository failure
- Invalid status transition

Unexpected system errors shall not be silently ignored.

---

# 16. Logging

Log major business events:

- Project created
- Project updated
- Project closed
- Project deleted
- Validation failure
- Repository failure
- Drive failure

Sensitive information must not be logged.

---

# 17. Coding Rules

ProjectService shall:

- Contain business logic only.
- Never manipulate Spreadsheet APIs.
- Never manipulate DriveApp APIs.
- Never contain HTML logic.
- Be deterministic and reusable.

---

# 18. Constraints

This PR must NOT:

- Access SpreadsheetApp directly.
- Access DriveApp directly.
- Implement HTML.
- Implement Repository logic.
- Implement Validation logic.
- Generate IDs manually.
- Hardcode configuration values.

---

# 19. Acceptance Criteria

The PR is accepted when:

- ProjectService.gs exists.
- Project creation workflow is implemented.
- Update workflow is implemented.
- Delete workflow is implemented.
- Search workflow is implemented.
- All dependencies are invoked correctly.
- No direct Spreadsheet access exists.
- No direct Drive access exists.
- Business logic is centralized.

---

# 20. Out of Scope

This PR does not include:

- HTML pages
- UI interaction
- Integration testing
- Notification system
- Approval workflow
- Task management
- Knowledge management

---

# 21. Review Checklist

Before approving verify:

- [ ] ProjectService orchestrates all lower-level services.
- [ ] Validation is delegated to ValidationService.
- [ ] IDs are generated only through IdService.
- [ ] Drive folders are created only through DriveService.
- [ ] Data persistence occurs only through ProjectRepository.
- [ ] No SpreadsheetApp calls exist.
- [ ] No DriveApp calls exist.
- [ ] Error handling is implemented.
- [ ] Logging is appropriate.
- [ ] Public API matches the specification.

---

# Definition of Done

This PR is complete when FactoryOS provides a centralized **ProjectService** that orchestrates project-related business workflows using ValidationService, IdService, DriveService, and ProjectRepository, without directly accessing Google Sheets, Google Drive, or the user interface.