# PR-02 : Config.gs & SettingsService.gs

Đây là Implementation Order chính thức.

## Mục tiêu

Triển khai module Config và SettingsService theo đúng tài liệu đã phê duyệt.

## Tham khảo tài liệu

1. README.md
2. ADR-003_Database_Frozen.md
3. SRS_Sprint02_NewProject.md
4. TDS_Sprint02_NewProject.md
5. Codex_Implementation_Guide.md

Không được suy đoán ngoài tài liệu.

---

## Database Contract

Sheet Name

SETTINGS

Columns

| KEY | VALUE | DESCRIPTION |

Sample Data

PROJECT_PREFIX | PRJ | Project ID Prefix
PROJECT_CURRENT_YEAR | 2026 | Current Project Year
CURRENT_PROJECT_NO | 0 | Current Running Number
TASK_PREFIX | TSK | Task Prefix
CURRENT_TASK_NO | 0 | Current Running Number
INBOX_PREFIX | INB | Inbox Prefix
CURRENT_INBOX_NO | 0 | Current Running Number
KNOWLEDGE_PREFIX | KNO | Knowledge Prefix
CURRENT_KNOWLEDGE_NO | 0 | Current Running Number
DRIVE_ROOT_FOLDER_ID | xxxxxxxxx
TEMPLATE_FOLDER_ID | xxxxxxxxx
TIME_ZONE | Asia/Tokyo

---

## Spreadsheet Access

FactoryOS sử dụng Script-bound Google Apps Script.

Luôn sử dụng

SpreadsheetApp.getActiveSpreadsheet()

Không sử dụng

SpreadsheetApp.openById()

---

## Phạm vi thực hiện

Tạo

Config.gs

SettingsService.gs

Config chỉ chứa các hằng số cần thiết.

SettingsService chịu trách nhiệm:

- getSetting(key)
- setSetting(key,value)
- getAllSettings()

Không xử lý Business Logic.

Không tạo UI.

Không thao tác PROJECT.

Không sinh Project ID.

Không tạo Folder.

---

## Coding Rules

- Không Hardcode
- Không đổi Database
- Không đổi Header
- Không đổi Sheet Name
- Có JSDoc cho public function
- Chia nhỏ function
- Có xử lý lỗi

---

## Deliverables

- Config.gs
- SettingsService.gs

Kèm:

1. Giải thích thiết kế
2. Luồng xử lý
3. Các giả định (nếu có)
4. Danh sách file đã tạo

Không triển khai PR tiếp theo.

Sau khi hoàn thành thì dừng và chờ Review.