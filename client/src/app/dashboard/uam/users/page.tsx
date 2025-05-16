import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import PostList from '@/features/blog/post-list';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { SearchParams } from 'nuqs';
import { searchParamsCache } from '@/lib/searchparams';
import PageHeader from '@/components/layout/page-header';

export const metadata = {
  title: 'Dashboard: Products'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  return (
    <PageContainer scrollable={false}>
      <PageHeader title='Users' description='User managements' />
    </PageContainer>
  );
}
