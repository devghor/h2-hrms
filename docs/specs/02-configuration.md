# Module Spec: Configuration

**Status:** Implemented (minor permission gaps)
**Module Key:** `configuration`

---

## Overview

Configuration holds the organizational structure of a company: its branches, the division/department/unit hierarchy, designations, and physical desks. These entities are referenced throughout the system (employees are assigned to departments, desks, designations, etc.) so they must be set up before employee records are created.

---

## Entities

### Company

The top-level tenant entity. In a multi-tenant deployment a Super Admin manages multiple companies; a Company Admin only sees their own.

| Field | Type | Notes |
|---|---|---|
| id | string | Stancl tenant ID |
| name | string | |
| logo | file | stored via Spatie Media |
| address | text | |
| phone | string | |
| email | string | |
| website | string | nullable |
| fiscal_year_start | month enum | Default: July (Bangladesh) |
| status | enum | active / inactive |

### Branch

A physical or logical office location belonging to a company.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | tenant-scoped |
| name | string | |
| address | text | nullable |
| phone | string | nullable |
| status | enum | active / inactive |

### Division

Top level of the org hierarchy below company. A company can have multiple divisions (e.g. "Operations", "Finance").

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| name | string | |
| status | enum | active / inactive |

### Department

Belongs to a division. This is the primary grouping for employees.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| division_id | fk | |
| company_id | fk | |
| name | string | |
| status | enum | active / inactive |

### Unit

Belongs to a department. Optional sub-grouping within a department.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| department_id | fk | |
| company_id | fk | |
| name | string | |
| status | enum | active / inactive |

### Designation

A job title / grade. Used to determine salary structure, leave policy, and appraisal template.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| name | string | |
| level | integer | nullable — seniority ordering |
| status | enum | active / inactive |

### Desk

A physical workstation or seat. Linked to an employee for seating plans.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| branch_id | fk | |
| company_id | fk | |
| name / number | string | |
| status | enum | available / occupied |

---

## User Stories

- As a Company Admin, I can set up my company profile (name, logo, fiscal year) so the system reflects my organization.
- As a Company Admin, I can define branches so employees and assets can be location-tagged.
- As a Company Admin, I can define the division → department → unit hierarchy so the org chart reflects reality.
- As a Company Admin, I can define designations so salary structures and leave policies can be tied to job levels.
- As a Company Admin, I can define desks and assign them to employees for seating visibility.
- As a Super Admin, I can switch the active tenant to manage a different company.

---

## Routes

```
GET|POST   /configuration/companies              → CompanyController (index/store)
PUT|DELETE /configuration/companies/{company}    → CompanyController (update/destroy)
POST       /configuration/companies/{id}/switch  → CompanyController@switch
DELETE     /configuration/companies/bulk-delete  → CompanyController@bulkDelete

(same CRUD + bulk-delete pattern for:)
/configuration/branches
/configuration/divisions
/configuration/departments
/configuration/units
/configuration/designations
/configuration/desks
```

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_CONFIGURATION_COMPANY` | View company settings |
| `CREATE_CONFIGURATION_COMPANY` | Create new company |
| `UPDATE_CONFIGURATION_COMPANY` | Edit company |
| `DELETE_CONFIGURATION_COMPANY` | Delete company |
| `READ_CONFIGURATION_BRANCH` | View branches |
| `CREATE_CONFIGURATION_BRANCH` | ... |
| `UPDATE_CONFIGURATION_BRANCH` | ... |
| `DELETE_CONFIGURATION_BRANCH` | ... |
| *(same pattern for Division, Department, Unit, Designation, Desk)* | |

---

## UI Notes

- All entities: DataTable list + create/edit dialog (no separate page).
- Company: single-record form (settings page style) rather than a list for Company Admin; list view only for Super Admin.
- Desk status badge: green = available, amber = occupied.
- Division/Department/Unit: optionally show parent in the list column for context.

---

## Known Gaps

| Gap | Fix |
|---|---|
| `Unit` missing from `PermissionEnum` | Add `READ/CREATE/UPDATE/DELETE_CONFIGURATION_UNIT` |
| `Desk` missing from `PermissionEnum` | Add `READ/CREATE/UPDATE/DELETE_CONFIGURATION_DESK` |

---

## Dependencies

- UAM (permissions must exist before roles can be configured)
- Referenced by: Employee, Payroll, Leave, Attendance, Reporting
