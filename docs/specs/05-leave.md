# Module Spec: Leave Management

**Status:** Planned
**Module Key:** `leave`

---

## Overview

Leave management tracks employee time-off entitlements, applications, approvals, and balances. It must handle Bangladesh-specific leave categories (including maternity leave per Bangladesh Labor Law 2006), enforce company-defined quotas, and feed approved leave days into the payroll run.

---

## Entities

### Leave Type

Defines a category of leave with its rules.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| name | string | e.g. "Annual Leave", "Casual Leave" |
| code | string | short code, e.g. AL, CL, ML |
| days_per_year | integer | annual quota |
| is_paid | boolean | |
| carry_forward | boolean | unused days roll to next year |
| carry_forward_max | integer | nullable — cap on carry-forward days |
| gender_restriction | enum | all / male / female — for maternity/paternity |
| requires_document | boolean | e.g. medical certificate for sick leave |
| min_service_months | integer | nullable — eligibility threshold |
| status | enum | active / inactive |

**Presets for Bangladesh:**
- Annual Leave: 10 days/year (paid, carry-forward)
- Casual Leave: 10 days/year (paid, no carry-forward)
- Sick / Medical Leave: 14 days/year (paid, with document)
- Maternity Leave: 112 days (16 weeks, female only, min 6 months service)
- Paternity Leave: 3 days (company policy, optional)
- Unpaid Leave: unlimited (not paid)

### Leave Policy

Binds a leave type to a designation or employee grade with a possible quota override. If no policy row exists for an employee's designation, the leave type's default quota applies.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| leave_type_id | fk | |
| designation_id | fk | nullable — null = applies to all |
| days_per_year | integer | override quota |

### Holiday

Public and company-specific non-working days. Bangladesh public holidays preloaded per year.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| name | string | e.g. "Eid ul-Fitr" |
| date | date | |
| type | enum | public / company |
| is_recurring | boolean | re-apply each year |

### Leave Application

An employee's request for time off.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| employee_id | fk | |
| leave_type_id | fk | |
| from_date | date | |
| to_date | date | |
| days | integer | computed — excludes holidays and weekends |
| half_day | boolean | |
| reason | text | nullable |
| document | file | nullable — required if leave_type.requires_document |
| status | enum | pending / approved / rejected / cancelled |
| applied_at | timestamp | |
| actioned_by | fk → users | manager or HR |
| actioned_at | timestamp | nullable |
| rejection_reason | text | nullable |

### Leave Balance

Per-employee per-leave-type running balance. Recomputed at year start and adjusted per approval.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| employee_id | fk | |
| leave_type_id | fk | |
| year | integer | |
| entitled_days | decimal | includes carry-forward |
| used_days | decimal | sum of approved leave days |
| remaining_days | decimal | computed: entitled - used |

---

## User Stories

- As HR, I can define leave types with quotas and rules so the system enforces policy automatically.
- As HR, I can configure holiday lists per year so applications correctly exclude non-working days.
- As an Employee, I can apply for leave by selecting type, dates, and providing a reason.
- As an Employee, I can see my remaining leave balance before applying.
- As a Manager, I receive a notification when a direct report applies for leave and can approve or reject it.
- As HR, I can override any leave approval (second-level approval or correction).
- As HR, I can view the team leave calendar to spot conflicts before approving.
- As HR, I can credit carry-forward days at the start of a new leave year.
- As Payroll, I can pull approved leave days per employee per month when processing payroll.

---

## Routes

```
GET|POST                 /leave/types
PUT|DELETE               /leave/types/{type}
DELETE                   /leave/types/bulk-delete

GET|POST                 /leave/policies
PUT|DELETE               /leave/policies/{policy}

GET|POST                 /leave/holidays
PUT|DELETE               /leave/holidays/{holiday}
DELETE                   /leave/holidays/bulk-delete

GET|POST                 /leave/applications
GET                      /leave/applications/{application}
PUT                      /leave/applications/{application}         (edit while pending)
DELETE                   /leave/applications/{application}
POST                     /leave/applications/{application}/approve
POST                     /leave/applications/{application}/reject
POST                     /leave/applications/{application}/cancel

GET                      /leave/balances                           (HR view — all employees)
GET                      /leave/balances/{employee}               (per employee)
POST                     /leave/balances/year-rollover            (annual credit job trigger)

GET                      /leave/calendar                          (team calendar view)
```

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_LEAVE_TYPE` | View leave types |
| `MANAGE_LEAVE_TYPE` | Create / edit / delete leave types |
| `READ_LEAVE_HOLIDAY` | View holidays |
| `MANAGE_LEAVE_HOLIDAY` | Create / edit / delete holidays |
| `READ_LEAVE_APPLICATION` | View all applications (HR/Manager scoped) |
| `CREATE_LEAVE_APPLICATION` | Submit own application (all employees) |
| `APPROVE_LEAVE_APPLICATION` | Approve / reject applications |
| `READ_LEAVE_BALANCE` | View balances (own always visible; HR sees all) |
| `MANAGE_LEAVE_BALANCE` | Manual balance adjustment (HR only) |

---

## Approval Workflow

```
Employee submits → status: pending
  ↓
Manager reviews → approve / reject → status: approved / rejected
  ↓ (optional second level)
HR reviews → approve / reject / override
  ↓
Balance deducted on approval; restored on cancellation before start date
```

Configuration: company can set 1-level (manager only) or 2-level (manager + HR) approval.

---

## Day Count Calculation

```
days = business_days(from_date, to_date)
     - holidays_in_range(from_date, to_date)
if half_day: days = 0.5
```

Weekend definition: Friday + Saturday (Bangladesh standard). Configurable per company.

---

## UI Notes

- Leave application list: filterable by employee, type, status, date range.
- Pending approvals: dedicated queue view for managers showing name, type, dates, days, reason.
- Leave calendar: monthly grid; approved leaves shown as colored blocks per employee per department.
- Balance widget: card per leave type showing entitled / used / remaining as a progress bar.
- Year rollover: triggered manually by HR via a button (fires a queued job in background).

---

## Dependencies

- Employee (applicant)
- Configuration (Company for weekend definition, Designation for policy)
- Notifications (approval/rejection triggers in-app + email notification)
- Payroll (approved leave days consumed in payroll run)
