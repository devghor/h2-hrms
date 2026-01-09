import { useState, useEffect } from 'react'
import { X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export type RolesFilters = {
  name?: string
  description?: string
  from_date?: string
  to_date?: string
}

type RolesFiltersProps = {
  filters: RolesFilters
  onFiltersChange: (filters: RolesFilters) => void
  onApply: (filters: RolesFilters) => void
}

export function RolesFiltersPopover({
  filters,
  onFiltersChange,
  onApply,
}: RolesFiltersProps) {
  const [localFilters, setLocalFilters] = useState<RolesFilters>(filters)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleApply = () => {
    onFiltersChange(localFilters)
    onApply(localFilters)
    setOpen(false)
  }

  const handleReset = () => {
    const emptyFilters: RolesFilters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
    onApply(emptyFilters)
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 rounded-full px-1.5 py-0.5 text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Roles</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-auto p-0 text-xs"
            >
              Reset all
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="filter-name" className="text-xs">
                Name
              </Label>
              <Input
                id="filter-name"
                placeholder="Search by name..."
                value={localFilters.name || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, name: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApply()
                  }
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="filter-description" className="text-xs">
                Description
              </Label>
              <Input
                id="filter-description"
                placeholder="Search by description..."
                value={localFilters.description || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, description: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApply()
                  }
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Created Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="filter-from-date" className="text-[10px] text-muted-foreground">
                    From
                  </Label>
                  <Input
                    id="filter-from-date"
                    type="date"
                    value={localFilters.from_date || ''}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, from_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="filter-to-date" className="text-[10px] text-muted-foreground">
                    To
                  </Label>
                  <Input
                    id="filter-to-date"
                    type="date"
                    value={localFilters.to_date || ''}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, to_date: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function ActiveFiltersDisplay({
  filters,
  onRemoveFilter,
}: {
  filters: RolesFilters
  onRemoveFilter: (key: keyof RolesFilters) => void
}) {
  const filterEntries = Object.entries(filters).filter(([_, value]) => value)

  if (filterEntries.length === 0) return null

  const getFilterLabel = (key: string): string => {
    const labels: Record<string, string> = {
      name: 'Name',
      description: 'Description',
      from_date: 'From',
      to_date: 'To',
    }
    return labels[key] || key
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filterEntries.map(([key, value]) => (
        <Badge
          key={key}
          variant="secondary"
          className="gap-1 pr-1"
        >
          <span className="text-xs">
            {getFilterLabel(key)}: {value}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0.5 hover:bg-transparent"
            onClick={() => onRemoveFilter(key as keyof RolesFilters)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  )
}
