# PR-05 — DriveService

| Item | Value |
|------|-------|
| PR ID | PR-05 |
| Title | Implement Google Drive Service |
| Sprint | Sprint-02 |
| Priority | High |
| Status | Ready |
| Depends On | PR-02 |
| Estimated Time | 3~5 hours |

---

# 1. Objective

Implement a centralized **DriveService** responsible for all interactions with Google Drive.

All file and folder operations within FactoryOS must be performed exclusively through DriveService.

No other module may directly invoke `DriveApp`.

---

# 2. Background

FactoryOS stores project-related documents in Google Drive.

To ensure maintainability, consistency, and future extensibility, all Google Drive operations must be encapsulated within a dedicated service.

DriveService serves as the single abstraction layer between the application and Google Drive.

---

# 3. Scope

Create:

```
src/

DriveService.gs
```

No UI implementation.

No Repository implementation.

No business logic.

---

# 4. Responsibilities

DriveService is responsible for:

- Creating folders
- Locating folders
- Creating files
- Copying templates
- Moving files
- Renaming files
- Deleting files (soft delete preferred)
- Retrieving file metadata
- Retrieving folder metadata

DriveService must NOT:

- Generate IDs
- Validate business rules
- Create business records
- Update Google Sheets directly
- Implement UI

---

# 5. Configuration Source

DriveService shall obtain configuration values exclusively through `SettingsService`.

Required configuration keys:

| KEY | Description |
|------|-------------|
| DRIVE_ROOT_FOLDER_ID | Root folder of FactoryOS |
| TEMPLATE_FOLDER_ID | Folder containing templates |

Folder IDs must never be hardcoded.

---

# 6. Folder Structure

FactoryOS stores project documents using the following structure:

```
FactoryOS/

Projects/

PRJ-2026-0001/

Documents/

Images/

Reports/

PRJ-2026-0002/

Knowledge/

Templates/
```

The exact hierarchy may evolve, but all folders must originate from the configured root folder.

---

# 7. Required Public API

Minimum public methods:

```javascript
getRootFolder()

getFolder(folderId)

createFolder(parentFolderId, folderName)

findFolder(parentFolderId, folderName)

createProjectFolder(projectId)

copyTemplate(templateId, destinationFolderId)

createFile(folderId, fileName, content)

moveFile(fileId, destinationFolderId)

renameFile(fileId, newName)

deleteFile(fileId)

getFile(fileId)

getFolderInfo(folderId)

fileExists(fileId)

folderExists(folderId)
```

Additional helper methods are permitted.

---

# 8. Folder Naming Rules

Folder names shall follow business identifiers.

Example:

```
PRJ-2026-0001

PRJ-2026-0002

PRJ-2026-0003
```

Folder names must be deterministic and unique.

---

# 9. Template Handling

DriveService shall support template-based document creation.

Typical workflow:

```
Template

↓

Copy

↓

Rename

↓

Move

↓

Return File ID
```

Templates must be stored under the configured template folder.

---

# 10. File Operations

Supported operations:

- Create
- Copy
- Rename
- Move
- Retrieve metadata
- Delete

File content generation is outside the scope of this PR.

---

# 11. Error Handling

Throw descriptive exceptions when:

- Root folder is missing
- Destination folder does not exist
- File cannot be found
- Permission denied
- Template missing
- Invalid file ID
- Invalid folder ID

Silent failures are prohibited.

---

# 12. Logging

Log significant Drive operations:

- Folder created
- File created
- File copied
- File moved
- File renamed
- File deleted
- Drive errors

Do not log sensitive document contents.

---

# 13. Coding Rules

DriveService shall:

- Be stateless where practical
- Use SettingsService for configuration
- Encapsulate all DriveApp access
- Return consistent objects
- Avoid business-specific decisions

---

# 14. Security

DriveService shall:

- Respect Google Drive permissions
- Avoid exposing internal IDs unnecessarily
- Validate folder existence before writing
- Prevent writing outside the configured root folder

---

# 15. Constraints

This PR must NOT:

- Access PROJECT sheet
- Access TASK sheet
- Generate IDs
- Create Projects
- Validate business rules
- Implement HTML
- Implement Repository logic

---

# 16. Acceptance Criteria

The PR is accepted when:

- DriveService.gs exists.
- All required public methods are implemented.
- Folder creation works.
- Template copying works.
- File operations are encapsulated.
- No hardcoded folder IDs exist.
- Configuration is loaded via SettingsService.
- Error handling is implemented.

---

# 17. Out of Scope

This PR does not include:

- ProjectRepository
- ProjectService
- ValidationService
- IdService enhancements
- HTML UI
- Integration tests
- Google Docs document generation

---

# 18. Review Checklist

Before approving verify:

- [ ] DriveService is the only module accessing DriveApp.
- [ ] Root folder is loaded from SETTINGS.
- [ ] Template folder is configurable.
- [ ] Folder creation follows naming rules.
- [ ] File operations are reusable.
- [ ] Error handling is complete.
- [ ] No business logic exists.
- [ ] No hardcoded Drive IDs remain.

---

# Definition of Done

This PR is complete when FactoryOS provides a centralized, reusable DriveService that encapsulates all Google Drive operations, uses SettingsService for configuration, and enables future business modules to manage project documents without directly interacting with the Google Drive API.
