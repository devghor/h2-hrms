import React from 'react';
import PageContainer from '@/components/layout/page-container';
import PageHeader from '@/components/layout/page-header';
import UserList from '@/features/uam/user/user-list';
import { CreateUserDialog } from '@/features/uam/user/create-user-dialog';
import { auth } from '@/lib/auth';
import { createAbilityFromPermissions } from '@/lib/casl/ability';

export default async function Page() {
  const session = await auth();
  const ability = createAbilityFromPermissions(session?.user.permissions!);

  return (
    <PageContainer scrollable={false}>
      <PageHeader
        title='Users'
        description='User managements'
        actions={ability.can('create:users', '') ? <CreateUserDialog /> : ''}
      />
      <UserList />
    </PageContainer>
  );
}
