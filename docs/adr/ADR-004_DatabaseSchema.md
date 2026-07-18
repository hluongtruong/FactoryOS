# ADR-004 — Database Schema Frozen

| Item | Value |
|------|-------|
| ADR ID | ADR-004 |
| Title | Database Schema Frozen |
| Status | Accepted |
| Date | 2026-07-19 |
| Owner | FactoryOS Architecture |
| Supersedes | None |

---

# 1. Context

FactoryOS sử dụng Google Spreadsheet làm Database.

Để đảm bảo:

- Repository có thể hoạt động ổn định.
- Không hard-code tên Sheet hoặc Header.
- Các Service không phụ thuộc trực tiếp vào Spreadsheet.
- Codex có thể triển khai chính xác.

Toàn bộ Database Schema được **đóng băng (Frozen)**.

Sau ADR này:

- Không được tự ý đổi tên Sheet.
- Không được đổi Header.
- Không được thay đổi Data Model nếu chưa có ADR mới.

---

# 2. Decision

Database Schema được xem là Contract chính thức giữa:

```
Spreadsheet
        │
ProjectRepository
        │
ProjectService
```

Repository chỉ được phép thao tác dựa trên Schema này.

---

# 3. Sheet Definitions

## SETTINGS

Purpose

Lưu toàn bộ cấu hình hệ thống.

Primary Key

```
KEY
```

Columns

| Column | Type |
|---------|------|
| KEY | String |
| VALUE | String |
| DESCRIPTION | String |

---

## PROJECT

Purpose

Lưu thông tin Project.

Primary Key

```
PROJECT_ID
```

Columns

| Column | Type | Required |
|---------|------|----------|
| PROJECT_ID | String | Yes |
| PROJECT_NAME | String | Yes |
| PURPOSE | String | No |
| PRIORITY | String | Yes |
| STATUS | String | Yes |
| OWNER | String | No |
| NEXT_ACTION | String | No |
| DEADLINE | Date | No |
| PROJECT_FOLDER_ID | String | No |
| PROJECT_FOLDER_URL | String | No |
| CREATED_AT | DateTime | Yes |
| UPDATED_AT | DateTime | Yes |

---

# 4. Data Model

Project Object

```javascript
{
    projectId,
    projectName,
    purpose,
    priority,
    status,
    owner,
    nextAction,
    deadline,
    projectFolderId,
    projectFolderUrl,
    createdAt,
    updatedAt
}
```

Repository phải sử dụng đúng Object này.

Không được tự thêm field.

Ví dụ KHÔNG được:

```
description

startDate

endDate
```

trừ khi Database được thay đổi bằng ADR mới.

---

# 5. Config Contract

Config.gs phải khai báo tối thiểu:

```javascript
CONFIG.SHEETS = {
    SETTINGS: 'SETTINGS',
    PROJECT: 'PROJECT'
};
```

---

Project Header

```javascript
CONFIG.PROJECT_COLUMNS = {

    PROJECT_ID: 'PROJECT_ID',

    PROJECT_NAME: 'PROJECT_NAME',

    PURPOSE: 'PURPOSE',

    PRIORITY: 'PRIORITY',

    STATUS: 'STATUS',

    OWNER: 'OWNER',

    NEXT_ACTION: 'NEXT_ACTION',

    DEADLINE: 'DEADLINE',

    PROJECT_FOLDER_ID: 'PROJECT_FOLDER_ID',

    PROJECT_FOLDER_URL: 'PROJECT_FOLDER_URL',

    CREATED_AT: 'CREATED_AT',

    UPDATED_AT: 'UPDATED_AT'
};
```

Repository không được hard-code Header.

---

# 6. Repository Rules

Repository:

✓ Chỉ đọc/ghi Spreadsheet.

✓ Chỉ sử dụng Config.

✓ Không sinh ID.

✓ Không tạo Folder.

✓ Không Validation nghiệp vụ.

✓ Không Workflow.

Repository chỉ là Data Access Layer.

---

# 7. Spreadsheet Rules

Không được:

- Đổi tên Sheet.
- Đổi Header.
- Đổi thứ tự Header mà không cập nhật Config.
- Thêm Header không có ADR.

Nếu cần thay đổi Schema:

1. Tạo ADR mới.
2. Cập nhật Config.
3. Cập nhật Repository.
4. Thực hiện Migration nếu cần.

---

# 8. Versioning

Current Version

```
Schema Version

1.0
```

---

# 9. Future Expansion

Các Sheet sau sẽ tuân theo nguyên tắc tương tự:

```
TASK

INBOX

KNOWLEDGE

MASTER

LOG
```

Mỗi Sheet phải có:

- Primary Key
- Header cố định
- Mapping Object
- Config Contract

---

# 10. Compliance

Tất cả Repository phải tuân thủ ADR này.

Bao gồm:

- ProjectRepository
- TaskRepository
- InboxRepository
- KnowledgeRepository

Không Repository nào được phép tự định nghĩa Database Schema.

---

# 11. Consequences

Ưu điểm

- Database có Contract rõ ràng.
- Không hard-code.
- Dễ review.
- Dễ bảo trì.
- Codex có thể triển khai chính xác.
- Giảm mâu thuẫn giữa TDS và PR.

Nhược điểm

- Mọi thay đổi Database đều phải thông qua ADR.
- Cần Migration khi thay đổi Schema.

---

# 12. Approval

This ADR is approved.

Database Schema Version:

```
v1.0
```

Status:

```
FROZEN
```