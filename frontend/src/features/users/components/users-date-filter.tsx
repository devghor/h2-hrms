import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { type NavigateFn } from '@/hooks/use-table-url-state'

type UsersDateFilterProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function UsersDateFilter({ search, navigate }: UsersDateFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fromDate = search.from_date ? new Date(search.from_date as string) : undefined
  const toDate = search.to_date ? new Date(search.to_date as string) : undefined

  const handleFromDateSelect = (date: Date | undefined) => {
    if (date) {
      navigate({
        search: (prev) => ({
          ...prev,
          from_date: format(date, 'yyyy-MM-dd'),
        }),
      })
    } else {
      navigate({
        search: (prev) => {
          const newSearch = { ...prev }
          delete newSearch.from_date
          return newSearch
        },
      })
    }
  }

  const handleToDateSelect = (date: Date | undefined) => {
    if (date) {
      navigate({
        search: (prev) => ({
          ...prev,
          to_date: format(date, 'yyyy-MM-dd'),
        }),
      })
    } else {
      navigate({
        search: (prev) => {
          const newSearch = { ...prev }
          delete newSearch.to_date
          return newSearch
        },
      })
    }
    setIsOpen(false)
  }

  const hasDateFilter = fromDate || toDate

  const getButtonText = () => {
    if (fromDate && toDate) {
      return `${format(fromDate, 'MMM dd, yyyy')} - ${format(toDate, 'MMM dd, yyyy')}`
    }
    if (fromDate) {
      return `From ${format(fromDate, 'MMM dd, yyyy')}`
    }
    if (toDate) {
      return `To ${format(toDate, 'MMM dd, yyyy')}`
    }
    return 'Created Date'
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'h-8 border-dashed',
            hasDateFilter && 'border-solid bg-accent'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {getButtonText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='flex flex-row gap-2 p-3'>
          <div className='space-y-1'>
            <div className='text-sm font-medium'>From Date</div>
            <Calendar
              mode='single'
              selected={fromDate}
              onSelect={handleFromDateSelect}
              initialFocus
            />
          </div>
          <div className='space-y-1'>
            <div className='text-sm font-medium'>To Date</div>
            <Calendar
              mode='single'
              selected={toDate}
              onSelect={handleToDateSelect}
              disabled={(date) => fromDate ? date < fromDate : false}
            />
          </div>
        </div>
        {hasDateFilter && (
          <div className='border-t p-2'>
            <Button
              variant='ghost'
              className='w-full'
              onClick={() => {
                handleFromDateSelect(undefined)
                handleToDateSelect(undefined)
                setIsOpen(false)
              }}
            >
              Clear dates
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
