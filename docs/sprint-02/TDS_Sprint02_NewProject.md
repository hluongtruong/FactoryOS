FactoryOS
Sprint 2
Technical Design Specification (TDS)

Version

v1.0

Status

APPROVED
1. Architecture Overview
Mục tiêu

Triển khai chức năng New Project theo kiến trúc nhiều lớp (Layered Architecture), tách biệt giao diện, nghiệp vụ và truy cập dữ liệu để dễ bảo trì và mở rộng.

Browser
      │
      ▼
Web App (HTML/CSS/JS)
      │
google.script.run
      │
      ▼
Apps Script
      │
      ▼
Service Layer
      │
 ├── Validation
 ├── ID Generation
 ├── Drive
 └── Repository
      │
      ▼
Google Sheets
Google Drive
2. Module Structure
FactoryOS/

├── Code.gs
├── Config.gs
├── ProjectService.gs
├── ProjectRepository.gs
├── DriveService.gs
├── IdService.gs
├── ValidationService.gs
├── SettingsService.gs
├── Utils.gs
│
├── Index.html
├── ProjectForm.html
├── Script.html
└── Style.html
Trách nhiệm từng module
Module	Trách nhiệm
Code.gs	Entry Point
Config.gs	Constant dùng chung
SettingsService	Đọc SETTINGS
ValidationService	Kiểm tra dữ liệu
IdService	Sinh Project ID
DriveService	Tạo Folder
ProjectRepository	Ghi dữ liệu PROJECT
ProjectService	Điều phối toàn bộ nghiệp vụ
Utils	Hàm dùng chung
3. Database Mapping
PROJECT
Cột	Nguồn dữ liệu
プロジェクトID	IdService
プロジェクト名	Form
目的	Form
優先度	Form
ステータス	Default = 未着手
次のアクション	Rỗng
責任者	Form
開始日	Today
終了日	Form
フォルダURL	DriveService
作成日時	Now
更新日時	Now
SETTINGS

Đọc:

PROJECT_PREFIX

PROJECT_CURRENT_YEAR

CURRENT_PROJECT_NO

DRIVE_ROOT_FOLDER_ID

TEMPLATE_FOLDER_ID

Cập nhật:

CURRENT_PROJECT_NO
4. Sequence Flow
User

↓

Open Form

↓

Input

↓

Submit

↓

ValidationService

↓

SettingsService

↓

IdService

↓

DriveService

↓

ProjectRepository

↓

Update SETTINGS

↓

Return Success
5. Validation Logic
Project Name
Required
≤100 ký tự
Purpose
Required
≤500 ký tự
Priority
Phải thuộc PRIORITY_LIST
Owner
Required
Deadline
Không nhỏ hơn ngày hiện tại

Nếu có lỗi:

Không tạo Folder
Không ghi Database
Trả danh sách lỗi
6. Project ID Algorithm

Định dạng:

PRJ-YYYY-NNN

Ví dụ:

PRJ-2026-001

Thuật toán:

Đọc PROJECT_PREFIX
Đọc PROJECT_CURRENT_YEAR
Đọc CURRENT_PROJECT_NO
Lấy năm hiện tại
Nếu năm hiện tại khác PROJECT_CURRENT_YEAR:
cập nhật PROJECT_CURRENT_YEAR
đặt CURRENT_PROJECT_NO = 1
Nếu cùng năm:
CURRENT_PROJECT_NO++
Padding 3 chữ số
Trả về Project ID
7. Folder Creation

Tên Folder:

<ProjectID>_<ProjectName>

Ví dụ:

PRJ-2026-001_SkillMap

Quy trình:

Drive Root

↓

Copy Template Folder

↓

Rename Folder

↓

Return URL

Nếu tạo Folder thất bại:

Không ghi PROJECT
Không cập nhật SETTINGS
8. Transaction Policy

Đây là phần mình bổ sung vì rất quan trọng.

Thứ tự xử lý phải là:

Validation

↓

Generate ID

↓

Create Folder

↓

Insert PROJECT

↓

Update SETTINGS

↓

Success

Nếu bất kỳ bước nào lỗi:

Dừng xử lý
Trả lỗi
Không cập nhật dữ liệu phía sau

Mục tiêu là tránh trạng thái không nhất quán giữa Google Drive và Google Sheets.

9. Error Handling

Các loại lỗi:

Mã	Ý nghĩa
VAL001	Thiếu Project Name
VAL002	Thiếu Purpose
VAL003	Deadline không hợp lệ
CFG001	Thiếu cấu hình SETTINGS
DRV001	Không tạo được Folder
DB001	Không ghi được PROJECT

Không hiển thị stack trace cho người dùng.

10. Logging

Mỗi lần tạo Project ghi:

Timestamp
User
ProjectID
Result
ErrorCode (nếu có)

Điều này giúp truy vết khi có sự cố.

11. Coding Standards
Không hardcode tên Sheet.
Không hardcode Folder ID.
Không hardcode Prefix.
Đọc tất cả từ SETTINGS.
Mỗi Service chỉ có một trách nhiệm chính (Single Responsibility Principle).
Không để toàn bộ logic trong Code.gs.
12. Future Extension

Thiết kế này phải hỗ trợ:

Sprint 3: Task
Sprint 4: Inbox
Sprint 5: Dashboard
Sprint 6: Knowledge
Sprint 7: AI

Không cần thay đổi kiến trúc lõi.

Review với vai trò Software Architect

Mình bổ sung hai điểm so với bản TDS ban đầu:

Transaction Policy: Đây là phần rất quan trọng. Nếu tạo Folder thành công nhưng ghi Sheet thất bại (hoặc ngược lại), hệ thống sẽ rơi vào trạng thái không đồng bộ. TDS cần quy định rõ cách xử lý để tránh tình huống này.
Logging: Khi hệ thống được dùng trong công ty, việc ghi log là cần thiết để điều tra lỗi và hỗ trợ bảo trì.

Nếu bạn duyệt TDS này, bước cuối cùng sẽ là Codex Implementation Guide. Tài liệu đó sẽ không mô tả nghiệp vụ nữa mà sẽ quy định cách Codex phải tổ chức mã nguồn, quy tắc lập trình và thứ tự triển khai, giúp AI tạo ra code nhất quán với SRS và TDS.