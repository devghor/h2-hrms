# Module Spec: Announcements

**Status:** Planned
**Module Key:** `announcements`

---

## Overview

Announcements let HR broadcast messages — policy updates, event notices, company news — to all employees or a targeted subset (by department, branch, or designation). Employees see them on their self-service dashboard and can acknowledge time-sensitive ones. HR sees read/acknowledgement rates.

---

## Entities

### Announcement

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| company_id | fk | |
| title | string | |
| body | text (rich) | HTML from a rich text editor |
| type | enum | general / policy / event / urgent |
| audience | enum | all / department / branch / designation |
| audience_ids | json | array of department/branch/designation IDs; null = all |
| requires_acknowledgement | boolean | |
| acknowledgement_deadline | date | nullable |
| published_at | timestamp | nullable — null = draft |
| expires_at | timestamp | nullable — hidden after this date |
| created_by | fk → users | |
| status | enum | draft / published / expired |
| attachments | relation | Spatie Media |

### Announcement Read

Tracks which users have seen an announcement.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| announcement_id | fk | |
| user_id | fk | |
| read_at | timestamp | |
| acknowledged_at | timestamp | nullable |

---

## User Stories

- As HR, I can draft an announcement and publish it when ready so it doesn't go out before I'm done.
- As HR, I can target an announcement to a specific department or branch rather than the whole company.
- As HR, I can mark an announcement as requiring acknowledgement so I know who has seen it.
- As HR, I can see read and acknowledgement rates per announcement.
- As an Employee, I can see the latest announcements on my dashboard.
- As an Employee, I can acknowledge a required announcement by clicking confirm.
- As an Employee, I can view a full list of all announcements visible to me.

---

## Routes

```
GET|POST                 /announcements
GET|PUT|DELETE           /announcements/{announcement}
POST                     /announcements/{announcement}/publish
DELETE                   /announcements/bulk-delete

GET                      /announcements/{announcement}/reads      (HR — read stats)

-- Self-service (employee-facing) --
GET                      /me/announcements                        (employee list, filtered by audience)
GET                      /me/announcements/{announcement}
POST                     /me/announcements/{announcement}/acknowledge
```

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_ANNOUNCEMENT` | View all announcements (HR management view) |
| `CREATE_ANNOUNCEMENT` | Create and publish announcements |
| `UPDATE_ANNOUNCEMENT` | Edit announcements |
| `DELETE_ANNOUNCEMENT` | Delete announcements |

All authenticated employees can view announcements targeted to them (no explicit permission required — audience scoping handles visibility).

---

## Audience Filtering Logic

When an employee views announcements:

```sql
SELECT * FROM announcements
WHERE status = 'published'
  AND (expires_at IS NULL OR expires_at > NOW())
  AND (
    audience = 'all'
    OR (audience = 'department' AND JSON_CONTAINS(audience_ids, employee.department_id))
    OR (audience = 'branch'     AND JSON_CONTAINS(audience_ids, employee.branch_id))
    OR (audience = 'designation' AND JSON_CONTAINS(audience_ids, employee.designation_id))
  )
ORDER BY published_at DESC
```

---

## Notification Integration

When an announcement is published:
- Create an in-app notification for every user in the target audience
- Notification data: title = announcement title, action_url = `/me/announcements/{id}`
- If `requires_acknowledgement = true`, notification severity = `warning`

---

## UI Notes

- HR list: DataTable with title, type badge, audience, published date, read % / ack % columns.
- Create / edit: rich text body (Tiptap or similar), audience selector with conditional multi-select for department/branch/designation IDs.
- Read stats page: table of employees in target audience with read_at and acknowledged_at columns.
- Employee list: card grid; unread announcements have a "New" badge; required-acknowledgement ones have a prominent "Acknowledge" button.
- Dashboard widget: latest 3 published announcements as summary cards with title, type badge, date.

---

## Dependencies

- Employee (audience scoping — department, branch, designation)
- Notifications (publish event fires notifications)
- Self-Service (dashboard feed, full list, acknowledgement action)
