# Module Spec: Employee Self-Service

**Status:** Planned
**Module Key:** `self_service`

---

## Overview

Self-service gives employees a personal dashboard to view their own data, download payslips, apply for leave, check attendance, and update non-sensitive personal details without raising an HR ticket. It reduces HR's admin workload and improves employee satisfaction.

Self-service is not a separate app — it is a role-restricted view within the same Inertia frontend. An employee who lacks HR/Manager permissions automatically lands on the self-service dashboard.

---

## Features

### Personal Dashboard

| Widget | Data |
|---|---|
| My Profile summary | Name, photo, designation, department, employee ID |
| Leave balance | Cards per leave type showing remaining days |
| Upcoming holidays | Next 3 public / company holidays |
| Pending tasks | Onboarding tasks, acknowledgements pending |
| Recent announcements | Latest 3 notices from Announcements module |
| Next payslip | Last processed payslip date and net amount |

---

### My Profile

- View full profile (read-only)
- Edit personal contact details (mobile, personal email, emergency contact)
- Upload personal documents (NID, certificates) — visible to HR, not editable by HR without permission
- Profile photo update
- Changes to sensitive fields (address, NID) trigger an HR review notification before committing

---

### My Payslips

- List of processed payslips (month/year, net salary, status)
- Download PDF per payslip
- No access to other employees' payslips

---

### My Leave

- Leave balance cards (entitled / used / remaining per type)
- Leave application form (type, from, to, reason, document upload if required)
- My applications list (status filter: pending / approved / rejected / cancelled)
- Cancel a pending application
- View leave calendar showing own approved leaves and team leave (read-only)

---

### My Attendance

- Monthly attendance grid (own only)
- Daily status badges
- Summary row: present days, late days, absent days, overtime hours
- No ability to edit own attendance

---

### My Appraisals

- List of appraisal cycles the employee has been included in
- Complete self-assessment form (when cycle is active and deadline not passed)
- View final appraisal result (once calibrated and acknowledged)
- Acknowledge final result (button)

---

### My Separation

- Submit resignation form (accessible while status = active)
- View separation status and last working date
- View exit checklist tasks assigned to self
- Download generated documents (NOC, experience letter, relieving letter)

---

## Data Access Rules

| Resource | Employee Sees | Employee Can Edit |
|---|---|---|
| Own profile | All fields | Contact, photo, personal docs |
| Other profiles | No | No |
| Own payslips | Own only | No |
| Leave applications | Own only | Cancel pending |
| Attendance logs | Own only | No |
| Own appraisals | Own only | Self-assessment while open |
| Team leave calendar | Team (read-only) | No |

---

## Routes

All self-service routes are within the `/me` prefix and automatically scoped to `Auth::user()->employee`.

```
GET   /me                              → dashboard
GET   /me/profile
PUT   /me/profile/contact              → update personal contact
PUT   /me/profile/photo

GET   /me/payslips
GET   /me/payslips/{run}/download      → PDF

GET   /me/leave
POST  /me/leave/apply
DELETE /me/leave/{application}/cancel

GET   /me/attendance/{year}/{month}

GET   /me/appraisals
GET   /me/appraisals/{appraisal}
POST  /me/appraisals/{appraisal}/submit

GET   /me/separation
POST  /me/separation/resign
GET   /me/separation/checklist
GET   /me/separation/documents/{document}
```

---

## Permissions

Self-service routes are available to all authenticated users with an associated employee record — no explicit permission enum entries needed. The automatic scoping to `Auth::user()->employee` enforces data isolation.

Manager-specific additions (require `READ_EMPLOYEE` or team-scoped permission):
- Team leave calendar
- Direct reports' appraisal review

---

## UI Notes

- Self-service dashboard replaces the general dashboard for users without HR permissions.
- Layout same as the main app (AppLayout) but sidebar items are limited to self-service sections.
- Profile photo upload: inline drag-drop zone on the profile page.
- Leave application: inline dialog with date range picker, auto-calculates days (excluding weekends/holidays).
- Payslip list: table with month/year, net salary, download button per row.
- Attendance grid: same component as HR view, but read-only and pre-filtered to own records.

---

## Dependencies

- Employee (own record; `user_id` FK on employees table)
- Payroll (payslip download)
- Leave (balance, applications)
- Attendance (own logs)
- Performance (self-assessment, appraisal results)
- Separation (resignation submit, document download)
- Announcements (dashboard feed)
- Notifications (approval / rejection events)
