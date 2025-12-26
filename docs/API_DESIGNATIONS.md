# Designations API Documentation

## Overview
The Designations API provides endpoints for managing job designations within the HRMS system. Each designation has a name, description, and level hierarchy.

## Base URL
```
/api/v1/base/designations
```

## Authentication
All endpoints require authentication using Bearer token:
```
Authorization: Bearer {access_token}
```

## Authorization & Permissions

The Designations API uses policy-based authorization. Users must have the appropriate permissions to perform actions:

| Action | Permission Required |
|--------|-------------------|
| View list | `READ_BASE_DESIGNATION` |
| View single | `READ_BASE_DESIGNATION` |
| Create | `CREATE_BASE_DESIGNATION` |
| Update | `UPDATE_BASE_DESIGNATION` |
| Delete | `DELETE_BASE_DESIGNATION` |
| Restore | `RESTORE_BASE_DESIGNATION` |
| Force Delete | `FORCE_DELETE_BASE_DESIGNATION` |

### Seeding Permissions
Run the permission seeder to create all designation permissions:
```bash
php artisan db:seed --class=DesignationPermissionSeeder
```


## Model Structure

### Designation
```json
{
  "id": "integer (auto-increment)",
  "ulid": "string (ULID - unique identifier)",
  "name": "string",
  "description": "string|null",
  "level": "integer",
  "created_at": "ISO8601 datetime",
  "updated_at": "ISO8601 datetime"
}
```

**Note:** The model uses both `id` (auto-increment) and `ulid` (unique identifier). Use `ulid` for all API operations and route model binding.

## Endpoints

### 1. List All Designations (Paginated)
**GET** `/api/v1/base/designations`

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| per_page | integer | No | Items per page (default: 15) |
| search | string | No | Search by name or description |
| level | integer | No | Filter by level |
| page | integer | No | Page number |

#### Response Example
```json
{
  "data": [
    {
      "id": 1,
      "ulid": "01HN2G8K9MXYZ123456789ABC",
      "name": "Senior Developer",
      "description": "Senior-level software developer",
      "level": 4,
      "created_at": "2025-12-26T10:00:00.000000Z",
      "updated_at": "2025-12-26T10:00:00.000000Z"
    }
  ],
  "links": {...},
  "meta": {...}
}
```

### 2. Get All Designations (No Pagination)
**GET** `/api/v1/base/designations/all`

Returns all designations without pagination, ordered by level and name.

#### Response Example
```json
{
  "success": true,
  "message": "All designations retrieved successfully.",
  "data": [
    {
      "id": 1,
      "ulid": "01HN2G8K9MXYZ123456789ABC",
      "name": "Junior Developer",
      "description": "Entry-level developer",
      "level": 2,
      "created_at": "2025-12-26T10:00:00.000000Z",
      "updated_at": "2025-12-26T10:00:00.000000Z"
    }
  ]
}
```

### 3. Get Single Designation
**GET** `/api/v1/base/designations/{ulid}`

#### Response Example
```json
{
  "success": true,
  "message": "Designation retrieved successfully.",
  "data": {
    "id": 1,
    "ulid": "01HN2G8K9MXYZ123456789ABC",
    "name": "Senior Developer",
    "description": "Senior-level software developer",
    "level": 4,
    "created_at": "2025-12-26T10:00:00.000000Z",
    "updated_at": "2025-12-26T10:00:00.000000Z"
  }
}
```

### 4. Create Designation
**POST** `/api/v1/base/designations`

#### Request Body
```json
{
  "name": "Senior Developer",
  "description": "Senior-level software developer",
  "level": 4
}
```

#### Validation Rules
- `name`: required, string, max 255 characters, unique
- `description`: optional, string
- `level`: required, integer, minimum 1

#### Response Example (201 Created)
```json
{
  "success": true,
  "message": "Designation created successfully.",
  "data": {
    "id": 1,
    "ulid": "01HN2G8K9MXYZ123456789ABC",
    "name": "Senior Developer",
    "description": "Senior-level software developer",
    "level": 4,
    "created_at": "2025-12-26T10:00:00.000000Z",
    "updated_at": "2025-12-26T10:00:00.000000Z"
  }
}
```

### 5. Update Designation
**PUT/PATCH** `/api/v1/base/designations/{ulid}`

#### Request Body
```json
{
  "name": "Lead Developer",
  "description": "Lead software developer with team responsibilities",
  "level": 5
}
```

#### Validation Rules
- `name`: required, string, max 255 characters, unique (except current)
- `description`: optional, string
- `level`: required, integer, minimum 1

#### Response Example
```json
{
  "success": true,
  "message": "Designation updated successfully.",
  "data": {
    "id": 1,
    "ulid": "01HN2G8K9MXYZ123456789ABC",
    "name": "Lead Developer",
    "description": "Lead software developer with team responsibilities",
    "level": 5,
    "created_at": "2025-12-26T10:00:00.000000Z",
    "updated_at": "2025-12-26T10:30:00.000000Z"
  }
}
```

### 6. Delete Designation (Soft Delete)
**DELETE** `/api/v1/base/designations/{ulid}`

Soft deletes the designation. The record is not permanently removed.

#### Response Example
```json
{
  "success": true,
  "message": "Designation deleted successfully.",
  "data": []
}
```

### 7. Restore Deleted Designation
**POST** `/api/v1/base/designations/{ulid}/restore`

Restores a soft-deleted designation.

#### Response Example
```json
{
  "success": true,
  "message": "Designation restored successfully.",
  "data": {
    "id": 1,
    "ulid": "01HN2G8K9MXYZ123456789ABC",
    "name": "Senior Developer",
    "description": "Senior-level software developer",
    "level": 4,
    "created_at": "2025-12-26T10:00:00.000000Z",
    "updated_at": "2025-12-26T10:45:00.000000Z"
  }
}
```

## Error Responses

### Validation Error (422)
```json
{
  "message": "The name field is required. (and 1 more error)",
  "errors": {
    "name": ["The name field is required."],
    "level": ["The level field is required."]
  }
}
```

### Not Found (404)
```json
{
  "message": "No query results for model [App\\Models\\Base\\Designation] {id}"
}
```

### Unauthorized (401)
```json
{
  "message": "Unauthenticated."
}
```

### Forbidden (403)
```json
{
  "message": "This action is unauthorized."
}
```


## Usage Examples

### cURL Examples

#### Create Designation
```bash
curl -X POST https://api.example.com/api/v1/base/designations \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Senior Developer",
    "description": "Senior-level software developer",
    "level": 4
  }'
```

#### List with Search
```bash
curl -X GET "https://api.example.com/api/v1/base/designations?search=developer&level=4" \
  -H "Authorization: Bearer {token}"
```

#### Update Designation
```bash
curl -X PUT https://api.example.com/api/v1/base/designations/{id} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lead Developer",
    "description": "Updated description",
    "level": 5
  }'
```

## Database Migration

Run the migration:
```bash
php artisan migrate
```

Seed permissions:
```bash
php artisan db:seed --class=DesignationPermissionSeeder
```

Seed sample data:
```bash
php artisan db:seed --class=DesignationSeeder
```

## Authorization Setup

The Designation resource uses Laravel Policies for authorization. The `DesignationPolicy` is automatically registered in `AppServiceProvider`.

### Policy Methods
- `viewAny()` - Check if user can view any designations
- `view()` - Check if user can view a specific designation
- `create()` - Check if user can create designations
- `update()` - Check if user can update a designation
- `delete()` - Check if user can delete a designation
- `restore()` - Check if user can restore deleted designations
- `forceDelete()` - Check if user can permanently delete designations

### Assigning Permissions to Users
```php
use App\Models\Uam\User;

$user = User::find(1);
$user->givePermissionTo('READ_BASE_DESIGNATION');
$user->givePermissionTo('CREATE_BASE_DESIGNATION');
// ... other permissions
```


## Running Tests

```bash
php artisan test --filter DesignationControllerTest
```

## Notes
- All designations are sorted by level (ascending) and name (ascending) by default
- The `level` field represents the hierarchy (1 = lowest, 10+ = highest)
- Soft deletes are enabled, so deleted records can be restored
- ULID is used as the primary key for better performance and sortability
