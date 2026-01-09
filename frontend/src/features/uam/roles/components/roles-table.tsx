import { useEffect, useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type ColumnDef, type Row, type Table } from '@tanstack/react-table'
import { Trash2, Edit, Shield } from 'lucide-react'
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
import { type Role } from '../data/schema'
import {
  RolesFiltersPopover,
  ActiveFiltersDisplay,
  type RolesFilters,
} from './roles-filters'
import { RolesMultiDeleteDialog } from './roles-multi-delete-dialog'

// ============= Row Actions Component =============
function DataTableRowActions({
  row,
  onEdit,
  onDelete,
}: {
  row: Row<Role>
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}) {
  const isSystemRole = ['Super Admin', 'Admin'].includes(row.original.name)

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
            <Edit size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(row.original)}
          className='text-red-500!'
          disabled={isSystemRole}
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
function DataTableBulkActions({ 
  table,
  onSuccess 
}: { 
  table: Table<Role>
  onSuccess: () => void
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='role'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected roles</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected roles</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <RolesMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
        onSuccess={onSuccess}
      />
    </>
  )
}

// ============= Column Definitions =============
function getRolesColumns(
  onEdit: (role: Role) => void,
  onDelete: (role: Role) => void
): ColumnDef<Role>[] {
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
      cell: ({ row }) => {
        const isSystemRole = ['Super Admin', 'Admin'].includes(row.original.name)
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
            className='translate-y-[2px]'
            disabled={isSystemRole}
          />
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Shield className='h-4 w-4 text-muted-foreground' />
          <LongText className='max-w-48 font-medium'>{row.getValue('name')}</LongText>
        </div>
      ),
      meta: {
        className: cn(
          'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
          'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none min-w-[200px]'
        ),
      },
      enableHiding: false,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Description' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-80'>{row.getValue('description') || '-'}</LongText>
      ),
      meta: { className: 'min-w-[300px]' },
      enableSorting: false,
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => {
        const permissions = row.original.permissions || []
        return (
          <div className='flex items-center gap-1'>
            <Badge variant='secondary'>
              {permissions.length}
            </Badge>
            <span className='text-xs text-muted-foreground'>permissions</span>
          </div>
        )
      },
      enableSorting: false,
      meta: { className: 'min-w-[150px]' },
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
type RolesTableProps = {
  data: Role[]
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  isLoading?: boolean
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  onRefresh: () => void
  filters: RolesFilters
  onFiltersChange: (filters: RolesFilters) => void
  onApplyFilters: (filters: RolesFilters) => void
}

export function RolesTable({
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
  onRefresh,
  filters,
  onFiltersChange,
  onApplyFilters,
}: RolesTableProps) {
  const pageCount = Math.ceil(totalCount / pageSize)
  const rolesColumns = getRolesColumns(onEdit, onDelete)

  const { table } = useDataTable({
    data,
    columns: rolesColumns,
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

  const handleRemoveFilter = (key: keyof RolesFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
    onApplyFilters(newFilters)
  }

  return (
    <DataTable
      table={table}
      actionBar={<DataTableBulkActions table={table} onSuccess={onRefresh} />}
      isLoading={isLoading}
    >
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <RolesFiltersPopover
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
