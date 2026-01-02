import { type NavigateFn } from '@/hooks/use-table-url-state'
import { DataGrid } from '@/components/data-grid'
import { Skeleton } from '@/components/ui/skeleton'
import { type User } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { usersColumns } from './users-columns'

type DataTableProps = {
  data: User[]
  totalCount: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}

export function UsersTable({ data, totalCount, search, navigate, isLoading = false }: DataTableProps) {
  // If loading, show skeleton UI that maintains the search bar
  if (isLoading) {
    return (
      <div className='space-y-4'>
        {/* Search and Filter Bar Skeleton */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-10 w-full max-w-sm' />
          <Skeleton className='h-10 w-24' />
          <Skeleton className='h-10 w-10' />
        </div>
        
        {/* Table Skeleton */}
        <div className='rounded-md border'>
          {/* Table Header */}
          <div className='border-b bg-muted/50 p-4'>
            <div className='flex items-center gap-4'>
              <Skeleton className='h-4 w-4' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-48' />
              <Skeleton className='h-4 w-40' />
              <Skeleton className='ms-auto h-4 w-24' />
            </div>
          </div>
          
          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='border-b p-4 last:border-0'>
              <div className='flex items-center gap-4'>
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-48' />
                <Skeleton className='h-4 w-40' />
                <Skeleton className='ms-auto h-4 w-24' />
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Skeleton */}
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-48' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-8 w-8' />
          </div>
        </div>
      </div>
    )
  }
  
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
