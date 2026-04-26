# Module Spec: Separation & Offboarding

**Status:** Planned
**Module Key:** `separation`

---

## Overview

Separation handles the end of an employment relationship — resignation, termination, or contract expiry. It produces a final settlement calculation (gratuity, unpaid leave encashment, last payslip), manages exit clearance, and generates separation documents (NOC, experience letter).

---

## Entities

### Separation

The primary record for an employee's exit.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| employee_id | fk | |
| type | enum | resignation / termination / contract\_expiry / retirement |
| notice_date | date | date notice was given / received |
| last_working_date | date | |
| reason | text | |
| initiated_by | enum | employee / hr / management |
| status | enum | pending / approved / completed / cancelled |
| approved_by | fk → users | nullable |
| approved_at | timestamp | nullable |
| notes | text | nullable |

### Exit Checklist

Clearance sign-offs required before full and final settlement is processed.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| separation_id | fk | |
| tasks | relation | hasMany ExitTask |

### Exit Task

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| exit_checklist_id | fk | |
| title | string | e.g. "Return laptop", "Clear dues with Finance" |
| assigned_department | string | nullable |
| status | enum | pending / cleared |
| cleared_by | fk → users | nullable |
| cleared_at | timestamp | nullable |
| notes | text | nullable |

### Final Settlement

Computed financial settlement on separation.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| separation_id | fk | |
| last_payslip_amount | decimal | pro-rata salary for partial month |
| leave_encashment_days | decimal | unused annual leave |
| leave_encashment_amount | decimal | |
| gratuity_amount | decimal | computed from service years |
| pf_employee_balance | decimal | accumulated employee PF contributions |
| pf_employer_balance | decimal | accumulated employer PF contributions |
| other_deductions | decimal | loans, advances, etc. |
| total_payable | decimal | computed |
| status | enum | pending / approved / paid |
| approved_by | fk → users | nullable |
| paid_at | timestamp | nullable |

### Separation Document

Generated letters and certificates for the departing employee.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| separation_id | fk | |
| type | enum | noc / experience\_letter / relieving\_letter |
| generated_at | timestamp | |
| file | file | Spatie Media — generated PDF |

---

## User Stories

- As an Employee, I can submit my resignation with notice date and reason.
- As HR, I can receive a resignation request and approve or reject it.
- As HR, I can initiate a termination for an employee with reason and last working date.
- As HR, I can generate an exit checklist so all departments clear the employee before they leave.
- As HR, I can compute the final settlement (gratuity, leave encashment, last payslip) automatically.
- As HR/Finance, I can approve and mark the final settlement as paid.
- As HR, I can generate a relieving letter, NOC, or experience letter as a PDF.
- Once fully separated, the employee's status is updated to `terminated` / `resigned` so they can no longer log in.

---

## Routes

```
GET|POST                 /separation
GET                      /separation/{separation}
PUT                      /separation/{separation}
POST                     /separation/{separation}/approve
POST                     /separation/{separation}/cancel

GET                      /separation/{separation}/checklist
POST                     /separation/{separation}/checklist/tasks/{task}/clear

GET|POST                 /separation/{separation}/settlement
POST                     /separation/{separation}/settlement/approve
POST                     /separation/{separation}/settlement/mark-paid

POST                     /separation/{separation}/documents/generate   (type in body)
GET                      /separation/{separation}/documents/{document} (download PDF)
```

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_SEPARATION` | View separations (own = always; others = this permission) |
| `CREATE_SEPARATION` | Submit resignation or initiate separation |
| `APPROVE_SEPARATION` | Approve / reject separation |
| `MANAGE_SEPARATION_CHECKLIST` | Clear exit tasks |
| `MANAGE_SEPARATION_SETTLEMENT` | Compute and approve final settlement |
| `GENERATE_SEPARATION_DOCUMENT` | Generate NOC / experience / relieving letters |

---

## Gratuity Calculation (Bangladesh Labor Law 2006)

```
service_years = floor(days_between(joining_date, last_working_date) / 365)

if service_years >= 1:
  gratuity = (last_basic_salary / 26) * 30 * service_years
             -- 30 days basic per year of service
else:
  gratuity = 0  -- ineligible under 1 year
```

Configurable per company: some companies offer enhanced gratuity (e.g. 45 days per year after 5 years).

---

## Leave Encashment Calculation

```
unused_annual_leave_days = leave_balance(employee, "Annual Leave", current_year).remaining_days
per_day_rate = last_gross_salary / working_days_in_last_month
leave_encashment = unused_annual_leave_days * per_day_rate
```

---

## Workflow

```
Resignation submitted / Termination initiated → status: pending
  ↓
HR approves → status: approved; last_working_date set; exit checklist auto-created
  ↓
Departments clear exit tasks → all tasks cleared
  ↓
HR computes final settlement → settlement.status: pending
  ↓
Finance approves settlement → settlement.status: approved
  ↓
HR generates documents
  ↓
Finance marks settlement paid → settlement.status: paid
  ↓
Employee record status updated → resigned / terminated; login disabled
Separation status → completed
```

---

## UI Notes

- Separation list: filterable by type, status, last working date range.
- Exit checklist: grouped by department; task rows with status toggle and notes.
- Settlement page: read-only computed breakdown with approve/pay actions at the bottom.
- Document generation: button per type → spinner while PDF is generated → download link.

---

## Dependencies

- Employee (subject; status updated on completion)
- Leave (remaining balance for encashment calculation)
- Payroll (last basic/gross salary for gratuity and encashment)
- UAM (login disabled on completion)
- Notifications (resignation received, settlement approved, documents ready)
