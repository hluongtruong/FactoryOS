# PR-05A: DriveService Rollback API

## Sprint

Sprint-02

---

# Mục tiêu

Bổ sung API rollback cho DriveService để hỗ trợ ProjectService khi xảy ra lỗi trong quá trình tạo Project.

PR này **không thay đổi workflow hiện tại** của PR-05.

---

# Background

Trong PR-07, quy trình tạo Project như sau:

Validation

↓

Generate Project ID

↓

Create Project Folder

↓

Insert Database

Nếu Insert Database thất bại thì Project Folder đã được tạo.

Hệ thống cần rollback để tránh tạo thư mục rác.

DriveService hiện chưa có API hỗ trợ việc này.

---

# Phạm vi

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
- Database

---

# Public API

DriveService sau PR-05A gồm:

```javascript
createProjectFolder(projectId, projectName)

copyTemplate(...)

deleteProjectFolder(folderId)
```

Không thay đổi chữ ký (signature) của các API hiện có.

---

# API Specification

## deleteProjectFolder(folderId)

### Input

```javascript
folderId : string
```

---

### Output

```javascript
true
```

---

### Flow

Validate folderId

↓

Lấy Folder bằng DriveApp

↓

Kiểm tra Folder tồn tại

↓

Move Folder vào Trash

↓

Logger

↓

Return true

---

### Error

Nếu folderId không hợp lệ

↓

Throw

```
DRV001
```

Không return false.

Không swallow exception.

---

# Logging

Cho phép log:

- Rollback Success
- Rollback Failure

Không log:

- Folder URL
- Folder Content

---

# Rollback Rule

API này chỉ dùng cho rollback.

Không được dùng để xóa Project trong nghiệp vụ bình thường.

---

# Coding Rule

Không thay đổi:

- createProjectFolder()

Không thay đổi:

- copyTemplate()

Không sửa Config.

Không sửa Repository.

Không thêm Business Logic.

Không thêm Spreadsheet Logic.

---

# Error Code

Sử dụng:

```
DRV001
```

Không tạo Error Code mới.

---

# Quality

Code phải:

- deterministic
- reusable
- stateless
- helper private nếu cần
- không lặp code

---

# Hoàn thành

Sau khi hoàn thành:

- JavaScript syntax check
- git diff --check
- Không còn TODO

Báo cáo:

- File đã sửa
- API đã thêm
- Helper private (nếu có)
- Xác nhận không ảnh hưởng PR-05
- Xác nhận không ảnh hưởng PR-06