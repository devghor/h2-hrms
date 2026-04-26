# Module Spec: Notifications

**Status:** Implemented
**Module Key:** `notifications`

---

## Overview

Notifications deliver in-app alerts to users when system events require their attention — approvals pending, status changes, deadlines approaching. Notifications appear in a header dropdown and are marked read individually or in bulk.

---

## Entities

### Notification

| Field | Type | Notes |
|---|---|---|
| id | uuid | Laravel default |
| type | string | FQCN of the notification class |
| notifiable_type | string | `App\Models\User` |
| notifiable_id | bigint | user receiving the notification |
| data | json | title, message, action_url, icon |
| read_at | timestamp | null = unread |
| created_at | timestamp | |

Uses Laravel's built-in `notifications` table.

---

## Notification Events (Current + Planned)

| Trigger | Recipients | Module |
|---|---|---|
| Leave application submitted | Manager of applicant | Leave |
| Leave approved / rejected | Applicant | Leave |
| Overtime request submitted | Manager | Attendance |
| Overtime approved / rejected | Employee | Attendance |
| Interview scheduled | Interviewers | Recruitment |
| Offer letter sent | Applicant (email only in v1) | Recruitment |
| Appraisal cycle opened | All eligible employees | Performance |
| Self-assessment deadline approaching (3 days) | Employees with pending self-assessment | Performance |
| Manager review deadline approaching (3 days) | Managers with pending reviews | Performance |
| Appraisal result ready | Employee | Performance |
| Resignation received | HR users with APPROVE_SEPARATION | Separation |
| Final settlement approved | Employee (separating) | Separation |
| Separation document ready | Employee (separating) | Separation |
| Payroll run completed | Finance / HR with READ_PAYROLL_RUN | Payroll |
| Report export ready (queued) | User who requested export | Reporting |
| Announcement published | All employees in target scope | Announcements |

---

## User Stories

- As any user, I can see unread notification count in the header bell icon.
- As any user, I can open the notification dropdown to see my latest notifications.
- As any user, I can mark a single notification as read.
- As any user, I can mark all notifications as read at once.
- As any user, I can click a notification to navigate to the relevant resource.
- As any user, I can view all notifications (paginated) beyond the dropdown's latest 10.

---

## Routes

```
GET    /notifications             → NotificationController@index    (paginated list page)
GET    /notifications/dropdown    → NotificationController@dropdown (latest 10 + unread count)
POST   /notifications/{id}/read   → NotificationController@markRead
POST   /notifications/read-all    → NotificationController@markAllRead
DELETE /notifications/{id}        → NotificationController@destroy
```

---

## Permissions

No explicit permission enum entries. All authenticated users receive and manage their own notifications. Scoping to `auth()->user()` enforces isolation.

---

## Notification Data Shape

The `data` JSON column follows a consistent shape so the frontend can render any notification without type-specific logic:

```json
{
  "title": "Leave Approved",
  "message": "Your Annual Leave from Nov 10–12 has been approved.",
  "action_url": "/me/leave",
  "icon": "calendar-check",
  "severity": "success"
}
```

`severity`: `info` / `success` / `warning` / `error` — maps to icon color.

---

## UI Notes

- Header bell icon: badge showing unread count (hidden when 0).
- Dropdown: max 10 items; unread items have a highlighted left border; timestamps shown as relative ("2 hours ago").
- "View all" link opens the full notifications list page.
- Full list: paginated DataTable with mark-read toggle and delete per row.
- Notification row click navigates to `action_url` and marks the notification read.

---

## Email Delivery (Planned)

In v1 all notifications are in-app only. Email delivery is planned via Laravel's mail channel, using Markdown mail templates. Users can configure per-notification-type preferences (in-app only / email only / both) in their profile settings.

---

## Known Gaps

- Notification events for modules not yet built (Leave, Attendance, etc.) cannot fire until those modules exist.
- Email delivery not yet implemented.

---

## Dependencies

- UAM (notifiable user)
- All feature modules (fire notifications as events)
