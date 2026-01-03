import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { UsersTable } from './components/users-table'
import { UsersActionDialog } from './components/users-action-dialog'
import { UsersDeleteDialog } from './components/users-delete-dialog'
import { type UsersFilters } from './components/users-filters'
import { userService } from '@/services/user.service'
import { type User, type UsersResponse } from './data/schema'

const route = getRouteApi('/_authenticated/users/')

type UsersDialogType = 'add' | 'edit' | 'delete'

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  
  // Data state
  const [usersData, setUsersData] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<UsersDialogType | null>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  // Filters state
  const [filters, setFilters] = useState<UsersFilters>({
    ulid: (search.ulid as string) || undefined,
    name: (search.name as string) || undefined,
    email: (search.email as string) || undefined,
    tenant_id: (search.tenant_id as string) || undefined,
    from_date: (search.from_date as string) || undefined,
    to_date: (search.to_date as string) || undefined,
  })

  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const params = {
        page,
        per_page: pageSize,
        ulid: filters.ulid || undefined,
        name: filters.name || undefined,
        email: filters.email || undefined,
        tenant_id: filters.tenant_id || undefined,
        from_date: filters.from_date || undefined,
        to_date: filters.to_date || undefined,
        sort_by: (search.sort_by as string) || undefined,
        sort_order: (search.sort_order as 'asc' | 'desc') || undefined,
      }
      const response: UsersResponse = await userService.getUsers(params)
      setUsersData(response.data)
      setTotalCount(response.meta.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, pageSize, filters.ulid, filters.name, filters.email, filters.tenant_id, filters.from_date, filters.to_date, search.sort_by, search.sort_order])

  // Sync URL search params with filters state
  useEffect(() => {
    const newFilters: UsersFilters = {
      ulid: (search.ulid as string) || undefined,
      name: (search.name as string) || undefined,
      email: (search.email as string) || undefined,
      tenant_id: (search.tenant_id as string) || undefined,
      from_date: (search.from_date as string) || undefined,
      to_date: (search.to_date as string) || undefined,
    }
    setFilters(newFilters)
  }, [search.ulid, search.name, search.email, search.tenant_id, search.from_date, search.to_date])

  const refreshUsers = () => {
    fetchUsers()
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

  const handleFiltersChange = (newFilters: UsersFilters) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = (appliedFilters: UsersFilters) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ulid: appliedFilters.ulid || undefined,
        name: appliedFilters.name || undefined,
        email: appliedFilters.email || undefined,
        tenant_id: appliedFilters.tenant_id || undefined,
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
          title='User List'
          description='Manage your users and their roles here.'
          action={
            <Button onClick={() => setDialogOpen('add')}>
              <Plus className='mr-2 h-4 w-4' />
              Add User
            </Button>
          }
        />

        {error && (
          <div className='rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive'>
            {error}
          </div>
        )}

        <UsersTable
          data={usersData}
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
          onRefresh={refreshUsers}
          onEdit={(user) => {
            setCurrentRow(user)
            setDialogOpen('edit')
          }}
          onDelete={(user) => {
            setCurrentRow(user)
            setDialogOpen('delete')
          }}
        />
      </Main>

      {/* Dialogs */}
      <UsersActionDialog
        key={dialogOpen === 'add' || dialogOpen === 'edit' ? 'action' : undefined}
        open={dialogOpen === 'add' || dialogOpen === 'edit'}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(null)
            setCurrentRow(null)
          }
        }}
        currentRow={currentRow}
        onSuccess={refreshUsers}
      />

      <UsersDeleteDialog
        open={dialogOpen === 'delete'}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(null)
            setCurrentRow(null)
          }
        }}
        user={currentRow}
        onSuccess={refreshUsers}
      />
    </>
  )
}
