# PR-04A — IdService API Alignment

| Item | Value |
|------|-------|
| PR ID | PR-04A |
| Title | IdService API Alignment |
| Sprint | Sprint-02 |
| Priority | High |
| Status | Ready |
| Depends On | PR-04 |

---

# 1. Objective

Add the public API required by ProjectService.

No behavior changes.

---

# 2. Background

ADR-005 and PR-07 require:

IdService.generateProjectId()

Current implementation provides:

nextProjectId()

To preserve compatibility, both APIs shall coexist.

---

# 3. Scope

Modify only:

src/IdService.gs

---

# 4. Public API

Add:

generateProjectId()

Implementation:

generateProjectId()
    ↓
return nextProjectId()

---

# 5. Compatibility

Keep:

nextProjectId()

unchanged.

---

# 6. Constraints

Do NOT:

- modify numbering logic
- modify LockService
- modify SETTINGS
- change formatting
- change sequence management

---

# 7. Acceptance

- generateProjectId() exists
- delegates to nextProjectId()
- backward compatibility preserved
- no behavior changes
