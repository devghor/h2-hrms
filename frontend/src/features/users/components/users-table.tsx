import { type NavigateFn } from '@/hooks/use-table-url-state'
import { DataGrid } from '@/components/data-grid'
import { type User } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { usersColumns } from './users-columns'

type DataTableProps = {
  data: User[]
  totalCount: number
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function UsersTable({ data, totalCount, search, navigate }: DataTableProps) {
  return (
    <DataGrid
      data={data}
      columns={usersColumns}
      options={{
        // URL state synchronization
        search,
        navigate,

        // Server-side mode
        serverSide: true,
        rowCount: totalCount,

        // Features
        enableRowSelection: true,
        enableSorting: true,
        enableFiltering: true,
        enablePagination: true,
        enableColumnVisibility: true,
        enableGlobalFilter: false,

        // Search configuration
        searchPlaceholder: 'Search by name or email...',
        searchKey: 'name',

        // Filters
        filters: [
          {
            columnId: 'email_verified_at',
            title: 'Email Status',
            options: [
              { label: 'Verified', value: 'verified' },
              { label: 'Unverified', value: 'unverified' },
            ],
          },
        ],

        // Column filters for URL sync
        columnFilters: [
          { columnId: 'name', searchKey: 'name', type: 'string' },
          { columnId: 'email', searchKey: 'email', type: 'string' },
        ],

        // Pagination
        pagination: {
          defaultPage: 1,
          defaultPageSize: 15,
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
