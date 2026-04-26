# Module Spec: User Access Management (UAM)

**Status:** Implemented
**Module Key:** `uam`

---

## Overview

UAM controls who can log in to the system and what they can do. It manages users, roles, and the individual permissions that roles bundle together. Every feature in the system is gated by a permission that must be assigned via a role.

---

## Entities

### User

Represents a person with system access. A user belongs to a company (tenant) and has one or more roles.

| Field | Type | Notes |
|---|---|---|
| id | ulid/uuid | |
| name | string | |
| email | string | unique per tenant |
| password | hashed string | |
| status | enum | active / inactive |
| roles | relation | many-to-many via Spatie |
| created_at / updated_at | timestamps | |

### Role

A named bundle of permissions. Roles are tenant-scoped — a role in Company A is invisible to Company B.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| name | string | unique per tenant |
| guard_name | string | `web` |
| permissions | relation | many-to-many via Spatie |

### Permission

A named capability. Permissions are seeded from `PermissionEnum` and are not user-editable beyond assignment to roles. Names follow the `READ_MODULE` / `CREATE_MODULE` convention.

| Field | Type | Notes |
|---|---|---|
| id | bigint | |
| name | string | e.g. `READ_UAM_USER` |
| guard_name | string | `web` |

---

## User Stories

- As a Company Admin, I can create user accounts for my team so they can access the system.
- As a Company Admin, I can deactivate a user without deleting them so historical records are preserved.
- As a Company Admin, I can create roles (e.g. "HR Officer") and assign permissions to them.
- As a Company Admin, I can assign roles to users.
- As an HR Officer with READ_UAM permission, I can view the user list but cannot create or delete.
- As any user, I cannot see or access another company's users, roles, or permissions.

---

## Routes

```
GET    /uam/users                → UserController@index
POST   /uam/users                → UserController@store
PUT    /uam/users/{user}         → UserController@update
DELETE /uam/users/{user}         → UserController@destroy
DELETE /uam/users/bulk-delete    → UserController@bulkDelete

GET    /uam/roles                → RoleController@index
POST   /uam/roles                → RoleController@store
PUT    /uam/roles/{role}         → RoleController@update
DELETE /uam/roles/{role}         → RoleController@destroy
DELETE /uam/roles/bulk-delete    → RoleController@bulkDelete

GET    /uam/permissions          → PermissionController@index
POST   /uam/permissions          → PermissionController@store
PUT    /uam/permissions/{perm}   → PermissionController@update
DELETE /uam/permissions/{perm}   → PermissionController@destroy
DELETE /uam/permissions/bulk-delete → PermissionController@bulkDelete
```

---

## Permissions

| Permission | Scope |
|---|---|
| `READ_UAM_USER` | View user list and details |
| `CREATE_UAM_USER` | Create new users |
| `UPDATE_UAM_USER` | Edit existing users |
| `DELETE_UAM_USER` | Delete / bulk-delete users |
| `READ_UAM_ROLE` | View roles |
| `CREATE_UAM_ROLE` | Create roles |
| `UPDATE_UAM_ROLE` | Edit roles and their permission assignments |
| `DELETE_UAM_ROLE` | Delete roles |
| `READ_UAM_PERMISSION` | View permissions |
| `CREATE_UAM_PERMISSION` | Create permissions |
| `UPDATE_UAM_PERMISSION` | Edit permissions |
| `DELETE_UAM_PERMISSION` | Delete permissions |

---

## UI Notes

- User list: DataTable with columns name, email, roles (badge list), status, actions.
- Create/edit via slide-over dialog (not separate page).
- Role assignment UI: multi-select checkbox list of available roles.
- Role edit UI: two-panel checkbox list — left = unassigned permissions, right = assigned.
- Inactive users shown with muted row; cannot log in but appear in history.

---

## Known Gaps

None. Module is fully implemented.

---

## Dependencies

None (foundation module; other modules depend on this).
