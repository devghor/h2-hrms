import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  DataGrid,
  createColumns,
  createSelectionColumn,
  createActionsColumn,
} from '@/components/data-grid'
import { Badge } from '@/components/ui/badge'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { DataTableRowActions } from './data-table-row-actions'
import { type User } from '../data/schema'
import { roles } from '../data/data'

type UsersTableProps = {
  data: User[]
}

export function UsersTableWithDataGrid({ data }: UsersTableProps) {
  const navigate = useNavigate({ from: '/users' })
  const search = useSearch({ from: '/users' })

  // Define columns using the helper functions
  const columns = [
    // Selection column
    createSelectionColumn<User>(),

    // Data columns
    ...createColumns<User>([
      {
        accessorKey: 'username',
        header: 'Username',
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
              className='text-blue-600 hover:underline dark:text-blue-400'
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
          sortable: true,
          align: 'center',
          customRender: (value) => {
            const role = roles.find((r) => r.value === value)
            const Icon = role?.icon
            return (
              <div className='flex items-center justify-center gap-2'>
                {Icon && <Icon className='h-4 w-4 text-muted-foreground' />}
                <span className='capitalize'>{String(value)}</span>
              </div>
            )
          },
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        options: {
          sortable: true,
          align: 'center',
          customRender: (value) => {
            const status = String(value)
            const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
              active: 'default',
              inactive: 'secondary',
              invited: 'outline',
              suspended: 'destructive',
            }
            return (
              <Badge variant={variants[status] || 'outline'}>
                <span className='capitalize'>{status}</span>
              </Badge>
            )
          },
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        options: {
          sortable: true,
          customRender: (value) => {
            if (!value) return ''
            const date = value instanceof Date ? value : new Date(String(value))
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          },
        },
      },
    ]),

    // Actions column
    createActionsColumn<User>(
      (row) => <DataTableRowActions row={row} />,
      { className: 'w-[70px]' }
    ),
  ]

  return (
    <DataGrid
      data={data}
      columns={columns}
      options={{
        // URL state synchronization
        search,
        navigate,

        // Features
        enableRowSelection: true,
        enableSorting: true,
        enableFiltering: true,
        enablePagination: true,
        enableColumnVisibility: true,

        // Search configuration
        searchPlaceholder: 'Filter users...',
        searchKey: 'username',

        // Filters
        filters: [
          {
            columnId: 'status',
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Invited', value: 'invited' },
              { label: 'Suspended', value: 'suspended' },
            ],
          },
          {
            columnId: 'role',
            title: 'Role',
            options: roles.map((role) => ({ ...role })),
          },
        ],

        // Column filters for URL sync
        columnFilters: [
          { columnId: 'username', searchKey: 'username', type: 'string' },
          { columnId: 'status', searchKey: 'status', type: 'array' },
          { columnId: 'role', searchKey: 'role', type: 'array' },
        ],

        // Pagination
        pagination: {
          defaultPage: 1,
          defaultPageSize: 10,
        },

        // Custom bulk actions
        customBulkActions: ({ table }) => <DataTableBulkActions table={table} />,

        // Accessibility
        title: 'Users table',
        description: 'A list of all users in the system with their details and actions',
      }}
    />
  )
}
