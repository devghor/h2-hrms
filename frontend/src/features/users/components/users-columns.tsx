import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const usersColumns: ColumnDef<User>[] = [
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
    cell: ({ row }) => (
      <div className='w-full'>{row.getValue('ulid')}</div>
    ),
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
    cell: DataTableRowActions,
  },
]
