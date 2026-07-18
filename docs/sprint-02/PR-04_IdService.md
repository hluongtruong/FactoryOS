# PR-04 — IdService

| Item | Value |
|------|-------|
| PR ID | PR-04 |
| Title | Implement IdService |
| Sprint | Sprint-02 |
| Priority | Critical |
| Status | Ready |
| Depends On | PR-02 |
| Estimated Time | 2~4 hours |

---

# 1. Objective

Implement a centralized **IdService** responsible for generating all business identifiers used throughout FactoryOS.

No module other than IdService is allowed to generate IDs.

---

# 2. Background

FactoryOS uses human-readable business IDs instead of UUIDs.

Examples:

```
PRJ-2026-0001
TSK-000123
INB-000052
KNW-000021
```

ID generation must be:

- Unique
- Sequential
- Configurable
- Centralized
- Thread-safe (as much as GAS allows)

---

# 3. Scope

Create

```
src/

IdService.gs
```

No UI implementation.

No Repository implementation.

---

# 4. Responsibilities

IdService is responsible for:

- Generate Project IDs
- Generate Task IDs
- Generate Inbox IDs
- Generate Knowledge IDs
- Read numbering configuration
- Increment running numbers
- Update SETTINGS
- Return formatted IDs

IdService must NOT:

- Create business records
- Validate business rules
- Access HTML
- Display UI

---

# 5. ID Format

## Project

```
PRJ-YYYY-NNNN
```

Example

```
PRJ-2026-0001
PRJ-2026-0002
```

---

## Task

```
TSK-NNNNNN
```

Example

```
TSK-000001
```

---

## Inbox

```
INB-NNNNNN
```

---

## Knowledge

```
KNW-NNNNNN
```

---

# 6. Configuration Source

All numbering information shall be read from the **SETTINGS** sheet.

Required keys:

| KEY | Purpose |
|------|----------|
| PROJECT_PREFIX | Project prefix |
| PROJECT_CURRENT_YEAR | Current year |
| CURRENT_PROJECT_NO | Running project number |
| TASK_PREFIX | Task prefix |
| CURRENT_TASK_NO | Running task number |
| INBOX_PREFIX | Inbox prefix |
| CURRENT_INBOX_NO | Running inbox number |
| KNOWLEDGE_PREFIX | Knowledge prefix |
| CURRENT_KNOWLEDGE_NO | Running knowledge number |

No hardcoded prefixes are permitted.

---

# 7. Required Public API

Minimum public methods:

```javascript
nextProjectId()

nextTaskId()

nextInboxId()

nextKnowledgeId()

peekProjectId()

peekTaskId()

peekInboxId()

peekKnowledgeId()

formatId(prefix, number, digits)

resetYear(year)
```

Additional helper methods may be implemented.

---

# 8. Number Formatting

Numbers shall be zero-padded.

Examples

```
1

↓

0001
```

```
15

↓

0015
```

```
235

↓

0235
```

Digit width shall be configurable where appropriate.

---

# 9. Year Handling

Project IDs include the current project year.

Example

```
PRJ-2026-0001
```

The year shall be obtained from SETTINGS.

The service must not use hardcoded years.

---

# 10. Sequence Management

When a new ID is generated:

1. Read current sequence.
2. Increment sequence.
3. Persist updated value.
4. Return formatted ID.

The increment must occur only after a successful update to SETTINGS.

---

# 11. Duplicate Prevention

IdService must ensure sequential uniqueness.

Expected behavior:

- No duplicate IDs within the same sequence.
- No skipped numbers due to formatting logic.
- Sequence integrity maintained across executions.

Where practical, use `LockService` to reduce concurrent update risks.

---

# 12. Error Handling

Throw descriptive errors when:

- SETTINGS sheet is missing.
- Required configuration key is missing.
- Sequence value is invalid.
- Prefix is missing.
- Year is invalid.

Silent failures are prohibited.

---

# 13. Logging

Log important events such as:

- ID generated
- Sequence updated
- Configuration error
- Duplicate detection (if applicable)

Do not log sensitive business information.

---

# 14. Coding Rules

IdService shall:

- Use SettingsService for configuration access.
- Avoid direct business logic.
- Avoid UI operations.
- Keep methods deterministic.
- Be reusable across all modules.

---

# 15. Constraints

This PR must NOT:

- Create Projects
- Create Tasks
- Create Inbox items
- Create Knowledge records
- Access HTML
- Validate business rules
- Read or write business sheets directly

---

# 16. Acceptance Criteria

The PR is accepted when:

- IdService.gs exists.
- All required public methods are implemented.
- IDs are generated according to specification.
- Running numbers are persisted to SETTINGS.
- No hardcoded prefixes or years exist.
- Duplicate IDs are prevented as reasonably possible.

---

# 17. Out of Scope

Not included:

- ProjectRepository
- ProjectService
- ValidationService enhancements
- HTML UI
- Drive integration
- Integration tests

---

# 18. Review Checklist

Before approving verify:

- [ ] IdService is the only ID generator.
- [ ] SETTINGS is the only numbering source.
- [ ] Prefixes are configurable.
- [ ] IDs follow the required format.
- [ ] Running numbers are updated correctly.
- [ ] No hardcoded values exist.
- [ ] Error handling is implemented.
- [ ] Locking strategy is considered for concurrent execution.

---

# Definition of Done

This PR is complete when FactoryOS has a centralized IdService capable of generating unique, sequential, configurable business IDs for all modules using the SETTINGS sheet as the single source of truth.