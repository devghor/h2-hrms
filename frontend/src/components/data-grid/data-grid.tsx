import { useEffect, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  type ColumnDef,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'

// ============= Types =============

export type DataGridFilterOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export type DataGridFilter = {
  columnId: string
  title: string
  options: DataGridFilterOption[]
}

export type DataGridColumnFilter = {
  columnId: string
  searchKey: string
  type?: 'string' | 'array'
  serialize?: (value: unknown) => unknown
  deserialize?: (value: unknown) => unknown
}

export type DataGridPaginationConfig = {
  pageKey?: string
  pageSizeKey?: string
  defaultPage?: number
  defaultPageSize?: number
  rowsPerPageOptions?: number[]
}

export type DataGridOptions = {
  // URL state management (optional - if provided, syncs with URL)
  search?: Record<string, unknown>
  navigate?: NavigateFn

  // Features
  enableRowSelection?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  enablePagination?: boolean
  enableColumnVisibility?: boolean
  enableGlobalFilter?: boolean

  // Pagination
  pagination?: DataGridPaginationConfig

  // Filters
  columnFilters?: DataGridColumnFilter[]
  filters?: DataGridFilter[]

  // Search
  searchPlaceholder?: string
  searchKey?: string

  // Styling
  className?: string
  tableClassName?: string

  // Callbacks
  onRowClick?: (row: unknown, rowIndex: number) => void
  onRowSelectionChange?: (selectedRows: RowSelectionState) => void

  // Server-side mode
  serverSide?: boolean
  rowCount?: number
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortChange?: (columnId: string, direction: 'asc' | 'desc') => void
  onFilterChange?: (filters: Record<string, unknown>) => void

  // Custom Components
  customToolbar?: React.ReactNode | ((props: { table: ReturnType<typeof useReactTable> }) => React.ReactNode)
  customBulkActions?: (props: { table: ReturnType<typeof useReactTable> }) => React.ReactNode
  customEmptyState?: React.ReactNode

  // Accessibility
  title?: string
  description?: string
}

export type DataGridProps<TData = unknown> = {
  data: TData[]
  columns: ColumnDef<TData>[]
  options?: DataGridOptions
}

// ============= Component =============

export function DataGrid<TData>({
  data,
  columns,
  options = {},
}: DataGridProps<TData>) {
  // Destructure options with defaults
  const {
    search,
    navigate,
    enableRowSelection = false,
    enableSorting = true,
    enableFiltering = true,
    enablePagination = true,
    enableColumnVisibility = true,
    enableGlobalFilter = false,
    pagination: paginationConfig,
    columnFilters: columnFiltersConfig = [],
    filters = [],
    searchPlaceholder = 'Search...',
    searchKey,
    className,
    tableClassName,
    onRowClick,
    onRowSelectionChange,
    serverSide = false,
    rowCount,
    onPaginationChange,
    onSortChange,
    onFilterChange,
    customToolbar,
    customBulkActions,
    customEmptyState,
    title,
    description,
  } = options

  // Local UI-only states
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  // Determine if we're using URL state management
  const useUrlState = !!(search && navigate)

  // URL-synced state or local state
  const urlState = useUrlState
    ? useTableUrlState({
        search: search!,
        navigate: navigate!,
        pagination: {
          defaultPage: paginationConfig?.defaultPage ?? 1,
          defaultPageSize: paginationConfig?.defaultPageSize ?? 10,
          pageKey: paginationConfig?.pageKey,
          pageSizeKey: paginationConfig?.pageSizeKey,
        },
        globalFilter: { enabled: enableGlobalFilter },
        columnFilters: columnFiltersConfig,
      })
    : null

  // Local state fallback
  const [localColumnFilters, setLocalColumnFilters] = useState<
    Array<{ id: string; value: unknown }>
  >([])
  const [localPagination, setLocalPagination] = useState({
    pageIndex: 0,
    pageSize: paginationConfig?.defaultPageSize ?? 10,
  })
  const [localGlobalFilter, setLocalGlobalFilter] = useState('')

  // Use URL state if available, otherwise use local state
  const columnFilters = urlState?.columnFilters ?? localColumnFilters
  const onColumnFiltersChange =
    urlState?.onColumnFiltersChange ?? setLocalColumnFilters
  const paginationState = urlState?.pagination ?? localPagination
  const onPaginationChangeHandler = urlState?.onPaginationChange ?? setLocalPagination
  const globalFilter = urlState?.globalFilter ?? localGlobalFilter
  const onGlobalFilterChange =
    urlState?.onGlobalFilterChange ?? setLocalGlobalFilter

  // Handle row selection changes
  const handleRowSelectionChange = (
    updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
  ) => {
    const newSelection =
      typeof updater === 'function' ? updater(rowSelection) : updater
    setRowSelection(newSelection)
    onRowSelectionChange?.(newSelection)
  }

  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: enableSorting ? sorting : undefined,
      pagination: enablePagination ? paginationState : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
      columnFilters: enableFiltering ? columnFilters : undefined,
      columnVisibility: enableColumnVisibility ? columnVisibility : undefined,
      globalFilter: enableGlobalFilter ? globalFilter : undefined,
    },
    enableRowSelection,
    enableSorting,
    enableFilters: enableFiltering,
    onPaginationChange: enablePagination ? onPaginationChangeHandler : undefined,
    onColumnFiltersChange: enableFiltering ? onColumnFiltersChange : undefined,
    onRowSelectionChange: enableRowSelection
      ? handleRowSelectionChange
      : undefined,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnVisibilityChange: enableColumnVisibility
      ? setColumnVisibility
      : undefined,
    onGlobalFilterChange: enableGlobalFilter
      ? onGlobalFilterChange
      : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFacetedRowModel: enableFiltering ? getFacetedRowModel() : undefined,
    getFacetedUniqueValues: enableFiltering
      ? getFacetedUniqueValues()
      : undefined,
    manualPagination: serverSide,
    manualSorting: serverSide,
    manualFiltering: serverSide,
    pageCount: serverSide && rowCount ? Math.ceil(rowCount / paginationState.pageSize) : undefined,
  })

  // Handle page validation for URL-synced state
  useEffect(() => {
    if (urlState?.ensurePageInRange) {
      urlState.ensurePageInRange(table.getPageCount())
    }
  }, [table, urlState])

  // Server-side callbacks
  useEffect(() => {
    if (serverSide && onPaginationChange) {
      onPaginationChange(
        paginationState.pageIndex + 1,
        paginationState.pageSize
      )
    }
  }, [serverSide, onPaginationChange, paginationState])

  useEffect(() => {
    if (serverSide && onSortChange && sorting.length > 0) {
      const sort = sorting[0]
      onSortChange(sort.id, sort.desc ? 'desc' : 'asc')
    }
  }, [serverSide, onSortChange, sorting])

  useEffect(() => {
    if (serverSide && onFilterChange && columnFilters.length > 0) {
      const filterObj = columnFilters.reduce((acc, filter) => {
        acc[filter.id] = filter.value
        return acc
      }, {} as Record<string, unknown>)
      onFilterChange(filterObj)
    }
  }, [serverSide, onFilterChange, columnFilters])

  // Default empty state
  const EmptyState = customEmptyState ?? (
    <TableRow>
      <TableCell colSpan={columns.length} className='h-24 text-center'>
        No results found.
      </TableCell>
    </TableRow>
  )

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4',
        className
      )}
      role='region'
      aria-label={title}
      aria-describedby={description ? 'data-grid-description' : undefined}
    >
      {description && (
        <p id='data-grid-description' className='sr-only'>
          {description}
        </p>
      )}

      {/* Custom Toolbar or Default Toolbar */}
      {typeof customToolbar === 'function' ? customToolbar({ table }) : customToolbar || (enableFiltering && (
        <DataTableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          searchKey={searchKey}
          filters={filters}
        />
      ))}

      {/* Table */}
      <div className='overflow-hidden rounded-md border'>
        <Table className={tableClassName}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        header.column.columnDef.meta?.className,
                        (header.column.columnDef.meta as { thClassName?: string })?.thClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'group/row',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() =>
                    onRowClick?.(row.original, row.index)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        (cell.column.columnDef.meta as { tdClassName?: string })?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              EmptyState
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <DataTablePagination table={table} className='mt-auto' />
      )}

      {/* Bulk Actions */}
      {customBulkActions?.({ table })}
    </div>
  )
}
