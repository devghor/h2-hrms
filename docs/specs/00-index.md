# H2-HRMS — Module Specifications Index

**Project:** H2-HRMS
**Stack:** Laravel 12 + React 19 + Inertia.js 2
**Last Updated:** 2026-04-26

---

## Modules

| # | Module | Spec | Status |
|---|---|---|---|
| 01 | User Access Management | [uam.md](01-uam.md) | Implemented |
| 02 | Configuration | [configuration.md](02-configuration.md) | Implemented (minor gaps) |
| 03 | Employee | [employee.md](03-employee.md) | Implemented |
| 04 | Payroll | [payroll.md](04-payroll.md) | Partial — needs payroll run engine |
| 05 | Leave Management | [leave.md](05-leave.md) | Planned |
| 06 | Attendance | [attendance.md](06-attendance.md) | Planned |
| 07 | Recruitment | [recruitment.md](07-recruitment.md) | Planned |
| 08 | Performance Management | [performance.md](08-performance.md) | Planned |
| 09 | Separation & Offboarding | [separation.md](09-separation.md) | Planned |
| 10 | Reporting & Analytics | [reporting.md](10-reporting.md) | Planned |
| 11 | Employee Self-Service | [self-service.md](11-self-service.md) | Planned |
| 12 | Notifications | [notifications.md](12-notifications.md) | Implemented |
| 13 | Announcements | [announcements.md](13-announcements.md) | Planned |

---

## Convention Reference

All new entities follow this implementation order:

```
Migration → Model → Service (extends CoreService)
→ DataTable (extends BaseDataTable) → Form Requests (Store/Update)
→ Controller → Routes (resource + bulk-delete)
→ Frontend page (resources/js/pages/<module>/<entity>/index.tsx)
→ Sidebar entry (resources/js/config/sidebar.ts)
→ Breadcrumb entry (resources/js/config/breadcrumbs.ts)
→ Permission enum entries + seeder
```

Permission naming: `CREATE_<MODULE>` / `READ_<MODULE>` / `UPDATE_<MODULE>` / `DELETE_<MODULE>`
For sub-actions: `APPROVE_<MODULE>_<ACTION>`
