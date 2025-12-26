# Services Directory

This directory contains all API service modules that interact with the backend.

## Structure

```
services/
├── auth.service.ts      # Authentication related API calls
├── user.service.ts      # User management API calls (to be created)
├── role.service.ts      # Role management API calls (to be created)
└── README.md
```

## Best Practices

### 1. Service Classes
- Use singleton pattern with class instances
- Group related endpoints in the same service
- Export a single instance: `export const authService = new AuthService()`

### 2. Method Naming
- Use descriptive method names: `login()`, `getUsers()`, `updateProfile()`
- Follow REST conventions: `get`, `create`, `update`, `delete`

### 3. Type Safety
- Always define request/response types in `types/` directory
- Use TypeScript generics for reusable code
- Return typed responses from axios

### 4. Error Handling
- Let axios interceptors handle common errors
- Throw errors for specific business logic errors
- Document possible error responses

### Example Service

```typescript
import axiosInstance from '@/lib/axios'
import { User, CreateUserData } from '@/types/user.types'

class UserService {
  private readonly USER_PREFIX = '/uam/users'

  async getUsers(): Promise<{ data: User[] }> {
    const response = await axiosInstance.get(this.USER_PREFIX)
    return response.data
  }

  async createUser(data: CreateUserData): Promise<{ data: User }> {
    const response = await axiosInstance.post(this.USER_PREFIX, data)
    return response.data
  }

  async updateUser(id: number, data: Partial<User>): Promise<{ data: User }> {
    const response = await axiosInstance.put(`${this.USER_PREFIX}/${id}`, data)
    return response.data
  }

  async deleteUser(id: number): Promise<void> {
    await axiosInstance.delete(`${this.USER_PREFIX}/${id}`)
  }
}

export const userService = new UserService()
```
