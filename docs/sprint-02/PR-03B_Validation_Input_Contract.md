# PR-03B — Validation Input Contract

| Item | Value |
|------|-------|
| PR ID | PR-03B |
| Title | Validation Input Contract |
| Sprint | Sprint-02 |
| Priority | Critical |
| Status | Ready |
| Depends On | PR-03, PR-03A |
| Estimated Time | 20~30 minutes |

---

# 1. Objective

Bổ sung Validation Contract cho Project Input.

PR này phân tách rõ:

- Input Validation
- Entity Validation

Không thay đổi Business Logic.

Không thay đổi Validation Result Format.

Không thay đổi API cũ.

---

# 2. Background

ProjectService có workflow:

Validation

↓

Generate Project ID

↓

Create Folder

↓

Build Project Object

↓

Insert Database

Theo workflow này, tại thời điểm Validation:

- Project ID chưa được sinh
- Folder chưa được tạo
- createdAt chưa tồn tại
- updatedAt chưa tồn tại
- status chưa được khởi tạo

Do đó không thể sử dụng Entity Validation ngay từ bước đầu.

ValidationService cần phân biệt:

Input Validation

và

Entity Validation.

---

# 3. Scope

Chỉ sửa:

```
src/ValidationService.gs
```

Không sửa:

- ProjectService
- Repository
- IdService
- DriveService
- Config
- HTML

---

# 4. Validation Levels

ValidationService hỗ trợ hai cấp độ.

## Level 1

Input Validation

Dùng cho Form Input.

API:

```javascript
validateProjectInput(projectInput)
```

---

## Level 2

Entity Validation

Dùng cho Project Object hoàn chỉnh.

API:

```javascript
validateProject(project)
```

---

# 5. Input Validation Contract

validateProjectInput()

chỉ kiểm tra các field do người dùng nhập.

Required:

```
projectName

purpose
```

Optional:

```
priority

owner

nextAction

deadline
```

Không kiểm tra:

```
projectId

status

projectFolderId

projectFolderUrl

createdAt

updatedAt
```

vì các field này chưa tồn tại.

---

# 6. Entity Validation Contract

validateProject()

kiểm tra Project Object hoàn chỉnh.

Required:

```
projectId

projectName

purpose

status

projectFolderId

projectFolderUrl

createdAt

updatedAt
```

Optional:

```
priority

owner

nextAction

deadline
```

Entity Validation chỉ sử dụng sau khi Project Object đã được build hoàn chỉnh.

---

# 7. Workflow

ProjectService

↓

validateProjectInput()

↓

generateProjectId()

↓

createProjectFolder()

↓

Build Project Object

↓

(validateProject()) ← nếu cần

↓

Repository.insert()

---

# 8. Validation Result

Không thay đổi.

Success

```javascript
{
    valid: true,
    errors: []
}
```

Failure

```javascript
{
    valid: false,
    errors: [
        "...",
        "..."
    ]
}
```

Không throw Exception đối với Validation Failure.

---

# 9. Compatibility

Giữ nguyên:

```javascript
validateProject()

validateTask()

validateInbox()

validateKnowledge()
```

PR này chỉ bổ sung Validation Contract.

Không phá vỡ API cũ.

---

# 10. Constraints

Không được:

- thêm Spreadsheet
- thêm Drive
- thêm Business Logic
- sinh ID
- tạo Folder
- sửa Return Format

---

# 11. Coding Rules

ValidationService phải:

- Stateless
- Deterministic
- Reusable
- Side-effect free

Không truy cập:

SpreadsheetApp

DriveApp

HTML

---

# 12. Acceptance Criteria

PR được chấp nhận khi:

✓ validateProjectInput() chỉ kiểm tra Form Input.

✓ validateProject() chỉ kiểm tra Entity.

✓ Không thay đổi Validation Result.

✓ Không thay đổi API cũ.

✓ Không phá vỡ Backward Compatibility.

---

# 13. Review Checklist

Kiểm tra:

- Input Validation đúng phạm vi
- Entity Validation đúng phạm vi
- Không validate Project ID trước khi Generate ID
- Không validate Folder trước khi Create Folder
- Không thay đổi Return Format
- Không thêm Business Logic

---

# Definition of Done

FactoryOS có hai cấp Validation rõ ràng:

- Input Validation
- Entity Validation

ProjectService có thể validate dữ liệu đầu vào trước khi sinh Project ID mà không vi phạm Business Flow hoặc ADR.