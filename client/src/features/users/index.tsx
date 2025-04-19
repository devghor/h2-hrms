import { Main } from '@/components/layout/main'
import { PageBody } from '@/components/layout/page-body'
import { PageHeading } from '@/components/layout/page-heading'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import { userListSchema } from './data/schema'
import { users } from './data/users'

export default function Users() {
  // Parse user list
  const userList = userListSchema.parse(users)

  return (
    <Main>
      <PageHeading
        title='User List'
        description=' Manage your users and their roles here.'
        actions={<UsersPrimaryButtons />}
      />
      <PageBody>
        <UsersTable data={userList} columns={columns} />
      </PageBody>
      <UsersDialogs />
    </Main>
  )
}
