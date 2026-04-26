# Module Spec: Reporting & Analytics

**Status:** Planned
**Module Key:** `reporting`

---

## Overview

Reporting provides pre-built HR and payroll reports for management and compliance. All reports support date-range filtering, department/branch scoping, and export to PDF and Excel. Bangladesh-specific compliance reports (NBR tax statement) are first-class.

---

## Reports Inventory

### HR Reports

| Report | Description | Key Filters |
|---|---|---|
| Headcount | Employee count by dept / designation / branch / employment type | Date range, department, status |
| Joiners & Leavers | New hires and exits in a period | Month/year, department |
| Turnover Rate | Exits / avg headcount × 100 | Year, department |
| Employee Directory | Exportable list with all profile fields | Department, status, branch |
| Birthday List | Upcoming birthdays for HR engagement | Month |
| Confirmation Due | Employees whose probation ends in a period | Date range |
| Contract Expiry | Employees with upcoming contract end dates | Date range |

### Payroll Reports

| Report | Description | Key Filters |
|---|---|---|
| Payroll Summary | Total gross / deductions / net / tax / PF per department | Month/year, department, branch |
| Payroll Register | Per-employee breakdown for a payroll run | Payroll run, department |
| Bank Transfer List | Employee name, account, net salary for disbursement | Payroll run, branch |
| PF Statement | Employee + employer PF contributions per month | Month/year, employee |
| Salary Increment History | Salary changes over time per employee | Employee, date range |

### Attendance Reports

| Report | Description | Key Filters |
|---|---|---|
| Attendance Register | Daily status grid per employee for a month | Month/year, department |
| Late Arrival Report | Employees with late marks in a period | Date range, department |
| Absenteeism Report | Absent days per employee | Month/year, department |
| Overtime Report | Approved overtime hours per employee | Month/year, department |

### Leave Reports

| Report | Description | Key Filters |
|---|---|---|
| Leave Balance Summary | Entitled / used / remaining per leave type per employee | Year, department |
| Leave Application Register | All leave applications in a period | Date range, type, status, department |
| Leave Utilization | % of quota used per leave type across the company | Year |

### Compliance Reports (Bangladesh)

| Report | Description | Notes |
|---|---|---|
| Income Tax Statement (12BB) | Annual taxable income and deduction breakdown per employee | NBR format; fiscal year |
| TDS Certificate | Monthly tax deducted at source per employee | Per payroll run |
| PF Register | Combined employer + employee PF contributions (monthly + annual) | Bangladesh PF rules |

---

## Data Model

Reports are generated on the fly (no pre-stored report records needed in v1). A `ReportFilter` value object is passed to each report generator service.

```php
class ReportFilter {
    string $reportType;
    ?Carbon $from;
    ?Carbon $to;
    ?int $departmentId;
    ?int $branchId;
    ?int $employeeId;
    ?string $year;
    ?int $month;
    ?int $payrollRunId;
}
```

Each report is a service class in `app/Services/Reporting/` implementing:

```php
interface ReportGenerator {
    public function data(ReportFilter $filter): Collection;
    public function export(ReportFilter $filter, string $format): BinaryFileResponse;
}
```

---

## User Stories

- As HR, I can run a headcount report for any date range and export it to Excel for the MD.
- As Finance, I can download a bank transfer list from a payroll run to upload to the bank portal.
- As HR, I can generate NBR tax statements (12BB) for all employees at year end.
- As a Manager, I can view the attendance register for my department for any month.
- As HR, I can see which employees are due for confirmation in the next 30 days.
- As Finance, I can track PF contributions per employee for monthly remittance.

---

## Routes

```
GET  /reports                         → ReportController@index  (report catalog page)
POST /reports/{type}/preview          → ReportController@preview (returns paginated data)
POST /reports/{type}/export/excel     → ReportController@exportExcel
POST /reports/{type}/export/pdf       → ReportController@exportPdf
```

All routes accept the filter payload as JSON body.

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_REPORTING_HR` | Access HR reports |
| `READ_REPORTING_PAYROLL` | Access payroll reports (Finance role) |
| `READ_REPORTING_ATTENDANCE` | Access attendance reports |
| `READ_REPORTING_LEAVE` | Access leave reports |
| `READ_REPORTING_COMPLIANCE` | Access NBR / PF compliance reports |

---

## Export Formats

- **Excel:** Laravel Excel (Maatwebsite) — tabular sheet per report, formatted header row.
- **PDF:** Laravel DomPDF — company letterhead, report title, filter summary, data table.

Both formats include: company name, report title, generated date, applied filters in the header.

---

## UI Notes

- Report catalog: card grid grouped by category (HR / Payroll / Attendance / Leave / Compliance).
- Each card: report name, description, "Run" button.
- Run modal: filter form → preview table (paginated, first 50 rows) → Export PDF / Excel buttons.
- Complex reports (e.g. 12BB): no preview table — direct download only.
- Slow reports (large datasets): trigger as queued job → notify user when ready → download link.

---

## Dependencies

- All modules (reports read from their data)
- Payroll (payroll run data, salary profiles)
- Attendance (logs and summaries)
- Leave (balances and applications)
- Employee (profile data for all reports)
- Notifications (download-ready notification for queued exports)
