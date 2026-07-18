📄 Tài liệu 1
SRS – Sprint 2 New Project

(Business Requirement)

Đây là tài liệu dành cho:

Shacho
Hancho
Người sử dụng
Tester

Không nói về code.

Nội dung gồm:

1. Purpose

2. Scope

3. Business Process

4. User Story

5. Functional Requirements

6. Non-functional Requirements

7. Validation Rules

8. Success Criteria

9. Out of Scope

10. Acceptance Criteria

Ví dụ:

FR-001

Người dùng có thể tạo Project mới.

----------------

FR-002

Hệ thống tự động sinh Project ID.

----------------

FR-003

Hệ thống tạo Folder trong Google Drive.

----------------

FR-004

Ghi dữ liệu vào Sheet PROJECT.

----------------

FR-005

Trả về URL Folder.

Tài liệu này không có Apps Script.

📄 Tài liệu 2
TDS – Technical Design Specification

Đây là tài liệu dành cho:

Developer
Codex
Reviewer

Nội dung:

1. Architecture

2. Folder Structure

3. Module Design

4. Database Mapping

5. Google Drive Structure

6. Sequence Diagram

7. Validation Logic

8. ID Generation Algorithm

9. Error Handling

10. Logging

11. Future Extension

Ví dụ:

ProjectService

↓

Validation

↓

IdService

↓

DriveService

↓

ProjectRepository

↓

Return Result

Trong tài liệu này sẽ định nghĩa rõ:

generateProjectID()

↓

PRJ-2026-001

không phải viết code, mà mô tả thuật toán.

📄 Tài liệu 3
Codex Implementation Guide

Đây không chỉ là Prompt.

Mình đề xuất coi nó như Coding Standard.

Nội dung:

Project Goal

Architecture

Coding Rules

Naming Rules

Database Contract

Google Drive Contract

Implementation Order

Definition of Done

Coding Checklist

Review Checklist

Ví dụ:

Không được:

- Hardcode Sheet Name

- Hardcode Folder ID

- Hardcode Prefix

Phải đọc từ SETTINGS.

Ví dụ:

Không được:

sheet.getRange(2,3)

Phải dùng

Column Mapping

Ví dụ:

Không được

appendRow()

nếu chưa Validation.

Những quy tắc này sẽ giúp Codex sinh code ổn định hơn.

Bộ tài liệu chuẩn Sprint 2

Mình đề xuất cấu trúc thư mục như sau:

FactoryOS/

docs/

    ADR/
        ADR-003_Database_Frozen.md

    sprint02/

        SRS_Sprint02_NewProject.md

        TDS_Sprint02_NewProject.md

        Codex_Implementation_Guide.md
Quy trình phát triển sau này

Đây là quy trình mình khuyến nghị áp dụng cho mọi Sprint:

Business Idea
        │
        ▼
ADR
        │
        ▼
SRS
        │
        ▼
TDS
        │
        ▼
Review
        │
        ▼
Codex
        │
        ▼
Code Review
        │
        ▼
Testing
        │
        ▼
Release

Điểm quan trọng là Codex chỉ bắt đầu viết code sau khi SRS và TDS đã được chấp thuận. Điều này giúp tránh tình trạng phải sửa đi sửa lại vì thay đổi yêu cầu giữa chừng.

Mình đề xuất cách thực hiện

Thay vì tạo cả ba tài liệu cùng lúc, chúng ta làm theo đúng quy trình của một dự án phần mềm:

Soạn SRS và chốt nghiệp vụ.
Từ SRS, viết TDS.
Khi TDS được duyệt, mới tạo Codex Implementation Guide.

Như vậy mỗi tài liệu sẽ dựa trên tài liệu trước đó, tránh mâu thuẫn và Codex sẽ có một đặc tả rõ ràng để triển khai Sprint 2.