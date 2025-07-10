'use client';

import React from 'react';
import PageContainer from '@/components/layout/page-container';
import PageHeader from '@/components/layout/page-header';
import { useCan } from '@/components/providers/ability-provider';
import { useTranslations } from 'next-intl';
import RoleTable from './role-table';
import { useRoles } from '@/services/role';
import { Role } from './types';
import { columns } from './role-table/columns';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function RolePage() {
  const can = useCan();
  const t = useTranslations();

  const { data, isLoading } = useRoles();

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;
  }

  const roles: Role[] = data.data ?? [];
  const totalPage = data?.meta?.last_page;
  return (
    <PageContainer scrollable={false}>
      <PageHeader
        title={t('Roles')}
        description={t('Role managements')}
        actions={''}
      />
      <RoleTable data={roles} columns={columns} pageCount={totalPage} />
    </PageContainer>
  );
}
