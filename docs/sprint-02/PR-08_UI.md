# PR-08 — User Interface (HTML)

| Item | Value |
|------|-------|
| PR ID | PR-08 |
| Title | Implement Project User Interface |
| Sprint | Sprint-02 |
| Priority | High |
| Status | Ready |
| Depends On | PR-07 |
| Estimated Time | 6~10 hours |

---

# 1. Objective

Implement the user interface for Project Management.

This PR is responsible only for the presentation layer.

Business logic has already been implemented in ProjectService.

---

# 2. Background

FactoryOS follows the architecture:

```
Browser

↓

HTML

↓

google.script.run

↓

ProjectService

↓

Repository

↓

Google Sheets
```

The UI must never access Google Sheets directly.

---

# 3. Scope

Create or complete the following files.

```
html/

Index.html

ProjectForm.html

ProjectList.html

Common.html

Style.html

Script.html
```

src/

Code.gs (doGet only)

No business logic shall be implemented inside HTML.

---

# 4. Responsibilities

The UI is responsible for:

- Displaying project list
- Creating projects
- Editing projects
- Searching projects
- Viewing project details
- Displaying validation errors
- Showing loading indicators
- Showing success/error messages

The UI must NOT:

- Access SpreadsheetApp
- Access DriveApp
- Generate IDs
- Validate business rules
- Read SETTINGS

---

# 5. Required Screens

## Dashboard

Displays:

- Total Projects

---

## Project List

Columns:

```
Project ID

Project Name

Status

Owner

Deadline

Updated At

Actions
```

Functions:

- Search
- Filter
- Sort
- Open Detail
- Edit

---

## Project Detail

Display all project information.

Buttons:

- Edit
- Close
- Delete
- Back

---

## Project Form

Input fields:

```
Project Name

Owner

Purpose

Deadline
```

Project ID is generated automatically. Status is assigned by ProjectService using CONFIG.DEFAULTS.PROJECT_STATUS.

---

# 6. UI Workflow

Create Project

```
Open Form

↓

Input Data

↓

Client Validation

↓

google.script.run

↓

ProjectService

↓

Display Result
```

---

# 7. Communication Rules

All backend communication shall use

```javascript
google.script.run
```

Example

```javascript
google.script.run
    .withSuccessHandler(...)
    .withFailureHandler(...)
    .createProject(data);
```

No Spreadsheet APIs are allowed inside HTML.

---

# 8. Client-side Validation

Only lightweight validation.

Examples:

- Required field
- Empty string
- Maximum length
- Date format

Business validation belongs to ValidationService.

---

# 9. Loading State

Long-running operations shall display loading feedback.

Example:

```
Saving...

Loading...

Searching...
```

Buttons should be temporarily disabled while requests are executing.

---

# 10. Error Handling

Display friendly messages.

Example

```
Project Name is required.

Project saved successfully.

Unable to save project.

Connection failed.
```

Do not expose stack traces to users.

---

# 11. UI Components

Reusable components:

- Header
- Navigation
- Search Box
- Modal Dialog
- Toast Message
- Loading Spinner
- Confirm Dialog

Avoid duplicated HTML.

---

# 12. Styling Rules

Use:

- Consistent spacing
- Responsive layout
- Readable typography
- Simple color palette

Avoid inline CSS whenever possible.

Shared styles belong in:

```
Style.html
```

---

# 13. JavaScript Rules

Shared JavaScript belongs in:

```
Script.html
```

JavaScript should:

- Be modular
- Avoid global variables
- Separate UI logic from rendering
- Keep functions small

---

# 14. Accessibility

The UI should support:

- Keyboard navigation
- Label-associated inputs
- Clear focus indicators
- Readable contrast
- Responsive resizing

---

# 15. Constraints

This PR must NOT:

- Access SpreadsheetApp
- Access DriveApp
- Generate IDs
- Validate business rules
- Implement Repository logic
- Implement Service logic

---

# 16. Acceptance Criteria

The PR is accepted when:

- Required HTML files exist.
- Project list displays correctly.
- Project form functions correctly.
- UI communicates only through ProjectService.
- Loading indicators work.
- Error messages are user-friendly.
- Shared CSS and JavaScript are reusable.
- No business logic exists in HTML.

---

# 17. Out of Scope

This PR does not include:

- Dashboard analytics
- Authentication
- User permissions
- Task UI
- Knowledge UI
- Mobile application
- Integration testing

---

# 18. Review Checklist

Before approving verify:

- [ ] HTML contains no business logic.
- [ ] Communication uses `google.script.run`.
- [ ] No SpreadsheetApp usage.
- [ ] No DriveApp usage.
- [ ] Loading indicator implemented.
- [ ] Error handling implemented.
- [ ] Shared CSS extracted.
- [ ] Shared JavaScript extracted.
- [ ] Responsive layout verified.
- [ ] UI follows FactoryOS design standards.

---

# Definition of Done

This PR is complete when FactoryOS provides a clean, responsive, and maintainable Project Management UI that interacts exclusively with ProjectService through `google.script.run`, with all business logic remaining on the server side.