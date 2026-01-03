import { useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter, DataTableViewOptions } from '@/components/data-table'
import { type User } from '../data/schema'
import { UsersDateFilter } from './users-date-filter'
import { type NavigateFn } from '@/hooks/use-table-url-state'

type UsersToolbarProps = {
  table: Table<User>
  search: Record<string, unknown>
  navigate: NavigateFn
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function UsersToolbar({
  table,
  search,
  navigate,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
}: UsersToolbarProps) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || 
    table.getState().globalFilter ||
    search.from_date ||
    search.to_date

  const [searchInput, setSearchInput] = useState(
    searchKey
      ? ((table.getColumn(searchKey)?.getFilterValue() as string) ?? '')
      : (table.getState().globalFilter ?? '')
  )

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (searchKey) {
        table.getColumn(searchKey)?.setFilterValue(searchInput)
      } else {
        table.setGlobalFilter(searchInput)
      }
    }
  }

  const handleReset = () => {
    table.resetColumnFilters()
    table.setGlobalFilter('')
    setSearchInput('')
    // Reset date filters
    navigate({
      search: (prev) => {
        const newSearch = { ...prev }
        delete newSearch.from_date
        delete newSearch.to_date
        return newSearch
      },
    })
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={handleSearchKeyPress}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={handleSearchKeyPress}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
          <UsersDateFilter search={search} navigate={navigate} />
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={handleReset}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
