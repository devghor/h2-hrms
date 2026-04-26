# Module Spec: Recruitment

**Status:** Planned
**Module Key:** `recruitment`

---

## Overview

Recruitment covers the full hiring pipeline: posting a vacancy, tracking applicants through stages, scheduling interviews, extending offers, and converting accepted candidates into employee records (onboarding). It is internal-HR-facing in v1; a public-facing job portal is out of scope.

---

## Entities

### Job Posting

An open vacancy that HR is hiring for.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| title | string | |
| department_id | fk | |
| designation_id | fk | |
| branch_id | fk | |
| vacancies | integer | number of open seats |
| employment_type | enum | permanent / contract / part-time |
| description | text | nullable |
| requirements | text | nullable |
| deadline | date | application close date |
| status | enum | draft / open / closed / cancelled |
| created_by | fk → users | |

### Applicant

A candidate for a specific job posting.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| job_posting_id | fk | |
| first_name | string | |
| last_name | string | |
| email | string | |
| phone | string | |
| cv | file | Spatie Media |
| source | enum | direct / referral / linkedin / other |
| referred_by | fk → employees | nullable |
| stage | enum | applied / screening / interview / offer / hired / rejected |
| rejection_reason | text | nullable |
| notes | text | nullable |
| applied_at | timestamp | |

### Interview

A scheduled interview session for an applicant.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| applicant_id | fk | |
| round | integer | 1st, 2nd, final |
| type | enum | phone / video / in-person |
| scheduled_at | datetime | |
| location | string | nullable — room or video link |
| interviewers | relation | many-to-many → users |
| status | enum | scheduled / completed / cancelled |
| outcome | enum | pass / fail / on-hold — nullable until completed |
| feedback | text | nullable |

### Offer Letter

Formal offer extended to a passed applicant.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| applicant_id | fk | |
| salary_structure_id | fk | proposed structure |
| basic_salary | decimal | |
| joining_date | date | proposed |
| expires_at | date | offer validity |
| status | enum | draft / sent / accepted / rejected / expired |
| generated_at | timestamp | nullable |
| responded_at | timestamp | nullable |
| notes | text | nullable |

### Onboarding Checklist

Task list created when an offer is accepted.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| applicant_id | fk | |
| employee_id | fk | nullable — linked once employee record is created |
| tasks | relation | hasMany OnboardingTask |

### Onboarding Task

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| onboarding_checklist_id | fk | |
| title | string | e.g. "Collect NID copy", "Issue laptop" |
| assigned_to | enum | hr / employee |
| due_date | date | nullable |
| status | enum | pending / completed |
| completed_at | timestamp | nullable |

---

## User Stories

- As HR, I can create job postings for open vacancies so the hiring pipeline is tracked.
- As HR, I can add applicants manually (internal-facing in v1) and upload their CVs.
- As HR, I can move applicants through stages (screening → interview → offer → hired).
- As HR, I can schedule interviews and assign interviewers from the user list.
- As an Interviewer, I receive a notification about my scheduled interview and can record feedback.
- As HR, I can generate an offer letter from a template and mark it as sent.
- As HR, I can convert an accepted applicant into an employee record with one action.
- As HR, I can track onboarding tasks and mark them complete as the new hire gets set up.

---

## Routes

```
GET|POST                 /recruitment/job-postings
GET|PUT|DELETE           /recruitment/job-postings/{posting}
DELETE                   /recruitment/job-postings/bulk-delete
POST                     /recruitment/job-postings/{posting}/close

GET|POST                 /recruitment/applicants
GET|PUT|DELETE           /recruitment/applicants/{applicant}
POST                     /recruitment/applicants/{applicant}/move-stage
POST                     /recruitment/applicants/{applicant}/reject

GET|POST                 /recruitment/applicants/{applicant}/interviews
PUT|DELETE               /recruitment/interviews/{interview}
POST                     /recruitment/interviews/{interview}/complete

GET|POST                 /recruitment/applicants/{applicant}/offer
PUT                      /recruitment/offers/{offer}
POST                     /recruitment/offers/{offer}/send
POST                     /recruitment/offers/{offer}/accept        (HR records acceptance)
POST                     /recruitment/offers/{offer}/reject

POST                     /recruitment/applicants/{applicant}/convert-to-employee

GET                      /recruitment/onboarding/{checklist}
PUT                      /recruitment/onboarding/tasks/{task}/complete
```

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_RECRUITMENT_JOB_POSTING` | View job postings |
| `MANAGE_RECRUITMENT_JOB_POSTING` | Create / edit / close postings |
| `READ_RECRUITMENT_APPLICANT` | View applicants and pipeline |
| `MANAGE_RECRUITMENT_APPLICANT` | Add applicants, move stages, schedule interviews |
| `MANAGE_RECRUITMENT_OFFER` | Create and send offer letters |
| `CONVERT_RECRUITMENT_TO_EMPLOYEE` | Convert accepted applicant to employee |
| `MANAGE_RECRUITMENT_ONBOARDING` | Manage onboarding checklists and tasks |

---

## Convert to Employee Logic

When HR triggers convert-to-employee on an accepted offer:
1. Create `Employee` record pre-filled from applicant (name, email, phone, joining_date from offer)
2. Create `EmployeeSalaryProfile` from the offer's salary_structure_id and basic_salary
3. Create `OnboardingChecklist` with default tasks
4. Set applicant.stage = hired, link applicant.employee_id
5. Close the job posting if vacancies = 0

---

## UI Notes

- Job posting list: kanban or table; status filter prominent.
- Applicant pipeline: kanban board per posting with columns per stage; drag to move (triggers stage update).
- Interview scheduler: calendar picker + interviewer multi-select.
- Offer letter: preview modal with template before sending.
- Onboarding checklist: task list split into "HR tasks" and "Employee tasks" tabs.

---

## Dependencies

- Employee (convert applicant; interviewer assignment from users)
- Configuration (Department, Designation, Branch on job posting)
- Payroll (Salary Structure on offer letter)
- Notifications (interview reminders, offer status changes)
