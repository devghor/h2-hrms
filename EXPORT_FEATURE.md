# Excel Export Feature Documentation

## Overview
This document describes the Excel export functionality implemented in the H2-HRMS system, including both backend (Laravel) and frontend (React) implementations.

## Backend Implementation

### Dependencies
- `maatwebsite/excel` - Laravel Excel package for creating and downloading Excel files

### Export Classes Location
`backend/app/Exports/`

### Available Export Classes

#### 1. UsersExport
- **File**: `app/Exports/UsersExport.php`
- **Exports**: User data with roles
- **Columns**: ID, Name, Email, Roles, Created At, Updated At
- **Filters**: search (name/email), role

#### 2. DesignationsExport
- **File**: `app/Exports/DesignationsExport.php`
- **Exports**: Designation data
- **Columns**: ID, Name, Description, Level, Created At, Updated At, Deleted At
- **Filters**: search (name/description), level, include_deleted

### API Endpoints

#### Users Export
```
GET /api/v1/uam/users/export
```
**Query Parameters:**
- `search` - Search in name or email
- `role` - Filter by role name

**Example:**
```bash
curl -X GET "http://localhost/api/v1/uam/users/export?search=john&role=admin" \
  -H "Authorization: Bearer {token}" \
  --output users.xlsx
```

#### Designations Export
```
GET /api/v1/base/designations/export
```
**Query Parameters:**
- `search` - Search in name or description
- `level` - Filter by level
- `include_deleted` - Include soft-deleted records

**Example:**
```bash
curl -X GET "http://localhost/api/v1/base/designations/export?level=2" \
  -H "Authorization: Bearer {token}" \
  --output designations.xlsx
```

### Creating a New Export Class

1. Create a new export class:
```php
<?php

namespace App\Exports;

use App\Models\YourModel;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class YourModelExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = YourModel::query();
        
        // Apply filters
        if (!empty($this->filters['search'])) {
            $query->where('name', 'like', "%{$this->filters['search']}%");
        }
        
        return $query->orderBy('created_at', 'desc');
    }

    public function headings(): array
    {
        return ['ID', 'Name', 'Created At'];
    }

    public function map($model): array
    {
        return [
            $model->ulid,
            $model->name,
            $model->created_at?->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
```

2. Add export method to your controller:
```php
use App\Exports\YourModelExport;
use Maatwebsite\Excel\Facades\Excel;

public function export(Request $request)
{
    $filters = $request->only(['search', 'other_filter']);
    $fileName = 'your_model_' . now()->format('Y-m-d_His') . '.xlsx';
    
    return Excel::download(new YourModelExport($filters), $fileName);
}
```

3. Add route in `routes/api.php`:
```php
Route::get('your-models/export', [YourModelController::class, 'export'])
    ->name('your-models.export');
```

## Frontend Implementation

### Dependencies
- Axios (for API calls)
- Sonner (for toast notifications)

### Services Location
`frontend/src/services/`

### Utility Functions

#### 1. File Export Utilities
**File**: `frontend/src/lib/file-export.ts`

- `downloadFile(blob, filename)` - Download a blob as a file
- `generateExportFilename(prefix, extension)` - Generate filename with timestamp
- `handleExport(exportFn, filename, onSuccess, onError)` - Handle export with error handling

#### 2. Custom Hook
**File**: `frontend/src/hooks/use-export.ts`

```typescript
const { isExporting, exportData } = useExport({
  successMessage: 'Data exported successfully',
  errorMessage: 'Failed to export data',
  onSuccess: () => console.log('Export completed'),
  onError: (error) => console.error(error),
})

// Use it
await exportData(() => service.exportData(filters), 'filename-prefix')
```

#### 3. Export Button Component
**File**: `frontend/src/components/export-button.tsx`

```typescript
<ExportButton
  exportFn={() => userService.exportUsers({ search: 'john' })}
  filenamePrefix='users'
  successMessage='Users exported successfully'
  errorMessage='Failed to export users'
  variant='outline'
  size='default'
/>
```

### Service Methods

#### UserService
**File**: `frontend/src/services/user.service.ts`

```typescript
// Export users
await userService.exportUsers({
  search: 'search term',
  role: 'admin',
})
```

#### DesignationService
**File**: `frontend/src/services/designation.service.ts`

```typescript
// Export designations
await designationService.exportDesignations({
  search: 'manager',
  level: 2,
  include_deleted: true,
})
```

### Adding Export to a Page

#### Method 1: Using ExportButton Component
```typescript
import { ExportButton } from '@/components/export-button'
import { userService } from '@/services/user.service'

// In your component
<ExportButton
  exportFn={() => userService.exportUsers(filters)}
  filenamePrefix='users'
  successMessage='Users exported successfully'
/>
```

#### Method 2: Using useExport Hook
```typescript
import { useExport } from '@/hooks/use-export'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

function YourComponent() {
  const { isExporting, exportData } = useExport({
    successMessage: 'Exported successfully',
  })
  
  const handleExport = async () => {
    await exportData(
      () => yourService.exportData(filters),
      'filename-prefix'
    )
  }
  
  return (
    <Button onClick={handleExport} disabled={isExporting}>
      <Download className='mr-2 h-4 w-4' />
      {isExporting ? 'Exporting...' : 'Export'}
    </Button>
  )
}
```

#### Method 3: Using handleExport Utility
```typescript
import { handleExport, generateExportFilename } from '@/lib/file-export'
import { toast } from 'sonner'

const handleClick = async () => {
  await handleExport(
    () => yourService.exportData(filters),
    generateExportFilename('your-prefix'),
    () => toast.success('Export successful'),
    (error) => toast.error(error.message)
  )
}
```

### Creating a New Service with Export

```typescript
import axiosInstance from '@/lib/axios'

class YourService {
  private readonly PREFIX = '/api/your-endpoint'

  async exportData(filters?: {
    search?: string
    // other filters
  }): Promise<Blob> {
    const response = await axiosInstance.get(`${this.PREFIX}/export`, {
      params: filters,
      responseType: 'blob', // Important!
    })
    return response.data
  }
}

export const yourService = new YourService()
```

## Usage Examples

### Example 1: Export All Users
```typescript
<ExportButton
  exportFn={() => userService.exportUsers()}
  filenamePrefix='all-users'
/>
```

### Example 2: Export Filtered Users
```typescript
<ExportButton
  exportFn={() => userService.exportUsers({
    search: searchTerm,
    role: selectedRole,
  })}
  filenamePrefix='filtered-users'
/>
```

### Example 3: Export with Custom Messages
```typescript
<ExportButton
  exportFn={() => designationService.exportDesignations(filters)}
  filenamePrefix='designations'
  successMessage='Designations exported to Excel'
  errorMessage='Could not export designations'
  text='Download Excel'
  loadingText='Generating file...'
/>
```

## File Naming Convention

Generated files follow this pattern:
```
{prefix}_{timestamp}.xlsx

Example: users_2026-01-10T12-30-45.xlsx
```

## Browser Compatibility

The export feature uses the Blob API and works in all modern browsers:
- Chrome 20+
- Firefox 13+
- Safari 6.1+
- Edge (all versions)

## Troubleshooting

### Backend Issues

1. **"Class 'Maatwebsite\Excel\Facades\Excel' not found"**
   - Run: `composer require maatwebsite/excel`

2. **"Call to undefined method query()"**
   - Make sure your export class implements `FromQuery`

3. **Memory issues with large exports**
   - Use chunking: implement `WithChunkReading` concern
   - Increase memory limit in `php.ini`

### Frontend Issues

1. **Download not working**
   - Ensure `responseType: 'blob'` is set in axios request
   - Check CORS settings if API is on different domain

2. **File downloads as text**
   - Verify the Content-Type header from backend
   - Check that Excel package is properly installed

3. **TypeScript errors**
   - Ensure sonner is installed: `npm install sonner`
   - Check that lucide-react is installed for icons

## Security Considerations

1. **Authorization**: All export endpoints are protected by authentication middleware
2. **Permission Checks**: Uncomment authorization checks in controllers
3. **Data Filtering**: Only export data the user has permission to view
4. **Rate Limiting**: Consider adding rate limiting to export endpoints

## Performance Tips

1. **Limit Data**: Export only necessary columns
2. **Use Filters**: Encourage users to filter before exporting
3. **Async Processing**: For very large exports, consider queuing
4. **Caching**: Cache frequent exports if data doesn't change often

## Future Enhancements

- [ ] Support for CSV export
- [ ] Support for PDF export
- [ ] Scheduled exports
- [ ] Email export results
- [ ] Custom column selection
- [ ] Export templates
- [ ] Progress indicator for large exports
