# PR-05B — DriveService Folder Return Contract

| Item | Value |
|------|-------|
| PR ID | PR-05B |
| Title | DriveService Folder Return Contract |
| Sprint | Sprint-02 |
| Priority | High |
| Status | Ready |
| Depends On | PR-05, PR-05A |
| Estimated Time | 15~30 minutes |

---

# 1. Objective

Mở rộng API `DriveService.createProjectFolder()` để trả về đầy đủ thông tin Folder cần thiết cho Business Layer.

PR này chỉ bổ sung API Contract.

Không thay đổi workflow.

Không thay đổi Rollback.

Không thay đổi Business Logic.

---

# 2. Background

ProjectService có workflow:

Validation

↓

Generate Project ID

↓

Create Project Folder

↓

Build Project Object

↓

Repository.insert()

Theo ADR-004, Project Object phải có:

```
projectFolderId

projectFolderUrl
```

Tuy nhiên, DriveService hiện chỉ trả về:

```javascript
folderId
```

ProjectService không được phép sử dụng DriveApp theo ADR-005.

Do đó ProjectService không thể tự lấy Folder URL.

DriveService phải trả về đầy đủ thông tin Folder.

---

# 3. Scope

Chỉ sửa:

```
src/DriveService.gs
```

Không sửa:

- Config.gs
- ValidationService.gs
- IdService.gs
- ProjectRepository.gs
- ProjectService.gs
- HTML

---

# 4. Public API

Sau PR-05B.

DriveService gồm:

```javascript
createProjectFolder(projectId, projectName)

copyTemplate(...)

deleteProjectFolder(folderId)
```

Không thay đổi tên API.

Không thay đổi tham số.

---

# 5. Return Contract

createProjectFolder()

trả về:

```javascript
{
    folderId: "...",
    folderUrl: "https://drive.google.com/..."
}
```

Trong đó:

folderId

là Google Drive Folder ID.

folderUrl

là URL chuẩn của Google Drive Folder.

Không trả về Folder Object.

Không trả về DriveApp Folder.

---

# 6. Workflow

createProjectFolder()

↓

Validate Input

↓

Create Folder

↓

Copy Template

↓

Rename Folder

↓

Lấy Folder URL

↓

Return

```javascript
{
    folderId,
    folderUrl
}
```

---

# 7. Usage

ProjectService:

```javascript
const folder = DriveService.createProjectFolder(
    projectId,
    projectName
);

const project = {

    projectFolderId:
        folder.folderId,

    projectFolderUrl:
        folder.folderUrl

};
```

ProjectService không được gọi:

```javascript
DriveApp.getFolderById()
```

---

# 8. Rollback

Rollback API:

```javascript
deleteProjectFolder(folderId)
```

Không thay đổi.

ProjectService rollback bằng:

```javascript
DriveService.deleteProjectFolder(
    folder.folderId
);
```

---

# 9. Compatibility

Backward Compatible.

Các module chỉ dùng folderId vẫn có thể đọc:

```javascript
result.folderId
```

Không thay đổi Workflow.

Không thay đổi Rollback.

---

# 10. Constraints

Không được:

- thay đổi Config
- thay đổi Repository
- thay đổi Validation
- thay đổi IdService
- thêm Spreadsheet
- thêm Business Logic

---

# 11. Coding Rules

DriveService phải:

- Stateless
- Deterministic
- Reusable

Không trả về:

Drive Folder Object

Không expose Drive API.

---

# 12. Acceptance Criteria

PR được chấp nhận khi:

✓ createProjectFolder() trả về Object.

✓ Object có:

- folderId
- folderUrl

✓ Không thay đổi API khác.

✓ Không ảnh hưởng Rollback.

✓ Không thêm Business Logic.

---

# 13. Review Checklist

Kiểm tra:

- folderId đúng
- folderUrl đúng
- Không trả Folder Object
- Không thay đổi deleteProjectFolder()
- Không thay đổi copyTemplate()
- Không thay đổi workflow

---

# Definition of Done

DriveService cung cấp đầy đủ thông tin Folder cho Business Layer.

ProjectService không cần sử dụng DriveApp để lấy Folder URL.

Toàn bộ Drive Access tiếp tục được đóng gói trong DriveService theo ADR-005.