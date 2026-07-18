# Test Plan — FactoryOS Sprint-02

| Item | Value |
|------|-------|
| Document | TestPlan.md |
| Project | FactoryOS |
| Sprint | Sprint-02 |
| Version | 1.0 |
| Status | Approved |
| Owner | FactoryOS Team |

---

# 1. Purpose

This document defines the testing strategy for Sprint-02.

The objective is to verify that every module functions correctly both individually and as an integrated system before release.

---

# 2. Scope

Included modules:

- Config
- SettingsService
- ValidationService
- IdService
- DriveService
- ProjectRepository
- ProjectService
- HTML UI
- System Integration

---

# 3. Test Strategy

FactoryOS adopts four testing levels.

```
Unit Test

↓

Service Test

↓

Integration Test

↓

User Acceptance Test
```

Every Pull Request must pass Unit Tests before Integration Testing.

---

# 4. Test Environment

Platform

- Google Apps Script

Database

- Google Sheets

Storage

- Google Drive

Browser

- Google Chrome
- Microsoft Edge

---

# 5. Unit Test

## SettingsService

| Test ID | Description | Expected Result |
|----------|-------------|----------------|
| ST-001 | Load configuration | Success |
| ST-002 | Missing key | Error |
| ST-003 | Update configuration | Success |
| ST-004 | Invalid key | Error |

---

## ValidationService

| Test ID | Description | Expected Result |
|----------|-------------|----------------|
| VL-001 | Required field | Pass |
| VL-002 | Empty string | Fail |
| VL-003 | Max length | Pass |
| VL-004 | Invalid email | Fail |
| VL-005 | Enum validation | Pass |
| VL-006 | Invalid date | Fail |

---

## IdService

| Test ID | Description | Expected Result |
|----------|-------------|----------------|
| ID-001 | Generate Project ID | Unique |
| ID-002 | Generate Task ID | Unique |
| ID-003 | Sequence increment | Correct |
| ID-004 | Missing configuration | Error |
| ID-005 | Invalid prefix | Error |

---

## DriveService

| Test ID | Description | Expected Result |
|----------|-------------|----------------|
| DV-001 | Create folder | Success |
| DV-002 | Folder exists | Success |
| DV-003 | Copy template | Success |
| DV-004 | Rename file | Success |
| DV-005 | Invalid folder | Error |

---

## ProjectRepository

| Test ID | Description | Expected Result |
|----------|-------------|----------------|
| RP-001 | Insert Project | Success |
| RP-002 | Update Project | Success |
| RP-003 | Find Project | Success |
| RP-004 | Search Project | Success |
| RP-005 | Delete Project | Success |

---

## ProjectService

| Test ID | Description | Expected Result |
|----------|-------------|----------------|
| PS-001 | Create Project | Success |
| PS-002 | Validation failure | Error |
| PS-003 | Duplicate Project | Error |
| PS-004 | Update Project | Success |
| PS-005 | Delete Project | Success |
| PS-006 | Search Project | Success |

---

# 6. Integration Test

## Create Project

Scenario

```
Create Project

↓

Validation

↓

Generate ID

↓

Create Folder

↓

Save Database

↓

Return Success
```

Expected Result

- Project created
- Folder created
- Database updated

---

## Update Project

Expected

- Data updated
- Folder unchanged

---

## Delete Project

Expected

- Logical delete
- Folder preserved

---

## Search Project

Expected

- Correct search result
- Acceptable response time

---

# 7. UI Test

## Project Form

Verify

- Required fields
- Buttons
- Loading indicator
- Success message
- Error message

---

## Project List

Verify

- Sorting
- Searching
- Filtering
- Pagination (if implemented)

---

## Project Detail

Verify

- Display all fields
- Edit
- Delete
- Close Project

---

# 8. Error Test

Verify

- Missing SETTINGS
- Invalid Folder ID
- Invalid Project ID
- Duplicate ID
- Missing Sheet
- Permission denied
- Invalid input

Expected

Application displays understandable error messages.

---

# 9. Performance Test

Measure

- Project creation time
- Search response
- Repository access
- Folder creation
- UI rendering

Target

| Item | Target |
|------|--------|
| Create Project | < 3 sec |
| Search | < 2 sec |
| Open List | < 2 sec |
| Load Settings | < 1 sec |

---

# 10. Regression Test

Verify previous functionality remains operational after each PR merge.

Checklist

- Settings
- Validation
- ID Generation
- Drive
- Repository
- Service
- UI

---

# 11. Security Test

Verify

- No hardcoded IDs
- No unauthorized Spreadsheet access
- No unauthorized Drive access
- No sensitive logs
- Input validation

---

# 12. Acceptance Criteria

Sprint-02 passes when:

- All Unit Tests pass
- All Integration Tests pass
- UI functions correctly
- No Critical defects
- No High severity defects
- No architecture violations

---

# 13. Exit Criteria

Sprint-02 may be released only when:

- 100% Critical tests pass
- 100% High priority tests pass
- No unresolved blocker
- Documentation completed
- Code Review completed

---

# 14. Test Summary Template

| Category | Total | Passed | Failed |
|-----------|------:|-------:|-------:|
| Unit Test | | | |
| Integration Test | | | |
| UI Test | | | |
| Performance Test | | | |
| Regression Test | | | |

---

# Definition of Done

Sprint-02 is considered successfully tested when all required test cases have passed, the Project module functions correctly end-to-end, no critical defects remain, and the implementation complies with the FactoryOS architecture and documentation.