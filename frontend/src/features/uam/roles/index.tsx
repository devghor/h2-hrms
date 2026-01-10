import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { RolesTable } from './components/roles-table'
import { RolesActionDialog } from './components/roles-action-dialog'
import { RolesDeleteDialog } from './components/roles-delete-dialog'
import { type RolesFilters } from './components/roles-filters'
import { roleService } from '@/services/role.service'
import { type Role, type RolesResponse } from './data/schema'
import { ExportButton } from '@/components/export-button'

const route = getRouteApi('/_authenticated/uam/roles/')

type RolesDialogType = 'add' | 'edit' | 'delete'

export function Roles() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  
  // Data state
  const [rolesData, setRolesData] = useState<Role[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<RolesDialogType | null>(null)
  const [currentRow, setCurrentRow] = useState<Role | null>(null)

  // Filters state
  const [filters, setFilters] = useState<RolesFilters>({
    name: (search.name as string) || undefined,
    description: (search.description as string) || undefined,
    from_date: (search.from_date as string) || undefined,
    to_date: (search.to_date as string) || undefined,
  })

  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10

  const fetchRoles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const params = {
        page,
        per_page: pageSize,
        name: filters.name || undefined,
        description: filters.description || undefined,
        from_date: filters.from_date || undefined,
        to_date: filters.to_date || undefined,
        sort_by: (search.sort_by as string) || undefined,
        sort_order: (search.sort_order as 'asc' | 'desc') || undefined,
      }
      const response: RolesResponse = await roleService.getRoles(params)
      setRolesData(response.data)
      setTotalCount(response.meta.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roles')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [page, pageSize, filters.name, filters.description, filters.from_date, filters.to_date, search.sort_by, search.sort_order])

  // Sync URL search params with filters state
  useEffect(() => {
    const newFilters: RolesFilters = {
      name: (search.name as string) || undefined,
      description: (search.description as string) || undefined,
      from_date: (search.from_date as string) || undefined,
      to_date: (search.to_date as string) || undefined,
    }
    setFilters(newFilters)
  }, [search.name, search.description, search.from_date, search.to_date])

  const refreshRoles = () => {
    fetchRoles()
  }

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      search: (prev) => ({ ...prev, pageSize: newPageSize, page: 1 }),
    })
  }

  const handleFiltersChange = (newFilters: RolesFilters) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = (appliedFilters: RolesFilters) => {
    navigate({
      search: (prev) => ({
        ...prev,
        name: appliedFilters.name || undefined,
        description: appliedFilters.description || undefined,
        from_date: appliedFilters.from_date || undefined,
        to_date: appliedFilters.to_date || undefined,
        page: 1,
      }),
    })
  }

  const handleSort = (columnId: string, direction: 'asc' | 'desc') => {
    navigate({
      search: (prev) => ({ ...prev, sort_by: columnId, sort_order: direction, page: 1 }),
    })
  }

  return (
    <>
      <Main>
        <PageHeader
          title='Role List'
          description='Manage system roles and their permissions here.'
          action={
            <div className='flex gap-2'>
              <ExportButton
                exportFn={() => roleService.exportRoles({
                  search: filters.name || filters.description || undefined,
                })}
                filenamePrefix='roles'
                successMessage='Roles exported successfully'
                errorMessage='Failed to export roles'
              />
              <Button onClick={() => setDialogOpen('add')}>
                <Plus className='mr-2 h-4 w-4' />
                Add Role
              </Button>
            </div>
          }
        />

        {error && (
          <div className='rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive'>
            {error}
          </div>
        )}

        <RolesTable
          data={rolesData}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSort={handleSort}
          sortBy={(search.sort_by as string) || undefined}
          sortOrder={(search.sort_order as 'asc' | 'desc') || undefined}
          isLoading={isLoading}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
          onRefresh={refreshRoles}
          onEdit={(role) => {
            setCurrentRow(role)
            setDialogOpen('edit')
          }}
          onDelete={(role) => {
            setCurrentRow(role)
            setDialogOpen('delete')
          }}
        />
      </Main>

      {/* Dialogs */}
      <RolesActionDialog
        key={dialogOpen === 'add' || dialogOpen === 'edit' ? 'action' : undefined}
        open={dialogOpen === 'add' || dialogOpen === 'edit'}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(null)
            setCurrentRow(null)
          }
        }}
        currentRow={currentRow}
        onSuccess={refreshRoles}
      />

      <RolesDeleteDialog
        open={dialogOpen === 'delete'}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(null)
            setCurrentRow(null)
          }
        }}
        role={currentRow}
        onSuccess={refreshRoles}
      />
    </>
  )
}
