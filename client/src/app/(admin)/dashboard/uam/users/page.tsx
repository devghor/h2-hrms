import React from 'react';
import PageContainer from '@/components/layout/page-container';
import PageHeader from '@/components/layout/page-header';
import UserList from '@/features/uam/user/user-list';
import { CreateUserDialog } from '@/features/uam/user/create-user-dialog';

export default async function Page() {
  return (
    <PageContainer scrollable={false}>
      <PageHeader
        title='Users'
        description='User managements'
        actions={<CreateUserDialog />}
      />
      <UserList />
    </PageContainer>
  );
}
