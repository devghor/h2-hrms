import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { userService } from '@/services/user.service'
import { type User, type UsersResponse } from './data/schema'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [usersData, setUsersData] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const params = {
        page: (search.page as number) || 1,
        per_page: (search.pageSize as number) || 10,
        name: (search.username as string) || undefined,
        from_date: (search.from_date as string) || undefined,
        to_date: (search.to_date as string) || undefined,
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
      setIsInitialLoad(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search.page, search.pageSize, search.username, search.from_date, search.to_date, search.sort_by, search.sort_order])

  const refreshUsers = () => {
    fetchUsers()
  }

  return (
    <UsersProvider refreshUsers={refreshUsers}>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>

        {error && (
          <div className='rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive'>
            {error}
          </div>
        )}

        <UsersTable
          data={usersData}
          totalCount={totalCount}
          search={search}
          navigate={navigate}
          isLoading={isInitialLoad && isLoading}
        />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
