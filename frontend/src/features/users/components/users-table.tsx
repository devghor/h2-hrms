import { useEffect, useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type ColumnDef, type Row, type Table } from '@tanstack/react-table'
import { Trash2, UserPen, UserX, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { cn, sleep } from '@/lib/utils'
import { useDataTable } from '@/hooks/use-data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/ui/data-table'
import { DataTableViewOptions } from '@/components/ui/data-table/data-table-view-options'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type User } from '../data/schema'
import {
  UsersFiltersPopover,
  ActiveFiltersDisplay,
  type UsersFilters,
} from './users-filters'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

// ============= Row Actions Component =============
function DataTableRowActions({
  row,
  onEdit,
  onDelete,
}: {
  row: Row<User>
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={() => onEdit(row.original)}>
          Edit
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(row.original)}
          className='text-red-500!'
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ============= Bulk Actions Component =============
function DataTableBulkActions({ table }: { table: Table<User> }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original)
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activating' : 'Deactivating'} users...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activating' : 'deactivating'} users`,
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='user'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
            >
              <UserCheck />
              <span className='sr-only'>Activate selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activate selected users</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
            >
              <UserX />
              <span className='sr-only'>Deactivate selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deactivate selected users</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected users</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected users</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}

// ============= Column Definitions =============
function getUsersColumns(
  onEdit: (user: User) => void,
  onDelete: (user: User) => void
): ColumnDef<User>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      ),
      meta: {
        className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
      },
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'ulid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ULID' />
      ),
      cell: ({ row }) => <div className='w-full'>{row.getValue('ulid')}</div>,
      meta: {
        className: cn(
          'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
          'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
        ),
      },
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-48'>{row.getValue('name')}</LongText>
      ),
      meta: { className: 'min-w-[200px]' },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => (
        <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
      ),
      meta: { className: 'min-w-[250px]' },
    },
    {
      accessorKey: 'email_verified_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email Verified' />
      ),
      cell: ({ row }) => {
        const verified = row.getValue('email_verified_at')
        return (
          <div className='flex justify-center'>
            <Badge variant={verified ? 'default' : 'secondary'}>
              {verified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'tenant_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tenant ID' />
      ),
      cell: ({ row }) => (
        <div className='font-mono text-xs text-muted-foreground'>
          {row.getValue('tenant_id')}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'))
        return (
          <div className='text-nowrap'>
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        )
      },
      meta: { className: 'min-w-[120px]' },
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Updated At' />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('updated_at'))
        return (
          <div className='text-nowrap'>
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        )
      },
      meta: { className: 'min-w-[120px]' },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ]
}

// ============= Main Table Component =============
type UsersTableProps = {
  data: User[]
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  isLoading?: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  filters: UsersFilters
  onFiltersChange: (filters: UsersFilters) => void
  onApplyFilters: (filters: UsersFilters) => void
}

export function UsersTable({
  data,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSort,
  sortBy,
  sortOrder,
  isLoading = false,
  onEdit,
  onDelete,
  filters,
  onFiltersChange,
  onApplyFilters,
}: UsersTableProps) {
  const pageCount = Math.ceil(totalCount / pageSize)
  const usersColumns = getUsersColumns(onEdit, onDelete)

  const { table } = useDataTable({
    data,
    columns: usersColumns,
    pageCount,
    initialState: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
      sorting:
        sortBy && sortOrder ? [{ id: sortBy, desc: sortOrder === 'desc' }] : [],
    },
  })

  // Sync external pagination with table pagination
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
  }, [
    table.getState().pagination,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
  ])

  // Sync sorting with server
  useEffect(() => {
    if (!onSort) return

    const sorting = table.getState().sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0]
      const newSortBy = id
      const newSortOrder = desc ? 'desc' : 'asc'

      if (newSortBy !== sortBy || newSortOrder !== sortOrder) {
        onSort(newSortBy, newSortOrder)
      }
    }
  }, [table.getState().sorting, sortBy, sortOrder, onSort])

  const handleRemoveFilter = (key: keyof UsersFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
    onApplyFilters(newFilters)
  }

  return (
    <DataTable
      table={table}
      actionBar={<DataTableBulkActions table={table} />}
      isLoading={isLoading}
    >
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <UsersFiltersPopover
            filters={filters}
            onFiltersChange={onFiltersChange}
            onApply={onApplyFilters}
          />
          <ActiveFiltersDisplay
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
          />
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </DataTable>
  )
}
