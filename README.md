# FactoryOS

> **FactoryOS** là hệ thống quản lý công việc nội bộ dành cho nhà máy, được xây dựng trên nền tảng Google Workspace nhằm chuẩn hóa quy trình quản lý, số hóa dữ liệu và nâng cao hiệu quả vận hành.

---

# Project Information

| Item | Value |
|------|-------|
| Project | FactoryOS |
| Version | v1.0.0 |
| Status | In Development |
| Platform | Google Apps Script |
| Frontend | HTML Service |
| Backend | Google Apps Script |
| Database | Google Sheets |
| Storage | Google Drive |

---

# Vision

FactoryOS được xây dựng để trở thành một hệ thống quản lý tập trung cho toàn bộ hoạt động của nhà máy.

Mục tiêu của dự án:

- Chuẩn hóa quy trình làm việc
- Quản lý Project
- Quản lý Task
- Quản lý Knowledge
- Quản lý tài liệu
- Chuẩn hóa dữ liệu
- Giảm thao tác thủ công
- Tích hợp AI hỗ trợ công việc
- Tăng năng suất và khả năng mở rộng hệ thống

---

# Project Objectives

FactoryOS hướng tới việc xây dựng một nền tảng thống nhất để quản lý:

- Project
- Task
- Inbox
- Knowledge
- Dashboard
- Notification
- AI Assistant

---

# Technology Stack

## Frontend

- HTML Service
- JavaScript
- CSS

## Backend

- Google Apps Script

## Database

- Google Sheets

## Storage

- Google Drive

---

# System Architecture

```text
Browser
    │
    ▼
HTML Service
    │
    ▼
Apps Script
    │
    ├── Business Logic
    ├── Validation
    ├── Repository
    ├── Drive Service
    └── Utilities
    │
    ▼
Google Sheets Database
    │
    ▼
Google Drive
```

---

# Architecture Principles

FactoryOS được phát triển theo các nguyên tắc sau.

## 1. Database First

Database được thiết kế và phê duyệt trước khi phát triển chức năng.

---

## 2. Documentation First

Không viết code trước khi hoàn thành tài liệu.

Thứ tự phát triển:

```
ADR

↓

SRS

↓

TDS

↓

Implementation Guide

↓

Code

↓

Testing

↓

Release
```

---

## 3. Layered Architecture

Tách biệt rõ các tầng:

- UI
- Service
- Repository
- Database

Không được trộn Business Logic vào UI.

---

## 4. Configuration Driven

Không Hardcode.

Mọi cấu hình phải được đọc từ SETTINGS.

Ví dụ:

- Prefix
- Folder ID
- Time Zone
- Status
- Priority

---

## 5. Single Responsibility

Mỗi Module chỉ chịu trách nhiệm một chức năng.

Ví dụ:

- ValidationService
- DriveService
- IdService
- ProjectRepository

---

## 6. Keep It Simple

Ưu tiên giải pháp đơn giản, dễ bảo trì và dễ mở rộng.

---

# Development Workflow

Toàn bộ dự án phải tuân thủ quy trình sau.

```
Business Requirement
        │
        ▼
Architecture Decision Record (ADR)
        │
        ▼
Software Requirement Specification (SRS)
        │
        ▼
Technical Design Specification (TDS)
        │
        ▼
Implementation Guide
        │
        ▼
Development
        │
        ▼
Testing
        │
        ▼
Release
```

Không được bỏ qua bất kỳ bước nào.

---

# Documentation Structure

```
FactoryOS/

README.md

ROADMAP.md

docs/

    architecture/

        ADR-003_Database_Frozen.md

    sprint-02/

        SRS_Sprint02_NewProject.md

        TDS_Sprint02_NewProject.md

        Codex_Implementation_Guide.md

        TestPlan.md

        ReleaseNotes.md
```

---

# Sprint Roadmap

| Sprint | Module | Status |
|---------|--------|--------|
| Sprint 1 | Database Design | Completed |
| Sprint 2 | New Project | In Progress |
| Sprint 3 | Task Management | Planned |
| Sprint 4 | Inbox | Planned |
| Sprint 5 | Dashboard | Planned |
| Sprint 6 | Knowledge | Planned |
| Sprint 7 | AI Assistant | Planned |
| Sprint 8 | Notification | Planned |

---

# Coding Rules

Toàn bộ source code phải tuân thủ các nguyên tắc sau.

- Không Hardcode
- Không thay đổi Database
- Không thay đổi Architecture
- Không viết Business Logic trong UI
- Chia module rõ ràng
- Đặt tên rõ nghĩa
- Tái sử dụng code
- Dễ bảo trì
- Dễ mở rộng

---

# Database

Database chính thức gồm 5 Sheet.

| Sheet |
|--------|
| PROJECT |
| TASK |
| INBOX |
| KNOWLEDGE |
| SETTINGS |

Không được thay đổi Database nếu chưa có ADR mới.

---

# Source Code Structure

```
src/

Code.gs

Config.gs

SettingsService.gs

ValidationService.gs

IdService.gs

DriveService.gs

ProjectRepository.gs

ProjectService.gs

Utils.gs

html/

Index.html

ProjectForm.html

Style.html

Script.html
```

---

# Branch Strategy

Mỗi Sprint được phát triển theo Pull Request độc lập.

Ví dụ:

```
main

↓

Sprint-02

↓

PR-01

↓

PR-02

↓

PR-03
```

Không merge khi chưa Review.

---

# Definition of Done

Một Sprint chỉ được xem là hoàn thành khi:

- Chức năng hoạt động đúng
- Hoàn thành Test Plan
- Không có lỗi nghiêm trọng
- Không thay đổi Architecture
- Không thay đổi Database
- Được Review và phê duyệt

---

# References

Đọc tài liệu theo đúng thứ tự sau:

1. README.md
2. ADR-003_Database_Frozen.md
3. SRS_Sprint02_NewProject.md
4. TDS_Sprint02_NewProject.md
5. Codex_Implementation_Guide.md

---

# License

Internal Use Only

FactoryOS là dự án nội bộ, chỉ sử dụng trong phạm vi tổ chức.