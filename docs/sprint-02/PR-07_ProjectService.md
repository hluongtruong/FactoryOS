# PR-07 — ProjectService

| Item | Value |
|------|-------|
| PR ID | PR-07 |
| Title | Implement ProjectService |
| Sprint | Sprint-02 |
| Priority | Critical |
| Status | Ready |
| Depends On | PR-02, PR-03, PR-04, PR-05, PR-05A, PR-06 |
| Estimated Time | 6~8 hours |

---

# 1. Objective

Implement **ProjectService**, the Business Layer responsible for orchestrating all Project-related workflows.

ProjectService is the only layer that coordinates lower-level services while enforcing business rules.

ProjectService must not directly access SpreadsheetApp, DriveApp, or HTML.

---

# 2. Background

FactoryOS adopts a layered architecture.

```
UI

↓

ProjectService

├── ValidationService
├── IdService
├── DriveService
└── ProjectRepository
```

ProjectService contains business logic only.

---

# 3. Scope

Create

```
src/ProjectService.gs
```

Do not modify any existing Service or Repository.

---

# 4. Responsibilities

ProjectService is responsible for:

- Creating Projects
- Updating Projects
- Removing Projects
- Retrieving Project Information
- Searching Projects
- Coordinating lower-level services
- Executing business workflow

ProjectService must NOT:

- Access SpreadsheetApp
- Access DriveApp
- Access HTML
- Generate IDs manually
- Read or write Sheets directly

---

# 5. Dependencies

ProjectService shall use only:

- ValidationService
- IdService
- DriveService
- ProjectRepository

No other module may be called.

---

# 6. Project Creation Workflow

Standard workflow:

```
Receive Request

↓

ValidationService.validateProjectInput()

↓

IdService.generateProjectId()

↓

DriveService.createProjectFolder(projectId, projectName)

↓

Build Project Object

↓

ProjectRepository.insert(project)

↓

Return Result
```

Notes

- createProjectFolder() already copies the Template Folder.
- ProjectService must NOT call copyTemplate().

---

# 7. Rollback Workflow

If Repository.insert() fails after Folder creation:

```
DriveService.deleteProjectFolder(folderId)

↓

Throw Exception
```

Rules

- Do not rollback Project ID.
- Do not retry automatically.
- Do not silently ignore rollback failure.

---

# 8. Public API

```javascript
createProject(projectInput)

updateProject(project)

removeProject(projectId)

getProject(projectId)

searchProjects(keyword)

projectExists(projectId)

countProjects()
```

Use

```
removeProject()
```

instead of

```
deleteProject()
```

to avoid Google Apps Script global namespace conflicts.

---

# 9. Validation

Validation must be delegated.

Use only

```javascript
ValidationService.validateProjectInput(projectInput)
```

ProjectService must not validate fields manually.

---

# 10. Project Object

ProjectService builds the Project Object according to ADR-004.

```
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

No additional properties are allowed.

---

# 11. Repository Rules

ProjectService may call only:

```javascript
ProjectRepository.findById()

ProjectRepository.findByName()

ProjectRepository.search()

ProjectRepository.insert()

ProjectRepository.update()

ProjectRepository.deleteProject()

ProjectRepository.exists()

ProjectRepository.count()
```

ProjectService must never access SpreadsheetApp.

---

# 12. Drive Rules

ProjectService may call only:

```javascript
DriveService.createProjectFolder()

DriveService.deleteProjectFolder()
```

ProjectService must never use DriveApp directly.

---

# 13. Return Value

Every public method shall return

```javascript
{
    success: Boolean,
    message: String,
    data: Object
}
```

Failure example

```javascript
{
    success: false,
    message: "...",
    errors: [...]
}
```

---

# 14. Error Handling

Business errors include:

- Validation Error
- Duplicate Project
- Project Not Found
- Drive Failure
- Repository Failure

ProjectService shall never swallow exceptions.

---

# 15. Logging

Allowed

- Create Success
- Create Failure
- Update Success
- Remove Success
- Rollback Success
- Rollback Failure

Do NOT log

- Folder URL
- Project Content
- Sensitive Information

---

# 16. Coding Rules

ProjectService shall:

- contain business logic only
- be stateless
- be deterministic
- be reusable
- use private helper methods when appropriate

---

# 17. Constraints

Must NOT

- access SpreadsheetApp
- access DriveApp
- modify Config
- modify ValidationService
- modify DriveService
- modify IdService
- modify Repository
- hard-code configuration values

If documentation conflicts are found, implementation shall stop and report the conflict.

---

# 18. Acceptance Criteria

The PR is accepted when:

- ProjectService.gs exists.
- Project creation workflow is implemented.
- Rollback is implemented.
- Validation is delegated.
- ID generation is delegated.
- Folder creation is delegated.
- Repository persistence is delegated.
- No SpreadsheetApp access exists.
- No DriveApp access exists.
- Business logic is centralized.

---

# 19. Out of Scope

This PR does not include:

- HTML
- UI
- Notification
- Approval Workflow
- Task Management
- Knowledge Management

---

# 20. Review Checklist

Before approval verify:

- [ ] Validation delegated to ValidationService
- [ ] ID delegated to IdService
- [ ] Folder creation delegated to DriveService
- [ ] Rollback implemented
- [ ] Repository used for persistence only
- [ ] No SpreadsheetApp access
- [ ] No DriveApp access
- [ ] Business logic centralized
- [ ] Public API matches specification

---

# Definition of Done

FactoryOS provides a centralized ProjectService that orchestrates ValidationService, IdService, DriveService, and ProjectRepository, including rollback support, without directly accessing SpreadsheetApp, DriveApp, or the UI.