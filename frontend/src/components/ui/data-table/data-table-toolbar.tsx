'use client'

import type { Table } from '@tanstack/react-table'
import * as React from 'react'

import { DataTableViewOptions } from '@/components/ui/data-table/data-table-view-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Cross2Icon } from '@radix-ui/react-icons'

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>
  searchKey?: string
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  searchValue?: string
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  searchKey,
  searchPlaceholder = 'Search...',
  onSearch,
  searchValue,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const [searchInput, setSearchInput] = React.useState(
    searchValue ||
    (searchKey
      ? ((table.getColumn(searchKey)?.getFilterValue() as string) ?? '')
      : '')
  )

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchKey) {
      if (onSearch) {
        onSearch(searchInput)
      } else {
        table.getColumn(searchKey)?.setFilterValue(searchInput)
      }
    }
  }

  const onReset = React.useCallback(() => {
    table.resetColumnFilters()
    setSearchInput('')
    if (onSearch) {
      onSearch('')
    }
  }, [table, onSearch])

  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn(
        'flex w-full items-start justify-between gap-2 p-1',
        className
      )}
      {...props}
    >
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={handleSearchKeyPress}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        {children}
        {isFiltered && (
          <Button
            aria-label='Reset filters'
            variant='outline'
            size='sm'
            className='border-dashed'
            onClick={onReset}
          >
            Reset
            <Cross2Icon className='ml-2 size-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
