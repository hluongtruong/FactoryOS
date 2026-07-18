# PR-03A — ValidationService API Alignment

| Item | Value |
|------|-------|
| PR ID | PR-03A |
| Title | ValidationService API Alignment |
| Sprint | Sprint-02 |
| Priority | High |
| Status | Ready |
| Depends On | PR-03 |

---

# 1. Objective

Add the public API required by ProjectService without changing existing behavior.

This PR is for API compatibility only.

---

# 2. Background

ADR-005 and PR-07 require:

ValidationService.validateProjectInput(projectInput)

Current implementation exposes:

validateProject(data)

To avoid breaking existing modules, both APIs shall be supported.

---

# 3. Scope

Modify only:

src/ValidationService.gs

No documentation changes.

No behavior changes.

---

# 4. Public API

Add:

validateProjectInput(projectInput)

Implementation:

validateProjectInput(projectInput)
    ↓
return validateProject(projectInput)

---

# 5. Compatibility

Keep:

validateProject()

unchanged.

Existing callers must continue to work.

---

# 6. Constraints

Do NOT:

- change validation logic
- change return format
- add Spreadsheet access
- add Drive access
- add business logic

---

# 7. Acceptance

- validateProjectInput() exists
- delegates to validateProject()
- backward compatibility preserved
- no behavior changes