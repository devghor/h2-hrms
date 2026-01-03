# Table Implementation Comparison

## Before: Complex DataGrid Approach

### Code Required (users-table.tsx - 200+ lines)

```tsx
// Complex props with many configuration options
type DataTableProps = {
  data: User[]
  totalCount: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}

// Large component with inline skeleton, DataGrid configuration, and custom toolbar
export function UsersTable({ data, totalCount, search, navigate, isLoading }) {
  // 40+ lines of skeleton UI
  if (isLoading) {
    return (
      <div className='space-y-4'>
        {/* Skeleton code... */}
      </div>
    )
  }
  
  // 100+ lines of DataGrid configuration
  return (
    <DataGrid
      data={data}
      columns={usersColumns}
      options={{
        search,
        navigate,
        serverSide: true,
        rowCount: totalCount,
        enableRowSelection: true,
        enableSorting: true,
        // ... many more options
        customToolbar: ({ table }) => (
          <UsersToolbar /* custom props */ />
        ),
        // ... more configuration
      }}
    />
  )
}
```

### Issues:
- ❌ Too many configuration options (hard to remember)
- ❌ URL state management mixed with table logic
- ❌ Inline skeleton code makes component bloated
- ❌ Hard to understand what's happening
- ❌ Difficult to customize individual tables

---

## After: Simple DataTable Wrapper

### Code Required (users-table-new.tsx - 63 lines)

```tsx
type UsersTableProps = {
  data: User[]
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function UsersTable({
  data,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: UsersTableProps) {
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

  useEffect(() => {
    const currentPagination = table.getState().pagination
    const newPage = currentPagination.pageIndex + 1
    const newPageSize = currentPagination.pageSize
    
    if (newPage !== page) {
      onPageChange(newPage)
    }
    if (newPageSize !== pageSize) {
      onPageSizeChange(newPageSize)
    }
  }, [table.getState().pagination, page, pageSize, onPageChange, onPageSizeChange])

  return (
    <DataTable
      table={table}
      actionBar={<DataTableBulkActions table={table} />}
    >
      <DataTableToolbar
        table={table}
        searchKey='name'
        searchPlaceholder='Search by name...'
      />
    </DataTable>
  )
}
```

### Benefits:
- ✅ Simple, clear props
- ✅ URL state managed at page level (separation of concerns)
- ✅ Skeleton moved to page level (better organization)
- ✅ Easy to read and understand
- ✅ Simple to customize per table

---

## Parent Component Comparison

### Before (index.tsx)

```tsx
export function Users() {
  // State management
  const [usersData, setUsersData] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  return (
    <UsersTable
      data={usersData}
      totalCount={totalCount}
      search={search}
      navigate={navigate}
      isLoading={isLoading}  // Skeleton handled in table
    />
  )
}
```

### After (index.tsx)

```tsx
export function Users() {
  // State management
  const [usersData, setUsersData] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10
  
  const handlePageChange = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) })
  }
  
  const handlePageSizeChange = (newPageSize: number) => {
    navigate({ search: (prev) => ({ ...prev, pageSize: newPageSize, page: 1 }) })
  }
  
  return (
    <>
      {isLoading ? (
        <TableSkeleton />  // Skeleton at page level
      ) : (
        <UsersTable
          data={usersData}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </>
  )
}
```

---

## Code Reduction

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Table Component Lines | ~200 | ~63 | **68% reduction** |
| Configuration Options | 20+ | 4 | **80% reduction** |
| Nested Components | High | Low | Better readability |
| Reusability | Medium | High | Easier to reuse |

---

## Key Improvements

### 1. Separation of Concerns
- **Before**: Table component handled everything (data, URL state, skeleton)
- **After**: Clear separation - page handles URL state, table handles display

### 2. Maintainability
- **Before**: Changes required modifying complex DataGrid configuration
- **After**: Simple, focused components that are easy to update

### 3. Testability
- **Before**: Hard to test due to tight coupling
- **After**: Easy to test - pass props, verify output

### 4. Developer Experience
- **Before**: Need to remember many DataGrid options
- **After**: Simple API - columns, data, pagination handlers

### 5. Performance
- **Before**: Large component re-renders
- **After**: Optimized with proper hooks and effects

---

## Migration Guide

To migrate other tables to the new pattern:

1. **Extract columns** - Keep existing column definitions
2. **Create table component** - Use new DataTable wrapper
3. **Move URL state** - Handle in parent page component
4. **Move skeleton** - Render at page level
5. **Add handlers** - Pass pagination/sort handlers as props

Example template:
```tsx
export function MyTable({ data, totalCount, page, pageSize, onPageChange, onPageSizeChange }) {
  const { table } = useDataTable({
    data,
    columns: myColumns,
    pageCount: Math.ceil(totalCount / pageSize),
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} searchKey='name' />
    </DataTable>
  )
}
```
