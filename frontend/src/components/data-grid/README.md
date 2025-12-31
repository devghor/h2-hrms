# DataGrid Component

A reusable, feature-rich data table component built with shadcn/ui and TanStack Table, inspired by MUI DataTables. Provides a simple, declarative API for creating powerful data tables with filtering, sorting, pagination, and more.

## Features

- 🎨 Beautiful UI using shadcn/ui components
- 📊 Powerful table functionality via TanStack Table
- 🔍 Built-in search and filtering
- 📄 Pagination with customizable options
- 🔀 Sortable columns
- ✅ Row selection
- 👁️ Column visibility controls
- 🔗 URL state synchronization (optional)
- 🚀 Server-side mode support
- 🎯 TypeScript support
- ♿ Accessible by default
- 🎨 Highly customizable

## Basic Usage

```tsx
import { DataGrid, createColumns, createSelectionColumn } from '@/components/data-grid'

// Define your data type
type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

// Sample data
const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
]

// Define columns
const columns = createColumns<User>([
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
])

// Render the table
function UsersTable() {
  return <DataGrid data={users} columns={columns} />
}
```

## Column Definition

### Using `createColumn` and `createColumns`

```tsx
import { createColumns, createSelectionColumn, createActionsColumn } from '@/components/data-grid'

const columns = [
  // Selection column with checkboxes
  createSelectionColumn<User>(),
  
  // Regular columns
  ...createColumns<User>([
    {
      accessorKey: 'name',
      header: 'Name',
      options: {
        sortable: true,
        filterable: true,
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      options: {
        sortable: true,
        customRender: (value, row) => (
          <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
            {String(value)}
          </a>
        ),
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      options: {
        align: 'center',
        customRender: (value) => (
          <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
            {String(value)}
          </Badge>
        ),
      },
    },
  ]),
  
  // Actions column
  createActionsColumn<User>(
    (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => console.log('Edit', row.id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Delete', row.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    { className: 'w-[70px]' }
  ),
]
```

### Using Typed Column Builders

```tsx
import { createTypedColumns } from '@/components/data-grid'

const builder = createTypedColumns<User>()

const columns = [
  builder.text('name', 'Name'),
  builder.text('email', 'Email', {
    customRender: (value) => <a href={`mailto:${value}`}>{String(value)}</a>,
  }),
  builder.date('createdAt', 'Created', (date) => date.toLocaleDateString()),
  builder.boolean('isActive', 'Active', { true: 'Yes', false: 'No' }),
  builder.custom('status', 'Status', (value) => (
    <Badge variant={value === 'active' ? 'default' : 'secondary'}>
      {String(value)}
    </Badge>
  )),
]
```

## Options

### Pagination

```tsx
<DataGrid
  data={users}
  columns={columns}
  options={{
    pagination: {
      defaultPage: 1,
      defaultPageSize: 20,
      rowsPerPageOptions: [10, 20, 50, 100],
    },
  }}
/>
```

### Filtering

```tsx
<DataGrid
  data={users}
  columns={columns}
  options={{
    searchPlaceholder: 'Search users...',
    searchKey: 'name', // Column to filter
    filters: [
      {
        columnId: 'status',
        title: 'Status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
      },
      {
        columnId: 'role',
        title: 'Role',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
      },
    ],
  }}
/>
```

### URL State Synchronization

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'

function UsersTable() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/users' })
  
  return (
    <DataGrid
      data={users}
      columns={columns}
      options={{
        search,
        navigate,
        pagination: {
          defaultPage: 1,
          defaultPageSize: 10,
        },
        columnFilters: [
          { columnId: 'name', searchKey: 'name', type: 'string' },
          { columnId: 'status', searchKey: 'status', type: 'array' },
          { columnId: 'role', searchKey: 'role', type: 'array' },
        ],
      }}
    />
  )
}
```

### Row Selection

```tsx
<DataGrid
  data={users}
  columns={columns}
  options={{
    enableRowSelection: true,
    onRowSelectionChange: (selectedRows) => {
      console.log('Selected rows:', selectedRows)
    },
  }}
/>
```

### Row Click Handler

```tsx
<DataGrid
  data={users}
  columns={columns}
  options={{
    onRowClick: (row, rowIndex) => {
      console.log('Clicked row:', row, 'at index:', rowIndex)
      // Navigate to detail page, open modal, etc.
    },
  }}
/>
```

### Custom Bulk Actions

```tsx
import { DataTableBulkActions } from '@/components/data-table'

<DataGrid
  data={users}
  columns={columns}
  options={{
    enableRowSelection: true,
    customBulkActions: ({ table }) => (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <div className="rounded-lg border bg-card p-4 shadow-lg">
          <p className="mb-2 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} row(s) selected
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="destructive">
              Delete Selected
            </Button>
            <Button size="sm" variant="outline">
              Export Selected
            </Button>
          </div>
        </div>
      </div>
    ),
  }}
/>
```

### Custom Toolbar

```tsx
<DataGrid
  data={users}
  columns={columns}
  options={{
    customToolbar: (
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Users</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
    ),
  }}
/>
```

### Server-Side Mode

```tsx
function UsersTable() {
  const [data, setData] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true)
    const response = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`)
    const result = await response.json()
    setData(result.data)
    setTotalCount(result.total)
    setLoading(false)
  }
  
  return (
    <DataGrid
      data={data}
      columns={columns}
      options={{
        serverSide: true,
        rowCount: totalCount,
        onPaginationChange: (page, pageSize) => {
          fetchData(page, pageSize)
        },
        onSortChange: (columnId, direction) => {
          console.log('Sort:', columnId, direction)
          // Fetch sorted data from server
        },
        onFilterChange: (filters) => {
          console.log('Filters:', filters)
          // Fetch filtered data from server
        },
      }}
    />
  )
}
```

### Styling

```tsx
<DataGrid
  data={users}
  columns={columns}
  options={{
    className: 'my-custom-table-wrapper',
    tableClassName: 'my-custom-table',
  }}
/>
```

### Accessibility

```tsx
<DataGrid
  data={users}
  columns={columns}
  options={{
    title: 'Users table',
    description: 'A list of all users in the system with their details',
  }}
/>
```

## Complete Example

```tsx
import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  DataGrid,
  createColumns,
  createSelectionColumn,
  createActionsColumn,
} from '@/components/data-grid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus } from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive' | 'invited'
  createdAt: Date
}

export function UsersTable({ data }: { data: User[] }) {
  const navigate = useNavigate()
  const search = useSearch({ from: '/users' })
  const [selectedRows, setSelectedRows] = useState({})

  const columns = [
    createSelectionColumn<User>(),
    ...createColumns<User>([
      {
        accessorKey: 'name',
        header: 'Name',
        options: {
          sortable: true,
          filterable: true,
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        options: {
          sortable: true,
          customRender: (value) => (
            <a
              href={`mailto:${value}`}
              className="text-blue-600 hover:underline"
            >
              {String(value)}
            </a>
          ),
        },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        options: {
          align: 'center',
          customRender: (value) => (
            <Badge
              variant={
                value === 'admin'
                  ? 'default'
                  : value === 'moderator'
                  ? 'secondary'
                  : 'outline'
              }
            >
              {String(value)}
            </Badge>
          ),
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        options: {
          customRender: (value) => (
            <Badge
              variant={
                value === 'active'
                  ? 'default'
                  : value === 'invited'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {String(value)}
            </Badge>
          ),
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        options: {
          sortable: true,
          customRender: (value) => {
            const date = value instanceof Date ? value : new Date(String(value))
            return date.toLocaleDateString()
          },
        },
      },
    ]),
    createActionsColumn<User>(
      (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log('Edit', row.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('View', row.id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log('Delete', row.id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      { className: 'w-[70px]' }
    ),
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <DataGrid
        data={data}
        columns={columns}
        options={{
          search,
          navigate,
          enableRowSelection: true,
          searchPlaceholder: 'Search users...',
          searchKey: 'name',
          filters: [
            {
              columnId: 'status',
              title: 'Status',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Invited', value: 'invited' },
              ],
            },
            {
              columnId: 'role',
              title: 'Role',
              options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Moderator', value: 'moderator' },
                { label: 'User', value: 'user' },
              ],
            },
          ],
          pagination: {
            defaultPage: 1,
            defaultPageSize: 10,
          },
          columnFilters: [
            { columnId: 'name', searchKey: 'name', type: 'string' },
            { columnId: 'status', searchKey: 'status', type: 'array' },
            { columnId: 'role', searchKey: 'role', type: 'array' },
          ],
          onRowSelectionChange: setSelectedRows,
          onRowClick: (row) => {
            console.log('Clicked:', row)
          },
          title: 'Users table',
          description: 'Manage users in your organization',
        }}
      />
    </div>
  )
}
```

## API Reference

### DataGridProps

| Prop | Type | Description |
|------|------|-------------|
| `data` | `TData[]` | Array of data to display in the table |
| `columns` | `ColumnDef<TData>[]` | Column definitions (use helper functions to create) |
| `options` | `DataGridOptions` | Configuration options for the table |

### DataGridOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `search` | `Record<string, unknown>` | - | URL search params for state sync |
| `navigate` | `NavigateFn` | - | Navigation function for URL state sync |
| `enableRowSelection` | `boolean` | `false` | Enable row selection with checkboxes |
| `enableSorting` | `boolean` | `true` | Enable column sorting |
| `enableFiltering` | `boolean` | `true` | Enable filtering |
| `enablePagination` | `boolean` | `true` | Enable pagination |
| `enableColumnVisibility` | `boolean` | `true` | Enable column visibility toggle |
| `enableGlobalFilter` | `boolean` | `false` | Enable global search |
| `pagination` | `DataGridPaginationConfig` | - | Pagination configuration |
| `columnFilters` | `DataGridColumnFilter[]` | `[]` | Column filter configurations |
| `filters` | `DataGridFilter[]` | `[]` | Filter UI definitions |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `searchKey` | `string` | - | Column key for search filtering |
| `className` | `string` | - | CSS class for wrapper |
| `tableClassName` | `string` | - | CSS class for table |
| `onRowClick` | `(row, index) => void` | - | Row click handler |
| `onRowSelectionChange` | `(selection) => void` | - | Selection change handler |
| `serverSide` | `boolean` | `false` | Enable server-side mode |
| `rowCount` | `number` | - | Total row count (server-side) |
| `onPaginationChange` | `(page, size) => void` | - | Pagination change handler |
| `onSortChange` | `(id, dir) => void` | - | Sort change handler |
| `onFilterChange` | `(filters) => void` | - | Filter change handler |
| `customToolbar` | `ReactNode` | - | Custom toolbar component |
| `customBulkActions` | `(props) => ReactNode` | - | Custom bulk actions component |
| `customEmptyState` | `ReactNode` | - | Custom empty state component |
| `title` | `string` | - | Accessible table title |
| `description` | `string` | - | Accessible table description |

## Comparison with MUI DataTables

| Feature | MUI DataTables | DataGrid |
|---------|----------------|----------|
| Framework | MUI | shadcn/ui |
| Table Library | Custom | TanStack Table |
| TypeScript | ✅ | ✅ |
| Sorting | ✅ | ✅ |
| Filtering | ✅ | ✅ |
| Pagination | ✅ | ✅ |
| Row Selection | ✅ | ✅ |
| Column Visibility | ✅ | ✅ |
| Server-Side | ✅ | ✅ |
| URL State Sync | ❌ | ✅ |
| Customization | Medium | High |
| Bundle Size | Large | Small |

## License

MIT
