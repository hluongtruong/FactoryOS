# PR-03 — ValidationService

| Item | Value |
|------|-------|
| PR ID | PR-03 |
| Title | Implement ValidationService |
| Sprint | Sprint-02 |
| Priority | High |
| Status | Ready |
| Depends On | PR-02 |
| Estimated Time | 2~3 hours |

---

# 1. Objective

Implement a centralized validation module for FactoryOS.

All input validation shall be handled by **ValidationService**.

Business Services must never perform direct validation.

---

# 2. Background

FactoryOS follows the architecture:

```
HTML

↓

Service

↓

ValidationService

↓

Repository

↓

Google Sheets
```

Validation is separated from business logic to improve:

- Maintainability
- Reusability
- Testability
- Consistency

---

# 3. Scope

Create

```
src/

ValidationService.gs
```

No UI implementation.

No Repository implementation.

No Project logic.

---

# 4. Responsibilities

ValidationService is responsible for validating:

- Required values
- Empty strings
- Maximum length
- Minimum length
- Number
- Integer
- Date
- Boolean
- Email
- URL
- Enum
- Duplicate values (when requested)
- Regular Expression
- ID format

ValidationService shall NOT:

- Read Google Sheets
- Create IDs
- Save data
- Execute business rules

---

# 5. Required Public API

Minimum public methods:

```javascript
isRequired(value)

isEmpty(value)

maxLength(value, length)

minLength(value, length)

isNumber(value)

isInteger(value)

isBoolean(value)

isDate(value)

isEmail(value)

isURL(value)

matches(value, regex)

isEnum(value, allowedValues)

validateProject(data)

validateTask(data)

validateInbox(data)

validateKnowledge(data)
```

Additional helper methods are allowed.

---

# 6. Validation Rules

Validation shall return predictable results.

Example:

```
Success

↓

{
    valid: true,
    errors: []
}
```

Failure

```
{
    valid:false,
    errors:[
        "...",
        "...",
        "..."
    ]
}
```

Do not throw exceptions for normal validation failures.

Exceptions should be reserved for unexpected system errors.

---

# 7. Required Validation Items

## Required

```
null

undefined

empty string

whitespace only
```

---

## String

Validate

- type
- minimum length
- maximum length

---

## Number

Validate

- numeric
- integer
- positive
- negative
- decimal

---

## Date

Accept only valid JavaScript Date values.

Reject invalid dates.

---

## Boolean

Accept

```
true

false
```

Reject

```
"true"

"false"

1

0
```

unless explicitly converted by higher layers.

---

## Enum

Example

```
OPEN

IN_PROGRESS

DONE

CLOSED
```

Only predefined values are accepted.

---

## Regular Expression

Support reusable regex validation.

Example

```
PROJECT_ID

TASK_ID

Email

Phone
```

---

# 8. Project Validation

ValidationService shall validate project objects.

Required fields

```
PROJECT_ID

PROJECT_NAME

STATUS
```

Optional fields

```
OWNER

DESCRIPTION

START_DATE

END_DATE
```

Business rules are outside the scope of this PR.

---

# 9. Error Messages

Validation errors should be human-readable.

Example

```
PROJECT_NAME is required.

STATUS is invalid.

Maximum length exceeded.

Invalid email format.
```

Messages should help identify the invalid field.

---

# 10. Reusability

Validation methods must be reusable by:

- ProjectService
- TaskService
- InboxService
- KnowledgeService
- Future modules

No duplicated validation code is allowed.

---

# 11. Coding Rules

ValidationService shall

- be stateless
- avoid side effects
- avoid Spreadsheet access
- avoid Drive access
- avoid HTML manipulation

---

# 12. Error Handling

Unexpected errors should throw descriptive exceptions.

Expected validation failures should return validation results.

Do not silently ignore invalid input.

---

# 13. Logging

Validation failures may be logged.

Sensitive user input must not be written to logs.

---

# 14. Unit Testing Considerations

ValidationService should be designed so every public method can be unit tested independently.

Methods should avoid hidden dependencies.

---

# 15. Constraints

This PR must NOT:

- Read Google Sheets
- Access Google Drive
- Generate IDs
- Create folders
- Save Projects
- Modify SETTINGS
- Implement UI

---

# 16. Acceptance Criteria

The PR is accepted when:

- ValidationService.gs exists.
- All required public methods are implemented.
- Validation results follow the specified format.
- Validation is reusable.
- No business logic exists.
- No Spreadsheet API is used.
- No Drive API is used.

---

# 17. Out of Scope

Not included:

- Repository
- ProjectService
- DriveService
- IdService
- HTML
- Integration
- Database validation

---

# 18. Review Checklist

Before approving verify:

- [ ] ValidationService is independent.
- [ ] No business logic exists.
- [ ] No Spreadsheet access.
- [ ] No Drive access.
- [ ] Validation result format is consistent.
- [ ] Public API matches specification.
- [ ] Error messages are meaningful.
- [ ] Methods are reusable.

---

# Definition of Done

This PR is complete when FactoryOS provides a centralized, reusable, and testable ValidationService that encapsulates all common input validation logic while remaining independent of business logic, repositories, Google Sheets, and the user interface.