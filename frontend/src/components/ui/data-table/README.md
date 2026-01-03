# Reusable Data Table Components

This folder contains reusable data table components inspired by the [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) pattern.

## Components

### DataTable
The main wrapper component that renders the table with pagination and optional action bar.

**Usage:**
```tsx
import { DataTable } from '@/components/ui/data-table'

<DataTable table={table} actionBar={<CustomActions table={table} />}>
  <DataTableToolbar table={table} />
</DataTable>
```

### DataTableToolbar
Toolbar component with search, filters, and column visibility controls.

**Props:**
- `table`: TanStack table instance
- `searchKey`: Column key to search (optional)
- `searchPlaceholder`: Placeholder text for search input
- `children`: Custom filters or additional toolbar items

**Usage:**
```tsx
<DataTableToolbar
  table={table}
  searchKey='name'
  searchPlaceholder='Search by name...'
>
  {/* Add custom filters here */}
</DataTableToolbar>
```

### DataTablePagination
Pagination controls with page size selector.

**Props:**
- `table`: TanStack table instance
- `pageSizeOptions`: Array of page size options (default: [10, 20, 30, 40, 50])

### DataTableViewOptions
Column visibility toggle component.

**Props:**
- `table`: TanStack table instance

## Hook

### useDataTable
Custom hook for managing table state with server-side pagination.

**Usage:**
```tsx
import { useDataTable } from '@/hooks/use-data-table'

const { table } = useDataTable({
  data,
  columns,
  pageCount,
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  },
})
```

## Example: Users Table

See `/features/users/components/users-table-new.tsx` for a complete example:

```tsx
import { useDataTable } from '@/hooks/use-data-table'
import { DataTable, DataTableToolbar } from '@/components/ui/data-table'

export function UsersTable({ data, totalCount, page, pageSize, ... }) {
  const pageCount = Math.ceil(totalCount / pageSize)

  const { table } = useDataTable({
    data,
    columns: usersColumns,
    pageCount,
    initialState: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
  })

  return (
    <DataTable table={table} actionBar={<BulkActions table={table} />}>
      <DataTableToolbar
        table={table}
        searchKey='name'
        searchPlaceholder='Search by name...'
      />
    </DataTable>
  )
}
```

## Benefits

1. **Less Code**: You only need to define columns and pass data
2. **Reusable**: Works with any data type
3. **Consistent UI**: All tables look and behave the same
4. **Easy to Extend**: Add custom toolbars, filters, and actions
5. **Server-side Ready**: Built-in support for server-side pagination and sorting
6. **Accessible**: Includes proper ARIA labels and keyboard navigation

## Differences from Old Approach

**Before:**
- Complex DataGrid with many options
- URL state management mixed with table logic
- Hard to customize individual tables

**After:**
- Simple DataTable wrapper
- URL state managed at page level
- Easy to customize per table
- More maintainable and testable
