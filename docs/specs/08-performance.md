# Module Spec: Performance Management

**Status:** Planned
**Module Key:** `performance`

---

## Overview

Performance management runs structured appraisal cycles: HR defines the cycle period and eligibility, employees complete self-assessments against KPIs, managers review and rate, HR calibrates final scores. Historical appraisals are stored per employee for career tracking.

---

## Entities

### KPI Template

A reusable set of goals/metrics that HR assigns to a designation or appraisal cycle.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| name | string | e.g. "Software Engineer KPIs" |
| designation_id | fk | nullable — null = generic |
| items | relation | hasMany KpiTemplateItem |

### KPI Template Item

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| kpi_template_id | fk | |
| title | string | e.g. "Code Quality" |
| description | text | nullable |
| weight | decimal | % weight in final score; all items in a template should sum to 100 |
| rating_scale | integer | max rating, e.g. 5 |

### Appraisal Cycle

A time-bounded review period.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| name | string | e.g. "Annual 2025", "Mid-Year 2025" |
| period_start | date | |
| period_end | date | |
| self_assessment_due | date | deadline for employee submissions |
| manager_review_due | date | deadline for manager reviews |
| status | enum | draft / active / calibration / closed |
| kpi_template_id | fk | default template; can be overridden per appraisee |

### Appraisal

One appraisal record per employee per cycle.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| appraisal_cycle_id | fk | |
| employee_id | fk | appraisee |
| manager_id | fk → employees | reviewer |
| kpi_template_id | fk | may differ from cycle default |
| self_score | decimal | computed from self-assessment item ratings |
| manager_score | decimal | computed from manager review item ratings |
| final_score | decimal | HR-calibrated, defaults to manager_score |
| overall_rating | enum | outstanding / exceeds\_expectations / meets\_expectations / needs\_improvement / unsatisfactory |
| status | enum | pending / self\_submitted / manager\_reviewed / calibrated / acknowledged |
| employee_acknowledged_at | timestamp | nullable |

### Appraisal Item

Per-KPI rating from employee (self) and manager.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| appraisal_id | fk | |
| kpi_template_item_id | fk | |
| self_rating | integer | nullable — filled by employee |
| self_comment | text | nullable |
| manager_rating | integer | nullable — filled by manager |
| manager_comment | text | nullable |

---

## User Stories

- As HR, I can create KPI templates per designation so appraisal criteria are standardized.
- As HR, I can open an appraisal cycle for a period and assign eligible employees.
- As an Employee, I can complete my self-assessment by rating myself on each KPI before the deadline.
- As a Manager, I can review and rate my direct reports' appraisals and add written feedback.
- As HR, I can calibrate final scores across the team to normalize ratings.
- As an Employee, I can acknowledge my final appraisal result.
- As HR, I can view appraisal history for any employee.
- As HR, I can export the cycle results to Excel for compensation review meetings.

---

## Routes

```
GET|POST                 /performance/kpi-templates
GET|PUT|DELETE           /performance/kpi-templates/{template}

GET|POST                 /performance/cycles
GET|PUT|DELETE           /performance/cycles/{cycle}
POST                     /performance/cycles/{cycle}/activate
POST                     /performance/cycles/{cycle}/close

GET                      /performance/appraisals                   (HR — all appraisals)
GET                      /performance/appraisals/my                (employee — own)
GET                      /performance/appraisals/team              (manager — direct reports)
GET                      /performance/appraisals/{appraisal}
POST                     /performance/appraisals/{appraisal}/self-submit
POST                     /performance/appraisals/{appraisal}/manager-review
POST                     /performance/appraisals/{appraisal}/calibrate
POST                     /performance/appraisals/{appraisal}/acknowledge
```

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_PERFORMANCE_KPI_TEMPLATE` | View KPI templates |
| `MANAGE_PERFORMANCE_KPI_TEMPLATE` | Create / edit templates |
| `READ_PERFORMANCE_CYCLE` | View appraisal cycles |
| `MANAGE_PERFORMANCE_CYCLE` | Create / edit / open / close cycles |
| `READ_PERFORMANCE_APPRAISAL` | View all appraisals (HR) |
| `SUBMIT_PERFORMANCE_SELF_ASSESSMENT` | Submit own self-assessment (all employees) |
| `REVIEW_PERFORMANCE_APPRAISAL` | Submit manager review (managers) |
| `CALIBRATE_PERFORMANCE_APPRAISAL` | Adjust final scores (HR) |

---

## Score Calculation

```
For each appraisal item:
  weighted_self_score    += (self_rating / rating_scale) * weight
  weighted_manager_score += (manager_rating / rating_scale) * weight

self_score    = weighted_self_score    (0–100)
manager_score = weighted_manager_score (0–100)
final_score   = HR-entered value, defaults to manager_score
```

Overall rating bands (configurable per company):

| Score Range | Rating |
|---|---|
| 90–100 | Outstanding |
| 75–89 | Exceeds Expectations |
| 60–74 | Meets Expectations |
| 40–59 | Needs Improvement |
| 0–39 | Unsatisfactory |

---

## UI Notes

- Cycle list: status pipeline badge; actions change based on status (activate / close).
- Employee self-assessment: form with one row per KPI — slider or 1–5 star rating + comment textarea.
- Manager review: same form layout but shows employee's self-rating alongside for comparison.
- Calibration: table of all appraisees with self / manager / final score columns; HR edits final_score inline.
- Appraisal history: timeline per employee showing cycle name, date, final score, overall rating.

---

## Dependencies

- Employee (appraisee, manager)
- Configuration (Designation for KPI template default)
- Notifications (deadlines, status changes)
