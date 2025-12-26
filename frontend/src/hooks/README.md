# Hooks Directory

Custom React hooks for managing application state and side effects.

## Auth Hook (`use-auth.ts`)

The `useAuth` hook provides a centralized way to handle all authentication operations.

### Features

- ✅ Login with email/password
- ✅ Register new user
- ✅ Logout
- ✅ Change password
- ✅ Get current user
- ✅ Automatic token management
- ✅ Error handling with toast notifications
- ✅ Loading states

### Usage

```typescript
import { useAuth } from '@/hooks/use-auth'

function LoginForm() {
  const { login, isLoggingIn, isAuthenticated } = useAuth()

  const handleLogin = (credentials: LoginCredentials) => {
    login(credentials)
  }

  return (
    <button onClick={handleLogin} disabled={isLoggingIn}>
      {isLoggingIn ? 'Signing in...' : 'Sign In'}
    </button>
  )
}
```

### Available Methods

#### Authentication
- `login(credentials)` - Login user
- `loginAsync(credentials)` - Login with promise (for custom handling)
- `isLoggingIn` - Boolean loading state
- `register(credentials)` - Register new user
- `isRegistering` - Boolean loading state
- `logout()` - Logout current user
- `isLoggingOut` - Boolean loading state

#### Password Management
- `changePassword(data)` - Change user password
- `isChangingPassword` - Boolean loading state

#### User Data
- `user` - Current user from Zustand store
- `currentUser` - Full user data from API
- `isLoadingUser` - Boolean loading state
- `refetchUser()` - Manually refetch user data

#### Token & Auth Status
- `accessToken` - Current access token
- `isAuthenticated` - Boolean auth status

## Creating Custom Hooks

When creating new hooks:

1. **Use React Query** for server state management
2. **Use Zustand** for client state management
3. **Handle errors** with toast notifications
4. **Provide loading states** for better UX
5. **Return consistent API** for easy consumption

### Example: User Management Hook

```typescript
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userService } from '@/services/user.service'

export const useUsers = () => {
  // Fetch users
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  })

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      toast.success('User created successfully')
      usersQuery.refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return {
    users: usersQuery.data?.data,
    isLoading: usersQuery.isLoading,
    createUser: createMutation.mutate,
    isCreating: createMutation.isPending,
  }
}
```
