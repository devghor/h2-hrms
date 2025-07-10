'use client';

import React from 'react';
import PageContainer from '@/components/layout/page-container';
import PageHeader from '@/components/layout/page-header';
import UserList from '@/features/uam/user/user-list';
import { CreateUserDialog } from '@/features/uam/user/create-user-dialog';
import { useCan } from '@/components/providers/ability-provider';
import { useTranslations } from 'next-intl';

export default function UserPage() {
  const can = useCan();
  const t = useTranslations();
  return (
    <PageContainer scrollable={false}>
      <PageHeader
        title={t('Users')}
        description={t('User managements')}
        actions={can('create:users') ? <CreateUserDialog /> : ''}
      />
      <UserList />
    </PageContainer>
  );
}
