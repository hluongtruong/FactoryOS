# FactoryOS
# Sprint 2 - Codex Implementation Guide

---

## Document Information

| Item | Value |
|------|-------|
| Document | Codex Implementation Guide |
| Sprint | Sprint 2 |
| Version | v1.0 |
| Status | APPROVED |
| Author | Software Architect |
| Project | FactoryOS |

---

# 1. Mission

Bạn là **Senior Google Apps Script Engineer**.

Nhiệm vụ của bạn là triển khai **Sprint 2 – New Project Module** của FactoryOS.

Bạn KHÔNG phải Software Architect.

Bạn KHÔNG được thay đổi thiết kế.

Bạn KHÔNG được thay đổi Database.

Bạn chỉ được triển khai đúng theo tài liệu.

---

# 2. Required Documents

Đọc theo đúng thứ tự sau.

1.
README.md

2.
ADR-003_Database_Frozen.md

3.
SRS_Sprint02_NewProject.md

4.
TDS_Sprint02_NewProject.md

5.
Codex_Implementation_Guide.md

---

Nếu phát hiện mâu thuẫn.

Ưu tiên:

ADR

↓

SRS

↓

TDS

↓

Guide

↓

Code

Không được tự ý quyết định.

Hãy dừng lại và hỏi.

---

# 3. Sprint Scope

Được phép phát triển:

- New Project Form
- Validation
- Project ID Generation
- Google Drive Folder Creation
- PROJECT Database Insert
- SETTINGS Update

Không được phát triển:

- Task
- Inbox
- Knowledge
- Dashboard
- AI
- Login
- Permission
- Notification

---

# 4. Database Contract

Không được thay đổi.

Tên Sheet:

- PROJECT
- TASK
- INBOX
- KNOWLEDGE
- SETTINGS

Không được:

- Đổi tên Sheet
- Đổi tên cột
- Thêm cột
- Xóa cột

Mọi thay đổi Database phải có ADR mới.

---

# 5. Configuration Rules

Không được Hardcode:

- Sheet Name
- Folder ID
- Project Prefix
- Status
- Priority
- TimeZone

Toàn bộ phải đọc từ Sheet SETTINGS.

---

# 6. Project ID Rules

Định dạng:

PRJ-YYYY-NNN

Ví dụ:

PRJ-2026-001

Quy trình:

1.
Đọc PROJECT_PREFIX

2.
Đọc PROJECT_CURRENT_YEAR

3.
Đọc CURRENT_PROJECT_NO

4.
Lấy năm hiện tại

5.
Nếu năm hiện tại khác PROJECT_CURRENT_YEAR

- cập nhật PROJECT_CURRENT_YEAR
- CURRENT_PROJECT_NO = 1

6.
Nếu cùng năm

CURRENT_PROJECT_NO++

7.
Padding 3 chữ số

8.
Sinh Project ID

Không được tự thay đổi thuật toán.

---

# 7. Processing Flow

Bắt buộc theo đúng thứ tự.

Validation

↓

Generate Project ID

↓

Create Google Drive Folder

↓

Insert PROJECT

↓

Update SETTINGS

↓

Return Result

Không thay đổi thứ tự.

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

Dừng.

Không Update SETTINGS.

Nếu Update SETTINGS lỗi

↓

Trả lỗi.

Không được báo thành công.

---

# 9. Folder Rules

Folder Name

<ProjectID>_<ProjectName>

Ví dụ

PRJ-2026-001_SkillMap

Folder phải được tạo từ

TEMPLATE_FOLDER_ID

Folder phải nằm trong

DRIVE_ROOT_FOLDER_ID

---

# 10. Coding Architecture

Bắt buộc chia Module.

Ví dụ:

Code.gs

Config.gs

SettingsService.gs

ValidationService.gs

IdService.gs

DriveService.gs

ProjectRepository.gs

ProjectService.gs

Utils.gs

Index.html

ProjectForm.html

Style.html

Script.html

Không được viết toàn bộ code trong Code.gs.

---

# 11. Coding Principles

Áp dụng:

- Single Responsibility Principle
- Separation of Concerns
- DRY
- KISS

Không viết Function quá dài.

Không lặp code.

Đặt tên rõ ràng.

---

# 12. Error Handling

Không hiển thị Stack Trace cho User.

API Response phải thống nhất.

Success

{
    "success": true,
    "data": { }
}

Fail

{
    "success": false,
    "code": "DRV001",
    "message": "Create Folder Failed"
}

---

# 13. Logging

Mỗi lần Create Project.

Log:

- Timestamp
- User
- ProjectID
- Result
- ErrorCode

Không sử dụng Logger.log() làm cơ chế logging chính.

---

# 14. UI Rules

UI đơn giản.

Không Animation.

Không Framework.

Responsive.

Button Create bị Disable khi Submit.

Hiển thị Loading.

---

# 15. Testing Checklist

Codex phải tự kiểm tra.

□ Create Success

□ Empty Project Name

□ Empty Purpose

□ Empty Owner

□ Invalid Deadline

□ Duplicate Project ID

□ Year Reset

□ Drive Folder Failure

□ PROJECT Insert Failure

□ SETTINGS Update Failure

---

# 16. Deliverables

Hoàn thành Sprint phải bàn giao.

Source Code

Apps Script Files

HTML Files

CSS Files

JavaScript Files

Installation Guide

Configuration Guide

Testing Result

Known Issues

---

# 17. Definition of Done

Sprint 2 được xem là hoàn thành khi.

✓ New Project hoạt động.

✓ Validation hoàn chỉnh.

✓ Project ID đúng định dạng.

✓ Folder được tạo.

✓ PROJECT được ghi.

✓ SETTINGS được cập nhật.

✓ Không có Duplicate ID.

✓ Không có Hardcode.

✓ Pass toàn bộ Test Plan.

---

# 18. Restrictions

Codex KHÔNG được.

- Thay đổi Database
- Thay đổi Architecture
- Thay đổi Business Logic
- Thêm chức năng ngoài Sprint
- Refactor ngoài phạm vi Sprint

Nếu phát hiện thiếu thông tin.

Không suy đoán.

Dừng.

Báo cáo.

Chờ Software Architect quyết định.

---

# 19. Final Instruction

Mục tiêu của Codex là:

**Triển khai Sprint 2 đúng 100% theo ADR, SRS và TDS.**

Không tối ưu ngoài yêu cầu.

Không sáng tạo thêm chức năng.

Không thay đổi kiến trúc.

Khi hoàn thành từng module.

Dừng.

Báo cáo.

Chờ Review trước khi triển khai module tiếp theo.