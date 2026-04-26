# Module Spec: Payroll

**Status:** Partial — salary heads/structures/profiles implemented; payroll run engine planned
**Module Key:** `payroll`

---

## Overview

Payroll processes monthly compensation for all active employees. It starts from salary structures (templates), applies them via employee salary profiles, then runs a monthly calculation that accounts for attendance, leaves, tax, PF, and bonus — producing payslips and a disbursement ledger.

Bangladesh-specific requirements: NBR income tax slabs (configurable per fiscal year), provident fund (PF), gratuity accrual, and festival bonus.

---

## Entities

### Salary Head (`payroll_salary_heads`)

A named compensation or deduction component with GL mapping, PF/tax rules, and display ordering.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| name | string | |
| code | string | unique per company |
| is_basic_linked | boolean | value derived from basic ratio |
| basic_ratio | decimal | % of basic when is_basic_linked |
| mode | enum | cash / bank |
| gl_account_code | string | |
| gl_prefix_type | enum | dynamic / static |
| identification_type | enum | basic / lfa / pf_employee / pf_employer / pf_employer_deduction / other |
| category | enum | gross / benefit / deduction / adjustment |
| position | integer | ordering on payslip |
| is_variable | boolean | |
| is_taxable | boolean | included in NBR tax base |
| tax_calculation_type | enum | percentage / fixed / none |
| tax_value | decimal | amount or % depending on tax_calculation_type |
| is_active | boolean | |

### Salary Structure (`payroll_salary_structures`)

A designation-linked pay scale defining basic and benefit multipliers. Assigned per designation with an effective date.

> PF notes: only permanent employees are eligible; probationary employees receive no PF. PF heads: `pf_contribution_company`, `pf_contribution_company_deduction`, `pf_contribution_employee` — all calculated as % of basic.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| designation_id | fk | |
| basic | decimal | |
| annual_increment_percentage | decimal | |
| efficiency_bar | decimal | nullable |
| home_loan_multiplier | decimal | nullable |
| car_loan_max_amount | decimal | nullable |
| car_maintenance_expense | decimal | nullable |
| life_insurance_multiplier | decimal | nullable |
| hospitalization_insurance | decimal | nullable |
| effective_date | date | |
| is_active | boolean | |

### Gratuity Fund Member (`gratuity_fund_members`)

Tracks gratuity accrual per employee. Updated whenever the employee's salary changes.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| employee_id | fk | |
| eligibility_effective_date | date | |
| year_count_date_from | date | |
| year_count_date_to | date | |
| year_count | integer | |
| times_of_basic | decimal | multiplier applied to last basic |
| last_basic | decimal | |
| balance | decimal | accrued gratuity amount |
| last_working_date | date | nullable |
| last_withdrawal_date | date | nullable |
| status | string | |
| is_active | boolean | |

### Salary Disbursement Batch (`salary_disbursement_batches`)

A monthly or special payroll run record. Special batches are uploaded from Excel; monthly batches are system-generated.

> Rules: batch editable only in statuses Generated / Processed / Revert From Approval. Net pay = Gross − Deductions. Salary heads with transaction type Debit = Gross; Credit = Deduction.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| name | string | |
| year | integer | |
| month | integer | 1–12 |
| type | enum | monthly\_salary / special\_batch |
| remark | text | nullable |
| status | enum | generated(0) / processed(2) / sent\_for\_approval(3) / revert\_from\_approval(4) / sent\_for\_disbursement(5) / disbursed(6) |

### Employee Salary Profile (`payroll_employee_salary_profiles`)

Holds the computed salary totals for an employee. Salary certificate is generated from this record.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| user_id | fk | |
| company_id | fk | |
| basic_amount | decimal | |
| gross_amount | decimal | |
| net_amount | decimal | |
| is_active | boolean | |

### Employee Salary Profile Item (`payroll_employee_salary_profile_items`)

Per-head breakdown line for an employee salary profile.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| payroll_employee_salary_profile_id | fk | |
| company_id | fk | |
| payroll_salary_head_id | fk | |
| amount | decimal | |

---

## User Stories

- As HR, I can define salary heads (earnings and deductions) so compensation components are named and typed.
- As HR, I can create salary structures as templates so I don't re-enter the same composition per employee.
- As HR, I can assign a salary structure to an employee with a basic salary and effective date.
- As HR, I can override individual heads on an employee's profile when their allowance differs from the template.
- As HR, I can initiate a payroll run for a given month so all employees' net salaries are calculated automatically.
- As Finance, I can approve a payroll run so it is locked and disbursements can proceed.
- As HR, I can download a payslip PDF for any employee for any processed month.
- As Finance, I can mark employees as disbursed after salaries are transferred.
- As HR, I can configure NBR tax slabs per fiscal year so tax calculations stay accurate without a code change.

---

## Routes

```
-- Implemented --
GET|POST                 /payroll/salary-heads
PUT|DELETE               /payroll/salary-heads/{head}
DELETE                   /payroll/salary-heads/bulk-delete

GET|POST                 /payroll/salary-structures
PUT|DELETE               /payroll/salary-structures/{structure}
DELETE                   /payroll/salary-structures/bulk-delete

GET|POST                 /payroll/employee-salary-profiles
GET                      /payroll/employee-salary-profiles/{profile}

-- Planned --
PUT|DELETE               /payroll/employee-salary-profiles/{profile}
DELETE                   /payroll/employee-salary-profiles/bulk-delete

GET|POST                 /payroll/tax-slabs
PUT|DELETE               /payroll/tax-slabs/{slab}

GET                      /payroll/runs
POST                     /payroll/runs                            (initiate run)
GET                      /payroll/runs/{run}
POST                     /payroll/runs/{run}/approve
POST                     /payroll/runs/{run}/items/{item}/disburse
POST                     /payroll/runs/{run}/bulk-disburse

GET                      /payroll/runs/{run}/items/{item}/payslip  (PDF download)
```

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_PAYROLL_SALARY_HEAD` | View salary heads |
| `CREATE_PAYROLL_SALARY_HEAD` | Create salary heads |
| `UPDATE_PAYROLL_SALARY_HEAD` | Edit salary heads |
| `DELETE_PAYROLL_SALARY_HEAD` | Delete salary heads |
| `READ_PAYROLL_SALARY_STRUCTURE` | View structures |
| `CREATE_PAYROLL_SALARY_STRUCTURE` | ... |
| `UPDATE_PAYROLL_SALARY_STRUCTURE` | ... |
| `DELETE_PAYROLL_SALARY_STRUCTURE` | ... |
| `READ_PAYROLL_EMPLOYEE_SALARY_PROFILE` | View profiles |
| `CREATE_PAYROLL_EMPLOYEE_SALARY_PROFILE` | ... |
| `UPDATE_PAYROLL_EMPLOYEE_SALARY_PROFILE` | ... |
| `DELETE_PAYROLL_EMPLOYEE_SALARY_PROFILE` | ... |
| `READ_PAYROLL_RUN` | View payroll runs and payslips |
| `CREATE_PAYROLL_RUN` | Initiate a payroll run |
| `APPROVE_PAYROLL_RUN` | Approve / lock a run |
| `DISBURSE_PAYROLL_RUN` | Mark salaries as disbursed |

---

## Payroll Run Calculation Logic

```
For each active employee with an active salary profile in the run period:

1. Resolve effective salary profile (latest effective_from ≤ run month)
2. Calculate each earning head:
   - fixed → use value
   - percentage_of_basic → (value / 100) * basic_salary
   - percentage_of_gross → deferred until gross is known (iterative)
3. gross_salary = sum(earning heads)
4. Calculate attendance adjustment:
   - per_day_rate = gross_salary / working_days_in_month
   - absent_deduction = per_day_rate * absent_days
5. Calculate PF employee = pf_rate * basic_salary
6. Calculate income tax:
   - annual_taxable = (gross_salary - pf_employee) * 12
   - apply NBR slabs to get annual_tax
   - monthly_tax = annual_tax / 12
7. Calculate each deduction head (same logic as earnings)
8. net_salary = gross_salary - absent_deduction - income_tax - pf_employee - other_deductions
9. Snapshot all head values into payroll_run_items.heads (JSON)
```

---

## UI Notes

- Salary structure form: master-detail — top form (name, status) + dynamic rows for heads with value inputs.
- Employee salary profile: show page with effective-date history and a breakdown table.
- Payroll run list: status badge pipeline (Draft → Processing → Pending Approval → Approved → Disbursed).
- Run detail: filterable table of all employees with gross / deductions / net columns; bulk disburse action.
- Payslip: printable/PDF-friendly page with company logo, employee info, head breakdown, and net salary.

---

## Known Gaps

| Gap | Fix |
|---|---|
| Employee salary profile missing update/delete | Implement `update`, `destroy`, `bulkDelete` on `EmployeeSalaryProfileController` |
| No payroll run engine | Implement `PayrollRunService` with calculation logic above |
| No tax slab management UI | Add `TaxSlabController` + frontend page |
| Payslip PDF generation | Integrate Laravel DomPDF or Browsershot |

---

## Dependencies

- Configuration (Company for fiscal year, Branch for grouping)
- Employee (profiles and attendance data)
- Attendance (working days, absent days, overtime per month)
- Leave (approved leave days per month)
