# PR-09 — System Integration

| Item | Value |
|------|-------|
| PR ID | PR-09 |
| Title | Integrate Project Module |
| Sprint | Sprint-02 |
| Priority | Critical |
| Status | Ready |
| Depends On | PR-02 ~ PR-08 |
| Estimated Time | 4~6 hours |

---

# 1. Objective

Integrate all Project-related modules into a complete end-to-end workflow.

This PR verifies that every architectural layer works together correctly.

No new business features shall be introduced.

---

# 2. Background

After PR-02 through PR-08, all individual modules have been implemented independently.

This PR connects them into a single application flow.

Architecture:

```
Browser

↓

HTML UI

↓

google.script.run

↓

ProjectService

├── ValidationService
├── IdService
├── DriveService
├── ProjectRepository
└── SettingsService

↓

Google Sheets

↓

Google Drive
```

---

# 3. Scope

Integration only.

No redesign.

No refactoring unless required to resolve integration issues.

---

# 4. Modules Included

The following modules must be integrated:

- Config
- SettingsService
- ValidationService
- IdService
- DriveService
- ProjectRepository
- ProjectService
- HTML UI

---

# 5. End-to-End Workflow

## Create Project

```
User

↓

Project Form

↓

Client Validation

↓

ProjectService

↓

ValidationService

↓

IdService

↓

DriveService

↓

ProjectRepository

↓

PROJECT Sheet

↓

Success Response

↓

UI Refresh
```

---

## Update Project

```
Project Form

↓

ProjectService

↓

ValidationService

↓

ProjectRepository

↓

PROJECT Sheet

↓

UI Refresh
```

---

## Search Project

```
Search Box

↓

ProjectService

↓

ProjectRepository

↓

PROJECT Sheet

↓

Result List
```

---

## Delete Project

```
User Confirmation

↓

ProjectService

↓

ProjectRepository

↓

Logical Delete

↓

UI Refresh
```

---

# 6. Integration Rules

The following dependency order shall be respected.

```
HTML

↓

ProjectService

↓

ValidationService

↓

IdService

↓

DriveService

↓

ProjectRepository

↓

Google Sheets
```

Modules must not bypass lower layers.

---

# 7. Communication Rules

Frontend

↓

```
google.script.run
```

Backend

↓

Service Layer

↓

Repository Layer

↓

Spreadsheet

Direct communication between HTML and Spreadsheet is prohibited.

---

# 8. Error Flow

When an error occurs:

```
Exception

↓

ProjectService

↓

Failure Response

↓

UI Error Message
```

Stack traces must never be displayed to end users.

---

# 9. Logging Flow

Log major integration events.

Examples

- Project created
- Project updated
- Folder created
- Validation failed
- Repository error
- Integration error

Sensitive information must not be logged.

---

# 10. Configuration Verification

Verify:

- SETTINGS sheet exists.
- Required keys exist.
- Root Folder ID is valid.
- Template Folder ID is valid.
- Prefixes are configured.
- Running numbers are valid.

Application startup should fail with descriptive errors if configuration is incomplete.

---

# 11. Data Consistency

Verify:

- Every project has one Project ID.
- Every project has one Drive folder.
- Folder name matches Project ID.
- PROJECT sheet contains matching data.
- No duplicate Project IDs.

---

# 12. Failure Recovery

If folder creation fails:

- Do not save project.

If repository insertion fails:

- Report the failure.
- Avoid leaving inconsistent application state.
- Document any manual recovery procedure if rollback is not possible.

---

# 13. Integration Checklist

Verify:

- Project creation
- Project update
- Project search
- Project detail
- Project deletion
- Folder creation
- ID generation
- Validation
- Configuration loading
- Error handling

Every item must pass before release.

---

# 14. Performance Verification

Confirm:

- No unnecessary Spreadsheet reads.
- No repeated SETTINGS lookups.
- No duplicated Drive calls.
- UI remains responsive.
- Search performance is acceptable.

---

# 15. Constraints

This PR must NOT:

- Change database schema
- Rename sheets
- Modify ADR
- Introduce new features
- Change public APIs
- Add business rules unrelated to integration

---

# 16. Acceptance Criteria

The PR is accepted when:

- All modules work together.
- Project can be created successfully.
- Project can be updated.
- Project can be searched.
- Project can be deleted logically.
- Drive folder is created correctly.
- IDs are unique.
- Validation works.
- Error handling works.
- No architectural violations exist.

---

# 17. Out of Scope

This PR does not include:

- Task Module
- Inbox Module
- Knowledge Module
- Authentication
- Authorization
- Email notification
- Dashboard analytics
- Mobile UI

These features belong to future sprints.

---

# 18. Review Checklist

Before approving verify:

- [ ] End-to-end project creation works.
- [ ] End-to-end project update works.
- [ ] End-to-end search works.
- [ ] End-to-end delete works.
- [ ] ValidationService is invoked correctly.
- [ ] IdService generates unique IDs.
- [ ] DriveService creates folders correctly.
- [ ] ProjectRepository persists data correctly.
- [ ] SettingsService provides configuration.
- [ ] UI communicates only through `google.script.run`.
- [ ] No direct Spreadsheet access from HTML.
- [ ] No direct Drive access outside DriveService.
- [ ] No hardcoded configuration values remain.
- [ ] Logging and error handling are verified.

---

# Definition of Done

This PR is complete when all Project module components operate together as a single, stable workflow, fully complying with the FactoryOS layered architecture and enabling users to create, manage, search, and maintain projects through the UI without architectural violations.