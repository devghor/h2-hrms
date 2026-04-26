# Module Spec: Attendance

**Status:** Planned
**Module Key:** `attendance`

---

## Overview

Attendance tracks daily presence, late arrivals, early departures, and overtime for each employee. In v1 attendance records are entered manually or imported via CSV. A biometric/device webhook ingest is planned for v2. Monthly attendance summaries feed directly into the payroll run to calculate absent deductions and overtime additions.

---

## Entities

### Shift

Defines a work schedule: standard hours, grace period, and overtime threshold.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| name | string | e.g. "General Shift", "Night Shift" |
| start_time | time | |
| end_time | time | |
| grace_minutes | integer | late arrival grace period |
| break_minutes | integer | paid/unpaid break deducted from hours |
| overtime_threshold_minutes | integer | extra time before OT is counted |
| weekend_days | json | array of day numbers, e.g. [5,6] = Fri+Sat |
| status | enum | active / inactive |

### Shift Assignment

Maps an employee to a shift for a date range. Latest assignment wins.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| employee_id | fk | |
| shift_id | fk | |
| effective_from | date | |
| effective_to | date | nullable |

### Attendance Log

One record per employee per day. Source can be manual, CSV import, or device webhook.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| employee_id | fk | |
| date | date | |
| check_in | time | nullable |
| check_out | time | nullable |
| status | enum | present / absent / late / half\_day / on\_leave / holiday / weekend |
| working_minutes | integer | computed |
| overtime_minutes | integer | computed — 0 if not approved |
| overtime_status | enum | none / pending / approved / rejected |
| source | enum | manual / csv\_import / device |
| note | text | nullable |

### Overtime Request

Formal approval record when overtime_minutes > 0.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| attendance_log_id | fk | |
| employee_id | fk | |
| overtime_minutes | integer | |
| reason | text | |
| status | enum | pending / approved / rejected |
| actioned_by | fk → users | |
| actioned_at | timestamp | nullable |

### Monthly Attendance Summary

Pre-computed per employee per month. Regenerated when logs change. Consumed by payroll run.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| employee_id | fk | |
| month | integer | |
| year | integer | |
| working_days | integer | total scheduled working days |
| present_days | decimal | includes half-days as 0.5 |
| late_days | integer | |
| absent_days | decimal | |
| leave_days | decimal | from approved leave applications |
| holiday_days | integer | |
| overtime_minutes | integer | approved OT only |

---

## User Stories

- As HR, I can define shifts so the system knows expected start/end times per employee.
- As HR, I can assign shifts to employees or whole departments.
- As HR, I can enter daily attendance manually for a single employee or a department.
- As HR, I can import a month's attendance via CSV so bulk entry is fast.
- As an Employee, I can view my own attendance log and monthly summary.
- As a Manager, I can view attendance for my direct reports.
- As HR, I can approve or reject overtime requests before they count in payroll.
- As Payroll, I can access the monthly summary for any employee when running payroll.

---

## Routes

```
GET|POST                 /attendance/shifts
PUT|DELETE               /attendance/shifts/{shift}
DELETE                   /attendance/shifts/bulk-delete

GET|POST                 /attendance/shift-assignments
PUT|DELETE               /attendance/shift-assignments/{assignment}

GET                      /attendance/logs                          (daily grid — HR view)
POST                     /attendance/logs                          (manual entry)
PUT                      /attendance/logs/{log}
POST                     /attendance/logs/import                   (CSV upload)

GET                      /attendance/overtime
POST                     /attendance/overtime/{request}/approve
POST                     /attendance/overtime/{request}/reject

GET                      /attendance/summary                       (monthly summary — HR view)
GET                      /attendance/summary/{employee}/{year}/{month}
POST                     /attendance/summary/regenerate            (recompute for a month)
```

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_ATTENDANCE_SHIFT` | View shifts |
| `MANAGE_ATTENDANCE_SHIFT` | Create / edit / delete shifts |
| `READ_ATTENDANCE` | View attendance logs (own = always; others = this permission) |
| `MANAGE_ATTENDANCE` | Enter / edit / import attendance |
| `APPROVE_ATTENDANCE_OVERTIME` | Approve overtime requests |
| `READ_ATTENDANCE_SUMMARY` | View monthly summaries |

---

## CSV Import Format

```csv
employee_id,date,check_in,check_out,note
EMP-0001,2025-11-01,09:05,18:10,
EMP-0001,2025-11-02,,,absent
```

Validation: employee_id must exist; date must be in the selected import month; time format HH:MM.
Duplicate rows for same employee+date: overwrite existing log (upsert).

---

## Status Resolution Logic

For each employee+date:

```
if date is holiday → status: holiday
if date is shift.weekend_day → status: weekend
if no check_in and no leave approved → status: absent
if leave approved for this date → status: on_leave
if check_in present:
  late_minutes = check_in - shift.start_time (if > grace_minutes → late)
  working_minutes = check_out - check_in - break_minutes
  if working_minutes < (shift_duration / 2) → half_day
  else → present (or late if late_minutes > grace_minutes)
  overtime_minutes = max(0, working_minutes - shift_duration - threshold)
```

---

## UI Notes

- Daily grid: rows = employees, columns = days of month; cell = status badge; click to edit.
- Filter by department, branch, shift, date range.
- CSV import: upload → preview table with validation errors highlighted → confirm import.
- Overtime queue: list of pending OT requests with employee, date, minutes, reason; bulk approve.
- Monthly summary: table with per-employee row and day-count columns; exportable to Excel.

---

## Dependencies

- Employee (whose attendance)
- Configuration (Branch, Department for filtering)
- Shift (expected hours)
- Leave (approved leaves pre-populate on_leave status)
- Payroll (monthly summary consumed in payroll run)
- Notifications (overtime approval/rejection notified)
