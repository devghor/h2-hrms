# CASL Authorization Implementation

This project uses [CASL](https://casl.js.org/) for permission-based authorization in the frontend.

## Overview

The authorization system works with Laravel-style permissions (e.g., `READ_UAM_USER`) and provides **action-based checking** - you can check if a user has any permission with a specific action (like `READ`) without needing to specify the subject.

## Permission Format

Permissions follow the format: `ACTION_SUBJECT`

- **Action**: `READ`, `CREATE`, `UPDATE`, `DELETE`
- **Subject**: Resource type (e.g., `UAM_USER`, `UAM_ROLE`)

Example permissions from API:
```json
{
  "permissions": [
    "READ_UAM_USER",
    "READ_UAM_ROLE",
    "CREATE_UAM_USER"
  ]
}
```

## Key Concept: Action-Only Checks ⭐

**Most common use case**: Check if user has any permission with a specific action:

```tsx
// ✅ RECOMMENDED: Check if user has any READ permission
const hasReadAccess = useHasAction('READ')
// Returns true if user has READ_UAM_USER, READ_UAM_ROLE, or any other READ_* permission

// ✅ Check if user has any CREATE permission
const hasCreateAccess = useHasAction('CREATE')
// Returns true if user has CREATE_UAM_USER, CREATE_UAM_ROLE, etc.
```

## Setup

### 1. User Permissions

Ensure your API returns permissions in the auth response:

```typescript
interface AuthUser {
  ulid: string
  name: string
  email: string
  tenant_id: number
  permissions: string[] // e.g., ["READ_UAM_USER", "READ_UAM_ROLE"]
  // ... other fields
}
```

## Usage

### 1. Action-Only Checks (RECOMMENDED) ⭐

The simplest and most flexible way:

```tsx
import { useHasAction } from '@/hooks/use-ability'

function UserManagement() {
  // Check if user has any READ permission
  const canRead = useHasAction('READ')
  const canCreate = useHasAction('CREATE')
  const canUpdate = useHasAction('UPDATE')
  const canDelete = useHasAction('DELETE')

  return (
    <div>
      {canRead && <UserList />}
      {canCreate && <Button>Add User</Button>}
      {canUpdate && <Button>Edit</Button>}
      {canDelete && <Button>Delete</Button>}
    </div>
  )
}
```

### 2. Specific Permission Checks

Check for exact permission string:

```tsx
import { useHasPermission } from '@/hooks/use-ability'

function UserActions() {
  // Check for exact permission
  const hasReadUamUser = useHasPermission('READ_UAM_USER')
  const hasCreateUamUser = useHasPermission('CREATE_UAM_USER')

  return (
    <div>
      {hasReadUamUser && <ViewUsersButton />}
      {hasCreateUamUser && <CreateUserButton />}
    </div>
  )
}
```

### 3. Route Protection

Protect routes with action checks:

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasAction } from '@/lib/casl'

export const Route = createFileRoute('/users')({
  beforeLoad: ({ location }) => {
    // Check if user has any READ permission
    if (!hasAction('READ')) {
      throw redirect({
        to: '/errors/forbidden',
        search: { redirect: location.href },
      })
    }
  },
  component: UsersPage,
})
```

Or check for specific permission:

```tsx
import { hasPermission } from '@/lib/casl'

export const Route = createFileRoute('/users')({
  beforeLoad: ({ location }) => {
    if (!hasPermission('READ_UAM_USER')) {
      throw redirect({
        to: '/errors/forbidden',
        search: { redirect: location.href },
      })
    }
  },
  component: UsersPage,
})
```

### 4. Sidebar Menu Authorization

Sidebar items filter automatically. Three ways to specify permissions:

```typescript
// Option 1: Action-only (RECOMMENDED)
{
  title: 'Users',
  url: '/uam/users',
  permission: {
    action: 'READ',  // Shows if user has any READ_* permission
  },
}

// Option 2: Specific permission string
{
  title: 'Users',
  url: '/uam/users',
  permission: {
    permission: 'READ_UAM_USER',  // Shows only if user has this exact permission
  },
}

// Option 3: Action + Subject (legacy, uses CASL ability)
{
  title: 'Users',
  url: '/uam/users',
  permission: {
    action: 'READ',
    subject: 'UAM_USER',
  },
}
```

### 5. Advanced: CASL Can Component

For subject-specific checks using CASL abilities:

```tsx
import { Can } from '@/lib/casl'

function UserDetailPage() {
  return (
    <div>
      <Can I="READ" a="UAM_USER">
        <UserProfile />
      </Can>

      <Can I="UPDATE" a="UAM_USER">
        <EditButton />
      </Can>

      {/* Inverse check */}
      <Can not I="DELETE" a="UAM_USER">
        <p>You cannot delete users</p>
      </Can>
    </div>
  )
}
```

## Quick Reference

### All Available Functions

```tsx
// Hooks
import { 
  useHasAction,      // Check if has any permission with action
  useHasPermission,  // Check for specific permission string
  useCan,           // CASL: Check action + subject
  useAbility        // Get CASL ability instance
} from '@/hooks/use-ability'

// Direct functions (for non-component code)
import { 
  hasAction,        // Check if has any permission with action
  hasPermission,    // Check for specific permission string
  getPermissions    // Get all raw permissions
} from '@/lib/casl'
```

### Common Patterns

#### Pattern 1: Simple Action Check
```tsx
const canRead = useHasAction('READ')
const canCreate = useHasAction('CREATE')
```

#### Pattern 2: Multiple Actions
```tsx
const hasReadAccess = useHasAction('READ')
const hasWriteAccess = useHasAction('CREATE') || useHasAction('UPDATE')
```

#### Pattern 3: Route Guard
```tsx
beforeLoad: ({ location }) => {
  if (!hasAction('READ')) {
    throw redirect({ to: '/errors/forbidden' })
  }
}
```

#### Pattern 4: Conditional Rendering
```tsx
{useHasAction('CREATE') && <CreateButton />}
{useHasAction('UPDATE') && <EditButton />}
{useHasAction('DELETE') && <DeleteButton />}
```

## Debugging

```tsx
import { getPermissions, hasAction } from '@/lib/casl'

// Check current permissions
console.log('All permissions:', getPermissions())
console.log('Has READ action:', hasAction('READ'))
console.log('Has CREATE action:', hasAction('CREATE'))
```

## Examples Summary

| Use Case | Solution |
|----------|----------|
| Check if user can read anything | `useHasAction('READ')` |
| Check if user can create anything | `useHasAction('CREATE')` |
| Check specific permission | `useHasPermission('READ_UAM_USER')` |
| Show/hide sidebar item | `permission: { action: 'READ' }` |
| Protect route | `if (!hasAction('READ'))` |
| Conditional button | `{canCreate && <Button>Create</Button>}` |

## Benefits of Action-Only Checks

✅ **Simpler** - No need to specify subjects  
✅ **More flexible** - Works with any resource  
✅ **Less maintenance** - Don't need to update types for every new resource  
✅ **Better UX** - Users with `READ_UAM_USER` can access read-related features

## Troubleshooting

### Sidebar not filtering
- Verify permissions are set in auth store
- Check console: `console.log(getPermissions())`
- Ensure format is `ACTION_SUBJECT` (e.g., `READ_UAM_USER`)

### Route guard not working
- Check that auth store has permissions before navigation
- Verify permission format in API response

### Hook returns wrong value
- Make sure `AbilityProvider` wraps your app
- Check permissions are loaded: `console.log(getPermissions())`
