# Module Spec: Employee

**Status:** Implemented
**Module Key:** `employee`

---

## Overview

Employee is the central entity of the HRMS. Every other module (payroll, leave, attendance, performance) revolves around employee records. The module stores the core profile plus tabbed sub-entities: contact details, documents, education history, and work experience.

---

## Entities

### Employee (core)

| Field | Type | Notes |
|---|---|---|
| id | bigint | PK |
| ulid | ulid | public identifier |
| company_id | fk | tenant-scoped |
| employee_code | string | unique employee code |
| first_name | string | |
| last_name | string | |
| full_name | string | |
| email | string | work email |
| phone | string | |
| date_of_birth | date | |
| gender | string | |
| hire_date | date | joining date |
| employment_status | string | Active / Inactive |
| department_id | fk | |
| designation_id | fk | |
| manager_id | fk → employees | nullable — self-referencing |
| address | text | nullable |
| city | string | nullable |
| country | string | nullable |
| status | boolean | active status flag |
| created_by | fk → users | audit |
| updated_by | fk → users | audit |

### Employee Contact

Additional contacts per employee (emergency contact, secondary address, etc.).

| Field | Type | Notes |
|---|---|---|
| id | bigint | PK |
| ulid | ulid | public identifier |
| company_id | fk | tenant-scoped |
| employee_id | fk | |
| contact_name | string | contact person name |
| relationship | string | |
| phone | string | |

### Employee Document

HR-collected documents (NID scan, offer letter, certificate copies).

| Field | Type | Notes |
|---|---|---|
| id | bigint | PK |
| ulid | ulid | public identifier |
| company_id | fk | tenant-scoped |
| employee_id | fk | |
| document_name | string | document name |
| document_type | string | type (NID, CV, etc.) |
| file_path | string | file storage path |
| uploaded_at | timestamp | |
| created_by | fk → users | audit |

### Employee Education

Academic qualifications.

| Field | Type | Notes |
|---|---|---|
| id | bigint | PK |
| ulid | ulid | public identifier |
| company_id | fk | tenant-scoped |
| employee_id | fk | |
| degree | string | e.g. BSc, MBA |
| institution | string | |
| year_of_passing | year | |

### Employee Experience

Previous employment history.

| Field | Type | Notes |
|---|---|---|
| id | bigint | PK |
| ulid | ulid | public identifier |
| company_id | fk | tenant-scoped |
| employee_id | fk | |
| company_name | string | |
| designation | string | |
| start_date | date | |
| end_date | date | nullable — null = current |
| responsibilities | text | nullable |

---

## User Stories

- As HR, I can create an employee record with all personal and organizational details so their profile is complete from day one.
- As HR, I can attach documents to an employee record so required paperwork is centralized.
- As HR, I can record an employee's education and experience so their background is on file.
- As HR, I can add emergency contacts so we know who to reach in a crisis.
- As a Manager, I can view my direct reports' profiles (read-only).
- As an Employee, I can view my own profile via self-service (see module 11).
- As HR, I can bulk-delete separated employees after a retention period.
- As HR, I can filter employees by branch, department, designation, and status.

---

## Routes

```
GET    /employees                    → EmployeeController@index
POST   /employees                    → EmployeeController@store
GET    /employees/{employee}         → EmployeeController@show
PUT    /employees/{employee}         → EmployeeController@update
DELETE /employees/{employee}         → EmployeeController@destroy
DELETE /employees/bulk-delete        → EmployeeController@bulkDelete

POST   /employees/{employee}/contacts            → EmployeeContactController@store
PUT    /employees/{employee}/contacts/{contact}  → EmployeeContactController@update
DELETE /employees/{employee}/contacts/{contact}  → EmployeeContactController@destroy

POST   /employees/{employee}/documents              → EmployeeDocumentController@store
PUT    /employees/{employee}/documents/{document}   → EmployeeDocumentController@update
DELETE /employees/{employee}/documents/{document}   → EmployeeDocumentController@destroy

POST   /employees/{employee}/education              → EmployeeEducationController@store
PUT    /employees/{employee}/education/{education}  → EmployeeEducationController@update
DELETE /employees/{employee}/education/{education}  → EmployeeEducationController@destroy

POST   /employees/{employee}/experience               → EmployeeExperienceController@store
PUT    /employees/{employee}/experience/{experience}  → EmployeeExperienceController@update
DELETE /employees/{employee}/experience/{experience}  → EmployeeExperienceController@destroy
```

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_EMPLOYEE` | View employee list and profiles |
| `CREATE_EMPLOYEE` | Create new employee records |
| `UPDATE_EMPLOYEE` | Edit employee core profile and sub-entities |
| `DELETE_EMPLOYEE` | Delete / bulk-delete employees |

---

## UI Notes

- List: DataTable with columns employee_id, photo+name, designation, department, status, actions.
- Show page: tabbed layout — Profile / Contacts / Documents / Education / Experience.
- Each tab: inline DataTable with add/edit/delete actions within the tab.
- Employment type and status shown as colored badges.
- Profile photo: upload + preview; falls back to initials avatar.

---

## Known Gaps

None. Module is fully implemented.

---

## Dependencies

- Configuration (Branch, Department, Unit, Designation, Desk must exist first)
- Referenced by: Payroll, Leave, Attendance, Performance, Separation, Reporting
