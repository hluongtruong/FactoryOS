# PR-02A — Config Defaults Contract

| Item | Value |
|------|-------|
| PR ID | PR-02A |
| Title | Config Defaults Contract |
| Sprint | Sprint-02 |
| Priority | High |
| Status | Ready |
| Depends On | PR-02 |
| Estimated Time | 15~30 minutes |

---

# 1. Objective

Bổ sung **Config Contract** còn thiếu cho FactoryOS.

PR này chỉ bổ sung các giá trị mặc định (Default Configuration) phục vụ Business Layer.

Không thay đổi Database.

Không thay đổi Business Logic.

Không thay đổi workflow.

---

# 2. Background

Trong PR-07, ProjectService cần tạo Project Object.

Một số field không đến từ User Input.

Ví dụ:

```
status

createdAt

updatedAt
```

createdAt và updatedAt được tạo tại runtime.

Riêng status cần có nguồn cấu hình thống nhất.

Hiện tại PR-02 chưa định nghĩa Config Contract này.

Điều này làm ProjectService không thể khởi tạo Project Object theo đúng ADR.

---

# 3. Scope

Chỉ sửa:

```
src/Config.gs
```

Nếu Config đọc từ SETTINGS thì chỉ bổ sung Setting Contract.

Không sửa module khác.

---

# 4. Configuration Contract

Bổ sung Config mặc định.

Ví dụ:

```javascript
CONFIG.DEFAULTS = {

    PROJECT_STATUS: 'OPEN'

};
```

Hoặc tương đương.

Không hard-code trong Business Layer.

---

# 5. SETTINGS Contract

Nếu sử dụng SETTINGS.

Bổ sung:

| KEY | VALUE | DESCRIPTION |
|------|------|-------------|
| DEFAULT_PROJECT_STATUS | OPEN | Default status for new Project |

Không thay đổi các KEY hiện có.

---

# 6. Usage

ProjectService sẽ lấy:

```
status
```

từ:

```
CONFIG.DEFAULTS.PROJECT_STATUS
```

hoặc

```
SettingsService.getSetting(
'DEFAULT_PROJECT_STATUS'
)
```

Không được hard-code.

---

# 7. Constraints

Không được:

- sửa Database Schema
- sửa PROJECT Sheet
- sửa Repository
- sửa Validation
- sửa IdService
- sửa DriveService

Không thêm Business Logic.

---

# 8. Coding Rules

Config chỉ chứa:

- constant
- configuration
- default value

Không chứa:

- Spreadsheet
- Drive
- Business Logic

---

# 9. Acceptance Criteria

PR được chấp nhận khi:

✓ Có Config mặc định.

✓ ProjectService có thể lấy Default Status.

✓ Không Hard-code.

✓ Không thay đổi workflow.

✓ Không ảnh hưởng PR-02.

---

# 10. Out of Scope

Không bao gồm:

- UI
- Repository
- Validation
- Drive
- ID Generation
- ProjectService

---

# 11. Review Checklist

Kiểm tra:

- Default Status tồn tại
- Không Hard-code
- Không thêm Business Logic
- Không thay đổi Database
- Không ảnh hưởng PR cũ

---

# Definition of Done

FactoryOS có Config Contract hoàn chỉnh để Business Layer có thể khởi tạo Project Object mà không cần hard-code giá trị mặc định.