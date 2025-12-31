import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'

// ============= Types =============

export type DataGridColumnOptions<TData = unknown> = {
  id?: string
  label?: string
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  hideable?: boolean
  width?: number | string
  minWidth?: number
  maxWidth?: number
  align?: 'left' | 'center' | 'right'
  className?: string
  headerClassName?: string
  cellClassName?: string
  customRender?: (value: unknown, row: TData, rowIndex: number) => React.ReactNode
  customHeader?: () => React.ReactNode
}

export type DataGridColumn<TData = unknown> = {
  accessorKey?: string
  id?: string
  header?: string | ((props: unknown) => React.ReactNode)
  cell?: (props: unknown) => React.ReactNode
  options?: DataGridColumnOptions<TData>
}

// ============= Column Builders =============

/**
 * Creates a standard column definition compatible with TanStack Table
 */
export function createColumn<TData = unknown>(
  column: DataGridColumn<TData>
): ColumnDef<TData> {
  const { accessorKey, id, header, cell, options = {} } = column

  const {
    label,
    sortable = true,
    filterable = true,
    hideable = true,
    className,
    headerClassName,
    cellClassName,
    customRender,
    customHeader,
    align = 'left',
  } = options

  // Determine header display
  const headerDisplay = customHeader
    ? customHeader
    : label || header || accessorKey || id || ''

  return {
    accessorKey: accessorKey as string,
    id: id || accessorKey,
    header: sortable
      ? ({ column: col }) => (
          <DataTableColumnHeader column={col} title={String(headerDisplay)} />
        )
      : () => <div className={headerClassName}>{headerDisplay}</div>,
    cell: customRender
      ? ({ row, getValue }) => {
          const value = getValue()
          return customRender(value, row.original, row.index)
        }
      : cell
      ? cell
      : ({ getValue }) => {
          const value = getValue()
          return <div className={cellClassName}>{String(value ?? '')}</div>
        },
    enableSorting: sortable,
    enableColumnFilter: filterable,
    enableHiding: hideable,
    meta: {
      className: className || getAlignmentClass(align),
      thClassName: headerClassName,
      tdClassName: cellClassName,
    },
  } as ColumnDef<TData>
}

/**
 * Creates a selection column with checkboxes
 */
export function createSelectionColumn<TData = unknown>(): ColumnDef<TData> {
  return {
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
    size: 40,
    meta: {
      className: 'w-[40px]',
    },
  } as ColumnDef<TData>
}

/**
 * Creates an actions column (typically for row-level actions)
 */
export function createActionsColumn<TData = unknown>(
  renderActions: (row: TData, rowIndex: number) => React.ReactNode,
  options: { label?: string; className?: string } = {}
): ColumnDef<TData> {
  return {
    id: 'actions',
    header: options.label || 'Actions',
    cell: ({ row }) => renderActions(row.original, row.index),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: options.className || 'w-[100px]',
    },
  } as ColumnDef<TData>
}

/**
 * Helper to convert array of simple column definitions to TanStack columns
 */
export function createColumns<TData = unknown>(
  columns: DataGridColumn<TData>[]
): ColumnDef<TData>[] {
  return columns.map((col) => createColumn(col))
}

// ============= Helpers =============

function getAlignmentClass(align: 'left' | 'center' | 'right'): string {
  switch (align) {
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    default:
      return 'text-left'
  }
}

/**
 * Example usage with typed columns
 */
export function createTypedColumns<TData = unknown>() {
  return {
    text: (
      accessorKey: string,
      label: string,
      options?: DataGridColumnOptions<TData>
    ) =>
      createColumn<TData>({
        accessorKey,
        header: label,
        options,
      }),

    number: (
      accessorKey: string,
      label: string,
      options?: DataGridColumnOptions<TData>
    ) =>
      createColumn<TData>({
        accessorKey,
        header: label,
        options: {
          ...options,
          align: 'right',
        },
      }),

    date: (
      accessorKey: string,
      label: string,
      format?: (date: Date) => string,
      options?: DataGridColumnOptions<TData>
    ) =>
      createColumn<TData>({
        accessorKey,
        header: label,
        options: {
          ...options,
          customRender: (value) => {
            if (!value) return ''
            const date = value instanceof Date ? value : new Date(String(value))
            return format ? format(date) : date.toLocaleDateString()
          },
        },
      }),

    boolean: (
      accessorKey: string,
      label: string,
      labels?: { true: string; false: string },
      options?: DataGridColumnOptions<TData>
    ) =>
      createColumn<TData>({
        accessorKey,
        header: label,
        options: {
          ...options,
          customRender: (value) => {
            const boolValue = Boolean(value)
            if (labels) {
              return boolValue ? labels.true : labels.false
            }
            return boolValue ? '✓' : '✗'
          },
        },
      }),

    custom: (
      accessorKey: string,
      label: string,
      render: (value: unknown, row: TData, rowIndex: number) => React.ReactNode,
      options?: DataGridColumnOptions<TData>
    ) =>
      createColumn<TData>({
        accessorKey,
        header: label,
        options: {
          ...options,
          customRender: render,
        },
      }),
  }
}
