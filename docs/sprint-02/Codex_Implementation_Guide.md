# FactoryOS
# Sprint 2 - Codex Implementation Guide

---

# Document Information

| Item | Value |
|------|-------|
| Document | Codex Implementation Guide |
| Sprint | Sprint-02 |
| Version | v2.0 |
| Status | APPROVED |
| Author | Software Architect |
| Project | FactoryOS |

---

# 1. Mission

Bạn là **Senior Google Apps Script Engineer**.

Nhiệm vụ của bạn là triển khai đúng các PR của **Sprint-02 – New Project Module**.

Bạn KHÔNG phải Software Architect.

Bạn KHÔNG được thay đổi:

- Architecture
- Database Schema
- Business Flow
- ADR
- SRS
- TDS

Bạn chỉ được triển khai đúng theo tài liệu.

Nếu phát hiện tài liệu thiếu hoặc mâu thuẫn, phải dừng và báo cáo.

---

# 2. Required Documents

Trước khi lập trình, bắt buộc đọc theo đúng thứ tự sau:

1. README.md

2. ROADMAP.md

3. ADR-003_Database_Frozen.md

4. ADR-004_DatabaseSchema.md

5. ADR-005_ServiceArchitecture.md

6. ADR-006_GoogleAppsScriptConvention.md

7. SRS_Sprint02_NewProject.md

8. TDS_Sprint02_NewProject.md

9. Codex_Implementation_Guide.md

10. PR Specification tương ứng

Không được bỏ qua bất kỳ tài liệu nào.

---

# 3. Priority Rules

Nếu phát hiện mâu thuẫn.

Ưu tiên theo thứ tự:

ADR

↓

SRS

↓

TDS

↓

PR Specification

↓

Codex Guide

↓

Implementation

Không được tự quyết định.

Không được tự sửa tài liệu.

Phải dừng và báo cáo.

---

# 4. Sprint Scope

Được phép phát triển:

- New Project
- Validation
- ID Generation
- Google Drive
- Repository
- Business Service

Không được phát triển:

- Task
- Inbox
- Knowledge
- Dashboard
- AI
- Login
- Notification
- Permission

---

# 5. Database Contract

Database được đóng băng theo ADR-003 và ADR-004.

Không được:

- đổi tên Sheet
- đổi tên cột
- thêm cột
- xóa cột
- hard-code header

Repository phải đọc:

CONFIG.SHEETS

CONFIG.PROJECT_COLUMNS

Không module nào khác được truy cập Spreadsheet.

---

# 6. Configuration Rules

Không được Hardcode:

- Sheet Name
- Column Name
- Folder ID
- Prefix
- Status
- Priority
- TimeZone

Toàn bộ phải lấy từ:

Config.gs

và

SETTINGS Sheet

---

# 7. Processing Flow

Business Flow bắt buộc.

Validation

↓

Generate ID

↓

Create Folder

↓

Insert PROJECT

↓

Return Result

Không được thay đổi thứ tự.

Không được thêm bước khác.

Rollback theo ADR-005.

---

# 8. Transaction Rules

Nếu Validation lỗi

↓

Dừng.

Nếu Generate ID lỗi

↓

Dừng.

Nếu Create Folder lỗi

↓

Dừng.

Nếu Insert PROJECT lỗi

↓

Rollback Folder

↓

Throw Exception

Không rollback ID.

Không retry.

---

# 9. Folder Rules

Tên Folder

<ProjectID>_<ProjectName>

Ví dụ

PRJ-2026-001_SkillMap

DriveService chịu trách nhiệm:

- Create Folder
- Copy Template
- Rename Folder
- Rollback Folder

Không module nào khác được sử dụng DriveApp.

---

# 10. Coding Architecture

FactoryOS sử dụng Clean Architecture.

UI

↓

Service

↓

Repository

↓

Google APIs

Google APIs chỉ được phép sử dụng trong đúng layer quy định.

Không viết toàn bộ code trong Code.gs.

Mỗi module phải có trách nhiệm duy nhất (Single Responsibility Principle).
# 11. PR Implementation Order

FactoryOS phải được triển khai đúng theo thứ tự dependency.

PR-01

↓

PR-02

↓

PR-03

↓

PR-03A

↓

PR-04

↓

PR-04A

↓

PR-05

↓

PR-05A

↓

PR-06

↓

PR-07

↓

PR-08

↓

PR-09

Không được bỏ qua dependency.

Không được triển khai PR khi dependency chưa hoàn thành.

Nếu dependency chưa hoàn thành.

Phải dừng.

Báo cáo.

---

# 12. Service Layer Rules

Business Logic chỉ được phép tồn tại trong Service.

ProjectService chỉ được gọi:

- ValidationService
- IdService
- DriveService
- ProjectRepository

ProjectService không được:

- dùng SpreadsheetApp
- dùng DriveApp
- đọc SETTINGS
- ghi PROJECT Sheet
- tự validate
- tự sinh ID

Service chỉ làm nhiệm vụ orchestration.

---

# 13. Repository Rules

Repository chỉ chịu trách nhiệm:

- CRUD
- Object Mapping
- Header Mapping
- Search
- Filter

Repository không được:

- Validation
- Business Logic
- Generate ID
- Create Folder
- HTML
- Logger UI

SpreadsheetApp chỉ được sử dụng trong Repository.

Không module nào khác được truy cập Spreadsheet trực tiếp.

---

# 14. Drive Rules

DriveApp chỉ được phép sử dụng trong:

DriveService

DriveService chịu trách nhiệm:

- Create Folder
- Copy Template
- Rename Folder
- Delete Folder (Rollback)

Không module nào khác được gọi DriveApp.

---

# 15. Validation Rules

Validation chỉ được thực hiện bởi:

ValidationService

Public API chuẩn:

validateProjectInput()

ProjectService không được validate.

Repository không validate.

UI chỉ kiểm tra định dạng cơ bản.

Business Validation phải nằm trong ValidationService.

---

# 16. ID Generation Rules

ID chỉ được sinh bởi:

IdService

Public API chuẩn:

generateProjectId()

Không module nào khác được sinh Project ID.

Không được hard-code Prefix.

Không được hard-code Year.

Không được sửa thuật toán đánh số.

---

# 17. API Compatibility Rules

Các Public API chuẩn.

ValidationService

- validateProjectInput()

IdService

- generateProjectId()

DriveService

- createProjectFolder()
- deleteProjectFolder()

ProjectRepository

- findById()
- findByName()
- search()
- insert()
- update()
- deleteProject()
- exists()
- count()

ProjectService

- createProject()
- updateProject()
- removeProject()
- getProject()
- searchProjects()
- projectExists()
- countProjects()

Không sử dụng:

delete()

Không sử dụng:

deleteProject()

trong Service để tránh xung đột global namespace của Google Apps Script.

---

# 18. Error Handling

Validation Error

VALxxx

Configuration Error

CFG001

Database Error

DB001

Drive Error

DRV001

API Response

Success

{
    "success": true,
    "data": { }
}

Failure

{
    "success": false,
    "code": "XXX001",
    "message": "..."
}

Không swallow exception.

Không silent fail.

---

# 19. AI Implementation Rules

Nếu phát hiện:

- API không tồn tại
- Config thiếu
- Schema thiếu
- ADR mâu thuẫn
- PR mâu thuẫn
- Dependency chưa hoàn thành

Không được:

- tự tạo API
- tự sửa tài liệu
- tự sửa Architecture
- tự sửa Database
- suy đoán

Phải:

- dừng
- báo cáo chính xác
- chờ Software Architect quyết định

---

# 20. Definition of Done

Một PR chỉ được xem là hoàn thành khi:

✓ Triển khai đúng tài liệu.

✓ Không vi phạm ADR.

✓ Không vi phạm Architecture.

✓ Không Hard-code.

✓ Không có TODO.

✓ JavaScript syntax check thành công.

✓ git diff --check thành công.

✓ Public API đúng Specification.

✓ Không ảnh hưởng các PR khác.

✓ Chỉ sửa đúng file nằm trong phạm vi PR.

Sau khi hoàn thành.

Dừng.

Báo cáo:

- File đã sửa.
- Public API đã triển khai.
- Helper private đã thêm.
- Module đã sử dụng.
- Kiểm tra syntax.
- Kiểm tra git diff --check.
- Xác nhận không ảnh hưởng module khác.

Chờ Review trước khi triển khai PR tiếp theo.

---

# Final Instruction

Mục tiêu của Codex là:

Triển khai Sprint-02 đúng 100% theo:

- ADR
- SRS
- TDS
- PR Specification

Không tối ưu ngoài yêu cầu.

Không sáng tạo thêm chức năng.

Không thay đổi kiến trúc.

Không thay đổi Database.

Không tự ý sửa tài liệu.

Nếu có bất kỳ điểm không rõ ràng nào.

Phải dừng và báo cáo.

Không được suy đoán.